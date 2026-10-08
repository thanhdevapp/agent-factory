"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Sparkles,
  Layers,
  Wrench,
  Brain,
  FileCode,
  Terminal,
  User,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import TimeMachineToolbar from "./TimeMachineToolbar.jsx";
import ReplayEventInspector from "./ReplayEventInspector.jsx";

export default function ReplayModeOverlay({
  replay,
  onExit,
  className = "",
  children,
}) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isBubbleExpanded, setIsBubbleExpanded] = useState(true);

  const {
    sessionInfo = {},
    currentKeyframe,
    currentStepIndex = 0,
    totalSteps = 0,
    isPlaying = false,
    togglePlay,
    stepForward,
    stepBackward,
    seekToStep,
  } = replay || {};

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") {
        return; // Don't intercept when user is typing in forms
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay?.();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        stepBackward?.();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        stepForward?.();
      } else if (e.code === "Home") {
        e.preventDefault();
        seekToStep?.(0);
      } else if (e.code === "End") {
        e.preventDefault();
        seekToStep?.(Math.max(0, totalSteps - 1));
      } else if (e.key === "i" || e.key === "I") {
        if (!e.metaKey && !e.ctrlKey) {
          setIsInspectorOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, stepBackward, stepForward, seekToStep, totalSteps]);

  const getStepIcon = (type) => {
    switch (type) {
      case "user_input":
        return <User className="w-3.5 h-3.5 text-amber-400" />;
      case "thought":
        return <Brain className="w-3.5 h-3.5 text-cyan-400" />;
      case "file_write":
        return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
      case "tool_call":
        return <Wrench className="w-3.5 h-3.5 text-[#007acc]" />;
      case "finish":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className={`relative flex flex-col h-full w-full overflow-hidden ${className}`}>
      {/* Top Replay Mode Status Bar */}
      <div className="h-9 min-h-[36px] bg-[#1a1f2c]/90 border-b border-[#2d3748] px-3 flex items-center justify-between z-30 select-none backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>

          <Badge variant="type" badgeSize="xs" className="font-mono uppercase font-bold tracking-wider">
            Time-Machine Replay
          </Badge>

          <span className="text-slate-500 text-xs hidden sm:inline">•</span>

          <span className="text-xs text-slate-300 font-mono truncate max-w-[200px]" title={sessionInfo?.id}>
            {sessionInfo?.id ? `${sessionInfo.id.slice(0, 16)}...` : "Phiên làm việc"}
          </span>

          {sessionInfo?.model && (
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              ({sessionInfo.model})
            </span>
          )}
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setIsInspectorOpen(true)}
            leftIcon={<SlidersHorizontal className="w-3 h-3 text-cyan-400" />}
            title="Mở bảng chi tiết sự kiện và tham số (Phím I)"
          >
            Chi Tiết Bước
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={onExit}
            leftIcon={<X className="w-3.5 h-3.5" />}
            className="text-slate-400 hover:text-white hover:bg-rose-950/40 hover:border-rose-500/40"
            title="Thoát chế độ Replay và trở về thời gian thực"
          >
            Thoát Replay
          </Button>
        </div>
      </div>

      {/* Main View Area with Floating Agent Bubble */}
      <div className="relative flex-1 overflow-hidden">
        {children}

        {/* Floating Agent Speech Bubble HUD */}
        {currentKeyframe && (
          <div className="absolute top-3 right-3 z-20 max-w-sm pointer-events-auto">
            <div className="bg-[#18181b]/90 border border-[#3f3f46] rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transition-all">
              {/* Bubble Header */}
              <div
                onClick={() => setIsBubbleExpanded(!isBubbleExpanded)}
                className="px-3 py-2 bg-[#27272a]/70 flex items-center justify-between cursor-pointer hover:bg-[#27272a] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getStepIcon(currentKeyframe.type)}
                  <span className="text-xs font-semibold text-white truncate">
                    {currentKeyframe.title || "Agent Activity"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[10px] font-mono">
                    {currentStepIndex + 1}/{totalSteps}
                  </span>
                  {isBubbleExpanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </div>

              {/* Bubble Body */}
              {isBubbleExpanded && (
                <div className="p-3 space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {currentKeyframe.summary || currentKeyframe.content?.slice(0, 150) || "Đang thực thi nhiệm vụ..."}
                  </p>

                  {/* Active Tool Badge */}
                  {currentKeyframe.activeTool && (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-[#27272a] text-[11px] font-mono text-cyan-400">
                      <Wrench className="w-3 h-3 text-[#007acc]" />
                      <span className="truncate">{currentKeyframe.activeTool}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Time-Machine Toolbar */}
      <TimeMachineToolbar
        replay={replay}
        onClose={onExit}
        className="z-30 shrink-0"
      />

      {/* Replay Event Inspector Modal */}
      <ReplayEventInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        replay={replay}
      />
    </div>
  );
}
