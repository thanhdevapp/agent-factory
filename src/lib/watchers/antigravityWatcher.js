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

export async function getAntigravityTraces(maxAgeMs = 2 * 60 * 60 * 1000) {
  const homeDir = os.homedir();
  const brainDir = path.join(homeDir, ".gemini", "antigravity-cli", "brain");

  try {
    const entries = await fs.readdir(brainDir, { withFileTypes: true });
    const now = Date.now();
    const traces = [];

    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const convId = ent.name;
      const transcriptPath = path.join(brainDir, convId, ".system_generated", "logs", "transcript.jsonl");

      try {
        const stat = await fs.stat(transcriptPath);
        const mtime = stat.mtimeMs;
        if (now - mtime > maxAgeMs) continue;

        const content = await fs.readFile(transcriptPath, "utf-8");
        const lines = content.trim().split("\n");
        if (lines.length === 0) continue;

        let totalIn = 0;
        let totalOut = 0;
        let totalCached = 0;
        let lastToolEntry = null;
        let lastStep = null;
        const toolSet = new Set();
        let firstTime = null;
        let lastTime = null;
        let activeCommandDetail = null;
        let detectedCwd = null;
        const toolInvocations = [];
        const recentLogs = [];

        for (const line of lines) {
          if (!line) continue;
          try {
            const entry = JSON.parse(line);
            const entryTime = entry.created_at ? new Date(entry.created_at).getTime() : Date.now();
            if (!firstTime && entry.created_at) firstTime = entryTime;
            if (entry.created_at) lastTime = entryTime;

            if (entry.input_tokens) totalIn += entry.input_tokens;
            if (entry.output_tokens) totalOut += entry.output_tokens;
            if (entry.cache_read_tokens) totalCached += entry.cache_read_tokens;

            if (entry.type === "USER_INPUT" && entry.content) {
              const cleanPrompt = String(entry.content).replace(/<USER_REQUEST>|<\/USER_REQUEST>/g, "").trim();
              recentLogs.push({
                timestamp: entry.created_at || new Date().toISOString(),
                type: "prompt",
                summary: "User Prompt",
                detail: cleanPrompt.slice(0, 100),
              });
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

        const isRecent = (now - mtime) < 45 * 1000;
        let state = "done";
        if (isRecent) {
          if (lastStep && lastStep.type === "USER_INPUT") state = "pending";
          else if (lastToolEntry && lastToolEntry.status === "RUNNING") state = "streaming";
          else state = "streaming";
        }

        // Loop detection: 5 consecutive identical tool calls within 60s
        let isLooping = false;
        if (toolInvocations.length >= 5) {
          const lastN = toolInvocations.slice(-10);
          for (let s = 0; s <= lastN.length - 5; s++) {
            const window = lastN.slice(s, s + 5);
            const targetName = window[0].name;
            const sameName = window.every((w) => w.name === targetName);
            const timeSpan = (window[window.length - 1].time || 0) - (window[0].time || 0);
            if (sameName && (timeSpan <= 60000 || timeSpan === 0)) {
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

        traces.push(normalizeTrace({
          traceId: `agy-${convId.slice(0, 8)}`,
          cli: "antigravity",
          connectionId: `Antigravity (${convId.slice(0, 6)})`,
          account: folderName,
          model: "gemini-2.5-pro",
          provider: "gemini",
          state,
          startedAt: firstTime || (now - elapsedMs),
          elapsedMs,
          tokens: {
            input: totalIn || 2500,
            output: totalOut || 850,
            cached: totalCached,
          },
          cost: 0,
          status: isLooping ? "error" : "200",
          tools: Array.from(toolSet),
          activeTool,
          currentCommand: activeCommandDetail,
          isLooping,
          logs: recentLogs.slice(-25),
        }));
      } catch {
        // file missing or unreadable
      }
    }

    return traces;
  } catch {
    return [];
  }
}
