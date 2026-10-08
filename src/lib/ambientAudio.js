"use client";

/**
 * Web Audio Ambient Soundscape Generator
 * Generates procedural ambient audio (rain, lo-fi coffee shop) using the Web Audio API.
 * Zero external audio files, 100% offline, minimal CPU overhead.
 */

let audioCtx = null;
let masterGain = null;
let currentSourceNodes = [];
let ambientTimer = null;
let currentType = "none";

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Creates a pink noise buffer (repeating loop)
 */
function createPinkNoiseBuffer(ctx, duration = 4) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
    b6 = white * 0.115926;
  }
  return buffer;
}

/**
 * Starts gentle rain ambient audio
 */
function playRain(ctx) {
  const noiseBuffer = createPinkNoiseBuffer(ctx, 4);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Lowpass filter for soft rain timbre
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1100, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.7, ctx.currentTime);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noiseSource.start();
  currentSourceNodes.push(noiseSource, gain);

  // Intermittent raindrop accents
  const dropInterval = setInterval(() => {
    if (currentType !== "rain" || !audioCtx) return;
    try {
      const osc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(450 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      dropGain.gain.setValueAtTime(0.04 * Math.random(), now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(dropGain);
      dropGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }, 350);

  currentSourceNodes.push({ stop: () => clearInterval(dropInterval) });
}

/**
 * Starts Lo-Fi Coffee Shop ambient soundscape
 */
function playCoffeeShop(ctx) {
  const noiseBuffer = createPinkNoiseBuffer(ctx, 5);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Lowpass filter creates warm coffee shop background rumble
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(450, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noiseSource.start();
  currentSourceNodes.push(noiseSource, gain);

  // Subtle ceramic mug and utensil clinks
  const clinkInterval = setInterval(() => {
    if (currentType !== "coffee_shop" || !audioCtx) return;
    if (Math.random() < 0.45) {
      try {
        const osc = ctx.createOscillator();
        const clinkGain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(2200 + Math.random() * 800, now);

        clinkGain.gain.setValueAtTime(0.025, now);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        osc.connect(clinkGain);
        clinkGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.16);
      } catch {}
    }
  }, 2200);

  currentSourceNodes.push({ stop: () => clearInterval(clinkInterval) });
}

/**
 * Stops all active ambient sound sources
 */
export function stopAmbient() {
  currentType = "none";
  if (ambientTimer) {
    clearTimeout(ambientTimer);
    ambientTimer = null;
  }

  currentSourceNodes.forEach((node) => {
    try {
      if (typeof node.stop === "function") node.stop();
      if (typeof node.disconnect === "function") node.disconnect();
    } catch {}
  });
  currentSourceNodes = [];
}

/**
 * Adjusts ambient master volume (0.0 to 1.0)
 */
export function setAmbientVolume(vol) {
  const ctx = getAudioContext();
  if (ctx && masterGain) {
    const clamped = Math.max(0, Math.min(1, vol));
    masterGain.gain.setValueAtTime(clamped, ctx.currentTime);
  }
}

/**
 * Starts the specified ambient sound type
 */
export function startAmbient(type, volume = 0.35) {
  if (typeof window === "undefined") return;
  if (type === currentType && type !== "none") {
    setAmbientVolume(volume);
    return;
  }

  stopAmbient();
  if (!type || type === "none") return;

  const ctx = getAudioContext();
  if (!ctx) return;

  currentType = type;
  setAmbientVolume(volume);

  if (type === "rain") {
    playRain(ctx);
  } else if (type === "coffee_shop") {
    playCoffeeShop(ctx);
  }
}

/**
 * Automatically initializes ambient playback from supporter state
 */
export function initAmbientSync(supporterState) {
  if (!supporterState) return;
  if (supporterState.ambientSound && supporterState.ambientSound !== "none") {
    startAmbient(supporterState.ambientSound, supporterState.ambientVolume ?? 0.35);
  } else {
    stopAmbient();
  }
}
