import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import type { UserType } from './landing-page';

interface SectionData {
  type: string;
  title: string;
  enabled: boolean;
  visibleTo?: string[];
  order: number;
}

export function ExplorePage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [userType, setUserType] = useState<UserType>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('frameGameUser');
    if (!userData) {
      // No user data, redirect to landing page
      navigate('/');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setUserType(parsed.userType);
      setUserName(parsed.name || 'Explorer');
      
      // Fetch sections - moved inside try block so parsed is in scope
      fetchSections(parsed.userType);
    } catch (err) {
      console.error('Failed to parse user data:', err);
      navigate('/');
      return;
    }
  }, [navigate]);

  const fetchSections = async (type: UserType) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/sections/public`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const allSections = data.sections || [];
        
        // Filter: only enabled sections visible to this user type
        const visibleSections = allSections
          .filter((s: any) => s.enabled)
          .filter((s: any) => !s.visibleTo || s.visibleTo.length === 0 || s.visibleTo.includes(type))
          .sort((a: any, b: any) => a.order - b.order);
        
        setSections(visibleSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewContent = () => {
    // Navigate back to landing page which will show content sections
    navigate('/');
  };

  const getUserTypeLabel = (type: UserType): string => {
    switch (type) {
      case 'filmmaker': return 'Filmmaker';
      case 'parent': return 'Parent';
      case 'educator': return 'Educator';
      case 'student': return 'Student';
      case 'investor': return 'Investor';
      case 'donor': return 'Donor';
      case 'just-curious': return 'Curious Explorer';
      default: return 'Explorer';
    }
  };

  const getSectionEmoji = (type: string): string => {
    const emojiMap: Record<string, string> = {
      'studio-demo': '🎬',
      'dashboard-demo': '📊',
      'camera-overlay-demo': '📸',
      'beta-info': '🚀',
      'parent-educator-info': '👨‍👩‍👧',
      'investor-info': '💼',
      'general-info': '📚',
      'custom-html': '✨',
      'custom-embed': '🔗',
      'custom-canvas': '🎨',
    };
    return emojiMap[type] || '📄';
  };

  const getSectionGradient = (index: number): string => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500',
      'from-yellow-500 to-orange-500',
      'from-cyan-500 to-blue-500',
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-950/80 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Back to Timeline
            </span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              The Frame Game
            </h1>
            <p className="text-sm text-purple-300" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Explore Content
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Welcome, <span className="text-purple-400 font-bold">{userName}</span>
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {getUserTypeLabel(userType)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl"
          >
            <span className="text-5xl">🎬</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Explore All Content
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Discover everything The Frame Game has to offer, curated just for you as a <span className="text-purple-400 font-bold">{getUserTypeLabel(userType)}</span>
          </p>
        </motion.div>

        {/* Section Grid */}
        {sections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-700 hover:border-purple-500 transition-all shadow-lg hover:shadow-2xl hover:scale-105 cursor-pointer h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getSectionGradient(index)} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{getSectionEmoji(section.type)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 flex-grow" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    Click to view this content in the timeline
                  </p>

                  {/* View Button */}
                  <button
                    onClick={handleViewContent}
                    className={`w-full py-2 px-4 bg-gradient-to-r ${getSectionGradient(index)} rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    <Play className="w-4 h-4" />
                    View Content
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-xl text-gray-400" style={{ fontFamily: 'Comic Neue, cursive' }}>
              No content available at this time
            </p>
          </motion.div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-2xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Ready to Dive In?
          </h3>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Return to your personalized timeline and explore all {sections.length} sections
          </p>
          <button
            onClick={handleViewContent}
            className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Back to Timeline
          </button>
        </motion.div>
      </div>
    </div>
  );
}