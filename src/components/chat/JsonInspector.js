"use client";

import React, { useState, useMemo } from "react";
import { 
  Braces, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Maximize2, 
  Minimize2,
  ListFilter
} from "lucide-react";

/**
 * JsonNode Component - Render đệ quy từng node của JSON
 */
function JsonNode({ keyName, value, depth = 0, initialExpandDepth = 1, searchTerm = "" }) {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  // Mặc định mở nếu depth < initialExpandDepth
  const [isExpanded, setIsExpanded] = useState(depth < initialExpandDepth);
  const [copied, setCopied] = useState(false);

  const keys = useMemo(() => {
    if (!isObject) return [];
    return Object.keys(value);
  }, [isObject, value]);

  const handleCopy = (e) => {
    e.stopPropagation();
    try {
      const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Render kiểu dữ liệu nguyên thủy
  const renderPrimitive = (val) => {
    if (val === null) return <span className="text-slate-500 italic">null</span>;
    if (typeof val === "boolean") return <span className="text-purple-400 font-semibold">{val ? "true" : "false"}</span>;
    if (typeof val === "number") return <span className="text-amber-400 font-mono">{val}</span>;
    if (typeof val === "string") {
      // Cắt gọn nếu string quá dài
      const displayStr = val.length > 300 && !isExpanded ? `${val.substring(0, 300)}...` : val;
      return (
        <span className="text-emerald-300 font-mono break-all">
          &quot;{displayStr}&quot;
          {val.length > 300 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="ml-1 text-[10px] text-indigo-400 underline hover:text-indigo-300"
            >
              {isExpanded ? "rút gọn" : `+${val.length - 300} ký tự`}
            </button>
          )}
        </span>
      );
    }
    return <span className="text-slate-300">{String(val)}</span>;
  };

  // Nếu là Object hoặc Array
  if (isObject) {
    const itemCount = isArray ? value.length : keys.length;
    const bracketOpen = isArray ? "[" : "{";
    const bracketClose = isArray ? "]" : "}";

    // Kiểm tra search filter
    const matchesSearch = searchTerm && (
      (keyName && keyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className={`my-0.5 text-xs font-mono leading-relaxed select-text ${matchesSearch ? "bg-indigo-500/10 rounded px-1" : ""}`}>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-1 cursor-pointer py-0.5 hover:bg-slate-800/50 rounded px-1 transition-colors w-fit"
        >
          {/* Collapse icon */}
          <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>

          {/* Key name */}
          {keyName !== undefined && (
            <span className="text-sky-300 font-medium">
              &quot;{keyName}&quot;<span className="text-slate-500">: </span>
            </span>
          )}

          {/* Type preview */}
          <span className="text-slate-400 font-mono">
            {bracketOpen}
            {!isExpanded && (
              <span className="text-[11px] text-slate-500 italic mx-1">
                {isArray ? `${itemCount} items` : `${itemCount} keys`}
              </span>
            )}
            {!isExpanded && bracketClose}
          </span>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-200 rounded transition-opacity ml-1"
            title="Sao chép nhánh này"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Children nodes */}
        {isExpanded && (
          <div className="pl-4 border-l border-slate-800 ml-2 space-y-0.5">
            {keys.map((k) => (
              <JsonNode
                key={k}
                keyName={isArray ? undefined : k}
                value={value[k]}
                depth={depth + 1}
                initialExpandDepth={initialExpandDepth}
                searchTerm={searchTerm}
              />
            ))}
            <div className="text-slate-400 py-0.5">{bracketClose}</div>
          </div>
        )}
      </div>
    );
  }

  // Primitive value
  return (
    <div className="flex items-start gap-1 py-0.5 px-1 hover:bg-slate-800/40 rounded text-xs font-mono leading-relaxed select-text group">
      <span className="w-3.5 inline-block shrink-0" />
      {keyName !== undefined && (
        <span className="text-sky-300 font-medium shrink-0">
          &quot;{keyName}&quot;<span className="text-slate-500">: </span>
        </span>
      )}
      <div className="min-w-0 flex-1">{renderPrimitive(value)}</div>

      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-200 rounded transition-opacity shrink-0 ml-1"
        title="Sao chép giá trị"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

/**
 * JsonInspector Component
 * Tree explorer chuyên nghiệp cho dữ liệu JSON của Tool Call, MCP Response hoặc API payloads
 */
export default function JsonInspector({
  data,
  initialExpandDepth = 2,
  title = "Payload JSON",
  className = ""
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [expandAllKey, setExpandAllKey] = useState(initialExpandDepth);

  // Parse if string
  const parsedData = useMemo(() => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        return { raw: data };
      }
    }
    return data;
  }, [data]);

  const handleCopyAll = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  if (parsedData === undefined || parsedData === null) {
    return <span className="text-xs text-slate-500 italic font-mono">null</span>;
  }

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden text-xs ${className}`}>
      {/* Top action toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Braces className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-slate-300 font-sans">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick search input */}
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-slate-500 absolute left-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Lọc key..."
              className="bg-slate-950 border border-slate-800 rounded-md pl-6 pr-2 py-0.5 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 w-28 md:w-36 font-sans"
            />
          </div>

          {/* Toggle Expand all */}
          <button
            onClick={() => setExpandAllKey((prev) => (prev > 5 ? 1 : 10))}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={expandAllKey > 5 ? "Thu gọn toàn bộ" : "Mở rộng toàn bộ"}
          >
            {expandAllKey > 5 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Copy all */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Sao chép toàn bộ JSON"
          >
            {copiedAll ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Đã copy</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* JSON Content Tree */}
      <div className="p-3 max-h-96 overflow-auto">
        <JsonNode
          key={expandAllKey}
          value={parsedData}
          depth={0}
          initialExpandDepth={expandAllKey}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
