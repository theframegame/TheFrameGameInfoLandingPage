import { useState } from 'react';
import { Eye, Monitor, Users, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserType } from '../../pages/landing-page';
import { ContentSections } from '../content-sections';
const journeyImage = 'https://images.unsplash.com/photo-1638893388548-2894f01b1836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwbGVhcm5pbmclMjBjcmVhdGl2aXR5JTIwdGVhbXdvcmslMjBlZHVjYXRpb24lMjBqb3VybmV5fGVufDF8fHx8MTc3ODY3OTM1Nnww&ixlib=rb-4.1.0&q=80&w=1080';
const creditsImage = 'https://images.unsplash.com/photo-1639465294781-d4d5d7319951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHN1Y2Nlc3MlMjByZXdhcmQlMjBzdGFycyUyMHRyb3BoeSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3ODY3OTM1OXww&ixlib=rb-4.1.0&q=80&w=1080';

const USER_TYPES: { value: UserType; label: string; emoji: string; color: string }[] = [
  { value: 'filmmaker', label: 'Filmmaker', emoji: '🎬', color: 'from-red-500 to-orange-500' },
  { value: 'parent', label: 'Parent', emoji: '👨‍👩‍👧', color: 'from-blue-500 to-cyan-500' },
  { value: 'educator', label: 'Educator', emoji: '📚', color: 'from-green-500 to-emerald-500' },
  { value: 'teen', label: 'Teen', emoji: '🎮', color: 'from-purple-500 to-pink-500' },
  { value: 'investor', label: 'Investor', emoji: '💼', color: 'from-yellow-500 to-amber-500' },
  { value: 'donor', label: 'Donor', emoji: '💝', color: 'from-pink-500 to-rose-500' },
  { value: 'just-curious', label: 'Just Curious', emoji: '🔍', color: 'from-indigo-500 to-violet-500' },
];

export function UserPreview() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const handleSelectType = (type: UserType) => {
    setSelectedType(type);
    setPreviewKey(prev => prev + 1); // Force re-mount to refetch data
  };

  const handleClose = () => {
    setSelectedType(null);
    setIsFullscreen(false);
  };

  // Fullscreen overlay mode
  if (isFullscreen && selectedType) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-gray-900"
        >
          {/* Floating admin toolbar */}
          <div className="absolute top-4 right-4 z-[10000] flex items-center gap-2">
            <div
              className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl border border-white/10"
            >
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Previewing as:
              </span>
              <select
                value={selectedType || ''}
                onChange={(e) => handleSelectType(e.target.value as UserType)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm font-semibold cursor-pointer"
                style={{ fontFamily: 'Comic Neue, cursive' }}
              >
                {USER_TYPES.map(ut => (
                  <option key={ut.value} value={ut.value!} className="text-black">
                    {ut.emoji} {ut.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Exit fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full content sections experience */}
          <ContentSections
            key={previewKey}
            userType={selectedType}
            journeyImage={journeyImage}
            creditsImage={creditsImage}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Monitor className="w-10 h-10 text-green-600" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              User Experience Preview
            </span>
          </h2>
          <p className="text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
            See exactly what each visitor type sees — without leaving the dashboard
          </p>
        </div>
      </div>

      {/* User Type Selection Grid */}
      {!selectedType && (
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            <Users className="w-5 h-5 text-purple-600" />
            Choose a user type to preview:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {USER_TYPES.map((ut) => (
              <motion.button
                key={ut.value}
                onClick={() => handleSelectType(ut.value)}
                className={`relative overflow-hidden bg-gradient-to-br ${ut.color} text-white rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-shadow`}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="text-3xl mb-2">{ut.emoji}</div>
                <div className="font-bold text-base" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {ut.label}
                </div>
                <div className="text-xs mt-1 text-white/80" style={{ fontFamily: 'Comic Neue, cursive' }}>
                  Click to preview
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-white/10 rounded-full" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Inline Preview */}
      {selectedType && !isFullscreen && (
        <div>
          {/* Preview Controls Bar */}
          <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl px-5 py-3">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-green-400" />
              <span className="text-white font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Previewing as:
              </span>
              <div className="flex gap-2 flex-wrap">
                {USER_TYPES.map((ut) => (
                  <button
                    key={ut.value}
                    onClick={() => handleSelectType(ut.value)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedType === ut.value
                        ? `bg-gradient-to-r ${ut.color} text-white shadow-lg`
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                    style={{ fontFamily: 'Comic Neue, cursive' }}
                  >
                    {ut.emoji} {ut.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen
              </motion.button>
              <motion.button
                onClick={handleClose}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Close preview"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Embedded Preview - acts like an iframe showing the full experience */}
          <div className="relative rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl" style={{ height: '70vh' }}>
            {/* Browser chrome mockup */}
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-lg px-4 py-1 text-gray-400 text-xs text-center" style={{ fontFamily: 'monospace' }}>
                  theframegame.com — viewing as {USER_TYPES.find(u => u.value === selectedType)?.label}
                </div>
              </div>
            </div>

            {/* Actual content preview */}
            <div className="h-[calc(100%-36px)] overflow-hidden relative">
              <ContentSections
                key={previewKey}
                userType={selectedType}
                journeyImage={journeyImage}
                creditsImage={creditsImage}
                embedded
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}