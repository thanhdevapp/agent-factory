/**
 * AGMon AI Factory - Mechanical Keyboard Web Audio Synthesizer
 * Synthesizes realistic mechanical key clicks with 0 external sound files (0 byte payload)
 * Supports Cherry MX Blue, Topre, and IBM Model M profiles.
 */

class MechanicalKeyboardSynth {
  constructor() {
    this.ctx = null;
    this.currentSwitch = "cherry-blue"; // 'cherry-blue' | 'topre' | 'ibm-model-m'
    this.volume = 0.25;
    this.isMuted = false;
    this.burstTimeout = null;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setMute(muted) {
    this.isMuted = Boolean(muted);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setSwitch(switchId) {
    if (["cherry-blue", "topre", "ibm-model-m"].includes(switchId)) {
      this.currentSwitch = switchId;
    }
  }

  /**
   * Generates a single parametric mechanical switch click
   */
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      let baseFreq = 3100;
      let duration = 0.035;
      let filterFreq = 4000;

      if (this.currentSwitch === "topre") {
        baseFreq = 650;
        duration = 0.055;
        filterFreq = 1200;
        filter.type = "lowpass";
      } else if (this.currentSwitch === "ibm-model-m") {
        baseFreq = 1750;
        duration = 0.045;
        filterFreq = 2500;
        filter.type = "bandpass";
      } else {
        // Cherry MX Blue: crisp high snap
        baseFreq = 3200;
        duration = 0.035;
        filterFreq = 5000;
        filter.type = "highpass";
      }

      // Slight pitch variation (human finger pressure simulation)
      const pitchJitter = (Math.random() - 0.5) * 220;
      osc.frequency.setValueAtTime(baseFreq + pitchJitter, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + duration);

      filter.frequency.setValueAtTime(filterFreq, now);

      gain.gain.setValueAtTime(this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // AudioContext state or autoplay policy block
    }
  }

  /**
   * Plays a rhythmic burst of key clicks proportional to token stream speed
   */
  playBurst(tokens = 1, durationMs = 200) {
    if (this.isMuted) return;
    const clicks = Math.min(8, Math.max(1, Math.round(tokens / 15)));
    const interval = Math.max(25, Math.floor(durationMs / clicks));

    for (let i = 0; i < clicks; i++) {
      setTimeout(() => {
        this.playClick();
      }, i * interval + Math.random() * 15);
    }
  }
}

export const keyboardSynth = new MechanicalKeyboardSynth();
export default keyboardSynth;
