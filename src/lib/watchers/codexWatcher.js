import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { normalizeTrace } from "../traceContract.js";

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
 * `originator` is the reliable signal for which Codex surface started the
 * session; `source` alone is ambiguous because the CLI can also report
 * `vscode` when launched from an editor.
 *
 * @returns {{ clientType: string, label: string }}
 */
function classifyCodexSession(originator, source) {
  const org = String(originator || "").toLowerCase();
  if (org.includes("desktop") || org === "codex_app" || org === "codex_app_server") {
    return { clientType: "app", label: "Codex App" };
  }
  if (org.includes("vscode") || String(source || "").toLowerCase() === "vscode") {
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

async function parseCodexRollout(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");

  const result = {
    meta: null,
    model: null,
    cwd: null,
    sessionTitle: null,
    lastText: null,
    lastTextRole: null,
    toolSet: new Set(),
    tokens: null,
    startedAt: null,
    lastTimestamp: null,
    openTurn: false,
    error: null,
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

        // Codex injects AGENTS.md / environment context as synthetic `user`
        // messages. Those are not what the human typed, so they must not become
        // the session title or the "last message" preview.
        const kinds = payload.internal_chat_message_metadata_passthrough?.content_item_kinds;
        if (role === "user" && Array.isArray(kinds) && !kinds.includes("user.text")) continue;

        const text = textFromContent(payload.content);
        if (!text) continue;
        // Older rollouts predate `content_item_kinds`, so also match the
        // injected-instruction envelope by shape.
        if (role === "user" && /^(# AGENTS\.md instructions|<INSTRUCTIONS>)/i.test(text)) continue;
        if (role === "user") {
          result.sessionTitle ||= compactText(text, 80);
          result.lastText = text;
          result.lastTextRole = "user";
        } else {
          result.lastText = text;
          result.lastTextRole = "assistant";
        }
        continue;
      }

      if (type === "function_call" || type === "local_shell_call" || type === "custom_tool_call") {
        const name = payload.name || payload.tool || "tool";
        result.toolSet.add(String(name).toLowerCase());
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
        }
      }
    }
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

  for (const filePath of files) {
    try {
      const stat = await fs.stat(filePath);
      if (now - stat.mtimeMs > maxAgeMs) continue;

      const parsed = await parseCodexRollout(filePath);
      // Legacy rollouts predate `session_meta` and carry no cwd/model/usage.
      if (!parsed.meta) continue;

      const sessionId = parsed.meta.session_id || parsed.meta.id || path.basename(filePath, ".jsonl");
      const { clientType, label } = classifyCodexSession(parsed.meta.originator, parsed.meta.source);
      const workspace = extractWorkspace(parsed.cwd) || label;

      let state = "done";
      if (parsed.openTurn) state = "streaming";
      else if (parsed.error) state = "error";
      else if (now - stat.mtimeMs < 60_000) state = "idle";

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
        provider: parsed.model ? "openai (codex)" : null,
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
        activeTool: null,
        currentCommand: null,
        sessionTitle: parsed.sessionTitle || workspace,
        lastText: parsed.lastText,
        lastTextRole: parsed.lastTextRole,
        error: parsed.error,
        isLooping: false,
        logs: [],
      }));
    } catch {
      // unreadable rollout
    }
  }

  traces.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  return traces;
}