import { useState, useEffect } from 'react';
import { UserType } from '../pages/landing-page';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { FilmstripTimeline } from './filmstrip-timeline';
import { ViewerOverlay } from './viewer-overlay';
import { LearnMoreSlide, LearnMoreConfig } from './learn-more-slide';
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react';
import { textStyleToCSS } from './admin/landing-page-editor';
import type { TextStyle } from './admin/landing-page-editor';
import { useNavigate } from 'react-router';

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
  | 'custom-embed'
  | 'custom-canvas';

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
    ctaLinkType?: 'external' | 'internal' | 'scroll' | 'slide'; // New: type of link
    imageUrl?: string;
    embedUrl?: string;
    headingStyle?: TextStyle;
    subheadingStyle?: TextStyle;
    bodyStyle?: TextStyle;
    bulletTitleStyle?: TextStyle;
    ctaStyle?: TextStyle;
    canvasImages?: Array<{
      id: string;
      url: string;
      x: number;
      y: number;
      width: number;
      height: number;
      rotation?: number;
      zIndex?: number;
      objectFit?: 'contain' | 'cover' | 'fill' | 'none';
    }>;
    canvasBackgroundColor?: string;
    pdfUrl?: string;
  };
}

export function ContentSections({ userType, journeyImage, creditsImage, embedded = false }: ContentSectionsProps) {
  const [defaultSections, setDefaultSections] = useState<SectionData[]>([]);
  const [allAvailableSections, setAllAvailableSections] = useState<SectionData[]>([]);
  const [embedConfigs, setEmbedConfigs] = useState<Record<string, EmbedConfig>>({});
  const [learnMoreConfig, setLearnMoreConfig] = useState<LearnMoreConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessControl();
    fetchEmbedConfigs();
    fetchLearnMoreConfig();
  }, [userType]);

  const handleSectionChange = (index: number) => {
    // Cyclic navigation: wrap around
    if (index < 0) {
      setCurrentSectionIndex(totalSlides - 1);
    } else if (index >= totalSlides) {
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
      let allSections: SectionData[] = [];
      
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        const sectionConfigs = sectionsData.sections || [];
        
        // Map ALL enabled sections (for Learn More menu)
        allSections = sectionConfigs
          .filter((s: any) => s.enabled)
          .map((s: any) => ({
            type: s.type,
            title: s.title,
            customContent: s.customContent,
            embedUrl: s.embedUrl,
            layout: s.layout,
            editableContent: s.editableContent,
          }));
        
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
          
          // For fallback, create all sections
          const allTypes: ContentSection[] = ['studio-demo', 'dashboard-demo', 'camera-overlay-demo', 'beta-info', 'parent-educator-info', 'investor-info', 'general-info'];
          allSections = allTypes.map((type: ContentSection) => ({
            type,
            title: getSectionTitle(type),
          }));
        } else {
          availableSections = [{
            type: 'general-info',
            title: 'Getting Started',
          }];
          allSections = [{
            type: 'general-info',
            title: 'Getting Started',
          }];
        }
      }

      setDefaultSections(availableSections);
      // Remove duplicates from allSections by using a Map
      const uniqueAllSections = Array.from(
        new Map(allSections.map(s => [s.type, s])).values()
      );
      setAllAvailableSections(uniqueAllSections.length > 0 ? uniqueAllSections : availableSections);
    } catch (error) {
      console.error('Error fetching access control:', error);
      setDefaultSections([{
        type: 'general-info',
        title: 'Getting Started',
      }]);
      setAllAvailableSections([{
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

  const fetchLearnMoreConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/learn-more-config`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLearnMoreConfig(data.config);
      } else {
        setLearnMoreConfig(null);
      }
    } catch (error) {
      console.error('Error fetching learn more config:', error);
      setLearnMoreConfig(null);
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

  // Construct sections: default sections + Learn More slide + added sections
  const allSections = [...defaultSections];
  const learnMoreIndex = defaultSections.length; // Learn More slide position
  const totalSlides = allSections.length + 1; // +1 for Learn More slide
  
  const currentSectionData = allSections[currentSectionIndex];
  const isLearnMoreSlide = currentSectionIndex === learnMoreIndex;

  return (
    <div className={`${embedded ? 'absolute' : 'fixed'} inset-0 bg-gray-900 flex flex-col`}>
      {/* Top Navigation Bar — slim (hidden in fullscreen) */}
      {!isFullscreen && (
        <div className="bg-gray-950 border-b border-gray-800 px-3 py-1 flex items-center justify-between z-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all shadow-lg"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-white font-bold text-xs" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Contact
              </span>
            </button>
            <button
              onClick={() => {
                navigate('/explore');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all shadow-lg"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-white font-bold text-xs" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Explore
              </span>
            </button>
          </div>

          <div className="text-white text-xs font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            The Frame Game
          </div>
          
          <div className="text-gray-400 text-xs" style={{ fontFamily: 'Comic Neue, cursive' }}>
            <span className="text-purple-400 font-bold">{getUserTypeLabel(userType)}</span>
          </div>
        </div>
      )}

      {/* ─── Main Viewer Area — takes maximum space ─── */}
      <div className="flex-1 overflow-hidden bg-gray-900 relative">
        {!isFullscreen && (
          <ViewerOverlay 
            currentSection={currentSectionIndex}
            totalSections={totalSlides}
            sectionTitle={isLearnMoreSlide ? 'Explore More' : (currentSectionData?.title || 'Content')}
          />
        )}

        {/* ── Filmstrip Carousel OR Fullscreen View ── */}
        {!isFullscreen ? (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              const threshold = 100;
              if (info.offset.x > threshold) {
                handleSectionChange(currentSectionIndex - 1);
              } else if (info.offset.x < -threshold) {
                handleSectionChange(currentSectionIndex + 1);
              }
            }}
          >
            <div className="flex items-center justify-center h-full gap-4 md:gap-8">
              {Array.from({ length: totalSlides }).map((_, index) => {
                const offset = index - currentSectionIndex;
                const isCenter = offset === 0;
                const isPrev = offset === -1;
                const isNext = offset === 1;
                const isVisible = Math.abs(offset) <= 1;

                if (!isVisible) return null;

                // Check if this is the Learn More slide
                const isThisLearnMoreSlide = index === learnMoreIndex;
                const sectionData = isThisLearnMoreSlide ? null : allSections[index];

                const layout = sectionData?.layout || {};
                const cardW = layout.cardWidth || 85;
                const ar = layout.aspectRatio || 'auto';
                const padPx = layout.cardPadding ?? 16;
                const hAlign = layout.horizontalAlign || 'center';
                const vAlign = layout.verticalAlign || 'center';
                const scalePct = layout.scale || 100;

                // Aspect ratio CSS value
                const arValue = ar === '16:9' ? '16/9' : ar === '4:3' ? '4/3' : ar === '1:1' ? '1/1' : ar === '21:9' ? '21/9' : undefined;

                // Calculate positioning and effects for filmstrip
                let xOffset = 0;
                let scale = 1;
                let blur = 0;
                let opacity = 1;
                let zIndex = 10;
                
                if (isCenter) {
                  xOffset = 0;
                  scale = 1;
                  blur = 0;
                  opacity = 1;
                  zIndex = 20;
                } else if (isPrev) {
                  xOffset = -70; // percentage
                  scale = 0.75;
                  blur = 3;
                  opacity = 0.4;
                  zIndex = 10;
                } else if (isNext) {
                  xOffset = 70; // percentage
                  scale = 0.75;
                  blur = 3;
                  opacity = 0.4;
                  zIndex = 10;
                }

                return (
                  <motion.div
                    key={index}
                    className="absolute flex items-center justify-center"
                    initial={false}
                    animate={{
                      x: `${xOffset}%`,
                      scale,
                      opacity,
                      filter: `blur(${blur}px)`,
                    }}
                    transition={{ 
                      duration: 0.5, 
                      ease: [0.32, 0.72, 0, 1]
                    }}
                    style={{ 
                      pointerEvents: isCenter ? 'auto' : 'none',
                      zIndex,
                      width: '85%',
                      maxWidth: '1400px',
                      height: '90%',
                    }}
                  >
                    <div
                      className="overflow-hidden rounded-2xl shadow-2xl w-full h-full cursor-pointer relative group"
                      style={{
                        ...(arValue && !isThisLearnMoreSlide ? { aspectRatio: arValue } : {}),
                        padding: isThisLearnMoreSlide ? '0' : `${padPx}px`,
                        transform: isThisLearnMoreSlide ? 'scale(1)' : `scale(${scalePct / 100})`,
                        transformOrigin: `${hAlign} ${vAlign}`,
                        backgroundColor: isThisLearnMoreSlide ? '#1a1a2e' : (layout.backgroundColor || undefined),
                        borderRadius: layout.borderRadius || undefined,
                        border: isCenter ? '4px solid rgba(168, 85, 247, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onClick={() => {
                        if (!isCenter) {
                          // Navigate to adjacent slide
                          handleSectionChange(index);
                        }
                      }}
                    >
                      {isThisLearnMoreSlide ? (
                        <>
                          <LearnMoreSlide config={learnMoreConfig || undefined} />
                          
                          {/* Fullscreen Button Overlay - Only on Center Slide */}
                          {isCenter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreen(true);
                              }}
                              className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2.5 shadow-lg transition-opacity z-20 hover:scale-110"
                              title="Enter fullscreen"
                            >
                              <Maximize className="w-5 h-5 text-white" />
                            </button>
                          )}
                        </>
                      ) : sectionData ? (
                        <>
                          {renderSection(sectionData, journeyImage, creditsImage, embedConfigs[sectionData.type])}
                          
                          {/* Fullscreen Button Overlay - Only on Center Slide */}
                          {isCenter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreen(true);
                              }}
                              className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2.5 shadow-lg transition-opacity z-20 hover:scale-110"
                              title="Enter fullscreen"
                            >
                              <Maximize className="w-5 h-5 text-white" />
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ── Fullscreen View ── */
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFullscreen(false)}
          >
            <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
              <div className="w-full h-full max-w-7xl">
                {isLearnMoreSlide ? (
                  <LearnMoreSlide config={learnMoreConfig || undefined} />
                ) : currentSectionData ? (
                  renderSection(
                    currentSectionData,
                    journeyImage,
                    creditsImage,
                    embedConfigs[currentSectionData.type]
                  )
                ) : null}
              </div>
            </div>
            {/* Exit hint */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-xs flex items-center gap-2"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Tap to exit fullscreen
            </div>
          </motion.div>
        )}

        {/* Left/Right click zones for navigation (hidden in fullscreen) */}
        {!isFullscreen && (
          <>
            <button
              onClick={() => handleSectionChange(currentSectionIndex - 1)}
              className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-black/40 to-transparent"
            >
              <ChevronLeft className="w-8 h-8 text-white/90 drop-shadow-lg" />
            </button>
            <button
              onClick={() => handleSectionChange(currentSectionIndex + 1)}
              className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-l from-black/40 to-transparent"
            >
              <ChevronRight className="w-8 h-8 text-white/90 drop-shadow-lg" />
            </button>
          </>
        )}
      </div>

      {/* ─── Timeline at Bottom (hidden in fullscreen) ─── */}
      {!isFullscreen && (
        <FilmstripTimeline
          sections={[
            ...allSections.map(s => s.type),
            'general-info' as ContentSection // Learn More slide placeholder
          ]}
          currentSection={currentSectionIndex}
          onSectionChange={handleSectionChange}
          sectionTitles={[
            ...allSections.map(s => s.title),
            'Explore More' // Learn More slide title
          ]}
        />
      )}
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

  // Handle custom canvas sections
  if (section === 'custom-canvas') {
    const canvasContent = <CustomCanvasSection editableContent={editableContent} />;
    if (layout) return applyLayoutWrapper(canvasContent, layout);
    return canvasContent;
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
  const ctaLinkType = ec.ctaLinkType || 'external';
  const imageUrl = ec.imageUrl || '';

  const bodyLines = bodyText.split('\n').filter((l: string) => l.trim());

  // Helper function to handle button clicks based on link type
  const handleCtaClick = (e: React.MouseEvent) => {
    if (!ctaUrl) return;

    switch (ctaLinkType) {
      case 'external':
        // Opens in new tab
        window.open(ctaUrl, '_blank', 'noopener,noreferrer');
        e.preventDefault();
        break;
      case 'internal':
        // Navigate to internal page
        window.location.href = ctaUrl;
        e.preventDefault();
        break;
      case 'scroll':
        // Scroll to element with ID
        const element = document.getElementById(ctaUrl);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        e.preventDefault();
        break;
      case 'slide':
        // Navigate to content viewer
        const slideIndex = parseInt(ctaUrl) || 0;
        // Trigger navigation by setting URL hash
        window.location.hash = `slide-${slideIndex}`;
        e.preventDefault();
        break;
    }
  };

  return (
    <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-6 md:p-8 shadow-2xl h-full flex flex-col overflow-hidden`}>
      {heading && (
        <h2 className="text-2xl md:text-3xl mb-2 text-center flex-shrink-0" style={headingCSS}>
          {!ec.headingStyle ? (
            <span className={`bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}>{heading}</span>
          ) : heading}
        </h2>
      )}
      {subheading && (
        <p className="text-sm md:text-base text-center mb-4 flex-shrink-0" style={subheadingCSS}>
          {subheading}
        </p>
      )}
      {imageUrl && (
        <div className="mb-4 flex-shrink-0 flex justify-center">
          <img src={imageUrl} alt="" className="max-h-40 md:max-h-48 rounded-2xl shadow-lg object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      {bodyLines.length > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg mb-4 space-y-2 flex-1 min-h-0 overflow-y-auto">
          {bodyLines.map((line: string, i: number) => {
            const emojiMatch = line.match(/^(\p{Extended_Pictographic}+)\s*(.*)/u);
            if (emojiMatch) {
              const [, emoji, rest] = emojiMatch;
              const dashIdx = rest.indexOf(' — ');
              const dashIdx2 = rest.indexOf(' - ');
              const splitIdx = dashIdx >= 0 ? dashIdx : dashIdx2 >= 0 ? dashIdx2 : -1;
              const sep = dashIdx >= 0 ? ' — ' : ' - ';
              if (splitIdx >= 0) {
                const title = rest.substring(0, splitIdx);
                const desc = rest.substring(splitIdx + sep.length);
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-lg md:text-xl flex-shrink-0">{emoji}</span>
                    <div>
                      <span className="text-xs md:text-sm" style={bulletTitleCSS}>{title}</span>
                      <span className="text-xs md:text-sm" style={bodyCSS}> &mdash; {desc}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-lg md:text-xl flex-shrink-0">{emoji}</span>
                  <span className="text-xs md:text-sm" style={bodyCSS}>{rest}</span>
                </div>
              );
            }
            return <p key={i} className="text-xs md:text-sm" style={bodyCSS}>{line}</p>;
          })}
        </div>
      )}
      {ctaText && (
        <div className="text-center mt-auto pt-4 flex-shrink-0">
          {ctaUrl ? (
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
              className={`inline-block px-8 py-3 bg-gradient-to-r ${theme.text} rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105`}
              style={ctaCSS}
              onClick={handleCtaClick}>
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

function CustomCanvasSection({ editableContent }: { editableContent?: SectionData['editableContent'] }) {
  const [pdfPage, setPdfPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);
  
  const bgColor = editableContent?.canvasBackgroundColor || '#ffffff';
  const canvasImages = editableContent?.canvasImages || [];
  const pdfUrl = editableContent?.pdfUrl;

  const togglePdfFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPdfFullscreen(!isPdfFullscreen);
  };

  // If only PDF, show PDF viewer
  if (pdfUrl && canvasImages.length === 0) {
    return (
      <>
        <div className="w-full h-full relative rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: bgColor }}>
          <iframe
            src={`${pdfUrl}#page=${pdfPage}&view=FitV`}
            className="w-full h-full"
            title="PDF Document"
            style={{ minHeight: '70vh' }}
          />
          {/* PDF Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-4 py-2 shadow-lg flex items-center gap-3 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); setPdfPage(Math.max(1, pdfPage - 1)); }} 
              className="text-white hover:scale-110 transition-transform disabled:opacity-50"
              disabled={pdfPage <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Page {pdfPage}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); setPdfPage(pdfPage + 1); }} 
              className="text-white hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/30 mx-1" />
            <button
              onClick={togglePdfFullscreen}
              className="text-white hover:scale-110 transition-transform"
              title="Toggle fullscreen"
            >
              {isPdfFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* PDF Fullscreen Overlay - Optimized for mobile portrait */}
        {isPdfFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              src={`${pdfUrl}#page=${pdfPage}&view=FitV&scrollbar=0`}
              className="w-full flex-1"
              title="PDF Document Fullscreen"
            />
            {/* Fullscreen PDF Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 z-10">
              <button 
                onClick={() => setPdfPage(Math.max(1, pdfPage - 1))} 
                className="text-white hover:scale-110 transition-transform disabled:opacity-50"
                disabled={pdfPage <= 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white font-bold text-base" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Page {pdfPage}
              </span>
              <button 
                onClick={() => setPdfPage(pdfPage + 1)} 
                className="text-white hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="w-px h-8 bg-white/30 mx-1" />
              <button
                onClick={() => setIsPdfFullscreen(false)}
                className="text-white hover:scale-110 transition-transform flex items-center gap-2"
              >
                <Minimize className="w-6 h-6" />
                <span className="text-sm hidden sm:inline" style={{ fontFamily: 'Fredoka, sans-serif' }}>Exit</span>
              </button>
            </div>
          </motion.div>
        )}
      </>
    );
  }

  // If only images, show canvas with images
  if (canvasImages.length > 0 && !pdfUrl) {
    return (
      <div className="w-full h-full rounded-2xl shadow-2xl relative overflow-hidden" style={{ backgroundColor: bgColor, minHeight: '400px' }}>
        {canvasImages.sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1)).map(img => (
          <div 
            key={img.id} 
            className="absolute" 
            style={{ 
              left: `${img.x}%`, 
              top: `${img.y}%`, 
              width: `${img.width}%`, 
              height: `${img.height}%`, 
              transform: `rotate(${img.rotation || 0}deg)`, 
              zIndex: img.zIndex || 1 
            }}
          >
            <img 
              src={img.url} 
              alt="" 
              className="w-full h-full" 
              style={{ objectFit: img.objectFit || 'contain' }} 
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
            />
          </div>
        ))}
      </div>
    );
  }

  // If both PDF and images, show split view with PDF on left, images on right
  if (pdfUrl && canvasImages.length > 0) {
    return (
      <>
        <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-gray-900 flex flex-col md:flex-row gap-2 p-2">
          {/* PDF Section */}
          <div className="flex-1 relative rounded-xl overflow-hidden" style={{ backgroundColor: bgColor }}>
            <iframe
              src={`${pdfUrl}#page=${pdfPage}`}
              className="w-full h-full"
              title="PDF Document"
            />
            {/* PDF Navigation */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setPdfPage(Math.max(1, pdfPage - 1)); }} 
                className="text-white hover:scale-110 transition-transform disabled:opacity-50"
                disabled={pdfPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white font-bold text-xs" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Page {pdfPage}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); setPdfPage(pdfPage + 1); }} 
                className="text-white hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/30 mx-0.5" />
              <button
                onClick={togglePdfFullscreen}
                className="text-white hover:scale-110 transition-transform"
                title="Toggle fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Images Section */}
          <div className="flex-1 rounded-xl shadow-xl relative overflow-hidden" style={{ backgroundColor: bgColor }}>
            {canvasImages.sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1)).map(img => (
              <div 
                key={img.id} 
                className="absolute" 
                style={{ 
                  left: `${img.x}%`, 
                  top: `${img.y}%`, 
                  width: `${img.width}%`, 
                  height: `${img.height}%`, 
                  transform: `rotate(${img.rotation || 0}deg)`, 
                  zIndex: img.zIndex || 1 
                }}
              >
                <img 
                  src={img.url} 
                  alt="" 
                  className="w-full h-full" 
                  style={{ objectFit: img.objectFit || 'contain' }} 
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* PDF Fullscreen Overlay */}
        {isPdfFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              src={`${pdfUrl}#page=${pdfPage}`}
              className="w-full h-full"
              title="PDF Document Fullscreen"
            />
            {/* Fullscreen PDF Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 z-10">
              <button 
                onClick={() => setPdfPage(Math.max(1, pdfPage - 1))} 
                className="text-white hover:scale-110 transition-transform disabled:opacity-50"
                disabled={pdfPage <= 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white font-bold text-base" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Page {pdfPage}
              </span>
              <button 
                onClick={() => setPdfPage(pdfPage + 1)} 
                className="text-white hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="w-px h-8 bg-white/30 mx-1" />
              <button
                onClick={() => setIsPdfFullscreen(false)}
                className="text-white hover:scale-110 transition-transform flex items-center gap-2"
              >
                <Minimize className="w-6 h-6" />
                <span className="text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>Exit</span>
              </button>
            </div>
          </motion.div>
        )}
      </>
    );
  }

  // Empty state
  return (
    <div className="w-full h-full rounded-2xl shadow-2xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
      <p className="text-gray-500 text-lg" style={{ fontFamily: 'Comic Neue, cursive' }}>
        No content available
      </p>
    </div>
  );
}

function getUserTypeLabel(type: UserType): string {
  switch (type) {
    case 'parent': return 'Parent';
    case 'educator': return 'Educator';
    case 'student': return 'Student';
    case 'investor': return 'Investor';
    case 'donor': return 'Donor';
    default: return 'Member';
  }
}