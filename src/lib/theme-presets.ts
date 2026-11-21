export const THEME_PRESETS = [
  {
    id: "classic",
    name: "Classic Legal",
    description: "Deep navy and warm muted gold",
    primary: "#0F172A",
    accent: "#B45309",
  },
  {
    id: "emerald",
    name: "Corporate Emerald",
    description: "Established green with amber accents",
    primary: "#064E3B",
    accent: "#D97706",
  },
  {
    id: "burgundy",
    name: "Supreme Burgundy",
    description: "Traditional oxblood with antique gold",
    primary: "#7F1D1D",
    accent: "#CA8A04",
  },
  {
    id: "minimal",
    name: "Modern Minimal",
    description: "Ink black with a precise blue accent",
    primary: "#18181B",
    accent: "#2563EB",
  },
] as const;

export type PresetId = (typeof THEME_PRESETS)[number]["id"];

export const DEFAULT_PRESET: PresetId = "classic";
export const PRESET_STORAGE_KEY = "lawyeros-preset";
export const MODE_STORAGE_KEY = "lawyeros-mode";

export function isPresetId(value: unknown): value is PresetId {
  return THEME_PRESETS.some((preset) => preset.id === value);
}

export function getPreset(id: string | undefined) {
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0];
}
