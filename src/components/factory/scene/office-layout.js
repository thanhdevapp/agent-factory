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
      const lowerConn = String(trace.connectionId || "").toLowerCase();
      const clientType = trace.clientType || (
        trace.source === "app" || lowerConn.includes("app") ? "app" :
        trace.source === "extension" || lowerConn.includes("extension") || trace.source === "ide" || lowerConn.includes("ide") ? "extension" : "cli"
      );
      entry = {
        connectionId: trace.connectionId,
        account: trace.account || trace.connectionId,
        model: trace.model,
        provider: trace.provider,
        cli: trace.cli || "agent",
        clientType,
        source: trace.source || clientType,
        clientIcon: trace.clientIcon,
        traces: [],
        tokens: { input: 0, output: 0, cached: 0 },
        totalTokens: null,
        activeCount: 0,
        errorCount: 0,
        tools: [],
        errorReason: null,
        fallbackFrom: null,
        queued: 0,
        elapsedMs: 0,
        cost: null,
        pendingCount: 0,
        isLooping: false,
        logs: [],
        skin: trace.skin || null,
        aura: trace.aura || null,
        pet: trace.pet || null,
        props: trace.props || [],
        trophy: trace.trophy || null,
        theme: trace.theme || null,
        sessionTitle: trace.sessionTitle || trace.account || "agent-factory",
        lastText: null,
        lastTextRole: null,
      };
      byAccount.set(trace.connectionId, entry);
    }
    entry.traces.push(trace);
    if (trace.skin && !entry.skin) entry.skin = trace.skin;
    if (trace.aura && !entry.aura) entry.aura = trace.aura;
    if (trace.pet && !entry.pet) entry.pet = trace.pet;
    if (trace.props?.length && (!entry.props || !entry.props.length)) entry.props = trace.props;
    if (trace.trophy && !entry.trophy) entry.trophy = trace.trophy;
    if (trace.theme && !entry.theme) entry.theme = trace.theme;
    if (trace.isLooping) entry.isLooping = true;
    if (Array.isArray(trace.logs) && trace.logs.length > 0) entry.logs = trace.logs;
    if (trace.currentCommand && !entry.currentCommand) entry.currentCommand = trace.currentCommand;
    if (trace.sessionTitle) entry.sessionTitle = trace.sessionTitle;
    if (trace.lastText) {
      entry.lastText = trace.lastText;
      entry.lastTextRole = trace.lastTextRole;
    }
    for (const call of trace.toolCalls || []) {
      const toolName = call.tool || call.type;
      if (toolName && !entry.tools.includes(toolName)) entry.tools.push(toolName);
    }
    entry.tokens.input += trace.tokens?.input ?? 0;
    entry.tokens.output += trace.tokens?.output ?? 0;
    entry.tokens.cached += trace.tokens?.cached ?? 0;
    if (Number.isFinite(trace.totalTokens)) {
      entry.totalTokens = (entry.totalTokens ?? 0) + trace.totalTokens;
    }
    entry.queued += Math.max(1, trace.concurrent || 1);
    entry.elapsedMs = Math.max(entry.elapsedMs, trace.elapsedMs ?? 0);
    if (Number.isFinite(trace.cost)) {
      entry.cost = (entry.cost ?? 0) + trace.cost;
    }
    if (trace.fallback?.from && !entry.fallbackFrom) entry.fallbackFrom = trace.fallback.from;
    if (trace.state === "error") {
      entry.errorCount += 1;
      entry.errorReason = entry.errorReason || trace.error || "error";
    } else if (trace.state === "streaming" || trace.state === "pending") {
      entry.activeCount += 1;
      if (trace.state === "pending") entry.pendingCount += 1;
    }
  }

  const totalStations = byAccount.size;
  const cols = totalStations > 35 ? 8 : totalStations > 18 ? 7 : 6;
  const colGap = totalStations > 35 ? 175 : 200;
  const rowGap = totalStations > 35 ? 145 : 170;
  const rackX = Math.max(OFFICE.rackX, OFFICE.originX + cols * colGap + 120);
  const podX = rackX + 360;

  const workstations = [...byAccount.values()].map((entry, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
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
    const totalTokens = entry.totalTokens;
    const cachedPct = totalTokens && entry.tokens.cached > 0
      ? Math.round((entry.tokens.cached / totalTokens) * 100)
      : null;
    const fallbackWorkspace = entry.account || "agent-factory";
    const sessionTitle = entry.sessionTitle || fallbackWorkspace;
    return {
      ...entry,
      deskIndex: i,
      traceId: entry.traces?.[0]?.traceId || entry.connectionId,
      sessionTitle,
      occupied,
      state,
      mode,
      isLooping,
      logs: entry.logs,
      cachedPct,
      cost: Number.isFinite(entry.cost) ? Math.round(entry.cost * 100) / 100 : null,
      color: isLooping ? 0xf43f5e : STATE_COLORS[state],
      totalTokens,
      totalLabel: totalTokens === null ? "—" : humanSize(totalTokens),
      count: entry.traces.length,
      x: OFFICE.originX + col * colGap,
      y: OFFICE.floorY - row * rowGap,
      // Desks further back are drawn first and slightly smaller.
      depth: 1,
      busy: entry.activeCount,
    };
  });

  const providers = [...new Set(workstations.map((w) => w.provider).filter(Boolean))];

  const pods = providers.map((provider, i) => {
    const clients = workstations.filter((w) => w.provider === provider);
    const busy = clients.reduce((s, w) => s + w.busy, 0);
    const tokens = clients.reduce((s, w) => s + (w.totalTokens ?? 0), 0);
    const anyError = clients.some((w) => w.state === "error");
    return {
      provider,
      x: podX,
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
      x: rackX,
      y: OFFICE.rackY,
      active: workstations.reduce((s, w) => s + w.busy, 0),
    },
    stats: {
      agents: workstations.length,
      busy: workstations.filter((w) => w.busy > 0).length,
      tokens: workstations.reduce((s, w) => s + (w.totalTokens ?? 0), 0),
      tokensLabel: humanSize(workstations.reduce((s, w) => s + (w.totalTokens ?? 0), 0)),
    },
  };
}
