"use client";

import { useEffect, useMemo, useState } from "react";
import VSCodeWorkbench from "../components/layout/VSCodeWorkbench";
import { useFactoryTraces } from "../lib/useFactoryTraces";
import { buildOffice } from "../components/factory/scene/office-layout";
import UpdateNotification from "../components/UpdateNotification";
import { isAudioMuted, toggleAudio } from "../lib/soundFx";
import { isNotificationsEnabled, toggleNotifications } from "../lib/notifications";

export default function FactoryPage() {
  const [mode, setMode] = useState("live");
  const [mockPreset, setMockPreset] = useState("cases");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    setSoundEnabled(!isAudioMuted());
    setNotifEnabled(isNotificationsEnabled());
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const src = params.get("source") || params.get("mode");
      if (src === "mock") setMode("mock");
      const p = params.get("preset");
      if (p) setMockPreset(p);
    }
  }, []);

  const {
    traces,
    totalCount,
    top,
    setTop,
    timeframe,
    setTimeframe,
    connected,
    live,
    isRefreshing,
    refresh,
  } = useFactoryTraces({
    mode,
    preset: mockPreset,
  });

  const office = useMemo(() => buildOffice(traces), [traces]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[var(--bg-workbench)]">
      <UpdateNotification />
      <VSCodeWorkbench
        traces={traces}
        totalCount={totalCount}
        top={top}
        onTopChange={setTop}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        office={office}
        mode={mode}
        mockPreset={mockPreset}
        onModeChange={(m) => setMode(m)}
        onPresetChange={(p) => setMockPreset(p)}
        connected={connected}
        live={live}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = toggleAudio();
          setSoundEnabled(next);
        }}
        notifEnabled={notifEnabled}
        onToggleNotif={() => {
          const next = toggleNotifications();
          setNotifEnabled(next);
        }}
      />
    </main>
  );
}
