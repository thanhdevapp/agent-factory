import { getAntigravityTraces } from "./antigravityWatcher.js";
import { getClaudeTraces } from "./claudeWatcher.js";
import { extractProviders } from "../traceContract.js";

/**
 * WatcherManager aggregates traces across all installed CLI watchers
 * (Antigravity, Claude Code, etc.) with automatic fallback and caching.
 */
let cachedTraces = [];
let lastFetchTime = 0;
const CACHE_TTL_MS = 1500; // 1.5s cache to avoid reading disks too frequently

export async function getAllLiveTraces(force = false, maxAgeMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  if (!force && now - lastFetchTime < CACHE_TTL_MS && cachedTraces.length > 0) {
    return cachedTraces;
  }

  const [agyList, claudeList] = await Promise.all([
    getAntigravityTraces(maxAgeMs).catch(() => []),
    getClaudeTraces(maxAgeMs).catch(() => []),
  ]);

  const combined = [...agyList, ...claudeList];

  // Sort: active/streaming/pending first, then by most recent startedAt
  combined.sort((a, b) => {
    const activeA = (a.state === "streaming" || a.state === "pending") ? 1 : 0;
    const activeB = (b.state === "streaming" || b.state === "pending") ? 1 : 0;
    if (activeA !== activeB) return activeB - activeA;
    return (b.startedAt || 0) - (a.startedAt || 0);
  });

  cachedTraces = combined;
  lastFetchTime = now;
  return combined;
}

export function getProvidersFromTraces(traces) {
  return extractProviders(traces);
}
