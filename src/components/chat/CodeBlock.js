"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markdown";

export default function CodeBlock({ language = "text", code = "" }) {
  const [copied, setCopied] = useState(false);

  const cleanLang = language.toLowerCase().replace(/^language-/, "");
  const validLang = Prism.languages[cleanLang] ? cleanLang : "text";

  let highlighted = code;
  try {
    if (Prism.languages[validLang]) {
      highlighted = Prism.highlight(code, Prism.languages[validLang], validLang);
    }
  } catch {
    highlighted = code;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-3 rounded-lg border border-slate-700/80 bg-slate-950 overflow-hidden shadow-md text-xs font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-slate-300">
          {cleanLang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors text-slate-400"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed font-mono whitespace-pre text-[12px]">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
