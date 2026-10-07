// Procedural Web Audio API Sound Synthesizer for AGMon (0 Byte Asset Footprint)

let audioCtx = null;
let lastTickTime = 0;
const TICK_COOLDOWN_MS = 250; // max 4 ticks per second

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioMuted() {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("agmon_sound_enabled");
  // Default to false (muted) until user explicitly enables it
  return stored !== "true";
}

export function setAudioMuted(muted) {
  if (typeof window === "undefined") return;
  localStorage.setItem("agmon_sound_enabled", muted ? "false" : "true");
  if (!muted) {
    getAudioContext();
  }
}

export function toggleAudio() {
  const currentlyMuted = isAudioMuted();
  const nextMuted = !currentlyMuted;
  setAudioMuted(nextMuted);
  return !nextMuted;
}

/**
 * Short high-frequency subtle typing tick
 */
export function playTick() {
  if (isAudioMuted()) return;
  const now = Date.now();
  if (now - lastTickTime < TICK_COOLDOWN_MS) return;
  lastTickTime = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const t = ctx.currentTime;
    const freq = 900 + Math.random() * 400; // pitch variation

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.015);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.02);
  } catch {
    // ignore audio glitches
  }
}

/**
 * Cheerful retro chime when an agent task is completed
 */
export function playComplete() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    // Note 1: C5 (523.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, t);
    gain1.gain.setValueAtTime(0.08, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.16);

    // Note 2: G5 (783.99Hz) slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, t + 0.1);
    gain2.gain.setValueAtTime(0.1, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.36);
  } catch {
    // ignore
  }
}

/**
 * Warning alert pulse for rate limits, quota errors, or runaway loop
 */
export function playAlarm() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    [0, 0.12, 0.24].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(660, t + delay);
      osc.frequency.linearRampToValueAtTime(440, t + delay + 0.08);

      gain.gain.setValueAtTime(0.06, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.09);
    });
  } catch {
    // ignore
  }
}

/**
 * Friendly notification ping when agent needs approval or user input
 */
export function playNeedInput() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(587.33, t); // D5
    gain1.gain.setValueAtTime(0.07, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.13);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880.0, t + 0.08); // A5
    gain2.gain.setValueAtTime(0.08, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.26);
  } catch {
    // ignore
  }
}
