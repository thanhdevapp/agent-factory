"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  X,
  Cpu,
  Terminal,
  Smartphone,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Bot,
} from "lucide-react";
import SessionChatView from "../chat/SessionChatView.js";

export default function RightSidebar({
  selectedAgent = null,
  workstations = [],
  activeTab = "chat",
  onTabChange,
  onSelectAgent,
  onClose,
  onOpenChatModal,
  onStartReplay,
}) {
  const [copied, setCopied] = useState(false);
  const [internalTab, setInternalTab] = useState(activeTab || "chat");

  const currentTab = onTabChange ? activeTab : internalTab;

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const handleCopyId = () => {
    if (!selectedAgent?.connectionId) return;
    navigator.clipboard?.writeText(selectedAgent.connectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApp =
    selectedAgent?.clientType === "app" ||
    (selectedAgent?.provider || "").toLowerCase().includes("(app)");

  const isAgentStreaming =
    selectedAgent?.state === "streaming" ||
    selectedAgent?.state === "busy" ||
    selectedAgent?.state === "working" ||
    selectedAgent?.mode === "streaming";

  return (
    <div
      data-testid="secondary-sidebar-container"
      className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] select-none overflow-hidden"
    >
      {/* 1. Header with Tab Switches (Live Chat & Inspector) */}
      <div className="h-[36px] min-h-[36px] bg-[#252526] border-b border-[#1e1e1e] px-2 flex items-center justify-between shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {/* Tab 1: Live Chat */}
          <button
            type="button"
            onClick={() => handleTabClick("chat")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === "chat"
                ? "bg-[#1e1e1e] text-cyan-400 border border-[#3e3e42]"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#2d2d2d]"
            }`}
            title="Xem Live Chat & Transcript hội thoại của Agent"
          >
            <div className="relative">
              <MessageSquare className="w-3.5 h-3.5" />
              {isAgentStreaming && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
            <span>Live Chat</span>
            {isAgentStreaming && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block ml-0.5" />
            )}
          </button>

          {/* Tab 2: Inspector */}
          <button
            type="button"
            onClick={() => handleTabClick("inspector")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === "inspector"
                ? "bg-[#1e1e1e] text-cyan-400 border border-[#3e3e42]"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#2d2d2d]"
            }`}
            title="Xem thông số kỹ thuật, trạng thái và token của Agent"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1">
          {/* Pop-out to Modal button when in Live Chat tab */}
          {currentTab === "chat" && selectedAgent && onOpenChatModal && (
            <button
              onClick={onOpenChatModal}
              title="Mở Live Chat dạng Popup (Cửa sổ riêng)"
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-[#333333] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Close Sidebar button */}
          <button
            onClick={onClose}
            title="Đóng thanh bên phụ (Cmd+Alt+B)"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Tab Body Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {currentTab === "chat" ? (
          /* TAB 1: Live Chat View */
          selectedAgent ? (
            <SessionChatView
              sessionTrace={selectedAgent}
              isSidebar={true}
              onClose={onClose}
              onOpenModal={onOpenChatModal}
              onStartReplay={onStartReplay}
            />
          ) : (
            /* Empty State for Live Chat */
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#252526] border border-[#333333] flex items-center justify-center text-slate-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-[280px]">
                <h4 className="font-bold text-slate-300 text-xs">Chưa chọn Agent để xem Live Chat</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bấm vào bất kỳ bàn làm việc nào trên văn phòng ảo hoặc chọn một Agent bên dưới để theo dõi Live Chat:
                </p>
              </div>

              {workstations.length > 0 && (
                <div className="w-full max-w-[280px] space-y-1.5 pt-2 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                    Danh Sách Agent Hiện Có ({workstations.length})
                  </span>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {workstations.map((w, idx) => {
                      const isBusy =
                        w.state === "streaming" ||
                        w.state === "busy" ||
                        w.state === "working" ||
                        w.mode === "streaming";
                      return (
                        <button
                          key={w.connectionId || idx}
                          onClick={() => onSelectAgent?.(w.connectionId || w.traceId)}
                          className="w-full flex items-center justify-between p-2 rounded bg-[#252526] hover:bg-[#2d2d2e] border border-[#333333] hover:border-[#007acc] text-xs transition-colors cursor-pointer text-slate-300"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate font-medium">
                              {w.account || `Desk #${(w.deskIndex ?? idx) + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isBusy && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* TAB 2: Inspector View */
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs select-text">
            {selectedAgent ? (
              <>
                {/* Agent Overview Card */}
                <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#1e1e1e] flex items-center justify-center border border-[#3e3e42]">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-xs">
                          {selectedAgent.account || `Desk #${(selectedAgent.deskIndex ?? 0) + 1}`}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">
                          ID: {selectedAgent.connectionId?.slice(0, 8)}...
                        </p>
                      </div>
                    </div>

                    {/* APP vs CLI badge */}
                    {isApp ? (
                      <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <Smartphone className="w-2.5 h-2.5" />
                        <span>APP</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <Terminal className="w-2.5 h-2.5" />
                        <span>CLI</span>
                      </span>
                    )}
                  </div>

                  {/* Provider & Model */}
                  <div className="pt-2 border-t border-[#2b2b2b] grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">PROVIDER</span>
                      <span className="font-semibold text-slate-300 uppercase">
                        {selectedAgent.provider || "Gemini"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">MODEL</span>
                      <span className="font-semibold text-emerald-400 truncate block">
                        {selectedAgent.model || "gemini-3.8-flash"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* State & Activity Card */}
                <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CURRENT ACTIVITY
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`font-semibold capitalize px-1.5 py-0.2 rounded text-[10px] ${
                        selectedAgent.state === "streaming"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : selectedAgent.state === "busy"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : selectedAgent.state === "error"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {selectedAgent.state || "Idle"}
                    </span>
                  </div>

                  {selectedAgent.activeTool && (
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block">Active Tool:</span>
                      <div className="mt-1 bg-[#181818] p-1.5 rounded border border-[#2b2b2b] font-mono text-[10px] text-cyan-300 truncate">
                        {selectedAgent.activeTool}
                      </div>
                    </div>
                  )}
                </div>

                {/* Token Metrics */}
                <div className="bg-[#252526] border border-[#333333] rounded-lg p-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    TOKEN USAGE
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Total Tokens</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {selectedAgent.tokensTotal ? selectedAgent.tokensTotal.toLocaleString() : 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Requests / Steps</span>
                      <span className="font-bold text-slate-300 font-mono">
                        {selectedAgent.requestCount || 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Support Both Sidebar View & Popup Modal */}
                <div className="space-y-1.5 pt-1">
                  {/* Primary: Switch to Live Chat Sidebar Tab */}
                  <button
                    onClick={() => handleTabClick("chat")}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Xem Live Chat (Sidebar)</span>
                  </button>

                  {/* Secondary: Open Popup Modal */}
                  {onOpenChatModal && (
                    <button
                      onClick={onOpenChatModal}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#252526] hover:bg-[#2d2d2e] text-slate-300 hover:text-white text-xs transition-colors border border-[#3e3e42] cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mở Popup Riêng</span>
                    </button>
                  )}

                  {/* Copy Connection ID */}
                  <button
                    onClick={handleCopyId}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#252526] hover:bg-[#2d2d2e] text-slate-300 text-xs transition-colors border border-[#3e3e42] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Đã copy Connection ID!" : "Copy Connection ID"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#252526] border border-[#333333] flex items-center justify-center mx-auto text-slate-600">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div className="space-y-1 px-4">
                  <h4 className="font-bold text-slate-400 text-xs">Chưa chọn Agent</h4>
                  <p className="text-[11px] leading-relaxed">
                    Click vào bất kỳ bàn làm việc nào trên văn phòng ảo hoặc chọn từ danh sách Explorer bên trái để xem thông số chi tiết.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
