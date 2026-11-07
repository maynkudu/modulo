import { clamp, mix, randomSource, TAU, type Point } from './engine/math';

export const WEATHERS = ['clear', 'rain', 'storm', 'snow', 'hail'] as const;
export type Weather = typeof WEATHERS[number];
export type WeatherEvent = 'water' | 'lotus' | 'thunder' | 'hail' | 'ice' | 'weather';
export type WeatherState = ReturnType<typeof createWeather>;

export function createWeather(seed: number, initial: Weather, strength: number) {
  const random = randomSource(seed);
  return {
    selected: initial, intensity: clamp(strength, .2, 1),
    rain: initial === 'rain' || initial === 'storm' ? 1 : 0,
    cold: initial === 'snow' || initial === 'hail' ? 1 : 0,
    storm: initial === 'storm' ? 1 : 0,
    wind: .15, wetness: 0, snow: 0, ice: 0, flash: 0, lightningAge: 9,
    lightning: Array.from({ length: 15 }, (_, i) => ({ x: 720 + random() * 90 + Math.sin(i) * 24, y: 20 + i * 22 })),
    particles: Array.from({ length: 320 }, () => ({
      x: random() * 1200 - 100, y: random() * 680, depth: .3 + random() * .7,
      floor: 370 + random() * 300, phase: random() * TAU, kind: random(), bounce: 0,
    })),
    ripples: [] as { x: number; y: number; age: number; power: number }[],
    drops: [] as { x: number; y: number; vx: number; vy: number; age: number }[],
    nextThunder: 5, nextIce: 4, nextImpact: 0, random,
  };
}

export function stepWeather(w: WeatherState, dt: number, time: number, onEvent: (event: WeatherEvent) => void, flower: Point = { x: 500, y: 440 }) {
  const blend = 1 - Math.exp(-dt * 1.6);
  w.rain = mix(w.rain, w.selected === 'rain' || w.selected === 'storm' ? 1 : 0, blend);
  w.cold = mix(w.cold, w.selected === 'snow' || w.selected === 'hail' ? 1 : 0, blend);
  w.storm = mix(w.storm, w.selected === 'storm' ? 1 : 0, blend);
  w.wind = mix(w.wind, .12 + w.storm * 2 + (w.selected === 'hail' ? .7 : w.cold * .3), blend);
  w.wetness = clamp(w.wetness + dt * (w.rain * .15 - (1 - w.rain) * .045));
  w.snow = clamp(w.snow + dt * (w.cold * .04 * w.intensity - (1 - w.cold) * .065));
  w.ice = clamp(w.ice + dt * (w.cold * .033 * w.intensity - (1 - w.cold) * .045));
  w.flash *= Math.exp(-dt * 9);
  w.lightningAge += dt;
  w.nextThunder -= dt * w.storm;
  if (w.nextThunder <= 0 && w.storm > .6) {
    strikeLightning(w); w.nextThunder = 7 + w.random() * 9; onEvent('thunder');
  }
  w.nextIce -= dt * w.cold;
  if (w.nextIce <= 0 && w.ice > .1) { w.nextIce = 4 + w.random() * 5; onEvent('ice'); }
  w.nextImpact -= dt;
  const precipitation = Math.max(w.rain, w.cold);
  const count = Math.round(w.particles.length * precipitation * w.intensity);
  for (let i = 0; i < count; i++) {
    const p = w.particles[i]; if (!p) continue;
    const hail = w.cold > .5 && (w.selected === 'hail' || p.kind < .19);
    const speed = w.rain > .5 ? 670 : hail ? 380 : 55;
    p.x += (w.wind * 52 + (w.cold > .5 && !hail ? Math.sin(time * .9 + p.phase) * 18 : 0)) * dt * p.depth;
    p.y += (p.bounce ? p.bounce : speed * p.depth) * dt;
    if (p.bounce) p.bounce += 1000 * dt;
    if (p.y > p.floor || p.x > 1110) {
      if (hail && !p.bounce && p.x < 1060) {
        p.bounce = -100 - p.depth * 100;
        if (w.nextImpact <= 0) { onEvent('hail'); w.nextImpact = .18; }
      } else {
        if (w.rain > .4 && w.ice < .7 && w.ripples.length < 65) w.ripples.push({ x: p.x, y: p.floor, age: 0, power: p.depth });
        p.x = w.random() * 1180 - 180; p.y = -20 - w.random() * 90;
        p.floor = 370 + w.random() * 300; p.bounce = 0;
      }
    }
  }
  for (let i = w.ripples.length - 1; i >= 0; i--) {
    const p = w.ripples[i]; if (!p) continue;
    p.age += dt; if (p.age > 2.4) w.ripples.splice(i, 1);
  }
  for (let i = w.drops.length - 1; i >= 0; i--) {
    const p = w.drops[i]; if (!p) continue;
    p.age += dt; p.vy += 650 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.y > 490) {
      if (w.ripples.length < 65) w.ripples.push({ x: p.x, y: 490, age: 0, power: .7 });
      if (w.nextImpact <= 0) { onEvent('water'); w.nextImpact = .25; }
      w.drops.splice(i, 1);
    }
  }
  if (w.rain > .6 && w.random() < dt * 3 && w.drops.length < 24) {
    const side = w.random() > .5 ? 1 : -1;
    w.drops.push({ x: flower.x + side * (125 + w.random() * 50), y: flower.y - 50 + w.random() * 30, vx: side * 10, vy: 12, age: 0 });
  }
}

export function strikeLightning(w: WeatherState) {
  w.flash = 1; w.lightningAge = 0;
  for (const point of w.lightning) point.x = 690 + w.random() * 120;
}
