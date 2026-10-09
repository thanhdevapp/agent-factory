---
phase: 1
title: Native Terminal & Editor Handoff
status: completed
priority: P2
dependencies: []
---

<!-- Updated: Validation Session 1 - Corrected canvas file paths to src/components/factory/office-canvas.js & reinforced role as fallback target for in-browser PTY -->

# Phase 1: Native Terminal & Editor Handoff

## Overview
Provides a 1-click bridge from the AGMon 2D pixel office and session chat viewer to native developer tools (Ghostty, iTerm2, macOS Terminal, VS Code, Cursor), eliminating the manual friction of finding and navigating to agent working directories. Crucially, this native handoff also serves as the resilient fallback mechanism if in-browser PTY compilation is unavailable on the host machine.

## Requirements
- **Functional**:
  - Right-clicking or clicking an agent sprite / workstation displays a "Handoff" context menu.
  - Option to open the session's working directory in the user's preferred terminal (Ghostty, iTerm2, Alacritty, or system default).
  - Option to open the project / active file in VS Code or Cursor at the exact line number (`vscode://file/...#L...`).
  - SessionChatView header includes an "Open in Terminal" button for the active session.
- **Non-functional**:
  - Zero terminal lock-in; works with any terminal installed on macOS, Linux, or Windows.
  - Serves as the zero-dependency fallback for Phase 2 when `node-pty` is not compiled.
  - Graceful fallback with clipboard copy if native app fails to launch.
  - Open for local developer execution without restrictive token barriers.

## Architecture & Implementation Steps

1. **Backend Handoff Service (`src/app/api/handoff/route.js`)**:
   - Accepts payload: `{ path, target: 'terminal' | 'editor', app: 'ghostty' | 'iterm' | 'vscode' | 'cursor' }`.
   - Executes OS-specific command via `child_process.spawn`:
     - macOS Terminal: `open -a Ghostty "<path>"` or `open -a iTerm "<path>"`.
     - VS Code / Cursor: `open "vscode://file/<path>"` or `open "cursor://file/<path>"`.
     - Linux: `xdg-open` or `ghostty --working-directory="<path>"`.
     - Windows: `cmd.exe /c start ghostty ...` or `code "<path>"`.

2. **Frontend UI Integration**:
   - Update workstation popover / modal in `src/components/factory/AgentPanel.js`, `src/components/factory/office-canvas.js`, and `src/components/factory/scene/office-scene.js`.
   - Add icon buttons in `src/components/chat/SessionChatView.js`:
     - `Terminal` icon from `lucide-react` (Launch terminal).
     - `Code2` icon from `lucide-react` (Open in IDE).

## Success Criteria
- [ ] Clicking "Open in Ghostty" opens a new Ghostty window at the exact worktree / project directory.
- [ ] Clicking "Open in VS Code" navigates directly to the file and line number currently being edited.
- [ ] Works cleanly on macOS, Linux, and Windows without UI stalls.
- [ ] Readily callable from Phase 2 when in-browser terminal drawer requests native fallback.

