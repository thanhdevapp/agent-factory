import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let ptyModule = null;
let ptyLoadAttempted = false;

function ensureSpawnHelperPermissions() {
  if (process.platform === "win32") return;
  try {
    const ptyPath = require.resolve("node-pty");
    const ptyRoot = path.dirname(path.dirname(ptyPath));
    const prebuildsDir = path.join(ptyRoot, "prebuilds");
    if (fs.existsSync(prebuildsDir)) {
      for (const arch of fs.readdirSync(prebuildsDir)) {
        const helper = path.join(prebuildsDir, arch, "spawn-helper");
        if (fs.existsSync(helper)) {
          try {
            fs.chmodSync(helper, 0o755);
          } catch {}
        }
      }
    }
  } catch {}
}

/**
 * Dynamically loads node-pty if available
 */
export async function getPtyModule() {
  if (ptyLoadAttempted) return ptyModule;
  ptyLoadAttempted = true;
  try {
    ensureSpawnHelperPermissions();
    const mod = await import("node-pty");
    ptyModule = mod.default || mod;
    return ptyModule;
  } catch (err) {
    console.warn("[ptyServer] node-pty native module could not be loaded:", err.message);
    ptyModule = null;
    return null;
  }
}

/**
 * Resolves the user's default shell
 */
function resolveDefaultShell() {
  const platform = process.platform;
  if (platform === "win32") {
    return process.env.COMSPEC || "powershell.exe";
  }
  return process.env.SHELL || (platform === "darwin" ? "/bin/zsh" : "/bin/bash");
}

/**
 * Attaches PTY terminal session handling to a WebSocket Server instance
 * @param {import('ws').WebSocketServer} wss
 */
export function attachPtyWebSocketServer(wss) {
  wss.on("connection", async (ws, req) => {
    let ptyProcess = null;
    let isAlive = true;

    const pty = await getPtyModule();

    if (!pty) {
      ws.send(
        JSON.stringify({
          type: "unavailable",
          message:
            "In-browser terminal requires native build tools (node-pty). Use Native Handoff (Ghostty/VS Code) instead.",
        })
      );
      return;
    }

    ws.on("pong", () => {
      isAlive = true;
    });

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === "init") {
          const reqCwd = msg.cwd && fs.existsSync(msg.cwd) ? msg.cwd : process.cwd();
          const shell = resolveDefaultShell();
          const cols = parseInt(msg.cols, 10) || 80;
          const rows = parseInt(msg.rows, 10) || 24;

          try {
            ptyProcess = pty.spawn(shell, [], {
              name: "xterm-256color",
              cols,
              rows,
              cwd: reqCwd,
              env: {
                ...process.env,
                TERM: "xterm-256color",
                COLORTERM: "truecolor",
                FORCE_COLOR: "3",
              },
              useConpty: process.platform === "win32",
            });

            // Burst-safe pipe from PTY to WebSocket
            ptyProcess.onData((data) => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "output", data }));
              }
            });

            ptyProcess.onExit(({ exitCode, signal }) => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "exit", exitCode, signal }));
              }
            });

            ws.send(
              JSON.stringify({
                type: "ready",
                shell,
                cwd: reqCwd,
                cols,
                rows,
              })
            );
          } catch (spawnErr) {
            console.error("[ptyServer] Failed to spawn PTY:", spawnErr);
            ws.send(
              JSON.stringify({
                type: "error",
                message: `Failed to spawn shell: ${spawnErr.message}`,
              })
            );
          }
        } else if (msg.type === "input" && ptyProcess) {
          ptyProcess.write(msg.data || "");
        } else if (msg.type === "resize" && ptyProcess) {
          const cols = parseInt(msg.cols, 10);
          const rows = parseInt(msg.rows, 10);
          if (cols > 0 && rows > 0) {
            try {
              ptyProcess.resize(cols, rows);
            } catch (resizeErr) {
              // Ignore resize on dead process
            }
          }
        }
      } catch (err) {
        console.warn("[ptyServer] Invalid WebSocket payload:", err.message);
      }
    });

    ws.on("close", () => {
      if (ptyProcess) {
        try {
          ptyProcess.kill();
        } catch {}
        ptyProcess = null;
      }
    });

    ws.on("error", (err) => {
      console.warn("[ptyServer] Client connection error:", err.message);
      if (ptyProcess) {
        try {
          ptyProcess.kill();
        } catch {}
      }
    });
  });

  // Heartbeat interval to drop dead clients
  const pingInterval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(pingInterval);
  });
}
