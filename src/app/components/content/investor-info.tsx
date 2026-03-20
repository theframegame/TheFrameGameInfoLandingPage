import { motion } from 'motion/react';
import { TrendingUp, Target, Users, Rocket, DollarSign, BarChart } from 'lucide-react';

export function InvestorInfo() {
  const highlights = [
    { icon: Target, title: '$1.2B Market', desc: 'Arts education market growing 15% annually' },
    { icon: Users, title: '10M+ Creators', desc: 'Gen Z content creators seeking skill development' },
    { icon: BarChart, title: '40% Boost', desc: 'Gamification drives engagement in edtech' },
  ];

  return (
    <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
        <h2 
          className="text-2xl md:text-3xl font-bold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Investment Opportunity
          </span>
        </h2>
      </div>

      <p className="text-sm md:text-base text-gray-700 mb-3 flex-shrink-0" style={{ fontFamily: 'Comic Neue, cursive' }}>
        Join us in revolutionizing arts education!
      </p>

      <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0">
        {highlights.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-2 shadow-lg text-center"
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-green-500 mx-auto mb-1" />
            <h3 className="text-xs md:text-sm font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{title}</h3>
            <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-3 mb-2 flex-shrink-0">
        <h3 className="text-base md:text-lg font-bold mb-2 text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Why Invest?
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Rocket className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs md:text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Scalable Platform
              </h4>
              <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Cloud-based, global scale.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="w-5 h-5 text-teal-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs md:text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Multiple Revenue Streams
              </h4>
              <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Subscriptions & partnerships.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs md:text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Mission-Driven ROI
              </h4>
              <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Impact meets returns!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-3 text-white text-center flex-1 min-h-0 flex flex-col justify-center">
        <h3 className="text-base md:text-lg font-bold mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Ready to Learn More?
        </h3>
        <p className="text-xs md:text-sm mb-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
          We'll share our pitch deck, financials, and growth strategy.
        </p>
        <p className="text-xs md:text-sm font-semibold" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Our team will reach out shortly!
        </p>
      </div>
    </div>
  );
}
