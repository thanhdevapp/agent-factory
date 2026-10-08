"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone, Terminal, AlertTriangle, MessageSquare } from "lucide-react";

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

function formatTimestamp(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour12: false });
    }
  } catch {
    // fallback
  }
  return String(ts).slice(11, 19) || String(ts);
}

function fmtMs(ms) {
  if (!ms) return "0ms";
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function InspectorRow({ label, value, color, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-[12px] border-b border-slate-800/40 last:border-b-0">
      <span className="text-slate-400 font-normal">{label}</span>
      <span
        className={`truncate font-medium ${mono ? "font-mono" : ""}`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

export default function AgentPanel({ ws, onClose, onOpenChat }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "terminal"
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalEndRef = useRef(null);

  const logs = Array.isArray(ws?.logs) ? ws.logs : [];

  useEffect(() => {
    if (activeTab === "terminal" && autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, logs.length, autoScroll]);

  if (!ws) return null;
  const hex = `#${ws.color ? ws.color.toString(16).padStart(6, "0") : "38bdf8"}`;

  return (
    <div className="absolute right-4 top-4 z-20 w-96 rounded-xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-right-2">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ws.isLooping ? "#f43f5e" : hex }}
            />
            <div className="truncate text-sm font-bold text-slate-100">{ws.account}</div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black tracking-wider uppercase border flex items-center gap-1 ${
                (ws.clientType === "app" || String(ws.provider || "").toLowerCase().includes("app"))
                  ? "bg-purple-950/80 border-purple-700/80 text-purple-300 shadow-sm shadow-purple-900/40"
                  : "bg-emerald-950/80 border-emerald-700/80 text-emerald-300 shadow-sm shadow-emerald-900/40"
              }`}
            >
              {(ws.clientType === "app" || String(ws.provider || "").toLowerCase().includes("app")) ? (
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
          </div>
          <div
            className="text-[11px] font-semibold uppercase tracking-wider mt-0.5"
            style={{ color: ws.isLooping ? "#f43f5e" : hex }}
          >
            {ws.isLooping ? "Runaway Loop Warning" : (MODE_LABELS[ws.mode] || ws.mode)}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Runaway Loop Alert */}
      {ws.isLooping && (
        <div className="mb-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-300 flex items-start gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-rose-200">Runaway Loop Alert</div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">
              5+ repeated consecutive tool actions within 60s without task progression.
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-slate-800 text-sky-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === "terminal"
                ? "bg-slate-800 text-sky-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span>Live Terminal</span>
            {logs.length > 0 && (
              <span className="rounded-full bg-slate-700/80 px-1.5 py-0.2 text-[10px] text-slate-300">
                {logs.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "terminal" && (
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
              autoScroll
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/40"
                : "border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            {autoScroll ? "● Auto-scroll" : "○ Paused"}
          </button>
        )}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-0.5">
          <InspectorRow label="Agent / Desk" value={ws.connectionId} />
          <InspectorRow
            label="Client Type"
            value={(ws.clientType === "app" || String(ws.provider || "").toLowerCase().includes("app")) ? "Desktop Application (GUI)" : "Terminal CLI"}
            color={(ws.clientType === "app" || String(ws.provider || "").toLowerCase().includes("app")) ? "#c084fc" : "#34d399"}
          />
          <InspectorRow label="Provider" value={ws.provider?.toUpperCase()} color="#38bdf8" />
          <InspectorRow label="Model" value={ws.model} />
          <InspectorRow label="Elapsed" value={fmtMs(ws.elapsedMs)} />
          <InspectorRow label="Input Tokens" value={ws.tokens?.input?.toLocaleString() || "0"} mono />
          <InspectorRow label="Output Tokens" value={ws.tokens?.output?.toLocaleString() || "0"} mono />
          <InspectorRow
            label="Cached"
            value={`${ws.tokens?.cached?.toLocaleString() || "0"} (${ws.cachedPct || 0}%)`}
            color="#34d399"
            mono
          />
          <InspectorRow label="Active Tools" value={ws.tools?.length ? ws.tools.join(", ") : "None"} />
          {ws.currentCommand && (
            <div className="mt-2 rounded-md bg-slate-950/80 p-2 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Active Command / File</div>
              <div className="font-mono text-[11px] text-emerald-400 truncate">{ws.currentCommand}</div>
            </div>
          )}
          {ws.fallbackFrom && <InspectorRow label="Fallback From" value={ws.fallbackFrom} color="#fbbf24" />}
          {ws.errorReason && <InspectorRow label="Error Cause" value={ws.errorReason} color="#ef4444" />}
        </div>
      )}

      {/* Tab 2: Live Terminal */}
      {activeTab === "terminal" && (
        <div className="space-y-2">
          <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-800 bg-[#030712] p-2.5 font-mono text-[11px] shadow-inner space-y-2">
            {logs.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No telemetry actions recorded yet.
              </div>
            ) : (
              logs.map((log, idx) => {
                const badgeStyle = BADGE_COLORS[log.type] || "border-slate-700 bg-slate-800/60 text-slate-300";
                return (
                  <div key={idx} className="flex items-start gap-2 border-b border-slate-900/60 pb-1.5 last:border-b-0">
                    <span className="text-[10px] text-slate-500 whitespace-nowrap pt-0.5">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                      {log.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-200 font-medium truncate">{log.summary || log.type}</div>
                      {log.detail && (
                        <div className="text-slate-400 text-[10px] truncate">{log.detail}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between px-1">
            <span>Showing last {logs.length} actions</span>
            <span>Real-time SSE stream</span>
          </div>
        </div>
      )}

      {/* Open AI Chat View Button */}
      {onOpenChat && (
        <button
          onClick={() => onOpenChat(ws)}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-lg transition-all hover:border-cyan-400 group cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Open AI Conversation Window</span>
        </button>
      )}

      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        Live telemetry via Local CLI Log Watcher
      </div>
    </div>
  );
}
