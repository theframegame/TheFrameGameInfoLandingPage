import { motion } from 'motion/react';
import { Film, Scissors, Sparkles, Palette, Music } from 'lucide-react';

export function StudioDemo() {
  const features = [
    { icon: Scissors, title: 'Intuitive Editing', desc: 'Trim, split, and arrange clips with ease' },
    { icon: Palette, title: 'Creative Filters', desc: 'Apply stunning effects and color grading' },
    { icon: Music, title: 'Audio Tools', desc: 'Add music, sound effects, and voiceovers' },
    { icon: Sparkles, title: 'AI Assistance', desc: 'Smart suggestions for better storytelling' },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <Film className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
        <h2 
          className="text-2xl md:text-3xl font-bold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Frame Game Studio
          </span>
        </h2>
      </div>

      <p className="text-base md:text-lg text-gray-700 mb-4 flex-shrink-0" style={{ fontFamily: 'Comic Neue, cursive' }}>
        Our powerful yet simple editing interface makes video creation fun and accessible for everyone!
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
        {features.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-3 shadow-lg"
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-purple-500 mb-2" />
            <h3 className="text-sm md:text-base font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{title}</h3>
            <p className="text-xs md:text-sm text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 text-center flex-1 min-h-0 flex items-center justify-center">
        <div className="text-center">
          <Film className="w-12 h-12 md:w-16 md:h-16 text-purple-600 mx-auto mb-2" />
          <p className="text-sm md:text-base font-semibold text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Studio Demo Coming Soon
          </p>
          <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Experience the magic in your beta access!
          </p>
        </div>
      </div>
    </div>
  );
}
