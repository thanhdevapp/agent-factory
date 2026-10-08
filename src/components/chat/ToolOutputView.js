"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Image as ImageIcon } from "lucide-react";

export default function ToolOutputView({ output = "", onImageClick }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!output || typeof output !== "string") return null;

  // 200KB safeguard
  const isTooLarge = output.length > 200_000;
  const safeOutput = isTooLarge ? output.slice(0, 200_000) + "\n\n...[OUTPUT TRUNCATED: Exceeded 200KB safeguard]..." : output;

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
    <div className="mt-2 rounded border border-slate-800 bg-black/80 overflow-hidden text-xs font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>Output ({totalLines} lines)</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
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

      {/* Detected Image Thumbnails / Chips */}
      {imageMatches.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[11px]">
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

      {/* Output text */}
      <pre className="p-2.5 text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-72 overflow-y-auto whitespace-pre font-mono">
        {displayedText}
      </pre>

      {/* Expand/Collapse Footer */}
      {hasManyLines && (
        <div className="px-2.5 py-1 bg-slate-950/90 border-t border-slate-800 text-center">
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
