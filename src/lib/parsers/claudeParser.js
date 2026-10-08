import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

function normalizeClaudeTool(name, input = {}) {
  const n = String(name || "").toLowerCase();
  const cmd = String(input.command || "").trim();
  const cmdLower = cmd.toLowerCase();

  if (n === "bash") {
    if (cmdLower.startsWith("docker") || cmdLower.includes("docker exec")) return "docker";
    if (cmdLower.startsWith("git ") || cmdLower.startsWith("gh ")) return "git";
    if (cmdLower.includes("gitnexus")) return "gitnexus";
    return "bash";
  }

  if (n.includes("read") || n.includes("view") || n.includes("glob")) return "read";
  if (n.includes("edit") || n.includes("write") || n.includes("patch") || n.includes("replace")) return "edit";
  if (n.includes("grep") || n.includes("search")) return "search";
  if (n.includes("agent") || n.includes("task")) return "agent";
  if (n.includes("browser") || n.includes("playwright")) return "browser";
  if (n.includes("gitnexus")) return "gitnexus";

  return "mcp";
}

/**
 * Parses a Claude Code session into normalized chat turns.
 * @param {string} sessionId
 * @returns {Promise<{ ok: boolean, session: any, turns: any[] }>}
 */
export async function parseClaudeTranscript(sessionId) {
  const safeId = String(sessionId || "").trim();
  if (!/^[a-zA-Z0-9_-]{4,64}$/.test(safeId)) {
    throw new Error("Invalid session ID format");
  }

  const homeDir = os.homedir();
  const sessionsDir = path.join(homeDir, ".claude", "sessions");
  const projectsDir = path.join(homeDir, ".claude", "projects");

  let meta = {};
  try {
    const rawMeta = await fs.readFile(path.join(sessionsDir, `${safeId}.json`), "utf-8");
    meta = JSON.parse(rawMeta);
  } catch {
    // metadata might be missing or session id is project-scoped
  }

  // Find candidate jsonl transcript
  let transcriptPath = null;
  try {
    const projectFolders = await fs.readdir(projectsDir);
    for (const pf of projectFolders) {
      const candidate = path.join(projectsDir, pf, `${safeId}.jsonl`);
      try {
        await fs.access(candidate);
        transcriptPath = candidate;
        break;
      } catch {
        // try next
      }
    }
  } catch {
    // projects folder might be empty
  }

  if (!transcriptPath) {
    throw new Error(`Claude transcript not found for session ${safeId}`);
  }

  // Security check: ensure resolved candidate path stays within projectsDir
  if (!path.resolve(transcriptPath).startsWith(path.resolve(projectsDir))) {
    throw new Error("Directory traversal detected in Claude transcript path");
  }

  const rawContent = await fs.readFile(transcriptPath, "utf-8");
  const lines = rawContent.split("\n");

  const turns = [];
  let currentAssistantTurn = null;

  let totalIn = 0;
  let totalOut = 0;
  let totalCached = 0;
  let model = meta.model || "claude-3-7-sonnet";
  let startedAt = meta.startedAt ? new Date(meta.startedAt).toISOString() : null;
  let updatedAt = meta.updatedAt ? new Date(meta.updatedAt).toISOString() : null;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line) continue;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      if (idx === lines.length - 1) continue;
      continue;
    }

    const timestamp = entry.timestamp || new Date().toISOString();
    if (!startedAt) startedAt = timestamp;
    updatedAt = timestamp;

    const msg = entry.message;
    if (!msg) continue;

    if (msg.model) model = msg.model;

    const u = msg.usage;
    if (u) {
      if (u.input_tokens) totalIn += u.input_tokens;
      if (u.output_tokens) totalOut += u.output_tokens;
      if (u.cache_read_input_tokens) totalCached += u.cache_read_input_tokens;
    }

    // 1. User Message
    if (msg.role === "user") {
      if (currentAssistantTurn) {
        turns.push(currentAssistantTurn);
        currentAssistantTurn = null;
      }

      let contentStr = "";
      if (typeof msg.content === "string") {
        contentStr = msg.content;
      } else if (Array.isArray(msg.content)) {
        for (const blk of msg.content) {
          if (blk.type === "text") contentStr += (contentStr ? "\n" : "") + blk.text;
          // Handle tool results that come back in user message
          if (blk.type === "tool_result" && currentAssistantTurn) {
            const toolId = blk.tool_use_id;
            const targetTc = currentAssistantTurn.toolCalls.find((t) => t.id === toolId);
            if (targetTc) {
              targetTc.output = typeof blk.content === "string" ? blk.content : JSON.stringify(blk.content);
              if (blk.is_error) targetTc.status = "error";
            }
          }
        }
      }

      if (contentStr.trim()) {
        turns.push({
          id: `turn-user-${turns.length}`,
          role: "user",
          timestamp,
          content: contentStr.trim(),
        });
      }

      currentAssistantTurn = {
        id: `turn-asst-${turns.length}`,
        role: "assistant",
        timestamp,
        content: "",
        thinking: "",
        toolCalls: [],
        tokens: {
          input: u?.input_tokens || 0,
          output: u?.output_tokens || 0,
          cached: u?.cache_read_input_tokens || 0,
        },
        status: "completed",
      };
      continue;
    }

    // 2. Assistant Message
    if (msg.role === "assistant") {
      if (!currentAssistantTurn) {
        currentAssistantTurn = {
          id: `turn-asst-${turns.length}`,
          role: "assistant",
          timestamp,
          content: "",
          thinking: "",
          toolCalls: [],
          tokens: { input: 0, output: 0, cached: 0 },
          status: "completed",
        };
      }

      if (u) {
        currentAssistantTurn.tokens.input += u.input_tokens || 0;
        currentAssistantTurn.tokens.output += u.output_tokens || 0;
        currentAssistantTurn.tokens.cached += u.cache_read_input_tokens || 0;
      }

      if (typeof msg.content === "string") {
        currentAssistantTurn.content += (currentAssistantTurn.content ? "\n\n" : "") + msg.content;
      } else if (Array.isArray(msg.content)) {
        for (const blk of msg.content) {
          if (blk.type === "text" && blk.text) {
            currentAssistantTurn.content += (currentAssistantTurn.content ? "\n\n" : "") + blk.text;
          }
          if (blk.type === "thinking" && blk.thinking) {
            currentAssistantTurn.thinking += (currentAssistantTurn.thinking ? "\n\n" : "") + blk.thinking;
          }
          if (blk.type === "tool_use") {
            const toolType = normalizeClaudeTool(blk.name, blk.input);
            currentAssistantTurn.toolCalls.push({
              id: blk.id || `tool-${currentAssistantTurn.toolCalls.length}`,
              name: blk.name,
              type: toolType,
              summary: blk.input?.command ? `bash: ${blk.input.command.slice(0, 40)}` : blk.name,
              action: blk.name,
              args: blk.input || {},
              output: "",
              status: "completed",
            });
          }
        }
      }
    }
  }

  if (currentAssistantTurn && (currentAssistantTurn.content || currentAssistantTurn.toolCalls.length > 0 || currentAssistantTurn.thinking)) {
    turns.push(currentAssistantTurn);
  }

  const durationMs = (startedAt && updatedAt) ? Math.max(0, new Date(updatedAt).getTime() - new Date(startedAt).getTime()) : 0;

  return {
    ok: true,
    session: {
      id: safeId,
      cli: "claude",
      model,
      startedAt,
      updatedAt,
      durationMs,
      cwd: meta.cwd || null,
      tokens: {
        input: totalIn,
        output: totalOut,
        cached: totalCached,
      },
      turnsCount: turns.length,
    },
    turns,
  };
}
