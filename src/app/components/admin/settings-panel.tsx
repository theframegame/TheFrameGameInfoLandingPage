import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Save, Loader2, ShieldCheck, Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API = `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828`;

export function SettingsPanel() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both current and new password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
          'X-Admin-Token': token || '',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      toast.success('Password changed successfully! Use the new password next time you log in.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Change Admin Password
            </h2>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Update the password used to log into this dashboard
            </p>
          </div>
        </div>

        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors"
              placeholder="Minimum 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors"
              placeholder="Re-enter new password"
            />
          </div>

          <motion.button
            onClick={handleChangePassword}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-colors"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving…' : 'Update Password'}
          </motion.button>
        </div>
      </div>

      {/* Export Info */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Data Export
            </h2>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
              How to export your subscriber data
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800" style={{ fontFamily: 'Comic Neue, cursive' }}>
              <p className="font-bold mb-2">CSV Export is available in the Subscribers tab:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to the <strong>Subscribers</strong> tab</li>
                <li>Optionally filter by visitor type (Filmmaker, Parent, etc.)</li>
                <li>Click the <strong>"Export CSV"</strong> button</li>
                <li>A <code>.csv</code> file will download containing Name, Email, Type, and Date</li>
              </ol>
              <p className="mt-3">The export respects your active filter — so you can export just Investors, just Educators, or everyone at once.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Security Notes
            </h2>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <ul className="text-sm text-blue-800 space-y-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
            <li>• Your admin password is stored securely as a server-side environment variable</li>
            <li>• Changing your password here updates it in the backend KV store and takes effect immediately</li>
            <li>• The password is never sent to the browser — only validated server-side</li>
            <li>• Admin sessions use token-based auth that expires when you log out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
