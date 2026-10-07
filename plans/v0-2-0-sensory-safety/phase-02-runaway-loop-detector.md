---
phase: 2
title: "Runaway Loop Detector"
status: pending
effort: "medium"
---

# Phase 2: Runaway Loop Detector

## Overview
Detect runaway AI agent loops (e.g., repeatedly calling failed test commands or editing files circularly >= 5 times without progress). Visualize looping workstations in PixiJS with pulsing red borders, animated smoke puffs, dizzy spiral eyes, and sound alarms.

## Touchpoints
- Modify: `src/lib/watchers/antigravityWatcher.js` and `src/lib/watchers/claudeWatcher.js` (track tool history)
- Modify: `src/lib/traceContract.js` (add `isLooping` flag)
- Modify: `src/components/factory/scene/characters.js` (smoke particle container & dizzy eyes)
- Modify: `src/components/factory/scene/office-layout.js` (desk hazard styling)
- Modify: `src/lib/mockTraces.js` (include looping workstation in `errors` preset)

## Implementation Steps
1. Add sliding window tool tracker in watchers:
   - Keep last 10 tool invocations per session with timestamps.
   - If >= 5 consecutive calls have identical tool name within 60s, flag `isLooping: true`.
2. Add PixiJS visual effects for looping state:
   - Desk hazard border: pulsating red-orange outline (`#f43f5e`).
   - Smoke emitter in `characters.js`: 4-5 semi-transparent grey circles floating upward with randomized scale and alpha decay.
   - Robot expression: Spiral eyes (`@_@`) and wobbling head offset.
3. Test with mock preset:
   - Enhance `errors` preset in `mockTraces.js` to demonstrate looping agent desk.

## Success Criteria
- [ ] Runaway loops correctly detected when tool repetitions reach threshold.
- [ ] PixiJS scene renders animated smoke and red pulsing desk border without FPS drops.
- [ ] Works in both live watchers and mock presets.
