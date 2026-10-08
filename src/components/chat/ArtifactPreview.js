"use client";

import { useState } from "react";
import {
  Code,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import CodeBlock from "./CodeBlock.js";

export default function ArtifactPreview({
  htmlCode = "",
  language = "html",
  title = "HTML Preview",
}) {
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "code"
  const [device, setDevice] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [reloadKey, setReloadKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="my-3 rounded-xl border border-slate-800 bg-[#080d16] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-slate-800 text-cyan-300 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
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
              <span>Code</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 truncate max-w-[180px] hidden sm:inline">
            {title}
          </span>
        </div>

        {/* Viewport & Actions */}
        <div className="flex items-center gap-1.5">
          {activeTab === "preview" && (
            <>
              {/* Responsive Device Switcher */}
              <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setDevice("desktop")}
                  title="Desktop (100%)"
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    device === "desktop" ? "bg-slate-800 text-cyan-300" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice("tablet")}
                  title="Tablet (768px)"
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    device === "tablet" ? "bg-slate-800 text-cyan-300" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice("mobile")}
                  title="Mobile (375px)"
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    device === "mobile" ? "bg-slate-800 text-cyan-300" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reload */}
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                title="Reload Preview"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Open in New Tab */}
              <button
                onClick={handleOpenNewTab}
                title="Open Live in New Tab"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      {activeTab === "preview" ? (
        <div className="p-4 bg-slate-950/80 flex items-center justify-center min-h-[320px] overflow-auto">
          <div
            style={{ width: deviceWidths[device], transition: "width 0.25s ease-out" }}
            className="rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-white"
          >
            <iframe
              key={reloadKey}
              srcDoc={htmlCode}
              title={title}
              sandbox="allow-scripts allow-modals"
              className="w-full h-[400px] border-none bg-white block"
            />
          </div>
        </div>
      ) : (
        <CodeBlock language={language} value={htmlCode} />
      )}
    </div>
  );
}
