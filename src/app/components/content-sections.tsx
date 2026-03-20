import { useState, useEffect } from 'react';
import { UserType } from '../pages/landing-page';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { FilmstripTimeline } from './filmstrip-timeline';
import { ViewerOverlay } from './viewer-overlay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { textStyleToCSS } from './admin/landing-page-editor';
import type { TextStyle } from './admin/landing-page-editor';

interface ContentSectionsProps {
  userType: UserType;
  journeyImage: string;
  creditsImage: string;
  embedded?: boolean; // When true, uses absolute positioning instead of fixed (for admin preview)
}

type ContentSection = 
  | 'studio-demo' 
  | 'dashboard-demo' 
  | 'camera-overlay-demo'
  | 'beta-info' 
  | 'parent-educator-info' 
  | 'investor-info' 
  | 'general-info'
  | 'custom-html'
  | 'custom-embed';

interface EmbedConfig {
  type: 'iframe' | 'html' | 'markdown';
  url?: string;
  htmlContent?: string;
  title?: string;
  description?: string;
  height?: string;
  allowFullscreen?: boolean;
  layout?: {
    scale?: number;
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    maxWidth?: string;
    maxHeight?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  };
}

function getSectionTitle(section: ContentSection): string {
  const titles: Record<string, string> = {
    'studio-demo': 'Frame Game Studio',
    'dashboard-demo': 'Teacher Dashboard',
    'camera-overlay-demo': 'Camera Overlays',
    'beta-info': 'Beta Program',
    'parent-educator-info': 'For Parents & Educators',
    'investor-info': 'Investment Opportunity',
    'general-info': 'Getting Started'
  };
  return titles[section] || section;
}

interface LayoutConfig {
  scale?: number;
  horizontalAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
  maxWidth?: string;
  maxHeight?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  padding?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  borderRadius?: string;
  customCss?: string;
  // New layout fields for slide sizing
  cardWidth?: number; // percentage 30-100
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '21:9';
  cardPadding?: number; // px
}

interface SectionData {
  type: ContentSection;
  title: string;
  customContent?: string;
  embedUrl?: string;
  layout?: LayoutConfig;
  editableContent?: {
    heading?: string;
    subheading?: string;
    bodyText?: string;
    bulletPoints?: string[];
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
    embedUrl?: string;
    headingStyle?: TextStyle;
    subheadingStyle?: TextStyle;
    bodyStyle?: TextStyle;
    bulletTitleStyle?: TextStyle;
    ctaStyle?: TextStyle;
  };
}

