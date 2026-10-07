export const MOCK_PRESETS = {
  idle: { agents: 2, errorRatio: 0 },
  busy: { agents: 8, errorRatio: 0 },
  storm: { agents: 30, errorRatio: 0.15 },
  errors: { agents: 10, errorRatio: 0.6 },
  cases: { agents: 16, errorRatio: 0, cases: true },
};

const CLIENTS = [
  { account: "Claude Code · main", icon: "terminal" },
  { account: "Claude Code · review", icon: "rate_review" },
  { account: "Antigravity · agent", icon: "smart_toy" },
  { account: "Antigravity · dev", icon: "construction" },
  { account: "Cursor · workspace", icon: "edit_note" },
  { account: "OpenCode · build", icon: "science" },
  { account: "Aider", icon: "smart_toy" },
  { account: "Continue · dev", icon: "play_arrow" },
];

const PROVIDER_MODELS = [
  { provider: "claude", model: "claude-3-7-sonnet" },
  { provider: "gemini", model: "gemini-2.5-pro" },
  { provider: "openai", model: "gpt-4o" },
  { provider: "minimax", model: "minimax-m2" },
  { provider: "deepseek", model: "deepseek-v3" },
];

const ERROR_REASONS = [
  "rate_limited",
  "upstream_timeout",
  "quota_exhausted",
  "auth_refresh_failed",
];

export const MOCK_TOOL_TYPES = ["bash", "read", "edit", "search", "web", "mcp", "agent", "gitnexus", "browser", "git", "docker"];

const CASE_DECK = [
  { name: "sleeping", state: "done", ageMs: 38000 },
  { name: "happy", state: "done", ageMs: 9000, cost: 1.42 },
  { name: "pending", state: "pending", ageMs: 2500, tools: ["todo"] },
  { name: "gitnexus", state: "streaming", ageMs: 14000, tools: ["gitnexus", "read"] },
  { name: "docker", state: "streaming", ageMs: 15000, tools: ["docker", "bash"] },
  { name: "browser", state: "streaming", ageMs: 16000, tools: ["browser", "web"] },
  { name: "git+agent", state: "streaming", ageMs: 12000, tools: ["git", "agent"], concurrent: 4 },
  { name: "rate_limited", state: "error", ageMs: 6000, error: "rate_limited" },
  { name: "upstream_timeout", state: "error", ageMs: 30000, error: "upstream_timeout" },
  { name: "quota_exhausted", state: "error", ageMs: 8000, error: "quota_exhausted" },
  { name: "auth_refresh_failed", state: "error", ageMs: 5000, error: "auth_refresh_failed" },
  { name: "fallback-1", state: "streaming", ageMs: 13000, tools: ["bash"], fallbackShift: 3 },
  { name: "fallback-2", state: "streaming", ageMs: 14000, tools: ["browser", "mcp"], fallbackShift: 2 },
  { name: "slow", state: "streaming", ageMs: 36000, tools: ["docker"] },
  { name: "queue+cached", state: "streaming", ageMs: 10000, tools: ["read", "search"], concurrent: 5, cachedBoost: true },
  { name: "expensive", state: "done", ageMs: 20000, cost: 7.35 },
];

function createRandom(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

function pick(rand, list) {
  return list[Math.floor(rand() * list.length) % list.length];
}

function accountTarget(index) {
  return PROVIDER_MODELS[index % PROVIDER_MODELS.length];
}

function randomTokens(rand) {
  return {
    input: Math.round(400 + rand() * 14000),
    output: Math.round(80 + rand() * 2900),
    cached: Math.round(rand() * 6000),
  };
}

export function generateMockTraces({ count = 8, errorRatio = 0, seed = 42, now = Date.now(), cases = false } = {}) {
  const rand = createRandom(seed);
  const traces = [];

  for (let i = 0; i < count; i += 1) {
    const client = CLIENTS[i % CLIENTS.length];
    const cycle = Math.floor(i / CLIENTS.length) + 1;
    const account = cycle > 1 ? `${client.account} ${cycle}` : client.account;
    const connectionId = `mock-conn-${i}`;
    const target = accountTarget(i);
    const deck = cases ? CASE_DECK[i % CASE_DECK.length] : null;
    const randAge = Math.floor(rand() * 40000);
    const randErr = rand() < errorRatio;
    const ageMs = deck ? deck.ageMs : randAge;
    const startedAt = now - ageMs;
    const isError = deck ? deck.state === "error" : randErr;

    const ageRatio = ageMs / 40000;
    let state;
    if (deck) state = deck.state;
    else if (isError) state = "error";
    else if (ageRatio < 0.25) state = "pending";
    else if (ageRatio < 0.6) state = "streaming";
    else state = "done";

    const tokens = randomTokens(rand);
    const toolRand = createRandom(seed * 7919 + i * 104729 + 13);
    const toolCount = state === "done" ? 0 : 1 + Math.floor(toolRand() * 3);
    const toolPick = [];
    for (let k = 0; k < toolCount; k += 1) {
      toolPick.push(MOCK_TOOL_TYPES[Math.floor(toolRand() * MOCK_TOOL_TYPES.length)]);
    }
    const toolNames = deck?.tools ?? (state === "error" ? [] : toolPick);
    const toolCalls = [];
    for (const tool of toolNames) {
      if (!toolCalls.some((c) => c.tool === tool)) {
        toolCalls.push({ tool, state: toolCalls.length === 0 ? "running" : "queued" });
      }
    }

    const wantsFallback = deck ? !!deck.fallbackShift : toolRand() < 0.28;
    const fallbackProvider = PROVIDER_MODELS[(i + (deck?.fallbackShift ?? 3)) % PROVIDER_MODELS.length].provider;
    const fallback =
      wantsFallback && (state === "pending" || state === "streaming") && fallbackProvider !== target.provider
        ? { from: fallbackProvider }
        : null;

    const concurrent = deck?.concurrent ?? (state === "done" || state === "error" ? 1 : 1 + Math.floor(toolRand() * 3));
    if (deck?.cachedBoost) tokens.cached = 14000;

    traces.push({
      traceId: `mock-${i}-${Math.floor(rand() * 1e6).toString(36)}`,
      cli: "mock",
      connectionId,
      account,
      model: target.model,
      provider: target.provider,
      state,
      startedAt,
      elapsedMs: ageMs,
      tokens,
      cost: deck?.cost ?? Math.round((tokens.input * 0.000015 + tokens.output * 0.00006) * 100) / 100,
      status: isError ? "error" : "200",
      error: isError ? deck?.error ?? pick(rand, ERROR_REASONS) : null,
      clientIcon: client.icon,
      toolCalls,
      tools: toolNames,
      activeTool: toolNames[0] || null,
      currentCommand: toolNames[0] ? `${toolNames[0]} task running...` : null,
      fallback,
      concurrent,
    });
  }

  return traces;
}

export function mockProviderDescriptors(traces) {
  const seen = new Map();
  for (const trace of traces) {
    if (trace.provider && !seen.has(trace.provider)) {
      seen.set(trace.provider, {
        provider: trace.provider,
        name: trace.provider.charAt(0).toUpperCase() + trace.provider.slice(1),
      });
    }
  }
  return [...seen.values()];
}
