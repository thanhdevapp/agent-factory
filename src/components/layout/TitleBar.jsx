"use client";

import React from "react";
import {
  Bot,
  Search,
  RotateCw,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Radio,
  Cpu,
  BarChart3,
  Coffee,
} from "lucide-react";
import LayoutToggles from "./LayoutToggles";

const PRESETS = [
  { id: "cases", label: "Edge Cases" },
  { id: "storm", label: "Storm (30 Agents)" },
  { id: "busy", label: "Busy (8 Agents)" },
  { id: "idle", label: "Idle (2 Agents)" },
  { id: "errors", label: "Error States" },
];

export default function TitleBar({
  stats = {},
  mode = "live",
  mockPreset = "cases",
  onModeChange,
  onPresetChange,
  isRefreshing = false,
  onRefresh,
  soundEnabled = false,
  onToggleSound,
  notifEnabled = false,
  onToggleNotif,
  onOpenCommandPalette,
  onOpenReports,
  onOpenStore,
  isSupporter = false,
  layout,
  onToggleLeftSidebar,
  onToggleBottomPanel,
  onToggleRightSidebar,
}) {
  return (
    <header className="h-[34px] min-h-[34px] bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center justify-between px-3 text-[#cccccc] text-xs select-none shrink-0 z-40">
      {/* Left: Brand & Workspace */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-sm shadow-emerald-500/20">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#e1e1e1] tracking-wide text-[11px]">
            AGMON
          </span>
          <span className="rounded bg-[#2d2d2d] px-1.5 py-0.2 text-[9px] font-medium text-slate-400 border border-[#3e3e42]">
            v0.2.0
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-1 bg-[#252526] px-1.5 py-0.5 rounded text-[10px] text-emerald-400 border border-[#333333]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Multi-Provider</span>
        </div>
      </div>

      {/* Center: Search / Command Palette Trigger */}
      <div
        onClick={onOpenCommandPalette}
        title="Search sessions or run commands (Cmd+Shift+P / Ctrl+Shift+P)"
        className="flex items-center justify-between w-[320px] max-w-[35vw] h-6 bg-[#252526] border border-[#3e3e42] hover:border-[#007acc] rounded px-2 cursor-pointer transition-colors text-slate-400 group"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Search className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0" />
          <span className="text-[11px] truncate">
            Search agents, logs, commands...
          </span>
        </div>
        <kbd className="hidden sm:inline-block text-[9px] font-mono bg-[#1e1e1e] border border-[#3e3e42] rounded px-1 text-slate-400">
          Cmd+Shift+P
        </kbd>
      </div>

      {/* Right: Stats, Mode, Controls & Layout Toggles */}
      <div className="flex items-center gap-2 min-w-[240px] justify-end">
        {/* Quick Counters */}
        <div
          onClick={onOpenReports}
          title="Click to view detailed Token & Cost Analytics"
          className="hidden xl:flex items-center gap-1.5 bg-[#252526] hover:bg-[#2d2d2e] border border-[#333333] hover:border-[#007acc] px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors"
        >
          <span className="text-slate-400">Desks:</span>
          <span className="font-bold text-slate-200">{stats?.agents ?? 0}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Active:</span>
          <span className="font-bold text-cyan-400">{stats?.busy ?? 0}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Tokens:</span>
          <span className="font-bold text-emerald-400">{stats?.tokensLabel ?? "0k"}</span>
        </div>

        {/* Quick Reports Button */}
        <button
          onClick={onOpenReports}
          title="Open Token & Cost Analytics"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#252526] hover:bg-[#2e2e30] border border-[#333333] hover:border-[#007acc] text-slate-300 hover:text-white text-[11px] transition-colors"
        >
          <BarChart3 className="w-3 h-3 text-amber-400" />
          <span className="hidden md:inline font-medium">Reports</span>
        </button>

        {/* Supporter Store Button */}
        <button
          onClick={onOpenStore}
          title="Coffee Shop & Supporter Vault (Support Author)"
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] transition-all cursor-pointer ${
            isSupporter
              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
              : "bg-[#252526] hover:bg-[#2e2e30] border-[#333333] hover:border-[#007acc] text-slate-300 hover:text-white"
          }`}
        >
          <Coffee className="w-3 h-3 text-amber-400" />
          <span className="hidden md:inline font-medium">
            {isSupporter ? "Supporter VIP" : "Support"}
          </span>
        </button>

        {/* Live / Mock Mode Selector */}
        <div className="flex items-center rounded bg-[#252526] border border-[#333333] p-0.5 text-[11px]">
          <button
            onClick={() => onModeChange?.("live")}
            title="Connect live log watchers ~/.gemini and ~/.claude"
            className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors ${
              mode === "live"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className={`w-2.5 h-2.5 ${mode === "live" ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
            Live
          </button>
          <button
            onClick={() => onModeChange?.("mock")}
            title="Simulated multi-agent mock telemetry"
            className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors ${
              mode === "mock"
                ? "bg-[#333333] text-slate-200"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Mock
          </button>
          {mode === "mock" && (
            <select
              value={mockPreset}
              onChange={(e) => onPresetChange?.(e.target.value)}
              className="bg-transparent px-1 py-0.5 text-[10px] text-slate-300 outline-none cursor-pointer border-l border-[#333333] ml-1"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1e1e1e] text-slate-200">
                  {p.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          title="Force refresh connections & data"
          className="flex h-6 w-6 items-center justify-center rounded border border-[#333333] bg-[#252526] text-slate-400 hover:text-slate-200 hover:border-[#444444] transition-colors"
        >
          <RotateCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? "Sound effects: ON" : "Sound effects: OFF"}
          className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${
            soundEnabled
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
              : "border-[#333333] bg-[#252526] text-slate-500 hover:text-slate-300"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        </button>

        {/* Notifications Toggle */}
        <button
          onClick={onToggleNotif}
          title={notifEnabled ? "Desktop notifications: ON" : "Desktop notifications: OFF"}
          className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${
            notifEnabled
              ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
              : "border-[#333333] bg-[#252526] text-slate-500 hover:text-slate-300"
          }`}
        >
          {notifEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
        </button>

        {/* Layout Toggles (Left, Bottom, Right) */}
        <LayoutToggles
          isLeftSidebarVisible={layout?.isLeftSidebarVisible}
          isBottomPanelVisible={layout?.isBottomPanelVisible}
          isRightSidebarVisible={layout?.isRightSidebarVisible}
          onToggleLeftSidebar={onToggleLeftSidebar}
          onToggleBottomPanel={onToggleBottomPanel}
          onToggleRightSidebar={onToggleRightSidebar}
        />
      </div>
    </header>
  );
}
