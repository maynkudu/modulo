"use client";

import { useEffect, useRef } from "react";
import { mountRootInfection, type RootInfectionController } from "./engine/runtime";
import type { RootInfectionProps as SimulationProps } from "./types";

export type RootInfectionProps = SimulationProps & {
  /** Stable callback. The controller is null after cleanup. */
  onReady?: (controller: RootInfectionController | null) => void;
};
export type { RootInfectionController } from "./engine/runtime";

/** The host owns layout. All animation work and temporary DOM belong to the runtime. */
export function RootInfection({
  inactivityDelay, fullInfectionDelay, maxRoots, maxParticles, growthSpeed,
  branchingProbability, physicsIterations, particleRadius, enableAudio = true, volume = 0.45,
  enableExplosion, enableRetraction, quality, className = "", onReady,
}: RootInfectionProps) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<RootInfectionController | null>(null);
  const audio = useRef({ enableAudio, volume });

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const instance = mountRootInfection(element, {
      inactivityDelay, fullInfectionDelay, maxRoots, maxParticles, growthSpeed,
      branchingProbability, physicsIterations, particleRadius,
      enableAudio: audio.current.enableAudio, volume: audio.current.volume,
      enableExplosion, enableRetraction, quality,
    });
    controller.current = instance;
    onReady?.(instance);
    return () => { instance.destroy(); controller.current = null; onReady?.(null); };
  }, [inactivityDelay, fullInfectionDelay, maxRoots, maxParticles, growthSpeed,
    branchingProbability, physicsIterations, particleRadius, enableExplosion, enableRetraction, quality, onReady]);

  useEffect(() => {
    audio.current = { enableAudio, volume };
    controller.current?.setAudio(enableAudio, volume);
  }, [enableAudio, volume]);

  return (
    <div ref={host} className={className} aria-label="Root Infection. Move the pointer to retract, click to scatter, or press Escape to clear."
      style={{ display: "grid", placeItems: "center", minHeight: 360, position: "relative", isolation: "isolate" }}>
      <p style={{ margin: 0, font: "inherit", fontSize: 13, letterSpacing: "0.02em" }}>don&apos;t move your mouse</p>
    </div>
  );
}
