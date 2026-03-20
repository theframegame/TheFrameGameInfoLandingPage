import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Users, 
  Mail, 
  Calendar, 
  LogOut,
  Layout,
  Eye,
  Home,
  Type
} from 'lucide-react';
import { toast } from 'sonner';
import { SubscribersTable } from '../components/admin/subscribers-table';
import { EmailTemplateEditor } from '../components/admin/email-template-editor';
import { TimelineEditor } from '../components/admin/timeline-editor';
import { SectionManager } from '../components/admin/section-manager';
import { UserPreview } from '../components/admin/user-preview';
import { LandingPageEditor } from '../components/admin/landing-page-editor';
import { FontManager } from '../components/admin/font-manager';

type Tab = 'landing' | 'subscribers' | 'emails' | 'timelines' | 'sections' | 'preview' | 'fonts';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('sections');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 flex items-center justify-center">
        <div className="text-white text-2xl" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 
                className="text-3xl md:text-4xl font-bold"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-gray-600 mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Manage your content, subscribers, and communications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4" />
                <span className="font-bold text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Home
                </span>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold" style={{ fontFamily: 'Comic Neue, cursive' }}>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs — simplified to 5 clear tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-2 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            <TabButton
              active={activeTab === 'sections'}
              onClick={() => setActiveTab('sections')}
              icon={Layout}
              label="Content Manager"
            />
            <TabButton
              active={activeTab === 'preview'}
              onClick={() => setActiveTab('preview')}
              icon={Eye}
              label="Preview"
            />
            <TabButton
              active={activeTab === 'subscribers'}
              onClick={() => setActiveTab('subscribers')}
              icon={Users}
              label="Subscribers"
            />
            <TabButton
              active={activeTab === 'emails'}
              onClick={() => setActiveTab('emails')}
              icon={Mail}
              label="Email Templates"
            />
            <TabButton
              active={activeTab === 'timelines'}
              onClick={() => setActiveTab('timelines')}
              icon={Calendar}
              label="Timelines"
            />
            <TabButton
              active={activeTab === 'landing'}
              onClick={() => setActiveTab('landing')}
              icon={Home}
              label="Landing Page"
            />
            <TabButton
              active={activeTab === 'fonts'}
              onClick={() => setActiveTab('fonts')}
              icon={Type}
              label="Fonts"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'sections' && <SectionManager />}
          {activeTab === 'preview' && <UserPreview />}
          {activeTab === 'subscribers' && <SubscribersTable />}
          {activeTab === 'emails' && <EmailTemplateEditor />}
          {activeTab === 'timelines' && <TimelineEditor />}
          {activeTab === 'landing' && <LandingPageEditor />}
          {activeTab === 'fonts' && <FontManager />}
        </motion.div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
      style={{ fontFamily: 'Comic Neue, cursive' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  );
}