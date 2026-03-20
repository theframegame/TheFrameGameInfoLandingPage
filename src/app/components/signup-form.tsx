import { useState } from 'react';
import { motion } from 'motion/react';
import { Film, Users, GraduationCap, Sparkles, TrendingUp, Heart, HelpCircle } from 'lucide-react';
import type { LandingPageConfig } from './admin/landing-page-editor';
import { textStyleToCSS } from './admin/landing-page-editor';

export type UserType = 'filmmaker' | 'parent' | 'educator' | 'teen' | 'investor' | 'donor' | 'just-curious' | null;

// Map of built-in icons by type key
const ICON_MAP: Record<string, React.ElementType> = {
  filmmaker: Film,
  parent: Users,
  educator: GraduationCap,
  teen: Sparkles,
  investor: TrendingUp,
  donor: Heart,
  'just-curious': HelpCircle,
};

interface SignupFormProps {
  onSubscribe: (email: string, name: string, userType: UserType) => void;
  isSubmitting: boolean;
  config?: LandingPageConfig | null;
}

export function SignupForm({ onSubscribe, isSubmitting, config }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<UserType>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubscribe(email, name, selectedType);
  };

  // Use admin-configured user types if available, otherwise defaults
  const userTypes = config?.userTypes?.filter(ut => ut.enabled)?.map(ut => ({
    type: ut.type as UserType,
    label: ut.label,
    icon: ICON_MAP[ut.type] || HelpCircle,
    emoji: ut.icon,
    color: ut.gradient,
    description: ut.description,
  })) || [
    { type: 'filmmaker' as const, label: 'Filmmaker', icon: Film, emoji: '\uD83C\uDFAC', color: 'from-purple-400 to-indigo-500', description: 'Create amazing content' },
    { type: 'parent' as const, label: 'Parent', icon: Users, emoji: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67', color: 'from-blue-400 to-cyan-500', description: 'Support your child' },
    { type: 'educator' as const, label: 'Educator', icon: GraduationCap, emoji: '\uD83C\uDF93', color: 'from-green-400 to-emerald-500', description: 'Teach with us' },
    { type: 'teen' as const, label: 'Teen', icon: Sparkles, emoji: '\u2728', color: 'from-yellow-400 to-orange-500', description: 'Learn and create' },
    { type: 'investor' as const, label: 'Investor', icon: TrendingUp, emoji: '\uD83D\uDCC8', color: 'from-green-500 to-teal-600', description: 'Join our journey' },
    { type: 'donor' as const, label: 'Donor', icon: Heart, emoji: '\u2764\uFE0F', color: 'from-pink-500 to-red-500', description: 'Support arts education' },
    { type: 'just-curious' as const, label: 'Just Curious', icon: HelpCircle, emoji: '\u2753', color: 'from-gray-400 to-gray-600', description: 'Learn more' },
  ];

  const formTitle = config?.signup?.title || 'Join The Frame Game!';
  const selectorLabel = config?.signup?.selectorLabel || 'I am a...';
  const nameLabel = config?.signup?.nameLabel || 'Name (optional)';
  const nameRequired = config?.signup?.nameRequired || false;
  const emailLabel = config?.signup?.emailLabel || 'Email *';
  const submitText = config?.signup?.submitText || "Let's Go! \uD83D\uDE80";

  const ts = config?.textStyles;

  const titleCSS = ts?.signupTitle
    ? textStyleToCSS(ts.signupTitle)
    : { fontFamily: 'Fredoka, sans-serif' };

  const selectorCSS = ts?.signupSelectorLabel
    ? textStyleToCSS(ts.signupSelectorLabel)
    : { fontFamily: 'Comic Neue, cursive' };

  const buttonCSS = ts?.signupButton
    ? textStyleToCSS(ts.signupButton)
    : { fontFamily: 'Fredoka, sans-serif' };

  const cardLabelCSS = ts?.userTypeLabel
    ? textStyleToCSS(ts.userTypeLabel)
    : { fontFamily: 'Fredoka, sans-serif' };

  const cardDescCSS = ts?.userTypeDescription
    ? textStyleToCSS(ts.userTypeDescription)
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-12"
    >
      <h3 
        className="text-3xl md:text-4xl text-center mb-6"
        style={titleCSS}
      >
        {formTitle}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Selection */}
        <div>
          <label className="block mb-4" style={selectorCSS}>
            {selectorLabel}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userTypes.map(({ type, label, icon: Icon, emoji, color, description }) => (
              <motion.button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`relative p-4 rounded-2xl border-4 transition-all ${
                  selectedType === type
                    ? 'border-purple-600 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-xl`}></div>
                {/* Show emoji if config provides one, otherwise the lucide icon */}
                {emoji ? (
                  <div className="text-3xl mx-auto mb-2 text-center">{emoji}</div>
                ) : (
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    selectedType === type ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                )}
                <div className="text-center">
                  <p className="text-sm" style={cardLabelCSS}>
                    {label}
                  </p>
                  <p className="text-xs mt-1" style={cardDescCSS}>
                    {description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block mb-2" style={selectorCSS}>
            {nameLabel}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your awesome name"
            required={nameRequired}
            className="w-full px-4 py-3 border-3 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-lg"
            style={{ fontFamily: 'Comic Neue, cursive' }}
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block mb-2" style={selectorCSS}>
            {emailLabel}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full px-4 py-3 border-3 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-lg"
            style={{ fontFamily: 'Comic Neue, cursive' }}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !email || !selectedType}
          className={`w-full py-4 rounded-2xl shadow-lg transition-all ${
            isSubmitting || !email || !selectedType
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          }`}
          style={buttonCSS}
          whileHover={!isSubmitting && email && selectedType ? { scale: 1.05 } : {}}
          whileTap={!isSubmitting && email && selectedType ? { scale: 0.95 } : {}}
        >
          {isSubmitting ? 'Joining...' : submitText}
        </motion.button>
      </form>
    </motion.div>
  );
}
