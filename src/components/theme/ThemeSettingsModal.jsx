"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Type,
  Check,
  RotateCcw,
  X,
  SlidersHorizontal,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import {
  AVAILABLE_THEMES,
  AVAILABLE_UI_FONTS,
  AVAILABLE_CODE_FONTS,
  AVAILABLE_FONT_SIZES,
  DEFAULT_THEME_SETTINGS,
  getThemeSettings,
  saveThemeSettings,
  THEME_CHANGE_EVENT,
} from "../../lib/themeStore.js";

export default function ThemeSettingsModal({ isOpen = false, onClose, initialTab = "themes" }) {
  const [activeTab, setActiveTab] = useState(initialTab || "themes");
  const [settings, setSettings] = useState(DEFAULT_THEME_SETTINGS);

  useEffect(() => {
    if (isOpen) {
      setSettings(getThemeSettings());
      setActiveTab(initialTab || "themes");
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleSync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleSync);
  }, []);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId) => {
    const updated = { ...settings, theme: themeId };
    setSettings(updated);
    saveThemeSettings(updated);
  };

  const handleUpdateFont = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveThemeSettings(updated);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_THEME_SETTINGS);
    saveThemeSettings(DEFAULT_THEME_SETTINGS);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-2xl bg-[var(--bg-editor)] border border-[var(--border-card)] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[var(--text-main)] font-sans max-h-[85vh]">
        {/* Header */}
        <div className="h-[46px] min-h-[46px] bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-4 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-bright)]">
              Preferences: Theme & Typography (VS Code Settings)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            title="Close (Escape)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-card-inner)] shrink-0 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("themes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "themes"
                ? "bg-[var(--bg-card)] text-[var(--text-bright)] border border-[var(--border-card)] shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-bright)]"
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Color Themes ({AVAILABLE_THEMES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fonts")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "fonts"
                ? "bg-[var(--bg-card)] text-[var(--text-bright)] border border-[var(--border-card)] shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-bright)]"
            }`}
          >
            <Type className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            <span>Typography & Fonts</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "themes" ? (
            /* TAB 1: COLOR THEMES */
            <div className="space-y-3">
              <div className="text-xs text-[var(--text-muted)]">
                Choose color theme for workbench, dialogs, sidebar, and toolbars:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_THEMES.map((th) => {
                  const isSelected = settings.theme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => handleSelectTheme(th.id)}
                      className={`group relative p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? "bg-[var(--bg-card)] border-[var(--accent-primary)] shadow-md shadow-[var(--accent-primary)]/10 ring-1 ring-[var(--accent-primary)]/40"
                          : "bg-[var(--bg-card-inner)] border-[var(--border-card)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-card)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[var(--text-bright)]">
                            {th.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded border border-[var(--border-card)] text-[var(--text-muted)] uppercase font-mono bg-[var(--bg-card)]">
                            {th.category}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[var(--accent-primary)] text-[var(--text-on-accent,#ffffff)] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      {/* Swatch color preview bar */}
                      <div className="flex items-center gap-1 h-3 rounded overflow-hidden p-0.5 bg-black/10 dark:bg-black/40 border border-[var(--border-card)]">
                        <span
                          className="h-full flex-1 rounded-xs"
                          style={{ backgroundColor: th.colors.workbench }}
                          title={`Workbench: ${th.colors.workbench}`}
                        />
                        <span
                          className="h-full flex-1 rounded-xs"
                          style={{ backgroundColor: th.colors.editor }}
                          title={`Editor: ${th.colors.editor}`}
                        />
                        <span
                          className="h-full flex-1 rounded-xs"
                          style={{ backgroundColor: th.colors.sidebar }}
                          title={`Sidebar: ${th.colors.sidebar}`}
                        />
                        <span
                          className="h-full w-4 rounded-xs"
                          style={{ backgroundColor: th.colors.accent }}
                          title={`Accent: ${th.colors.accent}`}
                        />
                      </div>

                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {th.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TAB 2: TYPOGRAPHY & FONTS */
            <div className="space-y-4 text-xs">
              {/* UI Font */}
              <div className="p-3 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-bright)] uppercase tracking-wider text-[11px]">
                    1. UI Font Family
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">--font-family-ui</span>
                </div>
                <select
                  value={settings.uiFont}
                  onChange={(e) => handleUpdateFont("uiFont", e.target.value)}
                  className="w-full bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-card)] rounded px-3 py-1.5 text-xs outline-none focus:border-[var(--accent-primary)] cursor-pointer"
                >
                  {AVAILABLE_UI_FONTS.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[var(--bg-card)] text-[var(--text-main)]">
                      {f.name}
                    </option>
                  ))}
                </select>
                <div
                  className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] text-xs"
                  style={{ fontFamily: "var(--font-family-ui)" }}
                >
                  UI Preview: Agent Factory - Realtime multi-agent activity and telemetry monitor.
                </div>
              </div>

              {/* Code Monospace Font */}
              <div className="p-3 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-bright)] uppercase tracking-wider text-[11px]">
                    2. Monospace Font (Code & Console)
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">--font-family-mono</span>
                </div>
                <select
                  value={settings.codeFont}
                  onChange={(e) => handleUpdateFont("codeFont", e.target.value)}
                  className="w-full bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-card)] rounded px-3 py-1.5 text-xs outline-none focus:border-[var(--accent-primary)] cursor-pointer"
                >
                  {AVAILABLE_CODE_FONTS.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[var(--bg-card)] text-[var(--text-main)]">
                      {f.name}
                    </option>
                  ))}
                </select>
                <div
                  className="p-2 rounded bg-[var(--bg-chat-code)] border border-[var(--border-card)] text-[var(--text-chat-code)] font-mono text-[11px] leading-relaxed"
                  style={{ fontFamily: "var(--font-family-mono)" }}
                >
                  const agent = &#123; id: &quot;gemini-3.8-flash&quot;, tokens: 142857, state: &quot;streaming&quot; &#125;;
                </div>
              </div>

              {/* Font Size */}
              <div className="p-3 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-bright)] uppercase tracking-wider text-[11px]">
                    3. Base Font Size
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">--font-size-ui</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_FONT_SIZES.map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => handleUpdateFont("fontSize", sz.id)}
                      className={`p-2 rounded border text-xs font-semibold transition-colors cursor-pointer text-center ${
                        settings.fontSize === sz.id
                          ? "bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold shadow-xs"
                          : "bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-[46px] min-h-[46px] bg-[var(--bg-card)] border-t border-[var(--border-subtle)] px-4 flex items-center justify-between shrink-0 select-none">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-card-inner)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-bright)] border border-[var(--border-card)] text-xs transition-colors cursor-pointer"
            title="Restore default settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[var(--accent-primary)] hover:opacity-90 text-[var(--text-on-accent,#ffffff)] text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
