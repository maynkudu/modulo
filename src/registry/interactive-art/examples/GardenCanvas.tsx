'use client';

import { useEffect, useRef } from 'react';
import { createGarden, type CreateGardenOptions } from '../scenes/garden';
import '../engine/scene.css';

export type GardenController = ReturnType<typeof createGarden>;
type GardenProps = CreateGardenOptions & {
  className?: string;
  fallback?: string;
  onReady?: (garden: GardenController | null) => void;
  onError?: (error: Error) => void;
};

/** Keep callbacks stable. Changes to the scene options remount only this instance. */
export function GardenCanvas({ className = '', fallback, onReady, onError, onFrame, initialTime = 16, timeScale = 1, seed = 1486, cycleSeconds = 120, wind = 1, plants, paused = false }: GardenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let garden: GardenController;
    try {
      garden = createGarden(canvas, { initialTime, timeScale, seed, cycleSeconds, wind, plants, paused, onFrame });
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    onReady?.(garden);
    return () => { garden.destroy(); onReady?.(null); };
  }, [initialTime, timeScale, seed, cycleSeconds, wind, plants, paused, onReady, onError, onFrame]);

  return <div className={`interactive-art-scene ${className}`}>
    {fallback && <img className="interactive-art-fallback" src={fallback} alt="" aria-hidden="true" />}
    <canvas ref={canvasRef} role="img" aria-label="A lotus garden with growing buds and a repeating day and night cycle. Each flower has a button for keyboard interaction." />
  </div>;
}
