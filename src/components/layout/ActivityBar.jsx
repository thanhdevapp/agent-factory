"use client";

import React from "react";
import {
  FolderTree,
  Bot,
  Activity,
  Terminal,
  Settings,
  BarChart3,
  SlidersHorizontal,
  GitFork,
  MessageSquare,
  Coffee,
} from "lucide-react";

export default function ActivityBar({
  activeView = "explorer",
  onViewChange,
  onOpenStore,
  agentCount = 0,
  isRightSidebarVisible = false,
  activeRightSidebarTab = "chat",
  isBottomPanelVisible = false,
  onToggleBottomPanel,
  onOpenSettings,
}) {
  const topViews = [
    {
      id: "explorer",
      title: "Explorer: Agents & Sessions (Ctrl+Shift+E)",
      icon: FolderTree,
      badge: agentCount > 0 ? agentCount : undefined,
    },
    {
      id: "chat",
      title: "Live Chat / Transcript (Sidebar)",
      icon: MessageSquare,
    },
    {
      id: "office",
      title: "Virtual 2D Office View (Canvas)",
      icon: Bot,
    },
    {
      id: "network",
      title: "Multi-Agent Collaboration DAG Graph",
      icon: GitFork,
    },
    {
      id: "reports",
      title: "Token & AI Cost Analytics",
      icon: BarChart3,
    },
    {
      id: "telemetry",
      title: "Live Telemetry & Traces",
      icon: Activity,
    },
    {
      id: "store",
      title: "Supporter Store: Skins, Pets & Ambience",
      icon: Coffee,
    },
  ];

  return (
    <aside
      data-testid="activity-bar"
      className="w-12 h-full bg-[#181818] flex flex-col justify-between items-center border-r border-[#2b2b2b] py-2 shrink-0 z-30 select-none"
    >
      {/* Top View Icons */}
      <div className="flex flex-col gap-1 w-full items-center">
        {topViews.map((item) => {
          const isActive =
            item.id === "chat"
              ? isRightSidebarVisible && activeRightSidebarTab === "chat"
              : activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "store") {
                  onOpenStore?.();
                } else {
                  onViewChange?.(item.id);
                }
              }}
              title={item.title}
              className={`w-full py-2.5 flex justify-center items-center relative transition-colors ${
                isActive
                  ? "text-white border-l-2 border-[#007acc] bg-[#252526]/50"
                  : item.id === "store"
                  ? "text-amber-400 hover:text-amber-300 hover:bg-[#252526]/40 border-l-2 border-transparent"
                  : "text-[#858585] hover:text-[#cccccc] border-l-2 border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.id === "store" ? "text-amber-400" : ""}`} />
              {item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 bg-[#007acc] text-white text-[9px] font-bold px-1 rounded-full leading-none min-w-3 text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick toggle bottom terminal from ActivityBar */}
        <button
          onClick={onToggleBottomPanel}
          title={isBottomPanelVisible ? "Hide Terminal & Logs (Cmd+J)" : "Show Terminal & Logs (Cmd+J)"}
          className={`w-full py-2.5 flex justify-center items-center relative transition-colors ${
            isBottomPanelVisible
              ? "text-cyan-400 border-l-2 border-cyan-500/50"
              : "text-[#858585] hover:text-[#cccccc] border-l-2 border-transparent"
          }`}
        >
          <Terminal className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Settings Icon */}
      <div className="flex flex-col gap-1 w-full items-center">
        <button
          onClick={onOpenSettings}
          title="System Settings & Watchers"
          className="w-full py-2.5 flex justify-center items-center text-[#858585] hover:text-[#cccccc] transition-colors border-l-2 border-transparent"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
