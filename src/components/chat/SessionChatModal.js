"use client";

import { useEffect, useRef, useState } from "react";
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
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Wrench,
  Brain,
  Activity,
} from "lucide-react";
import { useSessionTranscript } from "../../lib/useSessionTranscript.js";
import ChatMessageItem from "./ChatMessageItem.js";
import ImageLightboxModal from "./ImageLightboxModal.js";

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

export default function SessionChatModal({ sessionTrace, onClose }) {
  const [filter, setFilter] = useState("all"); // "all" | "prompts" | "tools" | "thinking" | "telemetry"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const chatBottomRef = useRef(null);
  const telemetryEndRef = useRef(null);

  const targetTraceId = sessionTrace?.traceId || sessionTrace?.traces?.[0]?.traceId || "";
  const sessionId = targetTraceId.replace(/^agy-|^claude-/, "") || targetTraceId;
  const isAgentActive =
    sessionTrace?.state === "streaming" ||
    sessionTrace?.state === "pending" ||
    sessionTrace?.mode === "streaming";

  const { session, turns, loading, error, refresh, exportMarkdown } = useSessionTranscript(
    targetTraceId,
    isAgentActive
  );

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

  const hexColor = sessionTrace.color ? `#${sessionTrace.color.toString(16).padStart(6, "0")}` : "#38bdf8";
  const logs = Array.isArray(sessionTrace.logs)
    ? sessionTrace.logs
    : (sessionTrace.traces?.[0]?.logs || []);

  const isAppClient =
    sessionTrace.clientType === "app" ||
    String(sessionTrace.provider || "").toLowerCase().includes("app") ||
    String(sessionTrace.connectionId || "").toLowerCase().includes("app");

  const modeText = sessionTrace.isLooping
    ? "Loop Alert"
    : (MODE_LABELS[sessionTrace.mode] || sessionTrace.state || "Active");

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-3 ${
        isFullscreen
          ? "inset-4 rounded-2xl"
          : "right-4 top-4 bottom-4 w-full max-w-2xl rounded-2xl"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80 rounded-t-2xl">
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
              <h2 className="text-sm font-bold text-slate-100 truncate">
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
                    : "border-slate-700 bg-slate-800/80 text-slate-300"
                }`}
              >
                {modeText}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5 flex items-center gap-1.5">
              <span>{sessionTrace.connectionId}</span>
              <span>•</span>
              <span className="text-cyan-400 uppercase">{session?.model || sessionTrace.model || "gemini-2.5-pro"}</span>
              {session?.cwd && (
                <>
                  <span>•</span>
                  <span className="text-slate-400 truncate max-w-44">{session.cwd}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Info / Telemetry Drawer */}
          <button
            onClick={() => setShowInfoDrawer(!showInfoDrawer)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showInfoDrawer
                ? "bg-cyan-950 border-cyan-500/50 text-cyan-300"
                : "border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
            title="Toggle session details & telemetry metrics"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Details</span>
            {showInfoDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Refresh button */}
          <button
            onClick={refresh}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Refresh transcript"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Export Markdown */}
          <button
            onClick={exportMarkdown}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            title="Export full transcript as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title={isFullscreen ? "Restore window" : "Maximize window"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Runaway Loop Alert Banner */}
      {sessionTrace.isLooping && (
        <div className="mx-5 my-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-300 flex items-start gap-2 animate-pulse shrink-0">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-rose-200">Runaway Loop Alert Detected</div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">
              5+ repeated consecutive tool actions occurred within 60s without task progression.
            </div>
          </div>
        </div>
      )}

      {/* Integrated Session Details & Telemetry Drawer */}
      {showInfoDrawer && (
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 text-xs space-y-2 animate-in fade-in slide-in-from-top-1 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Provider / Pod</span>
              <p className="font-semibold text-cyan-400 mt-0.5 truncate uppercase">
                {sessionTrace.provider || "Gemini"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Elapsed Time</span>
              <p className="font-semibold text-slate-200 mt-0.5">
                {fmtDuration(session?.durationMs || sessionTrace.elapsedMs)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tokens Cached</span>
              <p className="font-semibold text-emerald-400 mt-0.5">
                {fmtTokens(session?.tokens?.cached || sessionTrace?.tokens?.cached)} ({sessionTrace.cachedPct || 0}%)
              </p>
            </div>
            <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Tools</span>
              <p className="font-semibold text-slate-300 mt-0.5 truncate">
                {sessionTrace.tools?.length ? sessionTrace.tools.join(", ") : "None"}
              </p>
            </div>
          </div>

          {/* Active Command / File Box */}
          {sessionTrace.currentCommand && (
            <div className="rounded-lg bg-black/70 p-2 border border-slate-800">
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

      {/* Subheader: Filter bar & Live Telemetry toggle */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-slate-800/60 bg-slate-900/40 text-xs shrink-0">
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 overflow-x-auto">
          {[
            { id: "all", label: "All Turns", icon: MessageSquare },
            { id: "prompts", label: "Prompts", icon: User },
            { id: "tools", label: "Tools & Diffs", icon: Wrench },
            { id: "thinking", label: "Thinking", icon: Brain },
            { id: "telemetry", label: `Telemetry (${logs.length})`, icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === tab.id
                    ? "bg-slate-800 text-cyan-300 shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Auto-scroll</span>
          </label>
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {/* VIEW 1: Live Telemetry Drawer (Merged from AgentPanel) */}
        {filter === "telemetry" ? (
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Terminal Telemetry Stream</span>
              <span>Showing last {logs.length} actions</span>
            </div>

            {logs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No telemetry actions recorded yet for this session.
              </div>
            ) : (
              logs.map((log, idx) => {
                const badgeStyle = BADGE_COLORS[log.type] || "border-slate-700 bg-slate-800/60 text-slate-300";
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-black/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <span className="text-[10px] text-slate-500 whitespace-nowrap pt-0.5">
                      {formatLogTimestamp(log.timestamp)}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 ${badgeStyle}`}
                    >
                      {log.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-200 font-medium truncate">{log.summary || log.type}</div>
                      {log.detail && (
                        <div className="text-slate-400 text-[11px] truncate mt-0.5 whitespace-pre-wrap break-all">
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
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs">Loading session transcript...</span>
              </div>
            )}

            {error && turns.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-12">
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs text-center max-w-md">
                  <p className="font-semibold mb-1">Unable to load transcript</p>
                  <p className="text-[11px] text-rose-400">{error}</p>
                </div>
              </div>
            )}

            {!loading && turns.length === 0 && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-12">
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

      {/* Footer Metrics */}
      <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-900/90 rounded-b-2xl flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span>{turns.length} turns</span>
          <span>•</span>
          <span>Duration: {fmtDuration(session?.durationMs || sessionTrace?.elapsedMs)}</span>
          {isAgentActive && (
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              Live Streaming
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>Tokens:</span>
          <span>In {fmtTokens(session?.tokens?.input || sessionTrace?.tokens?.input)}</span>
          <span>Out {fmtTokens(session?.tokens?.output || sessionTrace?.tokens?.output)}</span>
          {(session?.tokens?.cached || sessionTrace?.tokens?.cached) > 0 && (
            <span className="text-cyan-400">
              Cache {fmtTokens(session?.tokens?.cached || sessionTrace?.tokens?.cached)}
            </span>
          )}
        </div>
      </div>

      {/* Image Lightbox Popup Modal */}
      {previewImage && (
        <ImageLightboxModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
