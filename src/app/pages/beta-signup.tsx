import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, Mail, User, Phone, MessageSquare, ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function BetaSignupPage() {
  console.log('BetaSignupPage rendering');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    interests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [content, setContent] = useState<any>(null);

  // Load editable content from sections
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/sections`,
          {
            headers: { Authorization: `Bearer ${publicAnonKey}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const betaPageSection = data.sections?.find((s: any) => s.type === 'beta-page');
          if (betaPageSection?.editableContent) {
            setContent(betaPageSection.editableContent);
          }
        }
      } catch (error) {
        console.error('Error loading beta page content:', error);
      }
    };
    loadContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/beta-signup`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            experience: formData.experience,
            interests: formData.interests,
          }),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Welcome to the Beta Program! 🎉');
        setFormData({ name: '', email: '', phone: '', experience: '', interests: '' });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting beta form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Default content for fallback
  const heroHeading = content?.heading || 'Join the Beta Program';
  const heroSubheading = content?.subheading || 'Get early access, exclusive rewards, and help shape the future of Frame Game!';
  const benefits = content?.bodyText?.split('\n').map((line: string) => {
    const match = line.match(/^(.*?)\s—\s(.*)$/);
    if (match) {
      const iconMatch = match[1].match(/([\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}])\s*(.*)$/u);
      if (iconMatch) {
        return { icon: iconMatch[1], title: iconMatch[2], description: match[2] };
      }
    }
    return null;
  }).filter(Boolean) || [
    { icon: '⚡', title: 'Early Access', description: 'Be the first to try new features' },
    { icon: '🎁', title: 'Exclusive Rewards', description: 'Compete for cash prizes & recognition' },
    { icon: '✨', title: 'Shape the Future', description: 'Your feedback drives our development' },
    { icon: '🏆', title: 'Founding Member Status', description: 'Permanent recognition in our community' },
  ];

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4"
        style={content?.imageUrl ? { backgroundImage: `url(${content.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="relative inline-block mb-6">
              <Rocket className="w-20 h-20 text-orange-500" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Zap className="w-8 h-8 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>
          <h1
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            You're In! 🎉
          </h1>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Welcome to The Frame Game Beta Program! We'll send you exclusive updates, early access invitations, and beta testing opportunities.
          </p>
          <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-4 mb-8">
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
              <strong className="text-orange-600">What's Next?</strong><br />
              Check your email for your beta welcome package and instructions on how to get started!
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => setIsSubmitted(false)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Again
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold transition-all"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-4 md:p-8"
      style={content?.imageUrl ? { backgroundImage: `url(${content.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </motion.button>

        {/* Beta Signup Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-4"
            >
              <Rocket className="w-12 h-12 text-orange-600" />
            </motion.div>
            <h1
              className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              {heroHeading}
            </h1>
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {heroSubheading}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-orange-100 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-orange-200">
            <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <Zap className="w-5 h-5" />
              Beta Tester Benefits:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {benefits.map((benefit: any, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500">{benefit.icon}</span>
                  <span><strong>{benefit.title}</strong> — {benefit.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <User className="w-4 h-4 text-orange-600" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                style={{ fontFamily: 'Comic Neue, cursive' }}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <Mail className="w-4 h-4 text-orange-600" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                style={{ fontFamily: 'Comic Neue, cursive' }}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <Phone className="w-4 h-4 text-orange-600" />
                Phone Number (optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                style={{ fontFamily: 'Comic Neue, cursive' }}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <MessageSquare className="w-4 h-4 text-orange-600" />
                Your Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                style={{ fontFamily: 'Comic Neue, cursive' }}
              >
                <option value="">Select your experience...</option>
                <option value="beginner">Beginner — Just starting out</option>
                <option value="intermediate">Intermediate — Some video experience</option>
                <option value="advanced">Advanced — Regular content creator</option>
                <option value="professional">Professional — Industry experience</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <MessageSquare className="w-4 h-4 text-orange-600" />
                What interests you most about Frame Game?
              </label>
              <textarea
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="Tell us what you're excited about..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                style={{ fontFamily: 'Comic Neue, cursive' }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Join Beta Program
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
              We'll review your application and send you beta access details soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}