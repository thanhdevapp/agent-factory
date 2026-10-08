"use client";

import React from "react";
import {
  Radio,
  Users,
  Activity,
  Terminal,
  Volume2,
  VolumeX,
  Bell,
  Cpu,
  Layers,
} from "lucide-react";

export default function StatusBar({
  mode = "live",
  connected = true,
  live = true,
  stats = {},
  selectedAgent = null,
  soundEnabled = false,
  isBottomOpen = true,
  onToggleBottom,
}) {
  return (
    <footer
      data-testid="status-bar"
      className="h-[22px] min-h-[22px] bg-[#181818] border-t border-[#2b2b2b] px-3 flex items-center justify-between text-[11px] text-[#cccccc] select-none shrink-0 z-30 font-sans"
    >
      {/* Left: Connection & Counts */}
      <div className="flex items-center gap-3">
        {/* Watcher Status */}
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
          <span
            className={`w-2 h-2 rounded-full ${
              connected && live
                ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                : "bg-amber-400"
            }`}
          />
          <span className="font-medium text-[10px]">
            {mode === "live" ? "WATCHER: LIVE" : "MODE: DEMO MOCK"}
          </span>
        </div>

        {/* Active Agents */}
        <div className="flex items-center gap-1 hover:text-white transition-colors">
          <Users className="w-3 h-3 text-[#007acc]" />
          <span>{stats?.agents || 0} Desks</span>
        </div>

        {stats?.busy > 0 && (
          <div className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3 animate-spin" />
            <span>{stats.busy} Working</span>
          </div>
        )}
      </div>

      {/* Center: Selected Agent info */}
      <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px]">
        {selectedAgent ? (
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-200 font-semibold truncate max-w-[200px]">
              {selectedAgent.account || selectedAgent.connectionId}
            </span>
            <span>({selectedAgent.model || "gemini-3.8-flash"})</span>
          </div>
        ) : (
          <span>Ready · Real-time monitoring Antigravity, Claude & Codex (CLI & Desktop)</span>
        )}
      </div>

      {/* Right: Sound, Tokens & Terminal Toggle */}
      <div className="flex items-center gap-3">
        {/* Sound state */}
        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
          {soundEnabled ? (
            <Volume2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <VolumeX className="w-3 h-3 text-slate-500" />
          )}
          <span className="hidden sm:inline">{soundEnabled ? "Audio On" : "Muted"}</span>
        </div>

        {/* Tokens */}
        <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <span>Tokens:</span>
          <span className="text-emerald-400 font-bold">{stats?.tokensLabel || "0k"}</span>
        </div>

        {/* Bottom Panel Toggle Button */}
        <button
          type="button"
          onClick={onToggleBottom}
          title={isBottomOpen ? "Hide Terminal (Cmd+J)" : "Show Terminal (Cmd+J)"}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
            isBottomOpen
              ? "bg-[#007acc]/20 text-[#4fc1ff]"
              : "text-slate-400 hover:text-white hover:bg-[#252526]"
          }`}
        >
          <Terminal className="w-3 h-3" />
          <span className="text-[10px] hidden sm:inline">Terminal</span>
        </button>
      </div>
    </footer>
  );
}
