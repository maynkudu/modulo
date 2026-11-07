import type { SoundEvent } from "../types";

const profiles = {
  emerge: { duration: 0.16, frequency: 1100, end: 170, gain: 0.07, type: "bandpass" },
  crawl: { duration: 0.22, frequency: 360, end: 650, gain: 0.035, type: "bandpass" },
  branch: { duration: 0.045, frequency: 2100, end: 500, gain: 0.045, type: "highpass" },
  whoosh: { duration: 0.65, frequency: 180, end: 3800, gain: 0.65, type: "bandpass" },
  impact: { duration: 1.4, frequency: 750, end: 45, gain: 0.7, type: "lowpass" },
  debris: { duration: 0.09, frequency: 680, end: 100, gain: 0.06, type: "bandpass" },
} satisfies Record<SoundEvent, { duration: number; frequency: number; end: number; gain: number; type: BiquadFilterType }>;

/** Original noise, filtered transients, and sub-bass. Audio failure never stops physics. */
export class SoundEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noise: AudioBuffer | null = null;
  private readonly voices = new Set<AudioScheduledSourceNode>();
  private readonly last = new Map<SoundEvent, number>();
  private drone: { low: OscillatorNode; high: OscillatorNode; gain: GainNode } | null = null;
  private disposed = false;
  private hidden = false;
  private enabled: boolean;
  private volume: number;

  constructor(enabled: boolean, volume: number) {
    this.enabled = enabled; this.volume = volume;
  }

  /** Call only inside a trusted pointerdown or keydown handler. */
  async unlock() {
    if (this.disposed || !this.enabled || this.hidden || typeof AudioContext === "undefined") return;
    try {
      if (!this.context) {
        const c = new AudioContext();
        this.context = c;
        this.master = c.createGain();
        this.master.gain.value = this.volume * 0.6;
        this.compressor = c.createDynamicsCompressor();
        this.compressor.threshold.value = -18;
        this.compressor.knee.value = 12;
        this.compressor.ratio.value = 8;
        this.master.connect(this.compressor);
        this.compressor.connect(c.destination);
        this.noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const samples = this.noise.getChannelData(0);
        let previous = 0;
        for (let i = 0; i < samples.length; i++) {
          previous = previous * 0.35 + (Math.random() * 2 - 1) * 0.65;
          samples[i] = previous;
        }
      }
      const c = this.context;
      if (c.state === "suspended") await c.resume();
      if (this.disposed || this.hidden || !this.enabled) this.stop();
    } catch { /* Browser audio is optional. */ }
  }

  setOptions(enabled: boolean, volume: number) {
    this.enabled = enabled; this.volume = Math.max(0, Math.min(1, volume));
    if (this.master && this.context && this.context.state !== "closed") {
      this.master.gain.setTargetAtTime(enabled ? this.volume * 0.6 : 0, this.context.currentTime, 0.015);
    }
    if (!enabled) this.stop();
  }

  play = (event: SoundEvent, pan = 0) => {
    const c = this.context, master = this.master;
    if (!c || !master || !this.noise || c.state !== "running" || !this.enabled || this.hidden || this.disposed) return;
    const now = c.currentTime;
    if (now - (this.last.get(event) ?? -Infinity) < (event === "branch" ? 0.1 : 0.07)) return;
    if (this.voices.size >= 10 && event !== "whoosh" && event !== "impact") return;
    this.last.set(event, now);
    const profile = profiles[event];
    const source = c.createBufferSource(), filter = c.createBiquadFilter();
    const gain = c.createGain(), spatial = c.createStereoPanner();
    source.buffer = this.noise;
    filter.type = profile.type;
    filter.Q.value = event === "whoosh" ? 0.65 : 1.4;
    filter.frequency.setValueAtTime(profile.frequency, now);
    filter.frequency.exponentialRampToValueAtTime(profile.end, now + profile.duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(profile.gain, now + (event === "whoosh" ? 0.12 : 0.008));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    spatial.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, pan)), now);
    if (event === "whoosh") spatial.pan.linearRampToValueAtTime(0, now + profile.duration);
    source.connect(filter); filter.connect(gain); gain.connect(spatial); spatial.connect(master);
    this.voices.add(source);
    source.onended = () => { this.voices.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); spatial.disconnect(); };
    source.start(now); source.stop(now + profile.duration + 0.01);
    if (event === "impact") this.bass(now);
  };

  private bass(now: number) {
    const c = this.context, master = this.master;
    if (!c || !master) return;
    const oscillator = c.createOscillator(), gain = c.createGain();
    oscillator.frequency.setValueAtTime(110, now);
    oscillator.frequency.exponentialRampToValueAtTime(29, now + 0.8);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.8, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    oscillator.connect(gain); gain.connect(master);
    this.voices.add(oscillator);
    oscillator.onended = () => { this.voices.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(now); oscillator.stop(now + 1.3);
  }

  setInfestation(amount: number) {
    const c = this.context, master = this.master;
    if (!c || !master || c.state !== "running" || !this.enabled || this.disposed || this.hidden) return;
    if (amount <= 0) {
      this.stopDrone();
      return;
    }
    if (!this.drone) {
      const low = c.createOscillator(), high = c.createOscillator(), gain = c.createGain();
      low.frequency.value = 37; high.frequency.value = 39.3;
      gain.gain.value = 0;
      low.connect(gain); high.connect(gain); gain.connect(master);
      low.start(); high.start();
      this.drone = { low, high, gain };
    }
    this.drone.gain.gain.setTargetAtTime(Math.min(0.1, amount * 0.1), c.currentTime, 0.5);
  }

  private stop() {
    for (const voice of this.voices) { try { voice.stop(); } catch { /* Already ended. */ } }
    this.voices.clear();
    this.stopDrone();
  }

  private stopDrone() {
    if (this.drone) {
      this.drone.low.stop(); this.drone.high.stop();
      this.drone.low.disconnect(); this.drone.high.disconnect(); this.drone.gain.disconnect();
      this.drone = null;
    }
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
    if (hidden) {
      this.stop();
      if (this.context?.state === "running") void this.context.suspend().catch(() => {});
    }
    // Resuming audio waits for a valid gesture again.
  }

  inspect() {
    return { state: this.context?.state ?? "locked", enabled: this.enabled, volume: this.volume, voices: this.voices.size, drone: Boolean(this.drone), disposed: this.disposed };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.master?.disconnect(); this.compressor?.disconnect();
    if (this.context) void this.context.close().catch(() => {});
    this.noise = null;
  }
}
