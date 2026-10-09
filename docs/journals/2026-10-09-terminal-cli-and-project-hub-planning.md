# Technical Journal: Project Hub & Terminal Drawer Planning (v0.5.0)

**Date:** 2026-10-09  
**Scope:** Planning & Architectural Roadmap for AGMon v0.5.0  
**Topic:** Transition to Interactive Mission Control Hub (Terminal Drawer, Project Scripts, CLI & Worktree Awareness)  

## Context & Decision
Following an in-depth code audit of Orca ADE (`stablyai/orca`), we evaluated the cost and trade-offs of embedding direct terminal execution and project interaction within AGMon. We decided against rewriting AGMon as a heavyweight Electron IDE. Instead, we adopted an 80/20 pragmatic approach: keeping AGMon's lightweight Next.js + Pixi.js architecture while equipping it with interactive terminal and project execution capabilities.

## Key Outcomes
1. **Plan Initialized**: Created implementation plan [`plans/v0-5-0-terminal-cli-and-project-hub/plan.md`](file:///Volumes/T9/Projects/agent-factory/plans/v0-5-0-terminal-cli-and-project-hub/plan.md) via `ck plan create` with 4 phases:
   - **Phase 1**: [Native Terminal & Editor Handoff](file:///Volumes/T9/Projects/agent-factory/plans/v0-5-0-terminal-cli-and-project-hub/phase-01-native-terminal-editor-handoff.md) (1-click jump to Ghostty / iTerm / VS Code / Cursor).
   - **Phase 2**: [Web Terminal Drawer Engine](file:///Volumes/T9/Projects/agent-factory/plans/v0-5-0-terminal-cli-and-project-hub/phase-02-web-terminal-drawer-engine.md) (Slide-up `xterm.js` bottom drawer via WebSocket PTY).
   - **Phase 3**: [Project Scripts & Action Bar](file:///Volumes/T9/Projects/agent-factory/plans/v0-5-0-terminal-cli-and-project-hub/phase-03-project-scripts-action-bar.md) (Auto-detect `package.json` scripts + localhost port detection).
   - **Phase 4**: [CLI Expansion & Worktree Awareness](file:///Volumes/T9/Projects/agent-factory/plans/v0-5-0-terminal-cli-and-project-hub/phase-04-cli-expansion-worktree-awareness.md) (`agmon list/launch/kill` + Git worktree cluster grouping).
2. **Readiness**: Verified with `ck plan status`. Ready for phased execution via `/ck:cook`.
