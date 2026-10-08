"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Download,
  RefreshCw,
  Bot,
  Info,
  Layers,
  Terminal,
  Smartphone,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Wrench,
  Brain,
  Activity,
  Search,
  RotateCcw,
  PanelRightClose,
  AppWindow,
} from "lucide-react";
import { useSessionTranscript } from "../../lib/useSessionTranscript.js";
import { openChatInNewWindow } from "../../lib/windowManager.js";
import ChatMessageItem from "./ChatMessageItem.js";
import ImageLightboxModal from "./ImageLightboxModal.js";
import SessionSearch from "./SessionSearch.js";
import ContextGauge from "./ContextGauge.js";
import SessionExportModal from "./SessionExportModal.jsx";

const MODE_LABELS = {
  streaming: "Working",
  pending: "Queued",
  done: "Done",
  happy: "Done",
  sleeping: "Idle",
  error: "Failed",
  looping: "Loop Alert",
};

const BADGE_COLORS = {
  bash: "border-cyan-500/40 bg-cyan-950/60 text-cyan-300",
  docker: "border-sky-500/40 bg-sky-950/60 text-sky-300",
  git: "border-orange-500/40 bg-orange-950/60 text-orange-300",
  edit: "border-emerald-500/40 bg-emerald-950/60 text-emerald-300",
  read: "border-blue-500/40 bg-blue-950/60 text-blue-300",
  search: "border-purple-500/40 bg-purple-950/60 text-purple-300",
  prompt: "border-amber-500/40 bg-amber-950/60 text-amber-300",
  error: "border-rose-500/40 bg-rose-950/60 text-rose-300",
  gitnexus: "border-purple-500/40 bg-purple-950/60 text-purple-300",
  browser: "border-cyan-500/40 bg-cyan-950/60 text-cyan-300",
  agent: "border-orange-500/40 bg-orange-950/60 text-orange-300",
  mcp: "border-violet-500/40 bg-violet-950/60 text-violet-300",
};

function fmtTokens(n) {
  if (!n) return "0";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function fmtDuration(ms) {
  if (!ms) return "0s";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function formatLogTimestamp(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour12: false });
    }
  } catch {
    // fallback
  }
  return String(ts).slice(11, 19);
}

