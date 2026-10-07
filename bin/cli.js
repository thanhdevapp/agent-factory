#!/usr/bin/env node

import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");

const HOME = os.homedir();
const CONFIG_DIR = path.join(HOME, ".agent-factory");
const PID_FILE = path.join(CONFIG_DIR, "agent-factory.pid");
const LOG_FILE = path.join(CONFIG_DIR, "agent-factory.log");
const PLIST_PATH = path.join(HOME, "Library", "LaunchAgents", "com.agentfactory.daemon.plist");
const SYSTEMD_DIR = path.join(HOME, ".config", "systemd", "user");
const SYSTEMD_PATH = path.join(SYSTEMD_DIR, "agent-factory.service");

// Ensure ~/.agent-factory exists
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
// Commands
// -------------------------------------------------------------

function runForeground(port, open = true) {
  const existingPid = getDaemonPid();
  if (existingPid) {
    console.log(`\x1b[33m⚠️ Agent Factory is already running in background (PID: ${existingPid})\x1b[0m`);
    console.log(`🌐 Dashboard: \x1b[36mhttp://localhost:${port}\x1b[0m\n`);
    if (open) openBrowser(`http://localhost:${port}`);
    return;
  }

  console.log(`\n\x1b[32m🤖 Starting Agent Factory (Foreground) on port ${port}...\x1b[0m`);
  console.log(`📁 Project Root: ${PKG_ROOT}`);
  console.log(`🌐 Dashboard: \x1b[36mhttp://localhost:${port}\x1b[0m\n`);

  const nextBin = path.join(PKG_ROOT, "node_modules", ".bin", "next");
  const child = spawn(nextBin, ["dev", "--port", String(port)], {
    cwd: PKG_ROOT,
    stdio: "inherit",
    env: { ...process.env, PORT: String(port) },
  });

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
    console.log(`\x1b[33m⚠️ Agent Factory daemon is ALREADY running (PID: ${existingPid})\x1b[0m`);
    console.log(`🌐 URL: \x1b[36mhttp://localhost:${port}\x1b[0m`);
    return;
  }

  console.log(`\x1b[32m🚀 Starting Agent Factory in Background Daemon Mode on port ${port}...\x1b[0m`);

  const out = fs.openSync(LOG_FILE, "a");
  const nextBin = path.join(PKG_ROOT, "node_modules", ".bin", "next");

  const child = spawn(nextBin, ["dev", "--port", String(port)], {
    cwd: PKG_ROOT,
    detached: true,
    stdio: ["ignore", out, out],
    env: { ...process.env, PORT: String(port) },
  });

  child.unref();

  fs.writeFileSync(PID_FILE, String(child.pid), "utf-8");

  console.log(`\x1b[32m✓ Daemon launched successfully!\x1b[0m`);
  console.log(`  • PID: \x1b[33m${child.pid}\x1b[0m`);
  console.log(`  • Log: \x1b[34m${LOG_FILE}\x1b[0m`);
  console.log(`  • URL: \x1b[36mhttp://localhost:${port}\x1b[0m\n`);
  console.log(`Type \x1b[35mnpx agent-factory stop\x1b[0m to stop the daemon.\n`);
}

function stopDaemon() {
  const pid = getDaemonPid();
  if (!pid) {
    console.log(`\x1b[33mℹ️ No active Agent Factory daemon found.\x1b[0m`);
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    return;
  }

  console.log(`\x1b[33m🛑 Stopping Agent Factory daemon (PID: ${pid})...\x1b[0m`);
  try {
    process.kill(pid, "SIGTERM");
    setTimeout(() => {
      if (isPidAlive(pid)) {
        try { process.kill(pid, "SIGKILL"); } catch {}
      }
      if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
      console.log(`\x1b[32m✓ Agent Factory daemon stopped.\x1b[0m`);
    }, 500);
  } catch (err) {
    console.error(`Failed to kill process ${pid}:`, err.message);
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
  }
}

function showStatus(port) {
  const pid = getDaemonPid();
  console.log(`\n\x1b[1m🤖 Agent Factory Status:\x1b[0m`);
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
    <string>com.agentfactory.daemon</string>
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
      console.log(`  • Agent Factory will now automatically launch on computer login.`);
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
Description=Agent Factory Daemon
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
      execSync("systemctl --user enable --now agent-factory");
      console.log(`\x1b[32m✓ Linux systemd auto-start enabled!\x1b[0m`);
      console.log(`  • Service: ${SYSTEMD_PATH}`);
    } catch (err) {
      console.error("Failed to enable systemd service:", err.message);
    }
    return;
  }

  console.log(`\x1b[33m⚠️ Auto-start is currently supported on macOS (Launchd) and Linux (systemd).\x1b[0m`);
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
      console.log(`\x1b[33mℹ️ Auto-start was not enabled.\x1b[0m`);
    }
    return;
  }

  if (process.platform === "linux") {
    if (fs.existsSync(SYSTEMD_PATH)) {
      try {
        execSync("systemctl --user stop agent-factory 2>/dev/null || true");
        execSync("systemctl --user disable agent-factory 2>/dev/null || true");
      } catch {}
      fs.unlinkSync(SYSTEMD_PATH);
      console.log(`\x1b[32m✓ Linux systemd auto-start disabled.\x1b[0m`);
    } else {
      console.log(`\x1b[33mℹ️ Auto-start was not enabled.\x1b[0m`);
    }
    return;
  }
}

function showHelp() {
  console.log(`
\x1b[1m🤖 Agent Factory CLI\x1b[0m
Universal Live AI Agent Office & Activity Visualizer

\x1b[1mUSAGE:\x1b[0m
  npx agent-factory [command] [options]

\x1b[1mCOMMANDS:\x1b[0m
  (default)           Start visualizer and open dashboard in browser
  start               Start in background (daemon mode)
  stop                Stop background daemon
  status              Check daemon status & auto-start configuration
  autostart enable    Configure to automatically start on computer boot
  autostart disable   Disable automatic boot launch
  help                Show this help message

\x1b[1mOPTIONS:\x1b[0m
  --port <number>     Set HTTP port (default: 3030)
  --no-open           Do not automatically open browser on start
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

  case "run":
    // Internal command for launchd/systemd foreground execution
    runForeground(port, false);
    break;

  case "autostart":
    if (args[1] === "enable") {
      enableAutostart(port);
    } else if (args[1] === "disable") {
      disableAutostart();
    } else {
      console.log(`Usage: npx agent-factory autostart [enable|disable]`);
    }
    break;

  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;

  default:
    runForeground(port, !noOpen);
    break;
}
