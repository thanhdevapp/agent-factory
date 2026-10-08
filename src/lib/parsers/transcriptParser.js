import { parseAntigravityTranscript } from "./antigravityParser.js";
import { parseClaudeTranscript } from "./claudeParser.js";
import { parseCodexTranscript } from "./codexParser.js";
import { redactDeep } from "./secretRedactor.js";

function generateMockTranscript(rawId) {
  const isClaude = rawId.includes("claude");
  const isCodex = rawId.includes("codex");
  const model = isClaude ? "claude-3-7-sonnet" : isCodex ? "gpt-5.6-terra" : "gemini-2.5-pro";
  const cli = isClaude ? "claude" : isCodex ? "codex" : "antigravity";

  return {
    ok: true,
    session: {
      id: rawId,
      cli,
      model,
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      durationMs: 15 * 60 * 1000,
      cwd: "/Users/dev/workspace/agent-factory",
      tokens: {
        input: 42150,
        output: 3820,
        cached: 182400,
      },
      turnsCount: 2,
    },
    turns: [
      {
        id: "mock-turn-0",
        role: "user",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        content: "Fix memory leak in websocket event listeners and refactor connection pooling",
      },
      {
        id: "mock-turn-1",
        role: "assistant",
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        thinking: "Let's first inspect all websocket connection handlers across src/lib and check where removeEventListener or client.close() is missing. We should also examine the connection pool cleanup timer.",
        toolCalls: [
          {
            id: "tool-0",
            name: "grep_search",
            type: "search",
            summary: "Search: websocket.addEventListener",
            action: "grep_search",
            args: { query: "websocket.addEventListener" },
            output: "src/lib/wsClient.js:14: ws.addEventListener('message', onMessage);\nsrc/lib/wsClient.js:15: ws.addEventListener('close', onClose);",
            status: "completed",
          },
          {
            id: "tool-1",
            name: "view_file",
            type: "read",
            summary: "Read: wsClient.js",
            action: "view_file",
            args: { AbsolutePath: "/Users/dev/workspace/agent-factory/src/lib/wsClient.js", StartLine: 1, EndLine: 40 },
            output: "export function createWebSocketClient() {\n  let activeWs = null;\n  // Missing cleanup on reconnect!\n}",
            status: "completed",
          },
          {
            id: "tool-2",
            name: "replace_file_content",
            type: "edit",
            summary: "Edit: wsClient.js",
            action: "replace_file_content",
            args: { TargetFile: "src/lib/wsClient.js", Description: "Add cleanup handler on disconnect" },
            output: "Successfully replaced 1 block in src/lib/wsClient.js.",
            status: "completed",
          },
        ],
        content: "I investigated the WebSocket client and identified that reconnection attempts did not detach previous event listeners, causing listeners to accumulate in heap memory.\n\n### Fix applied:\n1. Added `dispose()` method in `wsClient.js`.\n2. Attached an automatic teardown hook before attempting socket reconnection.\n\n```javascript\nexport function teardownSocket(ws) {\n  if (!ws) return;\n  ws.removeEventListener('message', handleMessage);\n  ws.removeEventListener('error', handleError);\n  ws.close();\n}\n```",
        tokens: { input: 24500, output: 1200, cached: 95000 },
      },
      {
        id: "mock-turn-2",
        role: "user",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        content: "Run test suite to verify no memory leaks or broken connections",
      },
      {
        id: "mock-turn-3",
        role: "assistant",
        timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
        thinking: "Executing unit test suite with npm test -- --coverage",
        toolCalls: [
          {
            id: "tool-3",
            name: "run_command",
            type: "bash",
            summary: "bash: npm test",
            action: "run_command",
            args: { CommandLine: "npm test" },
            output: "PASS src/lib/wsClient.test.js\n  OK connects to server (12ms)\n  OK cleans up listeners on disconnect (8ms)\n  OK pool avoids leak after 100 reconnects (45ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        0.85s",
            status: "completed",
          },
        ],
        content: "All 3 unit tests passed successfully. The WebSocket reconnection stress test confirmed zero memory leak over 100 simulated disconnect cycles.",
        tokens: { input: 17650, output: 2620, cached: 87400 },
      },
    ],
  };
}

/**
 * Facade parser that auto-routes to Antigravity or Claude Code
 * and sanitizes sensitive secrets across all turns.
 *
 * @param {string} rawId - Session or Trace ID (e.g. "17d2113b-253a-4403-bc6b-08c9d5776434" or "agy-17d2113b")
 * @param {string} [cliHint] - Optional hint: "antigravity" | "claude"
 * @returns {Promise<{ ok: boolean, session: any, turns: any[] }>}
 */
export async function getSessionTranscript(rawId, cliHint = "") {
  let id = String(rawId || "").trim();

  // If mock preset ID, return synthetic rich transcript
  if (id.startsWith("mock-") || id.includes("mock") || id === "demo") {
    return generateMockTranscript(rawId);
  }

  // Strip prefixes like "agy-", "claude-", or "codex-" if present
  let cli = cliHint.toLowerCase();
  if (id.startsWith("agy-")) {
    cli = "antigravity";
    id = id.slice(4);
  } else if (id.startsWith("claude-")) {
    cli = "claude";
    id = id.slice(7);
  } else if (id.startsWith("codex-")) {
    cli = "codex";
    id = id.slice(6);
  }

  if (cli === "codex") {
    try {
      const res = await parseCodexTranscript(id);
      return {
        ...res,
        session: redactDeep(res.session),
        turns: redactDeep(res.turns),
      };
    } catch (err) {
      throw err;
    }
  }

  // If ID was formatted as short hash in traceId, try to resolve full directory in brain
  if (cli === "antigravity" || !cli) {
    try {
      const res = await parseAntigravityTranscript(id);
      return {
        ...res,
        session: redactDeep(res.session),
        turns: redactDeep(res.turns),
      };
    } catch (err) {
      if (cli === "antigravity") {
        throw err;
      }
    }
  }

  if (cli === "claude" || !cli) {
    try {
      const res = await parseClaudeTranscript(id);
      return {
        ...res,
        session: redactDeep(res.session),
        turns: redactDeep(res.turns),
      };
    } catch (err) {
      if (cli === "claude") {
        throw err;
      }
    }
  }

  // Fallback to codex if no cli specified
  if (!cli) {
    try {
      const res = await parseCodexTranscript(id);
      return {
        ...res,
        session: redactDeep(res.session),
        turns: redactDeep(res.turns),
      };
    } catch {
      // ignore
    }
  }

  throw new Error(`Unable to locate transcript for session ID "${rawId}"`);
}
