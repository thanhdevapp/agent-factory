#!/usr/bin/env node

import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");

const HOME = os.homedir();
const CONFIG_DIR = path.join(HOME, ".agmon");
const PID_FILE = path.join(CONFIG_DIR, "agmon.pid");
const LOG_FILE = path.join(CONFIG_DIR, "agmon.log");
const PLIST_PATH = path.join(HOME, "Library", "LaunchAgents", "com.agmon.daemon.plist");
const SYSTEMD_DIR = path.join(HOME, ".config", "systemd", "user");
const SYSTEMD_PATH = path.join(SYSTEMD_DIR, "agmon.service");

// Ensure ~/.agmon exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

function getPort() {
  const argIdx = process.argv.indexOf("--port");
  if (argIdx !== -1 && process.argv[argIdx + 1]) {
    return parseInt(process.argv[argIdx + 1], 10);
  }
  return parseInt(process.env.PORT || "3030", 10);
}

function openBrowser(url) {
  try {
    const cmd = process.platform === "darwin" ? `open "${url}"` : process.platform === "win32" ? `start "${url}"` : `xdg-open "${url}"`;
    execSync(cmd, { stdio: "ignore" });
  } catch {
    // ignore
  }
}

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function getDaemonPid() {
  if (fs.existsSync(PID_FILE)) {
    const raw = fs.readFileSync(PID_FILE, "utf-8").trim();
    const pid = parseInt(raw, 10);
    if (!isNaN(pid) && isPidAlive(pid)) {
      return pid;
    }
  }
  return null;
}

// -------------------------------------------------------------
// Server Entry & Execution
// -------------------------------------------------------------

function getServerEntry() {
  const serverPath = path.join(PKG_ROOT, "server.js");
  if (fs.existsSync(serverPath)) {
    return serverPath;
  }
  return null;
}

function getNextBin() {
  try {
    return require.resolve("next/dist/bin/next");
  } catch {
    return path.join(PKG_ROOT, "node_modules", ".bin", "next");
  }
}

function getNextCommand() {
  const isBuilt = fs.existsSync(path.join(PKG_ROOT, ".next", "BUILD_ID"));
  return isBuilt ? "start" : "dev";
}

function runForeground(port, open = true, isService = false) {
  if (!isService) {
    const existingPid = getDaemonPid();
    if (existingPid) {
      console.log(`\x1b[33mAGMon is already running in background (PID: ${existingPid})\x1b[0m`);
      console.log(`Dashboard: \x1b[36mhttp://localhost:${port}\x1b[0m\n`);
      if (open) openBrowser(`http://localhost:${port}`);
      return;
    }
  }

  const serverEntry = getServerEntry();
  console.log(`\n\x1b[32mStarting AGMon (Agent Monitor) on port ${port}...\x1b[0m`);
  console.log(`Project Root: ${PKG_ROOT}`);
  console.log(`Dashboard: \x1b[36mhttp://localhost:${port}\x1b[0m\n`);

  let child;
  const isBuilt = fs.existsSync(path.join(PKG_ROOT, ".next", "BUILD_ID"));
  const childEnv = {
    ...process.env,
    PORT: String(port),
    NODE_ENV: process.env.NODE_ENV || (isBuilt ? "production" : "development"),
  };

  if (serverEntry) {
    child = spawn(process.execPath, [serverEntry], {
      cwd: PKG_ROOT,
      stdio: "inherit",
      env: childEnv,
    });
  } else {
    const cmd = getNextCommand();
    const nextBin = getNextBin();
    child = spawn(process.execPath, [nextBin, cmd, "--port", String(port)], {
      cwd: PKG_ROOT,
      stdio: "inherit",
      env: childEnv,
    });
  }

  if (open) {
    setTimeout(() => {
      openBrowser(`http://localhost:${port}`);
    }, 2000);
  }

  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}

