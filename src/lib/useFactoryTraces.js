"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateMockTraces, mockProviderDescriptors, MOCK_PRESETS } from "./mockTraces";

export function useFactoryTraces({ mode = "live", preset = "cases" } = {}) {
  const [traces, setTraces] = useState([]);
  const [providers, setProviders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const eventSourceRef = useRef(null);
  const watchdogTimerRef = useRef(null);

  // Reconnection trigger
  const [connectionEpoch, setConnectionEpoch] = useState(0);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnectionEpoch((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  // 1. Mock Mode
  useEffect(() => {
    if (mode !== "mock") return undefined;

    const cfg = MOCK_PRESETS[preset] || MOCK_PRESETS.cases;
    const updateMock = () => {
      const next = generateMockTraces({ count: cfg.agents, cases: !!cfg.cases, errorRatio: cfg.errorRatio });
      setTraces(next);
      setProviders(mockProviderDescriptors(next));
      setConnected(true);
      setLastUpdated(Date.now());
    };

    updateMock();
    const interval = setInterval(updateMock, 3000);
    return () => clearInterval(interval);
  }, [mode, preset, connectionEpoch]);

  // 2. Live Mode (SSE + Wake-up Watchdog)
  useEffect(() => {
    if (mode !== "live") return undefined;

    let cancelled = false;

    const resetWatchdog = () => {
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
      // If no packet arrives for 7s, force reconnect
      watchdogTimerRef.current = setTimeout(() => {
        if (!cancelled) {
          console.warn("[SSE] Watchdog timeout, reconnecting...");
          setConnectionEpoch((prev) => prev + 1);
        }
      }, 7000);
    };

    try {
      const es = new EventSource("/api/traces/stream?source=live");
      eventSourceRef.current = es;

      es.onopen = () => {
        if (!cancelled) {
          setConnected(true);
          resetWatchdog();
        }
      };

      es.onmessage = (event) => {
        if (cancelled || !event?.data) return;
        try {
          const payload = JSON.parse(event.data);
          if (Array.isArray(payload.traces)) {
            setTraces(payload.traces);
          }
          if (Array.isArray(payload.providers)) {
            setProviders(payload.providers);
          }
          setLastUpdated(Date.now());
          resetWatchdog();
        } catch {
          // ignore ping
        }
      };

      es.onerror = () => {
        if (!cancelled) {
          setConnected(false);
        }
      };
    } catch {
      setConnected(false);
    }

    return () => {
      cancelled = true;
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [mode, connectionEpoch]);

  // 3. Auto-reconnect when laptop wakes up or tab gains focus
  useEffect(() => {
    if (mode !== "live") return undefined;

    const handleWakeup = () => {
      if (document.visibilityState === "visible") {
        console.log("[AgentFactory] Tab active / wake up, refreshing telemetry...");
        refresh();
      }
    };

    window.addEventListener("visibilitychange", handleWakeup);
    window.addEventListener("online", handleWakeup);
    window.addEventListener("focus", handleWakeup);

    return () => {
      window.removeEventListener("visibilitychange", handleWakeup);
      window.removeEventListener("online", handleWakeup);
      window.removeEventListener("focus", handleWakeup);
    };
  }, [mode, refresh]);

  return {
    traces,
    providers,
    connected,
    live: mode === "live",
    isRefreshing,
    refresh,
    lastUpdated,
  };
}
