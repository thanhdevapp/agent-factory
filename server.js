import { createServer } from "node:http";
import { parse } from "node:url";
import fs from "node:fs";
import path from "node:path";
import next from "next";
import { WebSocketServer } from "ws";
import { attachPtyWebSocketServer } from "./src/lib/ptyServer.js";

const isBuilt = fs.existsSync(path.join(process.cwd(), ".next", "BUILD_ID"));
const dev = process.env.NODE_ENV ? process.env.NODE_ENV !== "production" : !isBuilt;
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3030", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare();
  const upgradeHandler = typeof app.getUpgradeHandler === "function" ? app.getUpgradeHandler() : null;

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("[server.js] Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  // Attach WebSocket server for /api/pty using noServer mode so it does not conflict with Next.js HMR
  const wss = new WebSocketServer({ noServer: true });
  attachPtyWebSocketServer(wss);

  server.on("upgrade", (req, socket, head) => {
    try {
      const { pathname } = parse(req.url || "", true);
      if (pathname === "/api/pty") {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit("connection", ws, req);
        });
      } else if (upgradeHandler) {
        // Forward HMR and internal Next.js WebSocket requests
        upgradeHandler(req, socket, head);
      } else {
        socket.destroy();
      }
    } catch (err) {
      console.error("[server.js] Error handling upgrade:", err);
      try { socket.destroy(); } catch {}
    }
  });

  server.listen(port, () => {
    console.log(`> AGMon ready on http://${hostname}:${port} (${dev ? "development" : "production"})`);
    console.log(`> Interactive Terminal WebSocket mounted at ws://${hostname}:${port}/api/pty`);
  });
}

// Support running standalone companion WebSocket server for 'next dev'
export function startCompanionPtyServer(companionPort = 3031) {
  const wss = new WebSocketServer({ port: companionPort });
  attachPtyWebSocketServer(wss);
  console.log(`> Companion PTY WebSocket server listening on ws://localhost:${companionPort}`);
  return wss;
}

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  startServer().catch((err) => {
    console.error("[server.js] Failed to start:", err);
    process.exit(1);
  });
}

export default startServer;
