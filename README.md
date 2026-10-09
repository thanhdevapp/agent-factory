# AGMon (Agent Monitor)

AGMon is a standalone, real-time AI Agent Office & Activity Visualizer. It watches local CLI and desktop coding agent logs (Antigravity CLI & App, Claude Code & Desktop, OpenAI Codex CLI & Desktop) and visualizes active agent workstations, tool badges, and token packet streams flowing to provider server pods in an isometric 2.5D canvas.

![Virtual Office Canvas](https://raw.githubusercontent.com/thanhdevapp/agent-factory/main/screens/virtual-office-canvas.png)

---

## Preview

| Session Chat & Inspector | Zen Fullscreen Chill Mode |
| :---: | :---: |
| ![Session Chat & Inspector](https://raw.githubusercontent.com/thanhdevapp/agent-factory/main/screens/session-chat-inspector.png) | ![Zen Fullscreen Chill Mode](https://raw.githubusercontent.com/thanhdevapp/agent-factory/main/screens/zen-chill-mode.png) |

| Customization Store | Live Workstations & Telemetry |
| :---: | :---: |
| ![Customization Store](https://raw.githubusercontent.com/thanhdevapp/agent-factory/main/screens/customization-store.png) | ![Virtual Office Canvas](https://raw.githubusercontent.com/thanhdevapp/agent-factory/main/screens/virtual-office-canvas.png) |

---

## Quick Start with npx

Run AGMon instantly from any terminal without manual installation:

```bash
# Start visualizer and open dashboard:
npx agmon

# Or specify a custom port:
npx agmon --port 4000
```

---

## Global Installation and Background Daemon

```bash
# Install globally:
npm install -g agmon

# Start background daemon:
agmon start

# Check status (PID, URL, autostart):
agmon status

# List active AI agent sessions in an ASCII table:
agmon list

# Spawn a coding agent in current project:
agmon launch claude "Build login page"
agmon launch antigravity
agmon launch codex

# Terminate a running agent process:
agmon kill <PID>

# Add a project directory to the active watch pool:
agmon watch /path/to/project

# Stop background daemon:
agmon stop

# Enable automatic start on system boot (macOS LaunchAgent / Linux systemd):
agmon autostart enable

# Disable auto-start on boot:
agmon autostart disable
```

---

## Interactive Mission Control & Project Hub (v0.5.0)

- **1-Click Native Terminal & Editor Handoff**: Jump directly from any active agent workstation or chat turn into **Ghostty**, **iTerm2**, **Terminal.app**, **VS Code**, or **Cursor** with path synchronization.
- **Orca-Grade WebGL Web Terminal**:
  - Global hotkey `Cmd+J` or `` ` `` opens the terminal from anywhere in the app.
  - Dual placement: docked inside the bottom workbench panel or popped out into a floating, multi-tab drawer.
  - Hardware GPU acceleration via `@xterm/addon-webgl` (60-120 FPS high-throughput log streams).
  - Session buffer persistence across browser page reloads.
  - In-terminal search (`Ctrl+F`), clickable web links (`http://localhost:PORT`), and Windows ConPTY support.
- **Project Scripts Action Bar**:
  - Automatically discovers `package.json` scripts (`dev`, `test`, `build`, `lint`).
  - 1-Click execution with live SSE streaming output and 200-line bounded memory buffer.
  - **Localhost Port Autodetection**: Automatically detects ports (e.g. `http://localhost:3000`) and displays clickable `:PORT` / "Open Web App" badges directly on the 2D office desk and sidebar.
- **Git Worktree-Aware Grouping**: Automatically identifies parallel Git worktrees (`.git` worktrees pointer) and groups sibling worktree agents under the same Department in the 2D office.

---

## Progressive Web App (PWA)

AGMon is fully PWA-compliant with offline shell caching, standalone window frame, and custom high-resolution icons:

- **macOS / Chrome / Edge**: Click the **Install** icon in the browser address bar to install AGMon as a native desktop application.
- **Safari on macOS**: Click **File** > **Add to Dock...** to run as a standalone desktop app.
- **iPad / iPhone / Android**: Tap **Share** > **Add to Home Screen**.

---

## Features

- **Non-invasive and Safe**: Zero network interception, zero MITM proxy, zero credential access. Inspects only local read-only session logs on disk.
- **Multi-Agent Live Watchers**:
  - **Antigravity (CLI & App)**: Reads `~/.gemini/antigravity-cli/brain/*/transcript.jsonl` with deep tool recognition (GitNexus, Playwright Browser, Git, Docker, Read, Edit, Search, Agent).
  - **Claude Code (CLI & Desktop)**: Reads `~/.claude/sessions/*.json` and `~/.claude/projects/*/*.jsonl` with real token usage, cost tracking, and active tool calls.
  - **OpenAI Codex (CLI & Desktop)**: Reads `~/.codex/sessions/<YYYY>/<MM>/<DD>/rollout-*.jsonl` with support for CLI, VS Code extension, and Desktop sessions.
- **Zen Fullscreen Chill Mode**: One-click distraction-free fullscreen view of the virtual office for ambient monitoring on secondary displays. Exit easily with the ESC key or on-screen control.
- **Time-Machine Replay and Transcript Inspector**: Step forward and backward through past turns, inspect prompts, tool invocations, and token metrics.
- **Runaway Loop Detection**:
  - Automatically flags repetitive loops (5 or more consecutive identical tool calls within 60 seconds).
  - Visualized on canvas with warning state and status indicators.
- **8-Bit Web Audio Synthesizer**:
  - Procedural sound generation directly via Web Audio API with zero audio file assets.
  - Subtle typing ticks during streaming, task complete chimes, loop alerts, and input pings.
- **Live Terminal and Inspector Drawer**:
  - Monospace telemetry console showing real-time action logs with standard level badges (`[BASH]`, `[EDIT]`, `[READ]`, `[SEARCH]`, `[PROMPT]`, `[ERROR]`, `[MCP]`).
- **Telemetry Filtering**: Filter by quantity (Top 10, 20, 30, 50, or All Desks) and timeframe (1h, 6h, 24h, 3d, 7d, All time).
- **Desktop Push Notifications**: Optional OS notifications when tasks complete or warnings trigger.
- **Rich Showcase and Mock Presets**: Pre-configured testing scenarios (`showcase`, `cases`, and item-specific showcases) to evaluate office dynamics and items.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Graphics Engine**: Pixi.js v8 (WebGL / Canvas)
- **Styling**: Tailwind CSS v4
- **Streaming**: Server-Sent Events (SSE)
- **PWA**: Web App Manifest + Service Worker + App Shell

---

## License

MIT
