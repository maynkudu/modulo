import { colour, mix, randomSource, smooth, TAU, type Point, type RGB } from '../engine/math';
import { boundedTarget, chainSnapshot, createChain, simulateChain, updateRest, type ElasticChain } from '../engine/elastic';
import { mountScene, type PaintState, type RuntimeOptions, type SceneDefinition, type SceneInput } from '../engine/runtime';

export const GARDEN_SIZE = { width: 1000, height: 680 };
export const GARDEN_LAYERS = ['sky', 'celestial', 'landscape', 'water', 'pads', 'stems', 'leaves', 'blossoms', 'foreground', 'grain'] as const;
export type GardenLayer = typeof GARDEN_LAYERS[number];
type Shade = 'ivory' | 'violet' | 'rose';
type Palette = readonly [RGB, RGB, RGB, RGB];
const LEAF_JOINTS: readonly (readonly [number, number])[] = [[3, -1], [5, 1]];

export type PlantDefinition = {
  x: number;
  height: number;
  radius: number;
  lean: number;
  delay: number;
  duration: number;
  shade: Shade;
};

type Plant = PlantDefinition & {
  id: string;
  rootY: number;
  growth: number;
  bloom: number;
  chain: ElasticChain;
};

export const DEFAULT_PLANTS: readonly PlantDefinition[] = [
  { x: 115, height: 235, radius: 34, lean: -.24, delay: -30, duration: 75, shade: 'violet' },
  { x: 278, height: 290, radius: 49, lean: -.16, delay: -38, duration: 72, shade: 'ivory' },
  { x: 438, height: 207, radius: 38, lean: -.08, delay: 0, duration: 72, shade: 'rose' },
  { x: 578, height: 370, radius: 63, lean: .12, delay: -44, duration: 78, shade: 'ivory' },
  { x: 744, height: 250, radius: 43, lean: .15, delay: -12, duration: 68, shade: 'violet' },
  { x: 902, height: 285, radius: 39, lean: .2, delay: 12, duration: 85, shade: 'rose' },
];

function restPoints(definition: PlantDefinition, rootY: number, growth: number): Point[] {
  const height = definition.height * mix(.26, 1, growth);
  return Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    return { x: definition.x + Math.sin(progress * 1.35) * height * definition.lean, y: rootY - height * progress };
  });
}

function createPlant(definition: PlantDefinition, index: number): Plant {
  if (![definition.x, definition.height, definition.radius, definition.lean, definition.delay, definition.duration].every(Number.isFinite) || definition.height <= 0 || definition.radius <= 0 || definition.duration <= 0) {
    throw new Error('Plant dimensions and growth duration must be positive finite numbers.');
  }
  const rootY = 594 + (index % 2) * 18;
  return { ...definition, id: `flower-${index + 1}`, rootY, growth: 0, bloom: 0,
    chain: createChain(restPoints(definition, rootY, 0), definition.height * .34) };
}

function tipOf(plant: Plant) {
  const tip = plant.chain.nodes.at(-1);
  if (!tip) throw new Error('Missing flower tip.');
  return tip;
}

export function gardenLighting(elapsed: number, cycleSeconds = 120) {
  const phase = (elapsed % cycleSeconds) / cycleSeconds;
  const daylight = smooth((Math.sin(phase * TAU) + .32) / .9);
  return { phase, daylight, name: daylight < .14 ? 'Night' : daylight < .64 ? 'Twilight' : 'Day' };
}

function petalPath(context: CanvasRenderingContext2D, width: number, height: number, bend = 0) {
  context.beginPath();
  context.moveTo(0, 7);
  context.bezierCurveTo(-width, -height * .2, -width * .92 + bend, -height * .74, bend, -height);
  context.bezierCurveTo(width * .94 + bend, -height * .68, width, -height * .18, 0, 7);
  context.closePath();
}

