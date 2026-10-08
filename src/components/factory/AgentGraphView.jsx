"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { 
  GitFork, 
  Bot, 
  Cpu, 
  Zap, 
  Terminal, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  ExternalLink,
  MessageSquare,
  Activity,
  ArrowRight
} from "lucide-react";
import { buildAgentHierarchy, NODE_WIDTH, NODE_HEIGHT } from "../../lib/parsers/hierarchyParser.js";

/**
 * AgentGraphView Component
 * Multi-Agent DAG Network Visualization
 * - Native SVG/HTML Engine (0 dependency)
 * - Multicolor Bezier curves with data pulse glow
 * - Interactive Pan, Zoom, and Auto-Fit to screen
 * - 1-Click to view subagent transcript and details
 */
export default function AgentGraphView({
  traces = [],
  selectedTraceId = null,
  onSelectTrace,
  activeTurns = [],
  className = ""
}) {
  const containerRef = useRef(null);

  // Pan & Zoom controls state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const panRef = useRef(pan);
  panRef.current = pan;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selected session state to focus graph tree
  const [focusedId, setFocusedId] = useState(selectedTraceId || traces[0]?.traceId || traces[0]?.connectionId);

  // Unique session list for dropdown switcher
  const uniqueSessionOptions = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const t of traces) {
      const id = t.traceId || t.connectionId;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push({
        id,
        label: `${t.account || t.connectionId} (${t.model || "Gemini"})`,
      });
    }
    return result;
  }, [traces]);

  useEffect(() => {
    if (selectedTraceId) {
      setFocusedId(selectedTraceId);
    } else if (!focusedId && traces.length > 0) {
      setFocusedId(traces[0].traceId || traces[0].connectionId);
    }
  }, [selectedTraceId, traces, focusedId]);

  // Build DAG model from traces and turns
  const { nodes, edges, bounds } = useMemo(() => {
    return buildAgentHierarchy(traces, focusedId, activeTurns);
  }, [traces, focusedId, activeTurns]);

  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;
  const nodesCountRef = useRef(nodes.length);
  nodesCountRef.current = nodes.length;

  // Auto-center entire graph (Fit to Screen)
  const fitView = useCallback(() => {
    if (!containerRef.current || nodesCountRef.current === 0) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const b = boundsRef.current;
    const graphWidth = b.maxX - b.minX;
    const graphHeight = b.maxY - b.minY;

    if (graphWidth <= 0 || graphHeight <= 0) return;

    const scaleX = (clientWidth - 120) / graphWidth;
    const scaleY = (clientHeight - 120) / graphHeight;
    const nextScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.3), 1.2);

    const centerX = (b.minX + b.maxX) / 2;
    const centerY = (b.minY + b.maxY) / 2;

    const nextPanX = clientWidth / 2 - centerX * nextScale;
    const nextPanY = clientHeight / 2 - centerY * nextScale;

    setScale(nextScale);
    setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
  }, []);

  // Auto-fit strictly once per session switch or initial load
  const lastFittedIdRef = useRef(null);
  useEffect(() => {
    if (focusedId && focusedId !== lastFittedIdRef.current && nodes.length > 0) {
      lastFittedIdRef.current = focusedId;
      const timer = setTimeout(() => {
        fitView();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusedId, nodes.length, fitView]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    // Do not pan if clicking buttons, node cards or select elements
    if (e.target.closest("button") || e.target.closest(".agent-node-card") || e.target.closest("select")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: Math.round(e.clientX - dragStart.x),
      y: Math.round(e.clientY - dragStart.y),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double-click empty canvas to auto-fit
  const handleDoubleClick = (e) => {
    if (e.target.closest("button") || e.target.closest(".agent-node-card") || e.target.closest("select")) return;
    fitView();
  };

  // Ensure dragging stops if mouseup occurs outside container
  useEffect(() => {
    const onGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", onGlobalMouseUp);
    return () => window.removeEventListener("mouseup", onGlobalMouseUp);
  }, []);

  // Zoom In / Zoom Out button controls (centered on viewport)
  const handleZoomIn = () => {
    const currentScale = scaleRef.current;
    const currentPan = panRef.current;
    const nextScale = Math.min(currentScale * 1.2, 3.0);

    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const centerX = clientWidth / 2;
      const centerY = clientHeight / 2;
      const nextPanX = centerX - (centerX - currentPan.x) * (nextScale / currentScale);
      const nextPanY = centerY - (centerY - currentPan.y) * (nextScale / currentScale);
      setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
    }
    setScale(nextScale);
  };

  const handleZoomOut = () => {
    const currentScale = scaleRef.current;
    const currentPan = panRef.current;
    const nextScale = Math.max(currentScale / 1.2, 0.2);

    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const centerX = clientWidth / 2;
      const centerY = clientHeight / 2;
      const nextPanX = centerX - (centerX - currentPan.x) * (nextScale / currentScale);
      const nextPanY = centerY - (centerY - currentPan.y) * (nextScale / currentScale);
      setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
    }
    setScale(nextScale);
  };

  // Wheel listener with passive: false to zoom smoothly toward cursor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = 1.08;
      const currentScale = scaleRef.current;
      const currentPan = panRef.current;

      let nextScale = e.deltaY < 0 ? currentScale * zoomFactor : currentScale / zoomFactor;
      nextScale = Math.min(Math.max(nextScale, 0.2), 3.0);

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const nextPanX = mouseX - (mouseX - currentPan.x) * (nextScale / currentScale);
      const nextPanY = mouseY - (mouseY - currentPan.y) * (nextScale / currentScale);

      setScale(nextScale);
      setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const activeNodesCount = nodes.filter(n => n.status === "streaming").length;

  return (
    <div 
      className={`relative w-full h-full bg-slate-950 overflow-hidden select-none flex flex-col ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Controls Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Session Focus Selector & Stats */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block text-xs">
                Multi-Agent DAG
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {nodes.length} agents • {edges.length} links {activeNodesCount > 0 && `• ${activeNodesCount} running`}
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Session Switcher dropdown */}
          <select
            value={focusedId || ""}
            onChange={(e) => setFocusedId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            {uniqueSessionOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Zoom & Pan Controls */}
        <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-xl backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-2 min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />
          <button
            onClick={fitView}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fit</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Background Dot Grid */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dag-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#64748b" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dag-grid)" />
        </svg>

        {/* Transformable Canvas Workspace */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          className="absolute top-0 left-0"
        >
          {/* SVG LAYER: Bezier Curves & Pulse Animations */}
          <svg
            className="overflow-visible pointer-events-none absolute top-0 left-0"
            style={{ width: 1, height: 1 }}
          >
            <defs>
              {/* Linear gradient for active edge */}
              <linearGradient id="edge-pulse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>

              {/* Arrow marker */}
              <marker
                id="dag-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#6366f1" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge) => {
              const isActive = edge.active;
              return (
                <g key={edge.id}>
                  {/* Background shadow stroke */}
                  <path
                    d={edge.pathData}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Primary stroke */}
                  <path
                    d={edge.pathData}
                    fill="none"
                    stroke={isActive ? "url(#edge-pulse-gradient)" : "#475569"}
                    strokeWidth={isActive ? "2.5" : "1.8"}
                    strokeDasharray={isActive ? "8 6" : "none"}
                    strokeLinecap="round"
                    className={isActive ? "animate-pulse" : ""}
                  />

                  {/* Target connector dot */}
                  <circle
                    cx={edge.toPos.x}
                    cy={edge.toPos.y}
                    r={isActive ? "4.5" : "3"}
                    fill={isActive ? "#38bdf8" : "#64748b"}
                    className={isActive ? "animate-ping" : ""}
                  />

                  {/* Center label badge */}
                  {edge.label && (
                    <g transform={`translate(${(edge.fromPos.x + edge.toPos.x) / 2}, ${(edge.fromPos.y + edge.toPos.y) / 2})`}>
                      <rect
                        x="-38"
                        y="-10"
                        width="76"
                        height="20"
                        rx="6"
                        fill="#090d16"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="var(--font-family-mono, monospace)"
                        fontWeight="600"
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML LAYER: Interactive Node Cards */}
          <div className="relative">
            {nodes.map((node) => {
              const isRunning = node.status === "streaming";
              const isDone = node.status === "done";
              const isLooping = !!node.isLooping;

              const getStatusBadge = () => {
                if (isLooping) {
                  return {
                    text: "Loop Alert",
                    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
                    dot: "bg-rose-500 animate-ping",
                  };
                }
                if (isRunning) {
                  return {
                    text: "Running",
                    color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
                    dot: "bg-cyan-400 animate-ping",
                  };
                }
                if (isDone) {
                  return {
                    text: "Completed",
                    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
                    dot: "bg-emerald-400",
                  };
                }
                return {
                  text: "Idle",
                  color: "text-slate-400 bg-slate-800/60 border-slate-700/60",
                  dot: "bg-slate-500",
                };
              };

              const statusBadge = getStatusBadge();

              return (
                <div
                  key={node.id}
                  style={{
                    position: "absolute",
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${node.width}px`,
                    height: `${node.height}px`,
                  }}
                  onClick={() => {
                    if (node.traceRef) {
                      onSelectTrace?.(node.traceRef);
                    }
                  }}
                  className={`agent-node-card rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md p-3.5 flex flex-col justify-between select-text group hover:scale-[1.02] ${
                    node.isRoot
                      ? "bg-slate-900/95 border-cyan-500/40 hover:border-cyan-400 hover:shadow-cyan-500/10"
                      : "bg-slate-900/85 border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-inner"
                        style={{ borderColor: node.color, backgroundColor: `${node.color}20` }}
                      >
                        <Bot className="w-4 h-4" style={{ color: node.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 text-xs truncate">
                          {node.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                          <span>{node.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border font-semibold ${statusBadge.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                      <span>{statusBadge.text}</span>
                    </span>
                  </div>

                  {/* Card Middle: Prompt preview or Workspace */}
                  <div className="my-1.5">
                    {node.prompt ? (
                      <p className="text-[11px] text-slate-300 font-mono line-clamp-2 leading-relaxed bg-black/40 p-1.5 rounded-lg border border-slate-800/80">
                        {node.prompt}
                      </p>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate font-mono">{node.model}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Model, Tokens, Tools */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-indigo-400" />
                      <span className="truncate max-w-24">{node.model}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {node.toolsCount > 0 && (
                        <span>{node.toolsCount} tools</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (node.traceRef) onSelectTrace?.(node.traceRef);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-opacity"
                        title="View chat session for this agent"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
