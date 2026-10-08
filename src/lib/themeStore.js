"use client";

/**
 * Design System Theme & Font Engine for AGMon (VS Code Standard)
 * Manages color themes, typography scales, font families, and live persistence.
 */

export const THEME_STORAGE_KEY = "agmon_theme_settings";
export const THEME_CHANGE_EVENT = "agmon:theme-change";

export const AVAILABLE_THEMES = [
  {
    id: "dark-plus",
    name: "Dark+ (VS Code Modern)",
    category: "dark",
    description: "Default classic charcoal dark theme optimized for long coding sessions.",
    colors: {
      workbench: "#181818",
      editor: "#1e1e1e",
      sidebar: "#252526",
      accent: "#007acc",
      border: "#2b2b2b",
      fg: "#cccccc",
    },
  },
  {
    id: "one-dark-pro",
    name: "One Dark Pro",
    category: "dark",
    description: "Iconic Atom theme with soothing slate tones and vibrant cyan accents.",
    colors: {
      workbench: "#1e2227",
      editor: "#282c34",
      sidebar: "#21252b",
      accent: "#61afef",
      border: "#181a1f",
      fg: "#abb2bf",
    },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    category: "dark",
    description: "Vibrant neon-infused cyberpunk dark blue theme with great contrast.",
    colors: {
      workbench: "#16161e",
      editor: "#1a1b26",
      sidebar: "#16161e",
      accent: "#7aa2f7",
      border: "#292e42",
      fg: "#a9b1d6",
    },
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    category: "dark",
    description: "Modern high-contrast dark palette modeled after GitHub's design system.",
    colors: {
      workbench: "#0d1117",
      editor: "#0d1117",
      sidebar: "#161b22",
      accent: "#2f81f7",
      border: "#30363d",
      fg: "#c9d1d9",
    },
  },
  {
    id: "monokai-pro",
    name: "Monokai Pro",
    category: "dark",
    description: "Sophisticated warm dark theme with bright yellow & amber highlights.",
    colors: {
      workbench: "#19181a",
      editor: "#221f22",
      sidebar: "#2d2a2e",
      accent: "#ffd866",
      border: "#403e41",
      fg: "#fcfcfa",
    },
  },
  {
    id: "light-plus",
    name: "Light+ (VS Code Modern)",
    category: "light",
    description: "Clean high-visibility developer light theme with crisp borders.",
    colors: {
      workbench: "#f3f3f3",
      editor: "#ffffff",
      sidebar: "#f8f8f8",
      accent: "#007acc",
      border: "#e5e7eb",
      fg: "#333333",
    },
  },
];

export const AVAILABLE_UI_FONTS = [
  { id: "system", name: "System Default (SF Pro / Segoe UI / Roboto)", value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: "inter", name: "Inter (Modern UI)", value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: "segoe", name: "Segoe UI (Windows Native)", value: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' },
  { id: "roboto", name: "Roboto (Material)", value: '"Roboto", "Helvetica Neue", Arial, sans-serif' },
  { id: "geist", name: "Geist Sans (Vercel Modern)", value: '"Geist Sans", "Geist", -apple-system, BlinkMacSystemFont, sans-serif' },
];

export const AVAILABLE_CODE_FONTS = [
  { id: "system-mono", name: "System Monospace (SF Mono / Menlo / Consolas)", value: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' },
  { id: "jetbrains", name: "JetBrains Mono (Developer Friendly)", value: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace' },
  { id: "fira-code", name: "Fira Code (Ligatures Ready)", value: '"Fira Code", ui-monospace, Menlo, Consolas, monospace' },
  { id: "cascadia", name: "Cascadia Code (VS / Terminal)", value: '"Cascadia Code", "Cascadia Mono", Consolas, monospace' },
  { id: "geist-mono", name: "Geist Mono (Clean Technical)", value: '"Geist Mono", ui-monospace, Menlo, Consolas, monospace' },
];

export const AVAILABLE_FONT_SIZES = [
  { id: "12", label: "12px (Compact)" },
  { id: "13", label: "13px (VS Code Standard)" },
  { id: "14", label: "14px (Comfortable)" },
  { id: "15", label: "15px (Large Text)" },
];

export const DEFAULT_THEME_SETTINGS = {
  theme: "dark-plus",
  uiFont: "system",
  codeFont: "system-mono",
  fontSize: "13",
};

/**
 * Returns the currently active font family string (for Canvas/PixiJS, SVG, or Monaco)
 */
export function getActiveFont(type = "ui") {
  if (typeof window === "undefined") {
    return type === "mono"
      ? 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  }
  const settings = getThemeSettings();
  if (type === "mono") {
    const found = AVAILABLE_CODE_FONTS.find((f) => f.id === settings.codeFont);
    return found ? found.value : 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
  }
  const found = AVAILABLE_UI_FONTS.find((f) => f.id === settings.uiFont);
  return found ? found.value : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
}

/**
 * Load theme settings from localStorage
 */
export function getThemeSettings() {
  if (typeof window === "undefined") return { ...DEFAULT_THEME_SETTINGS };
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn("[themeStore] Failed to load theme settings:", err);
  }
  return { ...DEFAULT_THEME_SETTINGS };
}

/**
 * Save theme settings to localStorage and apply live DOM changes
 */
export function saveThemeSettings(settings) {
  if (typeof window === "undefined") return;
  try {
    const updated = { ...getThemeSettings(), ...settings };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
    applyThemeSettingsToDOM(updated);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: updated }));
  } catch (err) {
    console.warn("[themeStore] Failed to save theme settings:", err);
  }
}

/**
 * Apply theme and font settings to the <html> document root
 */
export function applyThemeSettingsToDOM(settings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // 1. Theme Data Attribute
  const theme = settings.theme || "dark-plus";
  root.setAttribute("data-theme", theme);
  if (theme === "light-plus") {
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }

  // 2. UI Font Family - synchronize all standard CSS variable aliases
  const uiFontObj = AVAILABLE_UI_FONTS.find((f) => f.id === settings.uiFont) || AVAILABLE_UI_FONTS[0];
  if (uiFontObj) {
    root.style.setProperty("--font-family-ui", uiFontObj.value);
    root.style.setProperty("--font-sans", uiFontObj.value);
    root.style.setProperty("--font-ui", uiFontObj.value);
  }

  // 3. Monospace Code Font Family - synchronize all standard CSS variable aliases
  const codeFontObj = AVAILABLE_CODE_FONTS.find((f) => f.id === settings.codeFont) || AVAILABLE_CODE_FONTS[0];
  if (codeFontObj) {
    root.style.setProperty("--font-family-mono", codeFontObj.value);
    root.style.setProperty("--font-mono", codeFontObj.value);
    root.style.setProperty("--font-code", codeFontObj.value);
  }

  // 4. Base Font Size
  const size = settings.fontSize || "13";
  root.style.setProperty("--font-size-ui", `${size}px`);
  root.style.setProperty("--font-size-base", `${size}px`);
}

/**
 * Initializer helper to run on application mount
 */
export function initThemeEngine() {
  if (typeof window === "undefined") return;
  const settings = getThemeSettings();
  applyThemeSettingsToDOM(settings);
}
