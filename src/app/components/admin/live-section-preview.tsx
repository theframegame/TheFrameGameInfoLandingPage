import { useState, useEffect } from 'react';

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
  cardWidth?: number;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '21:9';
  cardPadding?: number;
}

type SectionType = 
  | 'studio-demo' 
  | 'dashboard-demo' 
  | 'camera-overlay-demo'
  | 'beta-info' 
  | 'parent-educator-info' 
  | 'investor-info' 
  | 'general-info'
  | 'custom-html'
  | 'custom-embed';

interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  visibleTo?: string[];
  customContent?: string;
  embedUrl?: string;
  description?: string;
  layout?: LayoutConfig;
}

interface LiveSectionPreviewProps {
  section: SectionConfig;
}

export function LiveSectionPreview({ section }: LiveSectionPreviewProps) {
  const layout = section.layout || {};
  
  // Get alignment classes
  const getJustifyClass = () => {
    switch (layout.horizontalAlign) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  const getAlignClass = () => {
    switch (layout.verticalAlign) {
      case 'top': return 'items-start';
      case 'bottom': return 'items-end';
      default: return 'items-center';
    }
  };

  // Container style
  const containerStyle = {
    transform: `scale(${(layout.scale || 100) / 100})`,
    maxWidth: layout.maxWidth || '100%',
    maxHeight: layout.maxHeight || '100%',
    padding: layout.padding || '16px',
    backgroundColor: layout.backgroundGradient ? undefined : (layout.backgroundColor || 'transparent'),
    borderRadius: layout.borderRadius || '24px',
  };

  // Gradient class
  const gradientClass = layout.backgroundGradient && layout.backgroundGradient !== 'none'
    ? `bg-gradient-to-r ${layout.backgroundGradient}` 
    : '';

  // Custom CSS classes
  const customClasses = layout.customCss || '';

  // Render section content based on type
  const renderSectionContent = () => {
    switch (section.type) {
      case 'custom-html':
        if (section.customContent) {
          return (
            <div 
              dangerouslySetInnerHTML={{ __html: section.customContent }} 
              className="w-full h-full"
            />
          );
        }
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="font-bold text-2xl mb-2 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Custom HTML Section
            </h3>
            <p className="text-gray-300" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Add your custom HTML content in the Content tab
            </p>
          </div>
        );

      case 'custom-embed':
        if (section.embedUrl) {
          return (
            <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden">
              <iframe
                src={section.embedUrl}
                className="w-full h-full"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
          );
        }
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="font-bold text-2xl mb-2 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Custom Embed Section
            </h3>
            <p className="text-gray-300" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Add an embed URL in the Content tab (YouTube, Vimeo, etc.)
            </p>
          </div>
        );

      case 'studio-demo':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Frame Game Studio
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Professional video editing interface with timeline, effects, and real-time preview
            </p>
            <div className="bg-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">✂️</div>
                  <div className="text-sm text-gray-300">Trim & Cut</div>
                </div>
                <div className="bg-pink-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm text-gray-300">Effects</div>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🎵</div>
                  <div className="text-sm text-gray-300">Audio Mix</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dashboard-demo':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Teacher & Student Dashboard
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Track progress, manage assignments, and view student work all in one place
            </p>
            <div className="bg-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-sm text-gray-300">Assignment Tracking</div>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-sm text-gray-300">Progress Reports</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'camera-overlay-demo':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Camera Overlay System
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Interactive overlays and guides to help students frame their shots perfectly
            </p>
            <div className="bg-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-orange-500/20 rounded-lg p-3">
                  <div className="text-xl mb-1">📏</div>
                  <div className="text-xs text-gray-300">Rule of Thirds</div>
                </div>
                <div className="bg-red-500/20 rounded-lg p-3">
                  <div className="text-xl mb-1">🎯</div>
                  <div className="text-xs text-gray-300">Focus Points</div>
                </div>
                <div className="bg-indigo-500/20 rounded-lg p-3">
                  <div className="text-xl mb-1">📐</div>
                  <div className="text-xs text-gray-300">Guides</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'beta-info':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Join Our Beta Program
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Be among the first to experience Frame Game and help shape the future of arts education
            </p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 max-w-xl mx-auto">
              <div className="text-white space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span>Early access to all features</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <span>Direct feedback to our team</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💫</span>
                  <span>Special beta pricing</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'parent-educator-info':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              For Parents & Educators
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Empower the next generation of storytellers with professional-grade tools designed for learning
            </p>
            <div className="bg-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm text-gray-300">Curriculum Aligned</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-sm text-gray-300">Safe & Secure</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'investor-info':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Investment Opportunity
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Join us in revolutionizing arts education through innovative technology
            </p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 max-w-xl mx-auto">
              <div className="text-white space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <span>Growing EdTech market</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Clear monetization strategy</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <span>Experienced founding team</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'general-info':
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="font-bold text-3xl mb-4 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              About The Frame Game
            </h3>
            <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Making filmmaking education accessible, engaging, and fun for everyone
            </p>
            <div className="bg-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm text-gray-300">Creative Tools</div>
                </div>
                <div className="bg-pink-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">📖</div>
                  <div className="text-sm text-gray-300">Learn by Doing</div>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🌈</div>
                  <div className="text-sm text-gray-300">For All Ages</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="font-bold text-2xl mb-2 text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {section.title}
            </h3>
            <p className="text-gray-300" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Section preview will appear here
            </p>
          </div>
        );
    }
  };

  return (
    <div 
      className={`flex ${getJustifyClass()} ${getAlignClass()} w-full h-full`}
      style={{ minHeight: '600px' }}
    >
      <div
        className={`${gradientClass} ${customClasses} transition-all duration-300`}
        style={containerStyle}
      >
        {renderSectionContent()}
      </div>
    </div>
  );
}