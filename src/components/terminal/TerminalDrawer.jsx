"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Plus,
  ArrowDownToLine,
  Trash2,
} from "lucide-react";
import XTermTerminal from "./XTermTerminal";

export default function TerminalDrawer({
  isOpen = false,
  onClose,
  onDockBack,
  initialCwd = "",
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [tabs, setTabs] = useState([
    { id: "term-1", title: "Terminal 1", cwd: initialCwd },
  ]);
  const [activeTabId, setActiveTabId] = useState("term-1");
  const [height, setHeight] = useState(380);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Keyboard shortcut Cmd+J / Ctrl+J
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        if (isOpen) {
          onClose?.();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const delta = startYRef.current - moveEvent.clientY;
      const newHeight = Math.min(Math.max(startHeightRef.current + delta, 220), window.innerHeight * 0.85);
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleAddTab = () => {
    const nextIdx = tabs.length + 1;
    const newId = `term-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      { id: newId, title: `Terminal ${nextIdx}`, cwd: initialCwd },
    ]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      onClose?.();
      return;
    }
    const filtered = tabs.filter((t) => t.id !== tabId);
    setTabs(filtered);
    if (activeTabId === tabId) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed left-0 right-0 bottom-0 z-50 flex flex-col bg-[#0c1017]/95 border-t border-slate-700/80 shadow-2xl backdrop-blur-md transition-all duration-150 ${
        isMaximized ? "top-0 h-full" : ""
      }`}
      style={!isMaximized ? { height: `${height}px` } : undefined}
    >
      {/* Top resize handle bar */}
      {!isMaximized && (
        <div
          onMouseDown={handleMouseDown}
          className="h-1.5 w-full bg-slate-800/40 hover:bg-cyan-500/50 cursor-row-resize transition-colors"
          title="Drag to resize terminal drawer"
        />
      )}

      {/* Drawer Titlebar */}
      <div className="h-9 min-h-9 px-3 bg-[#131822] border-b border-slate-800 flex items-center justify-between select-none">
        {/* Left: Tab list */}
        <div className="flex items-center gap-1 h-full overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center gap-1.5 h-7 px-2.5 rounded-t text-xs font-mono font-medium transition-colors cursor-pointer border-t-2 ${
                  isActive
                    ? "bg-[#0a0d14] text-cyan-300 border-cyan-400"
                    : "bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50"
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                    title="Close tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleAddTab}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ml-1"
            title="New terminal tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Dock back button */}
          {onDockBack && (
            <button
              onClick={onDockBack}
              className="p-1 rounded hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
              title="Dock back to Bottom Panel"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Maximize / Restore */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 rounded hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
            title="Close terminal (Cmd+J)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 w-full h-full min-h-0 bg-[#0a0d14] relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`absolute inset-0 ${tab.id === activeTabId ? "block" : "hidden"}`}
          >
            <XTermTerminal
              cwd={tab.cwd}
              onTitleChange={(title) => {
                setTabs((prev) =>
                  prev.map((t) => (t.id === tab.id ? { ...t, title } : t))
                );
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
