"use client";

import { Cpu } from "lucide-react";

function fmtTokens(n) {
  if (!n) return "0";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function TurnTokensBadge({ tokens }) {
  if (!tokens || (!tokens.input && !tokens.output && !tokens.cached)) return null;

  return (
    <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
      <Cpu className="w-3 h-3 text-slate-500" />
      <span>In: {fmtTokens(tokens.input)}</span>
      <span>•</span>
      <span>Out: {fmtTokens(tokens.output)}</span>
      {tokens.cached > 0 && (
        <>
          <span>•</span>
          <span className="text-cyan-500/80">Cached: {fmtTokens(tokens.cached)}</span>
        </>
      )}
    </div>
  );
}
