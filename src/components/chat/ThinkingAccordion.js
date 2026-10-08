"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";

export default function ThinkingAccordion({ thinking = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking || !thinking.trim()) return null;

  const wordCount = thinking.trim().split(/\s+/).length;

  return (
    <div className="my-2.5 rounded-lg border border-purple-900/40 bg-purple-950/20 overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-purple-950/30 hover:bg-purple-900/30 transition-colors text-xs text-purple-300 font-medium"
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
        <div className="p-3 text-xs text-purple-200/90 leading-relaxed font-mono whitespace-pre-wrap border-t border-purple-900/30 max-h-96 overflow-y-auto bg-black/40">
          {thinking.trim()}
        </div>
      )}
    </div>
  );
}
