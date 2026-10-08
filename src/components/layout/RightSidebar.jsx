"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  X,
  Cpu,
  Terminal,
  Smartphone,
  MessageSquare,
  Copy,
  Check,
  ChevronRight,
  Bot,
  AppWindow,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import SessionChatView from "../chat/SessionChatView.js";
import { openChatInNewWindow } from "../../lib/windowManager.js";
import { getItemById } from "@/lib/catalog/index.js";
import { getSupporterState } from "@/lib/supporterStore.js";

export default function RightSidebar({
  selectedAgent = null,
  workstations = [],
  activeTab = "chat",
  onTabChange,
  onSelectAgent,
  onClose,
  onStartReplay,
}) {
  const [copied, setCopied] = useState(false);
  const [internalTab, setInternalTab] = useState(activeTab || "chat");

  const currentTab = onTabChange ? activeTab : internalTab;

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const handleCopyId = () => {
    if (!selectedAgent?.connectionId) return;
    navigator.clipboard?.writeText(selectedAgent.connectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApp =
    selectedAgent?.clientType === "app" ||
    (selectedAgent?.provider || "").toLowerCase().includes("(app)");

  const isAgentStreaming =
    selectedAgent?.state === "streaming" ||
    selectedAgent?.state === "busy" ||
    selectedAgent?.state === "working" ||
    selectedAgent?.mode === "streaming";

  return (
    <div
      data-testid="secondary-sidebar-container"
      className="flex flex-col h-full w-full bg-[var(--bg-editor)] text-[var(--text-main)] select-none overflow-hidden"
    >
      {/* 1. Header with Tab Switches (Live Chat & Inspector) */}
      <div className="h-[36px] min-h-[36px] bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-2 flex items-center justify-between shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {/* Tab 1: Live Chat */}
          <button
            type="button"
            onClick={() => handleTabClick("chat")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === "chat"
                ? "bg-[var(--bg-editor)] text-[var(--accent-primary)] border border-[var(--border-card)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
            }`}
            title="View Agent Live Chat & Conversation Transcript"
          >
            <div className="relative">
              <MessageSquare className="w-3.5 h-3.5" />
              {isAgentStreaming && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
            <span>Live Chat</span>
            {isAgentStreaming && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block ml-0.5" />
            )}
          </button>

          {/* Tab 2: Inspector */}
          <button
            type="button"
            onClick={() => handleTabClick("inspector")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === "inspector"
                ? "bg-[var(--bg-editor)] text-[var(--accent-primary)] border border-[var(--border-card)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
            }`}
            title="View Agent specs, telemetry, and token usage"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1">
          {/* Open in Standalone Detached Window (VS Code style) */}
          {currentTab === "chat" && selectedAgent && (
            <button
              onClick={() => openChatInNewWindow(selectedAgent.connectionId || selectedAgent.traceId)}
              title="Open in Detached Window (VS Code style)"
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            >
              <AppWindow className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Close Sidebar button */}
          <button
            onClick={onClose}
            title="Close Secondary Sidebar (Cmd+Alt+B)"
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Tab Body Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {currentTab === "chat" ? (
          /* TAB 1: Live Chat View */
          selectedAgent ? (
            <SessionChatView
              sessionTrace={selectedAgent}
              isSidebar={true}
              onClose={onClose}
              onStartReplay={onStartReplay}
            />
          ) : (
            /* Empty State for Live Chat */
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#252526] border border-[#333333] flex items-center justify-center text-slate-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-[280px]">
                <h4 className="font-bold text-slate-300 text-xs">No Agent Selected</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click any workstation on the virtual office or select an active agent below to inspect live conversation:
                </p>
              </div>

              {workstations.length > 0 && (
                <div className="w-full max-w-[280px] space-y-1.5 pt-2 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                    Active Agents ({workstations.length})
                  </span>
                  <div className="space-y-1 max-h-[28rem] overflow-y-auto pr-1">
                    {workstations.map((w, idx) => {
                      const isBusy =
                        w.state === "streaming" ||
                        w.state === "busy" ||
                        w.state === "working" ||
                        w.mode === "streaming";
                      const workspaceName = w.account || "agent-factory";
                      const sessionTitle = w.sessionTitle || workspaceName;
                      const isApp = w.clientType === "app" || (w.provider || "").includes("(app)");
                      const isExt =
                        w.clientType === "extension" ||
                        (w.provider || "").includes("extension") ||
                        (w.connectionId || "").toLowerCase().includes("extension");

                      const previewText = w.lastText
                        ? `${w.lastTextRole === "assistant" ? "AI: " : w.lastTextRole === "user" ? "You: " : ""}${w.lastText}`
                        : `${workspaceName} · ${w.model || "AI Agent"}${w.activeTool ? ` · ${w.activeTool}` : ""}`;

                      return (
                        <button
                          key={w.connectionId || w.traceId || `active-agent-${idx}`}
                          onClick={() => onSelectAgent?.(w.connectionId || w.traceId)}
                          className="w-full flex items-center gap-2 p-2 rounded bg-[#252526] hover:bg-[#2d2d2e] border border-[#333333] hover:border-[#007acc] text-left transition-colors cursor-pointer text-slate-300"
                        >
                          <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0 self-start mt-0.5" />
                          <div className="min-w-0 flex-1">
                            {/* Line 1: Session Title + Type Badge */}
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <span className="truncate font-medium text-xs text-slate-200" title={sessionTitle}>
                                {sessionTitle}
                              </span>
                              {isExt ? (
                                <span className="shrink-0 bg-sky-950/80 text-sky-300 border border-sky-500/40 text-[9px] font-bold px-1 rounded uppercase">
                                  EXT
                                </span>
                              ) : isApp ? (
                                <span className="shrink-0 bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1 rounded uppercase">
                                  APP
                                </span>
                              ) : (
                                <span className="shrink-0 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1 rounded uppercase">
                                  CLI
                                </span>
                              )}
                            </div>

                            {/* Line 2: Last Message Preview */}
                            <p className="truncate text-[10px] leading-4 text-slate-400 mt-0.5" title={previewText}>
                              {previewText}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isBusy && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* TAB 2: Inspector View */
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs select-text">
            {selectedAgent ? (
              <>
                {/* Agent Overview Card */}
                <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#1e1e1e] flex items-center justify-center border border-[#3e3e42]">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-xs">
                          {selectedAgent.account || `Desk #${(selectedAgent.deskIndex ?? 0) + 1}`}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">
                          ID: {selectedAgent.connectionId?.slice(0, 8)}...
                        </p>
                      </div>
                    </div>

                    {/* APP vs CLI badge */}
                    {isApp ? (
                      <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <Smartphone className="w-2.5 h-2.5" />
                        <span>APP</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <Terminal className="w-2.5 h-2.5" />
                        <span>CLI</span>
                      </span>
                    )}
                  </div>

                  {/* Provider & Model */}
                  <div className="pt-2 border-t border-[#2b2b2b] grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">PROVIDER</span>
                      <span className="font-semibold text-slate-300 uppercase">
                        {selectedAgent.provider || "Unavailable"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">MODEL</span>
                      <span className="font-semibold text-emerald-400 truncate block">
                        {selectedAgent.model || "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* State & Activity Card */}
                <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CURRENT ACTIVITY
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`font-semibold capitalize px-1.5 py-0.2 rounded text-[10px] ${
                        selectedAgent.state === "streaming"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : selectedAgent.state === "busy"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : selectedAgent.state === "error"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {selectedAgent.state || "Idle"}
                    </span>
                  </div>

                  {selectedAgent.activeTool && (
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block">Active Tool:</span>
                      <div className="mt-1 bg-[#181818] p-1.5 rounded border border-[#2b2b2b] font-mono text-[10px] text-cyan-300 truncate">
                        {selectedAgent.activeTool}
                      </div>
                    </div>
                  )}
                </div>

                {/* Equipped Cosmetics & Gear Card */}
                {(() => {
                  const supporterState = getSupporterState();
                  const effectiveSkin = selectedAgent?.skin || supporterState?.equippedSkin;
                  const effectiveAura = selectedAgent?.aura || supporterState?.equippedAura;
                  const effectivePet = selectedAgent?.pet || supporterState?.equippedPet;
                  const effectiveProps = (selectedAgent?.props && selectedAgent.props.length > 0)
                    ? selectedAgent.props
                    : (supporterState?.equippedProps || []);
                  const effectiveTrophy = selectedAgent?.trophy || supporterState?.equippedTrophy;

                  const skinItem = effectiveSkin && effectiveSkin !== "classic" && effectiveSkin !== "none" ? getItemById(effectiveSkin) : null;
                  const auraItem = effectiveAura && effectiveAura !== "none" ? getItemById(effectiveAura) : null;
                  const petItem = effectivePet && effectivePet !== "none" ? getItemById(effectivePet) : null;
                  const trophyItem = effectiveTrophy && effectiveTrophy !== "none" ? getItemById(effectiveTrophy) : null;

                  return (
                    <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>EQUIPPED COSMETICS</span>
                        </span>
                        {(skinItem || auraItem || petItem || trophyItem || effectiveProps.length > 0) && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                            ACTIVE GEAR
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        {/* Skin */}
                        <div className="flex items-center justify-between py-1 border-b border-[#2d2d30]">
                          <span className="text-slate-400 text-[10px]">Chassis Skin:</span>
                          <div className="flex items-center gap-1.5 font-medium">
                            {skinItem ? (
                              <>
                                <span className="w-2 h-2 rounded-full inline-block border border-white/20" style={{ backgroundColor: skinItem.color }} />
                                <span className="text-emerald-400 font-semibold truncate max-w-[120px]">{skinItem.name}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">{skinItem.archetype}</span>
                              </>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Classic Chassis</span>
                            )}
                          </div>
                        </div>

                        {/* Aura */}
                        <div className="flex items-center justify-between py-1 border-b border-[#2d2d30]">
                          <span className="text-slate-400 text-[10px]">Particle Aura:</span>
                          <div className="flex items-center gap-1.5 font-medium">
                            {auraItem ? (
                              <>
                                <span className="text-purple-400 font-semibold truncate max-w-[120px]">{auraItem.name}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">{auraItem.archetype}</span>
                              </>
                            ) : (
                              <span className="text-slate-500 text-[10px]">None</span>
                            )}
                          </div>
                        </div>

                        {/* Tech Props */}
                        <div className="py-1 border-b border-[#2d2d30]">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-slate-400 text-[10px]">Tech Desk Props:</span>
                            <span className="text-[9px] text-slate-500 font-mono">({effectiveProps.length})</span>
                          </div>
                          {effectiveProps.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {effectiveProps.map((p, idx) => {
                                const pItem = getItemById(p);
                                return (
                                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pItem?.color || "#38bdf8" }} />
                                    <span>{pItem?.name || p}</span>
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Standard Workstation</span>
                          )}
                        </div>

                        {/* Pet */}
                        <div className="flex items-center justify-between py-1 border-b border-[#2d2d30]">
                          <span className="text-slate-400 text-[10px]">Companion Pet:</span>
                          <div className="flex items-center gap-1.5 font-medium">
                            {petItem ? (
                              <>
                                <span className="text-amber-400 font-semibold truncate max-w-[120px]">{petItem.name}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">{petItem.archetype}</span>
                              </>
                            ) : (
                              <span className="text-slate-500 text-[10px]">None</span>
                            )}
                          </div>
                        </div>

                        {/* Trophy */}
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-400 text-[10px]">Desk Trophy:</span>
                          <div className="flex items-center gap-1.5 font-medium">
                            {trophyItem ? (
                              <>
                                <span className="text-yellow-400 font-semibold truncate max-w-[120px]">{trophyItem.name}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-yellow-950/60 text-yellow-300 border border-yellow-800/40">{trophyItem.archetype}</span>
                              </>
                            ) : (
                              <span className="text-slate-500 text-[10px]">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Token Metrics */}
                <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    TOKEN USAGE
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Total Tokens</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {Number.isFinite(selectedAgent.totalTokens) ? selectedAgent.totalTokens.toLocaleString() : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Requests / Steps</span>
                      <span className="font-bold text-slate-300 font-mono">
                        {Number.isFinite(selectedAgent.requestCount) ? selectedAgent.requestCount : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Replay Session, Sidebar View, Popup Modal, and Detached Window */}
                <div className="space-y-1.5 pt-1">
                  {/* Primary: Replay Session (Default) */}
                  {onStartReplay && (
                    <button
                      onClick={() => onStartReplay(selectedAgent.connectionId || selectedAgent.traceId)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replay Session</span>
                    </button>
                  )}

                  {/* Secondary: Switch to Live Chat Sidebar Tab */}
                  <button
                    onClick={() => handleTabClick("chat")}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#252526] hover:bg-[#2d2d2e] text-slate-200 hover:text-white font-medium text-xs transition-colors border border-[#3e3e42] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Live Chat (Pin to Sidebar)</span>
                  </button>

                  {/* Tertiary: Open Detached OS/Browser Window (VS Code style) */}
                  <button
                    onClick={() => openChatInNewWindow(selectedAgent.connectionId || selectedAgent.traceId)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#252526] hover:bg-[#2d2d2e] text-slate-300 hover:text-white text-xs transition-colors border border-[#3e3e42] cursor-pointer"
                  >
                    <AppWindow className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open in Detached Window</span>
                  </button>

                  {/* Copy Connection ID */}
                  <button
                    onClick={handleCopyId}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#252526] hover:bg-[#2d2d2e] text-slate-300 text-xs transition-colors border border-[#3e3e42] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Connection ID Copied!" : "Copy Connection ID"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#252526] border border-[#333333] flex items-center justify-center mx-auto text-slate-600">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div className="space-y-1 px-4">
                  <h4 className="font-bold text-slate-400 text-xs">No Agent Selected</h4>
                  <p className="text-[11px] leading-relaxed">
                    Click any workstation on the virtual office or select from the Explorer list to inspect telemetry and details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
