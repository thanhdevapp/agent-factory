/**
 * Standard Trace Contract for Agent Factory.
 * All watchers normalize their session logs into this uniform schema.
 */

export function normalizeTrace(raw) {
  const tokens = raw.tokens || {};
  return {
    traceId: String(raw.traceId || `trace-${Math.random().toString(36).slice(2, 9)}`),
    cli: raw.cli || "agent", // "antigravity" | "claude" | "cursor" | etc.
    connectionId: String(raw.connectionId || "Agent Desk"),
    account: String(raw.account || "Default Workspace"),
    model: String(raw.model || "Unknown Model"),
    provider: String(raw.provider || "anthropic").toLowerCase(),
    state: ["streaming", "pending", "done", "error"].includes(raw.state) ? raw.state : "streaming",
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : Date.now(),
    elapsedMs: typeof raw.elapsedMs === "number" ? raw.elapsedMs : 0,
    tokens: {
      input: Number(tokens.input || 0),
      output: Number(tokens.output || 0),
      cached: Number(tokens.cached || 0),
    },
    cost: Number(raw.cost || 0),
    status: String(raw.status || "200"),
    tools: Array.isArray(raw.tools) ? raw.tools : [],
    activeTool: raw.activeTool || null,
    currentCommand: raw.currentCommand || null,
    error: raw.error ? String(raw.error) : null,
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
