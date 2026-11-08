"use client";

import { useSyncExternalStore } from "react";

const preferenceKey = "modulo-sound";
const volumeKey = "modulo-volume";
const listeners = new Set<() => void>();
const defaultSettings = { enabled: true, volume: 1 };
let settings: typeof defaultSettings | undefined;
let context: AudioContext | undefined;
let master: GainNode | undefined;
const voices = new Set<OscillatorNode>();
let lastSlide = 0;
let lastHover = 0;
let generation = 0;
let hapticsActive = false;

export const soundProfiles = {
  click: [{ frequency: 800, duration: .02, gain: .90, delay: 0 }],
  slide: [{ frequency: 1100, duration: .013, gain: .54, delay: 0 }],
  hover: [{ frequency: 1300, duration: .014, gain: .36, delay: 0 }],
  on: [{ frequency: 880, duration: .026, gain: .72, delay: 0 }, { frequency: 1320, duration: .026, gain: .63, delay: .03 }],
  off: [{ frequency: 1320, duration: .026, gain: .72, delay: 0 }, { frequency: 880, duration: .026, gain: .63, delay: .03 }],
  copy: [{ frequency: 1000, duration: .016, gain: .72, delay: 0 }, { frequency: 1200, duration: .016, gain: .63, delay: .035 }],
};

export function getSoundSettings() {
  if (settings) return settings;
  try {
    const storedVolume = localStorage.getItem(volumeKey);
    const volume = storedVolume === null ? 1 : Number(storedVolume);
    settings = { enabled: localStorage.getItem(preferenceKey) !== "off", volume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1 };
  } catch { settings = defaultSettings; }
  return settings;
}

const serverSettings = () => defaultSettings;

export function useSoundSettings() {
  return useSyncExternalStore(subscribeToSound, getSoundSettings, serverSettings);
}

function applySettings() {
  const current = getSoundSettings();
  if (master && context) master.gain.setValueAtTime(current.enabled ? current.volume : 0, context.currentTime);
  if (!current.enabled || current.volume === 0) suspendSounds();
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === preferenceKey || event.key === volumeKey || event.key === null) {
    settings = undefined;
    applySettings();
  }
}

function subscribeToSound(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function setSoundEnabled(enabled: boolean) {
  settings = { ...getSoundSettings(), enabled };
  try { localStorage.setItem(preferenceKey, enabled ? "on" : "off"); }
  catch { /* Settings remain available in this tab when storage is blocked. */ }
  applySettings();
  if (enabled) playSound("on");
}

export function setSoundVolume(value: number) {
  if (!Number.isFinite(value)) return;
  const volume = Math.max(0, Math.min(1, value));
  settings = { ...getSoundSettings(), volume };
  try { localStorage.setItem(volumeKey, String(volume)); }
  catch { /* Settings remain available in this tab when storage is blocked. */ }
  applySettings();
}

export function stopSounds() {
  generation++;
  for (const voice of voices) {
    try { voice.stop(); } catch { /* A voice may already have ended. */ }
  }
  voices.clear();
  if (hapticsActive && typeof navigator.vibrate === "function") navigator.vibrate(0);
  hapticsActive = false;
}

/** Hover feedback waits for the first gesture that unlocks browser audio. */
export function playSound(name: keyof typeof soundProfiles) {
  const current = getSoundSettings();
  if (!current.enabled || current.volume === 0 || document.hidden || !window.AudioContext) return;
  if (name === "hover") {
    if (!context || performance.now() - lastHover < 90) return;
    lastHover = performance.now();
  }
  if (name === "slide") {
    if (performance.now() - lastSlide < 60) return;
    lastSlide = performance.now();
  }
  if (typeof navigator.vibrate === "function") {
    const patterns = { click: 22, slide: 10, on: [20, 15, 35], off: 12, hover: 6, copy: [12, 15, 12] };
    hapticsActive = navigator.vibrate(patterns[name]);
  }
  void playTone(name);
}

async function playTone(name: keyof typeof soundProfiles) {
  const version = generation;
  try {
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -4;
      compressor.ratio.value = 12;
      const limiter = context.createWaveShaper();
      const curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh((i / (curve.length - 1) * 2 - 1) * 1.3) * .95;
      limiter.curve = curve;
      master.connect(compressor);
      compressor.connect(limiter);
      limiter.connect(context.destination);
    }
    const audio = context;
    if (audio.state !== "running") await audio.resume();
    const current = getSoundSettings();
    if (generation !== version || context !== audio || audio.state !== "running" || !current.enabled || current.volume === 0 || !master) return;
    master.gain.setValueAtTime(current.volume, audio.currentTime);
    for (const note of soundProfiles[name]) {
      if (voices.size >= 12) break;
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      const now = audio.currentTime + note.delay;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(note.frequency, now);
      envelope.gain.setValueAtTime(note.gain, now);
      envelope.gain.setTargetAtTime(.0001, now, note.duration / 3);
      oscillator.connect(envelope);
      envelope.connect(master);
      voices.add(oscillator);
      oscillator.onended = () => {
        voices.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start(now);
      oscillator.stop(now + note.duration + .04);
    }
  } catch { /* Feedback remains optional when browser audio is unavailable. */ }
}

export function suspendSounds() {
  stopSounds();
  if (context) void context.suspend().catch(() => {});
}

export function closeSounds() {
  stopSounds();
  if (context) void context.close().catch(() => {});
  context = undefined;
  master = undefined;
}
