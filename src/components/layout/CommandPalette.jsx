"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  PanelLeft,
  PanelBottom,
  PanelRight,
  Volume2,
  Bell,
  RotateCw,
  Radio,
  Layers,
  X,
  Command,
  BarChart3,
  RotateCcw,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export default function CommandPalette({
  isOpen = false,
  onClose,
  onToggleLeftSidebar,
  onToggleBottomPanel,
  onToggleRightSidebar,
  onOpenChatSidebar,
  onOpenChatModal,
  onToggleSound,
  onToggleNotif,
  onRefresh,
  onSetMode,
  onSelectPreset,
  onOpenReports,
  onStartReplay,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: "toggle-left",
      title: "View: Toggle Primary Side Bar",
      shortcut: "Cmd+B",
      icon: PanelLeft,
      action: () => {
        onToggleLeftSidebar();
        onClose();
      },
    },
    {
      id: "toggle-bottom",
      title: "View: Toggle Bottom Panel (Terminal & Logs)",
      shortcut: "Cmd+J",
      icon: PanelBottom,
      action: () => {
        onToggleBottomPanel();
        onClose();
      },
    },
    {
      id: "toggle-right",
      title: "View: Toggle Secondary Side Bar (Live Chat & Inspector)",
      shortcut: "Cmd+Alt+B",
      icon: PanelRight,
      action: () => {
        onToggleRightSidebar();
        onClose();
      },
    },
    {
      id: "open-chat-sidebar",
      title: "Chat: Xem Live Chat & Transcript trong Sidebar (Tab phụ)",
      icon: MessageSquare,
      action: () => {
        onOpenChatSidebar?.();
        onClose();
      },
    },
    {
      id: "open-chat-modal",
      title: "Chat: Mở Live Chat & Transcript dạng Popup Modal (Cửa sổ riêng)",
      icon: ExternalLink,
      action: () => {
        onOpenChatModal?.();
        onClose();
      },
    },
    {
      id: "open-reports",
      title: "Reports: Open Token Usage & Analytics Report (Báo Cáo Token)",
      icon: BarChart3,
      action: () => {
        onOpenReports?.();
        onClose();
      },
    },
    {
      id: "start-replay",
      title: "Time-Machine: Tua lại lịch sử phiên làm việc (Session Replay)",
      icon: RotateCcw,
      action: () => {
        onStartReplay?.();
        onClose();
      },
    },
    {
      id: "refresh-watchers",
      title: "Watcher: Force Refresh All Watchers & Brain Transcripts",
      shortcut: "Cmd+R",
      icon: RotateCw,
      action: () => {
        onRefresh();
        onClose();
      },
    },
    {
      id: "live-mode",
      title: "Mode: Switch to Live Watchers (Realtime ~/.gemini & ~/.claude)",
      icon: Radio,
      action: () => {
        onSetMode("live");
        onClose();
      },
    },
    {
      id: "mock-storm",
      title: "Preset: Run Storm Demo (30 Agents Stress Test)",
      icon: Layers,
      action: () => {
        onSetMode("mock");
        onSelectPreset("storm");
        onClose();
      },
    },
    {
      id: "mock-busy",
      title: "Preset: Run Busy Demo (8 Working Agents)",
      icon: Layers,
      action: () => {
        onSetMode("mock");
        onSelectPreset("busy");
        onClose();
      },
    },
    {
      id: "toggle-sound",
      title: "Audio: Toggle 8-bit Sound FX",
      icon: Volume2,
      action: () => {
        onToggleSound();
        onClose();
      },
    },
    {
      id: "toggle-notif",
      title: "System: Toggle Desktop Notifications",
      icon: Bell,
      action: () => {
        onToggleNotif();
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#252526] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[420px]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1e1e1e] border-b border-[#333333]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gõ lệnh hoặc tìm kiếm thao tác..."
            className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
          />
          <kbd className="text-[10px] bg-[#2a2d2e] border border-[#3e3e42] rounded px-1.5 py-0.5 text-slate-400">
            Esc
          </kbd>
        </div>

        {/* Command List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2d2d2d] py-1">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">
              Không tìm thấy lệnh nào phù hợp
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#007acc] hover:text-white text-[#cccccc] text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                    <span className="font-medium truncate text-[11px]">{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="font-mono text-[9px] bg-[#1e1e1e] group-hover:bg-[#0062a3] border border-[#3e3e42] group-hover:border-transparent px-1.5 py-0.5 rounded text-slate-400 group-hover:text-white shrink-0">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
