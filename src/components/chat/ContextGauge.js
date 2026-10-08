"use client";

import React, { useState } from "react";
import { 
  Gauge, 
  Layers, 
  Database, 
  Zap, 
  Sparkles, 
  TrendingDown, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Server
} from "lucide-react";

/**
 * ContextGauge Component
 * Hiển thị thước đo trực quan context window usage của AI Agent:
 * - Stacked visual bar: Cache vs Prompt vs Output tokens
 * - % dung lượng ngữ cảnh đã tiêu thụ trên model limit (2M, 1M, 200k, 128k)
 * - Cache Hit Ratio & Hiệu quả tiết kiệm chi phí
 * - Hỗ trợ compact mode và expanded breakdown
 */
export default function ContextGauge({
  inputTokens = 0,
  outputTokens = 0,
  cachedTokens = 0,
  model = "gemini-2.5-pro",
  maxContextLimit = null,
  compact = false,
  className = ""
}) {
  const [expanded, setExpanded] = useState(false);

  // Xác định limit mặc định dựa theo model name nếu không truyền maxContextLimit
  const getModelLimit = () => {
    if (maxContextLimit && maxContextLimit > 0) return maxContextLimit;
    const m = (model || "").toLowerCase();
    if (m.includes("gemini") && (m.includes("pro") || m.includes("2.5") || m.includes("1.5"))) {
      return 2097152; // 2M tokens
    }
    if (m.includes("gemini") && m.includes("flash")) {
      return 1048576; // 1M tokens
    }
    if (m.includes("claude-3-5") || m.includes("claude-3-7") || m.includes("claude-3-opus")) {
      return 200000; // 200k tokens
    }
    if (m.includes("gpt-4o") || m.includes("o1") || m.includes("o3")) {
      return 128000; // 128k tokens
    }
    if (m.includes("deepseek") || m.includes("qwen")) {
      return 131072; // 128k tokens
    }
    return 1048576; // Mặc định 1M tokens
  };

  const limit = getModelLimit();
  const safeInput = Math.max(0, inputTokens || 0);
  const safeOutput = Math.max(0, outputTokens || 0);
  const safeCached = Math.max(0, cachedTokens || 0);
  const totalTokens = safeInput + safeOutput + safeCached;

  const usedRatio = Math.min(100, Math.max(0, (totalTokens / limit) * 100));
  const cachedRatio = Math.min(100, (safeCached / limit) * 100);
  const inputRatio = Math.min(100 - cachedRatio, (safeInput / limit) * 100);
  const outputRatio = Math.min(100 - cachedRatio - inputRatio, (safeOutput / limit) * 100);

  // Cache hit percentage
  const totalPromptTokens = safeInput + safeCached;
  const cacheHitPercent = totalPromptTokens > 0 
    ? Math.round((safeCached / totalPromptTokens) * 100) 
    : 0;

  const formatTokens = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(2) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "k";
    return val.toLocaleString();
  };

  // Color threshold indicator
  const getStatusColor = () => {
    if (usedRatio > 85) return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    if (usedRatio > 60) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  };

  if (compact) {
    return (
      <div 
        onClick={() => setExpanded(!expanded)}
        className={`relative inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border cursor-pointer select-none transition-all hover:brightness-110 ${getStatusColor()} ${className}`}
        title={`Context Window: ${formatTokens(totalTokens)} / ${formatTokens(limit)} tokens (${usedRatio.toFixed(1)}%)`}
      >
        <Gauge className="w-3.5 h-3.5 text-current" />
        <span className="font-semibold text-slate-200">
          {usedRatio.toFixed(1)}%
        </span>
        <span className="text-[10px] text-slate-400">
          ({formatTokens(totalTokens)}/{formatTokens(limit)})
        </span>
        {cacheHitPercent > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-sans">
            <Zap className="w-2.5 h-2.5 text-indigo-400" />
            {cacheHitPercent}% cache
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 text-xs shadow-lg backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span>Context Window</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                {model}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {formatTokens(totalTokens)} / {formatTokens(limit)} ({usedRatio.toFixed(1)}% full)
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800/80 transition-colors"
          title={expanded ? "Thu gọn chi tiết" : "Xem chi tiết phân bổ tokens"}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden flex border border-slate-800/90 p-[1px] mb-2.5">
        {/* Cached tokens (Indigo) */}
        {cachedRatio > 0 && (
          <div 
            style={{ width: `${Math.max(cachedRatio, 0.8)}%` }} 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 relative group"
            title={`Cached: ${formatTokens(safeCached)} tokens`}
          />
        )}
        {/* Input tokens (Cyan / Sky) */}
        {inputRatio > 0 && (
          <div 
            style={{ width: `${Math.max(inputRatio, 0.8)}%` }} 
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300 relative group"
            title={`Prompt Input: ${formatTokens(safeInput)} tokens`}
          />
        )}
        {/* Output tokens (Emerald) */}
        {outputRatio > 0 && (
          <div 
            style={{ width: `${Math.max(outputRatio, 0.8)}%` }} 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 relative group"
            title={`Generated Output: ${formatTokens(safeOutput)} tokens`}
          />
        )}
      </div>

      {/* Legend & Stats Quick Row */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block shrink-0" />
          <span className="text-slate-400">Cache:</span>
          <span className="font-semibold text-indigo-300">{formatTokens(safeCached)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shrink-0" />
          <span className="text-slate-400">Input:</span>
          <span className="font-semibold text-sky-300">{formatTokens(safeInput)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
          <span className="text-slate-400">Output:</span>
          <span className="font-semibold text-emerald-300">{formatTokens(safeOutput)}</span>
        </div>
      </div>

      {/* Expandable Deep Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 animate-fadeIn">
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Prompt Cache Hit Rate
              </span>
              <span className="font-mono font-semibold text-indigo-300">
                {cacheHitPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                Remaining Window
              </span>
              <span className="font-mono text-slate-300">
                {formatTokens(Math.max(0, limit - totalTokens))} tokens
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                Context Limit Ceiling
              </span>
              <span className="font-mono text-slate-300">
                {limit.toLocaleString()} tokens
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 italic">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>Cache giúp AI đọc lại toàn bộ mã nguồn và lịch sử với chi phí và độ trễ cực thấp.</span>
          </div>
        </div>
      )}
    </div>
  );
}
