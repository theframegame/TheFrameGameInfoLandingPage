import { motion } from 'motion/react';
import { Play, Pause, Square } from 'lucide-react';

interface ViewerProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
}

// Format timecode like: 00:00:12:05 (HH:MM:SS:FF where FF is frame/section)
const formatTimecode = (sectionIndex: number, totalSections: number): string => {
  // Make each section represent 3 seconds of "footage"
  const totalSeconds = sectionIndex * 3;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const frames = (sectionIndex * 2) % 24; // 24fps simulation
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
};

// Calculate total duration
const formatDuration = (totalSections: number): string => {
  const totalSeconds = totalSections * 3;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function Viewer({ currentSection, totalSections, sectionTitle }: ViewerProps) {
  const timecode = formatTimecode(currentSection, totalSections);
  const duration = formatDuration(totalSections);
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
      className="fixed top-4 left-4 z-40 select-none"
    >
      {/* Main Viewer Window */}
      <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-2 border-gray-700">
        {/* Top Bar - Like a video player */}
        <div className="bg-gray-800 px-3 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 font-mono">VIEWER</span>
        </div>
        
        {/* Preview Area */}
        <div className="bg-black p-4 min-w-[280px]">
          <div className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 rounded flex items-center justify-center relative overflow-hidden">
            {/* Film grain effect */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />
            
            {/* Scanlines effect */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
            }} />
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
            
            {/* Content Preview */}
            <div className="text-center z-10 p-4">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-white/40 text-xs mb-2 font-mono">SECTION {currentSection + 1}</div>
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {sectionTitle}
                </div>
                
                {/* Animated bars representing audio/video activity */}
                <div className="flex gap-0.5 justify-center mt-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-green-400/60 rounded-full"
                      animate={{
                        height: [8, 16, 12, 20, 8],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Corner Frame Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400/50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400/50" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400/50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400/50" />
            
            {/* Safe area indicator */}
            <div className="absolute inset-4 border border-white/10 rounded pointer-events-none" />
          </div>
        </div>
        
        {/* Controls Bar */}
        <div className="bg-gray-800 px-3 py-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            {/* Transport Controls */}
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Square className="w-3 h-3 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Play className="w-3 h-3 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Pause className="w-3 h-3 text-gray-400" />
              </button>
            </div>
            
            {/* Timecode Display */}
            <div className="flex items-center gap-2">
              <div className="bg-black px-3 py-1 rounded border border-green-900/50">
                <span className="text-green-400 font-mono text-sm font-bold tracking-wider">
                  {timecode}
                </span>
              </div>
              <span className="text-gray-600 font-mono text-xs">/</span>
              <div className="bg-black px-2 py-1 rounded border border-gray-800">
                <span className="text-gray-500 font-mono text-xs tracking-wider">
                  {duration}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-900 px-3 py-2">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      
      {/* Section Counter */}
      <motion.div
        className="mt-2 bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded border border-gray-700"
        layout
      >
        <div className="text-xs text-gray-400 font-mono">
          CLIP {currentSection + 1} OF {totalSections}
        </div>
      </motion.div>
    </motion.div>
  );
}
