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
  MessageSquare,
  Files,
  FolderTree,
  Bot,
  ShoppingBag,
  Blocks,
  Monitor,
  TerminalSquare,
} from "lucide-react";
import FileExplorer from "./FileExplorer";
import { TOTAL_CATALOG_COUNT } from "@/lib/catalog/index.js";

export default function LeftSidebar({
  workstations = [],
  selectedId = null,
  onSelectAgent,
  onOpenAgentTab,
  stats = {},
  onRefresh,
  onStartReplay,
  onViewConversation,
  onOpenFile,
  onOpenStore,
  activeSidebarTab: externalActiveTab,
  onActiveSidebarTabChange,
}) {
  const [internalTab, setInternalTab] = useState("agents");
  const activeSidebarTab = externalActiveTab !== undefined ? externalActiveTab : internalTab;
  const setActiveSidebarTab = onActiveSidebarTabChange || setInternalTab;
  const [explorerPath, setExplorerPath] = useState("");
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
        w.sessionTitle?.toLowerCase().includes(q) ||
        w.lastText?.toLowerCase().includes(q) ||
        w.connectionId?.toLowerCase().includes(q) ||
        w.provider?.toLowerCase().includes(q) ||
        w.model?.toLowerCase().includes(q) ||
        w.activeTool?.toLowerCase().includes(q)
    );
  }, [workstations, searchQuery]);

  // Group by client type / provider
  const groupedAgents = useMemo(() => {
    const groups = {
      extensions: [],
      desktop: [],
      codexDesktop: [],
      codexCli: [],
      geminiApp: [],
      geminiCli: [],
      claude: [],
      other: [],
    };

    filteredWorkstations.forEach((w) => {
      const p = (w.provider || "").toLowerCase();
      const ct = (w.clientType || "").toLowerCase();
      const cli = (w.cli || "").toLowerCase();
      const conn = (w.connectionId || "").toLowerCase();
      const model = (w.model || "").toLowerCase();

      const isCodex = cli === "codex" || p.includes("codex") || conn.includes("codex");
      const isExtension = ct === "extension" || ct === "ide" || conn.includes("extension");
      const isDesktop = ct === "desktop" || conn.includes("desktop");
      const isClaude = cli === "claude" || p.includes("claude") || p.includes("anthropic") || model.includes("claude");

      if (isCodex) {
        if (isExtension) {
          groups.extensions.push(w);
        } else if (isDesktop || ct === "app" || conn.includes("app")) {
          groups.codexDesktop.push(w);
        } else {
          groups.codexCli.push(w);
        }
      } else if (isExtension) {
        groups.extensions.push(w);
      } else if (isDesktop) {
        groups.desktop.push(w);
      } else if (ct === "app" || p.includes("app") || conn.includes("app")) {
        groups.geminiApp.push(w);
      } else if (isClaude) {
        groups.claude.push(w);
      } else if (p.includes("gemini") || cli === "antigravity" || ct === "cli") {
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

    // Tag colors & fallback
    const workspaceName = agent.account || "agent-factory";
    const sessionTitle = agent.sessionTitle || workspaceName;
    const isApp = agent.clientType === "app" || (agent.provider || "").includes("(app)");
    const isExt =
      agent.clientType === "extension" ||
      (agent.provider || "").includes("extension") ||
      (agent.connectionId || "").toLowerCase().includes("extension");
    const isDesktop =
      agent.clientType === "desktop" ||
      (agent.connectionId || "").toLowerCase().includes("desktop");
    const isCodex = agent.cli === "codex" || (agent.connectionId || "").toLowerCase().includes("codex");

    const previewText = agent.lastText
      ? `${agent.lastTextRole === "assistant" ? "AI: " : agent.lastTextRole === "user" ? "You: " : ""}${agent.lastText}`
      : `${workspaceName} · ${agent.model || "AI Agent"}${agent.activeTool ? ` · ${agent.activeTool}` : ""}`;

    return (
      <div
        key={agent.connectionId || `agent-${idx}`}
        onClick={() => {
          onSelectAgent?.(agent.connectionId);
          onOpenAgentTab?.(agent);
        }}
        className={`group flex items-center justify-between px-3 py-2 cursor-pointer text-xs transition-colors border-l-2 ${
          isSelected
            ? "bg-[#37373d] text-white border-[#007acc]"
            : "hover:bg-[#2a2d2e] text-[#cccccc] border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
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

          {/* 2 Lines: Session title on line 1, Last message preview on line 2 */}
          <div className="flex flex-col min-w-0 flex-1">
            {/* Line 1: Session Title + Type Badge */}
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="font-medium truncate text-[11px] text-slate-200" title={sessionTitle}>
                {sessionTitle}
              </span>

              {/* Client Tag: CODEX vs EXT vs DESKTOP vs APP vs CLI */}
              {isCodex ? (
                <span
                  className={`shrink-0 text-[9px] font-bold px-1 rounded uppercase tracking-wider border ${
                    isExt
                      ? "bg-sky-950/80 text-sky-300 border-sky-500/40"
                      : isDesktop || isApp
                      ? "bg-teal-950/80 text-teal-300 border-teal-500/40"
                      : "bg-teal-950/80 text-teal-300 border-teal-500/40"
                  }`}
                >
                  {isExt ? "EXT" : isDesktop || isApp ? "DESK" : "CLI"}
                </span>
              ) : isExt ? (
                <span className="shrink-0 bg-sky-950/80 text-sky-300 border border-sky-500/40 text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                  EXT
                </span>
              ) : isDesktop ? (
                <span className="shrink-0 bg-orange-950/80 text-orange-300 border border-orange-500/40 text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                  DESK
                </span>
              ) : isApp ? (
                <span className="shrink-0 bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                  APP
                </span>
              ) : (
                <span className="shrink-0 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                  CLI
                </span>
              )}
            </div>

            {/* Line 2: Last Message Preview */}
            <p className="truncate text-[10px] leading-4 text-slate-400 mt-0.5" title={previewText}>
              {previewText}
            </p>
          </div>
        </div>

        {/* Tokens pill & Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {onStartReplay && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartReplay(agent.connectionId);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#3e3e42] text-cyan-400 hover:text-white transition-all cursor-pointer"
              title="Replay Session (Default)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          {onViewConversation && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewConversation(agent.connectionId);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#3e3e42] text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
              title="View conversation transcript"
            >
              <MessageSquare className="w-3 h-3" />
            </button>
          )}
          <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300">
            {agent.totalLabel || "0k"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] select-none overflow-hidden">
      {/* Sidebar Header with 2 Tabs: Agents vs Files */}
      <div className="h-[35px] min-h-[35px] bg-[#252526] border-b border-[#2b2b2b] px-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSidebarTab("agents")}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              activeSidebarTab === "agents"
                ? "bg-[#1e1e1e] text-white border border-[#3e3e42]"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="View active AI Agents & Sessions"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agents ({workstations.length})</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab("files")}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              activeSidebarTab === "files"
                ? "bg-[#1e1e1e] text-white border border-[#3e3e42]"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Browse Workspace & Project Files"
          >
            <FolderTree className="w-3.5 h-3.5 text-amber-400" />
            <span>Files</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            title="Refresh"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {activeSidebarTab === "files" ? (
        <FileExplorer onOpenFile={onOpenFile} initialPath={explorerPath} />
      ) : (
        <>
          {/* Filter / Search Box */}
          <div className="p-2 border-b border-[#2b2b2b] bg-[#1e1e1e]">
            <div className="flex items-center gap-1.5 bg-[#252526] border border-[#3e3e42] focus-within:border-[#007acc] rounded px-2 py-1">
              <Search className="w-3 h-3 text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter agents by name, model..."
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
                  No active agents found
                </div>
              ) : (
                <>
                  {/* Extensions & IDEs (Claude VS Code, Antigravity IDE, etc.) */}
                  {groupedAgents.extensions?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-sky-400/90 flex items-center gap-1">
                        <Blocks className="w-2.5 h-2.5" />
                        <span>Extensions & IDEs ({groupedAgents.extensions.length})</span>
                      </div>
                      {groupedAgents.extensions.map(renderAgentRow)}
                    </div>
                  )}

                  {/* Claude Desktop */}
                  {groupedAgents.desktop?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-orange-400/90 flex items-center gap-1">
                        <Monitor className="w-2.5 h-2.5" />
                        <span>Claude Desktop ({groupedAgents.desktop.length})</span>
                      </div>
                      {groupedAgents.desktop.map(renderAgentRow)}
                    </div>
                  )}

                  {/* Codex Desktop App */}
                  {groupedAgents.codexDesktop?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-teal-400/90 flex items-center gap-1">
                        <Monitor className="w-2.5 h-2.5" />
                        <span>Codex Desktop App ({groupedAgents.codexDesktop.length})</span>
                      </div>
                      {groupedAgents.codexDesktop.map(renderAgentRow)}
                    </div>
                  )}

                  {/* Codex CLI */}
                  {groupedAgents.codexCli?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-teal-400/90 flex items-center gap-1">
                        <TerminalSquare className="w-2.5 h-2.5" />
                        <span>Codex CLI ({groupedAgents.codexCli.length})</span>
                      </div>
                      {groupedAgents.codexCli.map(renderAgentRow)}
                    </div>
                  )}

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
              <div
                onClick={() => {
                  setExplorerPath("~/.gemini/antigravity/brain");
                  setActiveSidebarTab("files");
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-purple-300 cursor-pointer p-1 rounded hover:bg-[#252526] transition-colors"
                title="Click to browse Antigravity Brain files"
              >
                <FolderOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.gemini/antigravity/brain</span>
              </div>
              <div
                onClick={() => {
                  setExplorerPath("~/.gemini/antigravity-cli/brain");
                  setActiveSidebarTab("files");
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#252526] transition-colors"
                title="Click to browse Antigravity CLI Brain files"
              >
                <Folder className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.gemini/antigravity-cli/brain</span>
              </div>
              <div
                onClick={() => {
                  setExplorerPath("~/.claude/projects");
                  setActiveSidebarTab("files");
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#252526] transition-colors"
                title="Click to browse Claude Projects files"
              >
                <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.claude/projects</span>
              </div>
              <div
                onClick={() => {
                  setExplorerPath("~/.codex/sessions");
                  setActiveSidebarTab("files");
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-teal-300 cursor-pointer p-1 rounded hover:bg-[#252526] transition-colors"
                title="Click to browse Codex Sessions files"
              >
                <Folder className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate font-mono text-[10px]">~/.codex/sessions</span>
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

        {/* Section 4: Supporter Store Quick Entry */}
        <div className="p-2 border-t border-[#252526] bg-[#1a1a1b]">
          <button
            type="button"
            onClick={onOpenStore}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border border-amber-500/30 text-amber-300 transition-all cursor-pointer text-xs"
            title={`Open Supporter Store: ${TOTAL_CATALOG_COUNT} Tech Items & 3D Effects`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="font-bold text-white text-[11px] leading-tight">Supporter Store</div>
                <div className="text-[10px] text-amber-400/80">{TOTAL_CATALOG_COUNT} Tech Items & 3D Effects</div>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
              Open
            </span>
          </button>
        </div>
      </div>
    </>
  )}
</div>
  );
}
