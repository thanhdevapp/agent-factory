/**
 * Standard Trace Contract for Agent Factory.
 * All watchers normalize their session logs into this uniform schema.
 */

export function normalizeTrace(raw) {
  const tokens = raw.tokens || {};
  const asNumberOrNull = (value) => (Number.isFinite(value) ? Number(value) : null);
  const inputTokens = asNumberOrNull(tokens.input);
  const outputTokens = asNumberOrNull(tokens.output);
  const cachedTokens = asNumberOrNull(tokens.cached);
  const explicitTotal = asNumberOrNull(raw.totalTokens ?? tokens.total);
  const totalTokens = explicitTotal ?? (
    inputTokens !== null && outputTokens !== null && cachedTokens !== null
      ? inputTokens + outputTokens + cachedTokens
      : null
  );
  const lowerConn = String(raw.connectionId || "").toLowerCase();
  const clientType = raw.clientType || (
    raw.source === "app" || lowerConn.includes("app") ? "app" :
    raw.source === "extension" || lowerConn.includes("extension") || raw.source === "ide" || lowerConn.includes("ide") ? "extension" : "cli"
  );
  return {
    traceId: String(raw.traceId || `trace-${Math.random().toString(36).slice(2, 9)}`),
    cli: raw.cli || "agent", // "antigravity" | "claude" | "cursor" | etc.
    clientType, // "app" | "cli" | "ide" | "extension" | "desktop"
    source: raw.source || clientType,
    connectionId: String(raw.connectionId || "Agent Desk"),
    account: String(raw.account || "Default Workspace"),
    model: raw.model ? String(raw.model) : null,
    provider: raw.provider ? String(raw.provider).toLowerCase() : null,
    state: ["streaming", "pending", "idle", "done", "error"].includes(raw.state) ? raw.state : "idle",
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : null,
    elapsedMs: typeof raw.elapsedMs === "number" ? raw.elapsedMs : null,
    tokens: {
      input: inputTokens,
      output: outputTokens,
      cached: cachedTokens,
    },
    totalTokens,
    cost: asNumberOrNull(raw.cost),
    status: raw.status ? String(raw.status) : null,
    tools: Array.isArray(raw.tools) ? raw.tools : [],
    activeTool: raw.activeTool || null,
    currentCommand: raw.currentCommand || null,
    sessionTitle: raw.sessionTitle ? String(raw.sessionTitle) : null,
    lastText: raw.lastText ? String(raw.lastText) : null,
    lastTextRole: ["user", "assistant"].includes(raw.lastTextRole) ? raw.lastTextRole : null,
    error: raw.error ? String(raw.error) : null,
    isLooping: Boolean(raw.isLooping || false),
    logs: Array.isArray(raw.logs) ? raw.logs : [],
  };
}

export function extractProviders(traces) {
  const seen = new Set();
  const list = [];
  for (const t of traces) {
    const p = (t.provider || "other").toLowerCase();
    if (!seen.has(p)) {
      seen.add(p);
      list.push({
        provider: p,
        name: p.charAt(0).toUpperCase() + p.slice(1),
      });
    }
  }
  return list;
}