export function ContentSections({ userType, journeyImage, creditsImage, embedded = false }: ContentSectionsProps) {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [embedConfigs, setEmbedConfigs] = useState<Record<string, EmbedConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    fetchAccessControl();
    fetchEmbedConfigs();
  }, [userType]);

  const handleSectionChange = (index: number) => {
    // Cyclic navigation: wrap around
    if (index < 0) {
      setCurrentSectionIndex(sections.length - 1);
    } else if (index >= sections.length) {
      setCurrentSectionIndex(0);
    } else {
      setCurrentSectionIndex(index);
    }
  };

  const fetchAccessControl = async () => {
    try {
      // First fetch the section configuration to see what's available
      const sectionsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/sections/public`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      let availableSections: SectionData[] = [];
      
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        const sectionConfigs = sectionsData.sections || [];
        
        // Filter sections: only enabled ones, visible to current user type, and ordered
        const filteredSections = sectionConfigs
          .filter((s: any) => s.enabled)
          .filter((s: any) => !s.visibleTo || s.visibleTo.length === 0 || s.visibleTo.includes(userType))
          .sort((a: any, b: any) => a.order - b.order)
          .map((s: any) => ({
            type: s.type,
            title: s.title,
            customContent: s.customContent,
            embedUrl: s.embedUrl,
            layout: s.layout,
            editableContent: s.editableContent,
          }));
        
        if (filteredSections.length > 0) {
          availableSections = filteredSections;
        }
      }

      // If no section config exists, fall back to access control
      if (availableSections.length === 0) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/access-control`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const sectionTypes = data.config[userType as string] || ['general-info'];
          availableSections = sectionTypes.map((type: ContentSection) => ({
            type,
            title: getSectionTitle(type),
          }));
        } else {
          availableSections = [{
            type: 'general-info',
            title: 'Getting Started',
          }];
        }
      }

      setSections(availableSections);
    } catch (error) {
      console.error('Error fetching access control:', error);
      setSections([{
        type: 'general-info',
        title: 'Getting Started',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmbedConfigs = async () => {
    try {
      const responses = await Promise.all(
        ['studio-demo', 'dashboard-demo', 'camera-overlay-demo', 'beta-info', 'parent-educator-info', 'investor-info', 'general-info'].map(
          section => fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/embeds/${section}`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
              },
            }
          )
        )
      );

      const configs: Record<string, EmbedConfig> = {};
      const data = await Promise.all(responses.map(r => r.json()));
      
      data.forEach((d, idx) => {
        const section = ['studio-demo', 'dashboard-demo', 'camera-overlay-demo', 'beta-info', 'parent-educator-info', 'investor-info', 'general-info'][idx];
        if (d.config) {
          configs[section] = d.config;
        }
      });

      setEmbedConfigs(configs);
    } catch (error) {
      console.error('Error fetching embed configs:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Loading Timeline...
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSectionIndex];

  return (
    <div className={`${embedded ? 'absolute' : 'fixed'} inset-0 bg-gray-900 flex flex-col`}>
      {/* Top Navigation Bar — slim */}
      <div className="bg-gray-950 border-b border-gray-800 px-3 py-1 flex items-center justify-between z-50 flex-shrink-0">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all shadow-lg"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-white font-bold text-xs" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Menu
          </span>
        </button>

        <div className="text-white text-xs font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          The Frame Game
        </div>
        
        <div className="text-gray-400 text-xs" style={{ fontFamily: 'Comic Neue, cursive' }}>
          <span className="text-purple-400 font-bold">{getUserTypeLabel(userType)}</span>
        </div>
      </div>

      {/* ─── Main Viewer Area — takes maximum space ─── */}
      <div className="flex-1 overflow-hidden bg-gray-900 relative">
        <ViewerOverlay 
          currentSection={currentSectionIndex}
          totalSections={sections.length}
          sectionTitle={currentSectionData?.title || 'Content'}
        />

        {/* Welcome Banner for first section */}
        {currentSectionIndex === 0 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-2xl text-center"
            >
              <h1 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to The Frame Game! 🎬
                </span>
              </h1>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Viewing as <span className="font-bold text-purple-600">{getUserTypeLabel(userType)}</span>
              </p>
            </motion.div>
          </div>
        )}

        {/* ── Slide Display: one slide at a time, centered ── */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          {sections.map((sectionData, index) => {
            const isCenter = index === currentSectionIndex;
            const layout = sectionData.layout || {};
            const cardW = layout.cardWidth || 85;  // default 85% width
            const ar = layout.aspectRatio || 'auto';
            const padPx = layout.cardPadding ?? 16;
            const hAlign = layout.horizontalAlign || 'center';
            const vAlign = layout.verticalAlign || 'center';
            const scalePct = layout.scale || 100;

            // Alignment classes for the flex container
            const hCls = hAlign === 'left' ? 'justify-start' : hAlign === 'right' ? 'justify-end' : 'justify-center';
            const vCls = vAlign === 'top' ? 'items-start' : vAlign === 'bottom' ? 'items-end' : 'items-center';

            // Aspect ratio CSS value
            const arValue = ar === '16:9' ? '16/9' : ar === '4:3' ? '4/3' : ar === '1:1' ? '1/1' : ar === '21:9' ? '21/9' : undefined;

            return (
              <motion.div
                key={index}
                className={`absolute inset-0 flex ${vCls} ${hCls} p-4 md:p-6`}
                initial={false}
                animate={{
                  opacity: isCenter ? 1 : 0,
                  scale: isCenter ? 1 : 0.9,
                  x: isCenter ? 0 : index < currentSectionIndex ? -60 : 60,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{ pointerEvents: isCenter ? 'auto' : 'none', zIndex: isCenter ? 10 : 0 }}
              >
                <div
                  className="overflow-auto rounded-2xl"
                  style={{
                    width: `${cardW}%`,
                    maxWidth: '1400px',
                    maxHeight: '100%',
                    ...(arValue ? { aspectRatio: arValue } : {}),
                    padding: `${padPx}px`,
                    transform: `scale(${scalePct / 100})`,
                    transformOrigin: `${hAlign} ${vAlign}`,
                    backgroundColor: layout.backgroundColor || undefined,
                    borderRadius: layout.borderRadius || undefined,
                  }}
                >
                  {renderSection(sectionData, journeyImage, creditsImage, embedConfigs[sectionData.type])}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Left/Right click zones for navigation */}
        <button
          onClick={() => handleSectionChange(currentSectionIndex - 1)}
          className="absolute left-0 top-0 bottom-0 w-12 z-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-black/30 to-transparent"
        >
          <ChevronLeft className="w-6 h-6 text-white/70" />
        </button>
        <button
          onClick={() => handleSectionChange(currentSectionIndex + 1)}
          className="absolute right-0 top-0 bottom-0 w-12 z-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-l from-black/30 to-transparent"
        >
          <ChevronRight className="w-6 h-6 text-white/70" />
        </button>
      </div>

      {/* ─── Timeline at Bottom ─── */}
      <FilmstripTimeline
        sections={sections.map(s => s.type)}
        currentSection={currentSectionIndex}
        onSectionChange={handleSectionChange}
        sectionTitles={sections.map(s => s.title)}
      />
    </div>
  );
}

function renderSection(sectionData: SectionData, journeyImage: string, creditsImage: string, embedConfig?: EmbedConfig) {
  const { type: section, customContent, embedUrl, layout: sectionLayout, editableContent } = sectionData;
  
  // Use section layout or embedConfig layout
  const layout = sectionLayout || embedConfig?.layout;

  // Handle custom HTML sections
  if (section === 'custom-html' && customContent) {
    const wrappedContent = (
      <div 
        className="w-full h-full overflow-auto"
        dangerouslySetInnerHTML={{ __html: customContent }}
      />
    );
    if (layout) return applyLayoutWrapper(wrappedContent, layout);
    return wrappedContent;
  }

  // Handle custom embed sections
  if (section === 'custom-embed' && embedUrl) {
    const embedContent = (
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </div>
    );
    if (layout) return applyLayoutWrapper(embedContent, layout);
    return embedContent;
  }

  // For built-in section types — always render with the unified card renderer
  // which respects editableContent overrides and falls back to defaults
  const card = <UnifiedSectionCard sectionType={section} editableContent={editableContent} />;
  if (layout) return applyLayoutWrapper(card, layout);
  return card;
}

// ─── Default content for each built-in section type ───
const DEFAULT_CONTENT: Record<string, { heading: string; subheading: string; bodyText: string; ctaText?: string }> = {
  'studio-demo': {
    heading: 'Frame Game Studio',
    subheading: 'Our powerful yet simple editing interface makes video creation fun and accessible for everyone!',
    bodyText: '✂️ Intuitive Editing — Trim, split, and arrange clips with ease\n🎨 Creative Filters — Apply stunning effects and color grading\n🎵 Audio Tools — Add music, sound effects, and voiceovers\n✨ AI Assistance — Smart suggestions for better storytelling',
  },
  'dashboard-demo': {
    heading: 'Teacher & Student Dashboard',
    subheading: 'Track progress, manage assignments, and showcase student work — all in one place.',
    bodyText: '✅ Assignment Tracking — Create and manage film projects\n📈 Progress Reports — See how students are improving\n🏆 Showcases — Highlight the best student work\n👥 Collaboration — Students can work together in real time',
  },
  'camera-overlay-demo': {
    heading: 'Camera Overlay System',
    subheading: 'Interactive on-screen guides that teach students professional framing techniques while they shoot.',
    bodyText: '📏 Rule of Thirds grid overlay\n🎯 Focus point guides\n📐 Horizon leveling\n🎬 Shot composition tips in real time',
  },
  'beta-info': {
    heading: 'Join Our Beta Program',
    subheading: 'Be among the first to experience Frame Game and help shape the future of arts education.',
    bodyText: '⚡ Early Access — Be the first to try Frame Game Studio\n🎁 Exclusive Rewards — Compete for cash prizes and recognition\n✨ Shape the Future — Your feedback directly influences development',
    ctaText: 'Sign Up for Beta',
  },
  'parent-educator-info': {
    heading: 'For Parents & Educators',
    subheading: 'Empower the next generation of storytellers with professional-grade tools designed for learning.',
    bodyText: '📚 Curriculum-aligned lesson plans\n🛡️ Safe, moderated environment\n📊 Progress tracking dashboards\n🤝 Teacher-parent communication tools',
  },
  'investor-info': {
    heading: 'Investment Opportunity',
    subheading: 'Join us in revolutionizing arts education through innovative technology.',
    bodyText: '🎯 $1.2B Market — Arts education market growing 15% annually\n👥 10M+ Creators — Gen Z content creators seeking skill development\n📊 40% Engagement Boost — Gamification drives retention in edtech\n🚀 Scalable Platform — Cloud-based, global scale\n💰 Multiple Revenue Streams — Subscriptions, partnerships, licensing',
    ctaText: 'Request Pitch Deck',
  },
  'general-info': {
    heading: 'About The Frame Game',
    subheading: 'Transforming passive screen time into active creation!',
    bodyText: '🎬 Learn — Master filmmaking through fun, guided tutorials\n🚀 Create — Bring your stories to life with powerful, easy-to-use tools\n🏆 Earn — Compete for prizes, recognition, and real-world opportunities',
  },
};

const SECTION_THEME: Record<string, { bg: string; text: string }> = {
  'studio-demo': { bg: 'from-purple-100 to-indigo-100', text: 'from-purple-600 to-indigo-600' },
  'dashboard-demo': { bg: 'from-blue-100 to-cyan-100', text: 'from-blue-600 to-cyan-600' },
  'camera-overlay-demo': { bg: 'from-pink-100 to-rose-100', text: 'from-pink-600 to-rose-600' },
  'beta-info': { bg: 'from-yellow-100 to-orange-100', text: 'from-yellow-600 to-orange-600' },
  'parent-educator-info': { bg: 'from-green-100 to-teal-100', text: 'from-green-600 to-teal-600' },
  'investor-info': { bg: 'from-emerald-100 to-green-100', text: 'from-emerald-600 to-green-600' },
  'general-info': { bg: 'from-purple-100 to-pink-100', text: 'from-purple-600 to-pink-600' },
};

function UnifiedSectionCard({ sectionType, editableContent }: { sectionType: ContentSection; editableContent?: SectionData['editableContent'] }) {
  const theme = SECTION_THEME[sectionType] || { bg: 'from-purple-100 to-pink-100', text: 'from-purple-600 to-pink-600' };
  const defaults = DEFAULT_CONTENT[sectionType];
  const ec = editableContent || {};

  // Text style CSS
  const headingCSS: React.CSSProperties = ec.headingStyle ? textStyleToCSS(ec.headingStyle) : { fontFamily: 'Fredoka, sans-serif' };
  const subheadingCSS: React.CSSProperties = ec.subheadingStyle ? textStyleToCSS(ec.subheadingStyle) : { fontFamily: 'Comic Neue, cursive' };
  const bodyCSS: React.CSSProperties = ec.bodyStyle ? textStyleToCSS(ec.bodyStyle) : { fontFamily: 'Comic Neue, cursive' };
  const bulletTitleCSS: React.CSSProperties = ec.bulletTitleStyle ? textStyleToCSS(ec.bulletTitleStyle) : { fontFamily: 'Fredoka, sans-serif', fontWeight: 700 };
  const ctaCSS: React.CSSProperties = ec.ctaStyle ? textStyleToCSS(ec.ctaStyle) : { fontFamily: 'Fredoka, sans-serif' };

  // If embed URL override, show iframe
  if (ec.embedUrl) {
    return (
      <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col`}>
        {(ec.heading || defaults?.heading) && (
          <div className="p-5 flex-shrink-0">
            <h2 className="text-2xl" style={headingCSS}>
              {!ec.headingStyle ? (
                <span className={`bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}>{ec.heading || defaults?.heading}</span>
              ) : (ec.heading || defaults?.heading)}
            </h2>
            {(ec.subheading || defaults?.subheading) && (
              <p className="text-sm mt-1" style={subheadingCSS}>{ec.subheading || defaults?.subheading}</p>
            )}
          </div>
        )}
        <div className="flex-1 min-h-[300px]">
          <iframe src={ec.embedUrl} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        </div>
      </div>
    );
  }

  const heading = ec.heading || defaults?.heading || '';
  const subheading = ec.subheading || defaults?.subheading || '';
  const bodyText = ec.bodyText || defaults?.bodyText || '';
  const ctaText = ec.ctaText || defaults?.ctaText || '';
  const ctaUrl = ec.ctaUrl || '';
  const imageUrl = ec.imageUrl || '';

  const bodyLines = bodyText.split('\n').filter((l: string) => l.trim());

  return (
    <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-6 md:p-8 shadow-2xl h-full max-h-full overflow-auto flex flex-col`}>
      {heading && (
        <h2 className="text-2xl md:text-3xl mb-2 text-center flex-shrink-0" style={headingCSS}>
          {!ec.headingStyle ? (
            <span className={`bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}>{heading}</span>
          ) : heading}
        </h2>
      )}
      {subheading && (
        <p className="text-sm md:text-base text-center mb-5 flex-shrink-0" style={subheadingCSS}>
          {subheading}
        </p>
      )}
      {imageUrl && (
        <div className="mb-5 flex-shrink-0 flex justify-center">
          <img src={imageUrl} alt="" className="max-h-48 md:max-h-64 rounded-2xl shadow-lg object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      {bodyLines.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-5 space-y-2.5 flex-shrink-0">
          {bodyLines.map((line: string, i: number) => {
            const emojiMatch = line.match(/^(\p{Extended_Pictographic}+)\s*(.*)/u);
            if (emojiMatch) {
              const [, emoji, rest] = emojiMatch;
              const dashIdx = rest.indexOf(' \u2014 ');
              const dashIdx2 = rest.indexOf(' - ');
              const splitIdx = dashIdx >= 0 ? dashIdx : dashIdx2 >= 0 ? dashIdx2 : -1;
              const sep = dashIdx >= 0 ? ' \u2014 ' : ' - ';
              if (splitIdx >= 0) {
                const title = rest.substring(0, splitIdx);
                const desc = rest.substring(splitIdx + sep.length);
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{emoji}</span>
                    <div>
                      <span className="text-sm" style={bulletTitleCSS}>{title}</span>
                      <span className="text-sm" style={bodyCSS}> &mdash; {desc}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{emoji}</span>
                  <span className="text-sm" style={bodyCSS}>{rest}</span>
                </div>
              );
            }
            return <p key={i} className="text-sm" style={bodyCSS}>{line}</p>;
          })}
        </div>
      )}
      {ctaText && (
        <div className="text-center mt-auto pt-4 flex-shrink-0">
          {ctaUrl ? (
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
              className={`inline-block px-8 py-3 bg-gradient-to-r ${theme.text} rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105`}
              style={ctaCSS}>
              {ctaText}
            </a>
          ) : (
            <span className={`inline-block px-8 py-3 bg-gradient-to-r ${theme.text} rounded-full shadow-lg`}
              style={ctaCSS}>
              {ctaText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function applyLayoutWrapper(content: React.ReactNode, layout: LayoutConfig) {
  // Layout is now primarily handled at the viewer level (in ContentSections).
  // This wrapper only adds extra style overrides for embed/custom sections.
  return (
    <div className="w-full h-full">
      {content}
    </div>
  );
}

function CustomEmbedSection({ config }: { config: EmbedConfig }) {
  const layout = config.layout || {};
  const scale = layout.scale || 100;
  const horizontalAlign = layout.horizontalAlign || 'center';
  const verticalAlign = layout.verticalAlign || 'center';
  const maxWidth = layout.maxWidth || '100%';
  const maxHeight = layout.maxHeight || '100%';
  const objectFit = layout.objectFit || 'contain';

  const alignmentClasses = {
    horizontal: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
    vertical: {
      top: 'items-start',
      center: 'items-center',
      bottom: 'items-end',
    },
  };

  return (
    <div className={`bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col ${alignmentClasses.vertical[verticalAlign]} ${alignmentClasses.horizontal[horizontalAlign]}`}>
      {config.title && (
        <h2 
          className="text-2xl md:text-3xl font-bold mb-2 flex-shrink-0 w-full text-center"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {config.title}
          </span>
        </h2>
      )}
      
      {config.description && (
        <p className="text-sm md:text-base text-gray-700 mb-3 flex-shrink-0 w-full text-center" style={{ fontFamily: 'Comic Neue, cursive' }}>
          {config.description}
        </p>
      )}

      <div 
        className="bg-white rounded-2xl p-2 shadow-lg overflow-hidden flex items-center justify-center"
        style={{
          maxWidth,
          maxHeight,
          width: objectFit === 'fill' ? '100%' : 'auto',
          height: objectFit === 'fill' ? '100%' : 'auto',
        }}
      >
        <div
          style={{
            transform: `scale(${scale / 100})`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
          }}
        >
          {config.type === 'iframe' && config.url && (
            <iframe
              src={config.url}
              className="w-full h-full rounded-xl border-0"
              style={{
                objectFit: objectFit as any,
              }}
              allowFullScreen={config.allowFullscreen}
              title={config.title || 'Embedded Content'}
            />
          )}

          {config.type === 'html' && config.htmlContent && (
            <div
              className="w-full h-full rounded-xl p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: config.htmlContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function getUserTypeLabel(type: UserType): string {
  switch (type) {
    case 'filmmaker': return 'Filmmaker';
    case 'parent': return 'Parent';
    case 'educator': return 'Educator';
    case 'teen': return 'Teen';
    case 'investor': return 'Investor';
    case 'donor': return 'Donor';
    case 'just-curious': return 'Explorer';
    default: return 'Member';
  }
}