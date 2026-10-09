import { getAntigravityTraces } from "./antigravityWatcher.js";
import { getClaudeTraces } from "./claudeWatcher.js";
import { getCodexTraces } from "./codexWatcher.js";
import { extractProviders } from "../traceContract.js";

/**
 * WatcherManager aggregates traces across all installed CLI watchers
 * (Antigravity, Claude Code, etc.) with automatic fallback and caching.
 */
let cachedCombined = [];
let cachedErrors = [];
let lastFetchTime = 0;
let lastMaxAgeMs = null;
let inFlightPromise = null;
const CACHE_TTL_MS = 2500; // 2.5s cache to avoid reading disks too frequently

export function getCachedTraceSnapshot(limit = 0) {
  if (cachedCombined.length === 0) return null;
  const totalCount = cachedCombined.length;
  const sliced = (limit > 0 && limit < totalCount) ? cachedCombined.slice(0, limit) : cachedCombined;
  return {
    traces: sliced,
    totalCount,
    errors: cachedErrors,
  };
}

export async function getLiveTraceSnapshot(force = false, maxAgeMs = 24 * 60 * 60 * 1000, limit = 0) {
  const now = Date.now();
  const isCacheValid = !force && (now - lastFetchTime < CACHE_TTL_MS) && (lastMaxAgeMs === maxAgeMs) && (cachedCombined.length > 0);

  if (isCacheValid) {
    const totalCount = cachedCombined.length;
    const sliced = (limit > 0 && limit < totalCount) ? cachedCombined.slice(0, limit) : cachedCombined;
    return { traces: sliced, totalCount, errors: cachedErrors };
  }

  if (!inFlightPromise) {
    inFlightPromise = (async () => {
      try {
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

        cachedCombined = combined;
        cachedErrors = errors;
        lastMaxAgeMs = maxAgeMs;
        lastFetchTime = Date.now();
      } finally {
        inFlightPromise = null;
      }
    })();
  }

  await inFlightPromise;

  const totalCount = cachedCombined.length;
  const sliced = (limit > 0 && limit < totalCount) ? cachedCombined.slice(0, limit) : cachedCombined;

  return {
    traces: sliced,
    totalCount,
    errors: cachedErrors,
  };
}

export async function getAllLiveTraces(force = false, maxAgeMs, limit = 0) {
  return (await getLiveTraceSnapshot(force, maxAgeMs, limit)).traces;
}

export function getProvidersFromTraces(traces) {
  return extractProviders(traces);
}
