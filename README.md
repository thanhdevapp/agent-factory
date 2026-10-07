# 🤖 Agent Factory

**Agent Factory** is a standalone, real-time AI Agent Office & Activity Visualizer. It watches local CLI coding agent logs (Antigravity CLI, Claude Code, Cursor, etc.) and visualizes active agent desks, tool badges, and token packet streams flowing to provider server pods in a rich 2.5D isometric view.

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

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3030](http://localhost:3030) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Graphics Engine**: Pixi.js v8
- **Styling**: Tailwind CSS v4
- **Streaming**: Server-Sent Events (SSE)

---

## 📄 License
MIT
