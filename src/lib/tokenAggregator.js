import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";
import readline from "readline";

// Standard AI Token Pricing (per 1,000,000 tokens)
const MODEL_PRICING = {
  // Gemini 1.5 & 2.5 & 3.8 Flash
  "gemini-3.8-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-2.5-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-1.5-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  // Gemini Pro
  "gemini-2.5-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  "gemini-1.5-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  // Claude 3.5 Sonnet
  "claude-3-5-sonnet": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-3-7-sonnet": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-3-haiku": { input: 0.25, output: 1.25, cached: 0.025 },
  // Default fallback
  default: { input: 0.10, output: 0.40, cached: 0.02 },
};

function calculateCost(model, input = 0, output = 0, cached = 0) {
  const normModel = (model || "").toLowerCase();
  let pricing = MODEL_PRICING.default;
  for (const [key, p] of Object.entries(MODEL_PRICING)) {
    if (normModel.includes(key)) {
      pricing = p;
      break;
    }
  }
  const cost =
    (input / 1_000_000) * pricing.input +
    (output / 1_000_000) * pricing.output +
    (cached / 1_000_000) * pricing.cached;
  return Math.round(cost * 10000) / 10000;
}

// In-memory cache for parsed transcripts to avoid reading large files repeatedly
const transcriptCache = new Map(); // path -> { mtime, data }

