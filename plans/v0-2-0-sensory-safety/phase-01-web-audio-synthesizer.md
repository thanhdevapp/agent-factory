---
phase: 1
title: Web Audio Synthesizer
status: completed
effort: medium
---

# Phase 1: Web Audio Synthesizer

## Overview
Implement a 0-byte procedural Web Audio API sound synthesizer module `src/lib/soundFx.js` that generates 8-bit retro sound effects directly in code without requiring external audio asset files. Add header controls for mute/unmute with localStorage persistence.

## Touchpoints
- Create: `src/lib/soundFx.js`
- Modify: `src/app/page.js` (header sound toggle button)
- Modify: `src/lib/useFactoryTraces.js` (trigger sound cues on status/token changes)

## Implementation Steps
1. Create `src/lib/soundFx.js` with singleton AudioContext:
   - `playTick()`: High frequency short click (800Hz-1200Hz, 3ms duration, square/triangle wave) with random pitch jitter. Debounced at max 4 ticks/sec.
   - `playComplete()`: Cheerful two-tone chime (523Hz C5 -> 784Hz G5, smooth exponential decay, sine wave).
   - `playAlarm()`: Triple pulse alert (440Hz -> 880Hz alternating saw wave, 3 bursts of 80ms).
   - `playNeedInput()`: Gentle double ping (587Hz D5 -> 880Hz A5, bell tone).
   - `toggleMute()` / `isMuted()`: Audio enabled state persisted in `localStorage`.
2. Integrate into Header in `src/app/page.js`:
   - Speaker icon (🔊 unmuted, 🔇 muted).
   - Autoplay handling: resume `AudioContext` on first user click.
3. Hook into trace events in `src/lib/useFactoryTraces.js`:
   - Trigger `playTick()` on active streaming delta.
   - Trigger `playComplete()` when an agent transitions to `done` or `sleeping`.
   - Trigger `playAlarm()` on `rate_limit`, `quota`, `error`, or `runaway_loop`.

## Success Criteria
- [ ] Sound synthesizer produces 4 distinct audio cues using pure Web Audio API.
- [ ] 0 byte increase in package size (no mp3/wav files).
- [ ] Mute state persists across page refreshes.
- [ ] Autoplay policy warning does not block execution.
