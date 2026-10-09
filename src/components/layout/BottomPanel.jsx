"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Terminal,
  FileText,
  AlertTriangle,
  Activity,
  Trash2,
  X,
  Maximize2,
  Minimize2,
  Search,
  ArrowDownCircle,
  Play,
  Pause,
  ExternalLink,
  Columns2,
} from "lucide-react";
import XTermTerminal from "../terminal/XTermTerminal";

export default function BottomPanel({
  traces = [],
  activeTab = "logs",
  onTabChange,
  onClose,
  isMaximized = false,
  onToggleMaximize,
  onPopOutTerminal,
  projectCwd = "",
}) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [filterText, setFilterText] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [clearedAt, setClearedAt] = useState(null);
  const [mounted, setMounted] = useState(false);
  const logContainerRef = useRef(null);

  // Terminal split state for docked terminal
  const [terminalPanes, setTerminalPanes] = useState([
    { id: "bottom-pane-1", cwd: projectCwd, title: "Terminal 1" },
  ]);
  const [activeBottomPaneId, setActiveBottomPaneId] = useState("bottom-pane-1");
  const bottomTermRefs = useRef({});

  const handleSplitBottomTerminal = () => {
    if (terminalPanes.length >= 2) return;
    const newId = `bottom-pane-${Date.now()}`;
    setTerminalPanes((prev) => [
      ...prev,
      { id: newId, cwd: projectCwd, title: "Terminal (Split)" },
    ]);
    setActiveBottomPaneId(newId);
  };

  const handleCloseBottomPane = (paneId, e) => {
    e?.stopPropagation();
    if (terminalPanes.length <= 1) return;
    const remaining = terminalPanes.filter((p) => p.id !== paneId);
    setTerminalPanes(remaining);
    if (activeBottomPaneId === paneId) {
      setActiveBottomPaneId(remaining[0].id);
    }
  };

  const handleClearTerminalOrLogs = () => {
    if (currentTab === "terminal") {
      const activeTerm = bottomTermRefs.current[activeBottomPaneId];
      if (activeTerm) {
        activeTerm.clear();
      }
    } else {
      setClearedAt(Date.now());
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // Keyboard shortcut Cmd+\ / Ctrl+\ when terminal is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentTab === "terminal" && (e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        handleSplitBottomTerminal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTab, terminalPanes]);

  // Generate logs from traces with stable IDs and capped memory
  const logs = useMemo(() => {
    const list = [];

    const formatLogTime = (ts) => {
      if (!mounted) return "--:--:--";
      if (ts) {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) {
          return d.toLocaleTimeString([], { hour12: false });
        }
        if (typeof ts === "string") return ts;
      }
      return new Date().toLocaleTimeString([], { hour12: false });
    };

    traces.forEach((t, tIdx) => {
      const account = t.account || "Agent";
      const model = t.model || "gemini-3.8-flash";
      const clientType = t.clientType || (t.provider?.includes("app") ? "app" : "cli");
      const provider = t.provider || "gemini";
      const traceUniqueId = t.traceId || t.connectionId || `trace-${tIdx}`;

      // 1. Incorporate actual real-time event logs if present
      if (Array.isArray(t.logs) && t.logs.length > 0) {
        t.logs.forEach((logItem, lIdx) => {
          const rawType = (logItem.type || "").toLowerCase();
          const isError = rawType.includes("err");
          const isTool = !isError && (
            rawType.includes("tool") ||
            ["bash", "read", "edit", "search", "mcp", "docker", "git", "gitnexus", "browser", "agent"].includes(rawType)
          );
          const level = isError ? "ERROR" : isTool ? "TOOL" : "STREAM";

          const rawTs = logItem.timestamp ? new Date(logItem.timestamp).getTime() : 0;
          list.push({
            id: `${traceUniqueId}-${logItem.timestamp || lIdx}-${lIdx}`,
            rawTimestamp: isNaN(rawTs) ? 0 : rawTs,
            time: formatLogTime(logItem.timestamp),
            level,
            provider,
            clientType,
            account,
            model,
            message: logItem.detail || logItem.summary || "Event recorded",
            meta: logItem.summary !== logItem.detail ? logItem.summary : "",
          });
        });
      } else {
        // Fallback to trace state snapshot with stable IDs
        const fallbackTs = t.startedAt || 0;
        if (t.activeTool) {
          list.push({
            id: `${traceUniqueId}-tool-${t.activeTool}`,
            rawTimestamp: fallbackTs,
            time: formatLogTime(t.timestamp),
            level: "TOOL",
            provider,
            clientType,
            account,
            model,
            message: `Executing tool: ${t.activeTool}`,
            meta: t.activeToolParams || "",
          });
        }

        if (t.state === "streaming" || t.state === "busy") {
          list.push({
            id: `${traceUniqueId}-stream`,
            rawTimestamp: fallbackTs,
            time: formatLogTime(t.timestamp),
            level: "STREAM",
            provider,
            clientType,
            account,
            model,
            message: `Active session processing tokens (${Number.isFinite(t.totalTokens) ? `${Math.round(t.totalTokens / 1000)}k` : "unavailable"})`,
          });
        }

        if (t.state === "error") {
          list.push({
            id: `${traceUniqueId}-err`,
            rawTimestamp: fallbackTs,
            time: formatLogTime(t.timestamp),
            level: "ERROR",
            provider,
            clientType,
            account,
            model,
            message: `Session encountered error state (${t.error || "failed"})`,
          });
        }
      }
    });

    // If empty, supply welcome message
    if (list.length === 0) {
      list.push({
        id: "sys-init",
        rawTimestamp: Date.now(),
        time: mounted ? new Date().toLocaleTimeString([], { hour12: false }) : "--:--:--",
        level: "SYSTEM",
        provider: "system",
        clientType: "cli",
        account: "AGMon Core",
        message: "Watcher initialized. Monitoring ~/.gemini and ~/.claude directories in real time.",
      });
    }

    // Chronologically sort all logs ascending so latest actions appear at the bottom
    list.sort((a, b) => (a.rawTimestamp || 0) - (b.rawTimestamp || 0));

    // Keep only the most recent 250 log entries to prevent memory and DOM bloat
    const capped = list.length > 250 ? list.slice(-250) : list;

    if (clearedAt) {
      return capped.filter((l) => (l.rawTimestamp || 0) > clearedAt);
    }
    return capped;
  }, [traces, clearedAt, mounted]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    let result = logs;
    if (currentTab === "tools") {
      result = result.filter((l) => l.level === "TOOL");
    } else if (currentTab === "problems") {
      result = result.filter((l) => l.level === "ERROR");
    }

    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      result = result.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.account.toLowerCase().includes(q) ||
          l.level.toLowerCase().includes(q) ||
          l.model?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [logs, currentTab, filterText]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const tabs = [
    { id: "logs", label: "Agent Output", icon: FileText, count: logs.length },
    {
      id: "tools",
      label: "Tool Executions",
      icon: Activity,
      count: logs.filter((l) => l.level === "TOOL").length,
    },
    {
      id: "problems",
      label: "Problems",
      icon: AlertTriangle,
      count: logs.filter((l) => l.level === "ERROR").length,
    },
    {
      id: "terminal",
      label: "Terminal",
      icon: Terminal,
      count: 0,
    },
  ];

  return (
    <div
      data-testid="bottom-panel-container"
      className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] select-none overflow-hidden"
    >
      {/* Panel Tab Header */}
      <div className="h-[32px] min-h-[32px] bg-[#252526] border-b border-[#2b2b2b] px-2 flex items-center justify-between">
        {/* Left: Tab Buttons */}
        <div className="flex items-center h-full gap-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCurrentTab(tab.id);
                  onTabChange?.(tab.id);
                }}
                className={`flex items-center gap-1.5 h-full px-2.5 text-xs transition-colors border-b-2 font-medium ${
                  isActive
                    ? "text-white border-[#007acc] bg-[#1e1e1e]"
                    : "text-[#858585] hover:text-[#cccccc] border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-[#333333] text-slate-300 text-[9px] font-mono px-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {currentTab === "terminal" ? (
            <>
              {/* Split Terminal button */}
              <button
                onClick={handleSplitBottomTerminal}
                disabled={terminalPanes.length >= 2}
                className={`p-1 rounded text-xs transition-colors ${
                  terminalPanes.length >= 2
                    ? "text-cyan-400 bg-cyan-950/40 cursor-default"
                    : "text-slate-400 hover:text-white hover:bg-[#333333] cursor-pointer"
                }`}
                title={
                  terminalPanes.length >= 2
                    ? "Terminal Split (2 panes active)"
                    : "Split Terminal (Cmd+\\)"
                }
              >
                <Columns2 className="w-3 h-3" />
              </button>

              {/* Clear Terminal Buffer */}
              <button
                onClick={handleClearTerminalOrLogs}
                title="Clear terminal buffer (Cmd+K)"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              {/* Filter Search */}
              <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#3e3e42] rounded px-1.5 py-0.5 h-5">
                <Search className="w-2.5 h-2.5 text-slate-500" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter logs..."
                  className="bg-transparent text-[10px] text-slate-200 outline-none w-20 sm:w-32 placeholder:text-slate-500"
                />
              </div>

              {/* Auto-scroll toggle */}
              <button
                onClick={() => setAutoScroll((p) => !p)}
                title={autoScroll ? "Pause auto-scroll" : "Resume auto-scroll"}
                className={`p-1 rounded text-xs transition-colors ${
                  autoScroll ? "text-cyan-400 bg-cyan-950/40" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {autoScroll ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              {/* Clear Logs */}
              <button
                onClick={handleClearTerminalOrLogs}
                title="Clear log console"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Pop out to Floating Drawer */}
          {onPopOutTerminal && currentTab === "terminal" && (
            <button
              onClick={onPopOutTerminal}
              title="Pop out into floating terminal drawer"
              className="p-1 rounded text-cyan-400 hover:text-white hover:bg-[#333333] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {/* Maximize / Restore */}
          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              title={isMaximized ? "Restore panel size" : "Maximize panel"}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          )}

          {/* Close Panel */}
          <button
            onClick={onClose}
            title="Close panel (Cmd+J / Ctrl+J)"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Panel Body: Terminal or Logs */}
      {currentTab === "terminal" ? (
        <div
          className={`flex-1 w-full h-full min-h-0 bg-[#0a0d14] relative overflow-hidden ${
            terminalPanes.length > 1
              ? "grid grid-cols-2 divide-x divide-[#2b2b2b]"
              : "flex flex-col"
          }`}
        >
          {terminalPanes.map((pane, pIdx) => {
            const isPaneActive = activeBottomPaneId === pane.id;
            const isSplit = terminalPanes.length > 1;

            return (
              <div
                key={pane.id}
                className={`flex flex-col h-full min-h-0 min-w-0 bg-[#0a0d14] relative transition-colors ${
                  isSplit && isPaneActive ? "ring-1 ring-inset ring-cyan-500/30" : ""
                }`}
              >
                {/* Header bar displayed when split into multiple panes */}
                {isSplit && (
                  <div
                    className={`h-6 min-h-[24px] px-2 flex items-center justify-between border-b text-[10px] font-mono select-none ${
                      isPaneActive
                        ? "bg-[#101726] border-cyan-500/40 text-cyan-300"
                        : "bg-[#0b0e14] border-[#2b2b2b] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Terminal className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                      <span className="truncate">
                        {pane.title || `Pane ${pIdx + 1}`}
                      </span>
                      {isPaneActive && (
                        <span className="px-1 text-[8px] bg-cyan-950/80 text-cyan-300 border border-cyan-600/30 rounded font-semibold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleCloseBottomPane(pane.id, e)}
                      className="p-0.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                      title="Close split pane"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                {/* Terminal Instance */}
                <div className="flex-1 w-full h-full min-h-0 relative">
                  <XTermTerminal
                    ref={(el) => {
                      if (el) {
                        bottomTermRefs.current[pane.id] = el;
                      } else {
                        delete bottomTermRefs.current[pane.id];
                      }
                    }}
                    cwd={pane.cwd}
                    onTitleChange={(title) => {
                      setTerminalPanes((prev) =>
                        prev.map((p) => (p.id === pane.id ? { ...p, title } : p))
                      );
                    }}
                    onFocus={() => setActiveBottomPaneId(pane.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={logContainerRef}
          className="flex-1 p-2 font-mono text-[11px] leading-relaxed overflow-y-auto bg-[#181818] select-text divide-y divide-[#222222]"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 italic py-4 text-center">
              No logs match the current filters
            </div>
          ) : (
            filteredLogs.map((log) => {
            const isTool = log.level === "TOOL";
            const isError = log.level === "ERROR";
            const isApp = log.clientType === "app";

            return (
              <div key={log.id} className="py-1 flex items-start gap-2 hover:bg-[#202020] px-1 rounded">
                <span suppressHydrationWarning className="text-slate-500 shrink-0 text-[10px]">{log.time}</span>

                {/* Level badge */}
                <span
                  className={`px-1 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                    isError
                      ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                      : isTool
                      ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {log.level}
                </span>

                {/* Client Type tag */}
                <span
                  className={`px-1 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                    isApp
                      ? "bg-purple-950/80 text-purple-300 border border-purple-500/40"
                      : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {isApp ? "APP" : "CLI"}
                </span>

                {/* Account & message */}
                <span className="text-slate-300 font-semibold shrink-0">
                  [{log.account}]
                </span>
                <span className="text-slate-400 break-all">{log.message}</span>
                {log.meta && (
                  <span className="text-slate-500 text-[10px] truncate max-w-xs">{log.meta}</span>
                )}
              </div>
            );
          })
        )}
      </div>
      )}
    </div>
  );
}
