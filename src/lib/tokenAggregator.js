import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";
import readline from "readline";

// Standard AI Token Pricing (per 1,000,000 tokens)
export const MODEL_PRICING = {
  // Gemini 1.5 & 2.5 & 3.8 Flash
  "gemini-3.8-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-2.5-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-1.5-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  // Gemini Pro
  "gemini-2.5-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  "gemini-1.5-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  // Claude 3.5 Sonnet & Claude 3.7 Sonnet
  "claude-3-7-sonnet": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-3-5-sonnet": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-3-haiku": { input: 0.25, output: 1.25, cached: 0.025 },
  "claude-3-opus": { input: 15.00, output: 75.00, cached: 1.50 },
  // OpenAI
  "gpt-4o": { input: 2.50, output: 10.00, cached: 1.25 },
  "gpt-4o-mini": { input: 0.15, output: 0.60, cached: 0.075 },
  // MiniMax
  "minimax": { input: 0.20, output: 0.80, cached: 0.05 },
  // Default fallback
  default: { input: 0.10, output: 0.40, cached: 0.02 },
};

export function getPricingForModel(model) {
  const norm = (model || "").toLowerCase();
  for (const [key, p] of Object.entries(MODEL_PRICING)) {
    if (norm.includes(key)) return p;
  }
  return MODEL_PRICING.default;
}

export function calculateCost(model, input = 0, output = 0, cached = 0) {
  const p = getPricingForModel(model);
  const cost =
    (input / 1_000_000) * p.input +
    (output / 1_000_000) * p.output +
    (cached / 1_000_000) * p.cached;
  return Math.round(cost * 10000) / 10000;
}

export function calculateCacheSavings(model, cached = 0) {
  const p = getPricingForModel(model);
  // How much was saved compared to reading these cached tokens as raw input
  const diff = Math.max(0, p.input - p.cached);
  const savings = (cached / 1_000_000) * diff;
  return Math.round(savings * 10000) / 10000;
}

// In-memory cache for parsed transcripts to avoid reading large files repeatedly
const transcriptCache = new Map(); // path -> { mtime, size, data }

