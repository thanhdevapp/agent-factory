"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Columns, AlignJustify, FileDiff } from "lucide-react";
import * as Diff from "diff";

export default function DiffViewer({
  oldText = "",
  newText = "",
  diffText = "",
  filePath = "",
}) {
  const [viewMode, setViewMode] = useState("unified"); // "unified" | "split"
  const [copied, setCopied] = useState(false);

  // Compute line diff
  const { lineDiffs, stats, splitLines } = useMemo(() => {
    let oldStr = oldText;
    let newStr = newText;

    // If diffText provided, parse it or reconstruct
    if (diffText && !oldText && !newText) {
      const lines = diffText.split("\n");
      const oldArr = [];
      const newArr = [];
      for (const line of lines) {
        if (line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@")) continue;
        if (line.startsWith("-")) {
          oldArr.push(line.slice(1));
        } else if (line.startsWith("+")) {
          newArr.push(line.slice(1));
        } else {
          const content = line.startsWith(" ") ? line.slice(1) : line;
          oldArr.push(content);
          newArr.push(content);
        }
      }
      oldStr = oldArr.join("\n");
      newStr = newArr.join("\n");
    }

    const changes = Diff.diffLines(oldStr, newStr);
    let additions = 0;
    let deletions = 0;

    let oldLineNum = 1;
    let newLineNum = 1;

    const formattedLines = [];
    const splitLeft = [];
    const splitRight = [];

    for (const part of changes) {
      const lines = part.value.replace(/\n$/, "").split("\n");
      if (part.added) {
        additions += lines.length;
        for (const l of lines) {
          formattedLines.push({
            type: "add",
            oldNum: "",
            newNum: newLineNum++,
            content: l,
          });
          splitRight.push({
            type: "add",
            num: newLineNum - 1,
            content: l,
          });
        }
      } else if (part.removed) {
        deletions += lines.length;
        for (const l of lines) {
          formattedLines.push({
            type: "del",
            oldNum: oldLineNum++,
            newNum: "",
            content: l,
          });
          splitLeft.push({
            type: "del",
            num: oldLineNum - 1,
            content: l,
          });
        }
      } else {
        for (const l of lines) {
          formattedLines.push({
            type: "normal",
            oldNum: oldLineNum++,
            newNum: newLineNum++,
            content: l,
          });
          splitLeft.push({
            type: "normal",
            num: oldLineNum - 1,
            content: l,
          });
          splitRight.push({
            type: "normal",
            num: newLineNum - 1,
            content: l,
          });
        }
      }
    }

    // Balance split columns length
    const maxLen = Math.max(splitLeft.length, splitRight.length);
    while (splitLeft.length < maxLen) splitLeft.push({ type: "empty" });
    while (splitRight.length < maxLen) splitRight.push({ type: "empty" });

    return {
      lineDiffs: formattedLines,
      stats: { additions, deletions },
      splitLines: { left: splitLeft, right: splitRight },
    };
  }, [oldText, newText, diffText]);

  const handleCopyUnified = async () => {
    try {
      const textToCopy =
        diffText ||
        lineDiffs
          .map((l) => `${l.type === "add" ? "+" : l.type === "del" ? "-" : " "} ${l.content}`)
          .join("\n");
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2 rounded-xl border border-slate-800 bg-[#080c14] overflow-hidden shadow-lg font-mono text-[11px]">
      {/* Diff Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <FileDiff className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          {filePath && (
            <span className="text-slate-200 font-semibold truncate text-[11px]">{filePath}</span>
          )}
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold">
              +{stats.additions}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-400 border border-rose-800/60 font-bold">
              -{stats.deletions}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mode Switcher */}
          <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode("unified")}
              title="Unified View (Inline)"
              className={`p-1 rounded flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                viewMode === "unified"
                  ? "bg-slate-800 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlignJustify className="w-3 h-3" />
              <span>Unified</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              title="Split View (Side-by-side)"
              className={`p-1 rounded flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                viewMode === "split"
                  ? "bg-slate-800 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Columns className="w-3 h-3" />
              <span>Split</span>
            </button>
          </div>

          <button
            onClick={handleCopyUnified}
            title="Copy Unified Diff"
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-[10px]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Diff Body */}
      {viewMode === "unified" ? (
        <div className="overflow-x-auto max-h-[380px] divide-y divide-slate-900/60">
          {lineDiffs.map((line, idx) => {
            const isAdd = line.type === "add";
            const isDel = line.type === "del";

            return (
              <div
                key={idx}
                className={`flex items-start px-2 py-0.5 leading-5 select-text ${
                  isAdd
                    ? "bg-emerald-950/30 text-emerald-300"
                    : isDel
                    ? "bg-rose-950/30 text-rose-300"
                    : "text-slate-400 hover:bg-slate-900/40"
                }`}
              >
                {/* Old line num */}
                <span className="w-9 shrink-0 text-right pr-2 text-slate-600 select-none">
                  {line.oldNum}
                </span>
                {/* New line num */}
                <span className="w-9 shrink-0 text-right pr-2 text-slate-600 select-none">
                  {line.newNum}
                </span>
                {/* Prefix */}
                <span
                  className={`w-4 shrink-0 text-center font-bold select-none ${
                    isAdd ? "text-emerald-400" : isDel ? "text-rose-400" : "text-slate-600"
                  }`}
                >
                  {isAdd ? "+" : isDel ? "-" : " "}
                </span>
                {/* Line text */}
                <span className="flex-1 whitespace-pre break-all">{line.content || " "}</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Split Side-by-Side View */
        <div className="grid grid-cols-2 divide-x divide-slate-800 overflow-x-auto max-h-[380px]">
          {/* Left: Original */}
          <div className="divide-y divide-slate-900/50">
            {splitLines.left.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-start px-2 py-0.5 leading-5 select-text min-h-[20px] ${
                  line.type === "del"
                    ? "bg-rose-950/30 text-rose-300"
                    : line.type === "empty"
                    ? "bg-slate-950/60"
                    : "text-slate-400"
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-2 text-slate-600 select-none text-[10px]">
                  {line.num || ""}
                </span>
                <span className="w-3 shrink-0 text-center text-rose-400 select-none">
                  {line.type === "del" ? "-" : ""}
                </span>
                <span className="flex-1 whitespace-pre break-all text-[11px]">{line.content || " "}</span>
              </div>
            ))}
          </div>

          {/* Right: Modified */}
          <div className="divide-y divide-slate-900/50">
            {splitLines.right.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-start px-2 py-0.5 leading-5 select-text min-h-[20px] ${
                  line.type === "add"
                    ? "bg-emerald-950/30 text-emerald-300"
                    : line.type === "empty"
                    ? "bg-slate-950/60"
                    : "text-slate-400"
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-2 text-slate-600 select-none text-[10px]">
                  {line.num || ""}
                </span>
                <span className="w-3 shrink-0 text-center text-emerald-400 select-none">
                  {line.type === "add" ? "+" : ""}
                </span>
                <span className="flex-1 whitespace-pre break-all text-[11px]">{line.content || " "}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
