"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Cpu,
  Search,
  RotateCw,
  HardDrive,
  Activity,
  Layers,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function LeftSidebar({
  workstations = [],
  selectedId = null,
  onSelectAgent,
  onOpenAgentTab,
  stats = {},
  onRefresh,
  onStartReplay,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    agents: true,
    folders: true,
    metrics: false,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter workstations by search
  const filteredWorkstations = useMemo(() => {
    if (!searchQuery.trim()) return workstations;
    const q = searchQuery.toLowerCase();
    return workstations.filter(
      (w) =>
        w.account?.toLowerCase().includes(q) ||
        w.connectionId?.toLowerCase().includes(q) ||
        w.provider?.toLowerCase().includes(q) ||
        w.model?.toLowerCase().includes(q) ||
        w.activeTool?.toLowerCase().includes(q)
    );
  }, [workstations, searchQuery]);

  // Group by client type / provider
  const groupedAgents = useMemo(() => {
    const groups = {
      geminiApp: [],
      geminiCli: [],
      claude: [],
      other: [],
    };

    filteredWorkstations.forEach((w) => {
      const p = (w.provider || "").toLowerCase();
      const ct = (w.clientType || "").toLowerCase();
      if (ct === "app" || p.includes("app")) {
        groups.geminiApp.push(w);
      } else if (p.includes("claude")) {
        groups.claude.push(w);
      } else if (p.includes("gemini") || ct === "cli") {
        groups.geminiCli.push(w);
      } else {
        groups.other.push(w);
      }
    });

    return groups;
  }, [filteredWorkstations]);

  const renderAgentRow = (agent, idx) => {
    const isSelected = selectedId === agent.connectionId;
    const state = agent.state || "idle";
    const isBusy = state === "streaming" || state === "busy" || state === "working";
    const isError = state === "error";

    // Tag colors
    const isApp = agent.clientType === "app" || (agent.provider || "").includes("(app)");

    return (
      <div
        key={`${agent.connectionId || "agent"}-${idx}`}
        onClick={() => {
          onSelectAgent?.(agent.connectionId);
          onOpenAgentTab?.(agent);
        }}
        className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer text-xs transition-colors border-l-2 ${
          isSelected
            ? "bg-[#37373d] text-white border-[#007acc]"
            : "hover:bg-[#2a2d2e] text-[#cccccc] border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Status Indicator */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isError
                ? "bg-rose-500"
                : isBusy
                ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                : "bg-slate-500"
            }`}
          />

          {/* Agent Label / Model */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium truncate text-[11px] text-slate-200">
                {agent.account || `Desk #${agent.deskIndex + 1}`}
              </span>

              {/* Client Tag: APP vs CLI */}
              {isApp ? (
                <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                  APP
                </span>
              ) : (
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                  CLI
                </span>
              )}
            </div>

            {/* Model & current tool */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
              <span className="text-slate-400 truncate">
                {agent.model || "gemini-3.8-flash"}
              </span>
              {agent.activeTool && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-cyan-400 truncate font-mono">
                    {agent.activeTool}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tokens pill & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onStartReplay && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartReplay(agent.connectionId);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#3e3e42] text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
              title="Tua lại hành trình AI phiên này (Time-Machine Replay)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300">
            {agent.tokensTotal ? `${Math.round(agent.tokensTotal / 1000)}k` : "0k"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] select-none overflow-hidden">
      {/* Sidebar Header */}
      <div className="h-[35px] min-h-[35px] bg-[#252526] border-b border-[#2b2b2b] px-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#007acc]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb]">
            EXPLORER: AGENTS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            title="Làm mới danh sách"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Filter / Search Box */}
      <div className="p-2 border-b border-[#2b2b2b] bg-[#1e1e1e]">
        <div className="flex items-center gap-1.5 bg-[#252526] border border-[#3e3e42] focus-within:border-[#007acc] rounded px-2 py-1">
          <Search className="w-3 h-3 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Lọc agents theo tên, model..."
            className="w-full bg-transparent text-[11px] text-slate-200 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Sidebar Tree Accordion List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2b2b2b]">
        {/* Section 1: Active Agents */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("agents")}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#252526]/60 hover:bg-[#252526] text-[11px] font-semibold text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {expandedSections.agents ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
              <span className="uppercase text-[10px] tracking-wide">
                Workstations & Sessions ({filteredWorkstations.length})
              </span>
            </div>
            {stats?.busy > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                {stats.busy} active
              </span>
            )}
          </button>

          {expandedSections.agents && (
            <div className="py-1">
              {filteredWorkstations.length === 0 ? (
                <div className="px-4 py-3 text-center text-xs text-slate-500 italic">
                  Không có agent nào đang hoạt động
                </div>
              ) : (
                <>
                  {/* Gemini App Agents */}
                  {groupedAgents.geminiApp.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-purple-400/80 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Antigravity Desktop App ({groupedAgents.geminiApp.length})</span>
                      </div>
                      {groupedAgents.geminiApp.map(renderAgentRow)}
                    </div>
                  )}

                  {/* Gemini CLI Agents */}
                  {groupedAgents.geminiCli.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400/80 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5" />
                        <span>Gemini CLI / Antigravity ({groupedAgents.geminiCli.length})</span>
                      </div>
                      {groupedAgents.geminiCli.map(renderAgentRow)}
                    </div>
                  )}

                  {/* Claude Agents */}
                  {groupedAgents.claude.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-400/80 flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5" />
                        <span>Claude Code ({groupedAgents.claude.length})</span>
                      </div>
                      {groupedAgents.claude.map(renderAgentRow)}
                    </div>
                  )}

                  {/* Other / Unclassified */}
                  {groupedAgents.other.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <span>Other Agents ({groupedAgents.other.length})</span>
                      </div>
                      {groupedAgents.other.map(renderAgentRow)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Watched Folders */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("folders")}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#252526]/60 hover:bg-[#252526] text-[11px] font-semibold text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {expandedSections.folders ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
              <span className="uppercase text-[10px] tracking-wide">
                Watched Brain Directories
              </span>
            </div>
          </button>

          {expandedSections.folders && (
            <div className="px-3 py-2 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-slate-400">
                <FolderOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.gemini/antigravity/brain</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Folder className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.gemini/antigravity-cli/brain</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.claude/projects</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Summary Metrics */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("metrics")}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#252526]/60 hover:bg-[#252526] text-[11px] font-semibold text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {expandedSections.metrics ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
              <span className="uppercase text-[10px] tracking-wide">
                Factory Overview
              </span>
            </div>
          </button>

          {expandedSections.metrics && (
            <div className="p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Total Workstations:</span>
                <span className="font-bold text-slate-200">{stats?.agents || 0}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Active Agents:</span>
                <span className="font-bold text-emerald-400">{stats?.busy || 0}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Total Tokens:</span>
                <span className="font-bold text-cyan-400">{stats?.tokensLabel || "0k"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
