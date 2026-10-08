import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { normalizeTrace } from "../traceContract.js";

function isProcessAlive(pid) {
  if (!pid || typeof pid !== "number") return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
}

function extractWorkspaceFromFolder(folderName) {
  if (!folderName) return null;
  const cleaned = folderName.replace(/--claude-worktrees.*/, "");
  const parts = cleaned.split("-").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : folderName;
}

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

/**
 * Claude Code records where a session was started in `entrypoint`. A session
 * can carry more than one (a desktop session that later continues in the CLI
 * logs both), so desktop wins over the generic `cli` value.
 *
 * @returns {{ clientType: string, label: string }}
 */
function classifyClaudeEntrypoint(...entrypoints) {
  const seen = new Set(entrypoints.filter(Boolean));
  if (seen.has("claude-desktop")) return { clientType: "desktop", label: "Claude Desktop" };
  if (seen.has("claude-vscode") || seen.has("vscode")) return { clientType: "extension", label: "Claude Extension" };
  return { clientType: "cli", label: "Claude" };
}

function detectProvider(modelName, clientType = "cli") {
  const m = String(modelName || "").toLowerCase();
  let base = null;
  if (m.includes("claude")) base = "anthropic";
  else if (m.includes("gemini")) base = "gemini";
  else if (m.includes("gpt") || m.includes("o1") || m.includes("o3")) base = "openai";
  else if (m.includes("minimax")) base = "minimax";
  else if (m.includes("deepseek")) base = "deepseek";
  return base ? `${base} (${clientType})` : null;
}

function compactText(value, maxLength = 160) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, maxLength) : null;
}

function getTextContent(content) {
  if (typeof content === "string") return compactText(content);
  if (!Array.isArray(content)) return null;
  const combined = content
    .filter((block) => block?.type === "text" && block.text)
    .map((block) => block.text)
    .join(" ");
  return compactText(combined);
}

function isPreviewableText(text) {
  return Boolean(text && !/^\[request interrupted by user\]$/i.test(text));
}

async function parseClaudeTranscript(transcriptPath) {
  const result = {
    totalIn: 0,
    totalOut: 0,
    totalCached: 0,
    hasUsage: false,
    model: null,
    activeTool: null,
    activeCommand: null,
    sessionTitle: null,
    lastText: null,
    lastTextRole: null,
    toolSet: new Set(),
    lastTimestamp: 0,
    toolInvocations: [],
    recentLogs: [],
    entrypoints: new Set(),
    cwd: null,
    slug: null,
    sessionId: null,
    isLooping: false,
  };

  try {
    const content = await fs.readFile(transcriptPath, "utf-8");
    const lines = content.trim().split("\n");

    for (const line of lines) {
      if (!line) continue;
      try {
        const entry = JSON.parse(line);
        const entryTime = entry.timestamp ? new Date(entry.timestamp).getTime() : Date.now();
        if (entry.timestamp) result.lastTimestamp = entryTime;
        if (entry.sessionId && !result.sessionId) result.sessionId = entry.sessionId;
        if (entry.entrypoint) result.entrypoints.add(entry.entrypoint);
        if (entry.cwd && !result.cwd) result.cwd = entry.cwd;
        if (entry.slug && !result.slug) result.slug = entry.slug;

        if (entry.type === "ai-title") {
          result.sessionTitle = compactText(entry.aiTitle, 80) || result.sessionTitle;
        } else if (entry.type === "last-prompt") {
          const prompt = compactText(entry.lastPrompt);
          if (prompt) {
            result.lastText = prompt;
            result.lastTextRole = "user";
          }
        }

        const msg = entry.message;
        if (msg) {
          if (msg.model) result.model = msg.model;
          const u = msg.usage;
          if (u) {
            result.hasUsage = true;
            if (u.input_tokens) result.totalIn += u.input_tokens;
            if (u.output_tokens) result.totalOut += u.output_tokens;
            if (u.cache_read_input_tokens) result.totalCached += u.cache_read_input_tokens;
          }

          if (msg.role === "user") {
            const prompt = getTextContent(msg.content);
            if (isPreviewableText(prompt)) {
              result.lastText = prompt;
              result.lastTextRole = "user";
              result.recentLogs.push({
                timestamp: entry.timestamp || new Date().toISOString(),
                type: "prompt",
                summary: "User Prompt",
                detail: prompt.slice(0, 100),
              });
            }
          } else if (msg.role === "assistant") {
            const response = getTextContent(msg.content);
            if (response) {
              result.lastText = response;
              result.lastTextRole = "assistant";
            }
          }

          if (Array.isArray(msg.content)) {
            for (const block of msg.content) {
              if (block.type === "tool_use") {
                const { type, detail } = normalizeClaudeTool(block.name, block.input);
                result.toolSet.add(type);
                result.activeTool = type;
                if (detail) result.activeCommand = detail;

                result.toolInvocations.push({
                  name: block.name,
                  time: entryTime,
                  detail: detail || block.name,
                });

                result.recentLogs.push({
                  timestamp: entry.timestamp || new Date().toISOString(),
                  type: type || "tool",
                  summary: block.name,
                  detail: detail || block.name,
                });
              } else if (block.type === "tool_result" && block.is_error) {
                result.recentLogs.push({
                  timestamp: entry.timestamp || new Date().toISOString(),
                  type: "error",
                  summary: "Tool Error",
                  detail: String(block.content || "Error").slice(0, 100),
                });
              }
            }
          }
        }
      } catch {
        // ignore malformed line
      }
    }

    // Loop detection: 5 consecutive identical tool calls (same tool and target) within 60s
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
  } catch {
    // unreadable transcript
  }

  return result;
}