export default function SessionChatView({
  sessionTrace,
  isSidebar = false,
  onClose,
  onDockToSidebar,
  onStartReplay,
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const [filter, setFilter] = useState("all"); // "all" | "prompts" | "tools" | "thinking" | "telemetry"
  const [autoScroll, setAutoScroll] = useState(true);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const chatBottomRef = useRef(null);
  const telemetryEndRef = useRef(null);

  const targetTraceId =
    sessionTrace?.traceId ||
    sessionTrace?.traces?.[0]?.traceId ||
    sessionTrace?.connectionId ||
    "";
  const sessionId = targetTraceId.replace(/^agy-|^claude-|^codex-/, "") || targetTraceId;
  const isAgentActive =
    sessionTrace?.state === "streaming" ||
    sessionTrace?.state === "busy" ||
    sessionTrace?.state === "working" ||
    sessionTrace?.state === "pending" ||
    sessionTrace?.mode === "streaming";

  const { session, turns, loading, error, refresh, exportMarkdown } = useSessionTranscript(
    targetTraceId,
    isAgentActive
  );

  // Shortcut Ctrl/Cmd + F to toggle transcript search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Format searchable steps list for SessionSearch
  const searchableSteps = useMemo(() => {
    return turns.map((t) => ({
      id: t.id,
      content: t.content || "",
      thinking: t.thinking || "",
      tool_calls: (t.toolCalls || []).map((tc) => ({
        toolName: tc.name,
        description: tc.action,
        args: typeof tc.args === "string" ? tc.args : JSON.stringify(tc.args || {}),
      })),
      output: (t.toolCalls || []).map((tc) => tc.output || "").join("\n"),
    }));
  }, [turns]);

  // Smooth scroll and highlight turn when user jumps to search match
  const handleJumpToStep = (matchedIdx) => {
    const targetTurn = turns[matchedIdx];
    if (targetTurn) {
      const el = document.getElementById(`chat-turn-${targetTurn.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-cyan-400", "shadow-cyan-500/20", "transition-all");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-cyan-400", "shadow-cyan-500/20");
        }, 2500);
      }
    }
  };

  // Auto-scroll when new turns or logs arrive
  useEffect(() => {
    if (autoScroll) {
      if (filter === "telemetry" && telemetryEndRef.current) {
        telemetryEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (chatBottomRef.current) {
        chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [turns.length, filter, autoScroll]);

  if (!sessionTrace) return null;

  const hexColor = sessionTrace.color
    ? `#${sessionTrace.color.toString(16).padStart(6, "0")}`
    : "#38bdf8";
  const logs = Array.isArray(sessionTrace.logs)
    ? sessionTrace.logs
    : sessionTrace.traces?.[0]?.logs || [];

  const isAppClient =
    sessionTrace.clientType === "app" ||
    String(sessionTrace.provider || "").toLowerCase().includes("app") ||
    String(sessionTrace.connectionId || "").toLowerCase().includes("app");

  const modeText = sessionTrace.isLooping
    ? "Loop Alert"
    : MODE_LABELS[sessionTrace.mode] || sessionTrace.state || "Active";

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-editor)] text-[var(--text-main)] select-none overflow-hidden">
      {/* 1. Header Area */}
      {isSidebar ? (
        /* Sidebar Variant Header Sub-bar: Compact identity & quick action tools */
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] px-3 py-2 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 relative"
              style={{ borderColor: hexColor, backgroundColor: `${hexColor}25` }}
            >
              <Bot className="w-3.5 h-3.5" style={{ color: hexColor }} />
              {isAgentActive && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 animate-ping"
                  style={{ backgroundColor: hexColor }}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[var(--text-bright)] text-xs truncate max-w-[130px]">
                  {sessionTrace.account || `Desk #${(sessionTrace.deskIndex ?? 0) + 1}`}
                </span>
                <span
                  className={`text-[8px] font-mono px-1 py-0.2 rounded font-black tracking-wider uppercase border flex items-center gap-0.5 ${
                    isAppClient
                      ? "bg-purple-950/80 border-purple-700/80 text-purple-300"
                      : "bg-emerald-950/80 border-emerald-700/80 text-emerald-300"
                  }`}
                >
                  {isAppClient ? <Smartphone className="w-2 h-2" /> : <Terminal className="w-2 h-2" />}
                  <span>{isAppClient ? "APP" : "CLI"}</span>
                </span>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                {session?.model || sessionTrace.model || "Unavailable"}
              </div>
            </div>
          </div>

          {/* Quick Action Icons in Sidebar Header */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                isSearchOpen
                  ? "bg-cyan-950 border border-cyan-500/50 text-cyan-300"
                  : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
              }`}
              title="Search transcript (Ctrl+F)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Details drawer toggle */}
            <button
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                showInfoDrawer
                  ? "bg-cyan-950 border border-cyan-500/50 text-cyan-300"
                  : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
              }`}
              title="Agent Details & Specs"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {/* Refresh */}
            <button
              onClick={refresh}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              title="Refresh transcript"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Replay */}
            {onStartReplay && (
              <button
                onClick={() => onStartReplay(sessionId || targetTraceId)}
                className="p-1 rounded text-cyan-400 hover:text-cyan-200 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                title="Time-Machine: Replay this session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Export */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              title="Export session report (HTML, PDF, Markdown)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Open in Standalone Detached Window (VS Code style) */}
            <button
              onClick={() => openChatInNewWindow(sessionId || targetTraceId)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-cyan-300 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              title="Open in Detached Window (VS Code style)"
            >
              <AppWindow className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Modal Variant Header: Full-width modal bar */
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-titlebar)] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-inner relative"
              style={{ borderColor: hexColor, backgroundColor: `${hexColor}25` }}
            >
              <Bot className="w-5 h-5" style={{ color: hexColor }} />
              {isAgentActive && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 animate-ping"
                  style={{ backgroundColor: hexColor }}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--text-bright)] truncate">
                  {sessionTrace.account || "AI Agent Session"}
                </h2>
                {/* Client Type badge */}
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-black tracking-wider uppercase border flex items-center gap-1 ${
                    isAppClient
                      ? "bg-purple-950/80 border-purple-700/80 text-purple-300 shadow-sm shadow-purple-950"
                      : "bg-emerald-950/80 border-emerald-700/80 text-emerald-300 shadow-sm shadow-emerald-950"
                  }`}
                >
                  {isAppClient ? (
                    <>
                      <Smartphone className="w-2.5 h-2.5" />
                      <span>APP</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-2.5 h-2.5" />
                      <span>CLI</span>
                    </>
                  )}
                </span>

                {/* Status pill */}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold uppercase tracking-wider ${
                    sessionTrace.isLooping
                      ? "border-rose-500/50 bg-rose-950/60 text-rose-300 animate-pulse"
                      : isAgentActive
                      ? "border-cyan-500/50 bg-cyan-950/60 text-cyan-300"
                      : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)]"
                  }`}
                >
                  {modeText}
                </span>
              </div>

              <div className="text-[11px] text-[var(--text-muted)] font-mono truncate mt-0.5 flex items-center gap-1.5">
                <span>{sessionTrace.connectionId}</span>
                <span>•</span>
                <span className="text-cyan-400 uppercase">
                  {session?.model || sessionTrace.model || "Unavailable"}
                </span>
                {session?.cwd && (
                  <>
                    <span>•</span>
                    <span className="text-[var(--text-muted)] truncate max-w-44">{session.cwd}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Controls in Modal */}
          <div className="flex items-center gap-1.5">
            {Number.isFinite(session?.tokens?.input ?? sessionTrace?.tokens?.input) &&
              Number.isFinite(session?.tokens?.output ?? sessionTrace?.tokens?.output) &&
              Number.isFinite(session?.tokens?.cached ?? sessionTrace?.tokens?.cached) &&
              (session?.model || sessionTrace?.model) && (
                <ContextGauge
                  compact
                  inputTokens={session?.tokens?.input ?? sessionTrace.tokens.input}
                  outputTokens={session?.tokens?.output ?? sessionTrace.tokens.output}
                  cachedTokens={session?.tokens?.cached ?? sessionTrace.tokens.cached}
                  model={session?.model || sessionTrace.model}
                  className="hidden md:inline-flex mr-1"
                />
              )}

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isSearchOpen
                  ? "bg-cyan-950 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/10"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-bright)]"
              }`}
              title="Search transcript (Ctrl+F)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Details */}
            <button
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showInfoDrawer
                  ? "bg-cyan-950 border-cyan-500/50 text-cyan-300"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-bright)]"
              }`}
              title="Agent Details & Specs"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Details</span>
              {showInfoDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Refresh */}
            <button
              onClick={refresh}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
              title="Refresh transcript"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Replay */}
            {onStartReplay && (
              <button
                onClick={() => {
                  onStartReplay(sessionId || targetTraceId);
                  onClose?.();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors shadow-sm cursor-pointer"
                title="Time-Machine: Replay this session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replay</span>
              </button>
            )}

            {/* Export */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] text-xs font-medium border border-[var(--border-subtle)] transition-colors cursor-pointer"
              title="Export session report (HTML, PDF, Markdown)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Dock to Sidebar Button */}
            {onDockToSidebar && (
              <button
                onClick={() => onDockToSidebar(sessionTrace)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--accent-primary)] text-[var(--text-main)] hover:text-white text-xs font-medium border border-[var(--border-subtle)] transition-colors cursor-pointer"
                title="Dock into Sidebar"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sidebar</span>
              </button>
            )}

            {/* Open in Standalone Detached Window (VS Code style) */}
            <button
              onClick={() => {
                openChatInNewWindow(sessionId || targetTraceId);
                onClose?.();
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--accent-primary)] text-[var(--text-main)] hover:text-white text-xs font-medium border border-[var(--border-subtle)] transition-colors cursor-pointer"
              title="Open in Detached Window (VS Code style)"
            >
              <AppWindow className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">New Window</span>
            </button>

            {/* Fullscreen toggle */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isFullscreen
                    ? "bg-cyan-950 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/10 font-semibold"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-bright)]"
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-300" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-rose-400 transition-colors cursor-pointer"
              title="Close window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Session Search Bar */}
      {isSearchOpen && (
        <div className={`py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] flex justify-end shrink-0 ${isSidebar ? "px-3" : "px-5"}`}>
          <SessionSearch
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            steps={searchableSteps}
            onJumpToStep={handleJumpToStep}
          />
        </div>
      )}

      {/* 3. Runaway Loop Alert Banner */}
      {sessionTrace.isLooping && (
        <div className={`my-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-300 flex items-start gap-2 animate-pulse shrink-0 ${isSidebar ? "mx-3" : "mx-5"}`}>
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-rose-200">Runaway Loop Alert Detected</div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">
              5+ repeated consecutive tool actions occurred within 60s without task progression.
            </div>
          </div>
        </div>
      )}

      {/* 4. Integrated Session Details & Telemetry Drawer */}
      {showInfoDrawer && (
        <div className={`py-2.5 border-b border-[#2b2b2b] bg-[#181818] text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1 shrink-0 ${isSidebar ? "px-3" : "px-5"}`}>
          <div className={`grid gap-2 ${isSidebar ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
            <div className="rounded-lg bg-[#252526] p-2 border border-[#333333]">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Provider</span>
              <p className="font-semibold text-cyan-400 mt-0.5 truncate uppercase">
                {sessionTrace.provider || "Unavailable"}
              </p>
            </div>
            <div className="rounded-lg bg-[#252526] p-2 border border-[#333333]">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Elapsed</span>
              <p className="font-semibold text-slate-200 mt-0.5">
                {Number.isFinite(session?.durationMs ?? sessionTrace.elapsedMs)
                  ? fmtDuration(session?.durationMs ?? sessionTrace.elapsedMs)
                  : "Unavailable"}
              </p>
            </div>
            <div className="rounded-lg bg-[#252526] p-2 border border-[#333333]">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cached</span>
              <p className="font-semibold text-emerald-400 mt-0.5">
                {Number.isFinite(session?.tokens?.cached ?? sessionTrace?.tokens?.cached)
                  ? `${fmtTokens(session?.tokens?.cached ?? sessionTrace.tokens.cached)} (${sessionTrace.cachedPct ?? "—"}%)`
                  : "Unavailable"}
              </p>
            </div>
            <div className="rounded-lg bg-[#252526] p-2 border border-[#333333]">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tools</span>
              <p className="font-semibold text-slate-300 mt-0.5 truncate">
                {sessionTrace.tools?.length ? sessionTrace.tools.join(", ") : "None"}
              </p>
            </div>
          </div>

          {Number.isFinite(session?.tokens?.input ?? sessionTrace?.tokens?.input) &&
            Number.isFinite(session?.tokens?.output ?? sessionTrace?.tokens?.output) &&
            Number.isFinite(session?.tokens?.cached ?? sessionTrace?.tokens?.cached) &&
            (session?.model || sessionTrace?.model) && (
              <ContextGauge
                inputTokens={session?.tokens?.input ?? sessionTrace.tokens.input}
                outputTokens={session?.tokens?.output ?? sessionTrace.tokens.output}
                cachedTokens={session?.tokens?.cached ?? sessionTrace.tokens.cached}
                model={session?.model || sessionTrace.model}
              />
            )}

          {sessionTrace.currentCommand && (
            <div className="rounded-lg bg-black/70 p-2 border border-[#333333]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Active Command / File
              </div>
              <div className="font-mono text-[11px] text-emerald-400 truncate">
                {sessionTrace.currentCommand}
              </div>
            </div>
          )}

          {sessionTrace.fallbackFrom && (
            <div className="text-[11px] text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Rerouted fallback from: <strong className="font-bold">{sessionTrace.fallbackFrom}</strong></span>
            </div>
          )}
          {sessionTrace.errorReason && (
            <div className="text-[11px] text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Failure cause: <strong className="font-bold">{sessionTrace.errorReason}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* 5. Subheader: Filter bar & Live Telemetry toggle */}
      <div className={`flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-editor)] text-xs shrink-0 py-1.5 ${isSidebar ? "px-3" : "px-5"}`}>
        <div className="flex items-center gap-1 bg-[var(--bg-workbench)] p-0.5 rounded-lg border border-[var(--border-subtle)] overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All", icon: MessageSquare },
            { id: "prompts", label: "Prompts", icon: User },
            { id: "tools", label: "Tools", icon: Wrench },
            { id: "thinking", label: "Thinking", icon: Brain },
            { id: "telemetry", label: `Logs (${logs.length})`, icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === tab.id
                    ? "bg-[var(--bg-card)] text-[var(--accent-secondary)] shadow-sm font-semibold border border-[var(--border-card)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <label className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--accent-primary)] focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <span className="hidden sm:inline">Auto-scroll</span>
          </label>
        </div>
      </div>

      {/* 6. Body Area */}
      <div className={`flex-1 overflow-y-auto space-y-2 select-text ${isSidebar ? "p-3" : "p-5"}`}>
        {filter === "telemetry" ? (
          /* VIEW 1: Live Telemetry Drawer */
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text-bright)]">Terminal Telemetry Stream</span>
              <span>Last {logs.length} actions</span>
            </div>

            {logs.length === 0 ? (
              <div className="py-12 text-center text-[var(--text-muted)] text-xs">
                No telemetry actions recorded yet for this session.
              </div>
            ) : (
              logs.map((log, idx) => {
                const badgeStyle = BADGE_COLORS[log.type] || "border-slate-700 bg-slate-800/60 text-slate-300";
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-[var(--bg-chat-code)] border border-[var(--border-subtle)] hover:border-[var(--border-card)] transition-colors"
                  >
                    <span className="text-[10px] text-[var(--text-muted)] opacity-70 whitespace-nowrap pt-0.5">
                      {formatLogTimestamp(log.timestamp)}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider shrink-0 ${badgeStyle}`}
                    >
                      {log.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[var(--text-bright)] font-medium truncate">{log.summary || log.type}</div>
                      {log.detail && (
                        <div className="text-[var(--text-muted)] text-[11px] truncate mt-0.5 whitespace-pre-wrap break-all">
                          {log.detail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={telemetryEndRef} />
          </div>
        ) : (
          /* VIEW 2: AI Conversation Turns */
          <>
            {loading && turns.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-2 py-12">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                <span className="text-xs">Loading session transcript...</span>
              </div>
            )}

            {error && turns.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-2 py-12">
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs text-center max-w-md">
                  <p className="font-semibold mb-1">Unable to load transcript</p>
                  <p className="text-[11px] text-rose-400">{error}</p>
                </div>
              </div>
            )}

            {!loading && turns.length === 0 && !error && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-2 py-12">
                <Layers className="w-8 h-8 opacity-40" />
                <span className="text-xs">No conversation history found for this session.</span>
              </div>
            )}

            {turns.map((turn) => (
              <ChatMessageItem
                key={turn.id}
                turn={turn}
                agentColor={sessionTrace.color ? sessionTrace.color.toString(16).padStart(6, "0") : "38bdf8"}
                filter={filter}
                onImageClick={(img) => setPreviewImage(img)}
              />
            ))}

            <div ref={chatBottomRef} />
          </>
        )}
      </div>

      {/* 7. Footer Metrics */}
      <div className={`border-t border-[var(--border-subtle)] bg-[var(--bg-workbench)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono shrink-0 py-2 ${isSidebar ? "px-3" : "px-5 rounded-b-2xl"}`}>
        <div className="flex items-center gap-2 truncate">
          <span>{turns.length} turns</span>
          <span>•</span>
          <span className="truncate">{fmtDuration(session?.durationMs || sessionTrace?.elapsedMs)}</span>
          {isAgentActive && (
            <span className="hidden sm:inline-flex items-center gap-1 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              Live
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span>In {fmtTokens(session?.tokens?.input || sessionTrace?.tokens?.input)}</span>
          <span>Out {fmtTokens(session?.tokens?.output || sessionTrace?.tokens?.output)}</span>
          {(session?.tokens?.cached || sessionTrace?.tokens?.cached) > 0 && (
            <span className="text-cyan-400 hidden sm:inline">
              Cache {fmtTokens(session?.tokens?.cached || sessionTrace?.tokens?.cached)}
            </span>
          )}
        </div>
      </div>

      {/* 8. Image Lightbox Popup Modal */}
      {previewImage && (
        <ImageLightboxModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

      {/* 9. Session Export Report Hub Modal */}
      <SessionExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        session={session}
        turns={turns}
      />
    </div>
  );
}
