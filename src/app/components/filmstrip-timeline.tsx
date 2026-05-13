import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, SkipBack, SkipForward, ChevronLeft, ChevronRight, Scissors, Copy, Maximize2 } from 'lucide-react';

interface FilmstripTimelineProps {
  sections: string[];
  currentSection: number;
  onSectionChange: (index: number) => void;
  sectionTitles: string[];
}

const CLIP_COLORS = [
  { bg: 'bg-blue-600', border: 'border-blue-400', light: 'bg-blue-500/30', text: 'text-blue-200' },
  { bg: 'bg-purple-600', border: 'border-purple-400', light: 'bg-purple-500/30', text: 'text-purple-200' },
  { bg: 'bg-pink-600', border: 'border-pink-400', light: 'bg-pink-500/30', text: 'text-pink-200' },
  { bg: 'bg-orange-600', border: 'border-orange-400', light: 'bg-orange-500/30', text: 'text-orange-200' },
  { bg: 'bg-green-600', border: 'border-green-400', light: 'bg-green-500/30', text: 'text-green-200' },
  { bg: 'bg-indigo-600', border: 'border-indigo-400', light: 'bg-indigo-500/30', text: 'text-indigo-200' },
  { bg: 'bg-cyan-600', border: 'border-cyan-400', light: 'bg-cyan-500/30', text: 'text-cyan-200' },
];

const SECTION_ICONS: Record<string, string> = {
  'studio-demo': '🎬',
  'dashboard-demo': '📊',
  'camera-overlay-demo': '📸',
  'beta-info': '🚀',
  'parent-educator-info': '👨‍👩‍👧',
  'investor-info': '📈',
  'general-info': '✨',
  'custom-html': '🔧',
  'custom-embed': '🌐',
};

// Tiny thumbnail for each section type
function ClipThumbnail({ section, color }: { section: string; color: typeof CLIP_COLORS[0] }) {
  const icon = SECTION_ICONS[section] || '📄';
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-xl">{icon}</div>
    </div>
  );
}

