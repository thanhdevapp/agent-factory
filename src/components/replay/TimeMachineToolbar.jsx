"use client";

import React, { useState, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Clock,
  Zap,
  DollarSign,
  Wrench,
  FileCode,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
} from "lucide-react";
import { Button, Select, Badge, Tooltip } from "@/components/ui";

function formatSeconds(sec) {
  if (isNaN(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimeMachineToolbar({
  replay,
  onClose,
  className = "",
}) {
  const {
    sessionInfo,
    keyframes = [],
    totalSteps = 0,
    currentStepIndex = 0,
    currentKeyframe,
    currentTime = 0,
    totalElapsedSeconds = 0,
    isPlaying = false,
    playbackSpeed = 2,
    play,
    pause,
    togglePlay,
    seekToStep,
    stepForward,
    stepBackward,
    setPlaybackSpeed,
    reset,
  } = replay;

  const [hoveredStep, setHoveredStep] = useState(null);

  // Speed options
  const speedOptions = [
    { label: "1x", value: 1 },
    { label: "2x", value: 2 },
    { label: "5x", value: 5 },
    { label: "10x", value: 10 },
  ];

  const milestoneDots = useMemo(() => {
    if (totalSteps <= 1) return [];
    return keyframes.map((kf, idx) => {
      const pct = (idx / (totalSteps - 1)) * 100;
      let color = "bg-slate-500";
      if (kf.milestoneType === "prompt") color = "bg-amber-400";
      else if (kf.type === "file_write") color = "bg-purple-400";
      else if (kf.milestoneType === "tool") color = "bg-cyan-400";
      else if (kf.milestoneType === "error") color = "bg-rose-500";
      else if (kf.milestoneType === "finish") color = "bg-emerald-400";

      return {
        idx,
        pct,
        color,
        type: kf.type,
        title: kf.title,
        summary: kf.summary,
      };
    });
  }, [keyframes, totalSteps]);

  if (!keyframes || keyframes.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-[#181818]/95 backdrop-blur-md border-t border-[#3e3e42] p-2 select-none shadow-2xl flex flex-col gap-2 text-slate-200 ${className}`}
      style={{ colorScheme: "dark" }}
    >
      {/* Top Scrubber Track with Milestones */}
      <div className="relative flex flex-col gap-1 px-2 pt-1">
        <div className="relative w-full h-5 flex items-center">
          {/* Milestone Dots */}
          <div className="absolute inset-x-0 h-1 bg-[#252526] rounded-full pointer-events-none overflow-hidden">
            <div
              className="h-full bg-[#007acc] transition-all duration-75"
              style={{
                width: `${totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Dots overlay */}
          <div className="absolute inset-x-0 h-full pointer-events-none flex items-center">
            {milestoneDots.map((dot) => (
              <div
                key={dot.idx}
                className={`absolute w-2 h-2 rounded-full -translate-x-1/2 ${dot.color} transition-transform ${
                  hoveredStep === dot.idx || currentStepIndex === dot.idx
                    ? "scale-150 ring-2 ring-white z-20"
                    : "opacity-80"
                }`}
                style={{ left: `${dot.pct}%` }}
              />
            ))}
          </div>

          {/* Range input slider */}
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => seekToStep(parseInt(e.target.value, 10))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            title="Kéo để tua thời gian"
          />
        </div>

        {/* Current Step Summary Banner */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#007acc] font-bold">
              Bước {currentStepIndex + 1}/{totalSteps}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-white truncate font-sans">
              {currentKeyframe?.title || "Sự kiện"}
            </span>
            {currentKeyframe?.activeTool && (
              <Badge variant="type" badgeSize="xs" className="shrink-0 font-mono">
                {currentKeyframe.activeTool}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span>
              {formatSeconds(currentTime)} / {formatSeconds(totalElapsedSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 border-t border-[#252526] pt-1.5">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={reset}
            title="Tua về đầu phiên (Home)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="icon-sm"
            onClick={stepBackward}
            disabled={currentStepIndex <= 0}
            title="Lùi 1 bước (←)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={togglePlay}
            className="px-3"
            title={isPlaying ? "Tạm dừng (Space)" : "Phát lại (Space)"}
            leftIcon={
              isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )
            }
          >
            {isPlaying ? "Tạm dừng" : "Phát"}
          </Button>

          <Button
            variant="secondary"
            size="icon-sm"
            onClick={stepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Tiến 1 bước (→)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </Button>

          {/* Speed Select */}
          <div className="flex items-center gap-1 pl-2 border-l border-[#333]">
            <span className="text-[10px] text-slate-400 font-medium">Tốc độ:</span>
            <div className="flex items-center bg-[#252526] border border-[#3e3e42] rounded p-0.5 text-[10px]">
              {speedOptions.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setPlaybackSpeed(s.value)}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    playbackSpeed === s.value
                      ? "bg-[#007acc] text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right: Session Metadata & Running Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase text-slate-500">Session:</span>
            <span className="text-white truncate max-w-[140px]" title={sessionInfo?.id}>
              {sessionInfo?.id?.slice(0, 14)}...
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{(currentKeyframe?.cumulativeTokens || 0).toLocaleString()} tks</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300">
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span>${(currentKeyframe?.cumulativeCost || 0).toFixed(4)}</span>
          </div>

          {onClose && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClose}
              className="text-slate-400 hover:text-white ml-1"
              title="Thoát chế độ Replay"
              leftIcon={<X className="w-3 h-3" />}
            >
              Thoát Replay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
