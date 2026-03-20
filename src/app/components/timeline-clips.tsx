import { motion } from 'motion/react';

interface TimelineClipsProps {
  sections: string[];
  currentSection: number;
  onSectionClick: (index: number) => void;
}

const getSectionTitle = (section: string): string => {
  const titles: Record<string, string> = {
    'studio-demo': 'Studio',
    'dashboard-demo': 'Dashboard',
    'camera-overlay-demo': 'Camera',
    'beta-info': 'Beta',
    'parent-educator-info': 'Parents',
    'investor-info': 'Investors',
    'general-info': 'Info'
  };
  return titles[section] || section;
};

const getClipColor = (index: number): string => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-orange-500 to-orange-600',
    'from-green-500 to-green-600',
    'from-indigo-500 to-indigo-600',
    'from-cyan-500 to-cyan-600',
  ];
  return colors[index % colors.length];
};

export function TimelineClips({ sections, currentSection, onSectionClick }: TimelineClipsProps) {
  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-full px-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 p-3 shadow-2xl"
      >
        {/* Timeline Track */}
        <div className="flex gap-1 mb-2">
          {sections.map((section, index) => {
            const isActive = index === currentSection;
            const isPast = index < currentSection;
            
            return (
              <motion.button
                key={index}
                onClick={() => onSectionClick(index)}
                className={`flex-1 h-12 rounded relative overflow-hidden transition-all cursor-pointer group ${
                  isActive ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Clip background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getClipColor(index)} ${
                  isPast ? 'opacity-60' : isActive ? 'opacity-100' : 'opacity-40'
                }`} />
                
                {/* Diagonal stripes for video effect */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)'
                  }}
                />
                
                {/* Clip label */}
                <div className="relative h-full flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] font-bold text-white/90 mb-0.5 truncate w-full text-center">
                    {getSectionTitle(section)}
                  </span>
                  <span className="text-[8px] text-white/60 font-mono">
                    CLIP {index + 1}
                  </span>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"
                    layoutId="activeClip"
                  />
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              </motion.button>
            );
          })}
        </div>
        
        {/* Playback info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-mono">
            CLIP {currentSection + 1} / {sections.length}
          </span>
          <span className="text-gray-500 font-mono">
            {((currentSection / sections.length) * 100).toFixed(0)}% COMPLETE
          </span>
        </div>
      </motion.div>
    </div>
  );
}