export async function getClaudeTraces(maxAgeMs = 24 * 60 * 60 * 1000) {
  const homeDir = os.homedir();
  const sessionsDir = path.join(homeDir, ".claude", "sessions");
  const projectsDir = path.join(homeDir, ".claude", "projects");
  const fallbackWorkspace = path.basename(process.cwd()) || "agent-factory";

  const now = Date.now();
  const traces = [];
  const seenSessionIds = new Set();

  // 1. Scan active sessions from ~/.claude/sessions/*.json
  try {
    const sessionFiles = await fs.readdir(sessionsDir).catch(() => []);
    for (const f of sessionFiles) {
      if (!f.endsWith(".json")) continue;
      try {
        const rawMeta = await fs.readFile(path.join(sessionsDir, f), "utf-8");
        const meta = JSON.parse(rawMeta);
        const { pid, sessionId, cwd, startedAt, updatedAt, status, name, entrypoint } = meta;

        const alive = isProcessAlive(pid);
        const lastActive = updatedAt || startedAt || 0;

        // Alive processes are ALWAYS kept regardless of age!
        if (!alive && (now - lastActive > maxAgeMs)) continue;

        if (sessionId) seenSessionIds.add(sessionId);

        // Find associated jsonl transcript in projects folder
        let transcriptPath = null;
        try {
          const projectFolders = await fs.readdir(projectsDir).catch(() => []);
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

        const parsed = transcriptPath ? await parseClaudeTranscript(transcriptPath) : {};

        const { clientType, label } = classifyClaudeEntrypoint(
          entrypoint,
          ...(parsed.entrypoints || [])
        );

        let state = "done";
        if (alive) {
          if (status === "busy" || status === "running" || status === "working") {
            state = "streaming";
          } else if (status === "idle") {
            state = "idle";
          } else {
            state = "idle";
          }
        }

        const workspaceName = cwd
          ? path.basename(cwd)
          : (parsed.cwd ? path.basename(parsed.cwd) : (name || fallbackWorkspace));

        const lastTimestamp = parsed.lastTimestamp || lastActive;
        const elapsedMs = Math.max(0, (lastTimestamp || now) - (startedAt || now));

        const sessionTitle =
          parsed.sessionTitle ||
          (parsed.slug ? parsed.slug.replace(/-/g, " ") : null) ||
          name ||
          workspaceName;

        const model = parsed.model || null;
        const sessionLabel = name || pid || (sessionId ? sessionId.slice(0, 6) : "session");
        const connectionId = `${label} (${sessionLabel})`;

        traces.push(normalizeTrace({
          traceId: `claude-${pid || (sessionId ? sessionId.slice(0, 6) : "session")}`,
          cli: "claude",
          clientType,
          source: clientType,
          connectionId,
          account: workspaceName,
          model,
          provider: detectProvider(model, clientType),
          state,
          startedAt: startedAt || null,
          elapsedMs: startedAt ? elapsedMs : null,
          tokens: {
            input: parsed.hasUsage ? parsed.totalIn : null,
            output: parsed.hasUsage ? parsed.totalOut : null,
            cached: parsed.hasUsage ? parsed.totalCached : null,
          },
          cost: null,
          status: parsed.isLooping ? "error" : null,
          tools: Array.from(parsed.toolSet || []),
          activeTool: parsed.activeTool || null,
          currentCommand: parsed.activeCommand || null,
          sessionTitle,
          lastText: parsed.lastText || null,
          lastTextRole: parsed.lastTextRole || null,
          isLooping: parsed.isLooping || false,
          logs: (parsed.recentLogs || []).slice(-25),
        }));
      } catch {
        // ignore single session error
      }
    }
  } catch {
    // ignore sessionsDir error
  }

  // 2. Scan recent transcripts dynamically from ~/.claude/projects/*/*.jsonl
  // Catches all project-level active & historical sessions within the time window
  try {
    const projectFolders = await fs.readdir(projectsDir).catch(() => []);
    const projectCandidates = [];

    for (const pf of projectFolders) {
      const folderPath = path.join(projectsDir, pf);
      let files = [];
      try {
        files = await fs.readdir(folderPath);
      } catch {
        continue;
      }

      for (const file of files) {
        if (!file.endsWith(".jsonl")) continue;
        const fileSessionId = file.replace(".jsonl", "");
        if (seenSessionIds.has(fileSessionId)) continue;

        const transcriptPath = path.join(folderPath, file);
        try {
          const stat = await fs.stat(transcriptPath);
          const mtime = stat.mtimeMs;
          if (now - mtime > maxAgeMs) continue;
          seenSessionIds.add(fileSessionId);
          projectCandidates.push({ transcriptPath, mtime, stat, fileSessionId, pf });
        } catch {}
      }
    }

    // Sort by mtime descending (most recent first) and cap to top 100
    projectCandidates.sort((a, b) => b.mtime - a.mtime);
    const toProcess = projectCandidates.slice(0, 100);

    for (const { transcriptPath, mtime, stat, fileSessionId, pf } of toProcess) {
      try {
        const parsed = await parseClaudeTranscript(transcriptPath);

        const isRecent = (now - mtime) < 90 * 1000;
        const isPending = (now - mtime) < 15 * 60 * 1000;
        const state = isRecent ? "streaming" : isPending ? "idle" : "done";

        const { clientType, label } = classifyClaudeEntrypoint(...(parsed.entrypoints || []));
        const workspaceName = parsed.cwd
          ? path.basename(parsed.cwd)
          : (extractWorkspaceFromFolder(pf) || fallbackWorkspace);

        const elapsedMs = Math.max(0, (parsed.lastTimestamp || mtime) - stat.birthtimeMs);

        const sessionTitle =
          parsed.sessionTitle ||
          (parsed.slug ? parsed.slug.replace(/-/g, " ") : null) ||
          workspaceName;

        const model = parsed.model || null;
        const connectionId = `${label} (${parsed.slug || fileSessionId.slice(0, 6)})`;

        traces.push(normalizeTrace({
          traceId: `claude-${fileSessionId.slice(0, 6)}`,
          cli: "claude",
          clientType,
          source: clientType,
          connectionId,
          account: workspaceName,
          model,
          provider: detectProvider(model, clientType),
          state,
          startedAt: stat.birthtimeMs || null,
          elapsedMs: stat.birthtimeMs ? elapsedMs : null,
          tokens: {
            input: parsed.totalIn || null,
            output: parsed.totalOut || null,
            cached: parsed.totalCached || null,
          },
          cost: null,
          status: parsed.isLooping ? "error" : null,
          tools: Array.from(parsed.toolSet || []),
          activeTool: parsed.activeTool || null,
          currentCommand: parsed.activeCommand || null,
          sessionTitle,
          lastText: parsed.lastText || null,
          lastTextRole: parsed.lastTextRole || null,
          isLooping: parsed.isLooping || false,
          logs: (parsed.recentLogs || []).slice(-25),
        }));
      } catch {
        // ignore unreadable project file
      }
    }
  } catch {
    // ignore projects scan error
  }

  // Sort: active (streaming/pending) first, then by most recent startedAt
  traces.sort((a, b) => {
    const activeA = (a.state === "streaming" || a.state === "pending") ? 1 : 0;
    const activeB = (b.state === "streaming" || b.state === "pending") ? 1 : 0;
    if (activeA !== activeB) return activeB - activeA;
    return (b.startedAt || 0) - (a.startedAt || 0);
  });

  return traces;
}
