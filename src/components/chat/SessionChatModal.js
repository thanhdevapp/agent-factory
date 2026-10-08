"use client";

import { useState } from "react";
import SessionChatView from "./SessionChatView.js";

/**
 * SessionChatModal
 * Floating / Fullscreen popup dialog for reviewing AI agent live chat & transcript.
 * Supports:
 * 1. True 100% Fullscreen (edge-to-edge, zero margin).
 * 2. 1-click docking into sidebar tab ("Thu vào Sidebar").
 * 3. 1-click pop-out to a completely separate OS/Browser window (VS Code style).
 */
export default function SessionChatModal({
  sessionTrace,
  onClose,
  onDockToSidebar,
  onStartReplay,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!sessionTrace) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Live Chat: ${sessionTrace.account || sessionTrace.connectionId || "Agent"}`}
      className={`fixed transition-all duration-200 flex flex-col bg-[#181818] shadow-2xl backdrop-blur-xl animate-in fade-in ${
        isFullscreen
          ? "inset-0 w-screen h-screen rounded-none z-[999] border-0"
          : "inset-y-4 right-4 md:right-8 w-full max-w-3xl rounded-xl z-50 border border-slate-700/80 shadow-2xl"
      }`}
    >
      <SessionChatView
        sessionTrace={sessionTrace}
        isSidebar={false}
        onClose={onClose}
        onDockToSidebar={onDockToSidebar}
        onStartReplay={onStartReplay}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />
    </div>
  );
}