function drawLeaf(context: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, daylight: number) {
  context.save(); context.translate(x, y); context.rotate(rotation);
  petalPath(context, size * .27, size, size * .12);
  const gradient = context.createLinearGradient(-size * .2, 0, size * .3, -size);
  gradient.addColorStop(0, colour([23, 58, 65], [36, 90, 69], daylight));
  gradient.addColorStop(1, colour([44, 91, 97], [100, 144, 108], daylight));
  context.fillStyle = gradient; context.fill();
  context.strokeStyle = '#1f3443'; context.lineWidth = 1.5; context.stroke();
  context.strokeStyle = colour([109, 148, 127], [176, 189, 121], daylight, .8);
  context.lineWidth = .7;
  context.beginPath(); context.moveTo(0, 4); context.quadraticCurveTo(size * .03, -size * .5, size * .12, -size * .96); context.stroke();
  for (let index = 1; index < 7; index++) {
    const p = index / 8;
    const width = Math.sin(p * Math.PI) * size * .19;
    context.beginPath(); context.moveTo(size * p * .08, -size * p);
    context.quadraticCurveTo(-width * .7, -size * (p + .04), -width, -size * (p + .12));
    context.moveTo(size * p * .08, -size * p);
    context.quadraticCurveTo(width * .7, -size * (p + .04), width + size * .06, -size * (p + .12)); context.stroke();
  }
  context.restore();
}

function drawPetal(context: CanvasRenderingContext2D, rotation: number, width: number, height: number, palette: Palette, daylight: number, texture: CanvasPattern, bend = 0) {
  context.save(); context.rotate(rotation);
  petalPath(context, width, height, bend);
  const gradient = context.createLinearGradient(-width, 5, width * .6, -height);
  gradient.addColorStop(0, colour(palette[0], palette[1], daylight));
  gradient.addColorStop(.64, colour(palette[1], palette[2], daylight));
  gradient.addColorStop(1, colour(palette[2], palette[3], daylight));
  context.fillStyle = gradient; context.fill();
  context.save(); context.clip(); context.globalAlpha = .095; context.fillStyle = texture;
  context.fillRect(-width * 2, -height - 4, width * 4, height + 16); context.restore();
  context.strokeStyle = colour([25, 37, 65], [47, 56, 71], daylight); context.lineWidth = 1.45; context.stroke();
  context.strokeStyle = colour([114, 118, 119], [186, 165, 116], daylight, .78); context.lineWidth = .65;
  context.beginPath(); context.moveTo(0, 4); context.quadraticCurveTo(bend * .4, -height * .43, bend, -height * .94); context.stroke();
  for (let index = 1; index < 5; index++) {
    const p = index / 6, w = Math.sin(p * Math.PI) * width * .66;
    context.beginPath(); context.moveTo(bend * p * .4, -height * p);
    context.quadraticCurveTo(-w * .5, -height * (p + .06), -w + bend * p, -height * (p + .17));
    context.moveTo(bend * p * .4, -height * p);
    context.quadraticCurveTo(w * .5, -height * (p + .06), w + bend * p, -height * (p + .17)); context.stroke();
  }
  context.restore();
}

const PALETTES: Record<Shade, Palette> = {
  ivory: [[145, 157, 157], [211, 216, 204], [243, 236, 212], [255, 248, 224]],
  violet: [[77, 71, 112], [120, 102, 150], [169, 156, 191], [213, 207, 220]],
  rose: [[101, 66, 98], [164, 108, 137], [219, 170, 185], [246, 216, 212]],
};

