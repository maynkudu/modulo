import assert from "node:assert/strict";
import { PhysicsWorld } from "../src/registry/root-infection/engine/world";
import { ParticlePool } from "../src/registry/root-infection/engine/particles";
import { SpatialHash } from "../src/registry/root-infection/engine/spatial-hash";
import { CollisionField } from "../src/registry/root-infection/engine/collision-field";
import { RootGeometry } from "../src/registry/root-infection/rendering/root-geometry";
import { configure, type RootInfectionProps } from "../src/registry/root-infection/types";

function makeWorld(options: RootInfectionProps = {}) {
  const world = new PhysicsWorld(configure({ maxRoots: 140, maxParticles: 5600, ...options }));
  world.resize(1280, 800);
  world.awaken(640, 430);
  return world;
}

function advance(world: PhysicsWorld, seconds: number) {
  for (let step = 0; step < seconds * 60; step++) world.step();
}

const cases: [string, () => void][] = [
  ["deterministic progression, branching, limits, and viewport spread", () => {
    const a = makeWorld(), b = makeWorld();
    assert.equal(a.state, "AWAKENING");
    advance(a, 4);
    assert.equal(a.state, "INFESTING");
    const early = a.inspect();
    advance(a, 28); advance(b, 32);
    const final = a.inspect();
    assert.equal(final.state, "FULL_INFECTION");
    assert(final.particles > early.particles);
    assert(final.branches > 20);
    assert(final.roots <= a.config.maxRoots && final.particles <= a.config.maxParticles);
    assert(final.finite);
    assert(final.maxConstraintError < 3);
    assert(final.bounds.right - final.bounds.left > 1100);
    assert(final.bounds.bottom - final.bounds.top > 680);
    assert.deepEqual(final, b.inspect());
    assert.deepEqual(a.particles.x, b.particles.x);
  }],
  ["retraction follows the root path and rejects a conflicting impact", () => {
    const world = makeWorld({ branchingProbability: 0, maxRoots: 1 });
    advance(world, 12);
    const root = world.roots[0], tip = root.ids[root.count - 1];
    const originalX = world.particles.x[tip], originalY = world.particles.y[tip];
    assert(world.react("RETRACTING"));
    assert.equal(world.react("EXPLODING"), false);
    advance(world, 0.1);
    assert.equal(world.state, "RETRACTING");
    const dx = world.particles.x[tip] - originalX, dy = world.particles.y[tip] - originalY;
    assert(Math.hypot(dx, dy) > 5);
    advance(world, 2);
    assert.equal(world.state, "IDLE");
    assert.equal(world.particles.count, 0);
  }],
  ["explosion cuts constraints, moves fragments, and removes them below the screen", () => {
    const world = makeWorld({ maxRoots: 40, maxParticles: 2000 });
    advance(world, 10);
    const p = world.particles, y = p.y[5], x = p.x[5];
    const connected = p.connected.reduce((sum, value) => sum + value, 0);
    assert(world.react("EXPLODING"));
    assert.equal(world.react("RETRACTING"), false);
    assert(p.connected.reduce((sum, value) => sum + value, 0) < connected);
    advance(world, 0.3);
    assert(Math.hypot(p.x[5] - x, p.y[5] - y) > 10);
    advance(world, 6);
    assert.equal(world.state, "IDLE");
    assert.equal(p.count, 0);
  }],
  ["distance queries, collision response, and local particle repulsion", () => {
    const field = new CollisionField();
    field.setObstacles([{ left: 100, top: 100, right: 200, bottom: 200 }], 400, 400);
    field.sample(95, 150);
    assert.equal(field.distance, 5); assert.equal(field.normalX, -1);
    field.sample(102, 150);
    assert.equal(field.distance, -2); assert.equal(field.normalX, -1);
    const world = makeWorld({ maxRoots: 1 });
    advance(world, 0.2);
    const p = world.particles, tip = world.roots[0].ids[1];
    world.field.setObstacles([{ left: 620, top: 410, right: 660, bottom: 450 }], 1280, 800);
    advance(world, 0.4);
    world.field.sample(p.x[tip], p.y[tip]);
    assert(world.field.distance >= -0.01);
    const pool = new ParticlePool(4), hash = new SpatialHash(4);
    hash.resize(400, 400);
    const a = pool.acquire(50, 50, 3, 0), b = pool.acquire(51, 50, 3, 1);
    pool.inverseMass[a] = pool.inverseMass[b] = 1;
    hash.repel(pool);
    assert(pool.x[b] - pool.x[a] > 1);
  }],
  ["full infection absorbs pre-existing thin roots and keeps growing the survivors", () => {
    const world = makeWorld();
    advance(world, 12.1);
    const early = world.inspect();
    const thin = world.roots.flatMap((root, index) => root.count > 1 && !root.retained ? [{ index, born: root.born }] : []);
    assert(thin.length > 0);
    advance(world, 36);
    const later = world.inspect();
    assert(later.maxRadius > early.maxRadius);
    assert(later.culledRoots > 0 && later.branches > early.branches);
    assert(thin.every(({ index, born }) => world.roots[index].count === 0 || world.roots[index].born !== born));
    assert(later.maturation === "SWELLING" && later.roots < early.roots && later.particles < early.particles);
    assert(later.roots > 4);
    assert(world.roots.every((root) => root.count < 2 || root.retained || root.merging));
    assert(later.particles <= world.config.maxParticles && later.finite);
    world.react("RETRACTING"); advance(world, 2);
    assert.equal(world.state, "IDLE");
  }],
  ["surface wrapping and a held particle transmit forces through connected roots", () => {
    const world = makeWorld({ maxRoots: 30, maxParticles: 1500 });
    world.field.setObstacles([{ left: 690, top: 360, right: 780, bottom: 430 }], 1280, 800);
    let wraps = 0;
    for (let step = 0; step < 1200; step++) { world.step(); wraps = Math.max(wraps, world.wrappedTips); }
    assert(wraps > 0);
    const root = world.roots.find((candidate) => candidate.count > 9 && candidate.retained);
    assert(root);
    const p = world.particles, id = root.ids[8], adjacent = root.ids[7];
    assert(world.hold(p.x[id], p.y[id]));
    const x = p.x[adjacent], y = p.y[adjacent];
    world.moveHeld(p.x[id] + 40, p.y[id] + 30);
    advance(world, 0.4);
    assert(Math.hypot(p.x[adjacent] - x, p.y[adjacent] - y) > 5);
    world.release();
    assert.equal(world.held, -1);
    world.pushFromScroll(30); advance(world, 1);
    assert(world.inspect().finite);
  }],
  ["breadth-first generations fill shallow sibling slots before deepening", () => {
    const world = makeWorld({ branchingProbability: 0.5, growthSpeed: 2 });
    let reachedSecondGeneration = false;
    for (let step = 0; step < 900; step++) {
      world.step();
      if (world.roots.some((root) => root.count > 1 && root.depth === 2)) {
        reachedSecondGeneration = true;
        for (const root of world.roots) if (root.count > 1 && root.depth === 0) assert.equal(root.children, 4);
        break;
      }
    }
    assert(reachedSecondGeneration);
  }],
  ["sibling fusion transfers tissue and uncapped thickness survives long infection", () => {
    const world = makeWorld({ maxRoots: 40, maxParticles: 1200 });
    let concurrentSiblings = false;
    for (let step = 0; step < 3600; step++) {
      world.step();
      const merging = world.roots.filter((root) => root.merging);
      if (merging.length > 1 && merging.some((root) => merging.some((sibling) => sibling !== root && sibling.parentRoot === root.parentRoot))) concurrentSiblings = true;
    }
    const earlier = world.inspect();
    assert(concurrentSiblings && earlier.absorbedVolume > 0);
    assert(world.roots.some((root) => root.depth === 0 && root.count > 1 && world.particles.tissue[root.ids[8]] > 0));
    advance(world, 120);
    const later = world.inspect();
    assert(later.maxRadius > earlier.maxRadius * 1.5 && later.pressure > earlier.pressure);
    assert(later.branches > earlier.branches && later.roots > 4);
    assert(later.finite && later.allocatedParticles <= 1200);
    world.react("EXPLODING"); advance(world, 7);
    assert.equal(world.state, "IDLE");
  }],
  ["resize and repeated cycles preserve finite positions and reuse storage", () => {
    const world = makeWorld({ maxRoots: 20, maxParticles: 1000 });
    const storage = world.particles.x.buffer;
    for (let cycle = 0; cycle < 6; cycle++) {
      if (cycle > 0) world.awaken(300, 300);
      advance(world, 7);
      world.resize(390, 844);
      advance(world, 0.4);
      assert(world.inspect().finite);
      world.react(cycle % 2 ? "EXPLODING" : "RETRACTING");
      world.resize(1280, 800);
      advance(world, 7);
      assert.equal(world.state, "IDLE");
      assert.equal(world.particles.x.buffer, storage);
    }
  }],
  ["default growth expands beyond the former root, particle, and chain ceilings", () => {
    const world = makeWorld({ maxRoots: Infinity, maxParticles: Infinity, growthSpeed: 4, physicsIterations: 2, fullInfectionDelay: 120000, branchingProbability: 0.3 });
    advance(world, 36);
    const result = world.inspect();
    assert(result.roots > 140 && result.particles > 5600);
    assert(world.roots[0].count > 180 && world.roots[0].ids.length > 180);
    assert(result.particleCapacity > 5600 && result.finite);
    const capacity = world.particles.capacity;
    world.react("RETRACTING"); advance(world, 3);
    assert.equal(world.state, "IDLE");
    assert.equal(world.particles.capacity, capacity);
    world.awaken(640, 430); advance(world, 1);
    assert(world.inspect().finite);
  }],
  ["new mature forks inherit substantial girth and continue appearing", () => {
    const world = makeWorld(), p = world.particles;
    advance(world, 14);
    let births = 0, firstRadius = 0, lastRadius = 0;
    for (let step = 0; step < 120 * 60; step++) {
      world.step();
      for (const root of world.roots) {
        if (root.count < 2 || root.parentJoint < 0 || Math.abs(root.born - world.age) > 0.0001) continue;
        const radius = p.baseRadius[root.ids[1]];
        assert(radius >= p.radius[root.parentJoint] * 0.55);
        assert(root.retained && !root.worm);
        if (births++ === 0) firstRadius = radius;
        lastRadius = Math.max(lastRadius, radius);
      }
    }
    assert(births >= 8 && lastRadius > firstRadius * 2);
    assert(world.inspect().finite);
  }],
  ["consolidation clears old branches and worms without orphaned joints", () => {
    const world = makeWorld({ maxRoots: Infinity, maxParticles: Infinity, growthSpeed: 2, fullInfectionDelay: 60000 });
    advance(world, 30.1);
    assert.equal(world.maturation, "CONSOLIDATING");
    const p = world.particles;
    const thin = world.roots.flatMap((root, index) => root.count > 1 && !root.retained ? [{ index, born: root.born, worm: root.worm }] : []);
    assert(thin.some((root) => root.born < 8));
    assert(thin.some((root) => root.worm));
    const peak = p.used, births = world.branchCount, capacity = p.capacity;
    advance(world, 48);
    assert.equal(world.maturation, "SWELLING");
    assert(thin.every(({ index, born }) => world.roots[index].count === 0 || world.roots[index].born !== born));
    assert(world.branchCount > births);
    assert(p.used < peak * 0.35 && p.capacity === capacity);
    const ids = new Set(p.active.subarray(0, p.used));
    assert.equal(ids.size, p.used);
    for (const id of ids) {
      assert(p.alive[id]);
      if (p.parent[id] >= 0 && p.connected[id]) assert(p.alive[p.parent[id]]);
    }
    const trunk = world.roots.find((root) => root.count > 1 && root.depth === 0 && root.retained);
    assert(trunk);
    const id = trunk.ids[Math.floor(trunk.count / 2)], size = p.radius[id], previousBirths = world.branchCount;
    advance(world, 90);
    assert(p.radius[id] > size && world.branchCount > previousBirths && world.inspect().roots > 4);
    world.react("RETRACTING"); advance(world, 3);
    assert.equal(world.state, "IDLE");
  }],
  ["held thin primary roots survive consolidation and merge after release", () => {
    const options = { maxRoots: 6, branchingProbability: 0 };
    const probe = makeWorld(options);
    advance(probe, 12.1);
    const index = probe.roots.findIndex((root) => root.count > 1 && !root.retained);
    assert(index >= 0);
    const world = makeWorld(options);
    advance(world, 11.9);
    const root = world.roots[index], p = world.particles, id = root.ids[8];
    assert(world.hold(p.x[id], p.y[id]));
    assert.equal(world.held, id);
    advance(world, 16);
    assert(root.count > 1 && !root.retained && !root.merging);
    assert(p.alive[id] && world.held === id);
    assert.equal(world.maturation, "CONSOLIDATING");
    const before = p.used;
    world.release(); advance(world, 4);
    assert.equal(root.count, 0);
    assert.equal(world.maturation, "SWELLING");
    assert(p.used < before && world.inspect().roots === 4 && world.inspect().finite);
  }],
  ["retraction and explosion interrupt active merges without stale particle references", () => {
    for (const outcome of ["RETRACTING", "EXPLODING"] as const) {
      const world = makeWorld();
      advance(world, 13);
      assert(world.roots.some((root) => root.merging));
      assert(world.react(outcome));
      assert.equal(world.react(outcome === "RETRACTING" ? "EXPLODING" : "RETRACTING"), false);
      advance(world, 0.2);
      assert(world.inspect().finite);
      advance(world, 7);
      assert.equal(world.state, "IDLE");
      assert.equal(world.particles.used, 0);
      world.awaken(640, 430); advance(world, 1);
      assert(world.inspect().finite && world.particles.used > 0);
    }
  }],
  ["dense active storage keeps stable IDs through removal, reuse, and hash queries", () => {
    const pool = new ParticlePool(64), hash = new SpatialHash(64);
    const ids = Array.from({ length: 64 }, (_, index) => pool.acquire(index, 100, 2, index));
    for (const id of ids) if (id % 8 !== 0) pool.release(id);
    assert.equal(pool.used, 8); assert.equal(pool.count, 64);
    assert.deepEqual(new Set(pool.active.subarray(0, pool.used)), new Set(ids.filter((id) => id % 8 === 0)));
    const reused = pool.acquire(100, 100, 2, 100);
    assert(pool.alive[reused]); assert.equal(pool.used, 9);
    hash.resize(200, 200); hash.build(pool);
    let hashed = 0;
    for (const head of hash.heads) for (let id = head; id >= 0; id = hash.next[id]) { assert(pool.alive[id]); hashed++; }
    assert.equal(hashed, 9);
    pool.reset(); assert.equal(pool.used, 0);
  }],
  ["extended infection preserves thick forks, finite full-detail meshes, and solver quality", () => {
    const world = makeWorld({ maxRoots: 80, maxParticles: 2400 });
    advance(world, 120);
    const earlier = world.inspect();
    advance(world, 480);
    const later = world.inspect();
    assert(later.branches > earlier.branches && later.maxRadius > earlier.maxRadius * 2);
    assert(later.roots > 4 && later.particles <= world.config.maxParticles && later.finite);
    assert(later.coarseCoverage > earlier.coarseCoverage);
    assert.equal(world.iterations, world.config.physicsIterations);
    const geometry = new RootGeometry();
    geometry.build(world, 1, 2);
    assert(geometry.vertexCount > later.particles * 4);
    for (let index = 0; index < world.rootCount; index++) {
      const root = world.roots[index];
      if (root.count > 1) assert.equal(geometry.chains[index].count, root.count);
    }
    for (let offset = 0; offset < geometry.floats; offset++) assert(Number.isFinite(geometry.vertices[offset]));
    const storage = geometry.vertices.buffer;
    geometry.build(world, 0.5, 2);
    assert.equal(geometry.vertices.buffer, storage);
    world.react("EXPLODING"); advance(world, 10);
    assert.equal(world.state, "IDLE");
  }],
  ["invalid configuration and small budgets remain bounded", () => {
    const config = configure({ growthSpeed: NaN, maxRoots: Infinity, maxParticles: -1, physicsIterations: 100, volume: -1 });
    assert.equal(config.growthSpeed, 1); assert.equal(config.maxRoots, Infinity);
    assert.equal(config.maxParticles, 16); assert.equal(config.physicsIterations, 12); assert.equal(config.volume, 0);
    const world = makeWorld({ maxRoots: 400, maxParticles: 16, growthSpeed: 4 });
    advance(world, 30);
    assert(world.inspect().finite && world.particles.count <= 16);
    world.react("RETRACTING"); advance(world, 2);
    assert.equal(world.state, "IDLE");
  }],
];

