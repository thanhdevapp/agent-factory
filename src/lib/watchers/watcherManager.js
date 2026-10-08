import { getAntigravityTraces } from "./antigravityWatcher.js";
import { getClaudeTraces } from "./claudeWatcher.js";
import { getCodexTraces } from "./codexWatcher.js";
import { extractProviders } from "../traceContract.js";

/**
 * WatcherManager aggregates traces across all installed CLI watchers
 * (Antigravity, Claude Code, etc.) with automatic fallback and caching.
 */
let cachedSnapshot = { traces: [], errors: [] };
let lastFetchTime = 0;
const CACHE_TTL_MS = 1500; // 1.5s cache to avoid reading disks too frequently

export async function getLiveTraceSnapshot(force = false, maxAgeMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  if (!force && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedSnapshot;
  }

  const results = await Promise.allSettled([
    getAntigravityTraces(maxAgeMs),
    getClaudeTraces(maxAgeMs),
    getCodexTraces(maxAgeMs),
  ]);
  const errors = [];
  const [agyResult, claudeResult, codexResult] = results;
  const agyList = agyResult.status === "fulfilled" ? agyResult.value : [];
  const claudeList = claudeResult.status === "fulfilled" ? claudeResult.value : [];
  const codexList = codexResult.status === "fulfilled" ? codexResult.value : [];
  if (agyResult.status === "rejected") errors.push({ source: "antigravity", message: agyResult.reason?.message || "Watcher failed" });
  if (claudeResult.status === "rejected") errors.push({ source: "claude", message: claudeResult.reason?.message || "Watcher failed" });
  if (codexResult.status === "rejected") errors.push({ source: "codex", message: codexResult.reason?.message || "Watcher failed" });

  const combined = [...agyList, ...claudeList, ...codexList];

  // Sort: active/streaming/pending first, then by most recent startedAt
  combined.sort((a, b) => {
    const activeA = (a.state === "streaming" || a.state === "pending") ? 1 : 0;
    const activeB = (b.state === "streaming" || b.state === "pending") ? 1 : 0;
    if (activeA !== activeB) return activeB - activeA;
    return (b.startedAt || 0) - (a.startedAt || 0);
  });

  cachedSnapshot = { traces: combined, errors };
  lastFetchTime = now;
  return cachedSnapshot;
}

export async function getAllLiveTraces(force = false, maxAgeMs) {
  return (await getLiveTraceSnapshot(force, maxAgeMs)).traces;
}

export function getProvidersFromTraces(traces) {
  return extractProviders(traces);
}
