import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { detectPackageManager } from "@/lib/projectScripts";

// Active running background processes mapped by process ID
const runningProcesses = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { scriptName, targetPath, action } = body;

    // Handle process termination if requested
    if (action === "kill" && body.pid) {
      const proc = runningProcesses.get(body.pid);
      if (proc) {
        try {
          proc.kill("SIGTERM");
          runningProcesses.delete(body.pid);
          return new Response(JSON.stringify({ ok: true, killed: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      return new Response(JSON.stringify({ ok: true, message: "Process not running" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!scriptName) {
      return new Response(JSON.stringify({ error: "scriptName is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cwd = targetPath && fs.existsSync(targetPath) ? path.resolve(targetPath) : process.cwd();
    const pkgManager = detectPackageManager(cwd);

    const encoder = new TextEncoder();
    const portRegex = /(https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0):([0-9]+))/i;

    const stream = new ReadableStream({
      start(controller) {
        const sendEvent = (event, data) => {
          try {
            controller.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
            );
          } catch {}
        };

        const args = ["run", scriptName];
        let child;
        try {
          child = spawn(pkgManager, args, {
            cwd,
            env: {
              ...process.env,
              FORCE_COLOR: "1",
              PORT_DETECTION: "true",
            },
            shell: process.platform === "win32",
          });
        } catch (err) {
          sendEvent("error", { message: err.message });
          controller.close();
          return;
        }

        const pid = child.pid;
        runningProcesses.set(pid, child);
        sendEvent("start", { pid, command: `${pkgManager} run ${scriptName}`, cwd });

        let detectedPort = null;
        let lineBuffer = "";

        const handleData = (chunk, isStderr = false) => {
          const text = chunk.toString();
          lineBuffer += text;
          const lines = lineBuffer.split("\n");
          lineBuffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            // Check for port detection
            const match = line.match(portRegex);
            if (match && !detectedPort) {
              const fullUrl = match[1].replace("0.0.0.0", "localhost");
              const portNum = parseInt(match[2], 10);
              detectedPort = { url: fullUrl, port: portNum };
              sendEvent("port", detectedPort);
            }

            sendEvent("log", {
              type: isStderr ? "stderr" : "stdout",
              text: line,
              timestamp: Date.now(),
            });
          }
        };

        child.stdout?.on("data", (data) => handleData(data, false));
        child.stderr?.on("data", (data) => handleData(data, true));

        child.on("error", (err) => {
          sendEvent("error", { message: err.message });
          runningProcesses.delete(pid);
          try { controller.close(); } catch {}
        });

        child.on("close", (code) => {
          if (lineBuffer.trim()) {
            sendEvent("log", {
              type: "stdout",
              text: lineBuffer,
              timestamp: Date.now(),
            });
          }
          sendEvent("exit", { code: code ?? 0 });
          runningProcesses.delete(pid);
          try { controller.close(); } catch {}
        });

        // Handle client disconnection
        request.signal?.addEventListener("abort", () => {
          if (child && !child.killed) {
            try { child.kill("SIGTERM"); } catch {}
          }
          runningProcesses.delete(pid);
        });
      },
      cancel() {
        // Stream cancelled
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to start script" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
