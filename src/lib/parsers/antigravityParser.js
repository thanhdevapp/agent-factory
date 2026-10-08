import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { extractModelFromTranscript, normalizeModel } from "../watchers/antigravityWatcher.js";

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

export function normalizeToolCategory(name, args = {}) {
  const n = String(name || "").toLowerCase();

  if (n === "call_mcp_tool") {
    const srv = String(args.ServerName || "").toLowerCase();
    const tool = String(args.ToolName || "").toLowerCase();
    if (srv.includes("gitnexus") || tool.includes("cypher") || tool.includes("impact")) return "gitnexus";
    if (srv.includes("playwright") || srv.includes("browser") || tool.startsWith("browser_")) return "browser";
    return "mcp";
  }

  if (n === "run_command") {
    const cmd = String(args.CommandLine || "").trim().toLowerCase();
    if (cmd.startsWith("docker") || cmd.includes("docker exec")) return "docker";
    if (cmd.startsWith("git ") || cmd.startsWith("gh ")) return "git";
    if (cmd.includes("gitnexus")) return "gitnexus";
    return "bash";
  }

  if (TOOL_MAP[name]) return TOOL_MAP[name];
  if (n.includes("read") || n.includes("view") || n.includes("list") || n.includes("dir")) return "read";
  if (n.includes("edit") || n.includes("write") || n.includes("patch") || n.includes("replace")) return "edit";
  if (n.includes("search") || n.includes("grep")) return "search";
  if (n.includes("agent") || n.includes("message")) return "agent";

  return "mcp";
}

/**
 * Parses an Antigravity CLI transcript into normalized chat turns.
 * @param {string} sessionId
 * @returns {Promise<{ ok: boolean, session: any, turns: any[] }>}
 */
