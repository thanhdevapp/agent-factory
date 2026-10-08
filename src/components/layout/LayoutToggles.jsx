"use client";

import React from "react";
import { PanelLeft, PanelBottom, PanelRight } from "lucide-react";

/**
 * VS Code Standard Layout Control Buttons
 * Renders 3 toggles: Primary Side Bar (Left), Bottom Panel, Secondary Side Bar (Right)
 */
export default function LayoutToggles({
  isLeftSidebarVisible,
  isBottomPanelVisible,
  isRightSidebarVisible,
  onToggleLeftSidebar,
  onToggleBottomPanel,
  onToggleRightSidebar,
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
    </div>
  );
}
