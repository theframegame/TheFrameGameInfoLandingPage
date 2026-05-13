import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Mail, Calendar, User, Rocket, Trash2, RefreshCw, Phone, Award } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface BetaApplicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  experience?: string;
  interests?: string;
  submittedAt: string;
  userType: string;
}

export function BetaApplicants() {
  const [applicants, setApplicants] = useState<BetaApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<BetaApplicant | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/beta-applicants`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplicants(data.applicants || []);
      } else {
        toast.error('Failed to load beta applicants');
      }
    } catch (error) {
      console.error('Error fetching beta applicants:', error);
      toast.error('Error loading applicants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this applicant?')) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/subscribers/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Applicant deleted');
        setApplicants(applicants.filter(a => a.id !== id));
        if (selectedApplicant?.id === id) {
          setSelectedApplicant(null);
        }
      } else {
        toast.error('Failed to delete applicant');
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
      toast.error('Error deleting applicant');
    }
  };

  const handleExportCSV = () => {
    if (applicants.length === 0) {
      toast.error('No applicants to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Experience Level', 'Interests', 'Submitted At'];
    const rows = applicants.map(a => [
      a.name,
      a.email,
      a.phone || '',
      a.experience || '',
      (a.interests || '').replace(/\n/g, ' ').replace(/"/g, '""'),
      new Date(a.submittedAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beta-applicants-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
  };

  const getExperienceBadge = (experience?: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      beginner: { label: 'Beginner', color: 'bg-blue-100 text-blue-700' },
      intermediate: { label: 'Intermediate', color: 'bg-green-100 text-green-700' },
      advanced: { label: 'Advanced', color: 'bg-purple-100 text-purple-700' },
      professional: { label: 'Professional', color: 'bg-orange-100 text-orange-700' },
    };
    const badge = badges[experience || ''] || { label: 'Not specified', color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        <Award className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span style={{ fontFamily: 'Comic Neue, cursive' }}>Loading applicants...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Beta Program Applicants
            </h2>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={fetchApplicants}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
            <motion.button
              onClick={handleExportCSV}
              disabled={applicants.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: applicants.length > 0 ? 1.05 : 1 }}
              whileTap={{ scale: applicants.length > 0 ? 0.95 : 1 }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      {applicants.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg" style={{ fontFamily: 'Comic Neue, cursive' }}>
            No beta applicants yet
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Applicants List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3 max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              All Applicants
            </h3>
            {applicants.map((applicant) => (
              <motion.div
                key={applicant.id}
                onClick={() => setSelectedApplicant(applicant)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedApplicant?.id === applicant.id
                    ? 'bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-300'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="font-bold text-sm truncate" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                        {applicant.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Comic Neue, cursive' }}>
                        {applicant.email}
                      </span>
                    </div>
                    <div className="mb-1">
                      {getExperienceBadge(applicant.experience)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
                        {new Date(applicant.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(applicant.id);
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Applicant Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {selectedApplicant ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Applicant Details
                </h3>

                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <User className="w-3 h-3" />
                    Name
                  </label>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {selectedApplicant.name}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedApplicant.email}`}
                    className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                    style={{ fontFamily: 'Comic Neue, cursive' }}
                  >
                    {selectedApplicant.email}
                  </a>
                </div>

                {/* Phone */}
                {selectedApplicant.phone && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </label>
                    <p className="text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>
                      {selectedApplicant.phone}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <Award className="w-3 h-3" />
                    Experience Level
                  </label>
                  <div className="mt-1">
                    {getExperienceBadge(selectedApplicant.experience)}
                  </div>
                </div>

                {/* Interests */}
                {selectedApplicant.interests && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                      <Rocket className="w-3 h-3" />
                      Interests
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm whitespace-pre-wrap" style={{ fontFamily: 'Comic Neue, cursive' }}>
                      {selectedApplicant.interests}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <Calendar className="w-3 h-3" />
                    Submitted
                  </label>
                  <p className="text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    {new Date(selectedApplicant.submittedAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <motion.a
                    href={`mailto:${selectedApplicant.email}?subject=Welcome to Frame Game Beta!`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-bold"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </motion.a>
                  <motion.button
                    onClick={() => handleDelete(selectedApplicant.id)}
                    className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold transition-colors"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Rocket className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
                  Select an applicant to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