export async function parseAntigravityTranscript(sessionId) {
  const safeId = String(sessionId || "").trim();
  if (!/^[a-zA-Z0-9_-]{4,64}$/.test(safeId)) {
    throw new Error("Invalid session ID format");
  }

  const homeDir = os.homedir();
  const candidateDirs = [
    path.join(homeDir, ".gemini", "antigravity", "brain"),
    path.join(homeDir, ".gemini", "antigravity-cli", "brain"),
    path.join(homeDir, ".gemini", "antigravity-ide", "brain"),
  ];

  let transcriptPath = null;
  let resolvedFolder = safeId;
  let matchedBrainDir = null;

  for (const brainDir of candidateDirs) {
    const sessionDir = path.join(brainDir, safeId);
    try {
      await fs.access(sessionDir);
      const testPath = path.join(sessionDir, ".system_generated", "logs", "transcript.jsonl");
      await fs.access(testPath);
      transcriptPath = testPath;
      resolvedFolder = safeId;
      matchedBrainDir = brainDir;
      break;
    } catch {
      // If exact name not found, try prefix matching (e.g. "17d2113b" -> "17d2113b-...")
      try {
        const entries = await fs.readdir(brainDir, { withFileTypes: true });
        const match = entries.find((e) => e.isDirectory() && e.name.startsWith(safeId));
        if (match) {
          const testPath = path.join(brainDir, match.name, ".system_generated", "logs", "transcript.jsonl");
          await fs.access(testPath);
          transcriptPath = testPath;
          resolvedFolder = match.name;
          matchedBrainDir = brainDir;
          break;
        }
      } catch {
        // continue
      }
    }
  }

  if (!transcriptPath || !matchedBrainDir) {
    throw new Error(`Transcript file not found for session ID "${safeId}"`);
  }

  // Path traversal guard
  if (!path.resolve(transcriptPath).startsWith(path.resolve(matchedBrainDir))) {
    throw new Error("Directory traversal detected");
  }

  let rawContent;
  try {
    rawContent = await fs.readFile(transcriptPath, "utf-8");
  } catch (err) {
    throw new Error(`Transcript file not found: ${err.message}`);
  }

  const lines = rawContent.split("\n");
  const turns = [];
  let currentAssistantTurn = null;

  let totalIn = 0;
  let totalOut = 0;
  let totalCached = 0;
  let startedAt = null;
  let updatedAt = null;
  let detectedCwd = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line) continue;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      // If it's the last line and it fails to parse, it could be an active flush
      if (idx === lines.length - 1) continue;
      continue;
    }

    const timestamp = entry.created_at || new Date().toISOString();
    if (!startedAt) startedAt = timestamp;
    updatedAt = timestamp;

    if (entry.input_tokens) totalIn += entry.input_tokens;
    if (entry.output_tokens) totalOut += entry.output_tokens;
    if (entry.cache_read_tokens) totalCached += entry.cache_read_tokens;

    // Detect Cwd from tool args if available
    if (Array.isArray(entry.tool_calls)) {
      for (const tc of entry.tool_calls) {
        if (tc.args?.Cwd && !detectedCwd) detectedCwd = tc.args.Cwd;
        if (!detectedCwd && (tc.args?.TargetFile || tc.args?.AbsolutePath)) {
          const p = tc.args.TargetFile || tc.args.AbsolutePath;
          if (p.includes("/Projects/")) detectedCwd = p.split("/").slice(0, 5).join("/");
        }
      }
    }

    // 1. User Input Turn
    if (entry.type === "USER_INPUT") {
      // Flush previous assistant turn if pending
      if (currentAssistantTurn) {
        turns.push(currentAssistantTurn);
        currentAssistantTurn = null;
      }

      let promptText = String(entry.content || "");
      // Clean XML tags like <USER_REQUEST> and <ADDITIONAL_METADATA>
      promptText = promptText
        .replace(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/g, "$1")
        .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, "")
        .replace(/<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>/g, "")
        .trim();

      turns.push({
        id: `turn-user-${entry.step_index || turns.length}`,
        role: "user",
        timestamp,
        content: promptText,
      });

      // Start new assistant turn for this prompt
      currentAssistantTurn = {
        id: `turn-asst-${(entry.step_index || turns.length) + 1}`,
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

    // Ensure we have an assistant turn active
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

    // 2. Planner Response (Reasoning, Tools, or Text)
    if (entry.type === "PLANNER_RESPONSE") {
      if (entry.input_tokens) currentAssistantTurn.tokens.input += entry.input_tokens;
      if (entry.output_tokens) currentAssistantTurn.tokens.output += entry.output_tokens;
      if (entry.cache_read_tokens) currentAssistantTurn.tokens.cached += entry.cache_read_tokens;

      if (entry.thinking) {
        currentAssistantTurn.thinking += (currentAssistantTurn.thinking ? "\n\n" : "") + entry.thinking;
      }

      if (Array.isArray(entry.tool_calls) && entry.tool_calls.length > 0) {
        for (let tIdx = 0; tIdx < entry.tool_calls.length; tIdx++) {
          const tc = entry.tool_calls[tIdx];
          const toolId = tc.id || `${entry.step_index}-${tIdx}`;
          const cat = normalizeToolCategory(tc.name, tc.args);

          currentAssistantTurn.toolCalls.push({
            id: toolId,
            name: tc.name,
            type: cat,
            summary: tc.toolSummary || tc.name,
            action: tc.toolAction || tc.name,
            args: tc.args || {},
            output: "",
            status: entry.status === "RUNNING" ? "running" : "completed",
          });
        }
      }

      // If content is present
      if (entry.content) {
        if (!currentAssistantTurn.content) {
          currentAssistantTurn.content = entry.content;
        } else {
          // If already has content and new content arrives, append
          currentAssistantTurn.content += "\n\n" + entry.content;
        }
      }
    }

    // 3. Generic (Tool execution output / stdout / stderr)
    if (entry.type === "GENERIC" && entry.content) {
      if (currentAssistantTurn.toolCalls.length > 0) {
        // Associate with the last tool call that doesn't have an output yet
        const targetTc = [...currentAssistantTurn.toolCalls].reverse().find((tc) => !tc.output) ||
          currentAssistantTurn.toolCalls[currentAssistantTurn.toolCalls.length - 1];

        if (targetTc) {
          targetTc.output = entry.content;
          if (entry.status === "ERROR") {
            targetTc.status = "error";
          }
        }
      }
    }
  }

  // Push final assistant turn
  if (currentAssistantTurn && (currentAssistantTurn.content || currentAssistantTurn.toolCalls.length > 0 || currentAssistantTurn.thinking)) {
    turns.push(currentAssistantTurn);
  }

  const durationMs = (startedAt && updatedAt) ? Math.max(0, new Date(updatedAt).getTime() - new Date(startedAt).getTime()) : 0;

  const rawModel = extractModelFromTranscript(rawContent);
  let defaultCliModel = null;
  if (!rawModel) {
    try {
      const cliSettingsRaw = await fs.readFile(path.join(homeDir, ".gemini", "antigravity-cli", "settings.json"), "utf-8");
      const cliSettings = JSON.parse(cliSettingsRaw);
      if (cliSettings.model) defaultCliModel = cliSettings.model;
    } catch {}
  }
  const modelName = normalizeModel(rawModel || defaultCliModel);

  return {
    ok: true,
    session: {
      id: safeId,
      cli: "antigravity",
      model: modelName,
      startedAt,
      updatedAt,
      durationMs,
      cwd: detectedCwd,
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
