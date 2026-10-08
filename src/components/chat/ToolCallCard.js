"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Terminal, FileText, Search, Globe, Box, Cpu, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import ToolOutputView from "./ToolOutputView.js";

const TOOL_ICONS = {
  bash: Terminal,
  docker: Box,
  git: Terminal,
  edit: FileText,
  read: FileText,
  search: Search,
  browser: Globe,
  gitnexus: Cpu,
  agent: Cpu,
  mcp: Box,
};

const TYPE_STYLES = {
  bash: "border-cyan-500/30 bg-cyan-950/20 text-cyan-300",
  docker: "border-sky-500/30 bg-sky-950/20 text-sky-300",
  git: "border-orange-500/30 bg-orange-950/20 text-orange-300",
  edit: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300",
  read: "border-blue-500/30 bg-blue-950/20 text-blue-300",
  search: "border-purple-500/30 bg-purple-950/20 text-purple-300",
  browser: "border-cyan-500/30 bg-cyan-950/20 text-cyan-300",
  gitnexus: "border-purple-500/30 bg-purple-950/20 text-purple-300",
  agent: "border-orange-500/30 bg-orange-950/20 text-orange-300",
  mcp: "border-violet-500/30 bg-violet-950/20 text-violet-300",
};

export default function ToolCallCard({ tool, onImageClick }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tool) return null;

  const type = tool.type || "bash";
  const Icon = TOOL_ICONS[type] || Terminal;
  const styleClass = TYPE_STYLES[type] || TYPE_STYLES.bash;

  const isRunning = tool.status === "running";
  const isError = tool.status === "error";

  // Summarize main argument
  let detailSummary = tool.action || tool.name;
  if (tool.args?.CommandLine) {
    detailSummary = tool.args.CommandLine;
  } else if (tool.args?.command) {
    detailSummary = tool.args.command;
  } else if (tool.args?.TargetFile || tool.args?.AbsolutePath || tool.args?.file_path) {
    const p = tool.args.TargetFile || tool.args.AbsolutePath || tool.args.file_path;
    detailSummary = `${tool.name}: ${p.split("/").pop()}`;
  } else if (tool.args?.query || tool.args?.pattern) {
    detailSummary = `search: "${tool.args.query || tool.args.pattern}"`;
  }

  return (
    <div className={`my-1.5 rounded-lg border ${styleClass} overflow-hidden text-xs transition-all`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
          <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/50 shrink-0">
            {type}
          </span>
          <span className="truncate font-mono text-[11px] text-slate-200">
            {detailSummary}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {isRunning && (
            <div className="flex items-center gap-1 text-cyan-400 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Running</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-1 text-rose-400 text-[10px]">
              <AlertTriangle className="w-3 h-3" />
              <span>Failed</span>
            </div>
          )}
          {!isRunning && !isError && (
            <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
          )}

          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded parameters and output */}
      {isOpen && (
        <div className="p-3 border-t border-slate-800/60 bg-slate-950/60 space-y-2">
          {tool.args && Object.keys(tool.args).length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Arguments:</span>
              <pre className="p-2 rounded bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(tool.args, null, 2)}
              </pre>
            </div>
          )}

          {tool.output && (
            <ToolOutputView output={tool.output} onImageClick={onImageClick} />
          )}
        </div>
      )}
    </div>
  );
}
