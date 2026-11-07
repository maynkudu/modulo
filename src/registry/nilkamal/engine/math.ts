export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

export const TAU = Math.PI * 2;
export const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value));
export const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

export function smooth(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

export function randomSource(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export type RGB = readonly [number, number, number];

export function colour(from: RGB, to: RGB, amount: number, alpha = 1) {
  return `rgba(${from.map((channel, index) => Math.round(mix(channel, to[index] ?? channel, amount))).join(',')},${alpha})`;
}
