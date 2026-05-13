import { useState, useEffect } from 'react';
import { Save, RotateCcw, Upload, Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp, X, Type, Bold, Italic } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useCustomFonts } from '../use-custom-fonts';

// ═══════════════════════════════════════
//  TEXT STYLE TYPES
// ═══════════════════════════════════════

export interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  italic: boolean;
  letterSpacing: string;
}

const FONT_OPTIONS = [
  { value: 'Fredoka, sans-serif', label: 'Fredoka' },
  { value: 'Comic Neue, cursive', label: 'Comic Neue' },
  { value: 'Quicksand, sans-serif', label: 'Quicksand' },
  { value: 'Playpen Sans, cursive', label: 'Playpen Sans' },
  { value: 'Bebas Neue, sans-serif', label: 'Bebas Neue (Boulder-style)' },
  { value: 'Comfortaa, sans-serif', label: 'Comfortaa (Hibernate-style)' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Nunito, sans-serif', label: 'Nunito' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Pacifico, cursive', label: 'Pacifico' },
  { value: 'Bangers, cursive', label: 'Bangers' },
  { value: 'Caveat, cursive', label: 'Caveat' },
];

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '600', label: 'Semi' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra' },
];

const SIZE_OPTIONS = [
  { value: '0.625rem', label: 'XS' },
  { value: '0.75rem', label: 'SM' },
  { value: '0.875rem', label: 'MD' },
  { value: '1rem', label: 'Base' },
  { value: '1.25rem', label: 'LG' },
  { value: '1.5rem', label: 'XL' },
  { value: '1.875rem', label: '2XL' },
  { value: '2.25rem', label: '3XL' },
  { value: '3rem', label: '4XL' },
];

export function defaultTextStyle(overrides: Partial<TextStyle> = {}): TextStyle {
  return { fontFamily: 'Fredoka, sans-serif', fontSize: '1rem', fontWeight: '700', color: '#ffffff', italic: false, letterSpacing: '0em', ...overrides };
}

export function textStyleToCSS(ts: TextStyle | undefined, fallback?: Partial<TextStyle>): React.CSSProperties {
  const s = ts ?? defaultTextStyle(fallback);
  return { fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: Number(s.fontWeight) as any, color: s.color, fontStyle: s.italic ? 'italic' : 'normal', letterSpacing: s.letterSpacing || '0em' };
}

// ═══════════════════════════════════════
//  CONFIG TYPES
// ═══════════════════════════════════════

export interface UserTypeCard { type: string; label: string; description: string; gradient: string; icon: string; enabled: boolean; }

export interface LandingPageConfig {
  hero: { headingBefore: string; headingHighlight: string; tagline: string; headerImageUrl: string; imageMaxWidth: string; imageRoundness: string; };
  signup: { title: string; selectorLabel: string; nameLabel: string; nameRequired: boolean; emailLabel: string; submitText: string; successMessage: string; };
  userTypes: UserTypeCard[];
  background: { gradientFrom: string; gradientVia: string; gradientTo: string; };
  social: { enabled: boolean; shareText: string; showTwitter: boolean; showFacebook: boolean; showLinkedIn: boolean; showCopyLink: boolean; };
  showAdminLink: boolean;
  footerText: string;
  textStyles: {
    heroHeading: TextStyle; heroHighlight: TextStyle; heroTagline: TextStyle;
    signupTitle: TextStyle; signupSelectorLabel: TextStyle; signupButton: TextStyle;
    userTypeLabel: TextStyle; userTypeDescription: TextStyle;
    socialHeading: TextStyle; footerText: TextStyle; adminLink: TextStyle;
  };
}

const DEFAULT_TEXT_STYLES: LandingPageConfig['textStyles'] = {
  heroHeading: defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '2.25rem', fontWeight: '700', color: '#ffffff' }),
  heroHighlight: defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '2.25rem', fontWeight: '700', color: '#67e8f9' }),
  heroTagline: defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '1.25rem', fontWeight: '400', color: 'rgba(255,255,255,0.9)' }),
  signupTitle: defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '1.875rem', fontWeight: '700', color: '#9333ea' }),
  signupSelectorLabel: defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }),
  signupButton: defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }),
  userTypeLabel: defaultTextStyle({ fontFamily: 'Fredoka, sans-serif', fontSize: '0.875rem', fontWeight: '700', color: '#1f2937' }),
  userTypeDescription: defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '0.75rem', fontWeight: '400', color: '#4b5563' }),
  socialHeading: defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '1rem', fontWeight: '600', color: '#ffffff' }),
  footerText: defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '0.875rem', fontWeight: '400', color: 'rgba(255,255,255,0.6)' }),
  adminLink: defaultTextStyle({ fontFamily: 'Comic Neue, cursive', fontSize: '0.875rem', fontWeight: '400', color: 'rgba(255,255,255,0.7)' }),
};

