import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { normalizeCodexTool, classifyCodexSession } from "../watchers/codexWatcher.js";

function compactText(value, maxLength = 160) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, maxLength) : null;
}

function textFromContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((block) => (typeof block?.text === "string" ? block.text : ""))
    .filter(Boolean)
    .join("\n");
}

function isSyntheticInstruction(text) {
  if (!text) return true;
  const trimmed = text.trim();
  return (
    trimmed.startsWith("# AGENTS.md instructions") ||
    trimmed.startsWith("<INSTRUCTIONS>") ||
    trimmed.startsWith("<permissions instructions>") ||
    trimmed.startsWith("<model_switch>") ||
    trimmed.startsWith("<multi_agent_mode>") ||
    trimmed.startsWith("<environment_context>") ||
    trimmed.startsWith("<skills_instructions>")
  );
}

/**
 * Searches ~/.codex/sessions/ recursively for a rollout file matching the session ID or prefix.
 */
async function findCodexRolloutPath(safeId) {
  const sessionsRoot = path.join(os.homedir(), ".codex", "sessions");

  let years;
  try {
    years = await fs.readdir(sessionsRoot, { withFileTypes: true });
  } catch {
    return null;
  }

  // Sort years descending (newest first)
  const yearDirs = years.filter((d) => d.isDirectory()).map((d) => d.name).sort().reverse();

  for (const year of yearDirs) {
    const yearPath = path.join(sessionsRoot, year);
    let months;
    try {
      months = await fs.readdir(yearPath, { withFileTypes: true });
    } catch {
      continue;
    }
    const monthDirs = months.filter((d) => d.isDirectory()).map((d) => d.name).sort().reverse();

    for (const month of monthDirs) {
      const monthPath = path.join(yearPath, month);
      let days;
      try {
        days = await fs.readdir(monthPath, { withFileTypes: true });
      } catch {
        continue;
      }
      const dayDirs = days.filter((d) => d.isDirectory()).map((d) => d.name).sort().reverse();

      for (const day of dayDirs) {
        const dayPath = path.join(monthPath, day);
        let files;
        try {
          files = await fs.readdir(dayPath);
        } catch {
          continue;
        }

        for (const file of files) {
          if (!file.endsWith(".jsonl")) continue;
          if (file.includes(safeId)) {
            return path.join(dayPath, file);
          }
        }
      }
    }
  }

  return null;
}

/**
 * Parses an OpenAI Codex session rollout into normalized turns
 * compatible with AGMon Chat, Time-Machine Replay, and Diff Viewer.
 *
 * @param {string} sessionId - Full or short session ID (e.g. "01a1199a-faf1..." or "01a1199a")
 * @returns {Promise<{ ok: boolean, session: any, turns: any[] }>}
 */
