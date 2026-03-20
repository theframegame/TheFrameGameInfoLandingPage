import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface EmailTemplate {
  userType: 'beta-tester' | 'donor' | 'investor';
  subject: string;
  body: string;
}

export function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'beta-tester' | 'donor' | 'investor'>('beta-tester');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No admin token found in localStorage');
        toast.error('Not authenticated. Please log in again.');
        return;
      }
      
      console.log('Fetching email templates with token:', token.substring(0, 20) + '...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/email-templates`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token,
          },
        }
      );

      console.log('Email templates response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Email templates fetch error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch templates');
      }

      const data = await response.json();
      console.log('Email templates data received:', data);
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (template: EmailTemplate) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/email-templates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
          body: JSON.stringify(template),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      toast.success('Template saved successfully!');
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTemplate = templates.find(t => t.userType === activeTemplate);

  const handleUpdateTemplate = (field: 'subject' | 'body', value: string) => {
    setTemplates(prev => 
      prev.map(t => 
        t.userType === activeTemplate 
          ? { ...t, [field]: value }
          : t
      )
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
        <p className="mt-4 text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Loading templates...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex gap-3">
          <TemplateButton
            active={activeTemplate === 'beta-tester'}
            onClick={() => setActiveTemplate('beta-tester')}
            label="Beta Tester"
            color="yellow"
          />
          <TemplateButton
            active={activeTemplate === 'donor'}
            onClick={() => setActiveTemplate('donor')}
            label="Donor"
            color="pink"
          />
          <TemplateButton
            active={activeTemplate === 'investor'}
            onClick={() => setActiveTemplate('investor')}
            label="Investor"
            color="green"
          />
        </div>
      </div>

      {/* Editor */}
      {currentTemplate && (
        <motion.div
          key={activeTemplate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Email Subject
              </label>
              <input
                type="text"
                value={currentTemplate.subject}
                onChange={(e) => handleUpdateTemplate('subject', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-lg"
                style={{ fontFamily: 'Comic Neue, cursive' }}
                placeholder="Email subject line"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Email Body
              </label>
              <textarea
                value={currentTemplate.body}
                onChange={(e) => handleUpdateTemplate('body', e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-lg font-mono"
                placeholder="Email body text. Use {name} as a placeholder for the subscriber's name."
              />
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
                💡 Tip: Use <code className="bg-gray-100 px-2 py-1 rounded">{'{name}'}</code> to personalize with subscriber's name
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => handleSave(currentTemplate)}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                whileHover={!isSaving ? { scale: 1.05 } : {}}
                whileTap={!isSaving ? { scale: 0.95 } : {}}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Saving...' : 'Save Template'}
              </motion.button>

              <motion.button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-colors"
                style={{ fontFamily: 'Comic Neue, cursive' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </motion.button>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200"
            >
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Preview
              </h3>
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="font-bold text-lg mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Subject: {currentTemplate.subject}
                </p>
                <div className="whitespace-pre-wrap" style={{ fontFamily: 'Comic Neue, cursive' }}>
                  {currentTemplate.body.replace('{name}', 'John Doe')}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function TemplateButton({ active, onClick, label, color }: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  color: string;
}) {
  const colorClasses = {
    yellow: active ? 'from-yellow-400 to-orange-500' : 'bg-yellow-100 text-yellow-700',
    pink: active ? 'from-pink-500 to-red-500' : 'bg-pink-100 text-pink-700',
    green: active ? 'from-green-400 to-cyan-500' : 'bg-green-100 text-green-700',
  }[color];

  return (
    <motion.button
      onClick={onClick}
      className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-all ${
        active
          ? `bg-gradient-to-r ${colorClasses} text-white shadow-lg`
          : `${colorClasses} hover:opacity-80`
      }`}
      style={{ fontFamily: 'Fredoka, sans-serif' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
}