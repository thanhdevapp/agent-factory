"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Editor from "@monaco-editor/react";
import {
  Copy,
  Check,
  RotateCw,
  Save,
  WrapText,
  Eye,
  EyeOff,
  X,
  FileCode,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Columns,
  Image as ImageIcon,
} from "lucide-react";
import FileIcon from "../common/FileIcon";
import ImageViewer from "./ImageViewer";
import MarkdownPreview from "./MarkdownPreview";
import { getThemeSettings, getActiveFont, THEME_CHANGE_EVENT } from "../../lib/themeStore";

export default function CodeFileEditor({
  filePath,
  initialContent = null,
  readOnly = false,
  onClose,
  onSave,
}) {
  const [content, setContent] = useState(initialContent || "");
  const [originalContent, setOriginalContent] = useState(initialContent || "");
  const [fileMeta, setFileMeta] = useState(null);
  const [loading, setLoading] = useState(!initialContent);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [wordWrap, setWordWrap] = useState("on");
  const [showMinimap, setShowMinimap] = useState(true);
  const [monacoTheme, setMonacoTheme] = useState("vs-dark");
  const [editorFontFamily, setEditorFontFamily] = useState(
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
  );
  const [editorFontSize, setEditorFontSize] = useState(13);
  const [markdownMode, setMarkdownMode] = useState("preview"); // "preview" | "edit" | "split"
  const [svgMode, setSvgMode] = useState("image"); // "image" | "code"

  const fileName = useMemo(() => {
    if (!filePath) return "untitled";
    return filePath.split("/").pop() || filePath;
  }, [filePath]);

  // Sync Monaco editor theme, font, and size with active workbench settings
  useEffect(() => {
    const applyTheme = () => {
      const cfg = getThemeSettings();
      if (cfg.theme === "light-plus") {
        setMonacoTheme("vs");
      } else {
        setMonacoTheme("vs-dark");
      }
      setEditorFontFamily(getActiveFont("mono"));
      if (cfg.fontSize) {
        setEditorFontSize(parseInt(cfg.fontSize, 10) || 13);
      }
    };
    applyTheme();
    window.addEventListener(THEME_CHANGE_EVENT, applyTheme);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, applyTheme);
  }, []);

  // Fetch file content if not passed
  const fetchFile = useCallback(async () => {
    if (!filePath) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspace/file-content?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load file content");
      }
      setContent(data.content || "");
      setOriginalContent(data.content || "");
      setFileMeta(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const isDirty = useMemo(() => {
    return content !== originalContent;
  }, [content, originalContent]);

  // Copy code to clipboard
  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save file changes
  const handleSave = async () => {
    if (!filePath || readOnly || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/workspace/file-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: filePath, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setOriginalContent(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      onSave?.(filePath, content);
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut: Cmd+S / Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, filePath, readOnly]);

  const lineCount = useMemo(() => {
    return content ? content.split("\n").length : 0;
  }, [content]);

  const language = fileMeta?.language || "plaintext";
  const isImage = Boolean(fileMeta?.isImage && !fileMeta?.isSvg);
  const isSvg = Boolean(fileMeta?.isSvg);
  const isMarkdown = language === "markdown" || fileName.endsWith(".md") || fileName.endsWith(".markdown") || fileName.endsWith(".mdx");

  // 1. Pure Binary Image File (.png, .jpg, .webp, .ico, .gif, .bmp)
  if (isImage && !loading && !error) {
    return (
      <ImageViewer
        filePath={filePath}
        fileMeta={fileMeta}
        onClose={onClose}
      />
    );
  }

  // 2. SVG Image (when viewing in "image" mode)
  if (isSvg && svgMode === "image" && !loading && !error) {
    return (
      <ImageViewer
        filePath={filePath}
        fileMeta={fileMeta}
        isSvg={true}
        onToggleSvgSource={() => setSvgMode("code")}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-slate-200 overflow-hidden select-text">
      {/* 1. File Breadcrumbs & Action Header */}
      <header className="h-[36px] min-h-[36px] bg-[#252526] border-b border-[#2b2b2b] px-3 flex items-center justify-between shrink-0 select-none text-xs">
        {/* Left: File Icon & Path Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <FileIcon filename={fileName} size={15} />
          <span className="font-semibold text-white truncate max-w-[200px]" title={fileName}>
            {fileName}
          </span>
          {isDirty && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" title="Modified" />
          )}
          <span className="text-slate-500 font-mono text-[10px] hidden md:inline truncate max-w-[320px]" title={filePath}>
            {filePath}
          </span>
        </div>

        {/* Right: Language, Mode Switcher, Line Count & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Markdown View Mode Toggle: Code | Preview | Split */}
          {isMarkdown && (
            <div className="flex items-center bg-[#1e1e1e] border border-[#3e3e42] rounded p-0.5 text-[10px]">
              <button
                onClick={() => setMarkdownMode("edit")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  markdownMode === "edit"
                    ? "bg-[#007acc] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Monaco Source Editor"
              >
                Code
              </button>
              <button
                onClick={() => setMarkdownMode("preview")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  markdownMode === "preview"
                    ? "bg-[#007acc] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Formatted Markdown Preview"
              >
                Preview
              </button>
              <button
                onClick={() => setMarkdownMode("split")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  markdownMode === "split"
                    ? "bg-[#007acc] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Side-by-side Edit & Live Preview"
              >
                Split
              </button>
            </div>
          )}

          {/* SVG Mode Toggle (when in code mode, offer return to image view) */}
          {isSvg && svgMode === "code" && (
            <button
              onClick={() => setSvgMode("image")}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#333333] border border-[#3e3e42] text-[10px] text-teal-300 hover:text-white transition-colors cursor-pointer"
              title="Switch to Rendered SVG Image View"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Image View</span>
            </button>
          )}

          {/* Metadata badges */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 border-r border-[#3e3e42] pr-2.5">
            <span className="px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-[#3e3e42] text-cyan-300 font-bold uppercase">
              {language}
            </span>
            <span>{lineCount} lines</span>
            <span>UTF-8</span>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer border ${
              copied
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold"
                : "bg-[#2d2d2d] hover:bg-[#383838] border-[#3e3e42] text-slate-300 hover:text-white"
            }`}
            title="Copy file content to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>

          {/* Save Button (when modified) */}
          {!readOnly && (
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border font-semibold ${
                saveSuccess
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : isDirty
                  ? "bg-[#007acc] hover:bg-[#0062a3] text-white border-[#007acc] shadow-sm animate-pulse"
                  : "bg-[#2d2d2d] border-[#3e3e42] text-slate-500 cursor-not-allowed opacity-50"
              }`}
              title="Save changes (Cmd+S / Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{saving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}</span>
            </button>
          )}

          {/* Toggle Word Wrap (available in editor modes) */}
          {(!isMarkdown || markdownMode !== "preview") && (
            <button
              onClick={() => setWordWrap((prev) => (prev === "on" ? "off" : "on"))}
              className={`p-1 rounded text-slate-400 hover:text-white hover:bg-[#383838] transition-colors cursor-pointer ${
                wordWrap === "on" ? "text-cyan-400" : ""
              }`}
              title={`Toggle Word Wrap (${wordWrap === "on" ? "ON" : "OFF"})`}
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Toggle Minimap (available in editor modes) */}
          {(!isMarkdown || markdownMode !== "preview") && (
            <button
              onClick={() => setShowMinimap((prev) => !prev)}
              className={`p-1 rounded text-slate-400 hover:text-white hover:bg-[#383838] transition-colors cursor-pointer ${
                showMinimap ? "text-cyan-400" : ""
              }`}
              title={`Toggle Minimap (${showMinimap ? "Show" : "Hide"})`}
            >
              {showMinimap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Refresh File Content */}
          <button
            onClick={fetchFile}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#383838] transition-colors cursor-pointer"
            title="Reload from disk"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          {/* Close Tab Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-[#383838] transition-colors cursor-pointer"
              title="Close editor tab"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RotateCw className="w-6 h-6 animate-spin text-[#007acc]" />
            <span className="text-xs font-mono">Loading {fileName}...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-rose-300">Cannot load file</h4>
            <p className="text-xs text-slate-400 max-w-md font-mono">{error}</p>
            <button
              onClick={fetchFile}
              className="px-3 py-1.5 rounded bg-[#252526] hover:bg-[#333333] border border-[#3e3e42] text-xs text-slate-200 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : isMarkdown && markdownMode === "preview" ? (
          /* Markdown Preview Full Width */
          <MarkdownPreview content={content} filePath={filePath} />
        ) : isMarkdown && markdownMode === "split" ? (
          /* Side-by-side Split View: Monaco Editor on Left, Markdown Preview on Right */
          <div className="flex h-full w-full divide-x divide-[#2b2b2b]">
            <div className="w-1/2 h-full overflow-hidden">
              <Editor
                height="100%"
                path={filePath}
                language={language}
                value={content}
                onChange={(val) => setContent(val || "")}
                theme={monacoTheme}
                options={{
                  readOnly,
                  fontSize: editorFontSize,
                  fontFamily: editorFontFamily,
                  minimap: { enabled: showMinimap },
                  scrollBeyondLastLine: false,
                  wordWrap,
                  automaticLayout: true,
                  tabSize: 2,
                  bracketPairColorization: { enabled: true },
                  lineNumbers: "on",
                  renderLineHighlight: "all",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
            <div className="w-1/2 h-full overflow-hidden bg-[#1e1e1e]">
              <MarkdownPreview content={content} filePath={filePath} />
            </div>
          </div>
        ) : (
          /* Standard Monaco Editor */
          <Editor
            height="100%"
            path={filePath}
            language={language}
            value={content}
            onChange={(val) => setContent(val || "")}
            theme={monacoTheme}
            options={{
              readOnly,
              fontSize: editorFontSize,
              fontFamily: editorFontFamily,
              minimap: { enabled: showMinimap },
              scrollBeyondLastLine: false,
              wordWrap,
              automaticLayout: true,
              tabSize: 2,
              bracketPairColorization: { enabled: true },
              lineNumbers: "on",
              renderLineHighlight: "all",
              smoothScrolling: true,
              cursorBlinking: "smooth",
            }}
          />
        )}
      </div>
    </div>
  );
}
