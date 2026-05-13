import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Upload, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface MetaTags {
  title: string;
  description: string;
  image: string;
  favicon: string;
  twitterCard: 'summary' | 'summary_large_image';
}

export function MetaTagsEditor() {
  const [metaTags, setMetaTags] = useState<MetaTags>({
    title: 'The Frame Game - Arts Education Platform',
    description: 'Transform passive screen time into active creation! Learn filmmaking through fun tutorials, create with powerful tools, and compete for prizes.',
    image: '',
    favicon: '',
    twitterCard: 'summary_large_image',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchMetaTags();
  }, []);

  const fetchMetaTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/meta-tags`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.metaTags) {
          setMetaTags(data.metaTags);
        }
      }
    } catch (error) {
      console.error('Error fetching meta tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/meta-tags`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metaTags }),
        }
      );

      if (response.ok) {
        toast.success('Meta tags saved! Refresh your page to see changes.');
      } else {
        toast.error('Failed to save meta tags');
      }
    } catch (error) {
      console.error('Error saving meta tags:', error);
      toast.error('Error saving meta tags');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setMetaTags(prev => ({ ...prev, [field]: base64 }));
        toast.success(`${field === 'image' ? 'Preview image' : 'Favicon'} uploaded`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const generatePreview = () => {
    const url = `https://og-playground.vercel.app/?share=${encodeURIComponent(JSON.stringify({
      title: metaTags.title,
      description: metaTags.description,
      image: metaTags.image || 'https://via.placeholder.com/1200x630/9333ea/ffffff?text=The+Frame+Game',
    }))}`;
    setPreviewUrl(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Loading meta tags...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Fredoka, sans-serif' }}>
            SEO & Social Sharing
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Customize how your site appears in search results and when shared on social media
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Page Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Page Title
          </label>
          <input
            type="text"
            value={metaTags.title}
            onChange={(e) => setMetaTags(prev => ({ ...prev, title: e.target.value }))}
            placeholder="The Frame Game - Arts Education Platform"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            style={{ fontFamily: 'Comic Neue, cursive' }}
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Shows in browser tab and search results ({metaTags.title.length}/60 characters)
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Description
          </label>
          <textarea
            value={metaTags.description}
            onChange={(e) => setMetaTags(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your site in 1-2 sentences..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
            style={{ fontFamily: 'Comic Neue, cursive' }}
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Shows in search results and social previews ({metaTags.description.length}/160 characters)
          </p>
        </div>

        {/* Preview Image */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Preview Image (Open Graph)
          </label>
          <div className="flex items-start gap-4">
            {metaTags.image && (
              <div className="relative group">
                <img
                  src={metaTags.image}
                  alt="Preview"
                  className="w-48 h-24 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  onClick={() => setMetaTags(prev => ({ ...prev, image: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex-1">
              <label className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                <Upload className="w-5 h-5" />
                <span style={{ fontFamily: 'Fredoka, sans-serif' }}>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Recommended: 1200x630px (PNG or JPG, max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Favicon (Browser Tab Icon)
          </label>
          <div className="flex items-start gap-4">
            {metaTags.favicon && (
              <div className="relative group">
                <img
                  src={metaTags.favicon}
                  alt="Favicon"
                  className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  onClick={() => setMetaTags(prev => ({ ...prev, favicon: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex-1">
              <label className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                <Upload className="w-5 h-5" />
                <span style={{ fontFamily: 'Fredoka, sans-serif' }}>Upload Favicon</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'favicon')}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
                Recommended: 32x32px or 64x64px (PNG or ICO, max 1MB)
              </p>
            </div>
          </div>
        </div>

        {/* Twitter Card Type */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Twitter Card Type
          </label>
          <select
            value={metaTags.twitterCard}
            onChange={(e) => setMetaTags(prev => ({ ...prev, twitterCard: e.target.value as 'summary' | 'summary_large_image' }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            style={{ fontFamily: 'Comic Neue, cursive' }}
          >
            <option value="summary">Summary (small image)</option>
            <option value="summary_large_image">Summary Large Image (full width)</option>
          </select>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Preview
        </h3>
        
        {/* Google Search Result Preview */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
            How it looks in Google search:
          </p>
          <div className="space-y-1">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {metaTags.title || 'Your Page Title'}
            </div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
              {metaTags.description || 'Your page description will appear here...'}
            </div>
          </div>
        </div>

        {/* Social Media Preview */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
            How it looks when shared on social media:
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {metaTags.image && (
              <img
                src={metaTags.image}
                alt="Social preview"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-3 bg-gray-50">
              <div className="font-bold text-sm mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {metaTags.title || 'Your Page Title'}
              </div>
              <div className="text-xs text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
                {metaTags.description || 'Your description...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Eye className="w-5 h-5" />
          Tips for Best Results
        </h4>
        <ul className="text-sm text-blue-800 space-y-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
          <li>• <strong>Title:</strong> Keep it under 60 characters for best display</li>
          <li>• <strong>Description:</strong> 150-160 characters is ideal</li>
          <li>• <strong>Image:</strong> Use 1200x630px for best quality on all platforms</li>
          <li>• <strong>Favicon:</strong> Square images work best (32x32 or 64x64px)</li>
          <li>• <strong>Note:</strong> Changes may take a few minutes to appear when sharing links</li>
        </ul>
      </div>
    </div>
  );
}
