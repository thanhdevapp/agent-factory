# AGMon (Agent Monitor)

AGMon is a standalone, real-time AI Agent Office & Activity Visualizer. It watches local CLI and desktop coding agent logs (Antigravity CLI & App, Claude Code & Desktop, OpenAI Codex CLI & Desktop) and visualizes active agent workstations, tool badges, and token packet streams flowing to provider server pods in an isometric 2.5D canvas.

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

# Stop background daemon:
agmon stop

# Enable automatic start on system boot (macOS LaunchAgent / Linux systemd):
agmon autostart enable

# Disable auto-start on boot:
agmon autostart disable
```

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
