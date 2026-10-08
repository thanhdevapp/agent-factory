import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { normalizeTrace } from "../traceContract.js";

const TOOL_MAP = {
  view_file: "read",
  read_file: "read",
  replace_file_content: "edit",
  write_to_file: "edit",
  call_mcp_tool: "mcp",
  list_resources: "mcp",
  invoke_subagent: "agent",
  grep_search: "search",
  list_dir: "read",
  find_by_name: "read",
  define_subagent: "agent",
};

function normalizeToolCall(tc) {
  if (!tc || !tc.name) return { type: "mcp", detail: null };
  const name = tc.name;
  const args = tc.args || {};

  // 1. MCP Tools inspection
  if (name === "call_mcp_tool") {
    const srv = String(args.ServerName || "").toLowerCase();
    const tool = String(args.ToolName || "").toLowerCase();
    if (srv.includes("gitnexus") || tool.includes("cypher") || tool.includes("pdg_query") || tool.includes("impact")) {
      return { type: "gitnexus", detail: `GitNexus: ${tool}` };
    }
    if (srv.includes("playwright") || srv.includes("browser") || tool.startsWith("browser_")) {
      return { type: "browser", detail: `Browser: ${tool}` };
    }
    return { type: "mcp", detail: `MCP: ${srv}/${tool}` };
  }

  // 2. Terminal commands inspection
  if (name === "run_command") {
    const cmd = String(args.CommandLine || "").trim();
    const cmdLower = cmd.toLowerCase();
    if (cmdLower.startsWith("docker") || cmdLower.includes("docker exec") || cmdLower.includes("docker-compose")) {
      return { type: "docker", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.startsWith("git ") || cmdLower.startsWith("gh ") || cmdLower.includes("git commit") || cmdLower.includes("git push")) {
      return { type: "git", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.includes("gitnexus")) {
      return { type: "gitnexus", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    return { type: "bash", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
  }

  // 3. Native tools mapping
  const mapped = TOOL_MAP[name];
  const target = args.TargetFile || args.AbsolutePath || args.query || "";
  const detail = target ? `${name}: ${path.basename(target)}` : name;

  if (mapped) return { type: mapped, detail };
  if (name.includes("read") || name.includes("find") || name.includes("dir") || name.includes("list")) return { type: "read", detail };
  if (name.includes("edit") || name.includes("write") || name.includes("patch")) return { type: "edit", detail };
  if (name.includes("search") || name.includes("grep")) return { type: "search", detail };
  if (name.includes("agent") || name.includes("message")) return { type: "agent", detail };

  return { type: "mcp", detail };
}

export function extractModelFromTranscript(content) {
  if (!content) return null;
  const match = content.match(/Model Selection` from [^ ]+ to (.*?)(?:\.\s+No need|\.\s*\n|<\/USER_SETTINGS_CHANGE>)/i);
  if (match && match[1]) return match[1].trim();
  const matchFallback = content.match(/Model Selection`? from .*? to ([^\n<.]+)/i);
  if (matchFallback && matchFallback[1]) return matchFallback[1].trim();
  return null;
}

export function normalizeModel(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("3.8") && lower.includes("flash")) return "gemini-3.8-flash";
  if (lower.includes("3.5") && lower.includes("flash")) return "gemini-3.5-flash";
  if (lower.includes("3.8") && lower.includes("pro")) return "gemini-3.8-pro";
  if (lower.includes("3.1") && lower.includes("pro")) return "gemini-3.1-pro";
  if (lower.includes("2.5") && lower.includes("pro")) return "gemini-2.5-pro";
  if (lower.includes("2.5") && lower.includes("flash")) return "gemini-2.5-flash";
  if (lower.includes("sonnet") && lower.includes("5.5")) return "claude-sonnet-5.5";
  if (lower.includes("sonnet") && lower.includes("3.7")) return "claude-3.7-sonnet";
  if (lower.includes("sonnet") && lower.includes("3.5")) return "claude-3.5-sonnet";
  return raw.replace(/[()]/g, "").trim().toLowerCase().replace(/\s+/g, "-");
}

function compactText(value, maxLength = 160) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, maxLength) : null;
}

function getProviderFromModel(modelName, clientType) {
  const model = String(modelName || "").toLowerCase();
  let provider = null;
  if (model.includes("gemini")) provider = "gemini";
  else if (model.includes("claude")) provider = "anthropic";
  else if (model.includes("gpt") || model.includes("o1") || model.includes("o3")) provider = "openai";
  else if (model.includes("minimax")) provider = "minimax";
  else if (model.includes("deepseek")) provider = "deepseek";
  return provider ? `${provider} (${clientType})` : null;
}

function cleanUserPrompt(content) {
  if (!content) return null;
  let text = String(content);
  // If there are explicit <USER_REQUEST> tags, extract the actual user request
  const userRequestMatches = [...text.matchAll(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/gi)];
  if (userRequestMatches.length > 0) {
    text = userRequestMatches[userRequestMatches.length - 1][1];
  } else {
    text = text
      .replace(/<CONTEXT_SUMMARY>[\s\S]*?<\/CONTEXT_SUMMARY>/gi, "")
      .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/gi, "")
      .replace(/<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>/gi, "")
      .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, "");
  }
  return compactText(text);
}

