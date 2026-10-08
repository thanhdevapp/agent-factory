"use client";

import React, { useState } from "react";
import { 
  GitFork, 
  Bot, 
  Cpu, 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare
} from "lucide-react";

/**
 * SubagentTree Component
 * Visualizes hierarchical subagent delegations (invoke_subagent / define_subagent)
 * Displays Role, Model, Workspace mode, Task prompt, and execution state
 */
export default function SubagentTree({
  subagents = [],
  toolName = "invoke_subagent",
  onSelectSubagent,
  className = ""
}) {
  const [expandedIndex, setExpandedIndex] = useState(0); // Expand first agent by default

  // Normalize subagents array from args
  const items = Array.isArray(subagents) 
    ? subagents 
    : subagents?.Subagents 
      ? subagents.Subagents 
      : [subagents];

  if (!items || items.length === 0) return null;

  const getModelBadgeColor = (model) => {
    const m = (model || "").toLowerCase();
    if (m.includes("pro")) return "text-purple-400 bg-purple-500/10 border-purple-500/30";
    if (m.includes("flash_lite")) return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    if (m.includes("flash")) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-indigo-400 bg-indigo-500/10 border-indigo-500/30";
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-slate-200 flex items-center gap-1.5">
              <span>Sub-Agent Delegation</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                {items.length} {items.length > 1 ? "agents" : "agent"}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Task decomposition and parallel execution
            </div>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
          {toolName}
        </span>
      </div>

      {/* Subagents List */}
      <div className="space-y-2.5">
        {items.map((agent, index) => {
          const isExpanded = expandedIndex === index;
          const role = agent.Role || agent.role || "Subagent Worker";
          const typeName = agent.TypeName || agent.typeName || agent.name || "generic";
          const model = agent.Model || agent.model || "inherit";
          const workspace = agent.Workspace || agent.workspace || "inherit";
          const prompt = agent.Prompt || agent.prompt || agent.system_prompt || agent.description || "";
          const conversationId = agent.conversationId || agent.ConversationId;

          return (
            <div 
              key={index}
              className={`rounded-lg border transition-all ${
                isExpanded 
                  ? "border-indigo-500/40 bg-slate-900/90 shadow-md" 
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
              }`}
            >
              {/* Item Summary Bar */}
              <div 
                onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                className="flex items-center justify-between gap-2 p-2.5 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-slate-800 text-slate-300">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-200 truncate flex items-center gap-2">
                      <span className="truncate">{role}</span>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 rounded bg-slate-800/80 shrink-0">
                        {typeName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Model badge */}
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${getModelBadgeColor(model)}`}>
                    <Cpu className="w-2.5 h-2.5" />
                    {model}
                  </span>

                  {/* Workspace badge */}
                  {workspace !== "inherit" && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <FolderGit2 className="w-2.5 h-2.5" />
                      {workspace}
                    </span>
                  )}

                  {/* Expand icon */}
                  <span className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-800/70 space-y-2.5 text-[11px] animate-fadeIn">
                  {/* Prompt Box */}
                  <div>
                    <div className="text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      <span>Task Prompt / Instructions:</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/90 text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {prompt || "No prompt instruction specified."}
                    </div>
                  </div>

                  {/* Meta info row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span>Type: <strong className="text-slate-300 font-normal">{typeName}</strong></span>
                      <span>Workspace: <strong className="text-slate-300 font-normal">{workspace}</strong></span>
                    </div>

                    {conversationId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSubagent?.(conversationId);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Subagent Chat</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