async function parseTranscriptTokens(transcriptPath, defaultModel = "gemini-3.8-flash") {
  try {
    const stat = await fs.stat(transcriptPath);
    const cached = transcriptCache.get(transcriptPath);
    if (cached && cached.mtime === stat.mtimeMs) {
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
    let requestCount = 0;

    for await (const line of rl) {
      if (!line) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.input_tokens) inTok += obj.input_tokens;
        if (obj.output_tokens) outTok += obj.output_tokens;
        if (obj.cache_read_tokens) cachedTok += obj.cache_read_tokens;
        if (obj.type === "USER_INPUT" || obj.tool_calls) requestCount++;

        // Model detection
        if (obj.content && typeof obj.content === "string") {
          const m = obj.content.match(/model["']?\s*:\s*["']([^"']+)["']/i);
          if (m) detectedModel = m[1];
        }

        if (obj.created_at) {
          if (!firstDate) firstDate = obj.created_at;
          lastDate = obj.created_at;
        }
      } catch {
        // ignore JSON parse error on partial lines
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
      requestCount: requestCount || 1,
      mtime: stat.mtimeMs,
    };

    transcriptCache.set(transcriptPath, { mtime: stat.mtimeMs, data });
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Scan all session tokens across Antigravity App, CLI, and Claude
 */
export async function getAggregatedTokenReport(options = {}) {
  const {
    timeRange = "all", // 'today' | 'week' | 'month' | 'year' | 'all'
    providerFilter = null,
    modelFilter = null,
    projectFilter = null,
  } = options;

  const now = new Date();
  let minTimestamp = 0;

  if (timeRange === "today") {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    minTimestamp = startOfToday.getTime();
  } else if (timeRange === "week") {
    minTimestamp = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  } else if (timeRange === "month") {
    minTimestamp = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  } else if (timeRange === "year") {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    minTimestamp = startOfYear.getTime();
  }

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
      if (sessionDate.getTime() < minTimestamp) continue;

      const project = metaData.account || metaData.workspace || "Agent Factory";
      const model = tokenData.model || b.defaultModel;
      const cost = calculateCost(model, tokenData.input, tokenData.output, tokenData.cached);

      sessions.push({
        id: convId,
        date: sessionDate.toISOString(),
        timestamp: sessionDate.getTime(),
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
        requests: tokenData.requestCount,
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
        if (sessionDate.getTime() < minTimestamp) continue;

        const projectName = proj.name.replace(/^-Volumes-[^-]+-/, "").replace(/^-Users-[^-]+-/, "").slice(0, 30) || "Claude Workspace";
        const model = tokenData.model || "claude-3-5-sonnet";
        const cost = calculateCost(model, tokenData.input, tokenData.output, tokenData.cached);

        sessions.push({
          id: f.name.replace(".jsonl", ""),
          date: sessionDate.toISOString(),
          timestamp: sessionDate.getTime(),
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
          requests: tokenData.requestCount,
        });
      }
    }
  } catch {}

  // Apply filters
  let filtered = sessions;
  if (providerFilter && providerFilter !== "all") {
    filtered = filtered.filter((s) => s.provider.toLowerCase().includes(providerFilter.toLowerCase()));
  }
  if (modelFilter && modelFilter !== "all") {
    filtered = filtered.filter((s) => s.model.toLowerCase().includes(modelFilter.toLowerCase()));
  }
  if (projectFilter && projectFilter !== "all") {
    filtered = filtered.filter((s) => s.project.toLowerCase().includes(projectFilter.toLowerCase()));
  }

  // Sort by date descending
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  // Aggregations
  let totalInput = 0;
  let totalOutput = 0;
  let totalCached = 0;
  let totalTokens = 0;
  let totalCost = 0;
  let totalRequests = 0;

  const byModel = {};
  const byProvider = {};
  const byProject = {};
  const timeseriesMap = {};

  filtered.forEach((s) => {
    totalInput += s.tokens.input;
    totalOutput += s.tokens.output;
    totalCached += s.tokens.cached;
    totalTokens += s.tokens.total;
    totalCost += s.cost;
    totalRequests += s.requests;

    // By Model
    const m = s.model || "unknown";
    if (!byModel[m]) {
      byModel[m] = { model: m, input: 0, output: 0, cached: 0, total: 0, cost: 0, sessions: 0 };
    }
    byModel[m].input += s.tokens.input;
    byModel[m].output += s.tokens.output;
    byModel[m].cached += s.tokens.cached;
    byModel[m].total += s.tokens.total;
    byModel[m].cost += s.cost;
    byModel[m].sessions++;

    // By Provider
    const p = s.provider || "other";
    if (!byProvider[p]) {
      byProvider[p] = { provider: p, input: 0, output: 0, cached: 0, total: 0, cost: 0, sessions: 0 };
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
      byProject[proj] = { project: proj, input: 0, output: 0, cached: 0, total: 0, cost: 0, sessions: 0 };
    }
    byProject[proj].input += s.tokens.input;
    byProject[proj].output += s.tokens.output;
    byProject[proj].cached += s.tokens.cached;
    byProject[proj].total += s.tokens.total;
    byProject[proj].cost += s.cost;
    byProject[proj].sessions++;

    // Timeseries key
    const d = new Date(s.timestamp);
    let timeKey;
    if (timeRange === "today") {
      timeKey = `${String(d.getHours()).padStart(2, "0")}:00`;
    } else if (timeRange === "year") {
      timeKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      timeKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    if (!timeseriesMap[timeKey]) {
      timeseriesMap[timeKey] = { date: timeKey, total: 0, input: 0, output: 0, cached: 0, cost: 0 };
    }
    timeseriesMap[timeKey].total += s.tokens.total;
    timeseriesMap[timeKey].input += s.tokens.input;
    timeseriesMap[timeKey].output += s.tokens.output;
    timeseriesMap[timeKey].cached += s.tokens.cached;
    timeseriesMap[timeKey].cost += s.cost;
  });

  const timeseries = Object.values(timeseriesMap).sort((a, b) => a.date.localeCompare(b.date));

  const cacheRate = totalTokens > 0 ? Math.round((totalCached / totalTokens) * 1000) / 10 : 0;

  return {
    summary: {
      totalTokens,
      totalInput,
      totalOutput,
      totalCached,
      cacheRate,
      totalCost: Math.round(totalCost * 100) / 100,
      totalCostVnd: Math.round(totalCost * 25400),
      sessionCount: filtered.length,
      totalRequests,
    },
    timeseries,
    byModel: Object.values(byModel).sort((a, b) => b.total - a.total),
    byProvider: Object.values(byProvider).sort((a, b) => b.total - a.total),
    byProject: Object.values(byProject).sort((a, b) => b.total - a.total),
    sessions: filtered.slice(0, 100), // Top 100 most recent sessions
  };
}
