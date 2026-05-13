import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface SectionOption {
  type: string;
  title: string;
}

interface LearnMoreMenuProps {
  allSections: SectionOption[];
  currentSectionTypes: string[];
  onAddSections: (selectedTypes: string[]) => void;
}

export function LearnMoreMenu({ allSections, currentSectionTypes, onAddSections }: LearnMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Filter out sections that are already in the filmstrip
  // AND remove duplicates using a Map
  const uniqueSectionsMap = new Map<string, SectionOption>();
  allSections.forEach(section => {
    if (!currentSectionTypes.includes(section.type)) {
      uniqueSectionsMap.set(section.type, section);
    }
  });
  const unseenSections = Array.from(uniqueSectionsMap.values());

  const toggleSection = (type: string) => {
    setSelectedSections(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAddSections = () => {
    if (selectedSections.length > 0) {
      onAddSections(selectedSections);
      setSelectedSections([]);
      setIsOpen(false);
    }
  };

  if (unseenSections.length === 0) {
    return null; // Don't show the button if there are no more sections to explore
  }

  return (
    <>
      {/* Learn More Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg transition-all"
        style={{ fontFamily: 'Fredoka, sans-serif' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BookOpen className="w-4 h-4" />
        Learn More
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Explore More Content
                </h2>
                <p className="text-white/90 text-sm mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
                  Select sections to add to your viewing experience
                </p>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <div className="space-y-3">
                  {unseenSections.map((section) => (
                    <motion.label
                      key={section.type}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedSections.includes(section.type)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 bg-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(section.type)}
                        onChange={() => toggleSection(section.type)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                          {section.title}
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSections}
                    disabled={selectedSections.length === 0}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {selectedSections.length > 0 ? `(${selectedSections.length})` : ''}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}