async function discoverAntigravityBrainDirs() {
  const homeDir = os.homedir();
  const geminiDir = path.join(homeDir, ".gemini");
  const discovered = [];
  const seen = new Set();

  const addDir = (dirPath, defaultSource) => {
    if (seen.has(dirPath)) return;
    seen.add(dirPath);
    discovered.push({ dir: dirPath, source: defaultSource });
  };

  // 1. Standard paths
  addDir(path.join(geminiDir, "antigravity-cli", "brain"), "cli");
  addDir(path.join(geminiDir, "antigravity", "brain"), "app");
  addDir(path.join(geminiDir, "antigravity-ide", "brain"), "ide");

  // 2. Dynamic discovery of any sibling folders in ~/.gemini
  try {
    const entries = await fs.readdir(geminiDir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const bPath = path.join(geminiDir, ent.name, "brain");
      if (seen.has(bPath)) continue;
      try {
        const s = await fs.stat(bPath);
        if (s.isDirectory()) {
          const lower = ent.name.toLowerCase();
          const source = lower.includes("ide") ? "ide" : lower.includes("app") || lower === "antigravity" ? "app" : "cli";
          addDir(bPath, source);
        }
      } catch {}
    }
  } catch {}

  const validDirs = [];
  for (const item of discovered) {
    try {
      const s = await fs.stat(item.dir);
      if (s.isDirectory()) validDirs.push(item);
    } catch {}
  }
  return validDirs;
}

