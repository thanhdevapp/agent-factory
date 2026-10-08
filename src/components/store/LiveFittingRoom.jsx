"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Bot,
  Play,
  Pause,
  Shuffle,
  RotateCcw,
  Check,
  Palette,
  Laptop,
  Layers,
  Sliders,
  Tv,
  Eye,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  COSMETIC_CATALOG,
  getSupporterState,
  equipCustomLoadout,
  SUPPORTER_CHANGE_EVENT,
} from "@/lib/supporterStore";
import { LiveReactAgent } from "./LiveReactAgent";



export default function LiveFittingRoom({ initialStoreState, onEquipSuccess }) {
  const [storeState, setStoreState] = useState(initialStoreState || getSupporterState());

  // Loadout state (working copy in fitting room before applying)
  const [activeSkinId, setActiveSkinId] = useState(storeState.equippedSkin || "skin_0");
  const [activePetId, setActivePetId] = useState(storeState.equippedPet || "pet_0");
  const [activeProps, setActiveProps] = useState(storeState.equippedProps || ["prop_0"]);
  const [activeAuraId, setActiveAuraId] = useState(storeState.equippedAura || "aura_0");
  const [activeThemeId, setActiveThemeId] = useState(storeState.equippedOfficeTheme || "theme_default");

  // Animation & Stage controls
  const [currentMode, setCurrentMode] = useState("streaming"); // 'streaming' | 'happy' | 'sleeping' | 'error' | 'looping' | 'pending'
  const [intensity, setIntensity] = useState(0.75);
  const [clientType, setClientType] = useState("cli"); // 'cli' | 'app'
  const [isPlaying, setIsPlaying] = useState(true);

  // Mixer Category Tabs: 'skins' | 'props' | 'pets' | 'auras' | 'themes'
  const [mixerTab, setMixerTab] = useState("skins");
  const [searchQuery, setSearchQuery] = useState("");
  const [archetypeFilter, setArchetypeFilter] = useState("all");
  const [saveToast, setSaveToast] = useState(false);

  const [telemetry, setTelemetry] = useState({ bob: 0, shake: 0, rotL: 0, rotR: 0, blink: false, fps: 60 });

  // Sync with store state changes
  useEffect(() => {
    const handleStoreChange = (e) => {
      const next = e.detail || getSupporterState();
      setStoreState(next);
    };
    window.addEventListener(SUPPORTER_CHANGE_EVENT, handleStoreChange);
    return () => window.removeEventListener(SUPPORTER_CHANGE_EVENT, handleStoreChange);
  }, []);

  // Lookups for currently active item metadata
  const currentSkinItem = useMemo(() => {
    return (COSMETIC_CATALOG.skins || []).find((s) => s.id === activeSkinId) || (COSMETIC_CATALOG.skins || [])[0];
  }, [activeSkinId]);

  const currentPetItem = useMemo(() => {
    return (COSMETIC_CATALOG.pets || []).find((p) => p.id === activePetId) || (COSMETIC_CATALOG.pets || [])[0];
  }, [activePetId]);

  const currentAuraItem = useMemo(() => {
    return (COSMETIC_CATALOG.auras || []).find((a) => a.id === activeAuraId) || (COSMETIC_CATALOG.auras || [])[0];
  }, [activeAuraId]);

  const currentThemeItem = useMemo(() => {
    return (COSMETIC_CATALOG.officeThemes || []).find((t) => t.id === activeThemeId) || (COSMETIC_CATALOG.officeThemes || [])[0];
  }, [activeThemeId]);



  // --------------------------------------------------------------------------
  // ACTIONS: RANDOMIZE, RESET, APPLY LOADOUT
  // --------------------------------------------------------------------------

  // Apply complete loadout to localStorage & Virtual Office
  const handleApplyLoadout = () => {
    const updated = equipCustomLoadout({
      equippedSkin: activeSkinId,
      equippedPet: activePetId,
      equippedProps: activeProps,
      equippedAura: activeAuraId,
      equippedOfficeTheme: activeThemeId,
    });
    setStoreState(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
    if (onEquipSuccess) onEquipSuccess(updated);
  };

  // Randomize loadout from unlocked or catalog items
  const handleRandomize = () => {
    const skins = COSMETIC_CATALOG.skins || [];
    const pets = COSMETIC_CATALOG.pets || [];
    const auras = COSMETIC_CATALOG.auras || [];
    const themes = COSMETIC_CATALOG.officeThemes || [];
    const props = COSMETIC_CATALOG.props || [];

    if (skins.length) {
      const randSkin = skins[Math.floor(Math.random() * skins.length)].id;
      setActiveSkinId(randSkin);
    }
    if (pets.length) {
      const randPet = pets[Math.floor(Math.random() * pets.length)].id;
      setActivePetId(randPet);
    }
    if (auras.length) {
      const randAura = auras[Math.floor(Math.random() * auras.length)].id;
      setActiveAuraId(randAura);
    }
    if (themes.length) {
      const randTheme = themes[Math.floor(Math.random() * themes.length)].id;
      setActiveThemeId(randTheme);
    }
    if (props.length) {
      const shuffled = [...props].sort(() => 0.5 - Math.random());
      setActiveProps(shuffled.slice(0, 3).map((p) => p.id));
    }
  };

  // Revert back to currently equipped state
  const handleReset = () => {
    setActiveSkinId(storeState.equippedSkin || "skin_0");
    setActivePetId(storeState.equippedPet || "pet_0");
    setActiveProps(storeState.equippedProps || ["prop_0"]);
    setActiveAuraId(storeState.equippedAura || "aura_0");
    setActiveThemeId(storeState.equippedOfficeTheme || "theme_default");
  };

  // Toggle prop selection
  const handleTogglePropItem = (propId) => {
    setActiveProps((prev) => {
      if (prev.includes(propId)) {
        return prev.filter((id) => id !== propId);
      }
      return [...prev, propId];
    });
  };

  // Filter items in the mixer drawer
  const filteredMixerItems = useMemo(() => {
    let list = [];
    if (mixerTab === "skins") list = COSMETIC_CATALOG.skins || [];
    else if (mixerTab === "props") list = COSMETIC_CATALOG.props || [];
    else if (mixerTab === "pets") list = COSMETIC_CATALOG.pets || [];
    else if (mixerTab === "auras") list = COSMETIC_CATALOG.auras || [];
    else if (mixerTab === "themes") list = COSMETIC_CATALOG.officeThemes || [];

    return list.filter((item) => {
      if (archetypeFilter !== "all" && item.archetype !== archetypeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.archetype?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q)
      );
    });
  }, [mixerTab, searchQuery, archetypeFilter]);

  return (
    <div className="space-y-4">
      {/* Top Banner / Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#171922] via-[#1c1d27] to-[#14151c] border border-[#2b2d3c] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Live Fitting Room & Sandbox</h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-wider">
                Interactive 3D Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mix and match 148 skins, desk props, cyber pets, auras, and floor themes with live animated actions.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242632] hover:bg-[#2e3142] border border-[#3b3e52] text-xs font-semibold text-slate-200 transition-all shadow-sm"
            title="Randomize a creative mix"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Randomize</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242632] hover:bg-[#2e3142] border border-[#3b3e52] text-xs font-semibold text-slate-200 transition-all shadow-sm"
            title="Revert to currently equipped loadout"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleApplyLoadout}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply to Virtual Office</span>
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Custom loadout successfully saved and synchronized with your Virtual Office canvas!</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">EQUIPPED LIVE</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ==================== LEFT COLUMN: LIVE STAGE & CONTROLLER ==================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#17171e] border border-[#2b2b36] shadow-xl space-y-3">
            {/* Stage Header */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">Real-Time Avatar Stage</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>FPS: <strong className="text-emerald-400">{telemetry.fps}</strong></span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                >
                  {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
              </div>
            </div>

            {/* Live React SVG Agent Viewport */}
            <div className="relative rounded-lg overflow-hidden border border-[#2d2d3a] bg-[#0c0d12] flex items-center justify-center shadow-inner h-[380px]">
              <LiveReactAgent
                skinId={activeSkinId}
                skinItem={currentSkinItem}
                petId={activePetId}
                petItem={currentPetItem}
                propsList={activeProps}
                auraId={activeAuraId}
                auraItem={currentAuraItem}
                themeId={activeThemeId}
                themeItem={currentThemeItem}
                mode={currentMode}
                intensity={intensity}
                clientType={clientType}
                isPlaying={isPlaying}
                interactive={true}
                showFloor={true}
                showDesk={true}
                onTelemetry={setTelemetry}
                className="w-full h-full"
              />

              {/* Theme Badge Overlay */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 pointer-events-none z-10">
                <Palette className="w-3 h-3 text-cyan-400" />
                <span>{currentThemeItem?.name || "Classic Slate"}</span>
              </div>

              {/* Action Mode Overlay */}
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-cyan-300 uppercase pointer-events-none z-10">
                {currentMode}
              </div>
            </div>

            {/* Test Actions (Poses) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Test Agent Action & State</span>
                <span className="font-mono text-cyan-400 text-[10px] uppercase">{currentMode}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: "streaming", label: "Streaming", col: "hover:border-cyan-500" },
                  { id: "happy", label: "Happy", col: "hover:border-emerald-500" },
                  { id: "sleeping", label: "Sleeping", col: "hover:border-purple-500" },
                  { id: "error", label: "Error", col: "hover:border-rose-500" },
                  { id: "looping", label: "Looping", col: "hover:border-amber-500" },
                  { id: "pending", label: "Pending", col: "hover:border-sky-500" },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setCurrentMode(act.id)}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all border ${
                      currentMode === act.id
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm font-bold"
                        : "bg-[#202029] text-slate-300 border-[#2f2f3d] hover:bg-[#282834]"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider & Client Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#262632]">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Work Intensity:</span>
                  <span className="font-mono text-white text-[10px]">{Math.round(intensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Client Badge & Trim:</span>
                  <span className="font-mono text-[10px] uppercase text-purple-300">{clientType}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setClientType("cli")}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                      clientType === "cli"
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500"
                        : "bg-[#202029] text-slate-400 border-[#2f2f3d]"
                    }`}
                  >
                    CLI (Emerald)
                  </button>
                  <button
                    onClick={() => setClientType("app")}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                      clientType === "app"
                        ? "bg-purple-950/80 text-purple-300 border-purple-500"
                        : "bg-[#202029] text-slate-400 border-[#2f2f3d]"
                    }`}
                  >
                    APP (Purple)
                  </button>
                </div>
              </div>
            </div>

            {/* Active VFX Indicator */}
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#13141a] border border-[#272836] text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Equipped VFX:</span>
                <span className="font-bold text-cyan-300 truncate max-w-[200px]">{currentAuraItem?.name || "None"}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[9px] uppercase border border-cyan-500/30">
                Live 60 FPS VFX
              </span>
            </div>

            {/* Live Telemetry Measurements */}
            <div className="grid grid-cols-4 gap-2 p-2 rounded-lg bg-[#121217] border border-[#252530] text-[10px] font-mono text-center">
              <div>
                <span className="text-slate-500 block">BOB (Y)</span>
                <span className="text-cyan-400 font-bold">{telemetry.bob.toFixed(2)}px</span>
              </div>
              <div>
                <span className="text-slate-500 block">SHAKE (X)</span>
                <span className="text-rose-400 font-bold">{telemetry.shake.toFixed(2)}px</span>
              </div>
              <div>
                <span className="text-slate-500 block">ARMS (L/R)</span>
                <span className="text-amber-400 font-bold">{telemetry.rotL.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">BLINK</span>
                <span className={telemetry.blink ? "text-cyan-400 font-bold" : "text-emerald-400 font-bold"}>
                  {telemetry.blink ? "CLOSED" : "OPEN"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN: MIX & MATCH LOADOUT ==================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#17171e] border border-[#2b2b36] shadow-xl space-y-4 flex flex-col h-full min-h-[500px]">
            {/* Mixer Category Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#2b2b38] pb-2 overflow-x-auto">
              {[
                { id: "skins", label: `Skins (${(COSMETIC_CATALOG.skins || []).length})`, icon: Bot, count: (COSMETIC_CATALOG.skins || []).length },
                { id: "props", label: `Props (${(COSMETIC_CATALOG.props || []).length})`, icon: Laptop, count: (COSMETIC_CATALOG.props || []).length },
                { id: "pets", label: `Pets (${(COSMETIC_CATALOG.pets || []).length})`, icon: Sparkles, count: (COSMETIC_CATALOG.pets || []).length },
                { id: "auras", label: `Auras (${(COSMETIC_CATALOG.auras || []).length})`, icon: Layers, count: (COSMETIC_CATALOG.auras || []).length },
                { id: "themes", label: `Themes (${(COSMETIC_CATALOG.officeThemes || []).length})`, icon: Palette, count: (COSMETIC_CATALOG.officeThemes || []).length },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = mixerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setMixerTab(tab.id);
                      setArchetypeFilter("all");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      active
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-[#22222d]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search & Archetype Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search in ${mixerTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111116] border border-[#2b2b36] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Archetype Quick Filter for Skins */}
              {mixerTab === "skins" && (
                <select
                  value={archetypeFilter}
                  onChange={(e) => setArchetypeFilter(e.target.value)}
                  className="bg-[#111116] border border-[#2b2b36] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">All Archetypes (50)</option>
                  <option value="cyber_suit">Cyber Suit (10)</option>
                  <option value="mecha_pilot">Mecha Pilot (10)</option>
                  <option value="stealth_ninja">Stealth Ninja (10)</option>
                  <option value="matrix_hacker">Matrix Hacker (10)</option>
                  <option value="celestial_astro">Celestial Astro (10)</option>
                </select>
              )}
            </div>

            {/* Currently Active Selection Pill */}
            <div className="p-2.5 rounded-lg bg-[#121217] border border-[#272733] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-400 font-semibold">Active {mixerTab.slice(0, -1).toUpperCase()}:</span>
                <span className="font-bold text-cyan-300 truncate">
                  {mixerTab === "skins" && (currentSkinItem?.name || activeSkinId)}
                  {mixerTab === "pets" && (currentPetItem?.name || activePetId)}
                  {mixerTab === "props" && `${activeProps.length} desk props equipped`}
                  {mixerTab === "auras" && (currentAuraItem?.name || activeAuraId)}
                  {mixerTab === "themes" && (currentThemeItem?.name || activeThemeId)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{filteredMixerItems.length} available</span>
            </div>

            {/* Mixer Items Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-1.5 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredMixerItems.slice(0, 72).map((item) => {
                  const isSkinSelected = mixerTab === "skins" && activeSkinId === item.id;
                  const isPetSelected = mixerTab === "pets" && activePetId === item.id;
                  const isAuraSelected = mixerTab === "auras" && activeAuraId === item.id;
                  const isThemeSelected = mixerTab === "themes" && activeThemeId === item.id;
                  const isPropSelected = mixerTab === "props" && activeProps.includes(item.id);
                  const isSelected = isSkinSelected || isPetSelected || isAuraSelected || isThemeSelected || isPropSelected;

                  const color = item.color || item.previewColor || "#00f0ff";

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (mixerTab === "skins") setActiveSkinId(item.id);
                        else if (mixerTab === "pets") setActivePetId(item.id);
                        else if (mixerTab === "auras") setActiveAuraId(item.id);
                        else if (mixerTab === "themes") setActiveThemeId(item.id);
                        else if (mixerTab === "props") handleTogglePropItem(item.id);
                      }}
                      className={`p-2 rounded-lg text-left transition-all relative border flex flex-col justify-between ${
                        isSelected
                          ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                          : "bg-[#141419] border-[#252530] hover:border-[#383848] hover:bg-[#1a1a22]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            {mixerTab === "props" ? "ON" : "EQUIP"}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">{item.name}</div>
                        <div className="text-[9px] text-slate-400 truncate uppercase font-mono">{item.archetype || item.tier || "Custom"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loadout Summary Footer */}
            <div className="pt-2 border-t border-[#262632] flex flex-wrap items-center justify-between text-[11px] text-slate-400">
              <div className="truncate max-w-[80%]">
                <span>Loadout: </span>
                <strong className="text-slate-200">{currentSkinItem?.name || "Agent"}</strong> +{" "}
                <strong className="text-slate-200">{activeProps.length} Props</strong> +{" "}
                <strong className="text-slate-200">{currentPetItem?.name || "None"}</strong> +{" "}
                <strong className="text-cyan-300">{currentAuraItem?.name || "No VFX"}</strong>
              </div>
              <button
                onClick={handleApplyLoadout}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
              >
                <span>Save to Canvas</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
