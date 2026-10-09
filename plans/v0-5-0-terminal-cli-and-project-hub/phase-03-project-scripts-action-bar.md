---
phase: 3
title: "Project Scripts & Action Bar"
status: completed
priority: P2
dependencies:
  - 1
  - 2
---

<!-- Updated: Validation Session 1 - Unified output stream with BottomPanel Terminal tab or Pop out drawer, zero token overhead -->

# Phase 3: Project Scripts & Action Bar

## Overview
Turns project metadata into actionable 1-click execution buttons. AGMon inspects `package.json` scripts (`dev`, `test`, `build`, `lint`) of monitored repositories, allowing developers to trigger standard workflows and view live execution status directly from the 2D office.

## Requirements
- **Functional**:
  - Automatically parse `scripts` from the root `package.json` of active repositories.
  - Render a sleek Action Bar on the Department Header and Workstation details panel:
    - Standard shortcuts: `[▶ Run Dev]`, `[🧪 Run Test]`, `[📦 Run Build]`, `[🧹 Run Lint]`.
  - Clicking a script button streams execution into the active Terminal tab in `BottomPanel.jsx` (or floating drawer if popped out).
  - **Localhost Port Autodetect (Orca Pattern)**: Automatically detect `localhost:PORT` or `127.0.0.1:PORT` emitted by dev servers and display an "Open Web App" badge on the workstation desk.
- **Non-functional**:
  - Non-blocking execution; scripts run in isolated child processes or directly via PTY.
  - Open local execution without authentication token barriers.
  - Bounded output buffer: Keep only the last 200 lines of task logs to prevent browser memory leaks.

## Architecture & Implementation Steps

1. **Scripts Discovery Service (`src/lib/projectScripts.js`)**:
   - Reads `package.json` asynchronously when a project folder is watched.
   - Categorizes common scripts: dev, test, build, lint, format.

2. **Execution Controller (`/api/project/run-script`)**:
   - Spawns requested script with proper package manager (`pnpm`, `npm`, `yarn`, `bun`).
   - Streams output over Server-Sent Events (SSE) or sends command string directly to the active PTY instance.
   - Scans output chunks for URL regex `https?://(localhost|127\.0\.0\.1):[0-9]+` and publishes `PORT_ADVERTISED` event.

3. **Frontend Action Bar Component (`src/components/project/ProjectActionBar.jsx`)**:
   - Compact button group styled with Tailwind CSS and Lucide icons (`Play`, `FlaskConical`, `Package`, `CheckCheck`, `Globe`).
   - Shows spinner indicator while script is actively running.
   - Displays green checkmark or red alert icon on completion.

## Success Criteria
- [x] AGMon automatically lists all npm/pnpm scripts of the monitored repository.
- [x] Clicking `[▶ Run Dev]` starts the dev server and highlights the agent's desk.
- [x] When the dev server outputs `http://localhost:3000`, a clickable "Launch Preview" button appears within 500ms.