export async function getAntigravityTraces(maxAgeMs = 24 * 60 * 60 * 1000) {
  const homeDir = os.homedir();
  const searchDirs = await discoverAntigravityBrainDirs();

  let defaultCliModel = null;
  try {
    const cliSettingsRaw = await fs.readFile(path.join(homeDir, ".gemini", "antigravity-cli", "settings.json"), "utf-8");
    const cliSettings = JSON.parse(cliSettingsRaw);
    if (cliSettings.model) defaultCliModel = cliSettings.model;
  } catch {}

  try {
    const now = Date.now();
    const traces = [];
    const seenConvIds = new Set();

    const candidates = [];

    for (const { dir: brainDir, source } of searchDirs) {
      let entries;
      try {
        entries = await fs.readdir(brainDir, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const ent of entries) {
        if (!ent.isDirectory()) continue;
        const convId = ent.name;
        if (seenConvIds.has(convId)) continue;
        seenConvIds.add(convId);
        const transcriptPath = path.join(brainDir, convId, ".system_generated", "logs", "transcript.jsonl");

        try {
          const stat = await fs.stat(transcriptPath);
          const mtime = stat.mtimeMs;
          if (now - mtime > maxAgeMs) continue;
          candidates.push({ transcriptPath, mtime, convId, source, stat });
        } catch {}
      }
    }

    // Sort candidate transcripts by mtime descending (most recent first)
    candidates.sort((a, b) => b.mtime - a.mtime);

    // Limit parsing to the most recent 100 sessions to avoid unbounded disk I/O
    const toProcess = candidates.slice(0, 100);

    for (const { transcriptPath, mtime, convId, source, stat } of toProcess) {
      try {
        const content = await fs.readFile(transcriptPath, "utf-8");
        const lines = content.trim().split("\n");
        if (lines.length === 0) continue;

        let totalIn = 0;
        let totalOut = 0;
        let totalCached = 0;
        let hasUsage = false;
        let lastToolEntry = null;
        let lastStep = null;
        const toolSet = new Set();
        let firstTime = null;
        let lastTime = null;
        let activeCommandDetail = null;
        let detectedCwd = null;
        let sessionTitle = null;
        let lastText = null;
        let lastTextRole = null;
        const toolInvocations = [];
        const recentLogs = [];

        for (const line of lines) {
          if (!line) continue;
          try {
            const entry = JSON.parse(line);
            const entryTime = entry.created_at ? new Date(entry.created_at).getTime() : Date.now();
            if (!firstTime && entry.created_at) firstTime = entryTime;
            if (entry.created_at) lastTime = entryTime;

            if (
              Number.isFinite(entry.input_tokens) ||
              Number.isFinite(entry.output_tokens) ||
              Number.isFinite(entry.cache_read_tokens)
            ) {
              hasUsage = true;
              totalIn += entry.input_tokens || 0;
              totalOut += entry.output_tokens || 0;
              totalCached += entry.cache_read_tokens || 0;
            }

            if (entry.type === "USER_INPUT" && entry.content) {
              const cleanPrompt = cleanUserPrompt(entry.content);
              if (cleanPrompt) {
                sessionTitle ||= compactText(cleanPrompt, 80);
                lastText = cleanPrompt;
                lastTextRole = "user";
                recentLogs.push({
                  timestamp: entry.created_at || new Date().toISOString(),
                  type: "prompt",
                  summary: "User Prompt",
                  detail: cleanPrompt.slice(0, 100),
                });
              }
            } else if (entry.type === "PLANNER_RESPONSE" && entry.content) {
              const response = compactText(entry.content);
              if (response) {
                lastText = response;
                lastTextRole = "assistant";
              }
            }

            if (Array.isArray(entry.tool_calls) && entry.tool_calls.length > 0) {
              lastToolEntry = entry;
              for (const tc of entry.tool_calls) {
                if (tc.args?.Cwd && !detectedCwd) detectedCwd = tc.args.Cwd;
                if (!detectedCwd && (tc.args?.TargetFile || tc.args?.AbsolutePath)) {
                  const p = tc.args.TargetFile || tc.args.AbsolutePath;
                  if (p.includes("/Projects/")) detectedCwd = p.split("/").slice(0, 5).join("/");
                }
                const { type, detail } = normalizeToolCall(tc);
                if (type) toolSet.add(type);
                if (detail) activeCommandDetail = detail;

                toolInvocations.push({
                  name: tc.name,
                  time: entryTime,
                  detail: detail || tc.name,
                });

                recentLogs.push({
                  timestamp: entry.created_at || new Date().toISOString(),
                  type: type || "tool",
                  summary: tc.name,
                  detail: detail || tc.name,
                });
              }
            }

            if (entry.status === "ERROR" || (entry.type === "GENERIC" && entry.content && entry.content.includes("error"))) {
              recentLogs.push({
                timestamp: entry.created_at || new Date().toISOString(),
                type: "error",
                summary: "Error",
                detail: String(entry.content || "Command failed").slice(0, 100),
              });
            }

            lastStep = entry;
          } catch {
            // ignore malformed line
          }
        }

        let state = "done";
        if (lastToolEntry?.status === "RUNNING") {
          state = "streaming";
        } else if (lastStep?.type === "USER_INPUT") {
          state = "pending";
        } else if (now - mtime < 45 * 1000) {
          state = "idle";
        }

        // Loop detection: 5 consecutive identical tool calls (same tool and target) within 60s
        let isLooping = false;
        if (toolInvocations.length >= 5) {
          const lastN = toolInvocations.slice(-10);
          for (let s = 0; s <= lastN.length - 5; s++) {
            const window = lastN.slice(s, s + 5);
            const targetKey = `${window[0].name}:${window[0].detail}`;
            const sameCall = window.every((w) => `${w.name}:${w.detail}` === targetKey);
            const timeSpan = (window[window.length - 1].time || 0) - (window[0].time || 0);
            if (sameCall && (timeSpan <= 60000 || timeSpan === 0)) {
              isLooping = true;
              break;
            }
          }
        }

        let activeTool = null;
        if (lastToolEntry && Array.isArray(lastToolEntry.tool_calls) && lastToolEntry.tool_calls.length > 0) {
          const lastTc = lastToolEntry.tool_calls[lastToolEntry.tool_calls.length - 1];
          activeTool = normalizeToolCall(lastTc).type;
        }

        const elapsedMs = (lastTime && firstTime) ? Math.max(0, lastTime - firstTime) : (now - mtime);
        const rawFolder = detectedCwd ? path.basename(detectedCwd) : `agy-${convId.slice(0, 6)}`;
        const folderName = rawFolder.replace(/["'\\]/g, "").trim();

        seenConvIds.add(convId);
        const clientType = source === "app" ? "app" : source === "ide" ? "ide" : "cli";
        const appLabel = source === "app" ? "Antigravity App" : source === "ide" ? "Antigravity IDE" : "Antigravity";
        const rawModel = extractModelFromTranscript(content) || (source === "cli" ? defaultCliModel : null);
        const modelName = normalizeModel(rawModel);
        const providerName = getProviderFromModel(modelName, clientType);

        const fallbackWorkspace = path.basename(process.cwd()) || "agent-factory";
        const finalAccount = folderName || fallbackWorkspace;
        const finalSessionTitle = sessionTitle || finalAccount;

        traces.push(normalizeTrace({
          traceId: `agy-${convId.slice(0, 8)}`,
          cli: "antigravity",
          clientType,
          source,
          connectionId: `${appLabel} (${convId.slice(0, 6)})`,
          account: finalAccount,
          model: modelName,
          provider: providerName,
          state,
          startedAt: firstTime || (now - elapsedMs),
          elapsedMs,
          tokens: {
            input: hasUsage ? totalIn : null,
            output: hasUsage ? totalOut : null,
            cached: hasUsage ? totalCached : null,
          },
          cost: null,
          status: isLooping ? "error" : null,
          tools: Array.from(toolSet),
          activeTool,
          currentCommand: activeCommandDetail,
          sessionTitle: finalSessionTitle,
          lastText,
          lastTextRole,
          isLooping,
          logs: recentLogs.slice(-25),
        }));
      } catch {
        // file missing or unreadable
      }
    }

    // Sort: active (streaming/pending) first, then by most recent startedAt
    traces.sort((a, b) => {
      const activeA = (a.state === "streaming" || a.state === "pending") ? 1 : 0;
      const activeB = (b.state === "streaming" || b.state === "pending") ? 1 : 0;
      if (activeA !== activeB) return activeB - activeA;
      return (b.startedAt || 0) - (a.startedAt || 0);
    });

    return traces;
  } catch {
    return [];
  }
}
