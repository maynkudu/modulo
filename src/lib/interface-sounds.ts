"use client";

const preferenceKey = "modulo-sound";
const listeners = new Set<() => void>();
let preference: boolean | undefined;
let context: AudioContext | undefined;
let output: AudioNode | undefined;
const voices = new Set<OscillatorNode>();
let lastSlide = 0;
let lastHover = 0;
let generation = 0;

export const soundProfiles = {
  click: { frequency: 420, end: 210, duration: 0.07, gain: 0.60, wave: "triangle" },
  slide: { frequency: 280, end: 340, duration: 0.055, gain: 0.36, wave: "triangle" },
  on: { frequency: 320, end: 560, duration: 0.105, gain: 0.54, wave: "triangle" },
  off: { frequency: 440, end: 220, duration: 0.105, gain: 0.54, wave: "triangle" },
  hover: { frequency: 700, end: 560, duration: 0.04, gain: 0.26, wave: "sine" },
} as const;

export function soundEnabled() {
  if (preference !== undefined) return preference;
  try { return localStorage.getItem(preferenceKey) !== "off"; }
  catch { return true; }
}

export function subscribeToSound(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === preferenceKey || event.key === null) {
      preference = undefined;
      if (!soundEnabled()) suspendSounds();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function stopSounds() {
  for (const voice of voices) voice.stop();
  voices.clear();
  if (typeof navigator.vibrate === "function") navigator.vibrate(0);
}

export function setSoundEnabled(enabled: boolean) {
  const version = ++generation;
  stopSounds();
  preference = enabled;
  try { localStorage.setItem(preferenceKey, enabled ? "on" : "off"); }
  catch { /* The preference still lasts for this tab when storage is blocked. */ }
  for (const listener of listeners) listener();
  // The mute button acknowledges its own off state before audio is suspended.
  if (enabled) vibrate("on");
  void playTone(enabled ? "on" : "off", 0.5, !enabled).finally(() => {
    if (!enabled && generation === version) suspendSounds();
  });
}

/** Hover feedback waits for the first gesture that unlocks browser audio. */
export function playSound(name: keyof typeof soundProfiles, position = 0.5) {
  if (!soundEnabled() || document.hidden || !window.AudioContext) return;
  if (name === "hover") {
    if (!context || performance.now() - lastHover < 90) return;
    lastHover = performance.now();
  }
  if (name === "slide") {
    const now = performance.now();
    if (now - lastSlide < 90) return;
    lastSlide = now;
  }
  vibrate(name);
  void playTone(name, position);
}

function vibrate(name: keyof typeof soundProfiles) {
  if (!soundEnabled() || document.hidden || typeof navigator.vibrate !== "function") return;
  const patterns = { click: 22, slide: 10, on: [20, 15, 35], off: 12, hover: 6 };
  navigator.vibrate(patterns[name]);
}

async function playTone(name: keyof typeof soundProfiles, position: number, muteConfirmation = false) {
  if (document.hidden || !window.AudioContext) return;
  const version = generation;
  try {
    if (!context) {
      context = new AudioContext();
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -4; compressor.ratio.value = 12;
      const limiter = context.createWaveShaper();
      const curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh((i / (curve.length - 1) * 2 - 1) * 1.3) * .95;
      limiter.curve = curve;
      compressor.connect(limiter); limiter.connect(context.destination); output = compressor;
    }
    const audio = context;
    if (audio.state !== "running") await audio.resume();
    if (generation !== version || context !== audio || audio.state !== "running" || (!soundEnabled() && !muteConfirmation)) return;
    if (!output || voices.size >= 12) return;
    const profile = soundProfiles[name];
    const pitch = 0.85 + Math.max(0, Math.min(1, position)) * 0.3;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = profile.wave;
    oscillator.frequency.setValueAtTime(profile.frequency * pitch, now);
    oscillator.frequency.exponentialRampToValueAtTime(profile.end * pitch, now + profile.duration);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(profile.gain, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    oscillator.connect(gain);
    gain.connect(output);
    voices.add(oscillator);
    await new Promise<void>((resolve) => {
      oscillator.onended = () => {
        voices.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
        resolve();
      };
      oscillator.start(now);
      oscillator.stop(now + profile.duration + 0.01);
    });
  } catch { /* Feedback remains optional when browser audio is unavailable. */ }
}

export function suspendSounds() {
  generation++;
  stopSounds();
  if (context) void context.suspend().catch(() => {});
}

export function closeSounds() {
  generation++;
  stopSounds();
  if (context) void context.close().catch(() => {});
  context = undefined;
  output = undefined;
}
