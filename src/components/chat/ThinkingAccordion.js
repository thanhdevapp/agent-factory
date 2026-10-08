"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";

export default function ThinkingAccordion({ thinking = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking || !thinking.trim()) return null;

  const wordCount = thinking.trim().split(/\s+/).length;

  return (
    <div className="my-2.5 rounded-lg border border-purple-500/30 bg-purple-500/10 overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-purple-500/15 hover:bg-purple-500/20 transition-colors text-xs text-purple-400 dark:text-purple-300 font-medium cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>Thought process ({wordCount} words)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-purple-400/80">
          <span>{isOpen ? "Hide" : "Show"}</span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 text-xs text-[var(--text-main)] leading-relaxed font-mono whitespace-pre-wrap border-t border-purple-500/20 max-h-96 overflow-y-auto bg-[var(--bg-chat-code)]">
          {thinking.trim()}
        </div>
      )}
    </div>
  );
}