function drawFlower(context: CanvasRenderingContext2D, plant: Plant, daylight: number, texture: CanvasPattern, selected: boolean) {
  const tip = tipOf(plant);
  const radius = plant.radius * mix(.53, 1, plant.growth);
  const bloom = plant.bloom;
  context.save(); context.translate(tip.x, tip.y); context.rotate(plant.chain.headAngle * .85);
  if (selected) {
    context.save(); context.globalAlpha = .35; context.strokeStyle = '#e6d39c'; context.lineWidth = 1;
    context.setLineDash([2, 6]); context.beginPath(); context.ellipse(0, -radius * .35, radius * 1.4, radius * 1.1, 0, 0, TAU); context.stroke(); context.restore();
  }
  const unfolding = smooth((bloom - .04) / .16);
  if (unfolding < 1) {
    context.save(); context.globalAlpha *= 1 - unfolding;
    drawPetal(context, -.1, radius * .32, radius * 1.05, PALETTES[plant.shade], daylight, texture, radius * .03);
    drawPetal(context, .13, radius * .21, radius * 1.06, PALETTES[plant.shade], daylight, texture, -radius * .04);
    drawLeaf(context, -2, 8, radius * .57, -.34, daylight);
    drawLeaf(context, 2, 8, radius * .52, .4, daylight);
    context.restore();
  }
  if (unfolding > 0) {
    context.save(); context.globalAlpha *= unfolding;
    const open = smooth((bloom - .04) / .96);
    for (let index = -4; index <= 4; index++) {
      drawPetal(context, index * .34 * mix(.3, 1, open), radius * mix(.17, .33, open), radius * (1.38 - Math.abs(index) * .048), PALETTES[plant.shade], daylight, texture, index * 1.1);
    }
    for (let index = -3; index <= 3; index++) {
      drawPetal(context, index * .45 * mix(.2, 1, open), radius * mix(.17, .34, open), radius * (.98 - Math.abs(index) * .035), PALETTES[plant.shade], daylight, texture, -index * .7);
    }
    context.save(); context.scale(1, .54);
    context.fillStyle = colour([163, 137, 68], [226, 192, 95], daylight); context.strokeStyle = '#8c7548'; context.lineWidth = 1;
    context.beginPath(); context.ellipse(0, -radius * .07, radius * .3 * open, radius * .25 * open, 0, 0, TAU); context.fill(); context.stroke();
    for (let index = 0; index < 31; index++) {
      const a = index * 2.399, r = Math.sqrt(index / 31) * radius * .28 * open;
      context.fillStyle = index % 3 ? '#dfc988' : '#776344';
      context.beginPath(); context.arc(Math.cos(a) * r, -radius * .07 + Math.sin(a) * r, .9, 0, TAU); context.fill();
    }
    context.restore();
    for (let index = -2; index <= 2; index++) {
      drawPetal(context, index * .76 * open + Math.PI * .17 * Math.sign(index), radius * .29, radius * (.6 - Math.abs(index) * .035), PALETTES[plant.shade], daylight, texture, index);
    }
    context.restore();
  }
  context.restore();
}

function drawStem(context: CanvasRenderingContext2D, plant: Plant, daylight: number) {
  const nodes = plant.chain.nodes;
  const root = nodes[0];
  if (!root) return;
  context.beginPath(); context.moveTo(root.x, root.y);
  for (let index = 1; index < nodes.length - 1; index++) {
    const node = nodes[index], next = nodes[index + 1];
    if (!node || !next) continue;
    context.quadraticCurveTo(node.x, node.y, (node.x + next.x) / 2, (node.y + next.y) / 2);
  }
  const tip = tipOf(plant);
  context.lineTo(tip.x, tip.y);
  context.lineCap = 'round'; context.strokeStyle = '#243b47'; context.lineWidth = 7; context.stroke();
  context.strokeStyle = colour([89, 116, 89], [177, 175, 113], daylight); context.lineWidth = 3.4; context.stroke();
}

function drawLeaves(context: CanvasRenderingContext2D, plant: Plant, daylight: number) {
  const nodes = plant.chain.nodes;
  for (const [index, side] of LEAF_JOINTS) {
    const node = nodes[index], previous = nodes[index - 1];
    if (!node || !previous) continue;
    const angle = Math.atan2(node.y - previous.y, node.x - previous.x) + Math.PI / 2;
    const growth = smooth((plant.growth - .12 * index) / .44);
    drawLeaf(context, node.x, node.y, plant.radius * 1.4 * growth, angle + side * .98, daylight);
  }
}

