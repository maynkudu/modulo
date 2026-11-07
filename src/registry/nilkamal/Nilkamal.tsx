'use client';

import { useEffect, useRef } from 'react';
import { createNilkamal } from './create-nilkamal';
import type { FrameState } from './engine/runtime';
import type { Weather } from './weather';
import './scene.css';

export type NilkamalController = ReturnType<typeof createNilkamal>;
export type NilkamalProps = {
  weather?: Weather;
  intensity?: number;
  seed?: number;
  paused?: boolean;
  enableAudio?: boolean;
  volume?: number;
  className?: string;
  fallback?: string;
  onReady?: (controller: NilkamalController | null) => void;
  onFrame?: (frame: FrameState) => void;
  onError?: (error: Error) => void;
};

/** Weather, pause, and audio props update the existing scene. Keep callbacks stable. */
export function Nilkamal({ weather = 'clear', intensity = .8, seed = 731, paused = false, enableAudio = true, volume = .45, className = '', fallback, onReady, onFrame, onError }: NilkamalProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<NilkamalController | null>(null);
  useEffect(() => {
    if (!canvas.current) return;
    let instance: NilkamalController;
    try { instance = createNilkamal(canvas.current, { seed, onFrame }); }
    catch (error) { onError?.(error instanceof Error ? error : new Error(String(error))); return; }
    controller.current = instance;
    onReady?.(instance);
    return () => { instance.destroy(); controller.current = null; onReady?.(null); };
  }, [seed, onFrame, onReady, onError]);
  useEffect(() => { if (paused) controller.current?.pause(); else controller.current?.resume(); }, [paused, seed, onFrame, onReady, onError]);
  useEffect(() => { controller.current?.setWeather(weather); }, [weather, seed, onFrame, onReady, onError]);
  useEffect(() => { controller.current?.setIntensity(intensity); }, [intensity, seed, onFrame, onReady, onError]);
  useEffect(() => { controller.current?.setAudio(enableAudio, volume); }, [enableAudio, volume, seed, onFrame, onReady, onError]);
  return <div className={`nilkamal-scene ${className}`}>
    {fallback && <img className="nilkamal-fallback" src={fallback} alt="" aria-hidden="true" />}
    <canvas ref={canvas} role="img" aria-label="One blue lotus on a pond. Hover over its petals, pull the flower, or touch the water. The lotus and pond have buttons for keyboard interaction." />
  </div>;
}

export { WEATHERS, type Weather } from './weather';
export { NILKAMAL_LAYERS } from './scene';
