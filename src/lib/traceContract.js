/**
 * Standard Trace Contract for Agent Factory.
 * All watchers normalize their session logs into this uniform schema.
 */

export function normalizeProvider(rawProvider, cli = "agent", model = "") {
  let p = String(rawProvider || "").toLowerCase().trim();
  // Strip out any trailing client type annotations like "(cli)", "(app)", "(codex)", "(extension)", "(ide)"
  p = p.replace(/\s*\([^)]*\)/g, "").trim();

  if (p === "claude" || p.includes("anthropic")) return "anthropic";
  if (p.includes("gemini") || p.includes("google")) return "gemini";
  if (p.includes("openai") || p.includes("codex") || p.includes("gpt")) return "openai";
  if (p.includes("minimax")) return "minimax";
  if (p.includes("deepseek")) return "deepseek";

  // Infer from model if provider wasn't recognized
  const m = String(model || "").toLowerCase();
  if (m.includes("claude") || m.includes("sonnet") || m.includes("opus") || m.includes("haiku")) return "anthropic";
  if (m.includes("gemini")) return "gemini";
  if (m.includes("gpt") || m.includes("o1") || m.includes("o3") || m.includes("o4") || m.includes("codex")) return "openai";
  if (m.includes("minimax")) return "minimax";
  if (m.includes("deepseek")) return "deepseek";

  // Infer from cli if still unknown
  const c = String(cli || "").toLowerCase();
  if (c.includes("claude")) return "anthropic";
  if (c.includes("antigravity")) return "gemini";
  if (c.includes("codex")) return "openai";

  return p || "other";
}

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
  const model = (raw.model && raw.model !== "<synthetic>") ? String(raw.model) : null;
  const provider = normalizeProvider(raw.provider, raw.cli, model);

  return {
    traceId: String(raw.traceId || `trace-${Math.random().toString(36).slice(2, 9)}`),
    cli: raw.cli || "agent", // "antigravity" | "claude" | "cursor" | etc.
    clientType, // "app" | "cli" | "ide" | "extension" | "desktop"
    source: raw.source || clientType,
    connectionId: String(raw.connectionId || "Agent Desk"),
    account: String(raw.account || "Default Workspace"),
    model,
    provider,
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
    parentTraceId: raw.parentTraceId || null,
    parentConnectionId: raw.parentConnectionId || null,
    isSubagent: Boolean(raw.isSubagent || false),
    role: raw.role ? String(raw.role) : null,
    subagents: Array.isArray(raw.subagents) ? raw.subagents : [],
  };
}

const PROVIDER_NAMES = {
  gemini: "Google Gemini",
  anthropic: "Anthropic Claude",
  openai: "OpenAI",
  minimax: "MiniMax",
  deepseek: "DeepSeek",
  other: "Other",
};

export function extractProviders(traces) {
  const seen = new Set();
  const list = [];
  for (const t of traces) {
    const p = normalizeProvider(t.provider, t.cli, t.model);
    if (!seen.has(p)) {
      seen.add(p);
      list.push({
        provider: p,
        name: PROVIDER_NAMES[p] || (p.charAt(0).toUpperCase() + p.slice(1)),
      });
    }
  }
  return list;
}
