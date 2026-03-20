import { motion } from 'motion/react';

interface ViewerOverlayProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
}

export function ViewerOverlay({ currentSection, totalSections, sectionTitle }: ViewerOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Subtle corner safe-area guides */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/8" />
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white/8" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white/8" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/8" />
    </div>
  );
}