export async function parseCodexTranscript(sessionId) {
  const cleanId = String(sessionId || "").replace(/^codex-/, "").trim();
  if (!cleanId || !/^[a-zA-Z0-9_-]{4,64}$/.test(cleanId)) {
    throw new Error("Invalid Codex session ID format");
  }

  const rolloutPath = await findCodexRolloutPath(cleanId);
  if (!rolloutPath) {
    throw new Error(`Codex transcript not found for session "${sessionId}"`);
  }

  const raw = await fs.readFile(rolloutPath, "utf-8");
  const lines = raw.split("\n");

  let sessionMeta = null;
  let model = "gpt-5.6-terra";
  let cwd = process.cwd();
  let originator = "codex-cli";
  let source = "cli";
  let startedAt = null;
  let updatedAt = null;

  let totalInput = 0;
  let totalOutput = 0;
  let totalCached = 0;

  const turns = [];
  let currentAssistantTurn = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line) continue;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    const timestamp = entry.timestamp || new Date().toISOString();
    if (!startedAt) startedAt = timestamp;
    updatedAt = timestamp;

    const payload = entry.payload;
    if (!payload) continue;

    if (entry.type === "session_meta") {
      sessionMeta = payload;
      if (payload.cwd) cwd = payload.cwd;
      if (payload.originator) originator = payload.originator;
      if (payload.source) source = payload.source;
      if (payload.timestamp) startedAt = payload.timestamp;
      continue;
    }

    if (entry.type === "turn_context") {
      if (payload.model) model = payload.model;
      if (payload.cwd) cwd = payload.cwd;
      continue;
    }

    if (entry.type === "response_item") {
      const type = payload.type;

      // 1. Message: User or Assistant
      if (type === "message") {
        const role = payload.role;

        if (role === "user") {
          const rawText = textFromContent(payload.content);
          if (isSyntheticInstruction(rawText)) continue;

          // If there was an active assistant turn, finalize it before starting new turn
          if (currentAssistantTurn) {
            turns.push(currentAssistantTurn);
            currentAssistantTurn = null;
          }

          turns.push({
            id: `turn-user-${turns.length}`,
            role: "user",
            timestamp,
            content: rawText.trim(),
          });

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
          continue;
        }

        if (role === "assistant") {
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

          const asstText = textFromContent(payload.content);
          if (asstText) {
            currentAssistantTurn.content += (currentAssistantTurn.content ? "\n\n" : "") + asstText.trim();
          }
          continue;
        }

        continue;
      }

      // 2. Reasoning / Thinking
      if (type === "reasoning") {
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

        let thinkingText = "";
        if (Array.isArray(payload.summary) && payload.summary.length > 0) {
          thinkingText = payload.summary.join("\n");
        } else if (payload.content) {
          thinkingText = typeof payload.content === "string" ? payload.content : JSON.stringify(payload.content);
        } else if (payload.encrypted_content) {
          thinkingText = "Thinking process completed.";
        }

        if (thinkingText) {
          currentAssistantTurn.thinking += (currentAssistantTurn.thinking ? "\n\n" : "") + thinkingText;
        }
        continue;
      }

      // 3. Function Call / Tool Invocations
      if (type === "function_call" || type === "local_shell_call" || type === "custom_tool_call") {
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

        let parsedArgs = {};
        if (typeof payload.arguments === "string") {
          try {
            parsedArgs = JSON.parse(payload.arguments);
          } catch {
            parsedArgs = { raw: payload.arguments };
          }
        } else if (payload.arguments && typeof payload.arguments === "object") {
          parsedArgs = payload.arguments;
        }

        const toolName = payload.name || payload.tool || "tool";
        const { type: toolType, detail } = normalizeCodexTool(toolName, parsedArgs);
        const callId = payload.call_id || payload.id || `tool-${currentAssistantTurn.toolCalls.length}`;

        currentAssistantTurn.toolCalls.push({
          id: callId,
          name: toolName,
          type: toolType,
          summary: detail || toolName,
          action: toolName,
          args: parsedArgs,
          output: "",
          status: "completed",
        });
        continue;
      }

      // 4. Function Call Output / Tool Result
      if (type === "function_call_output") {
        const callId = payload.call_id;
        const outputVal = typeof payload.output === "string" ? payload.output : JSON.stringify(payload.output || "");

        if (currentAssistantTurn) {
          const match = currentAssistantTurn.toolCalls.find((t) => t.id === callId);
          if (match) {
            match.output = outputVal;
            if (outputVal.includes("exited with code 1") || outputVal.includes("Error:") || outputVal.includes("failed")) {
              match.status = "error";
            }
          }
        }
        continue;
      }
    }

    if (entry.type === "event_msg") {
      if (payload.type === "token_count") {
        const usage = payload.info?.total_token_usage;
        if (usage) {
          if (usage.input_tokens) totalInput = usage.input_tokens;
          if (usage.output_tokens) totalOutput = usage.output_tokens;
          if (usage.cached_input_tokens) totalCached = usage.cached_input_tokens;
          if (currentAssistantTurn) {
            currentAssistantTurn.tokens = {
              input: usage.input_tokens || 0,
              output: usage.output_tokens || 0,
              cached: usage.cached_input_tokens || 0,
            };
          }
        }
        continue;
      }

      if (payload.type === "task_complete") {
        if (payload.error?.message && currentAssistantTurn) {
          currentAssistantTurn.status = "error";
          currentAssistantTurn.error = payload.error.message;
          if (!currentAssistantTurn.content) {
            currentAssistantTurn.content = payload.error.message;
          }
        }
      }
    }
  }

  // Push final assistant turn if present
  if (currentAssistantTurn && (currentAssistantTurn.content || currentAssistantTurn.toolCalls.length > 0 || currentAssistantTurn.thinking)) {
    turns.push(currentAssistantTurn);
  }

  const { clientType, label } = classifyCodexSession(originator, source);
  const startMs = startedAt ? new Date(startedAt).getTime() : Date.now();
  const endMs = updatedAt ? new Date(updatedAt).getTime() : startMs;

  return {
    ok: true,
    session: {
      id: sessionMeta?.session_id || cleanId,
      cli: "codex",
      clientType,
      label,
      model,
      startedAt,
      updatedAt,
      durationMs: Math.max(0, endMs - startMs),
      cwd,
      tokens: {
        input: totalInput,
        output: totalOutput,
        cached: totalCached,
      },
      turnsCount: turns.length,
    },
    turns,
  };
}
