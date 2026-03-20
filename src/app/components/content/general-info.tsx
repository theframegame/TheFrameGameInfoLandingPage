import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface GeneralInfoProps {
  journeyImage: string;
  creditsImage: string;
}

export function GeneralInfo({ journeyImage, creditsImage }: GeneralInfoProps) {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-4 md:p-6 shadow-2xl h-full max-h-full overflow-hidden flex flex-col">
      <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mx-auto mb-2 flex-shrink-0" />
      <h2 
        className="text-2xl md:text-3xl font-bold mb-2 text-center flex-shrink-0"
        style={{ fontFamily: 'Fredoka, sans-serif' }}
      >
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Our Mission
        </span>
      </h2>
      <p className="text-sm md:text-base text-gray-700 text-center mb-4 flex-shrink-0" style={{ fontFamily: 'Comic Neue, cursive' }}>
        Transforming passive viewing into active creation!
      </p>
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="bg-white rounded-xl p-3 shadow-lg text-center flex flex-col justify-center">
          <div className="text-2xl md:text-3xl mb-2">🎬</div>
          <h3 className="text-sm md:text-base font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Learn
          </h3>
          <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Master filmmaking through fun tutorials
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-lg text-center flex flex-col justify-center">
          <div className="text-2xl md:text-3xl mb-2">🚀</div>
          <h3 className="text-sm md:text-base font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Create
          </h3>
          <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Bring stories to life with powerful tools
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-lg text-center flex flex-col justify-center">
          <div className="text-2xl md:text-3xl mb-2">🏆</div>
          <h3 className="text-sm md:text-base font-bold mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Earn
          </h3>
          <p className="text-[10px] md:text-xs text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Compete for prizes & recognition
          </p>
        </div>
      </div>
    </div>
  );
}
