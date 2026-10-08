"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateMockTraces, mockProviderDescriptors, MOCK_PRESETS } from "./mockTraces";
import { playTick, playComplete, playAlarm, playNeedInput } from "./soundFx";
import { notifyAgentDone, notifyAgentAlert } from "./notifications";

export function useFactoryTraces({ mode = "live", preset = "cases" } = {}) {
  const [traces, setTraces] = useState([]);
  const [providers, setProviders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const eventSourceRef = useRef(null);
  const watchdogTimerRef = useRef(null);
  const prevStatusesRef = useRef(new Map());

  const triggerSoundEffects = useCallback((nextTraces) => {
    if (!Array.isArray(nextTraces) || nextTraces.length === 0) return;
    const prevMap = prevStatusesRef.current;
    let hasStreaming = false;

    for (const t of nextTraces) {
      const id = t.connectionId || t.id;
      const prevStatus = prevMap.get(id);
      const currStatus = t.state;

      if (currStatus === "streaming") {
        hasStreaming = true;
      }

      if (t.isLooping && !prevMap.get(`${id}_looping`)) {
        playAlarm();
        notifyAgentAlert(t.account || id, "Runaway loop detected! Repeated tool calls.");
        prevMap.set(`${id}_looping`, true);
      } else if (!t.isLooping) {
        prevMap.delete(`${id}_looping`);
      }

      if (prevStatus && prevStatus !== currStatus) {
        if (currStatus === "done") {
          playComplete();
          notifyAgentDone(t.account || id, "All tasks finished successfully.");
        } else if (currStatus === "error" || currStatus === "rate_limit" || currStatus === "quota") {
          playAlarm();
          notifyAgentAlert(t.account || id, `Execution failed (${t.error || currStatus})`);
        } else if (currStatus === "waiting_input") {
          playNeedInput();
        }
      }

      prevMap.set(id, currStatus);
    }

    // Garbage collect dead session IDs to prevent unbounded memory growth in long-running tabs
    if (prevMap.size > 100) {
      const activeIds = new Set(nextTraces.map((t) => t.connectionId || t.id));
      for (const key of prevMap.keys()) {
        const baseId = key.endsWith("_looping") ? key.replace("_looping", "") : key;
        if (!activeIds.has(baseId)) {
          prevMap.delete(key);
        }
      }
    }

    if (hasStreaming) {
      playTick();
    }
  }, []);

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
      const next = generateMockTraces({ count: cfg.agents, cases: !!cfg.cases, errorRatio: cfg.errorRatio, preset });
      setTraces(next);
      triggerSoundEffects(next);
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
            triggerSoundEffects(payload.traces);
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

  // 3. Auto-reconnect when laptop wakes up or tab gains focus (debounced & safe)
  useEffect(() => {
    if (mode !== "live") return undefined;

    let wakeupTimer = null;
    const handleWakeup = () => {
      if (document.visibilityState === "visible") {
        if (wakeupTimer) clearTimeout(wakeupTimer);
        wakeupTimer = setTimeout(() => {
          const es = eventSourceRef.current;
          // If SSE is already healthy and active, no need to tear down the connection
          if (!es || es.readyState !== EventSource.OPEN) {
            console.log("[AgentFactory] Tab active / wake up, reconnecting telemetry stream...");
            refresh();
          } else {
            console.log("[AgentFactory] Tab active / wake up, stream is already active.");
          }
        }, 300);
      }
    };

    window.addEventListener("visibilitychange", handleWakeup);
    window.addEventListener("online", handleWakeup);
    window.addEventListener("focus", handleWakeup);

    return () => {
      if (wakeupTimer) clearTimeout(wakeupTimer);
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
