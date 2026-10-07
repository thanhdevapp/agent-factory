import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { normalizeTrace } from "../traceContract.js";

function normalizeClaudeTool(name, input = {}) {
  const n = String(name || "").toLowerCase();
  const cmd = String(input.command || "").trim();
  const cmdLower = cmd.toLowerCase();

  if (n === "bash") {
    if (cmdLower.startsWith("docker") || cmdLower.includes("docker exec")) {
      return { type: "docker", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.startsWith("git ") || cmdLower.startsWith("gh ")) {
      return { type: "git", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    if (cmdLower.includes("gitnexus")) {
      return { type: "gitnexus", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
    }
    return { type: "bash", detail: cmd.length > 50 ? `${cmd.slice(0, 47)}...` : cmd };
  }

  if (n.includes("read") || n.includes("view") || n.includes("glob")) {
    const file = input.file_path || input.path || "";
    return { type: "read", detail: file ? `Read: ${path.basename(file)}` : "Read file" };
  }

  if (n.includes("edit") || n.includes("write") || n.includes("patch") || n.includes("replace")) {
    const file = input.file_path || input.path || "";
    return { type: "edit", detail: file ? `Edit: ${path.basename(file)}` : "Edit file" };
  }

  if (n.includes("grep") || n.includes("search")) {
    return { type: "search", detail: input.pattern ? `Search: ${input.pattern}` : "Search" };
  }

  if (n.includes("agent") || n.includes("task")) {
    return { type: "agent", detail: "Subagent Task" };
  }

  if (n.includes("browser") || n.includes("playwright")) {
    return { type: "browser", detail: "Browser automation" };
  }

  if (n.includes("gitnexus")) {
    return { type: "gitnexus", detail: "GitNexus query" };
  }

  return { type: "mcp", detail: name };
}

function detectProvider(modelName) {
  const m = String(modelName || "").toLowerCase();
  if (m.includes("claude")) return "anthropic";
  if (m.includes("gemini")) return "gemini";
  if (m.includes("gpt") || m.includes("o1") || m.includes("o3")) return "openai";
  if (m.includes("minimax")) return "minimax";
  if (m.includes("deepseek")) return "deepseek";
  return "anthropic";
}

export async function getClaudeTraces(maxAgeMs = 3 * 60 * 60 * 1000) {
  const homeDir = os.homedir();
  const sessionsDir = path.join(homeDir, ".claude", "sessions");
  const projectsDir = path.join(homeDir, ".claude", "projects");

  try {
    const sessionFiles = await fs.readdir(sessionsDir).catch(() => []);
    const now = Date.now();
    const traces = [];

    for (const f of sessionFiles) {
      if (!f.endsWith(".json")) continue;
      try {
        const rawMeta = await fs.readFile(path.join(sessionsDir, f), "utf-8");
        const meta = JSON.parse(rawMeta);
        const { pid, sessionId, cwd, startedAt, updatedAt, status, name } = meta;

        // Skip very old sessions
        const lastActive = updatedAt || startedAt || 0;
        if (now - lastActive > maxAgeMs) continue;

        // Find associated jsonl transcript in projects folder
        let transcriptPath = null;
        try {
          const projectFolders = await fs.readdir(projectsDir);
          for (const pf of projectFolders) {
            const candidate = path.join(projectsDir, pf, `${sessionId}.jsonl`);
            try {
              await fs.access(candidate);
              transcriptPath = candidate;
              break;
            } catch {
              // try next
            }
          }
        } catch {
          // ignore
        }

        let totalIn = 0;
        let totalOut = 0;
        let totalCached = 0;
        let model = "claude-3-7-sonnet";
        let activeTool = null;
        let activeCommand = null;
        const toolSet = new Set();
        let lastTimestamp = lastActive;

        if (transcriptPath) {
          try {
            const content = await fs.readFile(transcriptPath, "utf-8");
            const lines = content.trim().split("\n");
            for (const line of lines) {
              if (!line) continue;
              try {
                const entry = JSON.parse(line);
                if (entry.timestamp) lastTimestamp = new Date(entry.timestamp).getTime();

                const msg = entry.message;
                if (msg) {
                  if (msg.model) model = msg.model;
                  const u = msg.usage;
                  if (u) {
                    if (u.input_tokens) totalIn += u.input_tokens;
                    if (u.output_tokens) totalOut += u.output_tokens;
                    if (u.cache_read_input_tokens) totalCached += u.cache_read_input_tokens;
                  }

                  if (Array.isArray(msg.content)) {
                    for (const block of msg.content) {
                      if (block.type === "tool_use") {
                        const { type, detail } = normalizeClaudeTool(block.name, block.input);
                        toolSet.add(type);
                        activeTool = type;
                        if (detail) activeCommand = detail;
                      }
                    }
                  }
                }
              } catch {
                // ignore malformed line
              }
            }
          } catch {
            // unreadable transcript
          }
        }

        const isRecent = (now - lastActive) < 60 * 1000;
        let state = "done";
        if (status === "running" || status === "working") state = "streaming";
        else if (isRecent) state = "streaming";
        else if (status === "idle") state = "pending";

        const workspaceName = cwd ? path.basename(cwd) : (name || "Claude Workspace");
        const elapsedMs = Math.max(0, (lastTimestamp || now) - (startedAt || now));

        traces.push(normalizeTrace({
          traceId: `claude-${pid || sessionId.slice(0, 6)}`,
          cli: "claude",
          connectionId: `Claude (${name || pid})`,
          account: workspaceName,
          model,
          provider: detectProvider(model),
          state,
          startedAt: startedAt || now,
          elapsedMs,
          tokens: {
            input: totalIn || 3200,
            output: totalOut || 1100,
            cached: totalCached,
          },
          cost: 0,
          status: "200",
          tools: Array.from(toolSet),
          activeTool,
          currentCommand: activeCommand,
        }));
      } catch {
        // ignore single session error
      }
    }

    return traces;
  } catch {
    return [];
  }
}