function startDaemon(port) {
  const existingPid = getDaemonPid();
  if (existingPid) {
    console.log(`\x1b[33mAGMon daemon is ALREADY running (PID: ${existingPid})\x1b[0m`);
    console.log(`URL: \x1b[36mhttp://localhost:${port}\x1b[0m`);
    return;
  }

  const serverEntry = getServerEntry();
  console.log(`\x1b[32mStarting AGMon in Background Daemon Mode on port ${port}...\x1b[0m`);

  const out = fs.openSync(LOG_FILE, "a");
  let child;
  const isBuilt = fs.existsSync(path.join(PKG_ROOT, ".next", "BUILD_ID"));
  const daemonEnv = {
    ...process.env,
    PORT: String(port),
    NODE_ENV: process.env.NODE_ENV || (isBuilt ? "production" : "development"),
  };

  if (serverEntry) {
    child = spawn(process.execPath, [serverEntry], {
      cwd: PKG_ROOT,
      detached: true,
      stdio: ["ignore", out, out],
      env: daemonEnv,
    });
  } else {
    const cmd = getNextCommand();
    const nextBin = getNextBin();
    child = spawn(process.execPath, [nextBin, cmd, "--port", String(port)], {
      cwd: PKG_ROOT,
      detached: true,
      stdio: ["ignore", out, out],
      env: daemonEnv,
    });
  }

  child.unref();

  fs.writeFileSync(PID_FILE, String(child.pid), "utf-8");

  console.log(`\x1b[32m✓ AGMon Daemon launched successfully!\x1b[0m`);
  console.log(`  • PID: \x1b[33m${child.pid}\x1b[0m`);
  console.log(`  • Log: \x1b[34m${LOG_FILE}\x1b[0m`);
  console.log(`  • URL: \x1b[36mhttp://localhost:${port}\x1b[0m\n`);
  console.log(`Type \x1b[35magmon stop\x1b[0m to stop the daemon.\n`);
}

function stopDaemon() {
  const pid = getDaemonPid();
  if (!pid) {
    console.log(`\x1b[33mNo active AGMon daemon found.\x1b[0m`);
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    return;
  }

  console.log(`\x1b[33mStopping AGMon daemon (PID: ${pid})...\x1b[0m`);
  try {
    process.kill(pid, "SIGTERM");
    setTimeout(() => {
      if (isPidAlive(pid)) {
        try { process.kill(pid, "SIGKILL"); } catch {}
      }
      if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
      console.log(`\x1b[32m✓ AGMon daemon stopped.\x1b[0m`);
    }, 500);
  } catch (err) {
    console.error(`Failed to kill process ${pid}:`, err.message);
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
  }
}

function showStatus(port) {
  const pid = getDaemonPid();
  console.log(`\n\x1b[1mAGMon (Agent Monitor) Status:\x1b[0m`);
  if (pid) {
    console.log(`  • Status:  \x1b[32m● RUNNING (Daemon)\x1b[0m`);
    console.log(`  • PID:     \x1b[33m${pid}\x1b[0m`);
    console.log(`  • URL:     \x1b[36mhttp://localhost:${port}\x1b[0m`);
    console.log(`  • Log:     ${LOG_FILE}`);
  } else {
    console.log(`  • Status:  \x1b[31m○ STOPPED\x1b[0m`);
  }

  const autostart = isAutostartEnabled();
  console.log(`  • Auto-start on boot: ${autostart ? "\x1b[32mENABLED\x1b[0m" : "\x1b[33mDISABLED\x1b[0m"}\n`);
}

// -------------------------------------------------------------
// Phase 4: CLI Commands (list, launch, kill, watch)
// -------------------------------------------------------------

