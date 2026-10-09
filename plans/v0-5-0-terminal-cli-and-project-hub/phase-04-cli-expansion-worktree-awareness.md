---
phase: 4
title: "CLI Expansion & Worktree Awareness"
status: completed
priority: P2
dependencies:
  - 1
  - 2
  - 3
---

<!-- Updated: Validation Session 1 - Aligned bin/cli.js daemon startup with server.js dual-mode entrypoint -->

# Phase 4: CLI Expansion & Worktree Awareness

## Overview
Expands the `agmon` terminal CLI (`bin/cli.js`) with practical developer commands (`list`, `launch`, `kill`, `watch`) and upgrades session watchers with Git worktree awareness, grouping parallel agents into unified departments in the 2D pixel office. Also ensures `bin/cli.js` launches the new `server.js` dual-mode server when running the daemon.

## Requirements
- **Functional**:
  - **CLI Expansion**:
    - `agmon list`: Prints a styled ASCII table of all running agent sessions, PIDs, models, tokens consumed, and elapsed runtime.
    - `agmon launch <claude|antigravity|codex> [prompt]`: Spawns a new coding agent in the current working directory and registers it immediately with AGMon.
    - `agmon kill <sessionId|pid>`: Gracefully terminates (or force kills) a hung agent process.
    - `agmon watch [path]`: Explicitly adds an external project directory to the active watch pool.
  - **Worktree-Aware Session Grouping**:
    - Watchers inspect the session path's `.git` entry.
    - If `.git` is a file containing `gitdir: <common_git_dir>/worktrees/<name>`, AGMon resolves the common repository root.
    - Agents running in different sibling worktrees are automatically aggregated into the same Department / Room in the 2D pixel office with distinct worktree branch tags.
- **Non-functional**:
  - CLI commands execute instantly (< 100ms) with zero impact on the running background daemon.
  - High resilience: Broken or pruned worktrees are gracefully cleaned up from memory without crashing watchers.

## Architecture & Implementation Steps

1. **CLI Commands Engine & Server Launcher (`bin/cli.js`)**:
   - Update `startDaemon` / `getNextBin` routines to run `server.js` instead of bare Next.js binary so WebSocket PTY server is co-hosted on port 3030.
   - Add argument parsers for `list`, `launch`, `kill`, `watch`.
   - Implement `agmon list` using standard Node.js console formatting and ANSI colors.
   - Implement `agmon launch` by invoking the target CLI binary (`claude`, `agy`, `codex`) via `spawn` with proper stdio piping.

2. **Worktree Resolution Logic (`src/lib/watchers/worktreeResolver.js`)**:
   - Helper function `resolveParentRepoRoot(directoryPath)`:
     - Check if `path.join(directoryPath, '.git')` exists.
     - If it is a directory $\rightarrow$ Standard repo root.
     - If it is a file $\rightarrow$ Read content, parse `gitdir: (.+)`. Traverse up to find the common repository root directory.
   - Update `claudeWatcher.js`, `antigravityWatcher.js`, and `codexWatcher.js` to assign `resolvedRepoPath` as the primary clustering key for floorplan grouping.

3. **Verification & Hardening**:
   - Run `npm run build` to verify Next.js bundle and TypeScript/JS validity.
   - Test launching 2 parallel agents in separate Git worktrees of the same repo and confirm they sit at adjacent desks in the 2D office.

## Success Criteria
- [x] Running `agmon list` in any terminal displays active sessions in a clean, readable table.
- [x] Two Claude Code instances running on different Git worktrees of the same repo are grouped together under one Department banner in AGMon.
- [x] Running `agmon kill <PID>` terminates the target process and clears the avatar from the canvas within 1 second.
