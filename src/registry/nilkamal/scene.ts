import { chainSnapshot, createChain, resetChain, simulateChain } from './engine/elastic';
import { clamp, mix, randomSource, TAU, type Point } from './engine/math';
import { mountScene, type PaintState, type RuntimeOptions, type SceneDefinition, type SceneInput } from './engine/runtime';
import { drawLotus } from './lotus';
import { createWeather, stepWeather, strikeLightning, type Weather, type WeatherEvent } from './weather';

export const NILKAMAL_SIZE = { width: 1000, height: 680 };
export const NILKAMAL_LAYERS = ['sky', 'landscape', 'water', 'ice', 'lotus', 'weather', 'foreground'] as const;
export type NilkamalLayer = typeof NILKAMAL_LAYERS[number];
export type NilkamalSceneOptions = { weather?: Weather; intensity?: number; seed?: number; onEvent?: (event: WeatherEvent) => void };

function pad(c: CanvasRenderingContext2D, x: number, y: number, r: number, rotation: number, snow: number, time: number) {
  c.save(); c.translate(x, y + Math.sin(time + x) * .45); c.scale(1, .245); c.rotate(rotation);
  c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, .2, TAU - .16); c.closePath();
  const g = c.createRadialGradient(-r * .2, -r * .3, 0, 0, 0, r);
  g.addColorStop(0, '#3e6353'); g.addColorStop(.5, '#244a3f'); g.addColorStop(1, '#102c2c');
  c.fillStyle = g; c.fill(); c.strokeStyle = '#466d60'; c.lineWidth = 1.5; c.stroke();
  c.save(); c.clip();
  for (let i = 0; i < 25; i++) {
    const a = i / 25 * TAU;
    c.strokeStyle = 'rgba(111,160,121,.23)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(Math.cos(a + .1) * r * .5, Math.sin(a + .1) * r * .5, Math.cos(a) * r, Math.sin(a) * r); c.stroke();
  }
  if (snow > .02) {
    c.fillStyle = `rgba(224,242,245,${snow * .87})`; c.fillRect(-r, -r, r * 2, r * 2);
    c.strokeStyle = `rgba(255,255,255,${snow})`; c.lineWidth = 5 + snow * 10;
    c.beginPath(); c.arc(0, 0, r - 3, Math.PI, TAU); c.stroke();
  }
  c.restore(); c.restore();
}

function iceBranch(c: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, depth: number, progress: number) {
  if (depth === 0 || progress <= 0) return;
  const endX = x + Math.cos(angle) * length * Math.min(1, progress), endY = y + Math.sin(angle) * length * .4 * Math.min(1, progress);
  c.beginPath(); c.moveTo(x, y); c.lineTo(endX, endY); c.stroke();
  if (progress > .3) {
    for (const side of [-1, 1]) iceBranch(c, mix(x, endX, .55), mix(y, endY, .55), length * .58, angle + side * .68, depth - 1, (progress - .3) * 1.4);
  }
}

