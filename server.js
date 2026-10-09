import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { WebSocketServer } from "ws";
import { attachPtyWebSocketServer } from "./src/lib/ptyServer.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3030", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

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

  // Attach WebSocket server on /api/pty
  const wss = new WebSocketServer({ server, path: "/api/pty" });
  attachPtyWebSocketServer(wss);

  server.listen(port, () => {
    console.log(`> AGMon ready on http://${hostname}:${port}`);
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
