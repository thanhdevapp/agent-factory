---
phase: 2
title: Web Terminal Drawer Engine
status: completed
priority: P2
dependencies:
  - 1
---

<!-- Updated: Validation Session 1 - Dual-mode Server (port 3030 / companion 3031), dual placement (BottomPanel tab + Pop out floating drawer), dynamic node-pty import with Native Handoff fallback -->
<!-- Updated: Orca Terminal Gems - WebGL GPU rendering, DEC 2026 output throttle, session buffer persistence, Unicode11 & WebLinks addons, Windows ConPTY -->

# Phase 2: Web Terminal Drawer Engine

## Overview
Integrates an in-app terminal engine powered by `xterm.js` and a WebSocket PTY bridge, incorporating high-performance engineering patterns extracted from Orca ADE. Features dual placement: docked as a native tab in `BottomPanel.jsx` (VS Code layout) by default, with a 1-click "Pop out" into a floating slide-up `TerminalDrawer.jsx` when wide workspace is needed. Includes zero-friction dynamic import with fallback to Phase 1 Native Handoff.

## Requirements
- **Functional**:
  - **Dual Placement**:
    - Embedded as a "Terminal" tab in `src/components/layout/BottomPanel.jsx`.
    - "Pop out" button on panel header pops the terminal out into an independent slide-up floating drawer (`src/components/terminal/TerminalDrawer.jsx`).
  - Global hotkey `` ` `` (backtick) or `Cmd+J` / `Ctrl+J` toggles the terminal panel/drawer and focuses input.
  - Spawns shell with current working directory of active project or agent worktree.
  - Full ANSI terminal capabilities (color output, keyboard navigation, tab completion, escape sequences, `Ctrl+C`).
  - Multi-tab terminal management scoped to different project directories.
  - **Orca Terminal Gems**:
    - **In-terminal Search**: Built-in `Ctrl+F` search within the terminal buffer (`@xterm/addon-search`).
    - **Clickable Web Links**: Interactive URL links (`http://localhost:PORT`) with hover tooltip preview (`@xterm/addon-web-links`).
    - **Full Unicode & Box-Drawing**: Accurate character widths for TUIs (`htop`, `lazygit`, Asian scripts) via `@xterm/addon-unicode11`.
- **Non-functional**:
  - **GPU WebGL Acceleration (Orca Pattern)**: Texture atlas rendering via `@xterm/addon-webgl` for 60-120 FPS high-throughput log streams without freezing the UI (with graceful fallback to canvas renderer).
  - **DEC 2026 Synchronized Output Throttle**: Frame-batched flushes for massive burst streams (`npm install`, large builds) to prevent DOM lockup.
  - **Session Buffer Persistence (Orca Pattern)**: Caches recent scrollback chunks so switching tabs or refreshing the browser preserves running terminal screens without blanking out.
  - **Windows ConPTY Compatibility**: Auto-detects Windows and passes `useConpty: true` to prevent UTF-8 and ANSI corruption on Windows 10/11.
  - **Dynamic PTY Import & Portability**: Dynamically imports `node-pty`. If native build is absent, frontend displays a helpful banner offering 1-click fallback to Phase 1 Native Handoff (Ghostty/VS Code) instead of crashing.
  - **Dual-mode Server**: `server.js` hosts both Next.js and WebSocket on port 3030 for production/daemon, with companion port (3031) fallback for `next dev`.
  - **Resilient Connection**: Auto-reconnects if WebSocket drops; cleans up PTY child process on close.
  - **Zero Auth Friction**: Operates locally without requiring token authentication.

## Architecture & Implementation Steps

1. **Dual-Mode Server & PTY Layer (`server.js` & `src/lib/ptyServer.js`)**:
   - `server.js`: Wraps Next.js request handler with an HTTP server and binds `ws` WebSocket server on the same port (default 3030) or companion port 3031 in dev mode.
   - `src/lib/ptyServer.js`:
     - Dynamically imports `node-pty`. If unavailable, handles WebSocket connection by sending a graceful `PTY_UNAVAILABLE` event.
     - When available, spawns `$SHELL` (or `/bin/zsh`, `/bin/bash`, `powershell.exe`) with `cwd` set to requested project path, enabling `useConpty: true` on Windows.
     - Implements DEC 2026 synchronized output batching (frame coalescing) to prevent UI thread lockup.
     - Pipes bidirectional data between WebSocket frames and PTY master fd.

2. **Frontend UI Integration**:
   - **Docked Tab (`src/components/layout/BottomPanel.jsx`)**:
     - Adds `{ id: "terminal", label: "Terminal", icon: Terminal }` to BottomPanel tabs.
     - Embeds `XTermTerminal` instance directly into the panel body.
     - Adds a "Pop Out" button in the right-side panel controls.
   - **Floating Drawer (`src/components/terminal/TerminalDrawer.jsx`) & Docked Instance**:
     - Built on `@xterm/xterm`, `@xterm/addon-fit`, `@xterm/addon-webgl`, `@xterm/addon-search`, `@xterm/addon-unicode11`, and `@xterm/addon-web-links`.
     - Standalone slide-up container with full resize and drag support.
     - Controls: Pop in (dock back to BottomPanel), Maximize/Restore, Clear, New Tab, Close.
   - **Session Buffer Restoration**: Restores previous terminal scrollback from session storage upon remounting or page reload.
   - **Fallback Banner**: When `PTY_UNAVAILABLE` is received, renders an actionable prompt: *"In-browser terminal requires native build tools. Click to open in Ghostty / VS Code (Native Handoff)."*

## Success Criteria
- [x] Pressing `Cmd+J` opens the BottomPanel Terminal tab (or restores floating drawer) within 200ms.
- [x] Clicking "Pop Out" smoothly detaches the terminal into a full-width floating drawer.
- [x] High-output commands (`find /`, `npm i`) render smoothly at 60 FPS via WebGL without freezing the browser canvas.
- [x] Interactive terminal commands (`git status`, `ls -la`, `pnpm test`, `htop`) render with proper colors and dimensions.
- [x] Refreshing the browser or switching between tabs does not erase running terminal history.
- [x] On systems lacking C++ compiler for `node-pty`, AGMon remains 100% operational and guides user to Phase 1 Native Handoff.


