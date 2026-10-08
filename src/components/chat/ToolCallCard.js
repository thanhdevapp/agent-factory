"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  FileText, 
  Search, 
  Globe, 
  Box, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  GitFork,
  HelpCircle,
  FileDiff
} from "lucide-react";
import ToolOutputView from "./ToolOutputView.js";
import DiffViewer from "./DiffViewer.js";
import SubagentTree from "./SubagentTree.js";
import AskQuestionCard from "./AskQuestionCard.js";
import JsonInspector from "./JsonInspector.js";

const TOOL_ICONS = {
  bash: Terminal,
  docker: Box,
  git: Terminal,
  edit: FileText,
  read: FileText,
  search: Search,
  browser: Globe,
  gitnexus: Cpu,
  agent: GitFork,
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
  agent: "border-indigo-500/30 bg-indigo-950/20 text-indigo-300",
  mcp: "border-violet-500/30 bg-violet-950/20 text-violet-300",
};

export default function ToolCallCard({ tool, onImageClick }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tool) return null;

  const toolName = (tool.name || "").toLowerCase();
  const type = tool.type || "bash";
  const Icon = (toolName.includes("subagent") || toolName.includes("agent"))
    ? GitFork
    : toolName.includes("question") 
      ? HelpCircle
      : toolName.includes("replace") || toolName.includes("diff")
        ? FileDiff
        : (TOOL_ICONS[type] || Terminal);

  const styleClass = TYPE_STYLES[type] || TYPE_STYLES.bash;

  const isRunning = tool.status === "running";
  const isError = tool.status === "error";

  // Check special tool types
  const isDiffTool = toolName === "replace_file_content" || 
    (tool.args?.TargetContent !== undefined && tool.args?.ReplacementContent !== undefined) ||
    (tool.args?.oldStr !== undefined && tool.args?.newStr !== undefined);

  const isSubagentTool = toolName === "invoke_subagent" || 
    toolName === "define_subagent" || 
    tool.args?.Subagents !== undefined;

  const isAskQuestionTool = toolName === "ask_question" || Array.isArray(tool.args?.questions);

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
    <div className={`my-2 rounded-xl border ${styleClass} overflow-hidden text-xs transition-all shadow-md`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
          <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-[var(--text-bright)] shrink-0">
            {type}
          </span>
          <span className="truncate font-mono text-[11px] text-[var(--text-bright)]">
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
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          )}
        </div>
      </button>

      {/* Special Inline Cards when expanded */}
      {isOpen && (
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-chat-tool)] space-y-3">
          {/* 1. Subagent Tree View */}
          {isSubagentTool && (
            <SubagentTree 
              subagents={tool.args?.Subagents || tool.args} 
              toolName={tool.name} 
            />
          )}

          {/* 2. Ask Question HITL Card */}
          {isAskQuestionTool && (
            <AskQuestionCard args={tool.args} />
          )}

          {/* 3. Code Diff Viewer for file edits */}
          {isDiffTool && (
            <DiffViewer
              oldStr={tool.args?.TargetContent || tool.args?.oldStr || ""}
              newStr={tool.args?.ReplacementContent || tool.args?.newStr || ""}
              title={tool.args?.TargetFile || tool.args?.file_path || "Code Replacement"}
            />
          )}

          {/* 4. Interactive JSON Inspector for general arguments */}
          {!isAskQuestionTool && !isSubagentTool && tool.args && Object.keys(tool.args).length > 0 && (
            <JsonInspector data={tool.args} title={`Arguments (${tool.name})`} />
          )}

          {/* 5. Tool Output View */}
          {tool.output && (
            <ToolOutputView output={tool.output} onImageClick={onImageClick} />
          )}
        </div>
      )}
    </div>
  );
}
