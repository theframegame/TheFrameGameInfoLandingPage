import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';

interface JogDialProps {
  sections: string[];
  onSectionChange: (index: number) => void;
  currentSection: number;
}

const getSectionTitle = (section: string): string => {
  const titles: Record<string, string> = {
    'studio-demo': 'Studio Demo',
    'dashboard-demo': 'Dashboard Demo',
    'camera-overlay-demo': 'Camera Overlay',
    'beta-info': 'Beta Info',
    'parent-educator-info': 'Parent & Educator Info',
    'investor-info': 'Investor Info',
    'general-info': 'General Info'
  };
  return titles[section] || section;
};

export function JogDial({ sections, onSectionChange, currentSection }: JogDialProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const dialRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);
  const accumulatedRotationRef = useRef(0);

  // Calculate which section based on rotation
  useEffect(() => {
    const degreesPerSection = 360 / sections.length;
    const normalizedRotation = ((accumulatedRotationRef.current % 360) + 360) % 360;
    const newSection = Math.floor(normalizedRotation / degreesPerSection);
    
    if (newSection !== currentSection) {
      onSectionChange(newSection);
    }
  }, [rotation, sections.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    if (dialRef.current) {
      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      lastAngleRef.current = angle;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    if (dialRef.current && e.touches[0]) {
      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.touches[0].clientY - centerY, e.touches[0].clientX - centerX);
      lastAngleRef.current = angle;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dialRef.current) return;

      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let delta = angle - lastAngleRef.current;
      
      // Handle wrapping
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      
      const deltaRotation = (delta * 180) / Math.PI;
      accumulatedRotationRef.current += deltaRotation;
      setRotation(accumulatedRotationRef.current);
      
      lastAngleRef.current = angle;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !dialRef.current || !e.touches[0]) return;

      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(e.touches[0].clientY - centerY, e.touches[0].clientX - centerX);
      let delta = angle - lastAngleRef.current;
      
      // Handle wrapping
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      
      const deltaRotation = (delta * 180) / Math.PI;
      accumulatedRotationRef.current += deltaRotation;
      setRotation(accumulatedRotationRef.current);
      
      lastAngleRef.current = angle;
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const newSection = (currentSection - 1 + sections.length) % sections.length;
        const degreesPerSection = 360 / sections.length;
        accumulatedRotationRef.current = newSection * degreesPerSection;
        setRotation(accumulatedRotationRef.current);
      } else if (e.key === 'ArrowRight') {
        const newSection = (currentSection + 1) % sections.length;
        const degreesPerSection = 360 / sections.length;
        accumulatedRotationRef.current = newSection * degreesPerSection;
        setRotation(accumulatedRotationRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, sections.length]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="flex flex-col items-center gap-2"
      >
        {/* Section Label */}
        <div className="bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg max-w-xs">
          <p className="text-xs text-gray-500 text-center" style={{ fontFamily: 'Comic Neue, cursive' }}>
            {currentSection + 1} / {sections.length}
          </p>
          <p className="text-sm font-bold text-purple-600 text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {getSectionTitle(sections[currentSection])}
          </p>
        </div>

        {/* Jog Dial */}
        <div
          ref={dialRef}
          className="relative cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ touchAction: 'none' }}
        >
          {/* Outer Ring with filmstrip style */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1.5 shadow-2xl">
            <div className="w-full h-full rounded-full bg-gray-900 p-1">
              <div className="w-full h-full rounded-full bg-white p-2.5">
                {/* Rotating Dial */}
                <motion.div
                  className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden"
                  style={{ 
                    rotate: rotation,
                    transition: isDragging ? 'none' : 'rotate 0.3s ease-out'
                  }}
                >
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full" />
                  
                  {/* Center Icon */}
                  <Film className="w-9 h-9 text-white relative z-10 drop-shadow-lg" />
                  
                  {/* Tick Marks - Enhanced */}
                  {sections.map((_, i) => {
                    const angle = (360 / sections.length) * i;
                    const isActive = i === currentSection;
                    return (
                      <div
                        key={i}
                        className={`absolute rounded-full transition-all ${
                          isActive 
                            ? 'w-1.5 h-4 bg-yellow-300 shadow-lg' 
                            : 'w-1 h-3 bg-white/50'
                        }`}
                        style={{
                          top: '6px',
                          left: '50%',
                          transformOrigin: 'center 40px',
                          transform: `translateX(-50%) rotate(${angle}deg)`,
                        }}
                      />
                    );
                  })}
                  
                  {/* Indicator Arrow - Fixed position */}
                  <div 
                    className="absolute top-0.5 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Pulsing effect when active */}
          {isDragging && (
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-400/30"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Drag to scrub • Arrow keys to navigate
          </p>
        </div>
      </motion.div>
    </div>
  );
}
