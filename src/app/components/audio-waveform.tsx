import { motion } from 'motion/react';

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  const bars = 40;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-auto md:bottom-32 md:left-24 z-30 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-2 max-w-md">
      <div className="flex items-center gap-1">
        {/* Waveform visualization */}
        <div className="flex-1 flex items-center justify-center gap-px h-12">
          {Array.from({ length: bars }).map((_, i) => {
            const height = Math.random() * 70 + 30; // Random height between 30-100%
            return (
              <motion.div
                key={i}
                className={`flex-1 rounded-full ${
                  isActive ? 'bg-green-500' : 'bg-gray-600'
                }`}
                animate={isActive ? {
                  height: [`${height * 0.3}%`, `${height}%`, `${height * 0.5}%`, `${height * 0.8}%`],
                } : {
                  height: '20%'
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.05,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </div>
        
        {/* Audio info */}
        <div className="flex flex-col items-end gap-0.5 ml-2">
          <span className="text-[10px] text-gray-400 font-mono">AUDIO</span>
          <span className={`text-[8px] font-mono ${isActive ? 'text-green-400' : 'text-gray-600'}`}>
            {isActive ? 'ACTIVE' : 'MUTED'}
          </span>
        </div>
      </div>
    </div>
  );
}
