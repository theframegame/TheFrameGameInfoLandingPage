import { motion } from 'motion/react';
import { LayoutDashboard, Users, Award, BarChart, BookOpen } from 'lucide-react';

export function DashboardDemo() {
  const features = [
    { icon: Users, title: 'Class Management', desc: 'Organize students and track progress' },
    { icon: Award, title: 'Achievement Tracking', desc: 'Monitor student accomplishments and growth' },
    { icon: BookOpen, title: 'Curriculum Tools', desc: 'Access lesson plans and teaching resources' },
    { icon: BarChart, title: 'Analytics', desc: 'Insights into student engagement and performance' },
  ];

  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
        <h2 
          className="text-2xl md:text-3xl font-bold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Teacher/Student Dashboard
          </span>
        </h2>
      </div>

      <p className="text-base md:text-lg text-gray-700 mb-4 flex-shrink-0" style={{ fontFamily: 'Comic Neue, cursive' }}>
        Empower educators with tools to guide, track, and celebrate student creativity!
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
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-green-500 mb-2" />
            <h3 className="text-sm md:text-base font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{title}</h3>
            <p className="text-xs md:text-sm text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 flex-1 min-h-0 flex flex-col">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-center flex-shrink-0" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          For Teachers & Students
        </h3>
        <div className="bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl flex-1 flex items-center justify-center">
          <div className="text-center">
            <LayoutDashboard className="w-12 h-12 md:w-16 md:h-16 text-green-600 mx-auto mb-2" />
            <p className="text-sm md:text-base font-semibold text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Dashboard Preview Coming Soon
            </p>
            <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Launching in later phases!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
