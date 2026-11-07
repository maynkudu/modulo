export type InfectionState =
  | "IDLE"
  | "AWAKENING"
  | "INFESTING"
  | "FULL_INFECTION"
  | "RETRACTING"
  | "EXPLODING";

export interface RootInfectionProps {
  /** Milliseconds of stillness before emergence. */
  inactivityDelay?: number;
  /** Milliseconds to full infection. Thin-root consolidation starts halfway through, after at least eight seconds. */
  fullInfectionDelay?: number;
  maxRoots?: number;
  maxParticles?: number;
  /** Growth speed multiplier. */
  growthSpeed?: number;
  /** Probability per growth interval, never per animation frame. */
  branchingProbability?: number;
  physicsIterations?: number;
  particleRadius?: number;
  enableAudio?: boolean;
  volume?: number;
  enableExplosion?: boolean;
  enableRetraction?: boolean;
  /** Auto preserves full detail and adjusts consolidation timing when frame cost grows. */
  quality?: "low" | "medium" | "high" | "auto";
  className?: string;
}

export type InfectionConfig = Required<Omit<RootInfectionProps, "className">>;
export type SoundEvent = "emerge" | "crawl" | "branch" | "whoosh" | "impact" | "debris";

export const FIXED_STEP = 1 / 60;

export const defaults: InfectionConfig = {
  inactivityDelay: 2400,
  fullInfectionDelay: 24000,
  maxRoots: Infinity,
  maxParticles: Infinity,
  growthSpeed: 1,
  branchingProbability: 0.075,
  physicsIterations: 5,
  particleRadius: 4.2,
  enableAudio: true,
  volume: 0.45,
  enableExplosion: true,
  enableRetraction: true,
  quality: "auto",
};

/** Validate once at the public boundary. Allocation limits are opt-in; thickness remains uncapped. */
export function configure(props: RootInfectionProps): InfectionConfig {
  const bounded = (value: number | undefined, fallback: number, min: number, max: number) =>
    Number.isFinite(value) ? Math.min(max, Math.max(min, value ?? fallback)) : fallback;
  const optionalLimit = (value: number | undefined, minimum: number) =>
    value === undefined || value === Infinity || !Number.isFinite(value) ? Infinity : Math.max(minimum, Math.round(value));
  return {
    inactivityDelay: bounded(props.inactivityDelay, defaults.inactivityDelay, 0, 600000),
    fullInfectionDelay: bounded(props.fullInfectionDelay, defaults.fullInfectionDelay, 1000, 600000),
    maxRoots: optionalLimit(props.maxRoots, 1),
    maxParticles: optionalLimit(props.maxParticles, 16),
    growthSpeed: bounded(props.growthSpeed, defaults.growthSpeed, 0.1, 4),
    branchingProbability: bounded(props.branchingProbability, defaults.branchingProbability, 0, 0.5),
    physicsIterations: Math.round(bounded(props.physicsIterations, defaults.physicsIterations, 1, 12)),
    particleRadius: bounded(props.particleRadius, defaults.particleRadius, 0.5, 8),
    enableAudio: props.enableAudio ?? defaults.enableAudio,
    volume: bounded(props.volume, defaults.volume, 0, 1),
    enableExplosion: props.enableExplosion ?? defaults.enableExplosion,
    enableRetraction: props.enableRetraction ?? defaults.enableRetraction,
    quality: props.quality ?? defaults.quality,
  };
}
