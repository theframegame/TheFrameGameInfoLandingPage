import { motion } from 'motion/react';

export function Playhead() {
  return (
    <div className="fixed left-1/3 top-0 bottom-0 z-30 pointer-events-none">
      {/* Playhead Line */}
      <div className="relative h-full">
        {/* Top Triangle/Handle */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-red-500 px-3 py-1 rounded-b-lg shadow-lg">
            <div className="w-0 h-0 mx-auto" />
          </div>
        </motion.div>
        
        {/* Vertical Line */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full origin-top"
          style={{
            background: 'linear-gradient(to bottom, #ef4444 0%, #ef4444 20%, rgba(239, 68, 68, 0.6) 100%)'
          }}
        />
        
        {/* Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-red-500/20 blur-sm"
        />
        
        {/* Animated Playhead Top Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <div className="relative">
            {/* Triangle pointer */}
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
            
            {/* Pulsing indicator */}
            <motion.div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
