import { motion } from 'motion/react';
import type { LandingPageConfig } from './admin/landing-page-editor';
import { textStyleToCSS } from './admin/landing-page-editor';

interface HeroProps {
  headerImage: string;
  config?: LandingPageConfig['hero'] | null;
  textStyles?: LandingPageConfig['textStyles'] | null;
}

export function Hero({ headerImage, config, textStyles }: HeroProps) {
  const headingBefore = config?.headingBefore ?? 'Turn screen time into';
  const headingHighlight = config?.headingHighlight ?? 'screen credits!';
  const tagline = config?.tagline ?? 'Join the revolution in arts education \uD83C\uDFAC\u2728';
  const imageMaxWidth = config?.imageMaxWidth ?? 'max-w-md';
  const imageRoundness = config?.imageRoundness ?? 'rounded-3xl';

  const headingCSS = textStyles?.heroHeading
    ? textStyleToCSS(textStyles.heroHeading)
    : { fontFamily: 'Fredoka, sans-serif', color: '#ffffff' };

  const highlightCSS = textStyles?.heroHighlight
    ? textStyleToCSS(textStyles.heroHighlight)
    : { fontFamily: 'Fredoka, sans-serif', color: '#67e8f9' };

  const taglineCSS = textStyles?.heroTagline
    ? textStyleToCSS(textStyles.heroTagline)
    : { fontFamily: 'Comic Neue, cursive', color: 'rgba(255,255,255,0.9)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-8"
    >
      <motion.img
        src={headerImage}
        alt="The Frame Game"
        className={`w-full ${imageMaxWidth} mx-auto ${imageRoundness} shadow-2xl mb-6`}
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
      />
      
      <motion.h2
        className="text-2xl md:text-4xl mb-4"
        style={headingCSS}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {headingBefore}{' '}
        <span className="drop-shadow-lg" style={highlightCSS}>{headingHighlight}</span>
      </motion.h2>
      
      <motion.p
        className="text-lg md:text-xl max-w-2xl mx-auto"
        style={taglineCSS}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {tagline}
      </motion.p>
    </motion.div>
  );
}
