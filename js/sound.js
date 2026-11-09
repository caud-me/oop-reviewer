// sound.js - Web Audio API sound synthesis engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCorrect(multiplier = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const pitchFactor = 1 + (multiplier - 1) * 0.12;
    [523.25 * pitchFactor, 659.25 * pitchFactor].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.26);
    });
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.2);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  playReveal() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.18);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  toggleMute() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isMuted() {
    return !this.enabled;
  }

  setMuted(muted) {
    this.enabled = !muted;
  }
}

if (typeof window !== 'undefined') {
  window.SoundEngine = SoundEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SoundEngine };
}
