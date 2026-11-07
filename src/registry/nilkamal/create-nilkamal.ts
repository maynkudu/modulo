import { createNilkamalAudio } from './audio';
import { mountNilkamal, type NilkamalSceneOptions } from './scene';
import type { RuntimeOptions } from './engine/runtime';

export type NilkamalOptions = Omit<NilkamalSceneOptions, 'onEvent'> & RuntimeOptions & { enableAudio?: boolean; volume?: number };

export function createNilkamal(canvas: HTMLCanvasElement, options: NilkamalOptions = {}) {
  const audio = createNilkamalAudio(options.enableAudio ?? true, options.volume ?? .45);
  const events = new AbortController();
  audio.setWeather(options.weather ?? 'clear');
  audio.setIntensity(options.intensity ?? .8);
  let runtime: ReturnType<typeof mountNilkamal>;
  try { runtime = mountNilkamal(canvas, { ...options, onEvent: audio.event, onFrame(frame) { audio.setActive(frame.running); options.onFrame?.(frame); } }); }
  catch (error) { audio.destroy(); throw error; }
  const unlock = () => { void audio.unlock().catch(() => {}); };
  canvas.parentElement?.addEventListener('pointerdown', unlock, { signal: events.signal, capture: true });
  canvas.parentElement?.addEventListener('keydown', unlock, { signal: events.signal, capture: true });
  return { ...runtime,
    unlockAudio: audio.unlock,
    setAudio: audio.setAudio,
    setWeather(weather: Parameters<typeof runtime.setWeather>[0]) { runtime.setWeather(weather); audio.setWeather(weather); },
    setIntensity(intensity: number) { runtime.setIntensity(intensity); audio.setIntensity(intensity); },
    snapshot() { return { ...runtime.snapshot(), audio: audio.snapshot() }; },
    destroy() { events.abort(); runtime.destroy(); audio.destroy(); },
  };
}
