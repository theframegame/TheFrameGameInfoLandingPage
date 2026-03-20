import { motion } from 'motion/react';
import { Sparkles, Calendar, Gift, Zap } from 'lucide-react';

export function BetaInfo() {
  const benefits = [
    { icon: Zap, title: 'Early Access', desc: 'Be the first to try Frame Game Studio' },
    { icon: Gift, title: 'Exclusive Rewards', desc: 'Compete for cash prizes and recognition' },
    { icon: Sparkles, title: 'Shape the Future', desc: 'Your feedback directly influences our development' },
  ];

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <h2 
        className="text-2xl md:text-3xl font-bold mb-4 text-center flex-shrink-0"
        style={{ fontFamily: 'Fredoka, sans-serif' }}
      >
        <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Beta Tester Benefits
        </span>
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0">
        {benefits.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-3 shadow-lg text-center"
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-sm md:text-base font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{title}</h3>
            <p className="text-xs md:text-sm text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 text-center flex-1 min-h-0 flex flex-col justify-center">
        <Calendar className="w-8 h-8 md:w-10 md:h-10 text-orange-500 mx-auto mb-2" />
        <h3 className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Launch Timeline
        </h3>
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <p className="text-sm md:text-base" style={{ fontFamily: 'Comic Neue, cursive' }}>
              <span className="font-bold">Spring 2026:</span> Beta Testing
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <p className="text-sm md:text-base" style={{ fontFamily: 'Comic Neue, cursive' }}>
              <span className="font-bold">Summer 2026:</span> Feature Expansion
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-300"></div>
            <p className="text-sm md:text-base" style={{ fontFamily: 'Comic Neue, cursive' }}>
              <span className="font-bold">Fall 2026:</span> Public Launch
            </p>
          </div>
        </div>
        <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
          We'll send early access details to your email soon!
        </p>
      </div>
    </div>
  );
}
