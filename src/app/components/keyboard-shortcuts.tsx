import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800/95 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors border border-gray-600"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      {/* Shortcuts Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-20 right-4 z-50 bg-gray-900/98 backdrop-blur-sm border-2 border-gray-700 rounded-lg shadow-2xl p-4 w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Timeline Controls
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-2">
              <ShortcutItem 
                keys={['←', '→']} 
                description="Navigate sections" 
              />
              <ShortcutItem 
                keys={['Scroll']} 
                description="Scrub timeline horizontally" 
              />
              <ShortcutItem 
                keys={['Drag']} 
                description="Rotate jog dial to scrub" 
              />
              <ShortcutItem 
                keys={['Click']} 
                description="Jump to clip in timeline" 
              />
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t border-gray-700">
              <p className="text-[10px] text-gray-500 text-center font-mono">
                SCRUB THROUGH LIKE A PRO EDITOR 🎬
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span
            key={i}
            className="bg-gray-800 border border-gray-600 px-2 py-1 rounded font-mono text-gray-300"
          >
            {key}
          </span>
        ))}
      </div>
      <span className="text-gray-400" style={{ fontFamily: 'Comic Neue, cursive' }}>
        {description}
      </span>
    </div>
  );
}
