# Implementation Journal: AGMon v0.5.0 Interactive Mission Control & Project Hub

- **Date:** 2026-10-09
- **Status:** Complete (Phases 1-4)
- **Author:** Antigravity AI Engine
- **Target Plan:** `plans/v0-5-0-terminal-cli-and-project-hub/plan.md`

---

## 1. Executive Summary

AGMon has transitioned from a passive telemetry visualizer into an **Interactive Developer Mission Control Hub**. While developers watch AI agents work across 2D pixel desks, they can now intervene directly without context-switching:
1. **1-Click Native Handoff**: Jump directly from any agent sprite or workstation to Ghostty, iTerm2, Terminal.app, VS Code, or Cursor.
2. **Orca-Grade Web Terminal Drawer**: Built on `xterm.js` + `@xterm/addon-webgl` GPU acceleration, with dual docked tab & slide-up floating drawer modes, session buffer persistence, search, clickable localhost URLs, DEC 2026 burst throttle, and ConPTY support on Windows.
3. **Project Scripts & Action Bar**: Auto-discovers `package.json` scripts (`dev`, `test`, `build`, `lint`) with live SSE streaming output and **Localhost Port Autodetection** (prominent clickable `localhost:PORT` badges on desks and sidebars).
4. **CLI Expansion & Worktree Awareness**: Rich terminal commands (`agmon list`, `agmon launch`, `agmon kill`, `agmon watch`), coupled with Git worktree resolver logic that clusters sibling worktrees under the same department.

---

## 2. Architecture & Key Additions

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AGMon Web UI & Workbench                        │
│                                                                        │
│   ┌──────────────────────────┐      ┌──────────────────────────────┐   │
│   │ 2D Office Canvas         │      │ Secondary Right Sidebar      │   │
│   │ • Desks with Port Badges │      │ • Developer Handoff Card     │   │
│   │ • Worktree Branch Labels │      │ • Project Scripts Action Bar │   │
│   └────────────┬─────────────┘      └──────────────┬───────────────┘   │
│                │                                   │                   │
│   ┌────────────┴─────────────┐      ┌──────────────┴───────────────┐   │
│   │ Bottom Panel (Docked)    │◄────►│ Floating Terminal Drawer     │   │
│   │ • "Terminal" Tab (xterm) │Pop-out│ • Multi-tab WebGL Terminal   │   │
│   └────────────┬─────────────┘      └──────────────┬───────────────┘   │
└────────────────┼───────────────────────────────────┼───────────────────┘
                 │ WebSocket Stream (/api/pty)       │
┌────────────────▼───────────────────────────────────▼───────────────────┐
│              Dual-Mode Server (server.js / Companion Port)             │
│  • Next.js App Router Handler                                          │
│  • WebSocket PTY Bridge (node-pty dynamic import + DEC 2026 throttle)  │
│  • Git Worktree Resolver (groups parallel worktrees by repo root)      │
│  • Project Script Runner (SSE streaming with localhost port scanner)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Phase Breakdown & Deliverables

