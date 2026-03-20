import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Subscriber {
  id: string;
  email: string;
  name: string;
  userType: 'filmmaker' | 'parent' | 'educator' | 'teen' | 'investor' | 'donor' | 'just-curious';
  subscribedAt: string;
}

export function SubscribersTable() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No admin token found in localStorage');
        toast.error('Not authenticated. Please log in again.');
        return;
      }
      
      console.log('Fetching subscribers with token:', token.substring(0, 20) + '...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/subscribers`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token,
          },
        }
      );

      console.log('Subscribers response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Subscribers fetch error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch subscribers');
      }

      const data = await response.json();
      console.log('Subscribers data received:', data);
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (subscriber: Subscriber) => {
    setSendingEmail(subscriber.id);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
          body: JSON.stringify({
            subscriberId: subscriber.id,
            templateType: subscriber.userType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success(`Email sent to ${subscriber.email}!`);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Type', 'Subscribed At'];
    const rows = filteredSubscribers.map(sub => [
      sub.name || 'N/A',
      sub.email,
      sub.userType,
      new Date(sub.subscribedAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const filteredSubscribers = filter === 'all' 
    ? subscribers 
    : subscribers.filter(sub => sub.userType === filter);

  const stats = {
    total: subscribers.length,
    filmmaker: subscribers.filter(s => s.userType === 'filmmaker').length,
    parent: subscribers.filter(s => s.userType === 'parent').length,
    educator: subscribers.filter(s => s.userType === 'educator').length,
    teen: subscribers.filter(s => s.userType === 'teen').length,
    investor: subscribers.filter(s => s.userType === 'investor').length,
    donor: subscribers.filter(s => s.userType === 'donor').length,
    'just-curious': subscribers.filter(s => s.userType === 'just-curious').length,
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
        <p className="mt-4 text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Loading subscribers...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} color="purple" />
        <StatCard label="Filmmakers" value={stats.filmmaker} color="yellow" />
        <StatCard label="Parents" value={stats.parent} color="pink" />
        <StatCard label="Educators" value={stats.educator} color="green" />
        <StatCard label="Teens" value={stats.teen} color="blue" />
        <StatCard label="Investors" value={stats.investor} color="orange" />
        <StatCard label="Donors" value={stats.donor} color="red" />
        <StatCard label="Just Curious" value={stats['just-curious']} color="gray" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
            <FilterButton active={filter === 'filmmaker'} onClick={() => setFilter('filmmaker')} label="Filmmakers" />
            <FilterButton active={filter === 'parent'} onClick={() => setFilter('parent')} label="Parents" />
            <FilterButton active={filter === 'educator'} onClick={() => setFilter('educator')} label="Educators" />
            <FilterButton active={filter === 'teen'} onClick={() => setFilter('teen')} label="Teens" />
            <FilterButton active={filter === 'investor'} onClick={() => setFilter('investor')} label="Investors" />
            <FilterButton active={filter === 'donor'} onClick={() => setFilter('donor')} label="Donors" />
            <FilterButton active={filter === 'just-curious'} onClick={() => setFilter('just-curious')} label="Just Curious" />
          </div>

          <motion.button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
            style={{ fontFamily: 'Comic Neue, cursive' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>Name</th>
                <th className="px-6 py-4 text-left font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>Email</th>
                <th className="px-6 py-4 text-left font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>Type</th>
                <th className="px-6 py-4 text-left font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>Subscribed</th>
                <th className="px-6 py-4 text-left font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    No subscribers yet. Share your landing page to get started!
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber, idx) => (
                  <tr 
                    key={subscriber.id} 
                    className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="px-6 py-4" style={{ fontFamily: 'Comic Neue, cursive' }}>
                      {subscriber.name || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4" style={{ fontFamily: 'Comic Neue, cursive' }}>
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={subscriber.userType} />
                    </td>
                    <td className="px-6 py-4 text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        onClick={() => handleSendEmail(subscriber)}
                        disabled={sendingEmail === subscriber.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        style={{ fontFamily: 'Comic Neue, cursive' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sendingEmail === subscriber.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span className="text-sm">Send Email</span>
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-400 to-orange-500',
    pink: 'from-pink-500 to-red-500',
    green: 'from-green-400 to-cyan-500',
    blue: 'from-blue-400 to-cyan-500',
    orange: 'from-orange-400 to-red-500',
    red: 'from-red-400 to-pink-500',
    gray: 'from-gray-400 to-gray-500',
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colorClasses} rounded-2xl p-6 text-white shadow-lg`}
    >
      <p className="text-sm opacity-90" style={{ fontFamily: 'Comic Neue, cursive' }}>{label}</p>
      <p className="text-4xl font-bold mt-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>{value}</p>
    </motion.div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      style={{ fontFamily: 'Comic Neue, cursive' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config = {
    'filmmaker': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Filmmaker' },
    'parent': { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Parent' },
    'educator': { bg: 'bg-green-100', text: 'text-green-700', label: 'Educator' },
    'teen': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Teen' },
    'investor': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Investor' },
    'donor': { bg: 'bg-red-100', text: 'text-red-700', label: 'Donor' },
    'just-curious': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Just Curious' },
  }[type] || { bg: 'bg-gray-100', text: 'text-gray-700', label: type };

  return (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
      style={{ fontFamily: 'Comic Neue, cursive' }}
    >
      {config.label}
    </span>
  );
}