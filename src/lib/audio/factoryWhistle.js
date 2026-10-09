/**
 * AGMon AI Factory - Factory Whistle Celebration Sound
 * Synthesizes a nostalgic industrial factory steam horn celebrating git commits & tasks
 * 0 byte external audio files.
 */

class FactoryWhistle {
  constructor() {
    this.ctx = null;
    this.volume = 0.2;
    this.isMuted = false;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setMute(muted) {
    this.isMuted = Boolean(muted);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playWhistle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 1.1;

      // Two harmonic pipes: 440 Hz (A4) + 554.37 Hz (C#5) - Musical Major Third
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "sawtooth";

      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(554.37, now);

      // Lowpass filter for warm steam pipe acoustics
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);

      // Attack - Sustain - Release envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(this.volume, now + 0.15); // soft puff attack
      gain.gain.setValueAtTime(this.volume, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      // Ignored
    }
  }
}

export const factoryWhistle = new FactoryWhistle();
export default factoryWhistle;
