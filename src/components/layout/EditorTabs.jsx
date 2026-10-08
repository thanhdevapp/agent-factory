"use client";

import React, { useRef } from "react";
import {
  Bot,
  Cpu,
  Activity,
  BarChart3,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

export default function EditorTabs({
  tabs = [],
  activeTabId = "canvas",
  onSelectTab,
  onCloseTab,
}) {
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  const getTabIcon = (tab) => {
    if (tab.type === "canvas") return <Bot className="w-3.5 h-3.5 text-emerald-400" />;
    if (tab.type === "telemetry") return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
    if (tab.type === "reports") return <BarChart3 className="w-3.5 h-3.5 text-amber-400" />;
    return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
  };

  return (
    <div
      data-testid="editor-tabs-bar"
      className="h-[35px] min-h-[35px] bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between select-none overflow-hidden"
    >
      {/* Tabs Container */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="flex items-center h-full overflow-x-auto no-scrollbar scroll-smooth flex-1"
        style={{ scrollbarWidth: "none" }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab?.(tab.id)}
              className={`group flex items-center gap-2 h-full px-3 text-xs cursor-pointer border-r border-[#1e1e1e] transition-colors relative shrink-0 ${
                isActive
                  ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]"
                  : "bg-[#2d2d2d] text-[#969696] hover:bg-[#252526] hover:text-[#cccccc] border-t-2 border-t-transparent"
              }`}
            >
              {/* Icon */}
              {getTabIcon(tab)}

              {/* Title */}
              <span className="font-medium text-[11px] truncate max-w-[140px]">
                {tab.title}
              </span>

              {/* Close Button */}
              {tab.closable !== false && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab?.(tab.id);
                  }}
                  title="Đóng tab"
                  className="p-0.5 rounded text-slate-500 hover:text-white hover:bg-[#333333] transition-colors opacity-70 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Tab Controls */}
      <div className="flex items-center px-2 gap-1 bg-[#252526] border-l border-[#1e1e1e] shrink-0 h-full">
        <button
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({ left: -100, behavior: "smooth" });
            }
          }}
          title="Cuộn sang trái"
          className="p-1 rounded text-slate-500 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({ left: 100, behavior: "smooth" });
            }
          }}
          title="Cuộn sang phải"
          className="p-1 rounded text-slate-500 hover:text-slate-200 transition-colors"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
