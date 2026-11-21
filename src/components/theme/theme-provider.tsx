"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PRESET,
  MODE_STORAGE_KEY,
  PRESET_STORAGE_KEY,
  isPresetId,
  type PresetId,
} from "@/lib/theme-presets";

type PresetContextValue = {
  preset: PresetId;
  setPreset: (preset: PresetId) => void;
  resetPreset: () => void;
};

const PresetContext = createContext<PresetContextValue | null>(null);

function readStoredPreset(): PresetId {
  try {
    const stored = window.localStorage.getItem(PRESET_STORAGE_KEY);
    if (isPresetId(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_PRESET;
}

function applyPreset(preset: PresetId) {
  document.documentElement.setAttribute("data-theme-preset", preset);
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<PresetId>(DEFAULT_PRESET);

  useEffect(() => {
    const stored = readStoredPreset();
    setPresetState(stored);
    applyPreset(stored);
  }, []);

  const setPreset = useCallback((next: PresetId) => {
    setPresetState(next);
    applyPreset(next);
    try {
      window.localStorage.setItem(PRESET_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const resetPreset = useCallback(() => setPreset(DEFAULT_PRESET), [setPreset]);

  return (
    <PresetContext.Provider value={{ preset, setPreset, resetPreset }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey={MODE_STORAGE_KEY}
      >
        {children}
      </NextThemesProvider>
    </PresetContext.Provider>
  );
}

export function useBrandPreset() {
  const context = useContext(PresetContext);
  if (!context) {
    throw new Error("useBrandPreset must be used inside AppThemeProvider");
  }
  return context;
}

export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var s=localStorage.getItem('${PRESET_STORAGE_KEY}');var allowed=['classic','emerald','burgundy','minimal'];if(s&&allowed.indexOf(s)>-1){d.setAttribute('data-theme-preset',s);}else{d.setAttribute('data-theme-preset','classic');}if(!localStorage.getItem('${MODE_STORAGE_KEY}')){var raw=localStorage.getItem('lawyeros-visitor-prefs');if(raw){var p=JSON.parse(raw);if(p&&p.preset&&allowed.indexOf(p.preset)>-1){localStorage.setItem('${PRESET_STORAGE_KEY}',p.preset);d.setAttribute('data-theme-preset',p.preset);}if(p&&(p.defaultMode==='light'||p.defaultMode==='dark'||p.defaultMode==='system')){localStorage.setItem('${MODE_STORAGE_KEY}',p.defaultMode);}}}}catch(e){}})();`;
