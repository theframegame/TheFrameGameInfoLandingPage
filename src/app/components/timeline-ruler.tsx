import { motion } from 'motion/react';

interface TimelineRulerProps {
  sections: string[];
}

export function TimelineRuler({ sections }: TimelineRulerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-sm border-b-2 border-gray-700 z-20 overflow-hidden shadow-lg">
      {/* Ruler markings */}
      <div className="h-full flex items-end px-4 relative">
        {/* Major tick marks for each section */}
        {sections.map((_, index) => {
          const position = sections.length > 1 ? ((index) / (sections.length - 1)) * 100 : 50;
          return (
            <div
              key={index}
              className="absolute bottom-0"
              style={{ left: `${position}%` }}
            >
              {/* Tick mark */}
              <div className="flex flex-col items-center -translate-x-1/2">
                <div className="w-0.5 h-7 bg-yellow-500/80 shadow-sm" />
                <div className="bg-gray-800 px-1.5 py-0.5 rounded mt-1 border border-gray-700">
                  <span className="text-[10px] text-yellow-400 font-mono font-bold">
                    {String(index * 3).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Minor tick marks (sub-divisions) */}
        {Array.from({ length: sections.length * 6 }).map((_, index) => {
          const totalTicks = sections.length * 6 - 1;
          const position = totalTicks > 0 ? (index / totalTicks) * 100 : 50;
          const isMajor = index % 6 === 0;
          
          if (isMajor) return null; // Skip major ticks as they're drawn above
          
          return (
            <div
              key={`minor-${index}`}
              className="absolute bottom-0"
              style={{ left: `${position}%` }}
            >
              <div className="w-px h-3 bg-gray-600/60" />
            </div>
          );
        })}
        
        {/* Timeline label */}
        <div className="absolute top-2 left-4 flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono tracking-wider font-bold">TIMELINE</span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
        
        {/* Project info */}
        <div className="absolute top-2 right-4 flex items-center gap-3">
          <span className="text-[10px] text-gray-500 font-mono">FRAME GAME PROJECT</span>
          <span className="text-xs text-green-400 font-mono font-bold">24 FPS</span>
        </div>
      </div>
    </div>
  );
}
