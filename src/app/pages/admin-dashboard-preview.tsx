import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Mail, 
  Layout,
  Eye,
  Home,
  Type,
  Settings
} from 'lucide-react';
import { SubscribersTable } from '../components/admin/subscribers-table';
import { EmailTemplateEditor } from '../components/admin/email-template-editor';
import { SectionManager } from '../components/admin/section-manager';
import { UserPreview } from '../components/admin/user-preview';
import { LandingPageEditor } from '../components/admin/landing-page-editor';
import { FontManager } from '../components/admin/font-manager';
import { SettingsPanel } from '../components/admin/settings-panel';

type Tab = 'landing' | 'subscribers' | 'emails' | 'sections' | 'preview' | 'fonts' | 'settings';

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
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-semibold" style={{ fontFamily: 'Comic Neue, cursive' }}>
        {label}
      </span>
    </motion.button>
  );
}

/**
 * PREVIEW VERSION OF ADMIN DASHBOARD
 * 
 * This is a special version without authentication for Figma export.
 * Access at: /admin/preview
 * 
 * ⚠️ REMOVE THIS FILE BEFORE PRODUCTION DEPLOYMENT
 * or add password protection in production environment
 */
export function AdminDashboardPreview() {
  const [activeTab, setActiveTab] = useState<Tab>('sections');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Export Notice Banner */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-4 text-center">
          <p className="text-yellow-900 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🎨 PREVIEW MODE - For Figma Export Only
          </p>
          <p className="text-yellow-800 text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>
            This page bypasses authentication for design export. Remove before production!
          </p>
        </div>

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
              <motion.a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4" />
                <span className="font-bold text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Home
                </span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-2 mb-6"
        >
          <div className="flex flex-wrap gap-2 justify-center">
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
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              icon={Settings}
              label="Settings"
            />
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
        >
          {activeTab === 'sections' && <SectionManager />}
          {activeTab === 'preview' && <UserPreview />}
          {activeTab === 'subscribers' && <SubscribersTable />}
          {activeTab === 'emails' && <EmailTemplateEditor />}
          {activeTab === 'landing' && <LandingPageEditor />}
          {activeTab === 'fonts' && <FontManager />}
          {activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </div>
    </div>
  );
}