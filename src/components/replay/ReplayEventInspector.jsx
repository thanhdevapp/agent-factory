"use client";

import React, { useState } from "react";
import {
  Terminal,
  FileCode,
  Brain,
  User,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  DollarSign,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  X,
  Search,
  MessageSquare,
} from "lucide-react";
import { Button, Badge, Modal } from "@/components/ui";

export default function ReplayEventInspector({
  isOpen,
  onClose,
  replay,
  onOpenConversation,
}) {
  const {
    currentKeyframe,
    currentStepIndex = 0,
    totalSteps = 0,
    currentTime = 0,
    totalElapsedSeconds = 0,
    stepBackward,
    stepForward,
    sessionInfo = {},
  } = replay || {};

  const [copied, setCopied] = useState(false);

  if (!isOpen || !currentKeyframe) return null;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeConfig = {
    user_input: {
      label: "User Prompt",
      variant: "warning",
      icon: User,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-500/30",
    },
    thought: {
      label: "AI Chain of Thought",
      variant: "info",
      icon: Brain,
      color: "text-cyan-400",
      bg: "bg-cyan-950/40 border-cyan-500/30",
    },
    tool_call: {
      label: "Tool Call",
      variant: "primary",
      icon: Wrench,
      color: "text-[#007acc]",
      bg: "bg-blue-950/40 border-blue-500/30",
    },
    file_write: {
      label: "File Write / Edit",
      variant: "tool",
      icon: FileCode,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-500/30",
    },
    assistant_reply: {
      label: "Assistant Reply",
      variant: "success",
      icon: Terminal,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/30",
    },
    finish: {
      label: "Session Finished",
      variant: "success",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/30",
    },
  };

  const currentType = typeConfig[currentKeyframe.type] || {
    label: currentKeyframe.type || "Event",
    variant: "default",
    icon: Code2,
    color: "text-slate-400",
    bg: "bg-slate-900 border-slate-800",
  };

  const IconComponent = currentType.icon;
  const isError = currentKeyframe.milestoneType === "error";

  const details = currentKeyframe.details || {};
  const hasArgs = details.args && Object.keys(details.args).length > 0;
  const hasOutput = Boolean(details.output);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${isError ? "text-rose-400" : currentType.color}`} />
          <span className="text-white font-semibold">
            Event Details • Step {currentStepIndex + 1}/{totalSteps}
          </span>
          <Badge
            variant={isError ? "danger" : currentType.variant}
            badgeSize="xs"
            className="uppercase tracking-wider font-mono text-[10px]"
          >
            {isError ? "Error" : currentType.label}
          </Badge>
        </div>
      }
      description={
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            {currentKeyframe.elapsedSeconds}s ({new Date(currentKeyframe.timestamp).toLocaleTimeString()})
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-cyan-400 font-mono">
            <Zap className="w-3 h-3" />
            {(currentKeyframe.cumulativeTokens || 0).toLocaleString()} tokens
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-300 font-mono">
            <DollarSign className="w-3 h-3" />
            ${(currentKeyframe.cumulativeCost || 0).toFixed(4)}
          </span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={stepBackward}
              disabled={currentStepIndex <= 0}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={stepForward}
              disabled={currentStepIndex >= totalSteps - 1}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {onOpenConversation && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenConversation(sessionInfo?.id || replay?.sessionId);
                }}
                leftIcon={<MessageSquare className="w-3.5 h-3.5 text-cyan-400" />}
              >
                View Conversation
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        {/* Title and summary header card */}
        <div className={`p-3 rounded-lg border ${currentType.bg} space-y-1`}>
          <div className="text-xs font-semibold text-white flex items-center justify-between">
            <span>{currentKeyframe.title}</span>
            {currentKeyframe.activeTool && (
              <Badge variant="type" badgeSize="xs" className="font-mono">
                {currentKeyframe.activeTool}
              </Badge>
            )}
          </div>
          {currentKeyframe.summary && (
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentKeyframe.summary}
            </p>
          )}
        </div>

        {/* 1. User Prompt View */}
        {currentKeyframe.type === "user_input" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                User Prompt Message
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopy(currentKeyframe.content)}
                leftIcon={copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-3 bg-[#141414] border border-[#2b2b2b] rounded-lg text-xs font-sans text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {currentKeyframe.content || "No text content."}
            </pre>
          </div>
        )}

        {/* 2. Thinking View */}
        {currentKeyframe.type === "thought" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                AI Reasoning (Chain of Thought)
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopy(currentKeyframe.content)}
                leftIcon={copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-3 bg-[#12161f] border border-cyan-900/40 rounded-lg text-xs font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {currentKeyframe.content}
            </pre>
          </div>
        )}

        {/* 3. Code Modification Diff (for replace_file_content or write_to_file) */}
        {currentKeyframe.type === "file_write" && details.args?.ReplacementContent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                Code Changes (Diff Preview)
              </span>
              {details.targetFile && (
                <span className="text-[10px] font-mono text-purple-300 truncate max-w-[260px]">
                  {details.targetFile}
                </span>
              )}
            </div>

            {/* Target Content (Removed) */}
            {details.args.TargetContent && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  - Original Content (Replaced)
                </span>
                <pre className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {details.args.TargetContent}
                </pre>
              </div>
            )}

            {/* Replacement Content (Added) */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                + New Content (Added)
              </span>
              <pre className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {details.args.ReplacementContent}
              </pre>
            </div>
          </div>
        )}

        {/* 3b. Created File Content (for write_to_file) */}
        {currentKeyframe.type === "file_write" && !details.args?.ReplacementContent && details.args?.CodeContent && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                Created File Content
              </span>
              {details.targetFile && (
                <span className="text-[10px] font-mono text-purple-300 truncate max-w-[260px]">
                  {details.targetFile}
                </span>
              )}
            </div>
            <pre className="p-3 bg-[#101010] border border-purple-500/30 rounded-lg text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {details.args.CodeContent}
            </pre>
          </div>
        )}

        {/* 4. Tool Parameters (Args) */}
        {(currentKeyframe.type === "tool_call" || currentKeyframe.type === "file_write") && hasArgs && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                Arguments ({currentKeyframe.activeTool})
              </span>
              {details.targetFile && (
                <span className="text-[11px] font-mono text-purple-300 truncate max-w-[280px]">
                  {details.targetFile}
                </span>
              )}
            </div>
            <pre className="p-3 bg-[#141414] border border-[#2b2b2b] rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {JSON.stringify(details.args, null, 2)}
            </pre>
          </div>
        )}

        {/* 4. Tool Output / Command Result */}
        {(currentKeyframe.type === "tool_call" || currentKeyframe.type === "file_write") && hasOutput && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Execution Output
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopy(details.output)}
                leftIcon={copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-3 bg-[#101010] border border-[#2b2b2b] rounded-lg text-xs font-mono text-emerald-400/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {details.output}
            </pre>
          </div>
        )}

        {/* 5. Assistant Reply */}
        {currentKeyframe.type === "assistant_reply" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Assistant Response
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopy(currentKeyframe.content)}
                leftIcon={copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-3 bg-[#141414] border border-[#2b2b2b] rounded-lg text-xs font-sans text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {currentKeyframe.content}
            </pre>
          </div>
        )}

        {/* 6. Finish Overview */}
        {currentKeyframe.type === "finish" && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Session Summary
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181818] p-2.5 rounded border border-[#2b2b2b]">
                <span className="text-slate-400 text-[10px] block">TOTAL DURATION</span>
                <span className="font-mono text-white text-sm font-semibold">{totalElapsedSeconds}s</span>
              </div>
              <div className="bg-[#181818] p-2.5 rounded border border-[#2b2b2b]">
                <span className="text-slate-400 text-[10px] block">TOTAL STEPS</span>
                <span className="font-mono text-white text-sm font-semibold">{totalSteps} events</span>
              </div>
              <div className="bg-[#181818] p-2.5 rounded border border-[#2b2b2b]">
                <span className="text-slate-400 text-[10px] block">TOTAL TOKENS</span>
                <span className="font-mono text-cyan-400 text-sm font-semibold">{(currentKeyframe.cumulativeTokens || 0).toLocaleString()}</span>
              </div>
              <div className="bg-[#181818] p-2.5 rounded border border-[#2b2b2b]">
                <span className="text-slate-400 text-[10px] block">ESTIMATED COST</span>
                <span className="font-mono text-amber-300 text-sm font-semibold">${(currentKeyframe.cumulativeCost || 0).toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
