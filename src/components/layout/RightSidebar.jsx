"use client";

import React from "react";
import {
  SlidersHorizontal,
  X,
  Cpu,
  Sparkles,
  Terminal,
  Activity,
  FolderOpen,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

export default function RightSidebar({
  selectedAgent = null,
  onClose,
  onOpenChatModal,
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    if (!selectedAgent?.connectionId) return;
    navigator.clipboard?.writeText(selectedAgent.connectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApp =
    selectedAgent?.clientType === "app" ||
    (selectedAgent?.provider || "").toLowerCase().includes("(app)");

  return (
    <div
      data-testid="secondary-sidebar-container"
      className="flex flex-col h-full w-full bg-[#252526] text-[#cccccc] select-none overflow-hidden"
    >
      {/* Header */}
      <div className="h-[35px] min-h-[35px] bg-[#252526] border-b border-[#1e1e1e] px-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#007acc]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb]">
            INSPECTOR
          </span>
        </div>
        <button
          onClick={onClose}
          title="Đóng thanh bên phụ (Cmd+Alt+B)"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs select-text">
        {selectedAgent ? (
          <>
            {/* Agent Overview Card */}
            <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#2a2d2e] flex items-center justify-center border border-[#3e3e42]">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-xs">
                      {selectedAgent.account || `Desk #${selectedAgent.deskIndex + 1}`}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      ID: {selectedAgent.connectionId?.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                {/* APP vs CLI badge */}
                {isApp ? (
                  <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    APP
                  </span>
                ) : (
                  <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    CLI
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
            <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-3 space-y-2">
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
            <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-3 space-y-2">
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

            {/* Actions */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={onOpenChatModal}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium text-xs transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Xem Live Chat / Transcript</span>
              </button>

              <button
                onClick={handleCopyId}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#2a2d2e] hover:bg-[#333333] text-slate-300 text-xs transition-colors border border-[#3e3e42]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Đã copy Connection ID!" : "Copy Connection ID"}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#333333] flex items-center justify-center mx-auto text-slate-600">
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
    </div>
  );
}
