"use client";

import { useEffect, useState } from "react";
import { generateMockTraces, mockProviderDescriptors, MOCK_PRESETS } from "./mockTraces";

export function useFactoryTraces({ mode = "live", preset = "cases" } = {}) {
  const [traces, setTraces] = useState([]);
  const [providers, setProviders] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (mode === "mock") {
      const cfg = MOCK_PRESETS[preset] || MOCK_PRESETS.cases;
      const initial = generateMockTraces({ count: cfg.agents, cases: !!cfg.cases, errorRatio: cfg.errorRatio });
      setTraces(initial);
      setProviders(mockProviderDescriptors(initial));
      setConnected(true);

      const interval = setInterval(() => {
        const next = generateMockTraces({ count: cfg.agents, cases: !!cfg.cases, errorRatio: cfg.errorRatio });
        setTraces(next);
        setProviders(mockProviderDescriptors(next));
      }, 3000);

      return () => clearInterval(interval);
    }

    // Live Mode via SSE
    let eventSource = null;
    let cancelled = false;

    try {
      eventSource = new EventSource("/api/traces/stream?source=live");

      eventSource.onopen = () => {
        if (!cancelled) setConnected(true);
      };

      eventSource.onmessage = (event) => {
        if (cancelled || !event?.data) return;
        try {
          const payload = JSON.parse(event.data);
          if (Array.isArray(payload.traces)) {
            setTraces(payload.traces);
          }
          if (Array.isArray(payload.providers)) {
            setProviders(payload.providers);
          }
        } catch {
          // ignore non-json ping
        }
      };

      eventSource.onerror = () => {
        if (!cancelled) setConnected(false);
      };
    } catch {
      setConnected(false);
    }

    return () => {
      cancelled = true;
      if (eventSource) eventSource.close();
    };
  }, [mode, preset]);

  return {
    traces,
    providers,
    connected,
    live: mode === "live",
  };
}
