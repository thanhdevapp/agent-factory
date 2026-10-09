# Technical Journal: Orca ADE Deep Dive & Competitive Analysis

**Date:** 2026-10-09  
**Scope:** Architectural Analysis & Competitive Positioning for AGMon  
**Topic:** Orca ADE ([onorca.dev](https://www.onorca.dev)) vs AGMon ([agent-factory](file:///Volumes/T9/Projects/agent-factory))  

## Context & Decision
A deep dive was conducted into Orca ADE by Stably (YC-backed), an open-source Agent Development Environment designed to orchestrate fleets of parallel AI coding agents (Claude Code, OpenAI Codex, Gemini CLI) across isolated Git worktrees with terminal multiplexing (xterm.js/node-pty) and an embedded Chromium vision loop.

We analyzed the structural differences between Orca's active execution engine model and AGMon's passive ambient visualizer model. We reaffirmed AGMon's adherence to YAGNI and KISS: AGMon will **not** attempt to become an IDE or active process manager. Instead, it maintains its unique position as a lightweight, zero-config, ambient multi-agent HUD and sensory visualizer that can operate as a complementary companion to tools like Orca.

## Key Outcomes
1. **Design Document Completed**: Authored and finalized [`docs/brainstorm/2026-10-09-orca-ade-deepdive.md`](file:///Volumes/T9/Projects/agent-factory/docs/brainstorm/2026-10-09-orca-ade-deepdive.md).
2. **Architectural Opportunities Identified**:
   - **Worktree-Aware Session Grouping**: Detecting Git worktree pointers (`gitdir`) in session directories to aggregate parallel agents working on the same parent repository into cohesive departments in the 2D pixel office.
   - **Fine-Grained Agent Sprite States**: Enriching avatar animation triggers for test runs, approval waits, and errors.
   - **Floating Mini-HUD / PiP View**: Designing a compact companion strip for single-monitor workflows alongside Orca or Cursor.
3. **Session Conclusion**: Session concluded with report archived for future milestone planning.