async function listSessions(port) {
  console.log(`\n\x1b[1mActive AI Agent Sessions in AGMon (port ${port}):\x1b[0m\n`);
  try {
    const res = await fetch(`http://localhost:${port}/api/reports/tokens?timeframe=24h`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const sessions = data.sessions || [];

    if (sessions.length === 0) {
      console.log(`\x1b[33mNo active agent sessions recorded in the last 24h.\x1b[0m`);
      console.log(`Run \x1b[36magmon launch <claude|antigravity|codex>\x1b[0m to start an agent.\n`);
      return;
    }

    const header = [
      "SESSION / ID".padEnd(24),
      "CLIENT / PROVIDER".padEnd(20),
      "MODEL".padEnd(24),
      "TOKENS".padStart(10),
      "STATUS".padEnd(12),
      "WORKSPACE",
    ].join("  ");

    console.log(`\x1b[1m${header}\x1b[0m`);
    console.log("─".repeat(header.length + 8));

    for (const s of sessions.slice(0, 30)) {
      const idStr = (s.sessionId || s.id || s.connectionId || "unknown").slice(0, 22).padEnd(24);
      const provStr = (s.provider || s.clientType || "agent").slice(0, 18).padEnd(20);
      const modelStr = (s.model || "—").slice(0, 22).padEnd(24);
      const tokenStr = (s.totalTokens ? Number(s.totalTokens).toLocaleString() : "—").padStart(10);
      const statusStr = (s.status || s.state || "idle").slice(0, 10).padEnd(12);
      const wsStr = s.workspace || s.account || s.cwd ? path.basename(s.cwd || s.workspace || s.account) : "—";

      console.log(`${idStr}  ${provStr}  \x1b[36m${modelStr}\x1b[0m  \x1b[32m${tokenStr}\x1b[0m  ${statusStr}  \x1b[33m${wsStr}\x1b[0m`);
    }

    console.log(`\n\x1b[32mTotal recorded sessions: ${sessions.length}\x1b[0m\n`);
  } catch (err) {
    console.log(`\x1b[33mNotice: Could not query running AGMon daemon at http://localhost:${port} (${err.message}).\x1b[0m`);
    console.log(`Start the visualizer using \x1b[36magmon start\x1b[0m or \x1b[36magmon\x1b[0m.\n`);
  }
}

function launchAgent(agentName, extraArgs = []) {
  if (!agentName) {
    console.log(`\x1b[31mError: Agent name required.\x1b[0m`);
    console.log(`Usage: agmon launch <claude|antigravity|codex> [prompt or args...]`);
    return;
  }

  const target = agentName.toLowerCase();
  let bin = "";
  let args = [];

  if (target === "claude") {
    bin = "npx";
    args = ["@anthropic-ai/claude-code", ...extraArgs];
  } else if (target === "antigravity" || target === "agy" || target === "gemini") {
    bin = "agy";
    args = [...extraArgs];
  } else if (target === "codex") {
    bin = "codex";
    args = [...extraArgs];
  } else {
    bin = agentName;
    args = [...extraArgs];
  }

  console.log(`\n\x1b[32mLaunching ${agentName} in ${process.cwd()}...\x1b[0m`);
  console.log(`Command: \x1b[36m${bin} ${args.join(" ")}\x1b[0m\n`);

  const child = spawn(bin, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}

function killProcess(target) {
  if (!target) {
    console.log(`\x1b[31mError: Target PID required.\x1b[0m`);
    console.log(`Usage: agmon kill <PID>`);
    return;
  }

  const pid = parseInt(target, 10);
  if (isNaN(pid) || pid <= 0) {
    console.log(`\x1b[31mError: Invalid PID "${target}". Please supply a valid process ID.\x1b[0m`);
    return;
  }

  if (!isPidAlive(pid)) {
    console.log(`\x1b[33mProcess ${pid} is not currently running.\x1b[0m`);
    return;
  }

  console.log(`\x1b[33mSending SIGTERM to process ${pid}...\x1b[0m`);
  try {
    process.kill(pid, "SIGTERM");
    setTimeout(() => {
      if (isPidAlive(pid)) {
        console.log(`\x1b[31mProcess ${pid} did not exit within 1s, sending SIGKILL...\x1b[0m`);
        try { process.kill(pid, "SIGKILL"); } catch {}
      }
      console.log(`\x1b[32m✓ Process ${pid} terminated.\x1b[0m`);
    }, 800);
  } catch (err) {
    console.log(`\x1b[31mFailed to kill process ${pid}: ${err.message}\x1b[0m`);
  }
}

function watchPath(targetPath) {
  const resolved = targetPath ? path.resolve(targetPath) : process.cwd();
  if (!fs.existsSync(resolved)) {
    console.log(`\x1b[31mError: Path does not exist: ${resolved}\x1b[0m`);
    return;
  }

  const WATCHED_FILE = path.join(CONFIG_DIR, "watched_paths.json");
  let list = [];
  try {
    if (fs.existsSync(WATCHED_FILE)) {
      list = JSON.parse(fs.readFileSync(WATCHED_FILE, "utf-8"));
    }
  } catch {}

  if (!list.includes(resolved)) {
    list.push(resolved);
    fs.writeFileSync(WATCHED_FILE, JSON.stringify(list, null, 2), "utf-8");
  }

  console.log(`\x1b[32m✓ Successfully added to watch pool:\x1b[0m`);
  console.log(`  \x1b[36m${resolved}\x1b[0m`);
  console.log(`Total watched directories: ${list.length}`);
}

// -------------------------------------------------------------
// Auto-start configuration (macOS Launchd & Linux systemd)
// -------------------------------------------------------------

function isAutostartEnabled() {
  if (process.platform === "darwin") {
    return fs.existsSync(PLIST_PATH);
  }
  if (process.platform === "linux") {
    return fs.existsSync(SYSTEMD_PATH);
  }
  return false;
}

function enableAutostart(port) {
  const nodePath = process.execPath;
  const cliPath = __filename;

  if (process.platform === "darwin") {
    const launchAgentsDir = path.dirname(PLIST_PATH);
    if (!fs.existsSync(launchAgentsDir)) {
      fs.mkdirSync(launchAgentsDir, { recursive: true });
    }

    const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.agmon.daemon</string>
    <key>ProgramArguments</key>
    <array>
        <string>${nodePath}</string>
        <string>${cliPath}</string>
        <string>run</string>
        <string>--port</string>
        <string>${port}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>ThrottleInterval</key>
    <integer>10</integer>
    <key>StandardOutPath</key>
    <string>${LOG_FILE}</string>
    <key>StandardErrorPath</key>
    <string>${LOG_FILE}</string>
</dict>
</plist>
`;

    fs.writeFileSync(PLIST_PATH, plist, "utf-8");
    try {
      execSync(`launchctl unload "${PLIST_PATH}" 2>/dev/null || true`);
      execSync(`launchctl load "${PLIST_PATH}"`);
      console.log(`\x1b[32m✓ macOS LaunchAgent auto-start enabled!\x1b[0m`);
      console.log(`  • Plist: ${PLIST_PATH}`);
      console.log(`  • AGMon will now automatically launch on computer login.`);
    } catch (err) {
      console.error("Failed to load launchctl plist:", err.message);
    }
    return;
  }

  if (process.platform === "linux") {
    if (!fs.existsSync(SYSTEMD_DIR)) {
      fs.mkdirSync(SYSTEMD_DIR, { recursive: true });
    }

    const service = `[Unit]
Description=AGMon AI Agent Monitor Daemon
After=network.target

[Service]
Type=simple
ExecStart=${nodePath} ${cliPath} run --port ${port}
Restart=always
RestartSec=5
StandardOutput=append:${LOG_FILE}
StandardError=append:${LOG_FILE}

[Install]
WantedBy=default.target
`;

    fs.writeFileSync(SYSTEMD_PATH, service, "utf-8");
    try {
      execSync("systemctl --user daemon-reload");
      execSync("systemctl --user enable --now agmon");
      console.log(`\x1b[32m✓ Linux systemd auto-start enabled!\x1b[0m`);
      console.log(`  • Service: ${SYSTEMD_PATH}`);
    } catch (err) {
      console.error("Failed to enable systemd service:", err.message);
    }
    return;
  }

  console.log(`\x1b[33mAuto-start is currently supported on macOS (Launchd) and Linux (systemd).\x1b[0m`);
}

function disableAutostart() {
  if (process.platform === "darwin") {
    if (fs.existsSync(PLIST_PATH)) {
      try {
        execSync(`launchctl unload "${PLIST_PATH}" 2>/dev/null || true`);
      } catch {}
      fs.unlinkSync(PLIST_PATH);
      console.log(`\x1b[32m✓ macOS auto-start disabled (LaunchAgent removed).\x1b[0m`);
    } else {
      console.log(`\x1b[33mAuto-start was not enabled.\x1b[0m`);
    }
    return;
  }

  if (process.platform === "linux") {
    if (fs.existsSync(SYSTEMD_PATH)) {
      try {
        execSync("systemctl --user stop agmon 2>/dev/null || true");
        execSync("systemctl --user disable agmon 2>/dev/null || true");
      } catch {}
      fs.unlinkSync(SYSTEMD_PATH);
      console.log(`\x1b[32m✓ Linux systemd auto-start disabled.\x1b[0m`);
    } else {
      console.log(`\x1b[33mAuto-start was not enabled.\x1b[0m`);
    }
    return;
  }
}

function showHelp() {
  console.log(`
\x1b[1mAGMon (Agent Monitor) CLI\x1b[0m
Interactive Mission Control & 2D Office Visualizer for Coding Agents

\x1b[1mUSAGE:\x1b[0m
  agmon [command] [options]
  # or via npx:
  npx agmon [command] [options]

\x1b[1mCOMMANDS:\x1b[0m
  (default)                     Start visualizer and open dashboard in browser
  start                         Start in background (daemon mode)
  stop                          Stop background daemon
  status                        Check daemon status & auto-start configuration
  list                          List active AI agent sessions in an ASCII table
  launch <agent> [args...]      Spawn a coding agent (claude, antigravity, codex)
  kill <PID>                    Terminate a running agent process
  watch [path]                  Add directory to active project watch pool
  autostart enable              Configure to automatically start on computer boot
  autostart disable             Disable automatic boot launch
  version                       Show installed AGMon version
  help                          Show this help message

\x1b[1mOPTIONS:\x1b[0m
  --port <number>               Set HTTP port (default: 3030)
  --no-open                     Do not automatically open browser on start
`);
}

// -------------------------------------------------------------
// CLI Routing
// -------------------------------------------------------------

const args = process.argv.slice(2);
const command = args[0] || "";
const port = getPort();
const noOpen = process.argv.includes("--no-open");

switch (command) {
  case "start":
    startDaemon(port);
    break;

  case "stop":
    stopDaemon();
    break;

  case "status":
    showStatus(port);
    break;

  case "list":
    listSessions(port);
    break;

  case "launch":
    launchAgent(args[1], args.slice(2));
    break;

  case "kill":
    killProcess(args[1]);
    break;

  case "watch":
    watchPath(args[1]);
    break;

  case "run":
    runForeground(port, false, true);
    break;

  case "autostart":
    if (args[1] === "enable") {
      enableAutostart(port);
    } else if (args[1] === "disable") {
      disableAutostart();
    } else {
      console.log(`Usage: agmon autostart [enable|disable]`);
    }
    break;

  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;

  case "version":
  case "--version":
  case "-v": {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf-8"));
      console.log(`agmon v${pkg.version}`);
    } catch {
      console.log("agmon (version unknown)");
    }
    break;
  }

  default:
    runForeground(port, !noOpen);
    break;
}
