import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token
      localStorage.setItem('adminToken', data.token);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Login
            </span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full px-4 py-3 border-3 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-lg"
              style={{ fontFamily: 'Comic Neue, cursive' }}
            />
            <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Default password: <code className="bg-gray-100 px-2 py-1 rounded">frameGameAdmin2026</code>
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !password}
            className={`w-full py-4 rounded-2xl text-white text-xl font-bold shadow-lg transition-all ${
              isLoading || !password
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
            style={{ fontFamily: 'Fredoka, sans-serif' }}
            whileHover={!isLoading && password ? { scale: 1.05 } : {}}
            whileTap={!isLoading && password ? { scale: 0.95 } : {}}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-purple-600 hover:text-purple-700 font-semibold"
            style={{ fontFamily: 'Comic Neue, cursive' }}
          >
            ← Back to Landing Page
          </a>
        </div>
      </motion.div>
    </div>
  );
}
