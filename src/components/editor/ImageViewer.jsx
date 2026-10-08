"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  X,
  Grid,
  FileCode,
  Image as ImageIcon,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import FileIcon from "../common/FileIcon";

export default function ImageViewer({
  filePath,
  fileMeta,
  isSvg = false,
  onToggleSvgSource,
  onClose,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [checkerboard, setCheckerboard] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const mediaUrl = useMemo(() => {
    if (fileMeta?.mediaUrl) return fileMeta.mediaUrl;
    if (filePath) return `/api/media?path=${encodeURIComponent(filePath)}`;
    return "";
  }, [fileMeta, filePath]);

  const fileName = useMemo(() => {
    if (fileMeta?.name) return fileMeta.name;
    if (!filePath) return "image";
    return filePath.split("/").pop() || filePath;
  }, [fileMeta, filePath]);

  const ext = useMemo(() => {
    if (fileMeta?.ext) return fileMeta.ext.replace(".", "").toUpperCase();
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "IMG";
  }, [fileMeta, fileName]);

  const formattedSize = useMemo(() => {
    if (!fileMeta?.size) return null;
    const bytes = fileMeta.size;
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  }, [fileMeta]);

  // Image load handler to get natural dimensions
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setDimensions({ width: naturalWidth, height: naturalHeight });
    setImgLoaded(true);
    setImgError(false);
  };

  const handleImageError = () => {
    setImgLoaded(false);
    setImgError(true);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.25));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFitScreen = () => {
    if (!containerRef.current || !dimensions.width || !dimensions.height) return;
    const cw = containerRef.current.clientWidth - 40;
    const ch = containerRef.current.clientHeight - 40;
    const scale = Math.min(cw / dimensions.width, ch / dimensions.height, 1);
    setZoom(Number(scale.toFixed(2)));
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(Number((prev + 0.1).toFixed(2)), 5));
    } else {
      setZoom((prev) => Math.max(Number((prev - 0.1).toFixed(2)), 0.25));
    }
  };

  // Drag & Pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCopyPath = () => {
    if (!filePath) return;
    navigator.clipboard.writeText(filePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181818] text-slate-200 overflow-hidden select-none">
      {/* 1. Top Breadcrumb & Controls Toolbar */}
      <header className="h-[36px] min-h-[36px] bg-[#252526] border-b border-[#2b2b2b] px-3 flex items-center justify-between shrink-0 text-xs z-10">
        {/* Left: File icon & Info */}
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <FileIcon filename={fileName} size={15} />
          <span className="font-semibold text-white truncate max-w-[200px]" title={fileName}>
            {fileName}
          </span>
          <span className="text-slate-500 font-mono text-[10px] hidden md:inline truncate max-w-[320px]" title={filePath}>
            {filePath}
          </span>
        </div>

        {/* Right: Badges & Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Metadata badges */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 border-r border-[#3e3e42] pr-2.5">
            <span className="px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-[#3e3e42] text-teal-300 font-bold uppercase">
              {ext}
            </span>
            {dimensions.width > 0 && (
              <span>
                {dimensions.width} &times; {dimensions.height} px
              </span>
            )}
            {formattedSize && <span>{formattedSize}</span>}
          </div>

          {/* Copy file path */}
          <button
            onClick={handleCopyPath}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer border ${
              copied
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold"
                : "bg-[#2d2d2d] hover:bg-[#383838] border-[#3e3e42] text-slate-300 hover:text-white"
            }`}
            title="Copy absolute file path"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{copied ? "Copied!" : "Copy Path"}</span>
          </button>

          {/* Toggle Checkerboard */}
          <button
            onClick={() => setCheckerboard((prev) => !prev)}
            className={`p-1 rounded text-slate-400 hover:text-white hover:bg-[#383838] transition-colors cursor-pointer ${
              checkerboard ? "text-teal-400" : ""
            }`}
            title={`Toggle Transparent Checkerboard (${checkerboard ? "ON" : "OFF"})`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#3e3e42] rounded px-1 py-0.5">
            <button
              onClick={handleZoomOut}
              className="p-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-[10px] font-mono font-bold text-teal-300 px-1 hover:text-white cursor-pointer"
              title="Reset Zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fit to screen */}
          <button
            onClick={handleFitScreen}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#383838] transition-colors cursor-pointer"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* If SVG, offer button to switch to source XML code */}
          {isSvg && onToggleSvgSource && (
            <button
              onClick={onToggleSvgSource}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] border border-[#3e3e42] text-xs text-amber-300 hover:text-white transition-colors cursor-pointer"
              title="View & Edit SVG Source Code"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SVG Code</span>
            </button>
          )}

          {/* Open in new browser tab */}
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#383838] transition-colors cursor-pointer"
            title="Open raw image in browser"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Close tab */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-[#383838] transition-colors cursor-pointer"
              title="Close image tab"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Interactive Image Canvas */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 relative overflow-hidden flex items-center justify-center ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } ${
          checkerboard
            ? "bg-[#141414] [background-image:linear-gradient(45deg,#1f1f1f_25%,transparent_25%),linear-gradient(-45deg,#1f1f1f_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f1f1f_75%),linear-gradient(-45deg,transparent_75%,#1f1f1f_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]"
            : "bg-[#121212]"
        }`}
      >
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RotateCw className="w-6 h-6 animate-spin text-teal-400" />
            <span className="text-xs font-mono">Loading image...</span>
          </div>
        )}

        {imgError ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-rose-300">Cannot display image</h4>
            <p className="text-xs text-slate-400 max-w-md font-mono">
              Unable to load image from {mediaUrl}
            </p>
          </div>
        ) : (
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            className="inline-block transition-transform select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={mediaUrl}
              alt={fileName}
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
              className={`max-w-none shadow-2xl rounded-sm ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}

        {/* Floating bottom status indicator */}
        <div className="absolute bottom-3 left-3 bg-[#1e1e1e]/90 backdrop-blur-xs border border-[#3e3e42] rounded px-2.5 py-1 text-[10px] text-slate-400 flex items-center gap-2 pointer-events-none">
          <ImageIcon className="w-3 h-3 text-teal-400" />
          <span>Drag to pan &middot; Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
