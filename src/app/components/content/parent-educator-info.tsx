import { motion } from 'motion/react';
import { Users, GraduationCap, Shield, Heart, Award, BookOpen } from 'lucide-react';

export function ParentEducatorInfo() {
  const benefits = [
    { icon: Shield, title: 'Safe Environment', desc: 'Moderated platform designed for young creators' },
    { icon: Award, title: 'Skill Development', desc: 'Build filmmaking, creativity, and technical skills' },
    { icon: BookOpen, title: 'Curriculum Aligned', desc: 'Supports arts education standards and objectives' },
    { icon: Heart, title: 'Positive Impact', desc: 'Transform screen time into creative learning' },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-3 flex-shrink-0">
        <Users className="w-8 h-8 text-blue-600" />
        <GraduationCap className="w-8 h-8 text-indigo-600" />
      </div>
      
      <h2 
        className="text-2xl md:text-3xl font-bold mb-2 text-center flex-shrink-0"
        style={{ fontFamily: 'Fredoka, sans-serif' }}
      >
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          For Parents & Educators
        </span>
      </h2>

      <p className="text-sm md:text-base text-gray-700 mb-3 text-center flex-shrink-0" style={{ fontFamily: 'Comic Neue, cursive' }}>
        Empowering the next generation of storytellers!
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
        {benefits.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-2 md:p-3 shadow-lg"
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mb-1" />
            <h3 className="text-xs md:text-sm font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{title}</h3>
            <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-3 md:p-4 flex-1 min-h-0 overflow-auto">
        <h3 className="text-base md:text-lg font-bold mb-2 text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Why The Frame Game?
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm mb-0.5" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Meaningful Screen Time
              </h4>
              <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Turn passive consumption into active creation!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm mb-0.5" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Real-World Skills
              </h4>
              <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Filmmaking teaches storytelling and problem-solving.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm mb-0.5" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Supportive Community
              </h4>
              <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Connect in a positive environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
