import { useState, useEffect } from 'react';
import { Reorder } from 'motion/react';
import { Save, Plus, Trash2, GripVertical, Edit, Eye, EyeOff, Copy, ChevronDown, ChevronUp, Upload, Image, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { TextStyleEditor, defaultTextStyle, textStyleToCSS } from './landing-page-editor';
import type { TextStyle } from './landing-page-editor';

type SectionType = 'studio-demo' | 'dashboard-demo' | 'camera-overlay-demo' | 'beta-info' | 'parent-educator-info' | 'investor-info' | 'general-info' | 'custom-html' | 'custom-embed' | 'custom-canvas' | 'beta-page';

interface CanvasImage {
  id: string;
  url: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  rotation?: number; // degrees
  zIndex?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

interface EditableContent {
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  embedUrl?: string;
  headingStyle?: TextStyle;
  subheadingStyle?: TextStyle;
  bodyStyle?: TextStyle;
  bulletTitleStyle?: TextStyle;
  ctaStyle?: TextStyle;
  canvasImages?: CanvasImage[];
  canvasBackgroundColor?: string;
  pdfUrl?: string;
}

interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  visibleTo?: string[];
  customContent?: string;
  embedUrl?: string;
  description?: string;
  editableContent?: EditableContent;
  layout?: {
    scale?: number;
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    maxWidth?: string;
    maxHeight?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none';
    padding?: string;
    backgroundColor?: string;
    backgroundGradient?: string;
    borderRadius?: string;
    customCss?: string;
    cardWidth?: number;
    aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '21:9';
    cardPadding?: number;
  };
}

const SECTION_TEMPLATES: { value: SectionType; label: string; icon: string }[] = [
  { value: 'studio-demo', label: 'Frame Game Studio', icon: '\uD83C\uDFAC' },
  { value: 'dashboard-demo', label: 'Teacher Dashboard', icon: '\uD83D\uDCCA' },
  { value: 'camera-overlay-demo', label: 'Camera Overlays', icon: '\uD83D\uDCF8' },
  { value: 'beta-info', label: 'Beta Program', icon: '\uD83D\uDE80' },
  { value: 'beta-page', label: 'Beta Page Content', icon: '📋' },
  { value: 'parent-educator-info', label: 'Parents & Educators', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67' },
  { value: 'investor-info', label: 'Investor Info', icon: '\uD83D\uDCC8' },
  { value: 'general-info', label: 'General Info', icon: '\u2728' },
  { value: 'custom-html', label: 'Custom HTML', icon: '\uD83D\uDD27' },
  { value: 'custom-embed', label: 'Embed (iframe)', icon: '\uD83C\uDF10' },
  { value: 'custom-canvas', label: 'Custom Canvas', icon: '\uD83D\uDC8E' },
];

const USER_TYPES = [
  { value: 'filmmaker', label: 'Filmmaker', color: 'bg-blue-100 text-blue-700' },
  { value: 'parent', label: 'Parent', color: 'bg-green-100 text-green-700' },
  { value: 'educator', label: 'Educator', color: 'bg-purple-100 text-purple-700' },
  { value: 'teen', label: 'Teen', color: 'bg-pink-100 text-pink-700' },
  { value: 'investor', label: 'Investor', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'donor', label: 'Donor', color: 'bg-orange-100 text-orange-700' },
  { value: 'curious', label: 'Just Curious', color: 'bg-gray-100 text-gray-700' },
];

const THEME: Record<string, { bg: string; text: string; accent: string }> = {
  'studio-demo': { bg: 'from-purple-100 to-indigo-100', text: 'from-purple-600 to-indigo-600', accent: 'purple' },
  'dashboard-demo': { bg: 'from-blue-100 to-cyan-100', text: 'from-blue-600 to-cyan-600', accent: 'blue' },
  'camera-overlay-demo': { bg: 'from-pink-100 to-rose-100', text: 'from-pink-600 to-rose-600', accent: 'pink' },
  'beta-info': { bg: 'from-yellow-100 to-orange-100', text: 'from-yellow-600 to-orange-600', accent: 'orange' },
  'beta-page': { bg: 'from-orange-100 to-pink-100', text: 'from-orange-600 to-pink-600', accent: 'orange' },
  'parent-educator-info': { bg: 'from-green-100 to-teal-100', text: 'from-green-600 to-teal-600', accent: 'green' },
  'investor-info': { bg: 'from-emerald-100 to-green-100', text: 'from-emerald-600 to-green-600', accent: 'emerald' },
  'general-info': { bg: 'from-purple-100 to-pink-100', text: 'from-purple-600 to-pink-600', accent: 'purple' },
  'custom-html': { bg: 'from-gray-100 to-gray-200', text: 'from-gray-600 to-gray-800', accent: 'gray' },
  'custom-embed': { bg: 'from-sky-100 to-blue-100', text: 'from-sky-600 to-blue-600', accent: 'sky' },
  'custom-canvas': { bg: 'from-gray-100 to-gray-200', text: 'from-gray-600 to-gray-800', accent: 'gray' },
};

const DEFAULT_CONTENT: Record<string, EditableContent> = {
  'studio-demo': { heading: 'Frame Game Studio', subheading: 'Our powerful yet simple editing interface makes video creation fun and accessible for everyone!', bodyText: '\u2702\uFE0F Intuitive Editing \u2014 Trim, split, and arrange clips with ease\n\uD83C\uDFA8 Creative Filters \u2014 Apply stunning effects and color grading\n\uD83C\uDFB5 Audio Tools \u2014 Add music, sound effects, and voiceovers\n\u2728 AI Assistance \u2014 Smart suggestions for better storytelling' },
  'dashboard-demo': { heading: 'Teacher & Student Dashboard', subheading: 'Track progress, manage assignments, and showcase student work \u2014 all in one place.', bodyText: '\u2705 Assignment Tracking \u2014 Create and manage film projects\n\uD83D\uDCC8 Progress Reports \u2014 See how students are improving\n\uD83C\uDFC6 Showcases \u2014 Highlight the best student work\n\uD83D\uDC65 Collaboration \u2014 Students can work together in real time' },
  'camera-overlay-demo': { heading: 'Camera Overlay System', subheading: 'Interactive on-screen guides that teach students professional framing techniques while they shoot.', bodyText: '\uD83D\uDCCF Rule of Thirds grid overlay\n\uD83C\uDFAF Focus point guides\n\uD83D\uDCD0 Horizon leveling\n\uD83C\uDFAC Shot composition tips in real time' },
  'beta-info': { heading: 'Join Our Beta Program', subheading: 'Be among the first to experience Frame Game and help shape the future of arts education.', bodyText: '\u26A1 Early Access \u2014 Be the first to try Frame Game Studio\n\uD83C\uDF81 Exclusive Rewards \u2014 Compete for cash prizes and recognition\n\u2728 Shape the Future \u2014 Your feedback directly influences development', ctaText: 'Sign Up for Beta' },
  'beta-page': { heading: 'Join the Beta Program', subheading: 'Get early access, exclusive rewards, and help shape the future of Frame Game!', bodyText: '\u26A1 Early Access \u2014 Be the first to try new features\n\uD83C\uDF81 Exclusive Rewards \u2014 Compete for cash prizes & recognition\n\u2728 Shape the Future \u2014 Your feedback drives our development\n\uD83C\uDFC6 Founding Member Status \u2014 Permanent recognition in our community' },
  'parent-educator-info': { heading: 'For Parents & Educators', subheading: 'Empower the next generation of storytellers with professional-grade tools designed for learning.', bodyText: '\uD83D\uDCDA Curriculum-aligned lesson plans\n\uD83D\uDEE1\uFE0F Safe, moderated environment\n\uD83D\uDCCA Progress tracking dashboards\n\uD83E\uDD1D Teacher-parent communication tools' },
  'investor-info': { heading: 'Investment Opportunity', subheading: 'Join us in revolutionizing arts education through innovative technology.', bodyText: '\uD83C\uDFAF $1.2B Market \u2014 Arts education market growing 15% annually\n\uD83D\uDC65 10M+ Creators \u2014 Gen Z content creators seeking skill development\n\uD83D\uDCCA 40% Engagement Boost \u2014 Gamification drives retention in edtech\n\uD83D\uDE80 Scalable Platform \u2014 Cloud-based, global scale\n\uD83D\uDCB0 Multiple Revenue Streams \u2014 Subscriptions, partnerships, licensing', ctaText: 'Request Pitch Deck' },
  'general-info': { heading: 'About The Frame Game', subheading: 'Transforming passive screen time into active creation!', bodyText: '\uD83C\uDFAC Learn \u2014 Master filmmaking through fun, guided tutorials\n\uD83D\uDE80 Create \u2014 Bring your stories to life with powerful, easy-to-use tools\n\uD83C\uDFC6 Earn \u2014 Compete for prizes, recognition, and real-world opportunities' },
};

export function SectionManager() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionConfig | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadSections(); }, []);

  const loadSections = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/sections`, { headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'X-Admin-Token': token || '' } });
      if (response.ok) { const data = await response.json(); setSections(data.sections?.length > 0 ? data.sections : getDefaultSections()); }
      else setSections(getDefaultSections());
    } catch (error) { console.error('Error loading sections:', error); setSections(getDefaultSections()); } finally { setIsLoading(false); }
  };

  const getDefaultSections = (): SectionConfig[] => [
    { id: '1', type: 'studio-demo', title: 'Frame Game Studio', enabled: true, order: 0 },
    { id: '2', type: 'dashboard-demo', title: 'Teacher Dashboard', enabled: true, order: 1 },
    { id: '3', type: 'camera-overlay-demo', title: 'Camera Overlays', enabled: true, order: 2 },
    { 
      id: '4', 
      type: 'beta-info', 
      title: 'Beta Program', 
      enabled: true, 
      order: 3,
      editableContent: {
        ctaUrl: '/beta',
        ctaLinkType: 'internal'
      }
    },
    { id: '5', type: 'parent-educator-info', title: 'For Parents & Educators', enabled: true, order: 4 },
    { id: '6', type: 'investor-info', title: 'Investment Opportunity', enabled: true, order: 5 },
    { id: '7', type: 'general-info', title: 'About Us', enabled: true, order: 6 },
  ];

  const saveSections = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/sections`, { method: 'POST', headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'X-Admin-Token': token || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) });
      if (response.ok) toast.success('Published!'); else toast.error(`Save failed: ${await response.text()}`);
    } catch (error) { console.error('Error saving sections:', error); toast.error('Failed to save'); } finally { setIsSaving(false); }
  };

  const addSection = () => { setEditingSection({ id: Date.now().toString(), type: 'general-info', title: 'New Section', enabled: true, order: sections.length, visibleTo: [] }); };

  const commitEdit = () => {
    if (!editingSection) return;
    const exists = sections.find(s => s.id === editingSection.id);
    if (exists) setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
    else setSections([...sections, editingSection]);
    toast.success('Section saved locally \u2014 hit Publish to go live');
    setEditingSection(null);
  };

  const handleReorder = (newOrder: SectionConfig[]) => { setSections(newOrder.map((s, i) => ({ ...s, order: i }))); };
  const tmpl = (type: SectionType) => SECTION_TEMPLATES.find(t => t.value === type) || { value: type, label: type, icon: '\uD83D\uDCC4' };

  if (editingSection) return <SectionEditor section={editingSection} onChange={setEditingSection} onSave={commitEdit} onCancel={() => setEditingSection(null)} isNew={!sections.find(s => s.id === editingSection.id)} />;

  if (isLoading) return <div className="bg-white rounded-3xl shadow-2xl p-12 text-center"><p className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Content Manager</span></h2>
            <p className="text-gray-500 mt-1 text-sm" style={{ fontFamily: 'Comic Neue, cursive' }}>Drag to reorder &middot; Click Edit to change content &middot; Publish when ready</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={addSection} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Add Section</Button>
            <Button onClick={saveSections} disabled={isSaving} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"><Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Publish'}</Button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6">
        <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-2">
          {sections.map((section, idx) => {
            const t = tmpl(section.type);
            const isExpanded = expandedId === section.id;
            return (
              <Reorder.Item key={section.id} value={section} className={`border-2 rounded-xl transition-all cursor-grab active:cursor-grabbing ${section.enabled ? 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</div>
                  <span className="text-xl flex-shrink-0">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-sm truncate" style={{ fontFamily: 'Fredoka, sans-serif' }}>{section.title}</h3><span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{t.label}</span></div>
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">{(!section.visibleTo || section.visibleTo.length === 0) ? <span className="text-[10px] text-gray-400">All visitors</span> : section.visibleTo.map(ut => { const info = USER_TYPES.find(u => u.value === ut); return <span key={ut} className={`text-[10px] px-1.5 py-0.5 rounded-full ${info?.color || 'bg-gray-100 text-gray-600'}`}>{info?.label || ut}</span>; })}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setSections(sections.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s))} className={`p-1.5 rounded-lg ${section.enabled ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-100 hover:bg-gray-200'}`}>{section.enabled ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}</button>
                    <button onClick={() => setExpandedId(isExpanded ? null : section.id)} className="p-1.5 rounded-lg hover:bg-gray-100">{isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}</button>
                    <button onClick={() => setEditingSection({ ...section })} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100"><Edit className="w-4 h-4 text-blue-600" /></button>
                    <button onClick={() => { setSections([...sections, { ...section, id: Date.now().toString(), title: `${section.title} (Copy)`, order: sections.length }]); toast.success('Duplicated'); }} className="p-1.5 rounded-lg hover:bg-gray-100"><Copy className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => { if (confirm('Delete?')) { setSections(sections.filter(s => s.id !== section.id)); toast.success('Deleted'); } }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
                {isExpanded && (<div className="px-4 pb-3 border-t border-gray-100 pt-3"><p className="text-xs text-gray-500 mb-2">{section.description || 'No description'}</p><Button size="sm" onClick={() => setEditingSection({ ...section })} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"><Edit className="w-3 h-3 mr-1" /> Open Editor</Button></div>)}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  SECTION EDITOR
// ═══════════════════════════════════════════════════

function SectionEditor({ section, onChange, onSave, onCancel, isNew }: { section: SectionConfig; onChange: (s: SectionConfig) => void; onSave: () => void; onCancel: () => void; isNew: boolean; }) {
  const defaults = DEFAULT_CONTENT[section.type];
  const ec = section.editableContent || {};
  const setEC = (patch: Partial<EditableContent>) => onChange({ ...section, editableContent: { ...ec, ...patch } });

  const heading = ec.heading ?? defaults?.heading ?? '';
  const subheading = ec.subheading ?? defaults?.subheading ?? '';
  const bodyText = ec.bodyText ?? defaults?.bodyText ?? '';
  const ctaText = ec.ctaText ?? defaults?.ctaText ?? '';
  const ctaUrl = ec.ctaUrl ?? '';
  const imageUrl = ec.imageUrl ?? '';
  const embedUrl = ec.embedUrl ?? '';
  const isCustomHTML = section.type === 'custom-html';
  const isCustomEmbed = section.type === 'custom-embed';
  const isCustomCanvas = section.type === 'custom-canvas';

  const [isUploading, setIsUploading] = useState(false);
  const [selectedCanvasImage, setSelectedCanvasImage] = useState<string | null>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error('File too large (50MB max)'); e.target.value = ''; return; }
    setIsUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData(); formData.append('file', file);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'X-Admin-Token': token || '' }, body: formData });
      const data = await response.json();
      if (data.success && data.url) { 
        if (isCustomCanvas) {
          // Add new image to canvas
          const newImage: CanvasImage = {
            id: Date.now().toString(),
            url: data.url,
            x: 25,
            y: 25,
            width: 50,
            height: 50,
            rotation: 0,
            zIndex: (ec.canvasImages?.length || 0) + 1,
            objectFit: 'contain'
          };
          setEC({ canvasImages: [...(ec.canvasImages || []), newImage] });
          setSelectedCanvasImage(newImage.id);
          toast.success('Image added to canvas!');
        } else if (data.fileType === 'application/pdf') { 
          setEC({ pdfUrl: data.url }); 
          toast.success('PDF uploaded!'); 
        } else { 
          setEC({ imageUrl: data.url }); 
          toast.success('Image uploaded!'); 
        }
      }
      else toast.error(data.error || 'Upload failed');
    } catch (error) { console.error('Upload error:', error); toast.error('Upload failed'); } finally { setIsUploading(false); e.target.value = ''; }
  };

  const updateCanvasImage = (id: string, updates: Partial<CanvasImage>) => {
    setEC({ 
      canvasImages: ec.canvasImages?.map(img => 
        img.id === id ? { ...img, ...updates } : img
      )
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ minHeight: 'calc(100vh - 300px)' }}>
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">&larr; Back</button>
          <span className="text-sm font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>{isNew ? 'New Section' : `Editing: ${section.title}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
          <button onClick={onSave} className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-sm font-bold transition-colors shadow-lg"><Save className="w-4 h-4 inline mr-1" /> Save</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 350px)' }}>
        {/* LEFT: Controls */}
        <div className="lg:w-[420px] xl:w-[480px] flex-shrink-0 border-r border-gray-200 overflow-y-auto p-5 space-y-5" style={{ maxHeight: 'calc(100vh - 350px)' }}>
          <div><Label className="text-xs font-bold text-gray-400 uppercase">Section Title</Label><Input value={section.title} onChange={(e) => onChange({ ...section, title: e.target.value })} className="mt-1 text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }} /></div>

          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs font-bold text-gray-400 uppercase">Template</Label><Select value={section.type} onValueChange={(v) => onChange({ ...section, type: v as SectionType })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{SECTION_TEMPLATES.map(t => <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex items-end gap-2 pb-0.5"><label className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-lg px-3 py-2.5 flex-1"><input type="checkbox" checked={section.enabled} onChange={(e) => onChange({ ...section, enabled: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm font-semibold">{section.enabled ? 'Enabled' : 'Disabled'}</span></label></div>
          </div>

          <div><Label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Audience (leave blank = all)</Label><div className="flex flex-wrap gap-1.5">{USER_TYPES.map(ut => { const on = section.visibleTo?.includes(ut.value) || false; return (<button key={ut.value} onClick={() => { const vis = section.visibleTo || []; onChange({ ...section, visibleTo: on ? vis.filter(v => v !== ut.value) : [...vis, ut.value] }); }} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 transition-all ${on ? `${ut.color} border-current` : 'bg-gray-50 text-gray-400 border-gray-200'}`}>{on && '\u2713 '}{ut.label}</button>); })}</div></div>

          <hr className="border-gray-100" />

          {isCustomHTML ? (
            <div><Label className="text-xs font-bold text-gray-400 uppercase">HTML Content</Label><Textarea value={section.customContent || ''} onChange={(e) => onChange({ ...section, customContent: e.target.value })} rows={14} className="mt-1 font-mono text-xs" placeholder="<div class='p-8 text-center'>Your HTML here...</div>" /></div>
          ) : isCustomEmbed ? (
            <div><Label className="text-xs font-bold text-gray-400 uppercase">Embed URL</Label><Input value={section.embedUrl || ''} onChange={(e) => onChange({ ...section, embedUrl: e.target.value })} placeholder="https://youtube.com/embed/..." className="mt-1" /><p className="text-[10px] text-gray-400 mt-1">YouTube, Figma, Replit, CodePen, Google Slides, etc.</p></div>
          ) : isCustomCanvas ? (
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-gray-400 uppercase">Canvas Background Color</Label>
                <Input value={ec.canvasBackgroundColor || ''} onChange={(e) => setEC({ canvasBackgroundColor: e.target.value })} className="mt-1" placeholder="#ffffff or transparent" />
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <Label className="text-xs font-bold text-amber-700 uppercase mb-2 block">Upload Images</Label>
                <p className="text-[10px] text-gray-500 mb-3">Upload multiple .jpg, .png, .gif, or .webp files (up to 50MB each)</p>
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${isUploading ? 'border-amber-400 bg-amber-100 text-amber-700' : 'border-amber-300 bg-white hover:border-amber-500 text-amber-600'}`}>
                  {isUploading ? <><div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs font-bold">Uploading...</span></> : <><Upload className="w-4 h-4" /><span className="text-xs font-bold">Add Image</span></>}
                  <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
                </label>
              </div>

              {/* PDF Upload Section */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <Label className="text-xs font-bold text-blue-700 uppercase mb-2 block">Upload PDF</Label>
                <p className="text-[10px] text-gray-500 mb-3">Upload a PDF document with navigable pages (up to 50MB)</p>
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${isUploading ? 'border-blue-400 bg-blue-100 text-blue-700' : 'border-blue-300 bg-white hover:border-blue-500 text-blue-600'}`}>
                  {isUploading ? <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs font-bold">Uploading...</span></> : <><FileText className="w-4 h-4" /><span className="text-xs font-bold">Add PDF</span></>}
                  <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
                </label>
                {ec.pdfUrl && (
                  <div className="mt-3 flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-[10px] text-gray-600 truncate flex-1">{ec.pdfUrl.split('/').pop()?.split('?')[0] || 'PDF Document'}</span>
                    <button onClick={() => setEC({ pdfUrl: '' })} className="p-0.5 hover:bg-red-50 rounded"><X className="w-3 h-3 text-red-400" /></button>
                  </div>
                )}
              </div>

              {/* Image List */}
              {ec.canvasImages && ec.canvasImages.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase">Images ({ec.canvasImages.length})</Label>
                  {ec.canvasImages.map(img => (
                    <div key={img.id} onClick={() => setSelectedCanvasImage(img.id)} className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${selectedCanvasImage === img.id ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 truncate flex-1">{img.url.split('/').pop()?.split('?')[0] || 'Image'}</span>
                        <button onClick={(e) => { e.stopPropagation(); setEC({ canvasImages: ec.canvasImages?.filter(i => i.id !== img.id) }); if (selectedCanvasImage === img.id) setSelectedCanvasImage(null); }} className="p-0.5 hover:bg-red-50 rounded"><X className="w-3 h-3 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Image Controls */}
              {selectedCanvasImage && ec.canvasImages && ec.canvasImages.find(i => i.id === selectedCanvasImage) && (() => {
                const img = ec.canvasImages.find(i => i.id === selectedCanvasImage)!;
                return (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 space-y-3">
                    <Label className="text-xs font-bold text-blue-700 uppercase block">Image Controls</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-600">X Position</Label><span className="text-xs font-mono text-blue-600 font-bold">{img.x}%</span></div><Slider value={[img.x]} min={0} max={100} step={1} onValueChange={([v]) => updateCanvasImage(img.id, { x: v })} /></div>
                      <div><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-600">Y Position</Label><span className="text-xs font-mono text-blue-600 font-bold">{img.y}%</span></div><Slider value={[img.y]} min={0} max={100} step={1} onValueChange={([v]) => updateCanvasImage(img.id, { y: v })} /></div>
                      <div><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-600">Width</Label><span className="text-xs font-mono text-blue-600 font-bold">{img.width}%</span></div><Slider value={[img.width]} min={5} max={100} step={1} onValueChange={([v]) => updateCanvasImage(img.id, { width: v })} /></div>
                      <div><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-600">Height</Label><span className="text-xs font-mono text-blue-600 font-bold">{img.height}%</span></div><Slider value={[img.height]} min={5} max={100} step={1} onValueChange={([v]) => updateCanvasImage(img.id, { height: v })} /></div>
                    </div>
                    <div><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-600">Rotation</Label><span className="text-xs font-mono text-blue-600 font-bold">{img.rotation || 0}°</span></div><Slider value={[img.rotation || 0]} min={-180} max={180} step={5} onValueChange={([v]) => updateCanvasImage(img.id, { rotation: v })} /></div>
                    <div><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-600">Z-Index (Layer)</Label><span className="text-xs font-mono text-blue-600 font-bold">{img.zIndex || 1}</span></div><Slider value={[img.zIndex || 1]} min={1} max={20} step={1} onValueChange={([v]) => updateCanvasImage(img.id, { zIndex: v })} /></div>
                    <div><Label className="text-xs text-gray-600 mb-1 block">Object Fit</Label><div className="flex gap-1.5">{(['contain','cover','fill','none'] as const).map(fit => <button key={fit} onClick={() => updateCanvasImage(img.id, { objectFit: fit })} className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${(img.objectFit || 'contain') === fit ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{fit}</button>)}</div></div>
                  </div>
                );
              })()}
            </div>
          ) : (<>
            <div><Label className="text-xs font-bold text-gray-400 uppercase">Heading</Label><Input value={heading} onChange={(e) => setEC({ heading: e.target.value })} className="mt-1 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }} placeholder={defaults?.heading} /></div>
            <div><Label className="text-xs font-bold text-gray-400 uppercase">Subheading</Label><Input value={subheading} onChange={(e) => setEC({ subheading: e.target.value })} className="mt-1" placeholder={defaults?.subheading} /></div>
            <div><Label className="text-xs font-bold text-gray-400 uppercase">Body Text</Label><Textarea value={bodyText} onChange={(e) => setEC({ bodyText: e.target.value })} rows={6} className="mt-1 text-sm" placeholder={defaults?.bodyText} /><p className="text-[10px] text-gray-400 mt-1">Use line breaks for separate items. Emoji at start = bullet icon.</p></div>
            
            {/* CTA Button Configuration */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <Label className="text-xs font-bold text-blue-600 uppercase mb-3 block">Button / Call-to-Action</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-bold text-gray-400 uppercase">Button Text</Label>
                  <Input value={ctaText} onChange={(e) => setEC({ ctaText: e.target.value })} className="mt-1" placeholder="e.g., Sign Up Now" />
                </div>
                
                {ctaText && (
                  <>
                    <div>
                      <Label className="text-xs font-bold text-gray-400 uppercase">Link Type</Label>
                      <select 
                        value={ec.ctaLinkType || 'external'} 
                        onChange={(e) => setEC({ ctaLinkType: e.target.value as 'external' | 'internal' | 'scroll' | 'slide' })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        style={{ fontFamily: 'Comic Neue, cursive' }}
                      >
                        <option value="external">External URL (opens in new tab)</option>
                        <option value="internal">Internal Page (same site)</option>
                        <option value="scroll">Scroll to Section (on landing page)</option>
                        <option value="slide">Open Content Slide</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs font-bold text-gray-400 uppercase">
                        {ec.ctaLinkType === 'external' && 'External URL'}
                        {ec.ctaLinkType === 'internal' && 'Internal Page Path'}
                        {ec.ctaLinkType === 'scroll' && 'Section ID'}
                        {(!ec.ctaLinkType || ec.ctaLinkType === 'slide') && 'Slide Number'}
                      </Label>
                      {ec.ctaLinkType === 'internal' ? (
                        <select
                          value={ctaUrl}
                          onChange={(e) => setEC({ ctaUrl: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                          style={{ fontFamily: 'Comic Neue, cursive' }}
                        >
                          <option value="">Select a page...</option>
                          <option value="/">Home Page</option>
                          <option value="/contact">Contact Page</option>
                          <option value="/beta">Beta Signup Page</option>
                          <option value="/admin">Admin Login</option>
                        </select>
                      ) : (
                        <Input 
                          value={ctaUrl} 
                          onChange={(e) => setEC({ ctaUrl: e.target.value })} 
                          className="mt-1" 
                          placeholder={
                            ec.ctaLinkType === 'external' ? 'https://example.com' :
                            ec.ctaLinkType === 'scroll' ? 'hero or footer' :
                            '0, 1, 2...'
                          }
                        />
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">
                        {ec.ctaLinkType === 'external' && 'Full URL starting with https://'}
                        {ec.ctaLinkType === 'internal' && 'Select an internal page from the dropdown'}
                        {ec.ctaLinkType === 'scroll' && 'Element ID to scroll to (e.g., "hero", "footer")'}
                        {(!ec.ctaLinkType || ec.ctaLinkType === 'slide') && 'Slide index number (0 = first slide)'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div><Label className="text-xs font-bold text-gray-400 uppercase">Image URL</Label><Input value={imageUrl} onChange={(e) => setEC({ imageUrl: e.target.value })} className="mt-1" placeholder="https://example.com/image.jpg" /></div>
            <div><Label className="text-xs font-bold text-gray-400 uppercase">Embed URL (replaces body with iframe)</Label><Input value={embedUrl} onChange={(e) => setEC({ embedUrl: e.target.value })} className="mt-1" placeholder="https://youtube.com/embed/... (optional)" /></div>

            {/* File Upload */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <Label className="text-xs font-bold text-amber-700 uppercase mb-2 block">Upload File</Label>
              <p className="text-[10px] text-gray-500 mb-3">Upload .jpg, .png, .gif, .webp, or .pdf (up to 50MB).</p>
              <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${isUploading ? 'border-amber-400 bg-amber-100 text-amber-700' : 'border-amber-300 bg-white hover:border-amber-500 text-amber-600'}`}>
                {isUploading ? <><div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs font-bold">Uploading...</span></> : <><Upload className="w-4 h-4" /><span className="text-xs font-bold">Choose File</span></>}
                <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
              </label>
              {imageUrl && <div className="mt-3 flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200"><Image className="w-4 h-4 text-green-600 flex-shrink-0" /><span className="text-[10px] text-gray-500 truncate flex-1">{imageUrl.split('/').pop()?.split('?')[0] || 'Uploaded image'}</span><button onClick={() => setEC({ imageUrl: '' })} className="p-0.5 hover:bg-red-50 rounded"><X className="w-3 h-3 text-red-400" /></button></div>}
              {embedUrl && embedUrl.includes('slide_') && <div className="mt-2 flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200"><FileText className="w-4 h-4 text-blue-600 flex-shrink-0" /><span className="text-[10px] text-gray-500 truncate flex-1">{embedUrl.split('/').pop()?.split('?')[0] || 'Uploaded PDF'}</span><button onClick={() => setEC({ embedUrl: '' })} className="p-0.5 hover:bg-red-50 rounded"><X className="w-3 h-3 text-red-400" /></button></div>}
            </div>
          </>)}

          <div><Label className="text-xs font-bold text-gray-400 uppercase">Admin Note</Label><Input value={section.description || ''} onChange={(e) => onChange({ ...section, description: e.target.value })} className="mt-1 text-sm" placeholder="Internal note (only you see this)" /></div>

          <hr className="border-gray-100" />

          {/* TEXT STYLES */}
          {!isCustomHTML && !isCustomEmbed && (
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200">
            <Label className="text-xs font-bold text-violet-600 uppercase mb-3 block">Text Styles</Label>
            <div className="space-y-2">
              <TextStyleEditor label="Heading Style" style={ec.headingStyle || defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '1.875rem', fontWeight: '700', color: '#7c3aed' })} onChange={(p) => setEC({ headingStyle: { ...(ec.headingStyle || defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '1.875rem', fontWeight: '700', color: '#7c3aed' })), ...p } })} />
              <TextStyleEditor label="Subheading Style" style={ec.subheadingStyle || defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '1rem', fontWeight: '400', color: '#4b5563' })} onChange={(p) => setEC({ subheadingStyle: { ...(ec.subheadingStyle || defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '1rem', fontWeight: '400', color: '#4b5563' })), ...p } })} />
              <TextStyleEditor label="Body / Bullet Description" style={ec.bodyStyle || defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '0.875rem', fontWeight: '400', color: '#374151' })} onChange={(p) => setEC({ bodyStyle: { ...(ec.bodyStyle || defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '0.875rem', fontWeight: '400', color: '#374151' })), ...p } })} />
              <TextStyleEditor label="Bullet Title Style" style={ec.bulletTitleStyle || defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '0.875rem', fontWeight: '700', color: '#1f2937' })} onChange={(p) => setEC({ bulletTitleStyle: { ...(ec.bulletTitleStyle || defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '0.875rem', fontWeight: '700', color: '#1f2937' })), ...p } })} />
              {(ctaText || defaults?.ctaText) && (
                <TextStyleEditor label="CTA Button Style" style={ec.ctaStyle || defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '1rem', fontWeight: '700', color: '#ffffff' })} onChange={(p) => setEC({ ctaStyle: { ...(ec.ctaStyle || defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '1rem', fontWeight: '700', color: '#ffffff' })), ...p } })} />
              )}
            </div>
            <button onClick={() => setEC({ headingStyle: undefined, subheadingStyle: undefined, bodyStyle: undefined, bulletTitleStyle: undefined, ctaStyle: undefined })} className="w-full mt-3 py-1.5 text-xs font-bold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Reset Text Styles</button>
          </div>
          )}

          <hr className="border-gray-100" />

          {/* SLIDE LAYOUT CONTROLS */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <Label className="text-xs font-bold text-indigo-600 uppercase mb-3 block">Slide Layout</Label>
            <div className="mb-4"><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-500">Card Width</Label><span className="text-xs font-mono text-indigo-600 font-bold">{section.layout?.cardWidth || 85}%</span></div><Slider value={[section.layout?.cardWidth || 85]} min={30} max={100} step={5} onValueChange={([v]) => onChange({ ...section, layout: { ...section.layout, cardWidth: v } })} /></div>
            <div className="mb-4"><Label className="text-xs text-gray-500 mb-1 block">Aspect Ratio</Label><div className="flex gap-1.5 flex-wrap">{(['auto','16:9','4:3','1:1','21:9'] as const).map(ar => <button key={ar} onClick={() => onChange({ ...section, layout: { ...section.layout, aspectRatio: ar } })} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${(section.layout?.aspectRatio || 'auto') === ar ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-500 border border-gray-200'}`}>{ar === 'auto' ? 'Auto' : ar}</button>)}</div></div>
            <div className="mb-4"><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-500">Scale</Label><span className="text-xs font-mono text-indigo-600 font-bold">{section.layout?.scale || 100}%</span></div><Slider value={[section.layout?.scale || 100]} min={50} max={150} step={5} onValueChange={([v]) => onChange({ ...section, layout: { ...section.layout, scale: v } })} /></div>
            <div className="mb-4"><div className="flex items-center justify-between mb-1"><Label className="text-xs text-gray-500">Inner Padding</Label><span className="text-xs font-mono text-indigo-600 font-bold">{section.layout?.cardPadding ?? 16}px</span></div><Slider value={[section.layout?.cardPadding ?? 16]} min={0} max={64} step={4} onValueChange={([v]) => onChange({ ...section, layout: { ...section.layout, cardPadding: v } })} /></div>
            <div className="mb-4"><Label className="text-xs text-gray-500 mb-1 block">Horizontal Align</Label><div className="flex gap-1.5">{(['left','center','right'] as const).map(a => <button key={a} onClick={() => onChange({ ...section, layout: { ...section.layout, horizontalAlign: a } })} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${(section.layout?.horizontalAlign || 'center') === a ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-500 border border-gray-200'}`}>{a.charAt(0).toUpperCase()+a.slice(1)}</button>)}</div></div>
            <div className="mb-4"><Label className="text-xs text-gray-500 mb-1 block">Vertical Align</Label><div className="flex gap-1.5">{(['top','center','bottom'] as const).map(a => <button key={a} onClick={() => onChange({ ...section, layout: { ...section.layout, verticalAlign: a } })} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${(section.layout?.verticalAlign || 'center') === a ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-500 border border-gray-200'}`}>{a.charAt(0).toUpperCase()+a.slice(1)}</button>)}</div></div>
            <div className="mb-4"><Label className="text-xs text-gray-500 mb-1 block">Background Color</Label><div className="flex items-center gap-2"><input type="color" value={section.layout?.backgroundColor || '#1f2937'} onChange={(e) => onChange({ ...section, layout: { ...section.layout, backgroundColor: e.target.value } })} className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer" /><Input value={section.layout?.backgroundColor || ''} onChange={(e) => onChange({ ...section, layout: { ...section.layout, backgroundColor: e.target.value } })} className="flex-1 text-xs font-mono" placeholder="transparent (default)" />{section.layout?.backgroundColor && <button onClick={() => onChange({ ...section, layout: { ...section.layout, backgroundColor: undefined } })} className="text-[10px] text-red-500 hover:text-red-700 font-bold">Clear</button>}</div></div>
            <div className="mb-2"><Label className="text-xs text-gray-500 mb-1 block">Corner Radius</Label><Input value={section.layout?.borderRadius || ''} onChange={(e) => onChange({ ...section, layout: { ...section.layout, borderRadius: e.target.value } })} className="text-xs font-mono" placeholder="e.g., 16px, 50%, 1rem" /></div>
            <button onClick={() => onChange({ ...section, layout: undefined })} className="w-full mt-3 py-1.5 text-xs font-bold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Reset to Defaults</button>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="flex-1 min-w-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6 lg:p-10 overflow-auto" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '500px' }}>
          <div className="w-full max-w-[800px]">
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-3 text-center">Live Preview</p>
            <LayoutPreviewWrapper layout={section.layout}><SectionPreview section={section} /></LayoutPreviewWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  LAYOUT PREVIEW WRAPPER
// ═══════════════════════════════════════════════════

function LayoutPreviewWrapper({ layout, children }: { layout?: SectionConfig['layout']; children: React.ReactNode }) {
  if (!layout) return <>{children}</>;
  const cardW = layout.cardWidth || 85;
  const scalePct = layout.scale || 100;
  const ar = layout.aspectRatio || 'auto';
  const padPx = layout.cardPadding ?? 16;
  const hAlign = layout.horizontalAlign || 'center';
  const vAlign = layout.verticalAlign || 'center';
  const arValue = ar === '16:9' ? '16/9' : ar === '4:3' ? '4/3' : ar === '1:1' ? '1/1' : ar === '21:9' ? '21/9' : undefined;
  const marginMap: Record<string, string> = { left: '0 auto 0 0', center: '0 auto', right: '0 0 0 auto' };
  return (
    <div className="overflow-hidden transition-all duration-200" style={{ width: `${cardW}%`, margin: marginMap[hAlign], ...(arValue ? { aspectRatio: arValue } : {}), padding: `${padPx}px`, transform: `scale(${scalePct / 100})`, transformOrigin: `${hAlign} ${vAlign}`, backgroundColor: layout.backgroundColor || undefined, borderRadius: layout.borderRadius || undefined }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════
//  LIVE PREVIEW
// ═══════════════════════════════════════

function SectionPreview({ section }: { section: SectionConfig }) {
  const theme = THEME[section.type] || THEME['general-info'];
  const defaults = DEFAULT_CONTENT[section.type];
  const ec = section.editableContent || {};

  if (section.type === 'custom-html') {
    if (!section.customContent) return <EmptyPreview text="Type HTML in the editor to see it here" />;
    return <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-auto max-h-[600px]"><div dangerouslySetInnerHTML={{ __html: section.customContent }} /></div>;
  }
  if (section.type === 'custom-embed') {
    if (!section.embedUrl) return <EmptyPreview text="Enter an embed URL to see it here" />;
    return <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video"><iframe src={section.embedUrl} className="w-full h-full" allowFullScreen /></div>;
  }
  if (section.type === 'custom-canvas') {
    if (!ec.canvasImages || ec.canvasImages.length === 0) return <EmptyPreview text="Upload images to see them on the canvas" />;
    const bgColor = ec.canvasBackgroundColor || 'transparent';
    return (
      <div className="w-full h-full rounded-2xl shadow-2xl relative overflow-hidden" style={{ backgroundColor: bgColor, minHeight: '400px' }}>
        {ec.canvasImages.sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1)).map(img => (
          <div key={img.id} className="absolute" style={{ left: `${img.x}%`, top: `${img.y}%`, width: `${img.width}%`, height: `${img.height}%`, transform: `rotate(${img.rotation || 0}deg)`, zIndex: img.zIndex || 1 }}>
            <img src={img.url} alt="" className="w-full h-full" style={{ objectFit: img.objectFit || 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        ))}
      </div>
    );
  }
  if (ec.embedUrl) {
    return (
      <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl shadow-2xl overflow-hidden`}>
        {(ec.heading || defaults?.heading) && <div className="p-5"><h2 className="text-2xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className={`bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}>{ec.heading || defaults?.heading}</span></h2>{(ec.subheading || defaults?.subheading) && <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Comic Neue, cursive' }}>{ec.subheading || defaults?.subheading}</p>}</div>}
        <div className="aspect-video"><iframe src={ec.embedUrl} className="w-full h-full" allowFullScreen /></div>
      </div>
    );
  }

  const heading = ec.heading || defaults?.heading || section.title;
  const subheading = ec.subheading || defaults?.subheading || '';
  const bodyText = ec.bodyText || defaults?.bodyText || '';
  const ctaText = ec.ctaText || defaults?.ctaText || '';
  const ctaUrl = ec.ctaUrl || '';
  const imageUrl = ec.imageUrl || '';
  const bodyLines = bodyText.split('\n').filter(l => l.trim());

  const headingCSS = ec.headingStyle ? textStyleToCSS(ec.headingStyle) : { fontFamily: 'Fredoka, sans-serif' };
  const subheadingCSS = ec.subheadingStyle ? textStyleToCSS(ec.subheadingStyle) : { fontFamily: 'Comic Neue, cursive' };
  const bodyCSS = ec.bodyStyle ? textStyleToCSS(ec.bodyStyle) : { fontFamily: 'Comic Neue, cursive' };
  const bulletTitleCSS = ec.bulletTitleStyle ? textStyleToCSS(ec.bulletTitleStyle) : { fontFamily: 'Fredoka, sans-serif' };
  const ctaCSS = ec.ctaStyle ? textStyleToCSS(ec.ctaStyle) : { fontFamily: 'Fredoka, sans-serif' };

  return (
    <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-6 md:p-8 shadow-2xl`}>
      {heading && <h2 className="text-2xl md:text-3xl mb-2 text-center" style={headingCSS}>{!ec.headingStyle ? <span className={`bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}>{heading}</span> : heading}</h2>}
      {subheading && <p className="text-sm md:text-base text-center mb-5" style={subheadingCSS}>{subheading}</p>}
      {imageUrl && <div className="mb-5 flex justify-center"><img src={imageUrl} alt="" className="max-h-48 rounded-2xl shadow-lg object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
      {bodyLines.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-5 space-y-2">
          {bodyLines.map((line, i) => {
            const emojiMatch = line.match(/^(\p{Extended_Pictographic}+)\s*(.*)/u);
            if (emojiMatch) {
              const [, emoji, rest] = emojiMatch;
              const dashIdx = rest.indexOf(' \u2014 ');
              const dashIdx2 = rest.indexOf(' - ');
              const splitIdx = dashIdx >= 0 ? dashIdx : dashIdx2 >= 0 ? dashIdx2 : -1;
              const sep = dashIdx >= 0 ? ' \u2014 ' : ' - ';
              if (splitIdx >= 0) {
                const title = rest.substring(0, splitIdx);
                const desc = rest.substring(splitIdx + sep.length);
                return <div key={i} className="flex items-start gap-3"><span className="text-xl flex-shrink-0">{emoji}</span><div><span className="text-sm" style={bulletTitleCSS}>{title}</span><span className="text-sm" style={bodyCSS}> &mdash; {desc}</span></div></div>;
              }
              return <div key={i} className="flex items-start gap-3"><span className="text-xl flex-shrink-0">{emoji}</span><span className="text-sm" style={bodyCSS}>{rest}</span></div>;
            }
            return <p key={i} className="text-sm" style={bodyCSS}>{line}</p>;
          })}
        </div>
      )}
      {ctaText && (
        <div className="text-center">
          {ctaUrl ? <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className={`inline-block px-8 py-3 bg-gradient-to-r ${theme.text} rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105`} style={ctaCSS}>{ctaText}</a>
          : <span className={`inline-block px-8 py-3 bg-gradient-to-r ${theme.text} rounded-full shadow-lg`} style={ctaCSS}>{ctaText}</span>}
        </div>
      )}
    </div>
  );
}

function EmptyPreview({ text }: { text: string }) {
  return <div className="bg-gray-800 rounded-2xl border-2 border-dashed border-gray-600 p-12 text-center"><p className="text-gray-500 text-lg" style={{ fontFamily: 'Comic Neue, cursive' }}>{text}</p></div>;
}