function drawLilyPad(context: CanvasRenderingContext2D, x: number, y: number, radius: number, rotation: number, daylight: number) {
  context.save(); context.translate(x, y); context.rotate(rotation); context.scale(1, .48);
  context.beginPath(); context.moveTo(0, 0); context.arc(0, 0, radius, -.28, TAU - .53); context.closePath();
  const gradient = context.createRadialGradient(-radius * .3, -radius * .3, 0, 0, 0, radius);
  gradient.addColorStop(0, colour([51, 95, 105], [126, 155, 108], daylight));
  gradient.addColorStop(1, colour([24, 52, 70], [55, 98, 88], daylight));
  context.fillStyle = gradient; context.fill(); context.strokeStyle = '#20384e'; context.lineWidth = 2; context.stroke();
  context.strokeStyle = colour([110, 147, 128], [174, 183, 127], daylight, .6); context.lineWidth = .8;
  for (let index = 1; index < 16; index++) {
    const a = index / 16 * TAU;
    context.beginPath(); context.moveTo(0, 0); context.quadraticCurveTo(Math.cos(a - .12) * radius * .48, Math.sin(a + .12) * radius * .48, Math.cos(a) * radius * .98, Math.sin(a) * radius * .98); context.stroke();
  }
  context.restore();
}

export type GardenOptions = {
  seed?: number;
  cycleSeconds?: number;
  wind?: number;
  plants?: readonly PlantDefinition[];
};

