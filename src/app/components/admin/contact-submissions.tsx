import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Mail, Calendar, User, MessageSquare, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/contact`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } else {
        toast.error('Failed to load contact submissions');
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Error loading submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/contact/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Submission deleted');
        setSubmissions(submissions.filter(s => s.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      } else {
        toast.error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Error deleting submission');
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }

    const headers = ['Name', 'Email', 'Subject', 'Message', 'Submitted At'];
    const rows = submissions.map(s => [
      s.name,
      s.email,
      s.subject,
      s.message.replace(/\n/g, ' ').replace(/"/g, '""'),
      new Date(s.submittedAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span style={{ fontFamily: 'Comic Neue, cursive' }}>Loading submissions...</span>
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Contact Submissions
            </h2>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={fetchSubmissions}
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
              disabled={submissions.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: submissions.length > 0 ? 1.05 : 1 }}
              whileTap={{ scale: submissions.length > 0 ? 0.95 : 1 }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg" style={{ fontFamily: 'Comic Neue, cursive' }}>
            No contact submissions yet
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3 max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              All Submissions
            </h3>
            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedSubmission?.id === submission.id
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="font-bold text-sm truncate" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                        {submission.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Comic Neue, cursive' }}>
                        {submission.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(submission.id);
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

          {/* Submission Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {selectedSubmission ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Submission Details
                </h3>

                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <User className="w-3 h-3" />
                    Name
                  </label>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {selectedSubmission.name}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                    style={{ fontFamily: 'Comic Neue, cursive' }}
                  >
                    {selectedSubmission.email}
                  </a>
                </div>

                {/* Subject */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <MessageSquare className="w-3 h-3" />
                    Subject
                  </label>
                  <p className="text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    {selectedSubmission.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <MessageSquare className="w-3 h-3" />
                    Message
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm whitespace-pre-wrap" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    {selectedSubmission.message}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1">
                    <Calendar className="w-3 h-3" />
                    Submitted
                  </label>
                  <p className="text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <motion.a
                    href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-4 h-4" />
                    Reply
                  </motion.a>
                  <motion.button
                    onClick={() => handleDelete(selectedSubmission.id)}
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
                <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
                  Select a submission to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
