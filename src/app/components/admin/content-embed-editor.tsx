import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Plus, Trash2, ExternalLink, Eye, Code } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type ContentSection = 
  | 'studio-demo' 
  | 'dashboard-demo' 
  | 'camera-overlay-demo'
  | 'beta-info' 
  | 'parent-educator-info' 
  | 'investor-info' 
  | 'general-info';

interface EmbedConfig {
  type: 'iframe' | 'html' | 'markdown';
  url?: string;
  htmlContent?: string;
  title?: string;
  description?: string;
  height?: string;
  allowFullscreen?: boolean;
  layout?: {
    scale?: number;
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    maxWidth?: string;
    maxHeight?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  };
}

const SECTION_OPTIONS: { value: ContentSection; label: string }[] = [
  { value: 'studio-demo', label: 'Frame Game Studio Demo' },
  { value: 'dashboard-demo', label: 'Teacher/Student Dashboard' },
  { value: 'camera-overlay-demo', label: 'Camera Overlay System' },
  { value: 'beta-info', label: 'Beta Information' },
  { value: 'parent-educator-info', label: 'Parent & Educator Info' },
  { value: 'investor-info', label: 'Investor Information' },
  { value: 'general-info', label: 'General Information' },
];

export function ContentEmbedEditor() {
  const [selectedSection, setSelectedSection] = useState<ContentSection>('studio-demo');
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig>({
    type: 'iframe',
    height: '600',
    allowFullscreen: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [allEmbeds, setAllEmbeds] = useState<Record<string, EmbedConfig>>({});

  useEffect(() => {
    loadEmbedConfig();
    loadAllEmbeds();
  }, [selectedSection]);

  const loadAllEmbeds = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/embeds`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllEmbeds(data);
      }
    } catch (error) {
      console.error('Error loading all embeds:', error);
    }
  };

  const loadEmbedConfig = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/embeds/${selectedSection}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setEmbedConfig(data.config);
        } else {
          // Reset to defaults if no config exists
          setEmbedConfig({
            type: 'iframe',
            height: '600',
            allowFullscreen: true,
          });
        }
      }
    } catch (error) {
      console.error('Error loading embed config:', error);
      toast.error('Failed to load embed configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmbedConfig = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/embeds/${selectedSection}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
          body: JSON.stringify({ config: embedConfig }),
        }
      );

      if (response.ok) {
        toast.success('Embed configuration saved successfully!');
        await loadAllEmbeds();
      } else {
        const error = await response.text();
        toast.error(`Failed to save: ${error}`);
      }
    } catch (error) {
      console.error('Error saving embed config:', error);
      toast.error('Failed to save embed configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEmbedConfig = async () => {
    if (!confirm('Are you sure you want to remove this custom content? The section will revert to the default.')) {
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/embeds/${selectedSection}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': token || '',
          },
        }
      );

      if (response.ok) {
        toast.success('Custom content removed. Section reverted to default.');
        setEmbedConfig({
          type: 'iframe',
          height: '600',
          allowFullscreen: true,
        });
        await loadAllEmbeds();
      } else {
        const error = await response.text();
        toast.error(`Failed to delete: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting embed config:', error);
      toast.error('Failed to delete embed configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    if (!embedConfig) return null;

    if (embedConfig.type === 'iframe' && embedConfig.url) {
      return (
        <iframe
          src={embedConfig.url}
          className="w-full rounded-xl border-4 border-purple-200"
          style={{ height: `${embedConfig.height}px` }}
          allowFullScreen={embedConfig.allowFullscreen}
          title={embedConfig.title || 'Embedded Content'}
        />
      );
    }

    if (embedConfig.type === 'html' && embedConfig.htmlContent) {
      return (
        <div
          className="w-full rounded-xl border-4 border-purple-200 p-6 bg-white"
          style={{ minHeight: `${embedConfig.height}px` }}
          dangerouslySetInnerHTML={{ __html: embedConfig.htmlContent }}
        />
      );
    }

    return (
      <div className="w-full rounded-xl border-4 border-purple-200 p-6 bg-gray-50 flex items-center justify-center" style={{ height: `${embedConfig.height}px` }}>
        <p className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Configure your content to see a preview
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Code className="w-10 h-10 text-purple-600" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Content & Embed Manager
            </span>
          </h2>
          <p className="text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
            Embed external prototypes, videos, or custom HTML in your sections
          </p>
        </div>
      </div>

      {/* Section Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Select Section to Customize</CardTitle>
          <CardDescription style={{ fontFamily: 'Comic Neue, cursive' }}>
            Choose which content section you want to add custom embeds or content to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSection} onValueChange={(val) => setSelectedSection(val as ContentSection)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  {allEmbeds[option.value] && ' ✓'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>Loading...</p>
        </div>
      ) : (
        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setShowPreview(true)}>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            {/* Embed Type */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Embed Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={embedConfig.type} 
                  onValueChange={(val) => setEmbedConfig({ ...embedConfig, type: val as 'iframe' | 'html' | 'markdown' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iframe">iFrame Embed (Replit, Figma, YouTube, etc.)</SelectItem>
                    <SelectItem value="html">Custom HTML</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Content Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Interactive Prototype"
                    value={embedConfig.title || ''}
                    onChange={(e) => setEmbedConfig({ ...embedConfig, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Try out our editing interface"
                    value={embedConfig.description || ''}
                    onChange={(e) => setEmbedConfig({ ...embedConfig, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* iFrame Settings */}
            {embedConfig.type === 'iframe' && (
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>iFrame Settings</CardTitle>
                  <CardDescription style={{ fontFamily: 'Comic Neue, cursive' }}>
                    Embed from Replit, Figma, YouTube, CodePen, or any embeddable URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="url">Embed URL *</Label>
                    <Input
                      id="url"
                      placeholder="https://replit.com/@username/project?embed=true"
                      value={embedConfig.url || ''}
                      onChange={(e) => setEmbedConfig({ ...embedConfig, url: e.target.value })}
                    />
                    <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
                      💡 Tip: For Replit, add <code>?embed=true</code> to your URL
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (pixels)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="600"
                      value={embedConfig.height || '600'}
                      onChange={(e) => setEmbedConfig({ ...embedConfig, height: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allowFullscreen"
                      checked={embedConfig.allowFullscreen}
                      onChange={(e) => setEmbedConfig({ ...embedConfig, allowFullscreen: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="allowFullscreen">Allow Fullscreen</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* HTML Content */}
            {embedConfig.type === 'html' && (
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Custom HTML</CardTitle>
                  <CardDescription style={{ fontFamily: 'Comic Neue, cursive' }}>
                    Add your own HTML, CSS, and inline styles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="htmlContent">HTML Content *</Label>
                    <Textarea
                      id="htmlContent"
                      rows={12}
                      placeholder="<div>Your custom HTML here...</div>"
                      value={embedConfig.htmlContent || ''}
                      onChange={(e) => setEmbedConfig({ ...embedConfig, htmlContent: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height-html">Minimum Height (pixels)</Label>
                    <Input
                      id="height-html"
                      type="number"
                      placeholder="600"
                      value={embedConfig.height || '600'}
                      onChange={(e) => setEmbedConfig({ ...embedConfig, height: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Layout Controls */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Layout & Positioning</CardTitle>
                <CardDescription style={{ fontFamily: 'Comic Neue, cursive' }}>
                  Control how content appears in the filmstrip viewer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scale">Scale (%)</Label>
                    <Input
                      id="scale"
                      type="number"
                      min="10"
                      max="200"
                      placeholder="100"
                      value={embedConfig.layout?.scale || 100}
                      onChange={(e) => setEmbedConfig({ 
                        ...embedConfig, 
                        layout: { ...embedConfig.layout, scale: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="objectFit">Object Fit</Label>
                    <Select 
                      value={embedConfig.layout?.objectFit || 'contain'} 
                      onValueChange={(val) => setEmbedConfig({ 
                        ...embedConfig, 
                        layout: { ...embedConfig.layout, objectFit: val as 'contain' | 'cover' | 'fill' | 'none' }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="horizontalAlign">Horizontal Align</Label>
                    <Select 
                      value={embedConfig.layout?.horizontalAlign || 'center'} 
                      onValueChange={(val) => setEmbedConfig({ 
                        ...embedConfig, 
                        layout: { ...embedConfig.layout, horizontalAlign: val as 'left' | 'center' | 'right' }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="verticalAlign">Vertical Align</Label>
                    <Select 
                      value={embedConfig.layout?.verticalAlign || 'center'} 
                      onValueChange={(val) => setEmbedConfig({ 
                        ...embedConfig, 
                        layout: { ...embedConfig.layout, verticalAlign: val as 'top' | 'center' | 'bottom' }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxWidth">Max Width (e.g., 800px, 80%)</Label>
                    <Input
                      id="maxWidth"
                      placeholder="100%"
                      value={embedConfig.layout?.maxWidth || ''}
                      onChange={(e) => setEmbedConfig({ 
                        ...embedConfig, 
                        layout: { ...embedConfig.layout, maxWidth: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxHeight">Max Height (e.g., 600px, 80%)</Label>
                    <Input
                      id="maxHeight"
                      placeholder="100%"
                      value={embedConfig.layout?.maxHeight || ''}
                      onChange={(e) => setEmbedConfig({ 
                        ...embedConfig, 
                        layout: { ...embedConfig.layout, maxHeight: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={saveEmbedConfig}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Embed Configuration'}
              </Button>
              {allEmbeds[selectedSection] && (
                <Button
                  onClick={deleteEmbedConfig}
                  disabled={isSaving}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Custom Content
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Preview</CardTitle>
                <CardDescription style={{ fontFamily: 'Comic Neue, cursive' }}>
                  See how your embedded content will appear to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {embedConfig.title && (
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {embedConfig.title}
                  </h3>
                )}
                {embedConfig.description && (
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    {embedConfig.description}
                  </p>
                )}
                {renderPreview()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Reference */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Quick Reference: Popular Embed URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2" style={{ fontFamily: 'Comic Neue, cursive' }}>
          <p><strong>Replit:</strong> https://replit.com/@username/project?embed=true</p>
          <p><strong>Figma:</strong> https://www.figma.com/embed?embed_host=share&url=[YOUR_FIGMA_URL]</p>
          <p><strong>YouTube:</strong> https://www.youtube.com/embed/[VIDEO_ID]</p>
          <p><strong>CodePen:</strong> https://codepen.io/username/embed/[PEN_ID]</p>
          <p><strong>Google Slides:</strong> Get embed code from File → Share → Publish to web</p>
        </CardContent>
      </Card>
    </div>
  );
}
