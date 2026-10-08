"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Download, ZoomIn, ZoomOut, Maximize2, Code, Eye, AlertCircle } from "lucide-react";
import CodeBlock from "./CodeBlock.js";

let mermaidInitialized = false;

async function getMermaid() {
  const m = (await import("mermaid")).default;
  if (!mermaidInitialized) {
    m.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#090d16",
        primaryColor: "#0284c7",
        primaryTextColor: "#f1f5f9",
        lineColor: "#38bdf8",
        secondaryColor: "#0f172a",
        tertiaryColor: "#1e293b",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "13px",
      },
      securityLevel: "loose",
    });
    mermaidInitialized = true;
  }
  return m;
}

export default function MermaidBlock({ code = "" }) {
  const [svgHtml, setSvgHtml] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "code"
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);
  const renderId = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!code.trim()) return;
      try {
        setError(null);
        const mermaid = await getMermaid();
        const id = `${renderId.current}-${Date.now()}`;
        const { svg } = await mermaid.render(id, code.trim());
        if (!cancelled) {
          setSvgHtml(svg);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[MermaidBlock] render failed:", err);
          setError(err?.message || "Invalid Mermaid syntax");
          setActiveTab("code");
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagram-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-3 rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-300">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("preview")}
            disabled={Boolean(error)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === "preview"
                ? "bg-slate-800 text-cyan-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            } ${error ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Eye className="w-3 h-3" />
            <span>Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-slate-800 text-cyan-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Mermaid Code</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {activeTab === "preview" && svgHtml && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
                title="Zoom Out"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                title="Reset Zoom (100%)"
                className="px-1.5 py-0.5 rounded-md hover:bg-slate-800 text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
                title="Zoom In"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3.5 bg-slate-800 mx-0.5" />
              <button
                onClick={handleDownloadSvg}
                title="Download SVG Diagram"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={handleCopy}
            title="Copy Mermaid Code"
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="px-3 py-2 bg-rose-950/40 border-b border-rose-900/50 text-rose-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Cannot render diagram: {error}. Showing source code instead.</span>
        </div>
      )}

      {/* Content Area */}
      {activeTab === "preview" && !error ? (
        <div
          ref={containerRef}
          className="p-6 overflow-auto flex items-center justify-center min-h-[180px] bg-[#070b13]"
        >
          {svgHtml ? (
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.15s ease-out" }}
              dangerouslySetInnerHTML={{ __html: svgHtml }}
              className="max-w-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
            />
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
              <Eye className="w-4 h-4" />
              <span>Rendering Mermaid diagram...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-0">
          <CodeBlock language="mermaid" value={code} />
        </div>
      )}
    </div>
  );
}