async function parseTranscriptTokens(transcriptPath, defaultModel = "gemini-3.8-flash") {
  try {
    const stat = await fs.stat(transcriptPath);
    const cached = transcriptCache.get(transcriptPath);
    if (cached && cached.mtime === stat.mtimeMs && cached.size === stat.size) {
      return cached.data;
    }

    const stream = fsSync.createReadStream(transcriptPath);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let inTok = 0;
    let outTok = 0;
    let cachedTok = 0;
    let firstDate = null;
    let lastDate = null;
    let detectedModel = null;
    let detectedProject = null;
    let requestCount = 0;
    const toolSet = new Set();
    let hasError = false;

    for await (const line of rl) {
      if (!line) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.input_tokens) inTok += obj.input_tokens;
        if (obj.output_tokens) outTok += obj.output_tokens;
        if (obj.cache_read_tokens) cachedTok += obj.cache_read_tokens;
        if (obj.type === "USER_INPUT") requestCount++;

        // Tool calls
        if (obj.tool_calls && Array.isArray(obj.tool_calls)) {
          requestCount++;
          obj.tool_calls.forEach((tc) => {
            if (tc.name) toolSet.add(tc.name);
          });
        }

        if (obj.status === "ERROR" || obj.error) {
          hasError = true;
        }

        // Model detection
        if (obj.content && typeof obj.content === "string") {
          const m = obj.content.match(/model["']?\s*:\s*["']([^"']+)["']/i);
          if (m) detectedModel = m[1];

          // Project / workspace detection
          if (!detectedProject) {
            const wsMatch = obj.content.match(/(?:workspace|directory|Cwd|working directory)["':\s]+([^\s\r\n,"']+)/i);
            if (wsMatch) {
              const basename = path.basename(wsMatch[1]);
              if (basename && basename.length > 2 && !basename.startsWith(".")) {
                detectedProject = basename;
              }
            }
          }
        }

        if (obj.created_at) {
          if (!firstDate) firstDate = obj.created_at;
          lastDate = obj.created_at;
        }
      } catch {
        // ignore parse error on partial lines
      }
    }

    const data = {
      input: inTok,
      output: outTok,
      cached: cachedTok,
      total: inTok + outTok + cachedTok,
      firstDate: firstDate || new Date(stat.birthtimeMs).toISOString(),
      lastDate: lastDate || new Date(stat.mtimeMs).toISOString(),
      model: detectedModel || defaultModel,
      project: detectedProject || null,
      tools: Array.from(toolSet),
      hasError,
      requestCount: requestCount || 1,
      mtime: stat.mtimeMs,
      size: stat.size,
    };

    transcriptCache.set(transcriptPath, { mtime: stat.mtimeMs, size: stat.size, data });
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Calculate Date Milestones & Boundaries
 */
export function getTimeBounds(timeRange = "all", customStart = null, customEnd = null) {
  const now = new Date();
  let startTime = 0;
  let endTime = Date.now() + 86400000; // tomorrow
  let defaultGranularity = "daily";

  if (customStart || customEnd) {
    if (customStart) startTime = new Date(customStart).getTime();
    if (customEnd) {
      const endD = new Date(customEnd);
      endD.setHours(23, 59, 59, 999);
      endTime = endD.getTime();
    }
    const diffDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
    defaultGranularity = diffDays <= 2 ? "hourly" : diffDays <= 60 ? "daily" : diffDays <= 180 ? "weekly" : "monthly";
    return { startTime, endTime, granularity: defaultGranularity };
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeRange) {
    case "today": {
      startTime = startOfToday.getTime();
      defaultGranularity = "hourly";
      break;
    }
    case "yesterday": {
      const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
      startTime = startOfYesterday.getTime();
      endTime = startOfToday.getTime() - 1;
      defaultGranularity = "hourly";
      break;
    }
    case "week":
    case "this_week": {
      // Last 7 days or current week
      startTime = now.getTime() - 7 * 86400000;
      defaultGranularity = "daily";
      break;
    }
    case "last_week": {
      startTime = now.getTime() - 14 * 86400000;
      endTime = now.getTime() - 7 * 86400000;
      defaultGranularity = "daily";
      break;
    }
    case "month":
    case "this_month": {
      // Current month or last 30 days
      startTime = now.getTime() - 30 * 86400000;
      defaultGranularity = "daily";
      break;
    }
    case "last_month": {
      startTime = now.getTime() - 60 * 86400000;
      endTime = now.getTime() - 30 * 86400000;
      defaultGranularity = "weekly";
      break;
    }
    case "this_quarter": {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startTime = new Date(now.getFullYear(), currentQuarter * 3, 1).getTime();
      defaultGranularity = "weekly";
      break;
    }
    case "year":
    case "this_year": {
      startTime = new Date(now.getFullYear(), 0, 1).getTime();
      defaultGranularity = "monthly";
      break;
    }
    case "last_year": {
      startTime = new Date(now.getFullYear() - 1, 0, 1).getTime();
      endTime = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59).getTime();
      defaultGranularity = "monthly";
      break;
    }
    case "all":
    default: {
      startTime = 0;
      defaultGranularity = "monthly";
      break;
    }
  }

  return { startTime, endTime, granularity: defaultGranularity };
}

/**
 * Scan all sessions and generate comprehensive multi-criteria report
 */
export async function getAggregatedTokenReport(options = {}) {
  const {
    timeRange = "week",
    startDate = null,
    endDate = null,
    granularity: requestedGranularity = null,
    providerFilter = null,
    clientTypeFilter = null,
    modelFilter = null,
    projectFilter = null,
    toolFilter = null,
    hasErrorFilter = null,
    minTokens = null,
    searchQuery = null,
  } = options;

  const { startTime, endTime, granularity: autoGranularity } = getTimeBounds(timeRange, startDate, endDate);
  const granularity = requestedGranularity || autoGranularity;

  const homedir = os.homedir();
  const brainDirs = [
    {
      path: path.join(homedir, ".gemini", "antigravity", "brain"),
      provider: "gemini (app)",
      clientType: "app",
      defaultModel: "gemini-3.8-flash",
    },
    {
      path: path.join(homedir, ".gemini", "antigravity-cli", "brain"),
      provider: "gemini (cli)",
      clientType: "cli",
      defaultModel: "gemini-3.8-flash",
    },
    {
      path: path.join(homedir, ".gemini", "antigravity-ide", "brain"),
      provider: "gemini (app)",
      clientType: "app",
      defaultModel: "gemini-3.8-flash",
    },
  ];

  const sessions = [];

  // 1. Scan Antigravity brains
  for (const b of brainDirs) {
    let convDirs = [];
    try {
      convDirs = await fs.readdir(b.path, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const dirent of convDirs) {
      if (!dirent.isDirectory()) continue;
      const convId = dirent.name;
      const sessionPath = path.join(b.path, convId);
      const transcriptPath = path.join(sessionPath, ".system_generated", "logs", "transcript.jsonl");

      let metaData = {};
      try {
        const metaRaw = await fs.readFile(path.join(sessionPath, ".metadata.json"), "utf8");
        metaData = JSON.parse(metaRaw);
      } catch {}

      const tokenData = await parseTranscriptTokens(transcriptPath, b.defaultModel);
      if (!tokenData || tokenData.total === 0) continue;

      const sessionDate = new Date(tokenData.lastDate || tokenData.firstDate);
      const sessionTimestamp = sessionDate.getTime();

      // Time range boundary check
      if (sessionTimestamp < startTime || sessionTimestamp > endTime) continue;

      const project = metaData.account || metaData.workspace || tokenData.project || "Agent Factory";
      const model = tokenData.model || b.defaultModel;
      const cost = calculateCost(model, tokenData.input, tokenData.output, tokenData.cached);
      const savings = calculateCacheSavings(model, tokenData.cached);

      sessions.push({
        id: convId,
        date: sessionDate.toISOString(),
        timestamp: sessionTimestamp,
        provider: b.provider,
        clientType: b.clientType,
        project,
        model,
        tokens: {
          input: tokenData.input,
          output: tokenData.output,
          cached: tokenData.cached,
          total: tokenData.total,
        },
        cost,
        savings,
        tools: tokenData.tools || [],
        hasError: tokenData.hasError || false,
        requests: tokenData.requestCount || 1,
      });
    }
  }

  // 2. Scan Claude Code projects
  const claudeProjectsDir = path.join(homedir, ".claude", "projects");
  try {
    const claudeProjects = await fs.readdir(claudeProjectsDir, { withFileTypes: true });
    for (const proj of claudeProjects) {
      if (!proj.isDirectory()) continue;
      const projPath = path.join(claudeProjectsDir, proj.name);
      let files = [];
      try {
        files = await fs.readdir(projPath, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const f of files) {
        if (!f.isFile() || !f.name.endsWith(".jsonl")) continue;
        const filePath = path.join(projPath, f.name);
        const tokenData = await parseTranscriptTokens(filePath, "claude-3-5-sonnet");
        if (!tokenData || tokenData.total === 0) continue;

        const sessionDate = new Date(tokenData.lastDate || tokenData.firstDate);
        const sessionTimestamp = sessionDate.getTime();

        if (sessionTimestamp < startTime || sessionTimestamp > endTime) continue;

        const projectName =
          proj.name.replace(/^-Volumes-[^-]+-/, "").replace(/^-Users-[^-]+-/, "").slice(0, 30) || "Claude Workspace";
        const model = tokenData.model || "claude-3-5-sonnet";
        const cost = calculateCost(model, tokenData.input, tokenData.output, tokenData.cached);
        const savings = calculateCacheSavings(model, tokenData.cached);

        sessions.push({
          id: f.name.replace(".jsonl", ""),
          date: sessionDate.toISOString(),
          timestamp: sessionTimestamp,
          provider: "claude",
          clientType: "cli",
          project: projectName,
          model,
          tokens: {
            input: tokenData.input,
            output: tokenData.output,
            cached: tokenData.cached,
            total: tokenData.total,
          },
          cost,
          savings,
          tools: tokenData.tools || [],
          hasError: tokenData.hasError || false,
          requests: tokenData.requestCount || 1,
        });
      }
    }
  } catch {}

  // Apply Multi-Criteria Filters
  let filtered = sessions;

  if (providerFilter && providerFilter !== "all") {
    filtered = filtered.filter((s) => s.provider.toLowerCase().includes(providerFilter.toLowerCase()));
  }

  if (clientTypeFilter && clientTypeFilter !== "all") {
    filtered = filtered.filter((s) => s.clientType === clientTypeFilter);
  }

  if (modelFilter && modelFilter !== "all") {
    filtered = filtered.filter((s) => s.model.toLowerCase().includes(modelFilter.toLowerCase()));
  }

  if (projectFilter && projectFilter !== "all") {
    filtered = filtered.filter((s) => s.project.toLowerCase().includes(projectFilter.toLowerCase()));
  }

  if (toolFilter && toolFilter !== "all") {
    filtered = filtered.filter((s) => s.tools && s.tools.some((t) => t.toLowerCase().includes(toolFilter.toLowerCase())));
  }

  if (hasErrorFilter !== null && hasErrorFilter !== undefined && hasErrorFilter !== "all") {
    const errorBool = hasErrorFilter === "true" || hasErrorFilter === true;
    filtered = filtered.filter((s) => s.hasError === errorBool);
  }

  if (minTokens && Number(minTokens) > 0) {
    filtered = filtered.filter((s) => s.tokens.total >= Number(minTokens));
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.project.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        (s.tools && s.tools.some((t) => t.toLowerCase().includes(q)))
    );
  }

  // Sort by date descending
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  // Aggregations
  let totalInput = 0;
  let totalOutput = 0;
  let totalCached = 0;
  let totalTokens = 0;
  let totalCost = 0;
  let totalSavings = 0;
  let totalRequests = 0;

  const byModel = {};
  const byProvider = {};
  const byProject = {};
  const byTool = {};
  const byDayOfWeek = {
    Sun: { day: "Chủ nhật", tokens: 0, cost: 0, sessions: 0 },
    Mon: { day: "Thứ 2", tokens: 0, cost: 0, sessions: 0 },
    Tue: { day: "Thứ 3", tokens: 0, cost: 0, sessions: 0 },
    Wed: { day: "Thứ 4", tokens: 0, cost: 0, sessions: 0 },
    Thu: { day: "Thứ 5", tokens: 0, cost: 0, sessions: 0 },
    Fri: { day: "Thứ 6", tokens: 0, cost: 0, sessions: 0 },
    Sat: { day: "Thứ 7", tokens: 0, cost: 0, sessions: 0 },
  };
  const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const timeseriesMap = {};

  filtered.forEach((s) => {
    totalInput += s.tokens.input;
    totalOutput += s.tokens.output;
    totalCached += s.tokens.cached;
    totalTokens += s.tokens.total;
    totalCost += s.cost;
    totalSavings += s.savings;
    totalRequests += s.requests;

    // Day of week
    const d = new Date(s.timestamp);
    const dayKey = DAY_KEYS[d.getDay()];
    if (byDayOfWeek[dayKey]) {
      byDayOfWeek[dayKey].tokens += s.tokens.total;
      byDayOfWeek[dayKey].cost += s.cost;
      byDayOfWeek[dayKey].sessions++;
    }

    // By Model
    const m = s.model || "unknown";
    if (!byModel[m]) {
      byModel[m] = {
        model: m,
        input: 0,
        output: 0,
        cached: 0,
        total: 0,
        cost: 0,
        savings: 0,
        sessions: 0,
      };
    }
    byModel[m].input += s.tokens.input;
    byModel[m].output += s.tokens.output;
    byModel[m].cached += s.tokens.cached;
    byModel[m].total += s.tokens.total;
    byModel[m].cost += s.cost;
    byModel[m].savings += s.savings;
    byModel[m].sessions++;

    // By Provider
    const p = s.provider || "other";
    if (!byProvider[p]) {
      byProvider[p] = {
        provider: p,
        clientType: s.clientType,
        input: 0,
        output: 0,
        cached: 0,
        total: 0,
        cost: 0,
        sessions: 0,
      };
    }
    byProvider[p].input += s.tokens.input;
    byProvider[p].output += s.tokens.output;
    byProvider[p].cached += s.tokens.cached;
    byProvider[p].total += s.tokens.total;
    byProvider[p].cost += s.cost;
    byProvider[p].sessions++;

    // By Project
    const proj = s.project || "other";
    if (!byProject[proj]) {
      byProject[proj] = {
        project: proj,
        input: 0,
        output: 0,
        cached: 0,
        total: 0,
        cost: 0,
        sessions: 0,
      };
    }
    byProject[proj].input += s.tokens.input;
    byProject[proj].output += s.tokens.output;
    byProject[proj].cached += s.tokens.cached;
    byProject[proj].total += s.tokens.total;
    byProject[proj].cost += s.cost;
    byProject[proj].sessions++;

    // By Tools
    if (s.tools && Array.isArray(s.tools)) {
      s.tools.forEach((t) => {
        if (!byTool[t]) {
          byTool[t] = { tool: t, count: 0, tokens: 0 };
        }
        byTool[t].count++;
        byTool[t].tokens += s.tokens.total;
      });
    }

    // Dynamic Timeseries key based on chosen granularity
    let timeKey;
    if (granularity === "hourly") {
      timeKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:00`;
    } else if (granularity === "weekly") {
      // Group by Week Monday
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMonday));
      timeKey = `W${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
    } else if (granularity === "monthly") {
      timeKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      // Daily
      timeKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    if (!timeseriesMap[timeKey]) {
      timeseriesMap[timeKey] = {
        date: timeKey,
        total: 0,
        input: 0,
        output: 0,
        cached: 0,
        cost: 0,
        sessions: 0,
      };
    }
    timeseriesMap[timeKey].total += s.tokens.total;
    timeseriesMap[timeKey].input += s.tokens.input;
    timeseriesMap[timeKey].output += s.tokens.output;
    timeseriesMap[timeKey].cached += s.tokens.cached;
    timeseriesMap[timeKey].cost += s.cost;
    timeseriesMap[timeKey].sessions++;
  });

  const timeseries = Object.values(timeseriesMap).sort((a, b) => a.date.localeCompare(b.date));

  const cacheRate = totalTokens > 0 ? Math.round((totalCached / totalTokens) * 1000) / 10 : 0;
  const avgCostPerSession = filtered.length > 0 ? Math.round((totalCost / filtered.length) * 1000) / 1000 : 0;
  const avgTokensPerSession = filtered.length > 0 ? Math.round(totalTokens / filtered.length) : 0;

  // Monthly Run-rate projection
  let projectedMonthlyCost = totalCost;
  let projectedMonthlyTokens = totalTokens;
  const spanMs = Math.max(1, (endTime === Infinity ? Date.now() : endTime) - startTime);
  const spanDays = Math.max(1, spanMs / (1000 * 60 * 60 * 24));
  if (spanDays >= 1 && spanDays < 30) {
    projectedMonthlyCost = Math.round((totalCost / spanDays) * 30 * 100) / 100;
    projectedMonthlyTokens = Math.round((totalTokens / spanDays) * 30);
  }

  // Top lists for filter dropdowns
  const availableProjects = Object.keys(byProject).sort();
  const availableModels = Object.keys(byModel).sort();
  const availableTools = Object.keys(byTool).sort();

  return {
    meta: {
      timeRange,
      granularity,
      startTime,
      endTime,
      availableProjects,
      availableModels,
      availableTools,
    },
    summary: {
      totalTokens,
      totalInput,
      totalOutput,
      totalCached,
      cacheRate,
      totalCost: Math.round(totalCost * 100) / 100,
      totalCostVnd: Math.round(totalCost * 25400),
      totalSavings: Math.round(totalSavings * 100) / 100,
      totalSavingsVnd: Math.round(totalSavings * 25400),
      sessionCount: filtered.length,
      totalRequests,
      avgCostPerSession,
      avgTokensPerSession,
      projectedMonthlyCost,
      projectedMonthlyTokens,
    },
    timeseries,
    byModel: Object.values(byModel).sort((a, b) => b.total - a.total),
    byProvider: Object.values(byProvider).sort((a, b) => b.total - a.total),
    byProject: Object.values(byProject).sort((a, b) => b.total - a.total),
    byTool: Object.values(byTool).sort((a, b) => b.count - a.count),
    byDayOfWeek: Object.values(byDayOfWeek),
    sessions: filtered.slice(0, 200), // Top 200 sessions
  };
}
