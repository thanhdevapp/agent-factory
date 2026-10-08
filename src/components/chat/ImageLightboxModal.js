"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Image as ImageIcon } from "lucide-react";

export default function ImageLightboxModal({ image, onClose }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  const src = image.src || "";
  const alt = image.alt || image.title || "Image preview";

  // Derive human friendly filename
  let fileName = "image.png";
  try {
    const clean = src.split("?")[0];
    fileName = clean.split("/").pop() || "image.png";
  } catch {
    // fallback
  }

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = fileName;
    a.target = "_blank";
    a.click();
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 4));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 shadow-2xl shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 truncate">
          <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-slate-100 truncate">{alt}</span>
          <span className="text-[11px] font-mono text-slate-400 truncate">({fileName})</span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-1.5 text-slate-400 min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-800 mx-1" />
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Download image"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors ml-1"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        className="flex-1 w-full flex items-center justify-center overflow-auto p-4 my-2"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="transition-transform duration-150 ease-out origin-center cursor-zoom-in"
          style={{ transform: `scale(${scale})` }}
          onClick={(e) => {
            e.stopPropagation();
            if (scale === 1) zoomIn();
            else resetZoom();
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-[85vw] max-h-[75vh] object-contain rounded-lg shadow-2xl border border-slate-800 bg-slate-950/60"
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-[11px] text-slate-500 font-mono shrink-0">
        Click image to zoom • Click backdrop or press Esc to close
      </div>
    </div>
  );
}