let failures = 0;
for (const [name, run] of cases) {
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures++; console.error(`FAIL ${name}`, error); }
}
if (failures) process.exitCode = 1;
else console.log(`Passed ${cases.length} focused physics checks.`);

if (process.argv.includes("--benchmark") && !failures) {
  const results = [];
  for (const limits of [{ maxRoots: 40, maxParticles: 1200 }, { maxRoots: 100, maxParticles: 3200 }, { maxRoots: 140, maxParticles: 5600 }, { maxRoots: 250, maxParticles: 10000 }]) {
    const world = makeWorld({ ...limits, fullInfectionDelay: 120000, quality: "high" });
    advance(world, 32);
    const samples: number[] = [];
    for (let frame = 0; frame < 300; frame++) {
      const start = performance.now(); world.step(); samples.push(performance.now() - start);
    }
    samples.sort((a, b) => a - b);
    const snapshot = world.inspect();
    results.push({ roots: snapshot.roots, particles: snapshot.particles, allocatedParticles: snapshot.allocatedParticles, medianPhysicsMs: samples[150], p95PhysicsMs: samples[285], finite: snapshot.finite });
  }
  console.log(JSON.stringify({ environment: "Bun CPU solver only, 1280x800, five iterations, 300 measured steps after 32 seconds of simulated spreading. Counts describe actual active roots and particles. Rendering and browser scheduling excluded.", results }, null, 2));
}
