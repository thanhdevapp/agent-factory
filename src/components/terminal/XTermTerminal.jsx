"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon, AlertTriangle, ExternalLink, RefreshCw, Search } from "lucide-react";
import { triggerHandoff } from "@/lib/handoffClient";

const SESSION_STORAGE_KEY_PREFIX = "agmon_term_history_";

export default function XTermTerminal({
  cwd = "",
  onTitleChange,
  isPoppedOut = false,
  onPopIn,
  onClose,
}) {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const [ptyUnavailable, setPtyUnavailable] = useState(false);
  const [unavailableMessage, setUnavailableMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchAddonRef = useRef(null);

  const effectiveCwd = cwd || (typeof window !== "undefined" ? window.location.pathname : "");

  useEffect(() => {
    let disposed = false;

    async function initXterm() {
      if (!terminalRef.current || xtermInstance.current) return;

      try {
        const { Terminal } = await import("@xterm/xterm");
        const { FitAddon } = await import("@xterm/addon-fit");
        const { WebLinksAddon } = await import("@xterm/addon-web-links");
        const { SearchAddon } = await import("@xterm/addon-search");
        const { Unicode11Addon } = await import("@xterm/addon-unicode11");

        // Import xterm styles dynamically if not present
        if (!document.getElementById("xterm-css")) {
          const link = document.createElement("link");
          link.id = "xterm-css";
          link.rel = "stylesheet";
          link.href = "https://cdn.jsdelivr.net/npm/@xterm/xterm@6.0.0/css/xterm.min.css";
          document.head.appendChild(link);
        }

        const term = new Terminal({
          cursorBlink: true,
          cursorStyle: "bar",
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          fontSize: 12,
          lineHeight: 1.25,
          letterSpacing: 0,
          theme: {
            background: "#0a0d14",
            foreground: "#cbd5e1",
            cursor: "#38bdf8",
            cursorAccent: "#0f172a",
            selectionBackground: "#1e293b",
            black: "#0f172a",
            red: "#f43f5e",
            green: "#10b981",
            yellow: "#f59e0b",
            blue: "#3b82f6",
            magenta: "#d946ef",
            cyan: "#06b6d4",
            white: "#f8fafc",
            brightBlack: "#475569",
            brightRed: "#fb7185",
            brightGreen: "#34d399",
            brightYellow: "#fbbf24",
            brightBlue: "#60a5fa",
            brightMagenta: "#e879f9",
            brightCyan: "#22d3ee",
            brightWhite: "#ffffff",
          },
          allowProposedApi: true,
          scrollback: 5000,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddonRef.current = fitAddon;

        // Clickable URL addon
        const webLinksAddon = new WebLinksAddon((event, uri) => {
          window.open(uri, "_blank", "noopener,noreferrer");
        });
        term.loadAddon(webLinksAddon);

        // Search addon
        const searchAddon = new SearchAddon();
        term.loadAddon(searchAddon);
        searchAddonRef.current = searchAddon;

        // Unicode 11 addon
        const unicode11Addon = new Unicode11Addon();
        term.loadAddon(unicode11Addon);
        term.unicode.activeVersion = "11";

        // Try WebGL GPU acceleration addon (Orca pattern)
        try {
          const { WebglAddon } = await import("@xterm/addon-webgl");
          const webglAddon = new WebglAddon();
          webglAddon.onContextLoss(() => {
            webglAddon.dispose();
          });
          term.loadAddon(webglAddon);
        } catch (webglErr) {
          // Fall back gracefully to standard canvas renderer
          console.info("[XTermTerminal] WebGL addon unavailable, using standard canvas renderer");
        }

        term.open(terminalRef.current);
        fitAddon.fit();
        xtermInstance.current = term;

        // Restore buffer from session storage if exists
        try {
          const savedBuffer = sessionStorage.getItem(`${SESSION_STORAGE_KEY_PREFIX}${effectiveCwd}`);
          if (savedBuffer) {
            term.write(savedBuffer);
          }
        } catch {}

        // Connect WebSocket
        connectWebSocket(term, fitAddon);
      } catch (err) {
        console.error("[XTermTerminal] Failed to initialize xterm:", err);
      }
    }

    function connectWebSocket(term, fitAddon) {
      if (disposed) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      // Primary WebSocket URL
      const primaryUrl = `${protocol}//${host}/api/pty`;
      // Companion fallback port for next dev
      const companionUrl = `ws://localhost:3031`;

      let ws = new WebSocket(primaryUrl);
      let didFallback = false;

      function setupSocketListeners(socket) {
        socket.onopen = () => {
          setConnected(true);
          setPtyUnavailable(false);
          socket.send(
            JSON.stringify({
              type: "init",
              cwd: effectiveCwd,
              cols: term.cols,
              rows: term.rows,
            })
          );
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "output") {
              term.write(msg.data);
              // Save last 5000 chars to session storage
              try {
                const existing = sessionStorage.getItem(`${SESSION_STORAGE_KEY_PREFIX}${effectiveCwd}`) || "";
                const updated = (existing + msg.data).slice(-10000);
                sessionStorage.setItem(`${SESSION_STORAGE_KEY_PREFIX}${effectiveCwd}`, updated);
              } catch {}
            } else if (msg.type === "ready") {
              onTitleChange?.(`${msg.shell?.split("/").pop() || "sh"} (${msg.cwd?.split("/").pop() || "terminal"})`);
            } else if (msg.type === "unavailable") {
              setPtyUnavailable(true);
              setUnavailableMessage(msg.message || "node-pty native build is missing.");
            }
          } catch (err) {
            // Raw binary/text fallback
            term.write(event.data);
          }
        };

        socket.onerror = () => {
          if (!didFallback && process.env.NODE_ENV !== "production") {
            didFallback = true;
            console.info("[XTermTerminal] Retrying via companion WebSocket port 3031...");
            try {
              socket.close();
            } catch {}
            ws = new WebSocket(companionUrl);
            setupSocketListeners(ws);
            socketRef.current = ws;
          }
        };

        socket.onclose = () => {
          setConnected(false);
        };
      }

      setupSocketListeners(ws);
      socketRef.current = ws;

      // Handle user keystrokes
      term.onData((data) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "input", data }));
        }
      });

      // Handle resize
      term.onResize(({ cols, rows }) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "resize", cols, rows }));
        }
      });
    }

    initXterm();

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddonRef.current?.fit();
      } catch {}
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (xtermInstance.current) {
        xtermInstance.current.dispose();
        xtermInstance.current = null;
      }
    };
  }, [effectiveCwd]);

  const handleSearch = (direction = "next") => {
    if (!searchAddonRef.current || !searchQuery) return;
    if (direction === "next") {
      searchAddonRef.current.findNext(searchQuery);
    } else {
      searchAddonRef.current.findPrevious(searchQuery);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0a0d14] text-[#cbd5e1] overflow-hidden font-mono select-text">
      {/* Fallback Banner if node-pty is missing */}
      {ptyUnavailable && (
        <div className="shrink-0 flex items-center justify-between gap-3 p-3 bg-amber-950/80 border-b border-amber-600/40 text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{unavailableMessage}</span>
          </div>
          <button
            onClick={() => triggerHandoff({ path: effectiveCwd, target: "terminal" })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            <span>Open in Ghostty / Terminal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* In-terminal Search Bar */}
      {showSearch && (
        <div className="absolute top-2 right-4 z-20 flex items-center gap-1 bg-[#1e293b] border border-slate-700 rounded-lg p-1.5 shadow-xl text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchAddonRef.current?.findNext(e.target.value);
            }}
            placeholder="Search terminal..."
            className="bg-transparent border-none text-slate-200 text-xs focus:outline-none px-1.5 w-40"
            autoFocus
          />
          <button
            onClick={() => handleSearch("prev")}
            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
            title="Previous match"
          >
            ↑
          </button>
          <button
            onClick={() => handleSearch("next")}
            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
            title="Next match"
          >
            ↓
          </button>
          <button
            onClick={() => setShowSearch(false)}
            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Terminal Viewport */}
      <div
        ref={terminalRef}
        className="flex-1 w-full h-full overflow-hidden p-2"
        onClick={() => xtermInstance.current?.focus()}
      />
    </div>
  );
}
