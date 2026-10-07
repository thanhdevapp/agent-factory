# 🤖 AGMon (Agent Monitor)

**AGMon** is a standalone, real-time AI Agent Office & Activity Visualizer. It watches local CLI coding agent logs (Antigravity CLI, Claude Code, Cursor, etc.) and visualizes active agent desks, tool badges, and token packet streams flowing to provider server pods in a rich 2.5D isometric view.

---

## ⚡ Quick Start with `npx`

Run AGMon instantly from any terminal without installing:

```bash
# Start visualizer & open dashboard:
npx agmon

# Or specify a custom port:
npx agmon --port 4000
```

---

## 💻 Global Installation & Background Daemon

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

## 📱 Progressive Web App (PWA)

AGMon is fully PWA-compliant with offline shell caching, standalone window frame, and custom high-resolution icons:

- **macOS / Chrome / Edge**: Click the **Install** icon in the browser address bar to install AGMon as a native desktop application.
- **Safari on macOS**: Click **File** > **Add to Dock...** to run as a standalone desktop app.
- **iPad / iPhone / Android**: Tap **Share** > **Add to Home Screen**.

---

## ✨ Features

- **100% Non-invasive & Safe**: Zero network interception, zero MITM proxy, zero credential touches. Only inspects local read-only CLI session logs.
- **Dual Live Watchers**:
  - **Antigravity CLI (`agy`)**: Reads `~/.gemini/antigravity-cli/brain/*/transcript.jsonl` with deep tool recognition (GitNexus, Playwright Browser, Git, Docker, Read, Edit, Search, Agent).
  - **Claude Code CLI (`claude`)**: Reads `~/.claude/sessions/*.json` and `~/.claude/projects/*/*.jsonl` with real token usage and active tool calls.
- **2.5D Isometric Pixi.js Canvas**:
  - Desks with cute robots (specular helmet reflections, rim shading, extruded 3D perspective).
  - Dynamic tool badges cycling over agents in real time.
  - Token streams running from agent desks into provider pods (Gemini, Claude, OpenAI, Minimax, DeepSeek).
  - Fallback courier drones re-routing requests between providers.
- **Inspector Panel**: Click on any desk to inspect latency, model, tokens (input/output/cached), cost, and currently executing command/file.
- **Demo Presets**: Includes offline presets (`cases`, `storm`, `busy`, `idle`, `errors`) for demonstrations and development.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Graphics Engine**: Pixi.js v8 (WebGL / Canvas)
- **Styling**: Tailwind CSS v4
- **Streaming**: Server-Sent Events (SSE)
- **PWA**: Web App Manifest + Service Worker + App Shell

---

## 📄 License
MIT
