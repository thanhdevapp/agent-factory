"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronUp, ChevronDown, Filter } from "lucide-react";

/**
 * SessionSearch Component
 * Hộp công cụ tìm kiếm từ khóa nội bộ trong toàn bộ transcript phiên chat AI Agent
 * - Hỗ trợ jump Next / Previous match
 * - Đếm số lượng kết quả
 * - Phím tắt Enter, Shift+Enter, Escape
 * - Tự động focus và trigger scroll đến step tương ứng
 */
export default function SessionSearch({
  isOpen = false,
  onClose,
  steps = [],
  onJumpToStep,
  className = ""
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [matches, setMatches] = useState([]); // mảng các stepIndex khớp
  const [currentIndex, setCurrentIndex] = useState(-1);
  const inputRef = useRef(null);

  // Focus khi modal search mở
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setSearchTerm("");
      setMatches([]);
      setCurrentIndex(-1);
    }
  }, [isOpen]);

  // Tìm kiếm trong toàn bộ các field của steps
  useEffect(() => {
    if (!searchTerm.trim()) {
      setMatches([]);
      setCurrentIndex(-1);
      return;
    }

    const term = searchTerm.toLowerCase();
    const matchedStepIndices = [];

    steps.forEach((step, idx) => {
      let isMatch = false;

      // Check content
      if (typeof step.content === "string" && step.content.toLowerCase().includes(term)) {
        isMatch = true;
      }

      // Check thinking
      if (!isMatch && typeof step.thinking === "string" && step.thinking.toLowerCase().includes(term)) {
        isMatch = true;
      }

      // Check tool_calls
      if (!isMatch && Array.isArray(step.tool_calls)) {
        for (const tc of step.tool_calls) {
          if (tc.toolName?.toLowerCase().includes(term)) {
            isMatch = true;
            break;
          }
          if (tc.description?.toLowerCase().includes(term)) {
            isMatch = true;
            break;
          }
          if (typeof tc.args === "string" && tc.args.toLowerCase().includes(term)) {
            isMatch = true;
            break;
          }
        }
      }

      // Check tool output / error
      if (!isMatch && step.output && typeof step.output === "string" && step.output.toLowerCase().includes(term)) {
        isMatch = true;
      }

      if (isMatch) {
        matchedStepIndices.push(idx);
      }
    });

    setMatches(matchedStepIndices);
    if (matchedStepIndices.length > 0) {
      setCurrentIndex(0);
      onJumpToStep?.(matchedStepIndices[0]);
    } else {
      setCurrentIndex(-1);
    }
  }, [searchTerm, steps]);

  const handleNext = () => {
    if (matches.length === 0) return;
    const next = (currentIndex + 1) % matches.length;
    setCurrentIndex(next);
    onJumpToStep?.(matches[next]);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    const prev = (currentIndex - 1 + matches.length) % matches.length;
    setCurrentIndex(prev);
    onJumpToStep?.(matches[prev]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`flex items-center gap-1.5 bg-slate-900/95 border border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-2xl backdrop-blur-md animate-fadeIn z-30 ${className}`}>
      <Search className="w-4 h-4 text-slate-400 shrink-0" />
      
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm trong đoạn chat (nội dung, code, tool)..."
        className="bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-56 md:w-64"
      />

      {/* Match Counter */}
      {searchTerm.trim() && (
        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
          {matches.length > 0 ? `${currentIndex + 1}/${matches.length}` : "0 kết quả"}
        </span>
      )}

      {/* Prev / Next controls */}
      <div className="flex items-center border-l border-slate-800 pl-1.5 gap-0.5">
        <button
          onClick={handlePrev}
          disabled={matches.length <= 1}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Kết quả trước (Shift+Enter)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          disabled={matches.length <= 1}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Kết quả tiếp theo (Enter)"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors ml-1"
        title="Đóng tìm kiếm (Esc)"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
