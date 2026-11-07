import { FIXED_STEP, type InfectionConfig, type InfectionState, type SoundEvent } from "../types";
import { CollisionField } from "./collision-field";
import { ParticlePool } from "./particles";
import { SpatialHash } from "./spatial-hash";

const TAU = Math.PI * 2;
const SEGMENT = 10;
const INITIAL_SEGMENTS = 180;
const COVERAGE_CELL = 96;
const isGrowing = (state: InfectionState) => state === "AWAKENING" || state === "INFESTING" || state === "FULL_INFECTION";

function makeRoot() {
  return {
    ids: new Int32Array(INITIAL_SEGMENTS),
    pathX: new Float32Array(INITIAL_SEGMENTS),
    pathY: new Float32Array(INITIAL_SEGMENTS),
    pathDistance: new Float32Array(INITIAL_SEGMENTS),
    count: 0, depth: 0, parentRoot: -1, parentJoint: -1,
    angle: 0, phase: 0, speed: 1, thickness: 1, targetX: 0, targetY: 0,
    nextGrowth: 0, nextTurn: 0, limit: 100, worm: false, born: 0, merging: false,
    surfaceUntil: 0, surfaceDirection: 1, children: 0,
    mergeAge: 0, mergeJoint: 0, mergedVolume: 0, mergeTarget: -1,
    retained: false, width: 0, score: 0, bulk: 1, centerX: 0, centerY: 0, targetReached: false, exposure: 1, totalLength: 0,
  };
}

/** React-free fixed-step solver. Roots share branch particles rather than duplicating joints. */
export class PhysicsWorld {
  readonly particles: ParticlePool;
  readonly hash: SpatialHash;
  readonly field = new CollisionField();
  readonly roots: ReturnType<typeof makeRoot>[];
  rootCount = 0;
  state: InfectionState = "IDLE";
  age = 0;
  stateAge = 0;
  width = 1;
  height = 1;
  originX = 0;
  originY = 0;
  branchCount = 0;
  wormCount = 0;
  recycledBranches = 0;
  absorbedVolume = 0;
  growthFrontier = 0;
  pressure = 0;
  maturation: "SPREADING" | "CONSOLIDATING" | "SWELLING" = "SPREADING";
  culledRoots = 0;
  private consolidationAge = 0;
  private nextCull = 0;
  private nextFork = 0;
  private coverageColumns = 1;
  private coverageRows = 1;
  private coverage = new Uint8Array(1);
  private coverageOwner = new Int32Array(1);
  private reservations = new Uint8Array(1);
  coveredCells = 0;
  wrappedTips = 0;
  held = -1;
  private heldMass = 1;
  private heldX = 0;
  private heldY = 0;
  private gust = 0;
  private nextRecycle = 0;
  iterations: number;
  collisionEvery = 1;
  surfaceEvery = 1;
  private tick = 0;
  private nextSpawn = 0;
  private nextCrawl = 0;
  private seed = 13486;
  private longestPath = 0;
  private deepestGeneration = 0;
  private readonly soundQueue: SoundEvent[] = [];

  constructor(readonly config: InfectionConfig) {
    this.particles = new ParticlePool(config.maxParticles);
    this.hash = new SpatialHash(this.particles.capacity);
    this.roots = Array.from({ length: Math.min(64, config.maxRoots) }, makeRoot);
    this.iterations = config.physicsIterations;
  }

