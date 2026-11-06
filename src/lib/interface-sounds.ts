"use client";

const preferenceKey = "modulo-sound";
const listeners = new Set<() => void>();
let preference: boolean | undefined;
let context: AudioContext | undefined;
const voices = new Set<OscillatorNode>();
let lastSlide = 0;

export const soundProfiles = {
  click: { frequency: 420, end: 210, duration: 0.045, gain: 0.055 },
  slide: { frequency: 280, end: 340, duration: 0.035, gain: 0.025 },
  toggle: { frequency: 320, end: 480, duration: 0.075, gain: 0.04 },
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
      if (!soundEnabled()) stopSounds();
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
}

export function setSoundEnabled(enabled: boolean) {
  preference = enabled;
  try { localStorage.setItem(preferenceKey, enabled ? "on" : "off"); }
  catch { /* The preference still lasts for this tab when storage is blocked. */ }
  if (!enabled) suspendSounds();
  for (const listener of listeners) listener();
}

/** Short, low-gain tones. Audio starts only after a user interaction. */
export function playSound(name: keyof typeof soundProfiles, position = 0.5) {
  if (!soundEnabled() || document.hidden || !window.AudioContext) return;
  if (name === "slide") {
    const now = performance.now();
    if (now - lastSlide < 90) return;
    lastSlide = now;
  }
  try { context ??= new AudioContext(); }
  catch { return; }
  const audio = context;
  const play = () => {
    if (!soundEnabled() || context !== audio || audio.state !== "running") return;
    const profile = soundProfiles[name];
    const pitch = 0.85 + Math.max(0, Math.min(1, position)) * 0.3;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(profile.frequency * pitch, now);
    oscillator.frequency.exponentialRampToValueAtTime(profile.end * pitch, now + profile.duration);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(profile.gain, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    voices.add(oscillator);
    oscillator.onended = () => {
      voices.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(now);
    oscillator.stop(now + profile.duration + 0.01);
  };
  if (audio.state === "running") play();
  else void audio.resume().then(play).catch(() => {});
}

export function suspendSounds() {
  stopSounds();
  if (context) void context.suspend().catch(() => {});
}

export function closeSounds() {
  stopSounds();
  if (context) void context.close().catch(() => {});
  context = undefined;
}
