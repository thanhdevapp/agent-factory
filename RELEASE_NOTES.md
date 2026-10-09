# AGMon Release Notes

## v0.2.4 - Interactive Project Hub, Terminal Drawer, CLI Management & AI Factory Gamification

### Overview
A landmark release transforming AGMon from a pure monitoring viewer into a full-fledged, interactive Mission Control center and developer CLI for AI coding agents.

---

### Highlights & Key Features

1. **Interactive Mission Control & Orca-Grade WebGL Web Terminal**:
   - **Global Hotkey**: Press `Cmd+J` or `` ` `` to open the terminal drawer from anywhere in the application.
   - **Dual Placement**: Docked directly inside the bottom workbench panel or popped out into a floating, multi-tab drawer.
   - **Hardware GPU Acceleration**: High-throughput log streaming (60-120 FPS) powered by `@xterm/addon-webgl`.
   - **Session Buffer Persistence**: Terminal buffer and scrollback history persist across browser reloads.
   - **In-Terminal Search & Links**: Real-time buffer search (`Ctrl+F`), clickable web links (`http://localhost:PORT`), and Windows ConPTY support.

2. **Dual-Mode Developer CLI & Process Management**:
   - `agmon list`: ASCII status table displaying all active agent sessions across Antigravity, Claude Code, and Codex CLI with PIDs, working directories, and active tool calls.
   - `agmon launch <agent> [prompt]`: Launch any coding agent (`antigravity`, `claude`, `codex`) directly from your terminal.
   - `agmon kill <pid>`: Terminate runaway or stuck agent processes safely.
   - `agmon watch <dir>`: Add custom project directories to the active watch pool.
   - **Background Daemon**: Manage background services via `agmon start`, `agmon stop`, `agmon status`, and system boot autostart (`agmon autostart enable`).

3. **Project Scripts Action Bar & Localhost Port Autodetection**:
   - Auto-discovers `package.json` scripts (`dev`, `test`, `build`, `lint`) with 1-click execution.
   - Live Server-Sent Events (SSE) streaming output with bounded 200-line memory buffer.
   - **Port Sniffing**: Automatically detects server ports (e.g. `http://localhost:3000`) and displays clickable `:PORT` / "Open Web App" badges directly on the 2D office desk and sidebar.

4. **1-Click Native Terminal & Editor Handoff**:
   - Jump directly from any active agent workstation or chat turn into **Ghostty**, **iTerm2**, **Terminal.app**, **VS Code**, or **Cursor** with path synchronization.

5. **Git Worktree-Aware Multi-Agent Grouping**:
   - Automatically identifies parallel Git worktrees (`.git` worktrees pointer) and groups sibling worktree agents under the same Department in the 2D office.

6. **AI Factory Gamification, Soundboard & Cosmetics Store**:
   - **Worker Progression**: Experience points (XP) and progression levels for active AI coding agents based on completed tasks and tool usage.
   - **Procedural Mechanical Keyboard Audio**: Zero-asset soundboard built with the Web Audio API providing realistic keyclick profiles (Blue, Brown, Red switches) during token streaming.
   - **Cosmetics Store**: 1,000+ cosmetic items (Agent 3D Skins, Tech Desk Props, Animated Pets, Particle Auras, Obsidian Pedestal Trophies).

7. **Automated Release Pipeline**:
   - Added `npm run publish` command combining patch increment, optimized Turbopack build, npmjs public publishing, and Git tag synchronization.

8. **Open Source & License**:
   - Public GitHub repository release licensed under the MIT License.

---

## Version: Mock Showcase & 1,000 3D Cosmetic Items System

### Overview
This release introduces a complete, high-fidelity mock showcase architecture for evaluating all **1,010 cosmetic items** and **24 visual archetypes** across 6 categories (Agent 3D Skins, Tech Desk Props, Pets & Companions, Particle Auras, Trophies & Badges, Office Themes).

---

### Highlights & Key Features

1. **All Items Mock Showcase (24 Workstations)**:
   - Added `preset=showcase` featuring 24 distinct workstations.
   - 100% coverage of all 24 visual archetypes rendering simultaneously in PixiJS.
   - Covers all 6 agent motion modes: `streaming` (typing), `happy` (celebrating), `pending` (thinking), `sleeping` (dozing off), `error` (shaking/smoke), `looping` (dizzy loop).
   - Instant 1-click access via the **"Items Showcase"** button on the TitleBar.

2. **Dedicated Category-Specific Mock Presets**:
   - `showcase_skins` (15 agents): Compares all 5 skin archetypes across 3 colorways.
   - `showcase_props` (14 workstations): Demonstrates all 7 tech desk props in single and paired setups.
   - `showcase_pets` (12 desks): Shows all 4 animated companion pets.
   - `showcase_auras` (12 agents): Radiates all 4 particle aura effects.
   - `showcase_trophies` (12 desks): Displays all 4 3D trophy models on obsidian pedestals.
   - `cases` (17 cases): Enriched edge-case deck with personality-matched items.

3. **Per-Workstation Cosmetic Transmission & Multi-Slot Equipment**:
   - Enhanced `office-layout.js` to preserve `skin`, `aura`, `pet`, `props`, and `trophy` per trace.
   - Enhanced `office-scene.js` so desks and characters render individual item gear with seamless fallback to supporter equipment.
   - Signature cache tracking prevents single-frame flickers on telemetry refreshes.

4. **Active Gear Inspector Card**:
   - Added **"EQUIPPED COSMETICS"** card to the RightSidebar Inspector.
   - Displays real-time details when clicking any workstation: Chassis Skin, Particle Aura, Tech Desk Props, Companion Pet, and Desk Trophy with color dots and archetype badges.

5. **Visual Gallery Showcase**:
   - High-resolution visual gallery available at `public/screenshots/gallery.html`.
   - Direct links to launch each preset directly on the local canvas.

6. **Comprehensive Test Suites (178/178 Passed)**:
   - `scripts/test-all-mock-items.js`: 22/22 passed.
   - `scripts/deep-test-catalog.js`: 74/74 passed.
   - `scripts/deep-test-store-state.js`: 82/82 passed.
