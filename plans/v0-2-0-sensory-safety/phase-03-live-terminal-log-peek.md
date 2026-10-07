---
phase: 3
title: "Live Terminal Log Peek"
status: completed
effort: "medium"
---

# Phase 3: Live Terminal Log Peek

## Overview
Add a live terminal log stream drawer section to `AgentPanel.js`. When a user clicks on any agent desk, they can switch between the "Overview & Stats" view and the "Terminal Logs" view, showing real-time event logs, bash commands, modified files, and prompt snippets.

## Touchpoints
- Modify: `src/lib/watchers/antigravityWatcher.js` (extract recent event log entries)
- Modify: `src/lib/watchers/claudeWatcher.js` (extract recent message & tool call entries)
- Modify: `src/components/factory/AgentPanel.js` (add tabbed navigation and terminal log viewer)

## Implementation Steps
1. Enhance trace data shape in watchers:
   - Include `logs: Array<{ timestamp, type, summary, detail }>` (capped at 25 most recent items per workstation).
2. Enhance `AgentPanel.js`:
   - Add segmented control: `Overview` vs `Live Terminal`.
   - Terminal styling: Monospace font, dark console background (`#030712`), border glowing on selection.
   - Entry color-coding: `[BASH]` cyan, `[EDIT]` emerald, `[SEARCH]` purple, `[ERROR]` rose, `[PROMPT]` amber.
   - Auto-scroll button to lock viewport to newest logs.

## Success Criteria
- [ ] Clicking any workstation desk allows viewing the last 25 real-time actions.
- [ ] Formatted with timestamps, tool badges, and clean monospaced layout.
- [ ] Auto-scroll smoothly follows new incoming SSE trace events.
