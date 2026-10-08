"use client";

import { useState, useMemo, useEffect } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  FileCode,
  SlidersHorizontal,
  LayoutList,
  Brain,
  Terminal,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  generateSessionMarkdown,
  generateSessionHtml,
  triggerDownload,
  copyToClipboard,
} from "../../lib/exportUtils.js";

export default function SessionExportModal({
  isOpen,
  onClose,
  session,
  turns = [],
}) {
  const [format, setFormat] = useState("html"); // "html" | "markdown"
  const [options, setOptions] = useState({
    includeExecutiveSummary: true,
    includeThinking: true,
    includeToolOutputs: false,
    includeTimestamps: true,
  });
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Generate previews using useMemo
  const markdownContent = useMemo(() => {
    if (!isOpen) return "";
    return generateSessionMarkdown(session, turns, options);
  }, [isOpen, session, turns, options]);

  const htmlContent = useMemo(() => {
    if (!isOpen) return "";
    return generateSessionHtml(session, turns, options);
  }, [isOpen, session, turns, options]);

  if (!isOpen) return null;

  const sessionId = session?.id || "session";

  const handleCopy = async () => {
    const textToCopy = format === "html" ? htmlContent : markdownContent;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (format === "html") {
      triggerDownload(`${sessionId}-report.html`, htmlContent, "text/html");
    } else {
      triggerDownload(`${sessionId}-report.md`, markdownContent, "text/markdown");
    }
  };

  const handlePrint = () => {
    // Open a temporary print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl h-[85vh] max-h-[850px] flex flex-col rounded-xl bg-[#18181b] border border-[#27272a] shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272a] bg-[#121214]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Export Session Report
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#27272a] text-slate-400 font-normal">
                  {sessionId}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Generate clean, shareable reports for stakeholders or pull requests
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#27272a] transition-colors cursor-pointer"
            title="Close dialog (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Controls & Filters */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-[#27272a] bg-[#141416] p-4 flex flex-col gap-5 overflow-y-auto shrink-0">
            {/* Format Selection */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Document Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("html")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    format === "html"
                      ? "bg-cyan-950/60 border-cyan-600/60 text-cyan-300 shadow-sm"
                      : "bg-[#1f1f23] border-[#2e2e36] text-slate-400 hover:text-slate-200 hover:bg-[#25252a]"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>HTML (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("markdown")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    format === "markdown"
                      ? "bg-cyan-950/60 border-cyan-600/60 text-cyan-300 shadow-sm"
                      : "bg-[#1f1f23] border-[#2e2e36] text-slate-400 hover:text-slate-200 hover:bg-[#25252a]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Markdown</span>
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Include Content</span>
              </div>

              <div className="flex flex-col gap-2">
                {/* Executive Summary */}
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#1f1f23] border border-[#2e2e36] hover:border-slate-700 transition-colors cursor-pointer text-xs">
                  <span className="flex items-center gap-2 text-slate-200">
                    <LayoutList className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Executive Summary</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={options.includeExecutiveSummary}
                    onChange={() => toggleOption("includeExecutiveSummary")}
                    className="accent-cyan-500 rounded cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Thinking Process */}
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#1f1f23] border border-[#2e2e36] hover:border-slate-700 transition-colors cursor-pointer text-xs">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Reasoning / Thinking</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={options.includeThinking}
                    onChange={() => toggleOption("includeThinking")}
                    className="accent-cyan-500 rounded cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Tool Outputs */}
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#1f1f23] border border-[#2e2e36] hover:border-slate-700 transition-colors cursor-pointer text-xs">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Verbose Tool Outputs</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={options.includeToolOutputs}
                    onChange={() => toggleOption("includeToolOutputs")}
                    className="accent-cyan-500 rounded cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Timestamps */}
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#1f1f23] border border-[#2e2e36] hover:border-slate-700 transition-colors cursor-pointer text-xs">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Step Timestamps</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={options.includeTimestamps}
                    onChange={() => toggleOption("includeTimestamps")}
                    className="accent-cyan-500 rounded cursor-pointer w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Information Tips */}
            <div className="mt-auto p-3 rounded-lg bg-[#1a1a1e] border border-[#27272a] text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Print to PDF Tip</span>
              When opening the HTML export, press <kbd className="px-1 py-0.5 bg-[#27272a] rounded text-[10px] text-slate-200">Cmd+P</kbd> or <kbd className="px-1 py-0.5 bg-[#27272a] rounded text-[10px] text-slate-200">Ctrl+P</kbd> to save a clean, high-contrast PDF document.
            </div>
          </div>

          {/* Right Column: Live Document Preview */}
          <div className="flex-1 flex flex-col bg-[#0f0f11] min-w-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#141416] border-b border-[#27272a] text-xs text-slate-400">
              <span className="font-medium">Live Document Preview</span>
              <span className="text-[11px] font-mono text-slate-500">
                {turns.length} turns &bull; {format.toUpperCase()}
              </span>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {format === "html" ? (
                <div className="w-full h-full min-h-[350px] rounded-lg border border-[#27272a] overflow-hidden bg-white shadow-inner">
                  <iframe
                    title="HTML Preview"
                    srcDoc={htmlContent}
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-lg border border-[#27272a] bg-[#141416] p-4 overflow-auto">
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                    {markdownContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Action Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#27272a] bg-[#121214]">
          <div className="text-xs text-slate-400 hidden sm:block">
            Ready to export as <span className="font-mono text-cyan-400">{format === "html" ? ".html" : ".md"}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {format === "html" && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#333338] bg-[#1f1f23] text-slate-200 hover:text-white hover:bg-[#28282e] text-xs font-medium transition-colors cursor-pointer"
                title="Open browser print dialog"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print to PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#333338] bg-[#1f1f23] text-slate-200 hover:text-white hover:bg-[#28282e] text-xs font-medium transition-colors cursor-pointer"
              title="Copy formatted document to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {format === "html" ? "HTML" : "Markdown"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
