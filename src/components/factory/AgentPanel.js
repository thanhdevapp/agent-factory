"use client";

const MODE_LABELS = {
  streaming: "Working",
  pending: "Queued",
  done: "Done",
  happy: "Done",
  sleeping: "Idle",
  error: "Failed",
};

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

export default function AgentPanel({ ws, onClose }) {
  if (!ws) return null;
  const hex = `#${ws.color ? ws.color.toString(16).padStart(6, "0") : "38bdf8"}`;

  return (
    <div className="absolute right-4 top-4 z-20 w-80 rounded-xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-right-2">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: hex }}
            />
            <div className="truncate text-sm font-bold text-slate-100">{ws.account}</div>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: hex }}>
            {MODE_LABELS[ws.mode] || ws.mode}
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

      {/* Main Details */}
      <div className="space-y-0.5">
        <InspectorRow label="Agent / Desk" value={ws.connectionId} />
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

      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        Live telemetry via Local CLI Log Watcher
      </div>
    </div>
  );
}
