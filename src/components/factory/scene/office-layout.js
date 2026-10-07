// Maps the frozen trace contract onto positions in a virtual office.
//
// Everything here derives from build-factory-graph's grouping so the scene and
// the topology view agree on what an "account" is. No new data model.

export const STATE_COLORS = {
  pending: 0xf59e0b,
  streaming: 0x22d3ee,
  done: 0x34d399,
  error: 0xef4444,
};

// A finished account that has been quiet this long is shown asleep.
export const SLEEP_AFTER_MS = 32000;

export const STATE_LABELS = {
  pending: "Queued",
  streaming: "Working",
  done: "Done",
  error: "Failed",
};

// Office geometry, in world units (the camera scales these to the viewport).
export const OFFICE = {
  floorY: 820,
  agentCols: 6,
  agentRows: 5,
  deskW: 150,
  deskH: 84,
  colGap: 200,
  rowGap: 170,
  originX: 60,
  rackX: 1500,
  rackY: 480,
  podX: 1860,
  podGap: 104,
  podCapacity: 4,
};

function humanSize(n) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/**
 * Build the scene graph: one workstation per account, one rack, one pod per
 * provider.
 *
 * @param {Array} traces  Records in the frozen contract shape.
 * @returns {{ workstations: Array, rack: object, pods: Array, stats: object }}
 */
export function buildOffice(traces = []) {
  const byAccount = new Map();

  for (const trace of traces) {
    if (!trace?.connectionId) continue;
    let entry = byAccount.get(trace.connectionId);
    if (!entry) {
      entry = {
        connectionId: trace.connectionId,
        account: trace.account || trace.connectionId,
        model: trace.model,
        provider: trace.provider,
        clientIcon: trace.clientIcon,
        traces: [],
        tokens: { input: 0, output: 0, cached: 0 },
        activeCount: 0,
        errorCount: 0,
        tools: [],
        errorReason: null,
        fallbackFrom: null,
        queued: 0,
        elapsedMs: 0,
        cost: 0,
        pendingCount: 0,
        isLooping: false,
        logs: [],
      };
      byAccount.set(trace.connectionId, entry);
    }
    entry.traces.push(trace);
    if (trace.isLooping) entry.isLooping = true;
    if (Array.isArray(trace.logs) && trace.logs.length > 0) entry.logs = trace.logs;
    if (trace.currentCommand && !entry.currentCommand) entry.currentCommand = trace.currentCommand;
    for (const call of trace.toolCalls || []) {
      const toolName = call.tool || call.type;
      if (toolName && !entry.tools.includes(toolName)) entry.tools.push(toolName);
    }
    entry.tokens.input += trace.tokens?.input || 0;
    entry.tokens.output += trace.tokens?.output || 0;
    entry.tokens.cached += trace.tokens?.cached || 0;
    entry.queued += Math.max(1, trace.concurrent || 1);
    entry.elapsedMs = Math.max(entry.elapsedMs, trace.elapsedMs || 0);
    entry.cost += trace.cost || 0;
    if (trace.fallback?.from && !entry.fallbackFrom) entry.fallbackFrom = trace.fallback.from;
    if (trace.state === "error") {
      entry.errorCount += 1;
      entry.errorReason = entry.errorReason || trace.error || "error";
    } else if (trace.state !== "done") {
      entry.activeCount += 1;
      if (trace.state === "pending") entry.pendingCount += 1;
    }
  }

  const workstations = [...byAccount.values()].map((entry, i) => {
    const col = i % OFFICE.agentCols;
    const row = Math.floor(i / OFFICE.agentCols);
    // Only even rows get a character: half the desks are empty, which reads as a
    // real office rather than a fully packed grid.
    // Every account has an agent at its desk; what they are doing is `mode`.
    const occupied = true;
    const isLooping = Boolean(entry.isLooping);
    const state = entry.errorCount > 0 ? "error" : entry.activeCount > 0 ? "streaming" : "done";
    const mode =
      isLooping
        ? "looping"
        : state === "error"
          ? "error"
          : state === "streaming"
            ? entry.pendingCount === entry.activeCount
              ? "pending"
              : "streaming"
            : entry.elapsedMs >= SLEEP_AFTER_MS
              ? "sleeping"
              : "happy";
    const totalTokens = entry.tokens.input + entry.tokens.output + entry.tokens.cached;
    const cachedPct = totalTokens ? Math.round((entry.tokens.cached / totalTokens) * 100) : 0;
    return {
      ...entry,
      occupied,
      state,
      mode,
      isLooping,
      logs: entry.logs,
      cachedPct,
      cost: Math.round(entry.cost * 100) / 100,
      color: isLooping ? 0xf43f5e : STATE_COLORS[state],
      totalTokens: entry.tokens.input + entry.tokens.output + entry.tokens.cached,
      totalLabel: humanSize(entry.tokens.input + entry.tokens.output + entry.tokens.cached),
      count: entry.traces.length,
      x: OFFICE.originX + col * OFFICE.colGap,
      y: OFFICE.floorY - row * OFFICE.rowGap,
      // Desks further back are drawn first and slightly smaller.
      depth: 1,
      busy: entry.activeCount,
    };
  });

  const providers = [...new Set(workstations.map((w) => w.provider).filter(Boolean))];

  const pods = providers.map((provider, i) => {
    const clients = workstations.filter((w) => w.provider === provider);
    const busy = clients.reduce((s, w) => s + w.busy, 0);
    const tokens = clients.reduce((s, w) => s + w.totalTokens, 0);
    const anyError = clients.some((w) => w.state === "error");
    return {
      provider,
      x: OFFICE.podX,
      y: OFFICE.rackY - ((providers.length - 1) * OFFICE.podGap) / 2 + i * OFFICE.podGap,
      busy,
      load: Math.min(1, busy / OFFICE.podCapacity),
      overloaded: busy >= OFFICE.podCapacity,
      totalTokens: tokens,
      totalLabel: humanSize(tokens),
      color: anyError ? STATE_COLORS.error : busy > 0 ? STATE_COLORS.streaming : STATE_COLORS.done,
    };
  });

  // Fallback lanes: failed provider -> provider that actually served it.
  const podNames = new Set(providers);
  const laneMap = new Map();
  for (const w of workstations) {
    if (!w.fallbackFrom || !podNames.has(w.fallbackFrom) || w.fallbackFrom === w.provider) continue;
    const key = `${w.fallbackFrom}>${w.provider}`;
    const lane = laneMap.get(key) || { from: w.fallbackFrom, to: w.provider, count: 0 };
    lane.count += 1;
    laneMap.set(key, lane);
  }

  return {
    workstations,
    pods,
    fallbacks: [...laneMap.values()],
    rack: {
      x: OFFICE.rackX,
      y: OFFICE.rackY,
      active: workstations.reduce((s, w) => s + w.busy, 0),
    },
    stats: {
      agents: workstations.length,
      busy: workstations.filter((w) => w.busy > 0).length,
      tokens: workstations.reduce((s, w) => s + w.totalTokens, 0),
      tokensLabel: humanSize(workstations.reduce((s, w) => s + w.totalTokens, 0)),
    },
  };
}
