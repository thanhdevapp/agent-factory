import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { normalizeTrace } from "../traceContract.js";

const execAsync = promisify(exec);

/**
 * Codex (OpenAI) stores one rollout file per session under
 * ~/.codex/sessions/<YYYY>/<MM>/<DD>/rollout-<timestamp>-<uuid>.jsonl
 *
 * Rollout entries are `{ type, timestamp, payload }` where `type` is one of
 * `session_meta`, `turn_context`, `response_item`, `event_msg`, `world_state`.
 */

function compactText(value, maxLength = 160) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, maxLength) : null;
}

function textFromContent(content) {
  if (typeof content === "string") return compactText(content);
  if (!Array.isArray(content)) return null;
  const joined = content
    .map((block) => (typeof block?.text === "string" ? block.text : ""))
    .filter(Boolean)
    .join(" ");
  return compactText(joined);
}

/**
 * Normalizes tool name and command/args from OpenAI Codex into a standard tool type.
 */
export function normalizeCodexTool(name, args = {}) {
  const n = String(name || "").toLowerCase();
  const cmd = String(args.cmd || args.command || "").trim();
  const cmdLower = cmd.toLowerCase();

  if (n === "exec_command" || n === "local_shell_call" || n === "bash" || n === "shell") {
    if (cmdLower.startsWith("docker") || cmdLower.includes("docker exec")) {
      return { type: "docker", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.startsWith("git ") || cmdLower.startsWith("gh ")) {
      return { type: "git", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.includes("gitnexus")) {
      return { type: "gitnexus", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.startsWith("rg ") || cmdLower.startsWith("grep ")) {
      return { type: "search", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (/^(cat|sed|head|tail|ls|find)\b/.test(cmdLower)) {
      return { type: "read", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    return { type: "bash", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
  }

  if (n === "apply_patch" || n === "patch" || n.includes("write") || n.includes("edit") || n.includes("replace")) {
    const file = args.file_path || args.path || args.TargetFile || "";
    return { type: "edit", detail: file ? `Edit: ${path.basename(file)}` : "Edit file" };
  }

  if (n.includes("read") || n.includes("view") || n.includes("glob")) {
    const file = args.file_path || args.path || args.AbsolutePath || "";
    return { type: "read", detail: file ? `Read: ${path.basename(file)}` : "Read file" };
  }

  if (n.includes("search") || n.includes("grep") || n.includes("find")) {
    return { type: "search", detail: args.pattern || args.query || "Search" };
  }

  if (n.includes("spawn_agent") || n.includes("followup_task") || n.includes("agent")) {
    return { type: "agent", detail: "Subagent Task" };
  }

  if (n.includes("browser") || n.includes("playwright")) {
    return { type: "browser", detail: "Browser automation" };
  }

  if (n.includes("web") || n.includes("fetch")) {
    return { type: "web", detail: "Web fetch" };
  }

  return { type: "mcp", detail: n };
}

/**
 * Classifies Codex surface into:
 * - Desktop App: `clientType: "desktop", label: "Codex Desktop"`
 * - CLI: `clientType: "cli", label: "Codex CLI"`
 * - VS Code Extension: `clientType: "extension", label: "Codex Extension"`
 *
 * @returns {{ clientType: string, label: string }}
 */
export function classifyCodexSession(originator, source) {
  const org = String(originator || "").toLowerCase();
  const src = String(source || "").toLowerCase();

  if (
    org.includes("desktop") ||
    org === "codex_app" ||
    org === "codex-app" ||
    org === "codex_app_server" ||
    src === "desktop" ||
    src === "app"
  ) {
    return { clientType: "desktop", label: "Codex Desktop" };
  }

  if (org.includes("vscode") || src === "vscode") {
    return { clientType: "extension", label: "Codex Extension" };
  }

  return { clientType: "cli", label: "Codex CLI" };
}

function extractWorkspace(cwd) {
  return cwd ? path.basename(cwd) : null;
}

/** Date directories that could hold a session newer than `maxAgeMs`. */
function recentDayKeys(maxAgeMs, now) {
  const dayMs = 86_400_000;
  const span = Math.min(Math.ceil(maxAgeMs / dayMs) + 1, 400);
  const keys = [];
  for (let back = 0; back <= span; back++) {
    const d = new Date(now - back * dayMs);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    if (back > 0 && now - new Date(y, d.getMonth(), d.getDate()).getTime() >= maxAgeMs) break;
    keys.push({ dir: path.join(String(y), m, day), y: String(y), m, day });
  }
  return keys;
}

async function getRunningCodexProcesses() {
  try {
    const { stdout } = await execAsync("pgrep -l -i codex");
    const lines = stdout.trim().split("\n").filter(Boolean);
    return lines.map((line) => {
      const [pidStr, ...rest] = line.trim().split(/\s+/);
      return { pid: Number(pidStr), name: rest.join(" ").toLowerCase() };
    });
  } catch {
    return [];
  }
}

export async function parseCodexRollout(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");

  const result = {
    meta: null,
    model: null,
    cwd: null,
    sessionTitle: null,
    lastText: null,
    lastTextRole: null,
    toolSet: new Set(),
    toolInvocations: [],
    recentLogs: [],
    activeTool: null,
    currentCommand: null,
    tokens: null,
    startedAt: null,
    lastTimestamp: null,
    openTurn: false,
    error: null,
    isLooping: false,
  };

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    const ts = entry.timestamp ? new Date(entry.timestamp).getTime() : null;
    if (ts && (!result.lastTimestamp || ts > result.lastTimestamp)) result.lastTimestamp = ts;

    const payload = entry.payload;
    if (!payload) continue;

    if (entry.type === "session_meta") {
      result.meta = payload;
      result.cwd = payload.cwd || null;
      result.startedAt = payload.timestamp ? new Date(payload.timestamp).getTime() : null;
      continue;
    }

    if (entry.type === "turn_context") {
      if (payload.model) result.model = payload.model;
      if (payload.cwd && !result.cwd) result.cwd = payload.cwd;
      continue;
    }

    if (entry.type === "response_item") {
      const type = payload.type;

      if (type === "message") {
        const role = payload.role;
        if (role !== "user" && role !== "assistant") continue;

        // Filter out synthetic injected instructions
        const kinds = payload.internal_chat_message_metadata_passthrough?.content_item_kinds;
        if (role === "user" && Array.isArray(kinds) && !kinds.includes("user.text")) continue;

        const text = textFromContent(payload.content);
        if (!text) continue;
        if (role === "user" && /^(# AGENTS\.md instructions|<INSTRUCTIONS>|<permissions instructions>|<model_switch>)/i.test(text)) continue;

        if (role === "user") {
          result.sessionTitle ||= compactText(text, 80);
          result.lastText = text;
          result.lastTextRole = "user";
          result.recentLogs.push({
            timestamp: entry.timestamp || new Date().toISOString(),
            type: "prompt",
            summary: "User Prompt",
            detail: compactText(text, 100),
          });
        } else {
          result.lastText = text;
          result.lastTextRole = "assistant";
        }
        continue;
      }

      if (type === "function_call" || type === "local_shell_call" || type === "custom_tool_call") {
        let args = {};
        if (typeof payload.arguments === "string") {
          try {
            args = JSON.parse(payload.arguments);
          } catch {
            args = {};
          }
        } else if (payload.arguments && typeof payload.arguments === "object") {
          args = payload.arguments;
        }

        const name = payload.name || payload.tool || "tool";
        const { type: toolType, detail } = normalizeCodexTool(name, args);

        result.toolSet.add(toolType || name.toLowerCase());
        result.activeTool = toolType;
        result.currentCommand = detail || name;

        const entryTime = ts || Date.now();
        result.toolInvocations.push({
          name,
          detail: detail || name,
          time: entryTime,
        });

        result.recentLogs.push({
          timestamp: entry.timestamp || new Date().toISOString(),
          type: toolType || "tool",
          summary: name,
          detail: detail || name,
        });
        continue;
      }

      if (type === "function_call_output") {
        const outText = typeof payload.output === "string" ? payload.output : JSON.stringify(payload.output || "");
        if (outText.includes("error:") || outText.includes("failed") || outText.includes("Error:")) {
          result.recentLogs.push({
            timestamp: entry.timestamp || new Date().toISOString(),
            type: "error",
            summary: "Tool Error",
            detail: compactText(outText, 100),
          });
        }
      }
      continue;
    }

    if (entry.type === "event_msg") {
      if (payload.type === "token_count") {
        const usage = payload.info?.total_token_usage;
        if (usage && Number.isFinite(usage.total_tokens)) {
          result.tokens = usage;
        }
        continue;
      }
      if (payload.type === "task_started") {
        result.openTurn = true;
        result.error = null;
        continue;
      }
      if (payload.type === "task_complete") {
        result.openTurn = false;
        if (payload.error?.message) {
          result.error = String(payload.error.message).slice(0, 200);
          result.recentLogs.push({
            timestamp: entry.timestamp || new Date().toISOString(),
            type: "error",
            summary: "Task Complete Error",
            detail: result.error,
          });
        }
      }
    }
  }

  // Loop detection: 5 consecutive identical tool calls within 60s
  if (result.toolInvocations.length >= 5) {
    const lastN = result.toolInvocations.slice(-10);
    for (let s = 0; s <= lastN.length - 5; s++) {
      const window = lastN.slice(s, s + 5);
      const targetKey = `${window[0].name}:${window[0].detail}`;
      const sameCall = window.every((w) => `${w.name}:${w.detail}` === targetKey);
      const timeSpan = (window[window.length - 1].time || 0) - (window[0].time || 0);
      if (sameCall && (timeSpan <= 60000 || timeSpan === 0)) {
        result.isLooping = true;
        break;
      }
    }
  }

  // Cap recent logs to max 25 entries for performance
  if (result.recentLogs.length > 25) {
    result.recentLogs = result.recentLogs.slice(-25);
  }

  return result;
}

export async function getCodexTraces(maxAgeMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  const sessionsRoot = path.join(os.homedir(), ".codex", "sessions");
  const traces = [];

  let yearDirs;
  try {
    yearDirs = await fs.readdir(sessionsRoot, { withFileTypes: true });
  } catch {
    return traces;
  }

  const existingYears = new Set(yearDirs.filter((d) => d.isDirectory()).map((d) => d.name));

  const files = [];
  for (const key of recentDayKeys(maxAgeMs, now)) {
    if (!existingYears.has(key.y)) continue;
    const dayPath = path.join(sessionsRoot, key.dir);

    let entries;
    try {
      entries = await fs.readdir(dayPath);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (name.endsWith(".jsonl")) files.push(path.join(dayPath, name));
    }
  }

  const runningProcs = await getRunningCodexProcesses();
  const hasRunningCodex = runningProcs.length > 0;

  for (const filePath of files) {
    try {
      const stat = await fs.stat(filePath);
      const ageMs = now - stat.mtimeMs;
      if (ageMs > maxAgeMs) continue;

      const parsed = await parseCodexRollout(filePath);
      // Legacy rollouts predate `session_meta` and carry no cwd/model/usage.
      if (!parsed.meta) continue;

      const sessionId = parsed.meta.session_id || parsed.meta.id || path.basename(filePath, ".jsonl");
      const { clientType, label } = classifyCodexSession(parsed.meta.originator, parsed.meta.source);
      const workspace = extractWorkspace(parsed.cwd) || label;

      let state = "done";
      if (parsed.isLooping) {
        state = "streaming";
      } else if (parsed.openTurn) {
        state = "streaming";
      } else if (parsed.error && ageMs > 15 * 60 * 1000) {
        state = "error";
      } else if (hasRunningCodex && ageMs < 15 * 60 * 1000) {
        state = ageMs < 45_000 ? "streaming" : "idle";
      } else if (ageMs < 60_000) {
        state = "idle";
      } else if (parsed.error) {
        state = "error";
      }

      const usage = parsed.tokens;
      const elapsedMs =
        parsed.startedAt && parsed.lastTimestamp
          ? Math.max(0, parsed.lastTimestamp - parsed.startedAt)
          : null;

      traces.push(normalizeTrace({
        traceId: `codex-${sessionId.slice(0, 8)}`,
        cli: "codex",
        clientType,
        source: clientType,
        connectionId: `${label} (${sessionId.slice(0, 6)})`,
        account: workspace,
        model: parsed.model || null,
        provider: "openai (codex)",
        state,
        startedAt: parsed.startedAt,
        elapsedMs,
        tokens: usage
          ? {
              input: usage.input_tokens ?? null,
              output: usage.output_tokens ?? null,
              cached: usage.cached_input_tokens ?? null,
            }
          : { input: null, output: null, cached: null },
        cost: null,
        status: parsed.error ? "error" : null,
        tools: Array.from(parsed.toolSet),
        activeTool: parsed.activeTool || (parsed.toolSet.size > 0 ? Array.from(parsed.toolSet)[0] : null),
        currentCommand: parsed.currentCommand || null,
        sessionTitle: parsed.sessionTitle || workspace,
        lastText: parsed.lastText,
        lastTextRole: parsed.lastTextRole,
        error: parsed.error,
        isLooping: parsed.isLooping,
        logs: parsed.recentLogs,
      }));
    } catch {
      // unreadable rollout
    }
  }

  traces.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  return traces;
}