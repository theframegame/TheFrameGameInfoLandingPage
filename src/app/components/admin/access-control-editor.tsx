import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

type UserType = 'filmmaker' | 'parent' | 'educator' | 'teen' | 'investor' | 'donor' | 'just-curious';
type ContentSection = 
  | 'studio-demo' 
  | 'dashboard-demo' 
  | 'camera-overlay-demo'
  | 'beta-info' 
  | 'parent-educator-info' 
  | 'investor-info' 
  | 'general-info';

interface AccessControlConfig {
  [key: string]: ContentSection[];
}

const ALL_SECTIONS: { id: ContentSection; label: string }[] = [
  { id: 'studio-demo', label: 'Frame Game Studio Demo' },
  { id: 'dashboard-demo', label: 'Teacher/Student Dashboard Demo' },
  { id: 'camera-overlay-demo', label: 'Camera Overlay Demo' },
  { id: 'beta-info', label: 'Beta Tester Information' },
  { id: 'parent-educator-info', label: 'Parent/Educator Information' },
  { id: 'investor-info', label: 'Investor Information' },
  { id: 'general-info', label: 'General Information' },
];

const USER_TYPES: { id: UserType; label: string }[] = [
  { id: 'filmmaker', label: 'Filmmaker' },
  { id: 'parent', label: 'Parent' },
  { id: 'educator', label: 'Educator' },
  { id: 'teen', label: 'Teen' },
  { id: 'investor', label: 'Investor' },
  { id: 'donor', label: 'Donor' },
  { id: 'just-curious', label: 'Just Curious' },
];

export function AccessControlEditor() {
  const [config, setConfig] = useState<AccessControlConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeUserType, setActiveUserType] = useState<UserType>('filmmaker');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/access-control`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch config');
      }

      const data = await response.json();
      setConfig(data.config);
    } catch (error) {
      console.error('Error fetching config:', error);
      toast.error('Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/access-control`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
          body: JSON.stringify({ config }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save config');
      }

      toast.success('Access control saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section: ContentSection) => {
    setConfig(prev => {
      const userSections = prev[activeUserType] || [];
      const hasSection = userSections.includes(section);
      
      return {
        ...prev,
        [activeUserType]: hasSection
          ? userSections.filter(s => s !== section)
          : [...userSections, section]
      };
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    setConfig(prev => {
      const userSections = [...(prev[activeUserType] || [])];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= userSections.length) return prev;
      
      [userSections[index], userSections[newIndex]] = [userSections[newIndex], userSections[index]];
      
      return {
        ...prev,
        [activeUserType]: userSections
      };
    });
  };

  const userSections = config[activeUserType] || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
        <p className="mt-4 text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Loading configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Type Selector */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Configure Access For:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {USER_TYPES.map(({ id, label }) => (
            <motion.button
              key={id}
              onClick={() => setActiveUserType(id)}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                activeUserType === id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Comic Neue, cursive' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Sections Editor */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Sections */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Available Content Sections
          </h3>
          <div className="space-y-2">
            {ALL_SECTIONS.map(({ id, label }) => {
              const isActive = userSections.includes(id);
              return (
                <motion.button
                  key={id}
                  onClick={() => toggleSection(id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-100 border-2 border-purple-600'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-semibold text-left" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    {label}
                  </span>
                  {isActive ? (
                    <Eye className="w-5 h-5 text-purple-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Active Sections (Order) */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Content Order for {USER_TYPES.find(t => t.id === activeUserType)?.label}
          </h3>
          
          {userSections.length === 0 ? (
            <div className="text-center py-8 text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
              No content sections selected. Choose from the left to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {userSections.map((sectionId, index) => {
                const section = ALL_SECTIONS.find(s => s.id === sectionId);
                return (
                  <motion.div
                    key={sectionId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
                  >
                    <div className="flex flex-col gap-1">
                      <motion.button
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-purple-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === userSections.length - 1}
                        className="p-1 hover:bg-purple-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="font-semibold" style={{ fontFamily: 'Comic Neue, cursive' }}>
                          {section?.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
          whileHover={!isSaving ? { scale: 1.02 } : {}}
          whileTap={!isSaving ? { scale: 0.98 } : {}}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              Save Access Control Configuration
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}