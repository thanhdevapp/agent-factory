import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const dynamic = "force-dynamic";

/**
 * Detect available terminals on the host system
 */
function detectInstalledApps() {
  const platform = process.platform;
  const home = os.homedir();

  const isMac = platform === "darwin";
  const isWin = platform === "win32";

  let hasGhostty = false;
  let hasIterm = false;
  let hasTerminal = true;
  let hasVSCode = false;
  let hasCursor = false;

  if (isMac) {
    hasGhostty =
      fs.existsSync("/Applications/Ghostty.app") ||
      fs.existsSync(path.join(home, "Applications/Ghostty.app"));
    hasIterm =
      fs.existsSync("/Applications/iTerm.app") ||
      fs.existsSync(path.join(home, "Applications/iTerm.app"));
    hasVSCode =
      fs.existsSync("/Applications/Visual Studio Code.app") ||
      fs.existsSync(path.join(home, "Applications/Visual Studio Code.app"));
    hasCursor =
      fs.existsSync("/Applications/Cursor.app") ||
      fs.existsSync(path.join(home, "Applications/Cursor.app"));
  } else if (isWin) {
    hasTerminal = true; // wt.exe or powershell
    hasVSCode = true;
    hasCursor = true;
  } else {
    // Linux
    hasGhostty = false;
    hasTerminal = true;
    hasVSCode = true;
  }

  return {
    terminals: [
      { id: "ghostty", name: "Ghostty", available: hasGhostty },
      { id: "iterm", name: "iTerm2", available: hasIterm },
      { id: "terminal", name: isMac ? "Terminal.app" : "System Terminal", available: hasTerminal },
    ],
    editors: [
      { id: "vscode", name: "VS Code", available: hasVSCode },
      { id: "cursor", name: "Cursor", available: hasCursor },
    ],
    defaultTerminal: hasGhostty ? "ghostty" : hasIterm ? "iterm" : "terminal",
    defaultEditor: hasCursor ? "cursor" : "vscode",
  };
}

/**
 * Launch native terminal or editor at the specified directory
 */
function launchNativeHandoff({ targetPath, target, app }) {
  const platform = process.platform;
  const isMac = platform === "darwin";
  const isWin = platform === "win32";
  const detected = detectInstalledApps();

  // If targetPath is a file, get directory for terminal
  const stat = fs.existsSync(targetPath) ? fs.statSync(targetPath) : null;
  const dirPath = stat && stat.isFile() ? path.dirname(targetPath) : targetPath;

  if (target === "editor") {
    const editorApp = app || detected.defaultEditor;
    if (isMac) {
      const scheme = editorApp === "cursor" ? "cursor://file" : "vscode://file";
      const proc = spawn("open", [`${scheme}${targetPath}`], {
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
      return { success: true, app: editorApp, target, path: targetPath };
    } else if (isWin) {
      const cmd = editorApp === "cursor" ? "cursor" : "code";
      const proc = spawn("cmd.exe", ["/c", cmd, targetPath], {
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
      return { success: true, app: editorApp, target, path: targetPath };
    } else {
      const cmd = editorApp === "cursor" ? "cursor" : "code";
      const proc = spawn(cmd, [targetPath], {
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
      return { success: true, app: editorApp, target, path: targetPath };
    }
  }

  // Default: target === 'terminal'
  const termApp = app || detected.defaultTerminal;

  if (isMac) {
    if (termApp === "ghostty") {
      const proc = spawn("open", ["-a", "Ghostty", dirPath], {
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
    } else if (termApp === "iterm") {
      const proc = spawn("open", ["-a", "iTerm", dirPath], {
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
    } else {
      const proc = spawn("open", ["-a", "Terminal", dirPath], {
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
    }
    return { success: true, app: termApp, target: "terminal", path: dirPath };
  } else if (isWin) {
    // Windows Terminal or PowerShell
    const proc = spawn("cmd.exe", ["/c", "start", "wt.exe", "-d", dirPath], {
      detached: true,
      stdio: "ignore",
    });
    proc.on("error", () => {
      // Fallback to powershell if wt.exe not found
      spawn("cmd.exe", ["/c", "start", "powershell.exe", "-NoExit", "-Command", `Set-Location '${dirPath}'`], {
        detached: true,
        stdio: "ignore",
      });
    });
    proc.unref();
    return { success: true, app: "windows-terminal", target: "terminal", path: dirPath };
  } else {
    // Linux
    const proc = spawn("x-terminal-emulator", ["--working-directory", dirPath], {
      detached: true,
      stdio: "ignore",
    });
    proc.on("error", () => {
      spawn("xdg-open", [dirPath], { detached: true, stdio: "ignore" });
    });
    proc.unref();
    return { success: true, app: "terminal", target: "terminal", path: dirPath };
  }
}

export async function GET() {
  const apps = detectInstalledApps();
  return NextResponse.json({
    platform: process.platform,
    ...apps,
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { path: rawPath, target = "terminal", app } = body;

    if (!rawPath || typeof rawPath !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'path' in request body" },
        { status: 400 }
      );
    }

    const resolvedPath = path.resolve(rawPath);

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json(
        { success: false, error: `Directory or file not found: ${resolvedPath}` },
        { status: 404 }
      );
    }

    const result = launchNativeHandoff({
      targetPath: resolvedPath,
      target,
      app,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/handoff] Error launching native handoff:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to launch native application" },
      { status: 500 }
    );
  }
}