  private random() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  resize(width: number, height: number) {
    const scaleX = width / this.width, scaleY = height / this.height;
    const p = this.particles;
    for (let slot = p.used - 1; slot >= 0; slot--) {
      const id = p.active[slot];
      p.x[id] *= scaleX; p.previousX[id] *= scaleX; p.renderX[id] *= scaleX;
      p.y[id] *= scaleY; p.previousY[id] *= scaleY; p.renderY[id] *= scaleY;
    }
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      root.targetX *= scaleX; root.targetY *= scaleY;
      root.targetReached = false;
      for (let joint = 0; joint < root.count; joint++) {
        root.pathX[joint] *= scaleX; root.pathY[joint] *= scaleY;
      }
    }
    this.originX *= scaleX; this.originY *= scaleY;
    this.width = Math.max(1, width); this.height = Math.max(1, height);
    this.hash.resize(this.width, this.height);
    this.coverageColumns = Math.ceil(this.width / COVERAGE_CELL);
    this.coverageRows = Math.ceil(this.height / COVERAGE_CELL);
    this.coverage = new Uint8Array(this.coverageColumns * this.coverageRows);
    this.coverageOwner = new Int32Array(this.coverage.length);
    this.reservations = new Uint8Array(this.coverage.length);
    this.nextFork = 0; this.coveredCells = 0;
    if (this.state === "RETRACTING") { this.capturePaths(); this.stateAge = 0; }
  }

  awaken(x: number, y: number) {
    if (this.state !== "IDLE") return;
    this.originX = Math.min(this.width - 2, Math.max(2, x));
    this.originY = Math.min(this.height - 2, Math.max(2, y));
    this.age = this.stateAge = this.nextSpawn = this.nextCrawl = 0;
    this.state = "AWAKENING";
    this.emit("emerge");
  }

  /** The first outcome owns the transition until every particle is removed. */
  react(outcome: "RETRACTING" | "EXPLODING", x = this.originX, y = this.originY) {
    if (!isGrowing(this.state)) return false;
    this.release();
    this.field.clearReactions();
    this.state = outcome;
    this.stateAge = 0;
    if (outcome === "RETRACTING") {
      this.capturePaths();
      this.emit("whoosh");
    } else {
      const p = this.particles;
      for (let index = 0; index < this.rootCount; index++) {
        const root = this.roots[index];
        for (let joint = 0; joint < root.count; joint++) {
          const id = root.ids[joint];
          // Leave two-joint ligaments. Different impulses make them tumble.
          p.connected[id] = joint > 0 && joint % 3 !== 0 ? 1 : 0;
          p.inverseMass[id] = 1;
          const dx = p.x[id] - x, dy = p.y[id] - y;
          const distance = Math.max(16, Math.hypot(dx, dy));
          const impulse = 220 + 280 * Math.exp(-distance / 500) + this.random() * 180;
          const spin = (joint % 3 - 1) * 90;
          p.previousX[id] = p.x[id] - (dx / distance * impulse - dy / distance * spin) * FIXED_STEP;
          p.previousY[id] = p.y[id] - (dy / distance * impulse + dx / distance * spin - 300) * FIXED_STEP;
        }
      }
      // Debris uses the same pool and has no distance constraints.
      const debris = Math.min(100, p.capacity - p.used);
      for (let index = 0; index < debris; index++) {
        const source = Math.floor(this.random() * Math.max(1, p.count - index));
        const id = p.acquire(p.x[source] ?? x, p.y[source] ?? y, 0.5 + this.random() * 1.5, -1);
        const angle = this.random() * TAU, impulse = 150 + this.random() * 450;
        p.inverseMass[id] = 1;
        p.previousX[id] -= Math.cos(angle) * impulse * FIXED_STEP;
        p.previousY[id] -= (Math.sin(angle) * impulse - 200) * FIXED_STEP;
      }
      this.emit("impact");
    }
    return true;
  }

  reset() {
    this.release();
    this.field.clearReactions();
    this.particles.reset();
    this.rootCount = this.branchCount = this.wormCount = 0;
    this.recycledBranches = this.wrappedTips = this.absorbedVolume = this.growthFrontier = this.pressure = 0;
    this.nextRecycle = this.gust = this.deepestGeneration = this.nextCull = this.consolidationAge = this.culledRoots = 0;
    this.nextFork = this.coveredCells = 0;
    this.coverage.fill(0);
    this.reservations.fill(0);
    this.maturation = "SPREADING";
    this.state = "IDLE";
    this.age = this.stateAge = 0;
    this.soundQueue.length = 0;
  }

  private emit(event: SoundEvent) {
    if (this.soundQueue.length < 12 && !this.soundQueue.includes(event)) this.soundQueue.push(event);
  }

  drainSounds(play: (event: SoundEvent) => void) {
    for (let index = 0; index < this.soundQueue.length; index++) play(this.soundQueue[index]);
    this.soundQueue.length = 0;
  }

  private chooseTarget(root: ReturnType<typeof makeRoot>, index: number) {
    // Primary roots seek the perimeter. Branches distribute through the interior.
    const sequence = index + Math.floor(this.age / 8) * 13;
    root.targetX = (0.04 + ((sequence * 0.61803398875 + 0.21) % 1) * 0.92) * this.width;
    root.targetY = (0.04 + ((sequence * 0.754877666 + 0.37) % 1) * 0.92) * this.height;
    if (root.depth === 0) {
      const edge = index % 4;
      const reach = this.pressure * 60;
      if (edge === 0) root.targetX = 12 - reach;
      if (edge === 1) root.targetY = 12 - reach;
      if (edge === 2) root.targetX = this.width - 12 + reach;
      if (edge === 3) root.targetY = this.height - 12 + reach;
    }
  }

  private birthSize() { return 1 + this.age * 0.04; }

  private spawn(parentRoot = -1, parentJoint = -1) {
    const p = this.particles;
    const mature = this.maturation !== "SPREADING";
    const allowed = Math.min(this.config.maxRoots, 6 + Math.floor(this.age * 6));
    let index = 0;
    while (index < this.rootCount && this.roots[index].count > 0) index++;
    if (index >= allowed || p.used + 3 >= p.limit) return;
    p.ensureCapacity(p.used + 3);
    if (index >= this.roots.length) this.roots.push(makeRoot());
    if (parentRoot < 0 && (this.rootCount >= Math.min(6, this.config.maxRoots) || index < this.rootCount)) {
      // Fill the shallowest generation, distributing births among its siblings.
      let fewestChildren = 5;
      for (let offset = 0; offset < this.rootCount; offset++) {
        const candidate = (index + offset + 7) % this.rootCount;
        const parent = this.roots[candidate];
        if (candidate !== index && parent.count > 12 && !parent.merging && !parent.worm && parent.depth === this.growthFrontier && parent.children < fewestChildren) {
          parentRoot = candidate; fewestChildren = parent.children;
          parentJoint = parent.ids[Math.min(parent.count - 5, 8 + parent.children * 13)];
        }
      }
      if (parentRoot < 0) return;
    }
    if (parentRoot >= 0 && (this.roots[parentRoot].depth !== this.growthFrontier || this.roots[parentRoot].children >= 4)) return;
    const root = this.roots[index];
    root.count = 0;
    root.depth = parentRoot < 0 ? 0 : this.roots[parentRoot].depth + 1;
    this.deepestGeneration = Math.max(this.deepestGeneration, root.depth);
    root.parentRoot = parentRoot;
    root.parentJoint = parentJoint;
    root.phase = this.random() * TAU;
    root.thickness = parentRoot < 0 ? 0.7 + this.random() * 1.4 : this.roots[parentRoot].thickness * (0.5 + this.random() * 0.35);
    if (mature && parentJoint >= 0) root.thickness = Math.max(root.thickness, p.radius[parentJoint] * 0.6 / (this.config.particleRadius * this.birthSize()));
    root.speed = 0.6 + this.random() * 0.9;
    root.limit = root.depth === 0 ? Math.floor(125 + this.random() * 50)
      : root.depth === 1 ? Math.floor(40 + this.random() * 45)
      : root.depth === 2 ? Math.floor(16 + this.random() * 20) : Math.floor(8 + this.random() * 12);
    root.nextGrowth = this.age + 0.08;
    root.nextTurn = this.age + 1 + this.random() * 2;
    root.worm = false;
    root.born = this.age;
    root.merging = false;
    root.children = root.mergeAge = root.mergedVolume = 0;
    root.mergeTarget = -1; root.retained = mature; root.bulk = 1; root.targetReached = false;
    root.exposure = 1; root.width = root.score = root.totalLength = 0;
    root.surfaceUntil = 0;
    root.surfaceDirection = this.random() < 0.5 ? -1 : 1;
    if (parentJoint >= 0) {
      root.ids[root.count++] = parentJoint;
      const previous = p.parent[parentJoint];
      const angle = previous < 0 ? root.phase : Math.atan2(p.y[parentJoint] - p.y[previous], p.x[parentJoint] - p.x[previous]);
      root.angle = angle + (this.random() < 0.5 ? -1 : 1) * (0.5 + this.random() * 0.8);
      this.branchCount++;
      this.roots[parentRoot].children++;
      this.emit("branch");
    } else {
      root.angle = index * 2.3999632297 + root.phase * 0.15;
      const id = p.acquire(this.originX, this.originY, this.config.particleRadius * root.thickness * this.birthSize(), index);
      p.born[id] = this.age;
      root.ids[root.count++] = id;
    }
    this.chooseTarget(root, index);
    this.rootCount = Math.max(this.rootCount, index + 1);
    this.extend(root, index, false);
    return index;
  }

  private extend(root: ReturnType<typeof makeRoot>, index: number, reserveForBirth = true) {
    const reserve = reserveForBirth ? Math.min(40, Math.floor(this.particles.capacity * 0.02)) : 0;
    if (root.count >= root.limit || this.particles.used >= this.particles.limit - reserve) return;
    this.particles.ensureCapacity(this.particles.used + reserve + 1);
    if (root.count === root.ids.length) {
      const capacity = root.ids.length * 2;
      const ids = new Int32Array(capacity); ids.set(root.ids); root.ids = ids;
      const x = new Float32Array(capacity); x.set(root.pathX); root.pathX = x;
      const y = new Float32Array(capacity); y.set(root.pathY); root.pathY = y;
      const distance = new Float32Array(capacity); distance.set(root.pathDistance); root.pathDistance = distance;
    }
    const p = this.particles, previous = root.ids[root.count - 1];
    const taper = Math.max(0.24, 1 - root.count / root.limit * 0.7);
    const birthSize = this.birthSize();
    const id = p.acquire(p.x[previous] + Math.cos(root.angle) * 0.7, p.y[previous] + Math.sin(root.angle) * 0.7,
      this.config.particleRadius * root.thickness * taper * birthSize, index, previous);
    if (id < 0) return;
    p.born[id] = this.age;
    root.ids[root.count++] = id;
    root.totalLength += SEGMENT * (1 + this.age * 0.012);
  }

  /** Every shallow parent fills its four branch slots before a deeper generation opens. */
  private updateFrontier() {
    for (let index = 0; index < this.rootCount; index++) this.roots[index].children = 0;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.count > 1 && root.parentJoint >= 0) this.roots[root.parentRoot].children++;
    }
    this.growthFrontier = this.deepestGeneration;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.count > 1 && !root.merging && !root.worm && root.children < 4) this.growthFrontier = Math.min(this.growthFrontier, root.depth);
    }
  }

  private recycle() {
    if ((this.particles.used < this.particles.limit * 0.92 && this.rootCount < this.config.maxRoots && this.age < 20) || this.age < this.nextRecycle) return;
    this.nextRecycle = this.age + 1.8;
    let candidate = -1, oldest = -Infinity, merging = 0;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.merging) merging++;
      if (root.count < 3 || root.merging || root.worm || root.depth < 1 || root.children > 0 || this.age - root.born < 8 || root.ids.includes(this.held)) continue;
      if (this.age - root.born > oldest) { oldest = this.age - root.born; candidate = index; }
    }
    if (candidate < 0 || merging >= 6) return;
    const parent = this.roots[candidate].parentRoot;
    // Several small siblings coalesce onto the same living trunk together.
    let selected = 0;
    for (let index = 0; index < this.rootCount && selected < 3; index++) {
      const root = this.roots[index];
      if (root.parentRoot !== parent || root.count < 3 || root.merging || root.worm || root.children > 0 || this.age - root.born < 8 || root.ids.includes(this.held)) continue;
      this.beginMerge(root, parent);
      selected++;
    }
    this.emit("crawl");
  }

  private matureRootTarget() { return Math.max(8, Math.ceil(Math.sqrt(this.width * this.height) / 100)); }

  /** Keep substantial forks and their supporting joints while absorbing the thin early network. */
  private beginConsolidation() {
    const p = this.particles;
    let active = 0, widest = 0;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      root.retained = false; root.score = 0;
      if (root.count < 2 || root.merging) continue;
      let area = 0, length = 0;
      for (let joint = 1; joint < root.count; joint++) {
        const id = root.ids[joint], segment = p.length[id];
        area += p.radius[id] * segment; length += segment;
      }
      root.width = area / Math.max(1, length);
      root.totalLength = length;
      root.score = root.width * (0.6 + Math.min(1, length / Math.hypot(this.width, this.height))) / (1 + root.depth * 0.25);
      const middle = root.ids[Math.floor(root.count / 2)];
      root.centerX = p.x[middle]; root.centerY = p.y[middle];
      widest = Math.max(widest, root.width); active++;
    }
    // Keep a perimeter trunk in each direction, then the largest remaining bodies.
    let retained = 0;
    for (let edge = 0; edge < 4; edge++) {
      let best = -1;
      for (let index = edge; index < this.rootCount; index += 4) {
        const root = this.roots[index];
        if (root.count > 1 && root.depth === 0 && !root.merging && (best < 0 || root.score > this.roots[best].score)) best = index;
      }
      if (best >= 0) { this.roots[best].retained = true; retained++; }
    }
    const target = Math.min(active, this.config.branchingProbability > 0
      ? Math.min(this.matureRootTarget(), Math.max(8, Math.ceil(active * 0.45))) : 4);
    while (retained < target) {
      let best = -1;
      for (let index = 0; index < this.rootCount; index++) {
        const root = this.roots[index];
        if (root.count > 1 && !root.retained && !root.merging && (best < 0 || root.score > this.roots[best].score)) best = index;
      }
      if (best < 0) break;
      this.roots[best].retained = true; retained++;
    }
    for (let index = 0; index < this.rootCount; index++) {
      if (!this.roots[index].retained) continue;
      let parent = this.roots[index].parentJoint >= 0 ? this.roots[index].parentRoot : -1;
      while (parent >= 0) {
        const root = this.roots[parent]; root.retained = true;
        parent = root.parentJoint >= 0 ? root.parentRoot : -1;
      }
    }
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.retained) {
        root.bulk = Math.max(1, widest * 0.8 / Math.max(0.1, root.width));
        root.targetReached = false;
        if (root.depth === 0) this.chooseTarget(root, index);
      }
    }
    this.maturation = "CONSOLIDATING";
    this.consolidationAge = this.age;
    this.nextCull = this.age;
    this.nextFork = this.age + 2;
  }

  /** Frame cost can advance the same growth transition without changing visual fidelity. */
  consolidateEarly() {
    if (this.maturation === "SPREADING" && this.age >= 8 && isGrowing(this.state)) this.beginConsolidation();
  }

  private consolidate() {
    if (this.age < this.nextCull) return;
    this.nextCull = this.age + 0.3;
    this.updateFrontier();
    let remaining = 0, merging = 0;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.count > 1 && !root.retained) remaining++;
      if (root.merging) merging++;
    }
    if (!remaining) { this.maturation = "SWELLING"; return; }
    let started = 0;
    for (let index = 0; index < this.rootCount && started < 4 && merging < 12; index++) {
      const root = this.roots[index];
      if (root.count < 2 || root.retained || root.merging || root.children > 0 || (this.held >= 0 && (this.particles.root[this.held] === index || root.parentJoint === this.held))) continue;
      let target = root.parentJoint >= 0 ? root.parentRoot : -1;
      if (target < 0) {
        let nearest = Infinity;
        for (let candidate = 0; candidate < this.rootCount; candidate++) {
          const trunk = this.roots[candidate];
          if (!trunk.retained || trunk.count < 2) continue;
          const dx = root.centerX - trunk.centerX, dy = root.centerY - trunk.centerY;
          const distance = dx * dx + dy * dy;
          if (distance < nearest) { nearest = distance; target = candidate; }
        }
      }
      if (target < 0 || this.roots[target].merging) continue;
      this.beginMerge(root, target); started++; merging++;
    }
    if (started) this.emit("crawl");
  }

  /** Coarse tissue occupancy is refreshed at fork intervals, never during rendering. */
  private measureCoverage() {
    const p = this.particles;
    this.coverage.fill(0); this.coverageOwner.fill(-1); this.reservations.fill(0);
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (!root.retained || root.merging || root.count < 2) continue;
      if (!root.targetReached) {
        const column = Math.max(0, Math.min(this.coverageColumns - 1, Math.floor(root.targetX / COVERAGE_CELL)));
        const row = Math.max(0, Math.min(this.coverageRows - 1, Math.floor(root.targetY / COVERAGE_CELL)));
        this.reservations[row * this.coverageColumns + column] = 1;
      }
      let width = 0, length = 0, samples = 0;
      for (let joint = 1; joint < root.count; joint += 4) {
        const id = root.ids[joint], radius = p.radius[id] + 12;
        width += p.radius[id]; length += p.length[id]; samples++;
        const left = Math.max(0, Math.floor((p.x[id] - radius) / COVERAGE_CELL));
        const right = Math.min(this.coverageColumns - 1, Math.floor((p.x[id] + radius) / COVERAGE_CELL));
        const top = Math.max(0, Math.floor((p.y[id] - radius) / COVERAGE_CELL));
        const bottom = Math.min(this.coverageRows - 1, Math.floor((p.y[id] + radius) / COVERAGE_CELL));
        for (let row = top; row <= bottom; row++) for (let column = left; column <= right; column++) {
          const cell = row * this.coverageColumns + column;
          if (this.coverageOwner[cell] === index) continue;
          const x = Math.min(this.width - 8, (column + 0.5) * COVERAGE_CELL);
          const y = Math.min(this.height - 8, (row + 0.5) * COVERAGE_CELL);
          if ((x - p.x[id]) ** 2 + (y - p.y[id]) ** 2 > radius * radius) continue;
          this.coverageOwner[cell] = index;
          if (this.coverage[cell] < 255) this.coverage[cell]++;
        }
      }
      root.width = width / Math.max(1, samples);
      root.totalLength = length * (root.count - 1) / Math.max(1, samples);
      const middle = root.ids[Math.floor(root.count / 2)];
      root.centerX = p.x[middle]; root.centerY = p.y[middle];
    }
    this.coveredCells = 0;
    for (const count of this.coverage) if (count) this.coveredCells++;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (!root.retained || root.count < 2) continue;
      let unique = 0, samples = 0;
      for (let joint = 1; joint < root.count; joint += 4) {
        const id = root.ids[joint];
        const column = Math.max(0, Math.min(this.coverageColumns - 1, Math.floor(p.x[id] / COVERAGE_CELL)));
        const row = Math.max(0, Math.min(this.coverageRows - 1, Math.floor(p.y[id] / COVERAGE_CELL)));
        if (this.coverage[row * this.coverageColumns + column] <= 1) unique++;
        samples++;
      }
      root.exposure = unique / Math.max(1, samples);
    }
  }

  /** A few thick forks keep occupying open space; crowded leaves supply their parents with tissue. */
  private renewForks() {
    if (this.age < this.nextFork || this.config.branchingProbability === 0) return;
    this.nextFork = this.age + 2.2 / Math.sqrt(this.config.growthSpeed);
    this.updateFrontier(); this.measureCoverage();
    let target = -1, furthest = -1, retained = 0, crowded = -1, score = -1;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (!root.retained || root.merging || root.count < 2) continue;
      retained++;
      if (root.depth === 0 || root.worm || root.children > 0 || this.age - root.born < 10 || root.exposure > 0.4 || (this.held >= 0 && this.particles.root[this.held] === index)) continue;
      const value = (1 - root.exposure) * (this.age - root.born) / (1 + root.width);
      if (value > score) { crowded = index; score = value; }
    }
    for (let cell = 0; cell < this.coverage.length; cell++) {
      if (this.coverage[cell] || this.reservations[cell]) continue;
      const x = Math.min(this.width - 8, (cell % this.coverageColumns + 0.5) * COVERAGE_CELL);
      const y = Math.min(this.height - 8, (Math.floor(cell / this.coverageColumns) + 0.5) * COVERAGE_CELL);
      this.field.sample(x, y);
      if (this.field.distance < 18) continue;
      const distance = (x - this.originX) ** 2 + (y - this.originY) ** 2;
      if (distance > furthest) { furthest = distance; target = cell; }
    }
    if (this.random() > Math.min(1, this.config.branchingProbability / 0.075)) return;
    const desired = this.matureRootTarget();
    const absorb = retained >= desired && crowded >= 0;
    if (!absorb && retained >= desired + 4) return;
    let x: number, y: number;
    if (target >= 0) {
      x = Math.min(this.width - 8, (target % this.coverageColumns + 0.5) * COVERAGE_CELL);
      y = Math.min(this.height - 8, (Math.floor(target / this.coverageColumns) + 0.5) * COVERAGE_CELL);
    } else {
      if (this.pressure <= 0 || crowded < 0) return;
      // Fully occupied tissue keeps making thick escape forks instead of freezing its topology.
      const edge = this.branchCount % 4;
      const position = 0.15 + (this.branchCount * 0.61803398875 % 1) * 0.7;
      const reach = Math.min(this.width, this.height) * (0.12 + 0.18 * (1 - Math.exp(-this.pressure / 12)));
      x = edge === 0 ? -reach : edge === 2 ? this.width + reach : this.width * position;
      y = edge === 1 ? -reach : edge === 3 ? this.height + reach : this.height * position;
    }
    let parent = -1, anchor = -1, nearest = Infinity;
    const p = this.particles;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (!root.retained || root.merging || root.worm || root.depth !== this.growthFrontier || root.children >= 4 || root.count < 14 || (absorb && index === crowded)) continue;
      for (let joint = 8; joint < root.count - 4; joint += 8) {
        const id = root.ids[joint], distance = (p.x[id] - x) ** 2 + (p.y[id] - y) ** 2;
        if (distance < 3600 || distance >= nearest) continue;
        nearest = distance; parent = index; anchor = id;
      }
    }
    if (parent < 0) return;
    if (absorb) {
      const root = this.roots[crowded];
      root.retained = false;
      this.beginMerge(root, root.parentRoot);
    }
    const index = this.spawn(parent, anchor);
    if (index === undefined) return;
    const root = this.roots[index];
    root.targetX = x; root.targetY = y;
    root.angle = Math.atan2(y - p.y[anchor], x - p.x[anchor]);
    root.limit = Math.max(24, Math.ceil(Math.sqrt(nearest) / (SEGMENT * (1 + this.age * 0.012))) + 16);
  }

  private beginMerge(root: ReturnType<typeof makeRoot>, target: number) {
    const p = this.particles, parent = this.roots[target];
    root.merging = true; root.mergeTarget = target;
    root.mergeAge = this.age; root.mergedVolume = 0;
    root.mergeJoint = target === root.parentRoot && root.parentJoint >= 0 ? parent.ids.indexOf(root.parentJoint) : -1;
    if (root.mergeJoint < 0) {
      let nearest = Infinity;
      const source = root.ids[Math.floor(root.count / 2)];
      for (let joint = 0; joint < parent.count; joint++) {
        const id = parent.ids[joint], dx = p.x[id] - p.x[source], dy = p.y[id] - p.y[source];
        const distance = dx * dx + dy * dy;
        if (distance < nearest) { nearest = distance; root.mergeJoint = joint; }
      }
    }
    for (let joint = 0; joint < root.count; joint++) {
      const id = root.ids[joint];
      root.pathX[joint] = p.x[id]; root.pathY[joint] = p.y[id];
      if (joint > 0 || root.parentJoint < 0) {
        // A mature fork borrows its birth girth. Returning that girth as new tissue causes exponential feedback.
        const inherited = root.born >= this.consolidationAge && this.maturation !== "SPREADING" ? p.baseRadius[id] ** 2 : 0;
        root.mergedVolume += Math.max(0, p.radius[id] ** 2 - inherited) * Math.max(1, p.length[id]);
      }
    }
  }

  private merge(root: ReturnType<typeof makeRoot>) {
    const p = this.particles, parent = this.roots[root.mergeTarget];
    const time = Math.min(1, (this.age - root.mergeAge) / 1.8);
    const previous = Math.max(0, time - FIXED_STEP / 1.8);
    const ease = time * time * (3 - 2 * time);
    const flow = ease - previous * previous * (3 - 2 * previous);
    const anchor = root.ids[0];
    const offsetX = root.parentJoint >= 0 ? p.x[anchor] - root.pathX[0] : 0;
    const offsetY = root.parentJoint >= 0 ? p.y[anchor] - root.pathY[0] : 0;
    for (let joint = root.parentJoint >= 0 ? 1 : 0; joint < root.count; joint++) {
      const id = root.ids[joint];
      const destination = parent.ids[Math.min(parent.count - 1, root.mergeJoint + Math.floor(joint * 0.45))];
      p.x[id] = (root.pathX[joint] + offsetX) * (1 - ease) + p.x[destination] * ease;
      p.y[id] = (root.pathY[joint] + offsetY) * (1 - ease) + p.y[destination] * ease;
      p.previousX[id] = p.x[id]; p.previousY[id] = p.y[id];
    }
    const first = Math.max(0, root.mergeJoint - 18), last = Math.min(parent.count - 1, root.mergeJoint + 24);
    let weight = 0;
    for (let joint = first; joint <= last; joint++) weight += Math.max(1, p.length[parent.ids[joint]]) / (1 + Math.abs(joint - root.mergeJoint) * 0.12);
    for (let joint = first; joint <= last; joint++) {
      const id = parent.ids[joint];
      p.tissue[id] += root.mergedVolume * flow / Math.max(1, weight) / (1 + Math.abs(joint - root.mergeJoint) * 0.12);
    }
    this.absorbedVolume += root.mergedVolume * flow;
    if (time >= 1) {
      for (let joint = root.parentJoint >= 0 ? 1 : 0; joint < root.count; joint++) p.release(root.ids[joint]);
      if (this.maturation !== "SPREADING") this.culledRoots++;
      root.count = 0; root.merging = false;
      this.recycledBranches++;
    }
  }

  private grow() {
    const p = this.particles;
    const intensity = Math.min(1, this.age / (this.config.fullInfectionDelay / 1000));
    const speed = this.config.growthSpeed * (0.35 + intensity * 1.65);
    const spreading = this.maturation === "SPREADING";
    if (spreading) { this.updateFrontier(); this.recycle(); }
    else if (this.maturation === "CONSOLIDATING") this.consolidate();
    if (!spreading) this.renewForks();
    this.wrappedTips = 0;
    if (spreading && this.age >= this.nextSpawn) {
      if (this.rootCount < Math.min(6, this.config.maxRoots) || this.random() < Math.min(1, this.config.branchingProbability / 0.075)) this.spawn();
      this.nextSpawn = this.age + Math.max(0.18, 0.6 - intensity * 0.4);
    }
    if (this.age >= this.nextCrawl) {
      this.emit("crawl");
      this.nextCrawl = this.age + 0.5 + this.random();
    }
    const growingRoots = this.rootCount;
    for (let offset = 0; offset < growingRoots; offset++) {
      const index = (offset + this.tick) % growingRoots;
      const root = this.roots[index];
      if (root.count < 2) continue;
      const tip = root.ids[root.count - 1];
      if (root.merging) { this.merge(root); continue; }
      const targetDistance = Math.hypot(p.x[tip] - root.targetX, p.y[tip] - root.targetY);
      const edgeReached = (root.targetX < 16 && p.x[tip] < 32) || (root.targetX > this.width - 16 && p.x[tip] > this.width - 32)
        || (root.targetY < 16 && p.y[tip] < 32) || (root.targetY > this.height - 16 && p.y[tip] > this.height - 32);
      if (root.depth === 0 ? edgeReached : targetDistance < 28) root.targetReached = true;
      const anchor = root.ids[0];
      const reach = Math.hypot(root.targetX - p.x[anchor], root.targetY - p.y[anchor]);
      const pathBudget = Math.max(128, reach * 1.4 + 64 + root.width);
      const advancing = root.retained && !root.targetReached;
      const expanding = spreading || (advancing && root.totalLength < pathBudget);
      if (this.age >= root.nextTurn) {
        if (spreading && ((root.depth > 0 && this.random() < 0.3) || targetDistance < 50)) this.chooseTarget(root, index + 7);
        root.nextTurn = this.age + 1.5 + this.random() * 2;
      }
      const targetAngle = Math.atan2(root.targetY - p.y[tip], root.targetX - p.x[tip]);
      const delta = Math.atan2(Math.sin(targetAngle - root.angle), Math.cos(targetAngle - root.angle));
      const flexibility = 1 / (1 + p.radius[tip] * 0.025);
      root.angle += (delta * 0.018 + Math.sin(this.age * 1.3 + root.phase) * 0.012) * flexibility;
      this.field.sample(p.x[tip], p.y[tip]);
      if (this.field.distance < 22) {
        const nx = this.field.normalX, ny = this.field.normalY;
        const dx = Math.cos(root.angle), dy = Math.sin(root.angle);
        const direction = dx * -ny + dy * nx >= 0 ? 1 : -1;
        if (root.surfaceUntil < this.age && root.count > 8) {
          root.surfaceUntil = this.age + 2.5 + root.phase * 0.3;
          root.surfaceDirection = direction;
        }
        const wrapping = root.surfaceUntil > this.age;
        const tangent = Math.atan2(nx * root.surfaceDirection + ny * 0.12, -ny * root.surfaceDirection + nx * 0.12);
        root.angle += Math.atan2(Math.sin(tangent - root.angle), Math.cos(tangent - root.angle)) * 0.18;
        if (wrapping) {
          this.wrappedTips++;
          const attraction = Math.max(-6, Math.min(12, this.field.distance - p.radius[tip] - 1)) * 210;
          p.x[tip] -= nx * attraction * FIXED_STEP * FIXED_STEP;
          p.y[tip] -= ny * attraction * FIXED_STEP * FIXED_STEP;
        }
      }
      const margin = 24 + Math.min(32, this.pressure * 6);
      const containment = 0.12 / (1 + this.pressure * 0.7);
      if (p.x[tip] < margin) root.angle += Math.atan2(-Math.sin(root.angle), 1 - Math.cos(root.angle)) * containment;
      if (p.x[tip] > this.width - margin) root.angle += Math.atan2(-Math.sin(root.angle), -1 - Math.cos(root.angle)) * containment;
      if (p.y[tip] < margin) root.angle += Math.atan2(1 - Math.sin(root.angle), -Math.cos(root.angle)) * containment;
      if (p.y[tip] > this.height - margin) root.angle += Math.atan2(-1 - Math.sin(root.angle), -Math.cos(root.angle)) * containment;
      // A soft head motor advances the chain; mature particles resist being dragged.
      const canGrow = expanding && p.used < p.limit - 40 && root.count < root.limit;
      const drive = (root.worm ? 1900 : canGrow || advancing ? 1250 : 30 + Math.min(240, this.pressure * 35)) * speed * root.speed;
      p.x[tip] += Math.cos(root.angle) * drive * FIXED_STEP * FIXED_STEP;
      p.y[tip] += Math.sin(root.angle) * drive * FIXED_STEP * FIXED_STEP;
      if (!expanding || this.age < root.nextGrowth) continue;
      root.nextGrowth = this.age + 0.09 * Math.sqrt(1 + this.age / 12) / (speed * root.speed);
      if (p.growth[tip] < 0.85) continue;
      this.extend(root, index);
      if (spreading && root.depth === this.growthFrontier && root.children < 4 && root.count > 12 && this.random() < this.config.branchingProbability) {
        const joint = root.ids[Math.max(3, root.count - 5 - Math.floor(this.random() * 5))];
        this.spawn(index, joint);
      }
      // Rare development events are evaluated at growth intervals, not every frame.
      if (spreading && !root.worm && root.depth > 0 && root.count > 26 && this.random() < 0.0025) this.detach(root, index);
      if (root.count >= root.limit && this.random() < 0.12) root.limit += 12;
    }
  }

  private detach(root: ReturnType<typeof makeRoot>, index: number) {
    const p = this.particles, old = root.ids[0];
    const id = p.acquire(p.x[old], p.y[old], p.radius[old] * 0.8, index);
    if (id < 0) return;
    root.ids[0] = id;
    p.born[id] = this.age;
    p.parent[root.ids[1]] = id;
    p.inverseMass[id] = 0.6;
    root.worm = true;
    root.parentJoint = -1;
    this.wormCount++;
  }

  private integrate(exploding: boolean) {
    const p = this.particles;
    for (let slot = p.used - 1; slot >= 0; slot--) {
      const id = p.active[slot];
      if (!p.alive[id]) continue;
      const owner = p.root[id];
      if (!exploding && owner >= 0) {
        const root = this.roots[owner];
        const maturity = Math.max(0, this.age - p.born[id]);
        const radius = p.baseRadius[id] + maturity * this.config.particleRadius * root.thickness * 0.032;
        const merging = root.merging ? 1 - Math.min(1, (this.age - root.mergeAge) / 1.8) * 0.8 : 1;
        const settling = root.retained ? Math.min(1, Math.max(0, this.age - this.consolidationAge) / 10) : 0;
        const bulk = 1 + (root.bulk - 1) * settling * settling * (3 - 2 * settling);
        // Transferred tissue is actual area. Apply it once, after radial growth and support thickening.
        p.radius[id] = Math.sqrt((radius * bulk) ** 2 + p.tissue[id]) * merging;
        if (root.merging) continue;
      }
      if (!p.inverseMass[id]) continue;
      const damping = exploding ? 0.995 : 0.78;
      let vx = (p.x[id] - p.previousX[id]) * damping;
      let vy = (p.y[id] - p.previousY[id]) * damping;
      const velocity = Math.hypot(vx, vy), limit = exploding ? 22 : 5;
      if (velocity > limit) { vx *= limit / velocity; vy *= limit / velocity; }
      p.previousX[id] = p.x[id]; p.previousY[id] = p.y[id];
      p.x[id] += vx;
      p.y[id] += vy + (exploding ? 1150 : 4) * FIXED_STEP * FIXED_STEP;
      if (!exploding) {
        p.growth[id] = Math.min(1, p.growth[id] + FIXED_STEP * 9 * this.config.growthSpeed);
        const root = this.roots[p.root[id]];
        const maturity = Math.max(0, this.age - p.born[id]);
        const extension = 1 + 0.45 * (1 - Math.exp(-maturity / 24)) + p.born[id] * 0.012;
        if (!root.merging || id !== root.ids[root.count - 1]) p.length[id] = 0.7 + p.growth[id] * (SEGMENT * extension - 0.7);
        const edge = Math.min(p.x[id], this.width - p.x[id], p.y[id], this.height - p.y[id]);
        const crowding = Math.max(0, 1 - edge / 85) * Math.min(1, this.pressure * 0.2);
        const struggle = Math.sin(this.age * (4 + root.speed) + id * 0.19 + root.phase);
        const wave = Math.sin(this.age * 3 + id * 0.47 + root.phase) * (root.worm ? 130 : 12) + crowding * struggle * 240;
        if (crowding > 0) {
          p.x[id] += (p.x[id] < this.width / 2 ? -1 : 1) * crowding * 80 * FIXED_STEP ** 2;
          p.y[id] += (p.y[id] < this.height / 2 ? -1 : 1) * crowding * 80 * FIXED_STEP ** 2;
        }
        p.x[id] += Math.sin(root.angle) * wave * FIXED_STEP * FIXED_STEP;
        p.y[id] -= Math.cos(root.angle) * wave * FIXED_STEP * FIXED_STEP;
        p.x[id] += this.gust * (0.4 + Math.sin(id * 0.21) * 0.2) * FIXED_STEP * FIXED_STEP;
      } else if (p.y[id] - p.radius[id] * 1.2 > this.height + 60) {
        p.release(id);
        if (id % 67 === 0) this.emit("debris");
      }
    }
  }

  private distance(a: number, b: number, length: number, strength = 1) {
    const p = this.particles;
    const mass = p.inverseMass[a] + p.inverseMass[b];
    if (mass <= 0) return;
    const dx = p.x[b] - p.x[a], dy = p.y[b] - p.y[a];
    const distance = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
    const correction = (distance - length) / distance * strength;
    p.x[a] += dx * correction * p.inverseMass[a] / mass;
    p.y[a] += dy * correction * p.inverseMass[a] / mass;
    p.x[b] -= dx * correction * p.inverseMass[b] / mass;
    p.y[b] -= dy * correction * p.inverseMass[b] / mass;
  }

  /** Correct excessive turning directly. Distance-only bending lets a swelling chain fold into tiny loops. */
  private bend(a: number, b: number, c: number) {
    const p = this.particles;
    const ux = p.x[b] - p.x[a], uy = p.y[b] - p.y[a];
    const vx = p.x[c] - p.x[b], vy = p.y[c] - p.y[b];
    const u2 = ux * ux + uy * uy, v2 = vx * vx + vy * vy;
    if (u2 < 0.01 || v2 < 0.01) return;
    const segment = (p.length[b] + p.length[c]) * 0.5;
    const maximum = Math.min(0.9, segment / Math.max(28, p.radius[b] * 1.85));
    const dot = ux * vx + uy * vy;
    if (dot > 0 && dot * dot >= u2 * v2 * (1 - maximum * maximum)) return;
    const turn = Math.atan2(ux * vy - uy * vx, dot);
    if (Math.abs(turn) <= maximum) return;
    const ax = -uy / u2, ay = ux / u2;
    const cx = -vy / v2, cy = vx / v2;
    const bx = -ax - cx, by = -ay - cy;
    const mass = p.inverseMass[a] / u2 + p.inverseMass[c] / v2 + p.inverseMass[b] * (bx * bx + by * by);
    if (mass <= 0) return;
    const strength = 0.45 + Math.min(0.4, p.radius[b] / 160);
    const correction = (turn - Math.sign(turn) * maximum) * strength / mass;
    p.x[a] -= ax * correction * p.inverseMass[a]; p.y[a] -= ay * correction * p.inverseMass[a];
    p.x[b] -= bx * correction * p.inverseMass[b]; p.y[b] -= by * correction * p.inverseMass[b];
    p.x[c] -= cx * correction * p.inverseMass[c]; p.y[c] -= cy * correction * p.inverseMass[c];
  }

  private constrain(exploding: boolean) {
    const p = this.particles;
    for (let pass = 0; pass < (exploding ? 3 : this.iterations); pass++) {
      if (this.held >= 0) {
        p.x[this.held] = p.previousX[this.held] = this.heldX;
        p.y[this.held] = p.previousY[this.held] = this.heldY;
      }
      // Alternating traversal distributes strain along long chains.
      const backward = pass % 2 === 1;
      for (let n = 0; n < p.used; n++) {
        const id = p.active[backward ? p.used - n - 1 : n];
        const parent = p.parent[id];
        if (!p.alive[id] || !p.connected[id] || parent < 0 || !p.alive[parent] || (!exploding && this.roots[p.root[id]].merging)) continue;
        this.distance(parent, id, p.length[id]);
        const grandparent = p.parent[parent];
        if (!exploding && grandparent >= 0 && p.root[id] === p.root[parent]) {
          this.bend(grandparent, parent, id);
        }
      }
    }
  }

  private surfaces() {
    const p = this.particles;
    for (let slot = p.used - 1; slot >= 0; slot--) {
      const id = p.active[slot];
      if (!p.alive[id] || !p.inverseMass[id] || this.roots[p.root[id]].merging) continue;
      const radius = Math.min(10, p.radius[id]);
      p.x[id] = Math.max(radius, Math.min(this.width - radius, p.x[id]));
      p.y[id] = Math.max(radius, Math.min(this.height - radius, p.y[id]));
      if ((id + this.tick) % this.surfaceEvery !== 0) continue;
      this.field.sample(p.x[id], p.y[id]);
      const distance = this.field.distance;
      p.collision[id] = distance < radius ? 1 : 0;
      if (distance < radius) {
        const push = Math.min(32, radius - distance);
        p.x[id] += this.field.normalX * push;
        p.y[id] += this.field.normalY * push;
        // Cancel inward velocity so a collision does not inject energy.
        p.previousX[id] = p.x[id]; p.previousY[id] = p.y[id];
      } else if (distance < radius + 12) {
        p.x[id] -= this.field.normalX * 0.035;
        p.y[id] -= this.field.normalY * 0.035;
      }
      if (distance < radius + 2 && id % 7 === 0) this.field.reactToContact(this.age, p.radius[id]);
    }
  }

  private capturePaths() {
    this.longestPath = 0;
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.count < 2) continue;
      for (let joint = 0; joint < root.count; joint++) {
        const id = root.ids[joint];
        root.pathX[joint] = this.particles.x[id]; root.pathY[joint] = this.particles.y[id];
        root.pathDistance[joint] = joint === 0 ? 0 : root.pathDistance[joint - 1] + Math.hypot(root.pathX[joint] - root.pathX[joint - 1], root.pathY[joint] - root.pathY[joint - 1]);
      }
      this.longestPath = Math.max(this.longestPath, root.pathDistance[root.count - 1]);
    }
  }

  private retract() {
    const p = this.particles;
    let remaining = false;
    for (let depth = 0; depth <= this.deepestGeneration; depth++) {
    for (let index = 0; index < this.rootCount; index++) {
      const root = this.roots[index];
      if (root.count < 2 || root.depth !== depth) continue;
      const time = Math.max(0, this.stateAge - root.depth * 0.025);
      const travel = (260 + this.longestPath * 0.6) * time + (1600 + this.longestPath * 3) * time * time;
      const anchor = root.ids[0];
      const offsetX = root.parentJoint >= 0 ? p.x[anchor] - root.pathX[0] : (this.originX - root.pathX[0]) * Math.min(1, time * 2);
      const offsetY = root.parentJoint >= 0 ? p.y[anchor] - root.pathY[0] : (this.originY - root.pathY[0]) * Math.min(1, time * 2);
      let cursor = 0;
      for (let joint = root.parentJoint >= 0 ? 1 : 0; joint < root.count; joint++) {
        const id = root.ids[joint];
        const position = Math.max(0, root.pathDistance[joint] - travel);
        while (cursor + 1 < root.count - 1 && root.pathDistance[cursor + 1] < position) cursor++;
        const length = Math.max(0.001, root.pathDistance[cursor + 1] - root.pathDistance[cursor]);
        const amount = Math.min(1, (position - root.pathDistance[cursor]) / length);
        p.previousX[id] = p.x[id]; p.previousY[id] = p.y[id];
        p.x[id] = root.pathX[cursor] + (root.pathX[cursor + 1] - root.pathX[cursor]) * amount + offsetX;
        p.y[id] = root.pathY[cursor] + (root.pathY[cursor + 1] - root.pathY[cursor]) * amount + offsetY;
        p.alive[id] = position > 0.5 ? 1 : 0;
        if (position > 0.5) remaining = true;
      }
    }
    }
    if (!remaining) this.reset();
  }

  step() {
    if (this.state === "IDLE") return;
    this.particles.saveRenderPositions();
    this.age += FIXED_STEP; this.stateAge += FIXED_STEP; this.tick++;
    this.gust *= 0.97;
    this.pressure = Math.max(0, this.age / (this.config.fullInfectionDelay / 1000) - 1);
    if (this.state === "RETRACTING") { this.retract(); return; }
    const exploding = this.state === "EXPLODING";
    if (!exploding) {
      if (this.state === "AWAKENING" && this.age >= Math.min(3, this.config.fullInfectionDelay / 4000)) { this.state = "INFESTING"; this.stateAge = 0; }
      if (this.state === "INFESTING" && this.age >= this.config.fullInfectionDelay / 1000) { this.state = "FULL_INFECTION"; this.stateAge = 0; }
      if (this.maturation === "SPREADING" && this.age >= Math.max(8, this.config.fullInfectionDelay / 2000)) this.beginConsolidation();
      this.integrate(false);
      this.grow();
      if (this.tick % this.collisionEvery === 0) this.hash.repel(this.particles);
      this.constrain(false);
      this.surfaces();
    } else {
      this.integrate(true);
      this.constrain(true);
      let remaining = false;
      for (let slot = 0; slot < this.particles.used; slot++) if (this.particles.alive[this.particles.active[slot]]) { remaining = true; break; }
      if (!remaining) this.reset();
    }
  }

  inspect() {
    const p = this.particles;
    let alive = 0, finite = true, error = 0, maxRadius = 0, activeRoots = 0;
    for (let index = 0; index < this.rootCount; index++) if (this.roots[index].count > 1) activeRoots++;
    let left = this.width, right = 0, top = this.height, bottom = 0;
    for (let slot = p.used - 1; slot >= 0; slot--) {
      const id = p.active[slot];
      if (!p.alive[id]) continue;
      alive++;
      maxRadius = Math.max(maxRadius, p.radius[id]);
      finite &&= Number.isFinite(p.x[id]) && Number.isFinite(p.y[id]) && Number.isFinite(p.radius[id]);
      left = Math.min(left, p.x[id]); right = Math.max(right, p.x[id]);
      top = Math.min(top, p.y[id]); bottom = Math.max(bottom, p.y[id]);
      const parent = p.parent[id];
      if (p.connected[id] && parent >= 0 && p.alive[parent] && !this.roots[p.root[id]]?.merging) error = Math.max(error, Math.abs(Math.hypot(p.x[id] - p.x[parent], p.y[id] - p.y[parent]) - p.length[id]));
    }
    return { state: this.state, maturation: this.maturation, culledRoots: this.culledRoots, age: this.age, roots: activeRoots, particles: alive, allocatedParticles: p.count, particleCapacity: p.capacity, alive, branches: this.branchCount, worms: this.wormCount, recycledBranches: this.recycledBranches, absorbedVolume: this.absorbedVolume, growthFrontier: this.growthFrontier, pressure: this.pressure, wrappedTips: this.wrappedTips, maxRadius, held: this.held, finite, maxConstraintError: error, coarseCoverage: this.coveredCells / this.coverage.length,
      bounds: { left, right, top, bottom }, iterations: this.iterations, collisionEvery: this.collisionEvery };
  }

  hold(x: number, y: number) {
    if (!isGrowing(this.state)) return false;
    const p = this.particles;
    let closest = -1, distance = 24;
    // One query on pointerdown; animation frames never scan for a selection.
    for (let slot = p.used - 1; slot >= 0; slot--) {
      const id = p.active[slot];
      if (!p.alive[id] || !p.inverseMass[id] || this.roots[p.root[id]]?.merging) continue;
      const d = Math.hypot(x - p.x[id], y - p.y[id]);
      if (d < distance) { closest = id; distance = d; }
    }
    if (closest < 0) return false;
    this.held = closest; this.heldMass = p.inverseMass[closest];
    p.inverseMass[closest] = 0;
    this.moveHeld(x, y);
    return true;
  }

  moveHeld(x: number, y: number) {
    this.heldX = Math.max(2, Math.min(this.width - 2, x));
    this.heldY = Math.max(2, Math.min(this.height - 2, y));
  }

  release() {
    if (this.held >= 0) this.particles.inverseMass[this.held] = this.heldMass;
    this.held = -1;
  }

  disturb(x: number, y: number) {
    const p = this.particles, hash = this.hash;
    const column = Math.floor(x / hash.cellSize), row = Math.floor(y / hash.cellSize);
    let checked = 0;
    for (let yy = Math.max(0, row - 2); yy <= Math.min(hash.rows - 1, row + 2); yy++) {
      for (let xx = Math.max(0, column - 2); xx <= Math.min(hash.columns - 1, column + 2); xx++) {
        for (let id = hash.heads[yy * hash.columns + xx]; id >= 0 && checked < 300; id = hash.next[id]) {
          checked++;
          if (!p.alive[id] || !p.inverseMass[id]) continue;
          const dx = p.x[id] - x, dy = p.y[id] - y, distance = Math.max(1, Math.hypot(dx, dy));
          if (distance > 55) continue;
          const push = (1 - distance / 55) * 0.5;
          p.previousX[id] -= dx / distance * push;
          p.previousY[id] -= dy / distance * push;
        }
      }
    }
  }

  pushFromScroll(delta: number) { this.gust = Math.max(-800, Math.min(800, this.gust + delta * 8)); }
}
