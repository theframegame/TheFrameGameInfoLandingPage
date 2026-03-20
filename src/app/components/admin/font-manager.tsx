import { useState } from 'react';
import { Upload, Trash2, Type, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useCustomFonts, CustomFont } from '../use-custom-fonts';

export function FontManager() {
  const { fonts, refresh, isLoading } = useCustomFonts();
  const [fontName, setFontName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!selectedFile || !fontName.trim()) {
      toast.error('Please provide a font name and select a file.');
      return;
    }

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext || '')) {
      toast.error('Only .ttf, .otf, .woff, and .woff2 files are accepted.');
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', fontName.trim());

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/fonts/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(`"${fontName.trim()}" uploaded! It's now available in all text style editors.`);
        setFontName('');
        setSelectedFile(null);
        // Reset the file input
        const fi = document.getElementById('font-file-input') as HTMLInputElement;
        if (fi) fi.value = '';
        await refresh();
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Font upload error:', error);
      toast.error('Font upload failed. Check console for details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (font: CustomFont) => {
    if (!confirm(`Delete "${font.name}"? Any text using this font will fall back to sans-serif.`)) return;
    setDeletingId(font.id);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/fonts/${font.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success(`"${font.name}" deleted`);
        await refresh();
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Font delete error:', error);
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                Custom Fonts
              </span>
            </h2>
            <p className="text-gray-500 mt-1 text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>
              Upload .ttf, .otf, .woff, or .woff2 files &mdash; they appear in every text style editor
            </p>
          </div>
          <Button
            variant="outline"
            onClick={refresh}
            disabled={isLoading}
            className="text-gray-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="bg-gradient-to-br from-fuchsia-50 to-violet-50 rounded-2xl p-5 border border-fuchsia-200">
          <h3
            className="text-lg font-bold mb-4"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
              Upload a Font
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase">
                Font Name (as it should appear in the picker)
              </Label>
              <Input
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                placeholder="e.g., Boulder, Hibernate, Playpen Sans"
                className="mt-1 text-base font-semibold"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Font File (.ttf, .otf, .woff, .woff2)
              </Label>
              <label
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700'
                    : 'border-fuchsia-300 bg-white hover:border-fuchsia-500 text-fuchsia-600'
                }`}
              >
                {selectedFile ? (
                  <>
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-bold truncate">{selectedFile.name}</span>
                    <span className="text-xs text-fuchsia-400">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-bold">Choose Font File</span>
                  </>
                )}
                <input
                  id="font-file-input"
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || !fontName.trim() || !selectedFile}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white font-bold py-3"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Font
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Installed Fonts */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
            Installed Custom Fonts ({fonts.length})
          </span>
        </h3>

        {fonts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Type className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p
              className="text-gray-400 text-lg"
              style={{ fontFamily: 'Comic Neue, cursive' }}
            >
              No custom fonts yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Upload your .ttf files above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fonts.map((font) => (
              <div
                key={font.id}
                className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 px-5 py-4 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                  <span style={{ fontFamily: `'${font.name}', sans-serif` }}>
                    Aa
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-bold text-base"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    {font.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>.{font.format.toUpperCase()}</span>
                    <span>{formatFileSize(font.fileSize)}</span>
                    <span>
                      Added{' '}
                      {new Date(font.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className="text-sm text-gray-600 mt-1 truncate"
                    style={{ fontFamily: `'${font.name}', sans-serif` }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold"
                  >
                    Active
                  </span>
                  <button
                    onClick={() => handleDelete(font)}
                    disabled={deletingId === font.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingId === font.id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Google Fonts note */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> In addition to your custom fonts, the following
            Google Fonts are always available: Fredoka, Comic Neue, Quicksand,
            Playpen Sans, Bebas Neue, Comfortaa, Poppins, Montserrat, Playfair
            Display, Nunito, Inter, Pacifico, Bangers, Caveat.
          </p>
        </div>
      </div>
    </div>
  );
}
