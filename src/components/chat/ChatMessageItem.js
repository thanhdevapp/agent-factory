"use client";

import { User, Bot, Maximize2 } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.js";
import ThinkingAccordion from "./ThinkingAccordion.js";
import ToolCallCard from "./ToolCallCard.js";
import TurnTokensBadge from "./TurnTokensBadge.js";

function formatTime(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
  } catch {
    // fallback
  }
  return String(ts).slice(11, 19);
}

export default function ChatMessageItem({ turn, agentColor = "38bdf8", filter = "all", onImageClick }) {
  if (!turn) return null;

  const isUser = turn.role === "user";
  const hexColor = `#${String(agentColor || "38bdf8").replace(/^#/, "")}`;

  // Filter conditions
  if (filter === "prompts" && !isUser) return null;
  if (filter === "tools" && (!turn.toolCalls || turn.toolCalls.length === 0)) return null;
  if (filter === "thinking" && (!turn.thinking || !turn.thinking.trim())) return null;

  if (isUser) {
    return (
      <div 
        id={`chat-turn-${turn.id}`}
        className="flex gap-3 justify-end my-4 animate-in fade-in slide-in-from-bottom-1 scroll-mt-20"
      >
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[var(--bg-chat-user)] border border-[var(--border-chat-user)] p-3.5 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-[var(--text-chat-user)]">
            <span className="font-semibold uppercase tracking-wider">User Request</span>
            <span className="font-mono text-[10px] opacity-75">{formatTime(turn.timestamp)}</span>
          </div>
          <div className="text-[var(--text-chat-user-body)] text-sm whitespace-pre-wrap leading-relaxed">
            {turn.content}
          </div>

          {/* User Attached Media / Images */}
          {Array.isArray(turn.media) && turn.media.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[var(--border-chat-user)]">
              {turn.media.map((med, mIdx) => {
                const src = med.uri
                  ? `/api/media?path=${encodeURIComponent(med.uri)}`
                  : med.url || "";
                return (
                  <div
                    key={mIdx}
                    onClick={() => onImageClick?.({ src, alt: `User Attachment ${mIdx + 1}` })}
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-[var(--border-chat-user)] bg-black/40 shadow hover:border-[var(--accent-secondary)] transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Attachment ${mIdx + 1}`}
                      className="h-24 w-24 object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-cyan-300">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-chat-user)] border border-[var(--border-chat-user)] flex items-center justify-center shrink-0 shadow-md text-[var(--text-chat-user)]">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant turn
  const showThinking = (filter === "all" || filter === "thinking") && turn.thinking;
  const showTools = (filter === "all" || filter === "tools") && Array.isArray(turn.toolCalls) && turn.toolCalls.length > 0;
  const showResponse = (filter === "all" || filter === "prompts") && turn.content;

  return (
    <div 
      id={`chat-turn-${turn.id}`}
      className="flex gap-3 my-4 animate-in fade-in slide-in-from-bottom-1 scroll-mt-20"
    >
      <div
        className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 shadow-md"
        style={{ borderColor: hexColor, backgroundColor: `${hexColor}20` }}
      >
        <Bot className="w-4 h-4" style={{ color: hexColor }} />
      </div>

      <div className="flex-1 min-w-0 max-w-[92%] rounded-2xl rounded-tl-sm bg-[var(--bg-chat-agent)] border border-[var(--border-chat-agent)] p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--border-subtle)] text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text-bright)]">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: hexColor }}
            />
            <span>Agent Assistant</span>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">{formatTime(turn.timestamp)}</span>
        </div>

        {/* 1. Thinking / Chain of Thought */}
        {showThinking && (
          <ThinkingAccordion thinking={turn.thinking} />
        )}

        {/* 2. Tool Calls */}
        {showTools && (
          <div className="my-2 space-y-1">
            {turn.toolCalls.map((tool) => (
              <ToolCallCard key={tool.id} tool={tool} onImageClick={onImageClick} />
            ))}
          </div>
        )}

        {/* 3. Assistant Attached Media / Images */}
        {Array.isArray(turn.media) && turn.media.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2.5">
            {turn.media.map((med, mIdx) => {
              const src = med.uri
                ? `/api/media?path=${encodeURIComponent(med.uri)}`
                : med.url || "";
              return (
                <div
                  key={mIdx}
                  onClick={() => onImageClick?.({ src, alt: `Agent Image ${mIdx + 1}` })}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-700 bg-black/60 shadow hover:border-cyan-500/60 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Agent Image ${mIdx + 1}`}
                    className="h-28 w-28 object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-cyan-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Final Content / Markdown Response */}
        {showResponse && (
          <div className="mt-2.5">
            <MarkdownRenderer content={turn.content} onImageClick={onImageClick} />
          </div>
        )}

        {/* 5. Tokens Badge */}
        <TurnTokensBadge tokens={turn.tokens} />
      </div>
    </div>
  );
}
