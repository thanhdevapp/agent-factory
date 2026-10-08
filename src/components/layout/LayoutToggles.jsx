"use client";

import React from "react";
import { PanelLeft, PanelBottom, PanelRight, Maximize2, Minimize2 } from "lucide-react";

/**
 * VS Code Standard Layout Control Buttons
 * Renders layout toggles: Primary Side Bar (Left), Bottom Panel, Secondary Side Bar (Right), Fullscreen Chill Mode
 */
export default function LayoutToggles({
  isLeftSidebarVisible,
  isBottomPanelVisible,
  isRightSidebarVisible,
  onToggleLeftSidebar,
  onToggleBottomPanel,
  onToggleRightSidebar,
  isZenFullscreen = false,
  onToggleZenFullscreen = null,
}) {
  const getButtonClass = (isActive) =>
    `inline-flex items-center justify-center p-1 rounded transition-colors ${
      isActive
        ? "bg-[#007acc]/20 border border-[#007acc]/50 text-[#4fc1ff]"
        : "border border-transparent text-[#858585] hover:text-[#cccccc] hover:bg-[#2a2d2e]"
    }`;

  return (
    <div
      data-testid="layout-toggles-group"
      className="inline-flex items-center gap-0.5 bg-[#252526] p-0.5 rounded border border-[#333333]"
    >
      <button
        type="button"
        data-testid="toggle-left-sidebar"
        title="Toggle Primary Sidebar (Cmd+B / Ctrl+B)"
        onClick={onToggleLeftSidebar}
        className={getButtonClass(isLeftSidebarVisible)}
      >
        <PanelLeft className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        data-testid="toggle-bottom-panel"
        title="Toggle Bottom Panel (Cmd+J / Ctrl+J)"
        onClick={onToggleBottomPanel}
        className={getButtonClass(isBottomPanelVisible)}
      >
        <PanelBottom className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        data-testid="toggle-right-sidebar"
        title="Toggle Secondary Sidebar (Live Chat & Inspector - Cmd+Alt+B)"
        onClick={onToggleRightSidebar}
        className={getButtonClass(isRightSidebarVisible)}
      >
        <PanelRight className="w-3.5 h-3.5" />
      </button>

      {onToggleZenFullscreen && (
        <>
          <div className="w-[1px] h-3 bg-[#333333] my-auto mx-0.5" />
          <button
            type="button"
            data-testid="toggle-zen-fullscreen"
            title={
              isZenFullscreen
                ? "Thoát chế độ toàn màn hình Chill Mode (ESC)"
                : "Chế độ Chill toàn màn hình Virtual Office (Shift+F / ESC để thoát)"
            }
            onClick={onToggleZenFullscreen}
            className={`inline-flex items-center justify-center p-1 rounded transition-colors ${
              isZenFullscreen
                ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm"
                : "border border-transparent text-[#858585] hover:text-[#4fc1ff] hover:bg-[#2a2d2e]"
            }`}
          >
            {isZenFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
