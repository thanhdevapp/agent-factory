---
title: "AGMon v0.2.0 - Sensory & Safety Update"
description: "Implementation plan for Milestone 1: 8-bit procedural sound FX, Runaway Loop detection, Live Terminal peek, and native desktop notifications."
status: pending
priority: P1
branch: "main"
tags: [sound, audio, safety, loop-detector, terminal-peek, notifications, v0.2.0]
blockedBy: []
blocks: []
created: "2026-10-07T10:07:40.286Z"
createdBy: "ck:plan"
source: skill
---

# AGMon v0.2.0 - Sensory & Safety Update

## Overview

Milestone 1 transforms AGMon from a passive visual observer into an active sensory and safety cockpit. It introduces a 0-byte procedural Web Audio chiptune synthesizer, real-time Runaway Loop detection with animated smoke and hazard alerts, a live terminal log stream drawer, and desktop push notifications.

## Architecture & Principles
- **0 Byte Audio Footprint:** Procedural Web Audio API sound synthesis (OscillatorNode, GainNode). No external audio assets.
- **Privacy & Safety First:** Zero credential access, local log reading only, user-controlled sound and notification permissions.
- **60 FPS Pixi.js Guarantee:** Particle pooling for hazard smoke, optimized bounding boxes.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Web Audio Synthesizer](./phase-01-web-audio-synthesizer.md) | Pending |
| 2 | [Runaway Loop Detector](./phase-02-runaway-loop-detector.md) | Pending |
| 3 | [Live Terminal Log Peek](./phase-03-live-terminal-log-peek.md) | Pending |
| 4 | [Desktop Notifications & Polish](./phase-04-desktop-notifications-polish.md) | Pending |

## Verification Criteria
- Sounds play smoothly without audio clipping or latency when enabled.
- Presets and live watchers trigger loop warnings accurately when tool repetition exceeds threshold.
- Live Terminal Peek renders log lines with syntax highlights.
- Prepack build keeps npm package size under 3.5MB.