const DEFAULT_CONFIG: LandingPageConfig = {
  hero: { headingBefore: 'Turn screen time into', headingHighlight: 'screen credits!', tagline: 'Join the revolution in arts education \uD83C\uDFAC\u2728', headerImageUrl: '', imageMaxWidth: 'max-w-md', imageRoundness: 'rounded-3xl' },
  signup: { title: 'Join The Frame Game!', selectorLabel: 'I am a...', nameLabel: 'Name (optional)', nameRequired: false, emailLabel: 'Email *', submitText: "Let's Go! \uD83D\uDE80", successMessage: '\uD83C\uDF89 Welcome to The Frame Game!' },
  userTypes: [
    { type: 'filmmaker', label: 'Filmmaker', description: 'Create amazing content', gradient: 'from-purple-400 to-indigo-500', icon: '\uD83C\uDFAC', enabled: true },
    { type: 'parent', label: 'Parent', description: 'Support your child', gradient: 'from-blue-400 to-cyan-500', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67', enabled: true },
    { type: 'educator', label: 'Educator', description: 'Teach with us', gradient: 'from-green-400 to-emerald-500', icon: '\uD83C\uDF93', enabled: true },
    { type: 'teen', label: 'Teen', description: 'Learn and create', gradient: 'from-yellow-400 to-orange-500', icon: '\u2728', enabled: true },
    { type: 'investor', label: 'Investor', description: 'Join our journey', gradient: 'from-green-500 to-teal-600', icon: '\uD83D\uDCC8', enabled: true },
    { type: 'donor', label: 'Donor', description: 'Support arts education', gradient: 'from-pink-500 to-red-500', icon: '\u2764\uFE0F', enabled: true },
    { type: 'just-curious', label: 'Just Curious', description: 'Learn more', gradient: 'from-gray-400 to-gray-600', icon: '\u2753', enabled: true },
  ],
  background: { gradientFrom: '#2563eb', gradientVia: '#a855f7', gradientTo: '#ec4899' },
  social: { enabled: true, shareText: 'Join me on The Frame Game - turning screen time into screen credits! \uD83C\uDFAC\u2728', showTwitter: true, showFacebook: true, showLinkedIn: true, showCopyLink: true },
  showAdminLink: true, footerText: '', textStyles: DEFAULT_TEXT_STYLES,
};

// ═══════════════════════════════════════
//  REUSABLE TEXT STYLE EDITOR (exported)
// ═══════════════════════════════════════

export function TextStyleEditor({ label, style, onChange }: { label: string; style: TextStyle; onChange: (patch: Partial<TextStyle>) => void; }) {
  const [expanded, setExpanded] = useState(false);
  const { customFontOptions } = useCustomFonts();
  const allFonts = [...customFontOptions.filter(cf => !FONT_OPTIONS.some(fo => fo.value === cf.value)), ...FONT_OPTIONS];
  return (
    <div className="border border-dashed border-gray-300 rounded-xl overflow-hidden transition-all">
      <button type="button" onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors">
        <Type className="w-3.5 h-3.5 text-purple-500" />
        <span className="text-[11px] font-bold text-gray-600 flex-1 text-left">{label}</span>
        <span className="text-xs truncate max-w-[120px]" style={{ fontFamily: style.fontFamily, fontWeight: Number(style.fontWeight), fontStyle: style.italic ? 'italic' : 'normal', color: style.color }}>Aa</span>
        <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: style.color }} />
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-1 space-y-2.5 bg-gray-50/50">
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Font</label>
            <select value={style.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white" style={{ fontFamily: style.fontFamily }}>
              {allFonts.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Size</label>
              <select value={style.fontSize} onChange={(e) => onChange({ fontSize: e.target.value })} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                {SIZE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label} ({s.value})</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Weight</label>
              <div className="flex gap-0.5">
                {WEIGHT_OPTIONS.map(w => (
                  <button key={w.value} type="button" onClick={() => onChange({ fontWeight: w.value })}
                    className={`flex-1 px-1 py-1.5 rounded-md text-[9px] font-bold transition-all ${style.fontWeight === w.value ? 'bg-purple-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}>{w.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Color</label>
              <div className="flex gap-1.5 items-center">
                <input type="color" value={style.color.startsWith('rgba') || style.color.startsWith('rgb') ? '#ffffff' : style.color} onChange={(e) => onChange({ color: e.target.value })} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0" />
                <Input value={style.color} onChange={(e) => onChange({ color: e.target.value })} className="flex-1 text-[10px] font-mono h-8" placeholder="#ffffff or rgba(...)" />
              </div>
            </div>
            <button type="button" onClick={() => onChange({ italic: !style.italic })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${style.italic ? 'bg-purple-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`} title="Italic">
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Letter Spacing</label>
            <div className="flex gap-0.5">
              {[{ value: '-0.02em', label: 'Tight' }, { value: '0em', label: 'Normal' }, { value: '0.05em', label: 'Wide' }, { value: '0.1em', label: 'Wider' }, { value: '0.2em', label: 'Widest' }].map(ls => (
                <button key={ls.value} type="button" onClick={() => onChange({ letterSpacing: ls.value })}
                  className={`flex-1 px-1 py-1 rounded-md text-[9px] font-bold transition-all ${(style.letterSpacing || '0em') === ls.value ? 'bg-purple-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}>{ls.label}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2 text-center">
            <span style={textStyleToCSS(style)}>The Frame Game</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════

export function LandingPageEditor() {
  const [config, setConfig] = useState<LandingPageConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activePanel, setActivePanel] = useState<'hero' | 'signup' | 'user-types' | 'background' | 'social' | 'general'>('hero');
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/landing-config`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } });
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          const ts = data.config.textStyles || {};
          const mergedTextStyles = { ...DEFAULT_TEXT_STYLES };
          for (const key of Object.keys(DEFAULT_TEXT_STYLES) as (keyof typeof DEFAULT_TEXT_STYLES)[]) { mergedTextStyles[key] = { ...DEFAULT_TEXT_STYLES[key], ...ts[key] }; }
          setConfig({ ...DEFAULT_CONFIG, ...data.config, hero: { ...DEFAULT_CONFIG.hero, ...data.config.hero }, signup: { ...DEFAULT_CONFIG.signup, ...data.config.signup }, background: { ...DEFAULT_CONFIG.background, ...data.config.background }, social: { ...DEFAULT_CONFIG.social, ...data.config.social }, userTypes: data.config.userTypes?.length ? data.config.userTypes : DEFAULT_CONFIG.userTypes, textStyles: mergedTextStyles });
        }
      }
    } catch (error) { console.error('Error loading landing config:', error); } finally { setIsLoading(false); }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/landing-config`, { method: 'POST', headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'X-Admin-Token': token || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ config }) });
      if (response.ok) toast.success('Landing page published!');
      else toast.error(`Save failed: ${await response.text()}`);
    } catch (error) { console.error('Error saving landing config:', error); toast.error('Failed to save'); } finally { setIsSaving(false); }
  };

  const resetToDefaults = () => { if (confirm('Reset all landing page settings to defaults?')) { setConfig(DEFAULT_CONFIG); toast.success('Reset to defaults (save to publish)'); } };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error(`File too large`); e.target.value = ''; return; }
    setIsUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData(); formData.append('file', file);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'X-Admin-Token': token || '' }, body: formData });
      const data = await response.json();
      if (data.success && data.url) { setConfig(prev => ({ ...prev, hero: { ...prev.hero, headerImageUrl: data.url } })); toast.success('Hero image uploaded!'); }
      else toast.error(data.error || 'Upload failed');
    } catch (error) { console.error('Upload error:', error); toast.error('Upload failed'); } finally { setIsUploading(false); e.target.value = ''; }
  };

  const updateHero = (p: Partial<LandingPageConfig['hero']>) => setConfig(prev => ({ ...prev, hero: { ...prev.hero, ...p } }));
  const updateSignup = (p: Partial<LandingPageConfig['signup']>) => setConfig(prev => ({ ...prev, signup: { ...prev.signup, ...p } }));
  const updateBg = (p: Partial<LandingPageConfig['background']>) => setConfig(prev => ({ ...prev, background: { ...prev.background, ...p } }));
  const updateSocial = (p: Partial<LandingPageConfig['social']>) => setConfig(prev => ({ ...prev, social: { ...prev.social, ...p } }));
  const updateUserType = (i: number, p: Partial<UserTypeCard>) => setConfig(prev => ({ ...prev, userTypes: prev.userTypes.map((ut, idx) => idx === i ? { ...ut, ...p } : ut) }));
  const updateTextStyle = (key: keyof LandingPageConfig['textStyles'], p: Partial<TextStyle>) => setConfig(prev => ({ ...prev, textStyles: { ...prev.textStyles, [key]: { ...prev.textStyles[key], ...p } } }));

  if (isLoading) return <div className="bg-white rounded-3xl shadow-2xl p-12 text-center"><p className="text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>Loading landing page config...</p></div>;

  const PANELS: { key: typeof activePanel; label: string; icon: string }[] = [
    { key: 'hero', label: 'Hero', icon: '\uD83C\uDFAC' }, { key: 'signup', label: 'Signup Form', icon: '\uD83D\uDCDD' },
    { key: 'user-types', label: 'User Types', icon: '\uD83D\uDC65' }, { key: 'background', label: 'Background', icon: '\uD83C\uDFA8' },
    { key: 'social', label: 'Social', icon: '\uD83D\uDD17' }, { key: 'general', label: 'General', icon: '\u2699\uFE0F' },
  ];

  return (
    <div style={{ width: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ width: '100%', backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Fredoka, sans-serif', background: 'linear-gradient(to right, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          Landing Page Editor
        </h2>
        <p style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Comic Neue, cursive', marginBottom: '16px' }}>Customize every part of your home page</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={resetToDefaults} style={{ height: '32px', fontSize: '12px' }}><RotateCcw className="w-3 h-3 mr-1" /> Reset</Button>
          <Button onClick={() => setShowPreview(!showPreview)} variant="outline" style={{ height: '32px', fontSize: '12px' }}>{showPreview ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}{showPreview ? 'Hide' : 'Show'}</Button>
          <Button onClick={saveConfig} disabled={isSaving} style={{ height: '32px', fontSize: '12px', background: 'linear-gradient(to right, #16a34a, #059669)', color: 'white' }}><Save className="w-3 h-3 mr-1" /> {isSaving ? 'Saving...' : 'Publish'}</Button>
        </div>
      </div>

      {/* Panel Tabs */}
      <div style={{ width: '100%', backgroundColor: 'white', borderRadius: '16px', padding: '8px', marginBottom: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {PANELS.map(p => (
            <button key={p.key} onClick={() => setActivePanel(p.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'Fredoka, sans-serif',
                border: 'none',
                cursor: 'pointer',
                background: activePanel === p.key ? 'linear-gradient(to right, #f97316, #ec4899)' : '#f9fafb',
                color: activePanel === p.key ? 'white' : '#4b5563',
                boxShadow: activePanel === p.key ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <span style={{ fontSize: '14px' }}>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout - Fixed Width */}
      <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        {/* Editor Panel - Fixed 680px */}
        <div style={{ width: '680px', flexShrink: 0 }}>
          <div style={{ width: '100%', height: '600px', backgroundColor: 'white', borderRadius: '16px', padding: '20px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {activePanel === 'hero' && <HeroPanel hero={config.hero} textStyles={config.textStyles} onChange={updateHero} onTextStyleChange={updateTextStyle} onImageUpload={handleImageUpload} isUploading={isUploading} />}
            {activePanel === 'signup' && <SignupPanel signup={config.signup} textStyles={config.textStyles} onChange={updateSignup} onTextStyleChange={updateTextStyle} />}
            {activePanel === 'user-types' && <UserTypesPanel userTypes={config.userTypes} textStyles={config.textStyles} onChange={updateUserType} onTextStyleChange={updateTextStyle} onAdd={() => setConfig(prev => ({ ...prev, userTypes: [...prev.userTypes, { type: `custom-${Date.now()}`, label: 'New Type', description: 'Description', gradient: 'from-gray-400 to-gray-600', icon: '\u2B50', enabled: true }] }))} onRemove={(i) => setConfig(prev => ({ ...prev, userTypes: prev.userTypes.filter((_, idx) => idx !== i) }))} onReorder={(from, to) => { setConfig(prev => { const arr = [...prev.userTypes]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item); return { ...prev, userTypes: arr }; }); }} />}
            {activePanel === 'background' && <BackgroundPanel bg={config.background} onChange={updateBg} />}
            {activePanel === 'social' && <SocialPanel social={config.social} textStyles={config.textStyles} onChange={updateSocial} onTextStyleChange={updateTextStyle} />}
            {activePanel === 'general' && <GeneralPanel config={config} onChange={(p) => setConfig(prev => ({ ...prev, ...p }))} onTextStyleChange={updateTextStyle} />}
          </div>
        </div>

        {/* Preview Panel - Fixed 680px */}
        {showPreview && (
          <div style={{ width: '680px', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '600px', backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '100%', height: '40px', backgroundColor: '#1f2937', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f87171' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9ca3af', flex: 1, textAlign: 'center' }}>theframegame.com</span>
              </div>
              <div style={{ width: '100%', height: '560px', overflowY: 'auto' }}>
                <LandingPreview config={config} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  PANELS
// ═══════════════════════════════════════

function HeroPanel({ hero, textStyles, onChange, onTextStyleChange, onImageUpload, isUploading }: { hero: LandingPageConfig['hero']; textStyles: LandingPageConfig['textStyles']; onChange: (p: Partial<LandingPageConfig['hero']>) => void; onTextStyleChange: (key: keyof LandingPageConfig['textStyles'], p: Partial<TextStyle>) => void; onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; isUploading: boolean; }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{'\uD83C\uDFAC'} Hero Section</span></h3>
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Heading (before highlight)</Label><Input value={hero.headingBefore} onChange={(e) => onChange({ headingBefore: e.target.value })} className="mt-1" /></div>
      <TextStyleEditor label="Heading Style" style={textStyles.heroHeading} onChange={(p) => onTextStyleChange('heroHeading', p)} />
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Heading Highlight</Label><Input value={hero.headingHighlight} onChange={(e) => onChange({ headingHighlight: e.target.value })} className="mt-1" /><p className="text-[10px] text-gray-400 mt-1">Appears in accent color</p></div>
      <TextStyleEditor label="Highlight Style" style={textStyles.heroHighlight} onChange={(p) => onTextStyleChange('heroHighlight', p)} />
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Tagline</Label><Input value={hero.tagline} onChange={(e) => onChange({ tagline: e.target.value })} className="mt-1" /></div>
      <TextStyleEditor label="Tagline Style" style={textStyles.heroTagline} onChange={(p) => onTextStyleChange('heroTagline', p)} />
      <hr className="border-gray-100" />
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-200">
        <Label className="text-xs font-bold text-orange-700 uppercase mb-2 block">Hero Image</Label>
        <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${isUploading ? 'border-orange-400 bg-orange-100 text-orange-700' : 'border-orange-300 bg-white hover:border-orange-500 text-orange-600'}`}>
          {isUploading ? <><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs font-bold">Uploading...</span></> : <><Upload className="w-4 h-4" /><span className="text-xs font-bold">Upload Image</span></>}
          <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={onImageUpload} disabled={isUploading} className="hidden" />
        </label>
        {hero.headerImageUrl && <div className="mt-3 flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200"><img src={hero.headerImageUrl} alt="" className="w-12 h-12 object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /><span className="text-[10px] text-gray-500 truncate flex-1">Custom image</span><button onClick={() => onChange({ headerImageUrl: '' })} className="p-0.5 hover:bg-red-50 rounded"><X className="w-3 h-3 text-red-400" /></button></div>}
      </div>
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Image Max Width</Label><div className="flex gap-1.5 mt-1">{['max-w-xs','max-w-sm','max-w-md','max-w-lg','max-w-xl'].map(w => <button key={w} onClick={() => onChange({ imageMaxWidth: w })} className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${hero.imageMaxWidth === w ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-500'}`}>{w.replace('max-w-','')}</button>)}</div></div>
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Image Roundness</Label><div className="flex gap-1.5 mt-1">{['rounded-none','rounded-lg','rounded-2xl','rounded-3xl','rounded-full'].map(r => <button key={r} onClick={() => onChange({ imageRoundness: r })} className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${hero.imageRoundness === r ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-500'}`}>{r.replace('rounded-','') || 'none'}</button>)}</div></div>
    </div>
  );
}

function SignupPanel({ signup, textStyles, onChange, onTextStyleChange }: { signup: LandingPageConfig['signup']; textStyles: LandingPageConfig['textStyles']; onChange: (p: Partial<LandingPageConfig['signup']>) => void; onTextStyleChange: (key: keyof LandingPageConfig['textStyles'], p: Partial<TextStyle>) => void; }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">{'\uD83D\uDCDD'} Signup Form</span></h3>
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Form Title</Label><Input value={signup.title} onChange={(e) => onChange({ title: e.target.value })} className="mt-1 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }} /></div>
      <TextStyleEditor label="Title Style" style={textStyles.signupTitle} onChange={(p) => onTextStyleChange('signupTitle', p)} />
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Selector Label</Label><Input value={signup.selectorLabel} onChange={(e) => onChange({ selectorLabel: e.target.value })} className="mt-1" /></div>
      <TextStyleEditor label="Selector Label Style" style={textStyles.signupSelectorLabel} onChange={(p) => onTextStyleChange('signupSelectorLabel', p)} />
      <div className="grid grid-cols-2 gap-3"><div><Label className="text-xs font-bold text-gray-400 uppercase">Name Label</Label><Input value={signup.nameLabel} onChange={(e) => onChange({ nameLabel: e.target.value })} className="mt-1" /></div><div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={signup.nameRequired} onChange={(e) => onChange({ nameRequired: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm font-semibold text-gray-600">Required</span></label></div></div>
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Email Label</Label><Input value={signup.emailLabel} onChange={(e) => onChange({ emailLabel: e.target.value })} className="mt-1" /></div>
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Submit Button Text</Label><Input value={signup.submitText} onChange={(e) => onChange({ submitText: e.target.value })} className="mt-1" /></div>
      <TextStyleEditor label="Button Text Style" style={textStyles.signupButton} onChange={(p) => onTextStyleChange('signupButton', p)} />
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Success Message</Label><Input value={signup.successMessage} onChange={(e) => onChange({ successMessage: e.target.value })} className="mt-1" /></div>
    </div>
  );
}

function UserTypesPanel({ userTypes, textStyles, onChange, onTextStyleChange, onAdd, onRemove, onReorder }: { userTypes: UserTypeCard[]; textStyles: LandingPageConfig['textStyles']; onChange: (i: number, p: Partial<UserTypeCard>) => void; onTextStyleChange: (key: keyof LandingPageConfig['textStyles'], p: Partial<TextStyle>) => void; onAdd: () => void; onRemove: (i: number) => void; onReorder: (from: number, to: number) => void; }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">{'\uD83D\uDC65'} User Types</span></h3><Button size="sm" onClick={onAdd} className="bg-blue-500 text-white text-xs"><Plus className="w-3 h-3 mr-1" /> Add</Button></div>
      <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 space-y-2"><p className="text-[10px] font-bold text-blue-600 uppercase">Global Card Text Styles</p><TextStyleEditor label="Card Label Style" style={textStyles.userTypeLabel} onChange={(p) => onTextStyleChange('userTypeLabel', p)} /><TextStyleEditor label="Card Description Style" style={textStyles.userTypeDescription} onChange={(p) => onTextStyleChange('userTypeDescription', p)} /></div>
      <div className="space-y-2">
        {userTypes.map((ut, i) => {
          const isExpanded = expandedIdx === i;
          return (
            <div key={i} className={`border-2 rounded-xl transition-all ${ut.enabled ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}>
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex flex-col gap-0.5"><button disabled={i === 0} onClick={() => { onReorder(i, i - 1); setExpandedIdx(null); }} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button><button disabled={i === userTypes.length - 1} onClick={() => { onReorder(i, i + 1); setExpandedIdx(null); }} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button></div>
                <span className="text-lg">{ut.icon}</span><span className="text-sm font-bold flex-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{ut.label}</span>
                <button onClick={() => onChange(i, { enabled: !ut.enabled })} className={`p-1 rounded ${ut.enabled ? 'text-green-600' : 'text-gray-400'}`}>{ut.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                <button onClick={() => setExpandedIdx(isExpanded ? null : i)} className="p-1 text-gray-500 hover:text-gray-800">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                <button onClick={() => { if (confirm(`Remove "${ut.label}"?`)) onRemove(i); }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2"><div><Label className="text-[10px] font-bold text-gray-400 uppercase">Type Key</Label><Input value={ut.type} onChange={(e) => onChange(i, { type: e.target.value })} className="mt-0.5 text-xs font-mono" /></div><div><Label className="text-[10px] font-bold text-gray-400 uppercase">Label</Label><Input value={ut.label} onChange={(e) => onChange(i, { label: e.target.value })} className="mt-0.5 text-xs" /></div></div>
                  <div><Label className="text-[10px] font-bold text-gray-400 uppercase">Description</Label><Input value={ut.description} onChange={(e) => onChange(i, { description: e.target.value })} className="mt-0.5 text-xs" /></div>
                  <div className="grid grid-cols-2 gap-2"><div><Label className="text-[10px] font-bold text-gray-400 uppercase">Icon (emoji)</Label><Input value={ut.icon} onChange={(e) => onChange(i, { icon: e.target.value })} className="mt-0.5 text-lg text-center" /></div><div><Label className="text-[10px] font-bold text-gray-400 uppercase">Gradient</Label><Input value={ut.gradient} onChange={(e) => onChange(i, { gradient: e.target.value })} className="mt-0.5 text-xs font-mono" /></div></div>
                  <div className={`h-4 rounded-lg bg-gradient-to-r ${ut.gradient}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BackgroundPanel({ bg, onChange }: { bg: LandingPageConfig['background']; onChange: (p: Partial<LandingPageConfig['background']>) => void; }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">{'\uD83C\uDFA8'} Background Gradient</span></h3>
      {[{ label: 'From', key: 'gradientFrom' as const, val: bg.gradientFrom }, { label: 'Via', key: 'gradientVia' as const, val: bg.gradientVia }, { label: 'To', key: 'gradientTo' as const, val: bg.gradientTo }].map(({ label, key, val }) => (
        <div key={key}><Label className="text-xs font-bold text-gray-400 uppercase">{label} Color</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={val} onChange={(e) => onChange({ [key]: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer" /><Input value={val} onChange={(e) => onChange({ [key]: e.target.value })} className="flex-1 text-xs font-mono" /></div></div>
      ))}
      <div className="h-16 rounded-xl" style={{ background: `linear-gradient(135deg, ${bg.gradientFrom}, ${bg.gradientVia}, ${bg.gradientTo})` }} />
      <div><Label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Quick Presets</Label><div className="grid grid-cols-3 gap-2">{[{ name: 'Original', from: '#2563eb', via: '#a855f7', to: '#ec4899' }, { name: 'Sunset', from: '#f97316', via: '#ef4444', to: '#ec4899' }, { name: 'Ocean', from: '#0891b2', via: '#2563eb', to: '#7c3aed' }, { name: 'Forest', from: '#059669', via: '#10b981', to: '#22d3ee' }, { name: 'Midnight', from: '#1e1b4b', via: '#312e81', to: '#4c1d95' }, { name: 'Candy', from: '#f472b6', via: '#c084fc', to: '#60a5fa' }].map(p => (<button key={p.name} onClick={() => onChange({ gradientFrom: p.from, gradientVia: p.via, gradientTo: p.to })} className="rounded-xl border-2 border-gray-200 hover:border-gray-400 p-1 transition-all"><div className="h-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.via}, ${p.to})` }} /><span className="text-[10px] text-gray-500 font-bold block mt-1">{p.name}</span></button>))}</div></div>
    </div>
  );
}

function SocialPanel({ social, textStyles, onChange, onTextStyleChange }: { social: LandingPageConfig['social']; textStyles: LandingPageConfig['textStyles']; onChange: (p: Partial<LandingPageConfig['social']>) => void; onTextStyleChange: (key: keyof LandingPageConfig['textStyles'], p: Partial<TextStyle>) => void; }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">{'\uD83D\uDD17'} Social Sharing</span></h3>
      <label className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 cursor-pointer"><input type="checkbox" checked={social.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} className="w-5 h-5 rounded" /><span className="text-sm font-bold">Show Social Sharing Buttons</span></label>
      {social.enabled && (<>
        <div><Label className="text-xs font-bold text-gray-400 uppercase">Share Text</Label><Textarea value={social.shareText} onChange={(e) => onChange({ shareText: e.target.value })} rows={3} className="mt-1 text-sm" /></div>
        <TextStyleEditor label="'Share with friends' Heading Style" style={textStyles.socialHeading} onChange={(p) => onTextStyleChange('socialHeading', p)} />
        <div className="space-y-2"><Label className="text-xs font-bold text-gray-400 uppercase">Platforms</Label>{[{ key: 'showTwitter' as const, label: 'Twitter / X', val: social.showTwitter }, { key: 'showFacebook' as const, label: 'Facebook', val: social.showFacebook }, { key: 'showLinkedIn' as const, label: 'LinkedIn', val: social.showLinkedIn }, { key: 'showCopyLink' as const, label: 'Copy Link', val: social.showCopyLink }].map(p => (<label key={p.key} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={p.val} onChange={(e) => onChange({ [p.key]: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm">{p.label}</span></label>))}</div>
      </>)}
    </div>
  );
}

function GeneralPanel({ config, onChange, onTextStyleChange }: { config: LandingPageConfig; onChange: (p: Partial<LandingPageConfig>) => void; onTextStyleChange: (key: keyof LandingPageConfig['textStyles'], p: Partial<TextStyle>) => void; }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}><span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">{'\u2699\uFE0F'} General Settings</span></h3>
      <label className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 cursor-pointer"><input type="checkbox" checked={config.showAdminLink} onChange={(e) => onChange({ showAdminLink: e.target.checked })} className="w-5 h-5 rounded" /><div><span className="text-sm font-bold">Show Admin Link</span><p className="text-[10px] text-gray-400">Displays "Admin Login" at the bottom</p></div></label>
      <TextStyleEditor label="Admin Link Style" style={config.textStyles.adminLink} onChange={(p) => onTextStyleChange('adminLink', p)} />
      <div><Label className="text-xs font-bold text-gray-400 uppercase">Footer Text</Label><Textarea value={config.footerText} onChange={(e) => onChange({ footerText: e.target.value })} rows={3} className="mt-1 text-sm" placeholder="Optional footer text..." /></div>
      <TextStyleEditor label="Footer Text Style" style={config.textStyles.footerText} onChange={(p) => onTextStyleChange('footerText', p)} />
    </div>
  );
}

// ═══════════════════════════════════════
//  LIVE PREVIEW
// ═══════════════════════════════════════

function LandingPreview({ config }: { config: LandingPageConfig }) {
  const { hero, signup, userTypes, background, social, textStyles: ts } = config;
  const enabledTypes = userTypes.filter(ut => ut.enabled);
  const previewScale = (style: TextStyle, scale: number = 0.55): React.CSSProperties => { const css = textStyleToCSS(style); const sz = parseFloat(style.fontSize) || 1; return { ...css, fontSize: `${sz * scale}rem` }; };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${background.gradientFrom}, ${background.gradientVia}, ${background.gradientTo})` }}>
      <div className="text-center mb-6">
        <div className={`${hero.imageMaxWidth} mx-auto ${hero.imageRoundness} shadow-2xl mb-4 overflow-hidden bg-white/10`}>{hero.headerImageUrl ? <img src={hero.headerImageUrl} alt="" className="w-full" /> : <div className="aspect-video flex items-center justify-center text-white/40 text-sm">Default image</div>}</div>
        <h2 style={previewScale(ts.heroHeading, 0.5)}>{hero.headingBefore}{' '}<span style={previewScale(ts.heroHighlight, 0.5)}>{hero.headingHighlight}</span></h2>
        <p className="mt-1" style={previewScale(ts.heroTagline, 0.6)}>{hero.tagline}</p>
      </div>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4">
        <h3 className="text-center mb-3" style={previewScale(ts.signupTitle, 0.5)}>{signup.title}</h3>
        <p className="mb-2" style={previewScale(ts.signupSelectorLabel, 0.55)}>{signup.selectorLabel}</p>
        <div className="grid grid-cols-3 gap-1 mb-3">{enabledTypes.slice(0, 6).map(ut => (<div key={ut.type} className="relative p-1.5 rounded-lg border border-gray-200 text-center overflow-hidden"><div className={`absolute inset-0 bg-gradient-to-br ${ut.gradient} opacity-10 rounded-lg pointer-events-none`} /><span className="text-sm">{ut.icon}</span><p style={{ ...previewScale(ts.userTypeLabel, 0.5), lineHeight: '1.2' }}>{ut.label}</p></div>))}{enabledTypes.length > 6 && <div className="p-1.5 rounded-lg border border-gray-200 text-center flex items-center justify-center"><span className="text-[8px] text-gray-500">+{enabledTypes.length - 6} more</span></div>}</div>
        <div className="space-y-1.5 mb-3"><div className="bg-gray-100 rounded-lg px-2 py-1.5 text-[9px] text-gray-400">{signup.nameLabel}</div><div className="bg-gray-100 rounded-lg px-2 py-1.5 text-[9px] text-gray-400">{signup.emailLabel}</div></div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-center py-2 rounded-xl" style={previewScale(ts.signupButton, 0.5)}>{signup.submitText}</div>
      </div>
      {social.enabled && (<div className="mt-4 text-center"><p className="mb-2" style={previewScale(ts.socialHeading, 0.55)}>Share with friends!</p><div className="flex gap-2 justify-center">{social.showTwitter && <div className="w-8 h-8 bg-white/20 rounded-full" />}{social.showFacebook && <div className="w-8 h-8 bg-white/20 rounded-full" />}{social.showLinkedIn && <div className="w-8 h-8 bg-white/20 rounded-full" />}{social.showCopyLink && <div className="w-8 h-8 bg-white/20 rounded-full" />}</div></div>)}
      {config.showAdminLink && <p className="mt-3" style={previewScale(ts.adminLink, 0.55)}>Admin Login &rarr;</p>}
      {config.footerText && <p className="mt-2 text-center max-w-xs" style={previewScale(ts.footerText, 0.55)}>{config.footerText}</p>}
    </div>
  );
}