export function FilmstripTimeline({ sections, currentSection, onSectionChange, sectionTitles }: FilmstripTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onSectionChange(currentSection - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); onSectionChange(currentSection + 1); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, sections.length, onSectionChange]);

  // Generate timecode ruler marks
  const rulerMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i <= sections.length; i++) {
      marks.push({ position: (i / sections.length) * 100, label: `${i + 1}` });
    }
    return marks;
  }, [sections.length]);

  // Audio waveform (memoized so it doesn't re-randomize)
  const audioWaveform = useMemo(() => {
    return sections.map(() =>
      Array.from({ length: 8 }, () => Math.random() * 60 + 20)
    );
  }, [sections.length]);

  return (
    <div className="bg-gray-950 flex-shrink-0 flex flex-col select-none" style={{ height: '180px' }}>
      {/* ─── Transport Bar ─── */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-900 border-t border-b border-gray-800 flex-shrink-0">
        {/* Left: timecode + slide info */}
        <div className="flex items-center gap-3">
          <span className="text-green-400 font-mono text-xs font-bold tracking-wider tabular-nums bg-black/60 px-2 py-0.5 rounded">
            Slide {String(currentSection + 1).padStart(2, '0')}
          </span>
          <span className="text-gray-500 text-[10px] font-mono">
            {Math.round(((currentSection) / Math.max(sections.length - 1, 1)) * 100)}%
          </span>
        </div>

        {/* Center: playback controls */}
        <div className="flex items-center gap-1">
          <button onClick={() => onSectionChange(0)} className="p-1 hover:bg-gray-800 rounded transition-colors" title="First slide">
            <ChevronLeft className="w-3 h-3 text-gray-400" />
          </button>
          <button onClick={() => onSectionChange(currentSection - 1)} className="p-1 hover:bg-gray-800 rounded transition-colors">
            <SkipBack className="w-3 h-3 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded transition-colors">
            <Play className="w-3 h-3 text-gray-300" />
          </button>
          <button onClick={() => onSectionChange(currentSection + 1)} className="p-1 hover:bg-gray-800 rounded transition-colors">
            <SkipForward className="w-3 h-3 text-gray-400" />
          </button>
          <button onClick={() => onSectionChange(sections.length - 1)} className="p-1 hover:bg-gray-800 rounded transition-colors" title="Last slide">
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </button>

          <div className="w-px h-4 bg-gray-700 mx-1" />

          {/* Tool icons (decorative) */}
          <button className="p-1 hover:bg-gray-800 rounded transition-colors"><Scissors className="w-3 h-3 text-gray-500" /></button>
          <button className="p-1 hover:bg-gray-800 rounded transition-colors"><Copy className="w-3 h-3 text-gray-500" /></button>
          <button className="p-1 hover:bg-gray-800 rounded transition-colors"><Maximize2 className="w-3 h-3 text-gray-500" /></button>
        </div>

        {/* Right: total slides */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[10px] font-mono hidden sm:inline">
            {sectionTitles[currentSection]?.slice(0, 20)}
          </span>
          <span className="text-gray-400 font-mono text-xs bg-black/60 px-2 py-0.5 rounded tabular-nums">
            {sections.length} slides
          </span>
        </div>
      </div>

      {/* ─── Scrub / Progress Bar ─── */}
      <div className="relative h-3 bg-gray-900 border-b border-gray-800 flex-shrink-0 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          onSectionChange(Math.round(pct * (sections.length - 1)));
        }}
      >
        {/* Ruler marks */}
        <div className="absolute inset-0 flex">
          {sections.map((_, i) => (
            <div key={i} className="flex-1 border-r border-gray-800 relative">
              <span className="absolute -bottom-0.5 left-0 text-[7px] text-gray-600 font-mono pl-px leading-none">{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10"
          style={{ left: `${((currentSection + 0.5) / sections.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        <motion.div
          className="absolute -top-0.5 w-2 h-2 bg-blue-400 z-10 rotate-45"
          style={{ left: `calc(${((currentSection + 0.5) / sections.length) * 100}% - 4px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>

      {/* ─── Track Names Column ─── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Track labels */}
        <div className="w-16 sm:w-20 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900/80">
          {/* V1 track label */}
          <div className="flex-[3] flex items-center justify-center border-b border-gray-800 px-1">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-sm bg-blue-500" />
              <span className="text-[10px] text-gray-400 font-mono font-bold">V1</span>
            </div>
          </div>
          {/* A1 track label */}
          <div className="flex-[1] flex items-center justify-center px-1">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-sm bg-green-500" />
              <span className="text-[10px] text-gray-400 font-mono font-bold">A1</span>
            </div>
          </div>
        </div>

        {/* Track content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden" ref={timelineRef}>
          {/* ── V1 Video Track ── */}
          <div className="flex-[3] flex gap-px p-px border-b border-gray-800 bg-gray-900/40 overflow-x-auto overflow-y-hidden">
            {sections.map((section, index) => {
              const isActive = index === currentSection;
              const color = CLIP_COLORS[index % CLIP_COLORS.length];

              return (
                <motion.button
                  key={index}
                  onClick={() => onSectionChange(index)}
                  className={`flex-1 min-w-[60px] rounded-sm relative overflow-hidden cursor-pointer group transition-all ${
                    isActive ? 'ring-1 ring-white/60 z-10 shadow-lg' : 'hover:brightness-125'
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Clip background */}
                  <div className={`absolute inset-0 ${color.bg} ${isActive ? 'opacity-90' : 'opacity-50'}`} />

                  {/* Clip content: thumbnail + label */}
                  <div className="relative h-full flex items-stretch">
                    {/* Thumbnail */}
                    <div className={`w-8 sm:w-10 flex-shrink-0 border-r ${isActive ? 'border-white/20' : 'border-black/30'} overflow-hidden`}>
                      <ClipThumbnail section={section} color={color} />
                    </div>

                    {/* Label area */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center px-1.5 py-0.5">
                      <span className={`text-[8px] sm:text-[9px] font-bold truncate ${isActive ? 'text-white' : 'text-white/70'}`} style={{ fontFamily: 'system-ui' }}>
                        {sectionTitles[index] || `Clip ${index + 1}`}
                      </span>
                      <span className={`text-[7px] truncate ${isActive ? 'text-white/60' : 'text-white/40'}`}>
                        {SECTION_ICONS[section] || '📄'} Slide {index + 1}
                      </span>
                    </div>

                    {/* Thumbnail at end of clip too (for wider clips) */}
                    <div className={`w-6 sm:w-8 flex-shrink-0 border-l ${isActive ? 'border-white/10' : 'border-black/20'} overflow-hidden hidden md:block`}>
                      <ClipThumbnail section={section} color={color} />
                    </div>
                  </div>

                  {/* Active playhead line */}
                  {isActive && (
                    <motion.div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/80 z-20" layoutId="v1-playhead" />
                  )}

                  {/* Hover brightener */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
                </motion.button>
              );
            })}
          </div>

          {/* ── A1 Audio Track ── */}
          <div className="flex-[1] flex gap-px p-px bg-gray-900/40 overflow-hidden">
            {sections.map((_, index) => {
              const isActive = index === currentSection;
              return (
                <button
                  key={index}
                  onClick={() => onSectionChange(index)}
                  className={`flex-1 min-w-[60px] rounded-sm relative overflow-hidden cursor-pointer ${
                    isActive ? 'ring-1 ring-white/30' : ''
                  }`}
                >
                  <div className={`absolute inset-0 bg-green-800 ${isActive ? 'opacity-60' : 'opacity-25'}`} />
                  {/* Waveform */}
                  <div className="relative h-full flex items-center justify-around px-0.5">
                    {audioWaveform[index]?.map((h, j) => (
                      <div
                        key={j}
                        className={`w-px rounded-full ${isActive ? 'bg-green-400' : 'bg-green-600/50'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  {isActive && (
                    <motion.div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/60 z-10" layoutId="a1-playhead" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}