export function createNilkamalScene(options: NilkamalSceneOptions = {}) {
  const seed = options.seed ?? 731;
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new Error('Seed must be an unsigned 32-bit integer.');
  const random = randomSource(seed);
  const w = createWeather(seed, options.weather ?? 'clear', options.intensity ?? .8);
  const chain = createChain(Array.from({ length: 9 }, (_, i) => ({ x: 500 + Math.sin(i / 8 * Math.PI) * 5, y: 560 - i / 8 * 120 })), 74);
  const stars = Array.from({ length: 85 }, () => ({ x: random() * 1000, y: random() * 295, r: .3 + random() * 1.1, phase: random() * TAU }));
  const reeds = Array.from({ length: 65 }, () => ({ x: random() < .5 ? random() * 190 : 810 + random() * 190, y: 645 + random() * 65, h: 35 + random() * 140, phase: random() * TAU }));
  const iceSites = Array.from({ length: 16 }, (_, i) => ({ x: i % 2 ? 1030 : -30, y: 385 + random() * 290, length: 160 + random() * 230, angle: i % 2 ? Math.PI + random() * .7 - .35 : random() * .7 - .35 }));
  const fireflies = Array.from({ length: 20 }, () => ({ x: 220 + random() * 560, y: 280 + random() * 340, phase: random() * TAU }));
  const onEvent = options.onEvent ?? (() => {});
  const grainCanvas = document.createElement('canvas'); grainCanvas.width = grainCanvas.height = 96;
  const grainContext = grainCanvas.getContext('2d');
  if (!grainContext) throw new Error('Canvas 2D is unavailable.');
  const pixels = grainContext.createImageData(96, 96);
  for (let i = 0; i < pixels.data.length; i += 4) { const value = Math.floor(random() * 255); pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value; pixels.data[i + 3] = 90; }
  grainContext.putImageData(pixels, 0, 0);
  const maybeTexture = grainContext.createPattern(grainCanvas, 'repeat');
  if (!maybeTexture) throw new Error('Could not create the petal texture.');
  const texture = maybeTexture;
  let time = 0, bloom = 1, hover = 0, localPointer: Point | null = null, impulse: { target: Point; until: number } | null = null;
  let lastPointer: Point | null = null, lastRipple = 0, lastDrag = false;
  const head = () => chain.nodes.at(-1) ?? { x: 500, y: 440 };

  function inspect() {
    return { seed, weather: w.selected, intensity: w.intensity, rain: w.rain, wind: w.wind, snow: w.snow, ice: w.ice, wetness: w.wetness, lightning: w.flash, bloom, hover, ripples: w.ripples.length, drops: w.drops.length, lotus: chainSnapshot(chain) };
  }

  function flower(c: CanvasRenderingContext2D, reflection: boolean) {
    const tip = head();
    c.save();
    if (reflection) { c.translate(0, 684); c.scale(1, -.42); c.globalAlpha *= .2 * (1 - w.ice); }
    c.translate(tip.x, tip.y); c.rotate(chain.headAngle * .22);
    drawLotus(c, { time, wind: w.wind, snow: w.snow, wetness: w.wetness, bloom, hover, flash: w.flash, pointer: localPointer, texture });
    c.restore();
  }

  const scene = {
    size: NILKAMAL_SIZE, layers: NILKAMAL_LAYERS,
    update(elapsed: number, reset: boolean) {
      time = elapsed;
      if (reset) { resetChain(chain); impulse = null; lastPointer = localPointer = null; }
    },
    step(dt: number, physicalTime: number, input: SceneInput) {
      const tip = head();
      stepWeather(w, dt, physicalTime, onEvent, tip);
      const near = input.pointer ? Math.max(0, 1 - Math.hypot(input.pointer.x - tip.x, input.pointer.y - (tip.y - 90)) / 180) : 0;
      if (hover < .2 && near > .6) onEvent('lotus');
      hover = mix(hover, near, 1 - Math.exp(-dt * 5));
      localPointer = input.pointer ? { x: input.pointer.x - tip.x, y: input.pointer.y - tip.y } : null;
      const dragged = input.drag?.id === 'lotus';
      if (input.drag && !lastDrag) {
        if (dragged) onEvent('lotus');
        else { w.ripples.push({ x: input.drag.target.x, y: input.drag.target.y, age: 0, power: 1 }); onEvent(w.ice > .6 ? 'ice' : 'water'); }
      }
      lastDrag = Boolean(input.drag);
      const target = dragged && input.drag ? { x: input.drag.target.x, y: input.drag.target.y + 92 } : impulse && physicalTime < impulse.until ? impulse.target : input.pointer && near > 0 ? { x: 500 + (input.pointer.x - tip.x) * .3 * near, y: 440 + near * 3 } : null;
      simulateChain(chain, dt, physicalTime, w.wind * 1.9, target);
      if (input.pointer && input.pointer.y > 370 && physicalTime - lastRipple > .09 && w.ice < .85) {
        const distance = lastPointer ? Math.hypot(input.pointer.x - lastPointer.x, input.pointer.y - lastPointer.y) : 0;
        if (distance > 9 && w.ripples.length < 65) {
          w.ripples.push({ ...input.pointer, age: 0, power: .65 }); lastRipple = physicalTime;
          if (distance > 35) onEvent('water');
        }
      }
      lastPointer = input.pointer;
    },
    targets() {
      const tip = head();
      return [{ id: 'lotus', label: 'Pull the blue lotus. Press Enter to bend it.', x: tip.x, y: tip.y - 92, radius: 128 },
        { id: 'pond', label: w.ice > .6 ? 'Tap the ice' : 'Make a ripple in the pond', x: 500, y: 586, radius: 48 }];
    },
    activate(id: string, direction: number, physicalTime: number) {
      if (id === 'lotus') { impulse = { target: { x: 500 + 64 * direction, y: 446 }, until: physicalTime + .75 }; onEvent('lotus'); }
      else if (id === 'pond') { w.ripples.push({ x: 500, y: 586, age: 0, power: 1 }); onEvent(w.ice > .6 ? 'ice' : 'water'); }
    },
    release() { impulse = null; lastDrag = false; lastPointer = localPointer = null; },
    inspect,
    setWeather(weather: Weather, instant = false) {
      w.selected = weather;
      if (instant) {
        w.rain = weather === 'rain' || weather === 'storm' ? 1 : 0;
        w.cold = weather === 'snow' || weather === 'hail' ? 1 : 0;
        w.storm = weather === 'storm' ? 1 : 0;
        w.wind = .12 + w.storm * 2 + w.cold * .3;
        w.snow = w.cold ? Math.max(w.snow, .6) : 0;
        w.ice = w.cold ? Math.max(w.ice, .5) : 0;
        w.wetness = w.rain; w.flash = 0;
      }
      onEvent('weather');
    },
    setIntensity(intensity: number) { if (!Number.isFinite(intensity)) throw new Error('Intensity must be finite.'); w.intensity = clamp(intensity, .2, 1); },
    setBloom(value: number) { bloom = clamp(value); },
    lightning() { strikeLightning(w); onEvent('thunder'); },
    reset() {
      w.snow = w.ice = w.wetness = w.flash = 0; w.ripples.length = w.drops.length = 0;
      w.nextThunder = 5; w.nextIce = 4; resetChain(chain); bloom = 1;
    },
    paint(c: CanvasRenderingContext2D, state: PaintState, layers: ReadonlySet<NilkamalLayer>) {
      c.lineCap = 'round';
      const cold = w.cold, storm = w.storm;
      if (layers.has('sky')) {
        const g = c.createLinearGradient(0, 0, 0, 680);
        g.addColorStop(0, `rgb(${Math.round(5 + cold * 12)},${Math.round(15 + cold * 12)},${Math.round(27 + cold * 18)})`);
        g.addColorStop(.48, `rgb(${Math.round(20 + cold * 15 - storm * 12)},${Math.round(44 + cold * 13 - storm * 24)},${Math.round(57 + cold * 17 - storm * 24)})`);
        g.addColorStop(1, '#071820'); c.fillStyle = g; c.fillRect(0, 0, 1000, 680);
        c.save(); c.globalAlpha = (1 - Math.max(storm, w.rain * .6, cold * .8));
        for (const s of stars) {
          c.fillStyle = `rgba(190,219,230,${.3 + Math.sin(time * .6 + s.phase) * .2})`;
          c.beginPath(); c.arc(s.x, s.y, s.r, 0, TAU); c.fill();
        }
        const glow = c.createRadialGradient(731, 114, 4, 731, 114, 140);
        glow.addColorStop(0, 'rgba(185,217,211,.16)'); glow.addColorStop(1, 'rgba(185,217,211,0)');
        c.fillStyle = glow; c.fillRect(590, 0, 282, 255);
        const moon = c.createRadialGradient(727, 108, 1, 731, 114, 23);
        moon.addColorStop(0, '#e4e9d9'); moon.addColorStop(1, '#acbfbc'); c.fillStyle = moon;
        c.beginPath(); c.arc(731, 114, 22, 0, TAU); c.fill();
        c.fillStyle = 'rgba(86,122,128,.1)';
        for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(720 + (i * 13 % 23), 101 + (i * 7 % 24), 2 + i % 3, 0, TAU); c.fill(); }
        c.restore();
        for (let i = 0; i < 6; i++) {
          const cx = ((i * 221 + time * (5 + storm * 13)) % 1420) - 220;
          const cloud = c.createRadialGradient(cx, 108 + i * 24, 3, cx, 108 + i * 24, 230);
          cloud.addColorStop(0, `rgba(97,127,143,${.025 + Math.max(w.rain, cold) * .12})`); cloud.addColorStop(1, 'rgba(60,83,110,0)');
          c.save(); c.translate(cx, 108 + i * 24); c.scale(1, .3); c.fillStyle = cloud;
          c.translate(-cx, -(108 + i * 24)); c.fillRect(cx - 240, -160, 480, 600); c.restore();
        }
      }
      if (layers.has('landscape')) {
        for (let layer = 0; layer < 4; layer++) {
          c.beginPath(); c.moveTo(-10, 360);
          for (let x = -10; x <= 1010; x += 10) {
            const height = 60 + Math.sin(x * .004 + layer * 1.4) * 45 + Math.sin(x * .014 + layer) * 18 + Math.sin(x * .028) * 6;
            c.lineTo(x, 313 + layer * 17 - height * (1 - layer * .16));
          }
          c.lineTo(1010, 386); c.lineTo(-10, 386); c.closePath();
          c.fillStyle = `rgb(${12 - layer * 2 + Math.round(cold * 7)},${32 - layer * 5 + Math.round(cold * 9)},${44 - layer * 5 + Math.round(cold * 11)})`; c.fill();
        }
        const mist = c.createLinearGradient(0, 285, 0, 400);
        mist.addColorStop(0, 'rgba(139,193,196,0)'); mist.addColorStop(.55, `rgba(114,168,181,${.1 + cold * .15})`); mist.addColorStop(1, 'rgba(114,168,181,0)');
        c.fillStyle = mist; c.fillRect(0, 280, 1000, 130);
      }
      if (layers.has('water')) {
        const water = c.createLinearGradient(0, 355, 0, 680);
        water.addColorStop(0, '#15313e'); water.addColorStop(.28, '#102b36'); water.addColorStop(1, '#040f19');
        c.fillStyle = water; c.fillRect(0, 355, 1000, 325);
        const glow = c.createRadialGradient(500, 465, 10, 500, 470, 250);
        glow.addColorStop(0, 'rgba(54,132,169,.16)'); glow.addColorStop(1, 'rgba(44,117,157,0)'); c.fillStyle = glow; c.fillRect(220, 355, 560, 325);
        flower(c, true);
        for (let i = 0; i < 130; i++) {
          const y = 358 + i * 2.6, wave = Math.sin(time * (1 + storm) + i * .62);
          const x = (i * 137 % 1100) - 50 + wave * (4 + storm * 7), len = 18 + (i * 71 % 100);
          c.strokeStyle = `rgba(120,175,191,${.04 + (i % 7 === 0 ? .035 : 0)})`; c.lineWidth = .65;
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + len * .5, y + wave * 1.2, x + len, y); c.stroke();
          if (i < 55) {
            c.strokeStyle = `rgba(195,221,209,${(1 - Math.max(w.rain, cold)) * .075})`;
            c.beginPath(); c.moveTo(730 - i * .27 + wave * 3, y); c.lineTo(730 + i * .27 + wave * 3, y); c.stroke();
          }
        }
        for (const r of w.ripples) {
          c.strokeStyle = `rgba(139,211,238,${(1 - r.age / 2.4) * .33 * (1 - w.ice)})`; c.lineWidth = .7;
          for (let ring = 0; ring < 2; ring++) {
            const radius = r.age * 24 * r.power - ring * 8;
            if (radius > 0) { c.beginPath(); c.ellipse(r.x, r.y, radius, radius * .24, 0, 0, TAU); c.stroke(); }
          }
        }
        pad(c, 499, 492, 141, -.06, w.snow, time * .5);
        pad(c, 242, 530, 74, .15, w.snow, time * .4);
        pad(c, 733, 461, 67, -.08, w.snow, time * .4);
        pad(c, 797, 601, 103, -.1, w.snow, time * .4);
        pad(c, 97, 631, 118, .2, w.snow, time * .4);
      }
      if (layers.has('ice') && w.ice > .01) {
        c.save();
        const ice = c.createLinearGradient(0, 370, 0, 680);
        ice.addColorStop(0, `rgba(168,210,228,${w.ice * .12})`); ice.addColorStop(1, `rgba(182,218,229,${w.ice * .65})`);
        c.fillStyle = ice; c.fillRect(0, 365, 1000, 315);
        for (const site of iceSites) {
          c.strokeStyle = `rgba(221,245,255,${w.ice * .32})`; c.lineWidth = .65;
          iceBranch(c, site.x, site.y, site.length, site.angle, 4, w.ice * 3);
          c.strokeStyle = `rgba(111,165,186,${w.ice * .17})`; c.lineWidth = 1.4;
          iceBranch(c, site.x, site.y + 1, site.length, site.angle, 4, w.ice * 3);
        }
        for (let i = 0; i < 80; i++) {
          const x = (i * 173) % 1000, y = 450 + (i * 41 % 230), radius = (3 + i % 7) * w.snow;
          c.fillStyle = `rgba(243,252,255,${w.snow * .27})`; c.beginPath(); c.ellipse(x, y, radius * 2, radius * .3, 0, 0, TAU); c.fill();
        }
        c.restore();
      }
      if (layers.has('lotus')) {
        const nodes = chain.nodes, root = nodes[0];
        if (root) {
          c.save(); c.beginPath(); c.rect(0, 0, 1000, 487); c.clip();
          c.strokeStyle = '#193d35'; c.lineWidth = 6; c.beginPath(); c.moveTo(root.x, root.y);
          for (let i = 1; i < nodes.length - 1; i++) { const node = nodes[i], next = nodes[i + 1]; if (node && next) c.quadraticCurveTo(node.x, node.y, (node.x + next.x) / 2, (node.y + next.y) / 2); }
          const tip = head(); c.lineTo(tip.x, tip.y); c.stroke();
          c.strokeStyle = '#5c8670'; c.lineWidth = 1.5; c.stroke(); c.restore();
          c.save(); c.translate(tip.x, tip.y + 5); c.rotate(chain.headAngle * .22);
          c.fillStyle = '#234b43'; c.beginPath(); c.moveTo(-25, -5); c.quadraticCurveTo(-8, 17, 0, 13); c.quadraticCurveTo(12, 11, 25, -5); c.quadraticCurveTo(0, 3, -25, -5); c.fill(); c.restore();
        }
        flower(c, false);
      }
      if (layers.has('weather')) {
        const precipitation = Math.max(w.rain, cold);
        const count = Math.round(w.particles.length * precipitation * w.intensity);
        for (let i = 0; i < count; i++) {
          const p = w.particles[i]; if (!p) continue;
          c.save(); c.globalAlpha = precipitation * (.24 + p.depth * .6);
          if (cold > .5) {
            const hail = w.selected === 'hail' || p.kind < .19;
            const radius = hail ? 1.8 + p.depth * 2.5 : .6 + p.depth * 2.6;
            c.fillStyle = hail ? '#deeffa' : '#f0f7fb';
            if (hail) { c.shadowColor = 'rgba(153,203,242,.5)'; c.shadowBlur = 4; }
            c.beginPath(); c.arc(p.x, p.y, radius, 0, TAU); c.fill();
            if (hail) { c.fillStyle = '#fff'; c.beginPath(); c.arc(p.x - .5, p.y - .7, radius * .35, 0, TAU); c.fill(); }
          } else {
            c.strokeStyle = 'rgba(165,212,240,.6)'; c.lineWidth = .55 + p.depth * .75;
            c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - (2 + storm * 9) * p.depth, p.y - (9 + p.depth * 15)); c.stroke();
            if (p.depth > .84) { c.fillStyle = 'rgba(185,227,249,.65)'; c.beginPath(); c.ellipse(p.x, p.y, 1, 2.3, -.15 - storm * .3, 0, TAU); c.fill(); }
          }
          c.restore();
        }
        for (const p of w.drops) {
          c.fillStyle = 'rgba(152,222,251,.7)'; c.beginPath(); c.ellipse(p.x, p.y, 2, 3.7, -.15, 0, TAU); c.fill();
          c.fillStyle = '#d5f6ff'; c.beginPath(); c.arc(p.x - .5, p.y - 1.4, .65, 0, TAU); c.fill();
        }
        if (w.lightningAge < .32 && !state.reducedMotion) {
          c.save(); c.globalAlpha = Math.max(.1, w.flash); c.strokeStyle = '#def2ff'; c.lineWidth = 1.8; c.shadowColor = '#92cafa'; c.shadowBlur = 12;
          c.beginPath(); for (const [i, p] of w.lightning.entries()) { if (i === 0) c.moveTo(p.x, p.y); else c.lineTo(p.x, p.y); } c.stroke();
          const fork = w.lightning[6]; if (fork) { c.lineWidth = .75; c.beginPath(); c.moveTo(fork.x, fork.y); c.lineTo(fork.x + 60, fork.y + 25); c.lineTo(fork.x + 48, fork.y + 48); c.lineTo(fork.x + 110, fork.y + 81); c.stroke(); }
          c.restore();
        }
        if (w.flash > .001 && !state.reducedMotion) { c.fillStyle = `rgba(174,214,255,${w.flash * .2})`; c.fillRect(0, 0, 1000, 680); }
        if (precipitation < .7) {
          for (const f of fireflies) {
            const alpha = (1 - precipitation) * Math.max(0, Math.sin(time * .7 + f.phase)) * .5;
            c.fillStyle = `rgba(189,216,140,${alpha})`; c.shadowColor = '#bce786'; c.shadowBlur = 7;
            c.beginPath(); c.arc(f.x + Math.sin(time * .32 + f.phase) * 12, f.y + Math.cos(time * .45 + f.phase) * 8, 1.1, 0, TAU); c.fill(); c.shadowBlur = 0;
          }
        }
      }
      if (layers.has('foreground')) {
        for (const reed of reeds) {
          const sway = Math.sin(time * 1.4 + reed.phase) * w.wind * 8;
          c.strokeStyle = '#0a2429'; c.lineWidth = 2;
          c.beginPath(); c.moveTo(reed.x, reed.y); c.quadraticCurveTo(reed.x + 8, reed.y - reed.h * .7, reed.x + 16 + sway, reed.y - reed.h); c.stroke();
          c.strokeStyle = `rgba(85,127,119,${.32 + w.snow * .4})`; c.lineWidth = .6; c.stroke();
          if (w.snow > .1) { c.strokeStyle = `rgba(235,246,248,${w.snow})`; c.lineWidth = 2; c.beginPath(); c.moveTo(reed.x + 16 + sway, reed.y - reed.h); c.lineTo(reed.x + 14 + sway, reed.y - reed.h + 8); c.stroke(); }
        }
        const vignette = c.createRadialGradient(500, 340, 160, 500, 340, 640);
        vignette.addColorStop(0, 'rgba(0,8,17,0)'); vignette.addColorStop(1, 'rgba(0,8,17,.66)'); c.fillStyle = vignette; c.fillRect(0, 0, 1000, 680);
      }
    },
  };
  return scene satisfies SceneDefinition<ReturnType<typeof inspect>, NilkamalLayer>;
}

export function mountNilkamal(canvas: HTMLCanvasElement, options: NilkamalSceneOptions & RuntimeOptions = {}) {
  const scene = createNilkamalScene(options);
  const runtime = mountScene(canvas, scene, options);
  return { ...runtime,
    setWeather(weather: Weather) { const state = runtime.snapshot(); scene.setWeather(weather, state.paused || state.reducedMotion); runtime.invalidate(); },
    setIntensity(intensity: number) { scene.setIntensity(intensity); runtime.invalidate(); },
    setBloom(bloom: number) { scene.setBloom(bloom); runtime.invalidate(); },
    lightning() { const state = runtime.snapshot(); if (!state.reducedMotion && !state.paused) { scene.lightning(); runtime.invalidate(); } },
    reset() { scene.reset(); runtime.seek(0); },
  };
}
