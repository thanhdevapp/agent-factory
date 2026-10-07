"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useFactoryTraces } from "@/lib/useFactoryTraces";
import { buildOffice } from "@/components/factory/scene/office-layout";
import AgentPanel from "@/components/factory/AgentPanel";
import UpdateNotification from "@/components/UpdateNotification";

// Dynamic import of PixiJS Canvas to avoid WebGL execution during SSR
const OfficeCanvas = dynamic(() => import("@/components/factory/office-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#080d14] text-slate-500">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <span className="text-xs font-mono">Initializing Agent Factory Scene...</span>
      </div>
    </div>
  ),
});

const PRESETS = [
  { id: "cases", label: "Edge Cases" },
  { id: "storm", label: "Storm (30 Agents)" },
  { id: "busy", label: "Busy (8 Agents)" },
  { id: "idle", label: "Idle (2 Agents)" },
  { id: "errors", label: "Error States" },
];

export default function FactoryPage() {
  const [mode, setMode] = useState("live");
  const [mockPreset, setMockPreset] = useState("cases");
  const [selectedId, setSelectedId] = useState(null);

  const { traces, connected, live, isRefreshing, refresh } = useFactoryTraces({ mode, preset: mockPreset });

  const office = useMemo(() => buildOffice(traces), [traces]);
  const selected = useMemo(
    () => office.workstations.find((w) => w.connectionId === selectedId) || null,
    [office, selectedId]
  );

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#070b12] text-slate-100">
      <UpdateNotification />

      {/* Top Header / Nav */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-5 backdrop-blur-md">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-500/20">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                AGMON
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                v0.1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI Agent Office & Activity Visualizer</p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs">
            <span className="text-slate-400">Desks:</span>
            <span className="font-bold text-slate-200">{office.stats.agents}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs">
            <span className="text-slate-400">Working:</span>
            <span className="font-bold text-cyan-400">{office.stats.busy}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs">
            <span className="text-slate-400">Tokens:</span>
            <span className="font-bold text-emerald-400">{office.stats.tokensLabel}</span>
          </div>
        </div>

        {/* Mode & Preset Controls */}
        <div className="flex items-center gap-2">
          {/* Force Refresh Button */}
          <button
            onClick={refresh}
            title="Làm mới kết nối & dữ liệu ngay lập tức"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Live Button */}
          <button
            onClick={() => {
              setMode("live");
              setSelectedId(null);
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              mode === "live"
                ? "border border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20"
                : "border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected && live ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" : "bg-slate-500"
              }`}
            />
            Live Watchers
          </button>

          {/* Preset Selector */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/60 p-0.5 text-xs">
            <button
              onClick={() => {
                setMode("mock");
                setSelectedId(null);
              }}
              className={`rounded-md px-2.5 py-1 transition-all ${
                mode === "mock"
                  ? "bg-slate-800 font-medium text-slate-200"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Demo Mock:
            </button>
            <select
              value={mockPreset}
              onChange={(e) => {
                setMode("mock");
                setMockPreset(e.target.value);
                setSelectedId(null);
              }}
              className="bg-transparent px-2 py-1 text-xs text-slate-300 outline-none cursor-pointer"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <section className="relative flex-1 p-3">
        <OfficeCanvas
          traces={traces}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />

        {/* Selected Agent Inspector */}
        <AgentPanel ws={selected} onClose={() => setSelectedId(null)} />
      </section>
    </main>
  );
}