/** Garden-specific art, growth, and input response. Scheduling belongs to the runtime. */
export function createGardenScene(options: GardenOptions = {}) {
  const seed = options.seed ?? 1486, cycleSeconds = options.cycleSeconds ?? 120, wind = options.wind ?? 1;
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new Error('Seed must be an unsigned 32-bit integer.');
  if (!Number.isFinite(cycleSeconds) || cycleSeconds <= 0) throw new Error('Cycle length must be positive and finite.');
  if (!Number.isFinite(wind) || wind < 0) throw new Error('Wind must be finite and nonnegative.');
  const random = randomSource(seed);
  const plants = (options.plants ?? DEFAULT_PLANTS).map(createPlant);
  const orderedPlants = [...plants].sort((a, b) => a.rootY - b.rootY);
  const grass = Array.from({ length: 190 }, () => ({ x: random() * GARDEN_SIZE.width, y: 578 + random() * 108, height: 22 + random() * 75, lean: random() * 2 - 1, phase: random() * TAU }));
  const stars = Array.from({ length: 55 }, () => ({ x: 35 + random() * 930, y: 30 + random() * 250, radius: .45 + random() * 1.1 }));
  const pads = Array.from({ length: 13 }, () => ({ x: random() * GARDEN_SIZE.width, y: 454 + random() * 200, radius: 35 + random() * 72, rotation: random() * .6 - .3 }));
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = textureCanvas.height = 96;
  const textureContext = textureCanvas.getContext('2d');
  if (!textureContext) throw new Error('Canvas 2D is unavailable.');
  const pixels = textureContext.createImageData(96, 96);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const shade = Math.floor(random() * 255);
    pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = shade;
    pixels.data[index + 3] = 130;
  }
  textureContext.putImageData(pixels, 0, 0);
  const texture = textureContext.createPattern(textureCanvas, 'repeat');
  if (!texture) throw new Error('Could not create the garden texture.');
  let impulse: { id: string; target: Point; until: number } | null = null;

  function inspect() {
    return { seed, plants: plants.map(plant => ({ id: plant.id, growth: plant.growth, bloom: plant.bloom, ...chainSnapshot(plant.chain) })) };
  }

  return {
    size: GARDEN_SIZE,
    layers: GARDEN_LAYERS,
    update(elapsed: number, resetPose: boolean) {
      for (const plant of plants) {
        plant.growth = smooth((elapsed - plant.delay) / plant.duration);
        plant.bloom = smooth((plant.growth - .48) / .52);
        updateRest(plant.chain, restPoints(plant, plant.rootY, plant.growth), resetPose);
      }
    },
    step(dt: number, physicalTime: number, input: SceneInput) {
      for (const plant of plants) {
        let target: Point | null = null;
        if (input.drag?.id === plant.id) {
          target = { x: input.drag.target.x, y: input.drag.target.y + plant.radius * .4 };
        } else if (impulse?.id === plant.id && physicalTime < impulse.until) {
          target = impulse.target;
        } else if (input.pointer) {
          const tip = tipOf(plant), distance = Math.hypot(input.pointer.x - tip.x, input.pointer.y - tip.y);
          if (distance < plant.radius * 2) {
            const rest = plant.chain.rest.at(-1);
            if (rest) {
              const influence = smooth(1 - distance / (plant.radius * 2));
              target = { x: rest.x + (input.pointer.x > tip.x ? -1 : 1) * 27 * influence, y: rest.y + 4 * influence };
            }
          }
        }
        simulateChain(plant.chain, dt, physicalTime, wind, target);
      }
    },
    targets() {
      return plants.map((plant, index) => {
        const tip = tipOf(plant);
        return { id: plant.id, label: `Bend lotus ${index + 1}`, x: tip.x, y: tip.y - plant.radius * .4, radius: plant.radius * 1.45 };
      });
    },
    activate(id: string, direction: number, physicalTime: number) {
      const plant = plants.find(item => item.id === id);
      if (!plant) return;
      const rest = plant.chain.rest.at(-1);
      if (rest) impulse = { id, target: boundedTarget(plant.chain, { x: rest.x + Math.sign(direction) * 65, y: rest.y + 12 }), until: physicalTime + .7 };
    },
    release() { impulse = null; },
    inspect,
    paint(context: CanvasRenderingContext2D, state: PaintState, layers: ReadonlySet<GardenLayer>) {
      context.lineCap = 'round';
      const { phase, daylight } = gardenLighting(state.elapsed, cycleSeconds);
      if (layers.has('sky')) {
        const sky = context.createLinearGradient(0, 0, 0, GARDEN_SIZE.height);
        sky.addColorStop(0, colour([12, 25, 54], [89, 147, 171], daylight));
        sky.addColorStop(.65, colour([23, 46, 74], [173, 191, 174], daylight));
        sky.addColorStop(1, colour([24, 57, 66], [99, 147, 126], daylight));
        context.fillStyle = sky;
        context.fillRect(0, 0, GARDEN_SIZE.width, GARDEN_SIZE.height);
      }
      if (layers.has('celestial')) {
        context.save(); context.globalAlpha = 1 - daylight; context.fillStyle = '#dbd6b7';
        for (const star of stars) { context.beginPath(); context.arc(star.x, star.y, star.radius, 0, TAU); context.fill(); }
        context.restore();
        const orbs: readonly (readonly [boolean, number])[] = [[true, phase * TAU], [false, phase * TAU + Math.PI]];
        for (const [isSun, angle] of orbs) {
          const orbX = 500 - Math.cos(angle) * 350, orbY = 415 - Math.sin(angle) * 330;
          const glow = context.createRadialGradient(orbX, orbY, 8, orbX, orbY, 108);
          glow.addColorStop(0, isSun ? 'rgba(255,228,167,.23)' : 'rgba(204,224,233,.12)');
          glow.addColorStop(1, 'rgba(255,228,167,0)');
          context.fillStyle = glow; context.fillRect(orbX - 108, orbY - 108, 216, 216);
          context.fillStyle = isSun ? '#f5dda1' : '#d8dfdb'; context.beginPath(); context.arc(orbX, orbY, isSun ? 25 : 18, 0, TAU); context.fill();
          context.strokeStyle = 'rgba(220,205,149,.3)'; context.lineWidth = .7;
          for (let ring = 0; ring < 3; ring++) { context.beginPath(); context.arc(orbX, orbY, 31 + ring * 7, 0, TAU); context.stroke(); }
        }
      }
      if (layers.has('landscape')) {
        for (let index = 0; index < 3; index++) {
          context.beginPath(); context.moveTo(-50, 380 + index * 45);
          context.bezierCurveTo(160, 330 + index * 48, 208, 405 + index * 28, 480, 357 + index * 40);
          context.bezierCurveTo(692, 316 + index * 36, 830, 394 + index * 29, 1060, 328 + index * 36);
          context.lineTo(1060, 680); context.lineTo(-50, 680); context.closePath();
          context.fillStyle = colour([20 + index * 4, 47 + index * 5, 68 + index * 2], [75 - index * 11, 123 - index * 7, 113 - index * 8], daylight); context.fill();
          context.strokeStyle = colour([88, 116, 118], [170, 181, 129], daylight, .4); context.lineWidth = .8; context.stroke();
        }
      }
      if (layers.has('water')) {
        for (let index = 0; index < 22; index++) {
          const y = 437 + index * 8.5, x = ((index * 163) % 980) - 90;
          context.strokeStyle = colour([82, 131, 137], [170, 188, 150], daylight, .17); context.lineWidth = .9;
          context.beginPath(); context.moveTo(x, y); context.bezierCurveTo(x + 55, y - 7, x + 105, y + 7, x + 185, y); context.stroke();
        }
      }
      if (layers.has('pads')) for (const pad of pads) drawLilyPad(context, pad.x, pad.y, pad.radius, pad.rotation, daylight);
      if (layers.has('stems')) for (const plant of orderedPlants) drawStem(context, plant, daylight);
      if (layers.has('leaves')) for (const plant of orderedPlants) drawLeaves(context, plant, daylight);
      if (layers.has('blossoms')) for (const plant of orderedPlants) drawFlower(context, plant, daylight, texture, state.selectedId === plant.id);
      if (layers.has('foreground')) {
        for (const blade of grass) {
          const sway = state.reducedMotion ? 0 : Math.sin(state.physicalTime * 1.4 + blade.phase) * 7 * wind;
          context.beginPath(); context.moveTo(blade.x, blade.y);
          context.bezierCurveTo(blade.x + blade.lean * 10, blade.y - blade.height * .34, blade.x + blade.lean * 17 + sway, blade.y - blade.height * .85, blade.x + blade.lean * 25 + sway, blade.y - blade.height);
          context.strokeStyle = colour([52, 91, 82], [114, 150, 95], daylight, .82); context.lineWidth = 1.3; context.stroke();
          if (blade.height > 70) {
            context.strokeStyle = colour([138, 147, 111], [211, 195, 129], daylight, .72); context.lineWidth = 2.6;
            context.beginPath(); context.moveTo(blade.x + blade.lean * 25 + sway, blade.y - blade.height);
            context.lineTo(blade.x + blade.lean * 24 + sway, blade.y - blade.height + 8); context.stroke();
          }
        }
      }
      if (layers.has('grain')) {
        context.save(); context.globalAlpha = .045; context.fillStyle = texture;
        context.fillRect(0, 0, GARDEN_SIZE.width, GARDEN_SIZE.height); context.restore();
      }
    },
  } satisfies SceneDefinition<ReturnType<typeof inspect>, GardenLayer>;
}

export type CreateGardenOptions = GardenOptions & RuntimeOptions;

export function createGarden(canvas: HTMLCanvasElement, options: CreateGardenOptions = {}) {
  const scene = createGardenScene(options);
  const runtime = mountScene(canvas, scene, { ...options, initialTime: options.initialTime ?? 16 });
  return {
    ...runtime,
    saveState() { return { version: 1, seed: scene.inspect().seed, elapsed: runtime.snapshot().elapsed }; },
  };
}

/** Parse host-provided saved progress before recreating a garden. Storage stays with the host. */
export function readGardenState(value: unknown) {
  if (typeof value === 'object' && value !== null && 'version' in value && value.version === 1 && 'seed' in value && typeof value.seed === 'number' && Number.isInteger(value.seed) && value.seed >= 0 && value.seed <= 4294967295 && 'elapsed' in value && typeof value.elapsed === 'number' && Number.isFinite(value.elapsed) && value.elapsed >= 0) {
    return { seed: value.seed, initialTime: value.elapsed };
  }
  throw new Error('Saved garden state is invalid.');
}
