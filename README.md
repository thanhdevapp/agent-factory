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
- **🔊 8-Bit Web Audio Synthesizer (0-Byte Asset Footprint)**:
  - Procedural sound generation directly via Web Audio API (sine, square, triangle oscillators).
  - Subtle typing ticks during streaming, upbeat retro chime on task complete, warning sirens on loops/errors, and gentle pings when agent awaits user input.
- **🛡️ Runaway Loop Detection & Safety Radar**:
  - Automatically flags runaway agent loops (5+ consecutive repeated identical tool invocations within 60s).
  - Visualized in Pixi.js with rising animated smoke puffs, dizzy spiral eyes (`@_@`), and a pulsating red hazard desk outline.
- **💻 Live Terminal Drawer**:
  - Monospace telemetry console in the Inspector panel showing the last 25 real-time actions.
  - Color-coded badges (`[BASH]`, `[EDIT]`, `[READ]`, `[SEARCH]`, `[PROMPT]`, `[ERROR]`, `[MCP]`) with auto-scroll lock.
- **🔔 Native Desktop Push Notifications**:
  - Opt-in OS push notifications (Web Notification API) when agents complete tasks or trigger runaway alerts.
- **2.5D Isometric Pixi.js Canvas**:
  - Desks with cute chibi robots (specular helmet reflections, rim shading, extruded 3D perspective).
  - Dynamic tool badges cycling over agents in real time.
  - Token streams running from agent desks into provider pods (Gemini, Claude, OpenAI, Minimax, DeepSeek).
  - Fallback courier drones re-routing requests between providers.
  - Support for 1,010 3D cosmetic items across 6 categories (Skins, Props, Pets, Auras, Trophies, Themes).
- **Inspector Panel & Active Gear**: Click on any desk to inspect latency, model, tokens (input/output/cached), cost, executing command, and live Equipped Cosmetics breakdown.
- **Rich Mock Presets & 1-Click Showcase**:
  - `showcase`: 24-agent layout covering 100% 24 visual archetypes across all categories.
  - `cases`: 17 edge-case conditions with personality-matched items and gear.
  - Category presets: `showcase_skins`, `showcase_props`, `showcase_pets`, `showcase_auras`, `showcase_trophies`.
  - Offline presets: `storm` (30 agents), `busy` (8 agents), `idle` (2 agents), `errors` (10 agents).

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
