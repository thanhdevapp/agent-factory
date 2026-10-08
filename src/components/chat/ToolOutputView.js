"use client";

import { useState, useMemo } from "react";
import { 
  Check, 
  Copy, 
  Terminal, 
  Image as ImageIcon, 
  Braces, 
  AlignLeft 
} from "lucide-react";
import JsonInspector from "./JsonInspector.js";

export default function ToolOutputView({ output = "", onImageClick }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState("raw"); // "raw" | "json"

  // Check if output is valid JSON
  const parsedJson = useMemo(() => {
    if (!output || typeof output !== "string") return null;
    const trimmed = output.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || 
        (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return null;
      }
    }
    return null;
  }, [output]);

  if (!output || typeof output !== "string") return null;

  // 200KB safeguard
  const isTooLarge = output.length > 200_000;
  const safeOutput = isTooLarge 
    ? output.slice(0, 200_000) + "\n\n...[OUTPUT TRUNCATED: Exceeded 200KB safeguard]..." 
    : output;

  const lines = safeOutput.split("\n");
  const totalLines = lines.length;
  const hasManyLines = totalLines > 50;

  // Detect image paths in output
  const imageMatches = [...new Set(
    [...output.matchAll(/(?:(?:\/|\.\/|file:\/\/)[^\s"']+\.(?:png|jpe?g|gif|webp|svg|bmp)|[a-zA-Z0-9_\-]+\.(?:png|jpe?g|gif|webp|svg|bmp))/gi)]
      .map(m => m[0].replace(/^file:\/\//, ""))
  )].slice(0, 5);

  const displayedText = hasManyLines && !expanded
    ? lines.slice(0, 50).join("\n")
    : safeOutput;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden text-xs font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium text-slate-300">Tool Output</span>
          <span className="text-[10px] text-slate-500 font-mono">({totalLines} lines)</span>
        </div>

        <div className="flex items-center gap-1.5 font-sans">
          {/* JSON Tree vs Raw Text Switcher */}
          {parsedJson && (
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 mr-1">
              <button
                onClick={() => setViewMode("raw")}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors ${
                  viewMode === "raw" 
                    ? "bg-slate-800 text-slate-200" 
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <AlignLeft className="w-3 h-3" />
                <span>Raw</span>
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors ${
                  viewMode === "json" 
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40" 
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Braces className="w-3 h-3 text-indigo-400" />
                <span>JSON Tree</span>
              </button>
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800/80"
            title="Copy output"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Detected Image Thumbnails / Chips */}
      {imageMatches.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-slate-900/40 border-b border-slate-800/80 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Image output:</span>
          </span>
          {imageMatches.map((imgP, i) => (
            <button
              key={i}
              onClick={() => onImageClick?.({
                src: `/api/media?path=${encodeURIComponent(imgP)}`,
                alt: imgP.split("/").pop()
              })}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-mono transition-colors text-[10px]"
              title="Click to view full image popup"
            >
              <span>{imgP.split("/").pop()}</span>
            </button>
          ))}
        </div>
      )}

      {/* JSON Inspector View */}
      {parsedJson && viewMode === "json" ? (
        <div className="p-2 bg-black/60">
          <JsonInspector data={parsedJson} title="JSON Output View" />
        </div>
      ) : (
        /* Raw Output text */
        <pre className="p-3 text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-80 overflow-y-auto whitespace-pre font-mono">
          {displayedText}
        </pre>
      )}

      {/* Expand/Collapse Footer for Raw View */}
      {viewMode === "raw" && hasManyLines && (
        <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            {expanded ? "Show less (first 50 lines)" : `Show all ${totalLines} lines`}
          </button>
        </div>
      )}
    </div>
  );
}