### Phase 1: Native Terminal & Editor Handoff
- **Backend Route:** [`src/app/api/handoff/route.js`](file:///Volumes/T9/Projects/agent-factory/src/app/api/handoff/route.js)
  - Spawns target apps via `open -a <App> <path>` on macOS, `start` on Windows, and `xdg-open` on Linux.
  - Supports preferred apps: Ghostty, iTerm2, Terminal.app, VS Code, Cursor.
- **Client Helper:** [`src/lib/handoffClient.js`](file:///Volumes/T9/Projects/agent-factory/src/lib/handoffClient.js)
  - Triggers HTTP handoff with clipboard fallback and toast feedback.
- **UI Integrations:**
  - [`src/components/chat/SessionChatView.js`](file:///Volumes/T9/Projects/agent-factory/src/components/chat/SessionChatView.js): Handoff buttons in header & modal.
  - [`src/components/factory/AgentPanel.js`](file:///Volumes/T9/Projects/agent-factory/src/components/factory/AgentPanel.js): 1-click actions on workstation inspect.
  - [`src/components/layout/RightSidebar.jsx`](file:///Volumes/T9/Projects/agent-factory/src/components/layout/RightSidebar.jsx): Developer Handoff card in Inspector tab.

### Phase 2: Web Terminal Drawer Engine
- **PTY Server:** [`src/lib/ptyServer.js`](file:///Volumes/T9/Projects/agent-factory/src/lib/ptyServer.js)
  - Dynamically imports `node-pty`. If missing native compilation tools, emits `PTY_UNAVAILABLE` event for graceful fallback to Phase 1 Native Handoff.
  - Coalesces burst terminal writes at 60 FPS using DEC 2026 synchronized output pattern.
  - Configures `useConpty: true` on Windows platforms.
- **Dual-Mode Server:** [`server.js`](file:///Volumes/T9/Projects/agent-factory/server.js)
  - Combined Next.js + WebSocket server on port 3030; companion port 3031 for `next dev`.
- **Frontend Components:**
  - [`src/components/terminal/XTermTerminal.jsx`](file:///Volumes/T9/Projects/agent-factory/src/components/terminal/XTermTerminal.jsx): GPU WebGL rendering, session buffer persistence, search addon (`Ctrl+F`), web-links addon, unicode11 support.
  - [`src/components/terminal/TerminalDrawer.jsx`](file:///Volumes/T9/Projects/agent-factory/src/components/terminal/TerminalDrawer.jsx): Multi-tab floating drawer with drag-resize and pop-in docking.
  - [`src/components/layout/BottomPanel.jsx`](file:///Volumes/T9/Projects/agent-factory/src/components/layout/BottomPanel.jsx): Embedded "Terminal" tab with "Pop Out" action.
  - [`src/components/layout/VSCodeWorkbench.jsx`](file:///Volumes/T9/Projects/agent-factory/src/components/layout/VSCodeWorkbench.jsx): Integrated global shortcut `Cmd+J` / `` ` ``.

### Phase 3: Project Scripts & Action Bar
- **Script Discovery:** [`src/lib/projectScripts.js`](file:///Volumes/T9/Projects/agent-factory/src/lib/projectScripts.js)
  - Detects package managers (`pnpm`, `bun`, `yarn`, `npm`) and categorizes standard scripts (`dev`, `test`, `build`, `lint`).
- **Endpoints:**
  - `GET /api/project/scripts?path=...`
  - `POST /api/project/run-script`: SSE streaming with port detection regex and bounded 200-line memory buffer.
- **Action Bar Component:** [`src/components/project/ProjectActionBar.jsx`](file:///Volumes/T9/Projects/agent-factory/src/components/project/ProjectActionBar.jsx)
  - Rendered in Right Sidebar, Agent Details Panel, and Workstations.
  - Displays prominent clickable `localhost:PORT` badges when dev servers output URLs.
- **Desk Rendering:**
  - [`src/components/factory/scene/characters.js`](file:///Volumes/T9/Projects/agent-factory/src/components/factory/scene/characters.js) draws a cyan `:PORT` badge on agent desks when a web server is active.

### Phase 4: CLI Expansion & Worktree Awareness
- **CLI Upgrades:** [`bin/cli.js`](file:///Volumes/T9/Projects/agent-factory/bin/cli.js)
  - `agmon list`: Styled ASCII table of active sessions, models, tokens, and workspaces.
  - `agmon launch <agent> [args]`: Spawns Claude, Antigravity, or Codex agents.
  - `agmon kill <PID>`: Graceful SIGTERM with SIGKILL fallback.
  - `agmon watch [path]`: Adds directories to watch pool.
  - Updated `startDaemon` and `runForeground` to mount `server.js`.
- **Worktree Resolver:** [`src/lib/watchers/worktreeResolver.js`](file:///Volumes/T9/Projects/agent-factory/src/lib/watchers/worktreeResolver.js)
  - Resolves `.git` files with `gitdir: <common>/.git/worktrees/<name>` to cluster sibling worktrees into the same Department in the 2D office.
  - Integrated into `claudeWatcher.js`, `antigravityWatcher.js`, and `codexWatcher.js`.

---

## 4. Verification Results

1. **Production Build**:
   - `npm run build` completed with code `0`.
   - All serverless and dynamic routes (`/api/handoff`, `/api/project/scripts`, `/api/project/run-script`, etc.) compiled without errors.
2. **CLI Test**:
   - `node bin/cli.js --help` exited with code `0`.
   - `node bin/cli.js list` successfully connected to AGMon and formatted 62 active agent sessions in an ASCII table.
3. **UI Rules Compliance**:
   - Strict adherence to rule: zero raw unicode emojis in UI/code. All indicators use `lucide-react` icons.
   - Stable composite React keys and bounded buffers (max 200 lines for scripts, 5000 lines for terminal scrollback).
