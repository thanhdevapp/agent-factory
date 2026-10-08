"use client";

import { useState } from "react";
import SessionChatView from "./SessionChatView.js";

/**
 * SessionChatModal
 * Floating / Fullscreen popup dialog for reviewing AI agent live chat & transcript.
 * Supports 1-click docking into the sidebar tab ("Thu vào Sidebar").
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
      className={`fixed z-50 transition-all duration-300 flex flex-col bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-3 ${
        isFullscreen
          ? "inset-4 rounded-2xl"
          : "right-4 top-4 bottom-4 w-full max-w-2xl rounded-2xl"
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
