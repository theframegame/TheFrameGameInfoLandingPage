import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';

export interface LearnMoreConfig {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
}

interface LearnMoreSlideProps {
  config?: LearnMoreConfig;
}

export function LearnMoreSlide({ config }: LearnMoreSlideProps) {
  const navigate = useNavigate();

  // Default values
  const heading = config?.heading || 'Discover More';
  const subheading = config?.subheading || 'Explore all content curated for you';
  const buttonText = config?.buttonText || 'Explore Now';
  
  // Gradient colors
  const gradientFrom = config?.gradientFrom || '#9333ea'; // purple-600
  const gradientVia = config?.gradientVia || '#db2777'; // pink-600
  const gradientTo = config?.gradientTo || '#f97316'; // orange-500

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`
      }}
    >
      {/* Animated Background Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-md rounded-full mb-8 shadow-2xl border-4 border-white/40"
        >
          <Compass className="w-16 h-16 text-white" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-2xl"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          {heading}
        </motion.h2>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <Sparkles className="w-6 h-6 text-yellow-300" />
          <p
            className="text-2xl md:text-3xl text-white/95 font-medium"
            style={{ fontFamily: 'Comic Neue, cursive' }}
          >
            {subheading}
          </p>
          <Sparkles className="w-6 h-6 text-yellow-300" />
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/explore')}
          className="px-12 py-6 bg-white text-purple-600 rounded-full font-bold text-2xl shadow-2xl hover:shadow-white/50 transition-all inline-flex items-center gap-3"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <Compass className="w-7 h-7" />
          {buttonText}
        </motion.button>

        {/* Decorative Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-white/70 text-lg"
          style={{ fontFamily: 'Comic Neue, cursive' }}
        >
          Browse all available sections • Discover hidden content • Your journey awaits
        </motion.p>
      </div>
    </div>
  );
}
