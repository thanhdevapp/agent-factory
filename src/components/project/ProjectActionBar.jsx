"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  FlaskConical,
  Package,
  CheckCheck,
  Globe,
  ExternalLink,
  Loader2,
  Square,
  Terminal,
  ChevronDown,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function ProjectActionBar({
  cwd = "",
  compact = false,
  onRunInTerminal = null,
  className = "",
}) {
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // { scriptName, pid, status: 'running'|'done'|'error', exitCode }
  const [detectedPort, setDetectedPort] = useState(null); // { url, port }
  const [logs, setLogs] = useState([]); // bounded 200 lines
  const [showLogs, setShowLogs] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const abortControllerRef = useRef(null);

  // Fetch scripts when cwd changes
  useEffect(() => {
    let cancelled = false;
    const fetchScripts = async () => {
      setLoading(true);
      try {
        const query = cwd ? `?path=${encodeURIComponent(cwd)}` : "";
        const res = await fetch(`/api/project/scripts${query}`);
        if (!res.ok) throw new Error("Failed to load scripts");
        const data = await res.json();
        if (!cancelled) {
          setProjectInfo(data);
        }
      } catch (err) {
        if (!cancelled) setProjectInfo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchScripts();
    return () => {
      cancelled = true;
    };
  }, [cwd]);

  // Handle in-place script execution via SSE
  const handleRunScript = useCallback(
    async (scriptName) => {
      // If onRunInTerminal callback is explicitly provided and user prefers terminal, run there
      if (onRunInTerminal && typeof onRunInTerminal === "function") {
        const pkgManager = projectInfo?.packageManager || "npm";
        onRunInTerminal(`${pkgManager} run ${scriptName}`, cwd);
        return;
      }

      // If a task is already running, abort it first
      if (activeTask?.status === "running" && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setActiveTask({
        scriptName,
        pid: null,
        status: "running",
        exitCode: null,
      });
      setLogs([]);
      setShowLogs(true);

      try {
        const res = await fetch("/api/project/run-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scriptName, targetPath: cwd }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Failed to start script: HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const messages = buffer.split("\n\n");
          buffer = messages.pop() || "";

          for (const message of messages) {
            const lines = message.split("\n");
            let event = "message";
            let dataStr = "";

            for (const line of lines) {
              if (line.startsWith("event: ")) {
                event = line.slice(7).trim();
              } else if (line.startsWith("data: ")) {
                dataStr = line.slice(6).trim();
              }
            }

            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (event === "start") {
                setActiveTask((p) => (p ? { ...p, pid: data.pid } : null));
              } else if (event === "port") {
                setDetectedPort(data);
                // Broadcast for other components
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("agmon:port-detected", {
                      detail: { ...data, cwd },
                    })
                  );
                }
              } else if (event === "log") {
                setLogs((prev) => {
                  const next = [...prev, data];
                  // Keep bounded at 200 lines
                  return next.length > 200 ? next.slice(next.length - 200) : next;
                });
              } else if (event === "exit") {
                setActiveTask((p) =>
                  p
                    ? {
                        ...p,
                        status: data.code === 0 ? "done" : "error",
                        exitCode: data.code,
                      }
                    : null
                );
              } else if (event === "error") {
                setActiveTask((p) =>
                  p ? { ...p, status: "error", error: data.message } : null
                );
              }
            } catch {}
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setActiveTask((p) =>
            p ? { ...p, status: "error", error: err.message } : null
          );
        }
      }
    },
    [cwd, onRunInTerminal, projectInfo, activeTask]
  );

  // Stop running script
  const handleStopScript = useCallback(async () => {
    if (activeTask?.pid) {
      try {
        await fetch("/api/project/run-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "kill", pid: activeTask.pid }),
        });
      } catch {}
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setActiveTask((p) => (p ? { ...p, status: "done", exitCode: 130 } : null));
  }, [activeTask]);

  if (loading && !projectInfo) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-slate-500 py-1 ${className}`}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="text-[11px]">Discovering scripts...</span>
      </div>
    );
  }

  if (!projectInfo?.exists) {
    return null;
  }

  const { categories, customScripts = [], packageManager = "npm" } = projectInfo;
  const isRunning = activeTask?.status === "running";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Action Bar Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Dev Action */}
        {categories.dev && (
          <button
            onClick={() =>
              isRunning && activeTask?.scriptName === categories.dev.name
                ? handleStopScript()
                : handleRunScript(categories.dev.name)
            }
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer shadow-sm ${
              isRunning && activeTask?.scriptName === categories.dev.name
                ? "bg-amber-950/80 text-amber-300 border border-amber-500/50 hover:bg-amber-900"
                : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/90"
            }`}
            title={`${categories.dev.cmd} (${packageManager} run ${categories.dev.name})`}
          >
            {isRunning && activeTask?.scriptName === categories.dev.name ? (
              <>
                <Square className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Stop Dev</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Dev</span>
              </>
            )}
          </button>
        )}

        {/* Test Action */}
        {categories.test && (
          <button
            disabled={isRunning}
            onClick={() => handleRunScript(categories.test.name)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-purple-300 border border-purple-500/40 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            title={`${categories.test.cmd} (${packageManager} run ${categories.test.name})`}
          >
            <FlaskConical className="w-3 h-3 text-purple-400" />
            <span>Test</span>
          </button>
        )}

        {/* Build Action */}
        {categories.build && (
          <button
            disabled={isRunning}
            onClick={() => handleRunScript(categories.build.name)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            title={`${categories.build.cmd} (${packageManager} run ${categories.build.name})`}
          >
            <Package className="w-3 h-3 text-cyan-400" />
            <span>Build</span>
          </button>
        )}

        {/* Lint Action */}
        {categories.lint && (
          <button
            disabled={isRunning}
            onClick={() => handleRunScript(categories.lint.name)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-slate-300 border border-[#3e3e42] hover:border-slate-500 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            title={`${categories.lint.cmd} (${packageManager} run ${categories.lint.name})`}
          >
            <CheckCheck className="w-3 h-3 text-slate-400" />
            <span>Lint</span>
          </button>
        )}

        {/* Custom Scripts Dropdown */}
        {customScripts.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((p) => !p)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-slate-400 hover:text-slate-200 border border-[#3e3e42] text-xs transition-colors cursor-pointer"
            >
              <span>Scripts</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDropdown && (
              <div className="absolute left-0 mt-1 w-44 max-h-48 overflow-y-auto bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-xl z-30 py-1 divide-y divide-[#2a2a2a]">
                {customScripts.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setShowDropdown(false);
                      handleRunScript(s.name);
                    }}
                    className="w-full text-left px-2.5 py-1 text-xs text-slate-300 hover:bg-[#2a2d2e] hover:text-white flex items-center justify-between truncate"
                    title={s.cmd}
                  >
                    <span className="font-mono text-[11px] truncate">{s.name}</span>
                    <Play className="w-2.5 h-2.5 text-slate-500 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detected Port Badge (Orca Localhost Pattern) */}
        {detectedPort && (
          <a
            href={detectedPort.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-200 text-xs font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer animate-in fade-in"
            title={`Open ${detectedPort.url} in browser`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>localhost:{detectedPort.port}</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        )}
      </div>

      {/* Mini Output Stream Drawer (Bounded 200 lines) */}
      {showLogs && logs.length > 0 && (
        <div className="mt-1 bg-[#12141a] border border-[#2e3440] rounded-lg p-2 font-mono text-[10px] leading-relaxed text-slate-300 select-text">
          <div className="flex items-center justify-between border-b border-[#202530] pb-1 mb-1.5 text-slate-400">
            <div className="flex items-center gap-1.5">
              {isRunning ? (
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              ) : activeTask?.status === "done" ? (
                <CheckCheck className="w-3 h-3 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-rose-400" />
              )}
              <span className="font-semibold text-slate-200">
                {activeTask?.scriptName}
              </span>
              <span className="text-[9px] text-slate-500">
                {isRunning ? "running" : `exit code ${activeTask?.exitCode ?? 0}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-600">
                {logs.length}/200 lines
              </span>
              <button
                onClick={() => setShowLogs(false)}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Hide
              </button>
            </div>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-0.5 scrollbar-thin">
            {logs.map((log, idx) => (
              <div
                key={`log-${idx}-${log.timestamp}`}
                className={log.type === "stderr" ? "text-rose-400" : "text-slate-300"}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
