"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import LeftSidebar from "./LeftSidebar";
import EditorTabs from "./EditorTabs";
import BottomPanel from "./BottomPanel";
import RightSidebar from "./RightSidebar";
import StatusBar from "./StatusBar";
import CommandPalette from "./CommandPalette";
import OfficeCanvas from "../factory/office-canvas";
import AgentGraphView from "../factory/AgentGraphView";
import SessionChatModal from "../chat/SessionChatModal";
import TokenReportView from "../reports/TokenReportView";
import { useSessionReplay } from "../../lib/useSessionReplay";
import { synthesizeTraceFromKeyframe } from "../../lib/parsers/replayParser";
import { buildOffice } from "../factory/scene/office-layout";
import { ReplayModeOverlay } from "../replay";
import {
  DEFAULT_WORKBENCH_LAYOUT,
  loadWorkbenchLayout,
  saveWorkbenchLayout,
} from "./layoutStore";

export default function VSCodeWorkbench({
  traces = [],
  office = { workstations: [], stats: {} },
  mode = "live",
  mockPreset = "cases",
  onModeChange,
  onPresetChange,
  connected = true,
  live = true,
  isRefreshing = false,
  onRefresh,
  soundEnabled = false,
  onToggleSound,
  notifEnabled = false,
  onToggleNotif,
}) {
  // Initialize with DEFAULT_WORKBENCH_LAYOUT for SSR & hydration consistency
  const [layout, setLayout] = useState(DEFAULT_WORKBENCH_LAYOUT);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTabId, setActiveTabId] = useState("canvas");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Time-Machine Replay State
  const [replaySessionId, setReplaySessionId] = useState(null);
  const replay = useSessionReplay(replaySessionId);

  const handleStartReplay = useCallback((id) => {
    const targetId = id || selectedId || traces[0]?.connectionId || traces[0]?.traceId || "default-session";
    setReplaySessionId(targetId);
    setSelectedId(targetId);
    setActiveTabId("canvas");
  }, [selectedId, traces]);

  const handleExitReplay = useCallback(() => {
    setReplaySessionId(null);
  }, []);

  // Tabs state
  const [tabs, setTabs] = useState(() => [
    { id: "canvas", title: "Virtual Office", type: "canvas", closable: false },
  ]);

  // Load layout from localStorage only after initial client mount
  useEffect(() => {
    const saved = loadWorkbenchLayout();
    setLayout(saved);
    if (saved.activeEditorTab) {
      setActiveTabId(saved.activeEditorTab);
    }
    if (saved.openedTabs && Array.isArray(saved.openedTabs) && saved.openedTabs.length > 0) {
      setTabs(saved.openedTabs);
    }
    setIsHydrated(true);
  }, []);

  // Persist layout changes only after initial hydration
  useEffect(() => {
    if (isHydrated) {
      saveWorkbenchLayout(layout);
    }
  }, [layout, isHydrated]);

  // Synthesize trace snapshot from replay keyframe
  const replayingTrace = useMemo(() => {
    if (!replaySessionId || !replay.currentKeyframe) return null;
    return synthesizeTraceFromKeyframe(replay.currentKeyframe, replay.sessionInfo);
  }, [replaySessionId, replay.currentKeyframe, replay.sessionInfo]);

  // Synchronize traces and office geometry during Replay vs Live
  const effectiveTraces = useMemo(() => {
    if (replayingTrace) {
      return [replayingTrace];
    }
    return traces;
  }, [replayingTrace, traces]);

  const effectiveOffice = useMemo(() => {
    if (replayingTrace) {
      return buildOffice(effectiveTraces);
    }
    return office;
  }, [replayingTrace, effectiveTraces, office]);

  // Selected workstation object (fallback to traces list if not found in workstations)
  const selectedAgent = useMemo(() => {
    if (!selectedId) return null;
    return (
      effectiveOffice.workstations.find(
        (w) => w.connectionId === selectedId || w.traceId === selectedId || w.traces?.[0]?.traceId === selectedId
      ) ||
      effectiveTraces.find(
        (t) => t.connectionId === selectedId || t.traceId === selectedId || t.traces?.[0]?.traceId === selectedId
      ) ||
      null
    );
  }, [effectiveOffice.workstations, effectiveTraces, selectedId]);

  // If an agent is selected, ensure right sidebar is visible or open a tab
  const handleSelectAgent = useCallback((id) => {
    setSelectedId(id);
    if (id) {
      setLayout((prev) => ({ ...prev, isRightSidebarVisible: true }));
    }
  }, []);

  // Open an agent tab
  const handleOpenAgentTab = useCallback((agent) => {
    if (!agent) return;
    const tabId = `agent-${agent.connectionId}`;
    setTabs((prev) => {
      const exists = prev.find((t) => t.id === tabId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: tabId,
          title: agent.account || `Desk #${agent.deskIndex + 1}`,
          type: "agent",
          agentData: agent,
          closable: true,
        },
      ];
    });
    setActiveTabId(tabId);
  }, []);

  const handleCloseTab = useCallback((id) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      return next.length > 0 ? next : [{ id: "canvas", title: "Virtual Office", type: "canvas", closable: false }];
    });
    setActiveTabId((current) => (current === id ? "canvas" : current));
  }, []);

  const handleOpenReports = useCallback(() => {
    setTabs((prev) => {
      if (prev.find((t) => t.id === "reports")) return prev;
      return [
        ...prev,
        { id: "reports", title: "Báo Cáo Token", type: "reports", closable: true },
      ];
    });
    setActiveTabId("reports");
  }, []);

  const handleOpenNetwork = useCallback(() => {
    setTabs((prev) => {
      if (prev.find((t) => t.id === "network")) return prev;
      return [
        ...prev,
        { id: "network", title: "Multi-Agent Graph", type: "network", closable: true },
      ];
    });
    setActiveTabId("network");
  }, []);

  // Keyboard shortcuts (Cmd+B, Cmd+J, Cmd+Alt+B, Cmd+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd+Shift+P -> Command Palette
      if (modKey && e.shiftKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Cmd+B -> Toggle Left Sidebar
      if (modKey && !e.shiftKey && !e.altKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        setLayout((prev) => ({ ...prev, isLeftSidebarVisible: !prev.isLeftSidebarVisible }));
        return;
      }

      // Cmd+J -> Toggle Bottom Panel
      if (modKey && (e.key === "j" || e.key === "J" || e.key === "`")) {
        e.preventDefault();
        setLayout((prev) => ({ ...prev, isBottomPanelVisible: !prev.isBottomPanelVisible }));
        return;
      }

      // Cmd+Alt+B -> Toggle Right Sidebar
      if (modKey && e.altKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        setLayout((prev) => ({ ...prev, isRightSidebarVisible: !prev.isRightSidebarVisible }));
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // When separator is dragged, dispatch resize event to keep Pixi.js Canvas crisp
  const handlePanelResize = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  // Active tab item
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  // Memoized telemetry JSON preview to prevent DOM thrashing and CPU serialization overhead
  const telemetryJsonPreview = useMemo(() => {
    if (activeTabId !== "telemetry") return "";
    const previewList = effectiveTraces.length > 30 ? effectiveTraces.slice(-30) : effectiveTraces;
    try {
      return JSON.stringify(previewList, null, 2);
    } catch {
      return "[]";
    }
  }, [activeTabId, effectiveTraces]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#181818] text-[#cccccc] font-sans antialiased">
      {/* 1. VS Code Standard TitleBar (34px) */}
      <TitleBar
        stats={office.stats}
        mode={mode}
        mockPreset={mockPreset}
        onModeChange={onModeChange}
        onPresetChange={onPresetChange}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        notifEnabled={notifEnabled}
        onToggleNotif={onToggleNotif}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenReports={handleOpenReports}
        layout={layout}
        onToggleLeftSidebar={() =>
          setLayout((p) => ({ ...p, isLeftSidebarVisible: !p.isLeftSidebarVisible }))
        }
        onToggleBottomPanel={() =>
          setLayout((p) => ({ ...p, isBottomPanelVisible: !p.isBottomPanelVisible }))
        }
        onToggleRightSidebar={() =>
          setLayout((p) => ({ ...p, isRightSidebarVisible: !p.isRightSidebarVisible }))
        }
      />

      {/* 2. Middle Body: ActivityBar + Horizontal Resizable Panels */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Activity Bar (48px) */}
        <ActivityBar
          activeView={layout.activeActivityView}
          isRightSidebarVisible={layout.isRightSidebarVisible}
          activeRightSidebarTab={layout.activeRightSidebarTab || "chat"}
          onViewChange={(view) => {
            if (view === "chat") {
              setLayout((p) => {
                const isCurrentlyChat =
                  p.isRightSidebarVisible && p.activeRightSidebarTab === "chat";
                return {
                  ...p,
                  isRightSidebarVisible: !isCurrentlyChat,
                  activeRightSidebarTab: "chat",
                };
              });
            } else if (view === "office") {
              setActiveTabId("canvas");
            } else if (view === "network") {
              handleOpenNetwork();
            } else if (view === "reports") {
              handleOpenReports();
            } else if (view === "telemetry") {
              // Open telemetry tab
              setTabs((prev) => {
                if (prev.find((t) => t.id === "telemetry")) return prev;
                return [
                  ...prev,
                  { id: "telemetry", title: "Live Telemetry", type: "telemetry", closable: true },
                ];
              });
              setActiveTabId("telemetry");
            } else {
              setLayout((p) => ({
                ...p,
                activeActivityView: view,
                isLeftSidebarVisible: p.activeActivityView === view ? !p.isLeftSidebarVisible : true,
              }));
            }
          }}
          agentCount={office.stats?.busy || 0}
          isBottomPanelVisible={layout.isBottomPanelVisible}
          onToggleBottomPanel={() =>
            setLayout((p) => ({ ...p, isBottomPanelVisible: !p.isBottomPanelVisible }))
          }
          onOpenSettings={() => setIsCommandPaletteOpen(true)}
        />

        {/* Resizable Panels Group */}
        <Group
          orientation="horizontal"
          className="flex-1 h-full overflow-hidden"
          onLayoutChange={handlePanelResize}
        >
          {/* Left Primary Sidebar */}
          {layout.isLeftSidebarVisible && (
            <>
              <Panel
                id="left-sidebar-panel"
                defaultSize="260px"
                minSize="180px"
                maxSize="450px"
                className="overflow-hidden h-full"
              >
                <LeftSidebar
                  workstations={effectiveOffice.workstations}
                  selectedId={selectedId}
                  onSelectAgent={handleSelectAgent}
                  onOpenAgentTab={handleOpenAgentTab}
                  stats={effectiveOffice.stats}
                  onRefresh={onRefresh}
                  onStartReplay={handleStartReplay}
                />
              </Panel>
              <Separator
                className="w-1 bg-[#181818] hover:bg-[#007acc] active:bg-[#007acc] transition-colors cursor-col-resize z-20 shrink-0"
              />
            </>
          )}

          {/* Center Main Area: Editor + Resizable Bottom Drawer */}
          <Panel id="center-main-panel" minSize="350px" className="overflow-hidden flex flex-col h-full bg-[#1e1e1e]">
            <Group
              orientation="vertical"
              className="h-full w-full overflow-hidden"
              onLayoutChange={handlePanelResize}
            >
              {/* Editor Tabs & Body */}
              <Panel id="editor-area-panel" minSize="160px" className="overflow-hidden flex flex-col h-full">
                <EditorTabs
                  tabs={tabs}
                  activeTabId={activeTabId}
                  onSelectTab={setActiveTabId}
                  onCloseTab={handleCloseTab}
                />

                {/* Editor Content */}
                <div className="flex-1 relative overflow-hidden bg-[#070b12]">
                  {replaySessionId ? (
                    <ReplayModeOverlay replay={replay} onExit={handleExitReplay}>
                      <div className="absolute inset-0">
                        {activeTabId === "network" ? (
                          <AgentGraphView
                            traces={effectiveTraces}
                            selectedTraceId={selectedId}
                            onSelectTrace={(t) => {
                              const id = t.traceId || t.connectionId;
                              setSelectedId(id);
                              setLayout((prev) => ({
                                ...prev,
                                isRightSidebarVisible: true,
                                activeRightSidebarTab: "chat",
                              }));
                            }}
                          />
                        ) : (
                          <OfficeCanvas
                            traces={effectiveTraces}
                            selectedId={selectedId}
                            onSelect={(id) => handleSelectAgent(id)}
                          />
                        )}
                      </div>
                    </ReplayModeOverlay>
                  ) : (
                    <>
                      {/* Tab 1: Virtual Office Canvas */}
                      <div
                        className={`absolute inset-0 transition-opacity ${
                          activeTabId === "canvas" ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                        }`}
                      >
                        <OfficeCanvas
                          traces={effectiveTraces}
                          selectedId={selectedId}
                          onSelect={(id) => handleSelectAgent(id)}
                        />
                      </div>

                      {/* Tab 2: Telemetry Stream */}
                      {activeTabId === "telemetry" && (
                        <div className="absolute inset-0 p-4 overflow-auto font-mono text-xs bg-[#181818] text-slate-300">
                          <div className="mb-3 flex items-center justify-between pb-2 border-b border-[#333333]">
                            <h3 className="font-bold text-sm text-cyan-400">Realtime Telemetry Snapshots</h3>
                            <span className="text-slate-500">
                              {effectiveTraces.length} active sessions
                              {effectiveTraces.length > 30 ? " (latest 30)" : ""}
                            </span>
                          </div>
                          <pre className="bg-[#121212] p-4 rounded border border-[#2b2b2b] text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
                            {telemetryJsonPreview}
                          </pre>
                        </div>
                      )}

                      {/* Tab 3: Specific Agent View */}
                      {activeTab?.type === "agent" && (
                        <div className="absolute inset-0 p-4 overflow-auto bg-[#1e1e1e] text-slate-200">
                          <div className="max-w-3xl mx-auto space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[#252526] rounded-lg border border-[#333333]">
                              <div>
                                <h2 className="text-base font-bold text-white">
                                  {activeTab.title}
                                </h2>
                                <p className="text-xs text-slate-400">
                                  Connection ID: {activeTab.agentData?.connectionId}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStartReplay(activeTab.agentData?.connectionId)}
                                  className="px-3 py-1.5 bg-[#252526] hover:bg-[#333333] border border-[#3e3e42] text-cyan-300 rounded text-xs font-semibold cursor-pointer"
                                >
                                  Tua Lại Phiên
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedId(activeTab.agentData?.connectionId);
                                    setLayout((prev) => ({
                                      ...prev,
                                      isRightSidebarVisible: true,
                                      activeRightSidebarTab: "chat",
                                    }));
                                  }}
                                  className="px-3 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Xem Live Chat (Sidebar)</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedId(activeTab.agentData?.connectionId);
                                    setIsChatModalOpen(true);
                                  }}
                                  className="p-1.5 bg-[#252526] hover:bg-[#333333] border border-[#3e3e42] text-slate-300 hover:text-white rounded text-xs cursor-pointer"
                                  title="Mở dạng Popup riêng"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 4: Token Reports & Analytics */}
                      {activeTabId === "reports" && (
                        <div className="absolute inset-0 overflow-hidden bg-[#181818] z-20">
                          <TokenReportView
                            onClose={() => handleCloseTab("reports")}
                            onStartReplay={handleStartReplay}
                          />
                        </div>
                      )}

                      {/* Tab 5: Multi-Agent Collaboration DAG Graph */}
                      {activeTabId === "network" && (
                        <div className="absolute inset-0 overflow-hidden bg-slate-950 z-20">
                          <AgentGraphView
                            traces={effectiveTraces}
                            selectedTraceId={selectedId}
                            onSelectTrace={(t) => {
                              const id = t.traceId || t.connectionId;
                              setSelectedId(id);
                              setLayout((prev) => ({
                                ...prev,
                                isRightSidebarVisible: true,
                                activeRightSidebarTab: "chat",
                              }));
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Panel>

              {/* Bottom Resizable Panel (Logs / Terminal) */}
              {layout.isBottomPanelVisible && (
                <>
                  <Separator
                    className="h-1 bg-[#181818] hover:bg-[#007acc] active:bg-[#007acc] transition-colors cursor-row-resize z-20 shrink-0"
                  />
                  <Panel
                    id="bottom-panel"
                    defaultSize="220px"
                    minSize="90px"
                    maxSize="600px"
                    className="overflow-hidden bg-[#181818]"
                  >
                    <BottomPanel
                      traces={effectiveTraces}
                      activeTab={layout.activeBottomTab}
                      onTabChange={(tab) =>
                        setLayout((p) => ({ ...p, activeBottomTab: tab }))
                      }
                      onClose={() =>
                        setLayout((p) => ({ ...p, isBottomPanelVisible: false }))
                      }
                    />
                  </Panel>
                </>
              )}
            </Group>
          </Panel>

          {/* Secondary Right Sidebar (Inspector & Live Chat) */}
          {layout.isRightSidebarVisible && (
            <>
              <Separator
                className="w-1 bg-[#181818] hover:bg-[#007acc] active:bg-[#007acc] transition-colors cursor-col-resize z-20 shrink-0"
              />
              <Panel
                id="right-sidebar-panel"
                defaultSize="360px"
                minSize="260px"
                maxSize="750px"
                className="overflow-hidden h-full bg-[#252526]"
              >
                <RightSidebar
                  selectedAgent={selectedAgent}
                  workstations={effectiveOffice.workstations}
                  activeTab={layout.activeRightSidebarTab || "chat"}
                  onTabChange={(tab) =>
                    setLayout((p) => ({ ...p, activeRightSidebarTab: tab }))
                  }
                  onSelectAgent={handleSelectAgent}
                  onClose={() =>
                    setLayout((p) => ({ ...p, isRightSidebarVisible: false }))
                  }
                  onOpenChatModal={() => setIsChatModalOpen(true)}
                  onStartReplay={handleStartReplay}
                />
              </Panel>
            </>
          )}
        </Group>
      </div>

      {/* 3. VS Code Standard StatusBar (22px) */}
      <StatusBar
        mode={mode}
        connected={connected}
        live={live}
        stats={effectiveOffice.stats}
        selectedAgent={selectedAgent}
        soundEnabled={soundEnabled}
        isBottomOpen={layout.isBottomPanelVisible}
        onToggleBottom={() =>
          setLayout((p) => ({ ...p, isBottomPanelVisible: !p.isBottomPanelVisible }))
        }
      />

      {/* Command Palette Modal (Cmd+Shift+P) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onToggleLeftSidebar={() =>
          setLayout((p) => ({ ...p, isLeftSidebarVisible: !p.isLeftSidebarVisible }))
        }
        onToggleBottomPanel={() =>
          setLayout((p) => ({ ...p, isBottomPanelVisible: !p.isBottomPanelVisible }))
        }
        onToggleRightSidebar={() =>
          setLayout((p) => ({ ...p, isRightSidebarVisible: !p.isRightSidebarVisible }))
        }
        onOpenChatSidebar={() =>
          setLayout((p) => ({ ...p, isRightSidebarVisible: true, activeRightSidebarTab: "chat" }))
        }
        onOpenChatModal={() => setIsChatModalOpen(true)}
        onToggleSound={onToggleSound}
        onToggleNotif={onToggleNotif}
        onRefresh={onRefresh}
        onSetMode={onModeChange}
        onSelectPreset={onPresetChange}
        onOpenReports={handleOpenReports}
        onStartReplay={handleStartReplay}
      />

      {/* Session Chat Transcript Modal */}
      {isChatModalOpen && selectedAgent && (
        <SessionChatModal
          sessionTrace={selectedAgent}
          onClose={() => setIsChatModalOpen(false)}
          onDockToSidebar={(agent) => {
            setIsChatModalOpen(false);
            if (agent) {
              setSelectedId(agent.connectionId || agent.traceId);
            }
            setLayout((prev) => ({
              ...prev,
              isRightSidebarVisible: true,
              activeRightSidebarTab: "chat",
            }));
          }}
          onStartReplay={handleStartReplay}
        />
      )}
    </div>
  );
}
