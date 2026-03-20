import { motion } from 'motion/react';
import { Camera, Grid3x3, Ruler, Eye } from 'lucide-react';

export function CameraOverlayDemo() {
  const features = [
    { icon: Grid3x3, title: 'Composition Guides', desc: 'Rule of thirds, golden ratio, and more' },
    { icon: Ruler, title: 'Framing Tools', desc: 'Perfect your shot composition in real-time' },
    { icon: Eye, title: 'Focus Assistance', desc: 'Visual aids for professional-looking shots' },
  ];

  return (
    <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <Camera className="w-8 h-8 md:w-10 md:h-10 text-cyan-600" />
        <h2 
          className="text-2xl md:text-3xl font-bold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Camera Overlay System
          </span>
        </h2>
      </div>

      <p className="text-base md:text-lg text-gray-700 mb-4 flex-shrink-0" style={{ fontFamily: 'Comic Neue, cursive' }}>
        Professional-grade overlays help filmmakers capture perfect shots every time!
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0">
        {features.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-3 shadow-lg text-center"
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-500 mx-auto mb-2" />
            <h3 className="text-xs md:text-sm font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{title}</h3>
            <p className="text-gray-700 text-[10px] md:text-xs" style={{ fontFamily: 'Comic Neue, cursive' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 text-center flex-1 min-h-0 flex items-center justify-center">
        <div className="bg-gradient-to-br from-cyan-200 to-blue-200 rounded-xl w-full h-full flex items-center justify-center relative overflow-hidden">
          {/* Grid overlay simulation */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-cyan-600"></div>
            ))}
          </div>
          <div className="text-center z-10">
            <Camera className="w-12 h-12 md:w-16 md:h-16 text-cyan-600 mx-auto mb-2" />
            <p className="text-sm md:text-base font-semibold text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Coming in Later Phases
            </p>
            <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Advanced filming tools!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
