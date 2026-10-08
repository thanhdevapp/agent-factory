"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  ArrowLeft,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";
import SessionChatView from "../../components/chat/SessionChatView.js";
import { useFactoryTraces } from "../../lib/useFactoryTraces";
import { initThemeEngine } from "../../lib/themeStore";

function StandaloneChatContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [selectedId, setSelectedId] = useState(initialId);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  useEffect(() => {
    initThemeEngine();
  }, []);

  const { traces } = useFactoryTraces({ mode: "live" });

  const activeId = selectedId || initialId;

  const selectedAgent = useMemo(() => {
    if (!activeId) return traces[0] || null;
    const found = traces.find(
      (t) =>
        t.connectionId === activeId ||
        t.traceId === activeId ||
        t.traces?.[0]?.traceId === activeId ||
        String(t.connectionId || "").startsWith(activeId) ||
        String(t.traceId || "").startsWith(activeId)
    );
    if (found) return found;

    return {
      connectionId: activeId,
      traceId: activeId,
      account: activeId,
      model: "gemini-3.8-flash",
      state: "active",
    };
  }, [traces, activeId]);

  const toggleBrowserFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsBrowserFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsBrowserFullscreen(false);
    }
  };

  const handleCloseWindow = () => {
    if (typeof window !== "undefined") {
      window.close();
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-workbench)] flex flex-col select-none text-[var(--text-main)] font-sans">
      {/* Detached Window Title Bar (VS Code Auxiliary Window style) */}
      <header className="h-[38px] min-h-[38px] bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-3 flex items-center justify-between shrink-0 z-30">
        {/* Left: Brand & Return Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            title="Back to Virtual Office"
            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Virtual Office</span>
          </Link>

          <span className="text-[var(--border-card)]">|</span>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            </div>
            <span className="text-xs font-bold text-[var(--text-bright)] tracking-wide">
              AGMon
            </span>
            <span className="text-[10px] bg-[var(--bg-card-inner)] px-1.5 py-0.2 rounded border border-[var(--border-card)] text-[var(--text-muted)] hidden sm:inline">
              Detached Window
            </span>
          </div>
        </div>

        {/* Center: Agent Quick Switcher */}
        {traces.length > 1 && (
          <div className="flex items-center gap-1.5 bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded px-2 py-0.5 text-xs">
            <Layers className="w-3 h-3 text-[var(--accent-secondary)] shrink-0" />
            <select
              value={activeId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-transparent text-[var(--text-main)] text-xs font-mono outline-none cursor-pointer"
            >
              {traces.map((t) => (
                <option
                  key={t.connectionId || t.traceId}
                  value={t.connectionId || t.traceId}
                  className="bg-[var(--bg-card)] text-[var(--text-main)]"
                >
                  {t.account || t.connectionId} ({t.model || "gemini"})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleBrowserFullscreen}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            title={isBrowserFullscreen ? "Exit Fullscreen" : "Fullscreen (F11)"}
          >
            {isBrowserFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Close Window */}
          <button
            onClick={handleCloseWindow}
            className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            title="Close auxiliary window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content: Full viewport SessionChatView */}
      <div className="flex-1 overflow-hidden">
        {selectedAgent ? (
          <SessionChatView
            sessionTrace={selectedAgent}
            isSidebar={false}
            onClose={handleCloseWindow}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <Bot className="w-8 h-8 text-slate-600" />
            <p className="text-xs">No active session found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StandaloneChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#181818] flex items-center justify-center text-slate-400 text-xs">
          Loading standalone chat window...
        </div>
      }
    >
      <StandaloneChatContent />
    </Suspense>
  );
}
