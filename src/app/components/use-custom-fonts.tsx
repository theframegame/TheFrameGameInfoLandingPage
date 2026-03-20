import { useState, useEffect, useCallback } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface CustomFont {
  id: string;
  name: string;
  safeName: string;
  storagePath: string;
  format: string;
  fileSize: number;
  uploadedAt: string;
  /** Signed URL to the actual font binary – use this in @font-face */
  fontUrl: string | null;
}

// Global cache so we don't re-inject the same font twice
let injectedFonts = new Set<string>();
let styleElement: HTMLStyleElement | null = null;

function getOrCreateStyleElement(): HTMLStyleElement {
  if (styleElement && document.head.contains(styleElement)) return styleElement;
  styleElement = document.createElement('style');
  styleElement.id = 'custom-fonts-injection';
  document.head.appendChild(styleElement);
  return styleElement;
}

function injectFontFace(font: CustomFont) {
  if (!font.fontUrl) return;              // no URL → can't load
  if (injectedFonts.has(font.id)) return; // already injected

  const formatMap: Record<string, string> = {
    ttf: 'truetype',
    otf: 'opentype',
    woff: 'woff',
    woff2: 'woff2',
  };
  const formatStr = formatMap[font.format] || 'truetype';

  const css = `
@font-face {
  font-family: '${font.name}';
  src: url('${font.fontUrl}') format('${formatStr}');
  font-display: swap;
}
`;
  const el = getOrCreateStyleElement();
  el.textContent += css;
  injectedFonts.add(font.id);
}

const API = `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828`;

async function fetchFonts(): Promise<CustomFont[]> {
  try {
    const res = await fetch(`${API}/fonts`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.fonts || []) as CustomFont[];
  } catch (e) {
    console.error('Error loading custom fonts:', e);
    return [];
  }
}

/** Returns loaded custom fonts and injects @font-face rules. */
export function useCustomFonts() {
  const [fonts, setFonts] = useState<CustomFont[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchFonts();
      if (!cancelled) {
        setFonts(list);
        list.forEach(injectFontFace);
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /** Force a re-fetch (e.g. after uploading a new font in admin) */
  const refresh = useCallback(async () => {
    const list = await fetchFonts();
    setFonts(list);

    // Reset injection so new / changed signed URLs are picked up
    injectedFonts = new Set();
    const el = getOrCreateStyleElement();
    el.textContent = '';
    list.forEach(injectFontFace);
  }, []);

  /** Convert loaded custom fonts into FONT_OPTIONS entries */
  const customFontOptions = fonts.map((f) => ({
    value: `'${f.name}', sans-serif`,
    label: f.name,
  }));

  return { fonts, customFontOptions, isLoading, refresh };
}
