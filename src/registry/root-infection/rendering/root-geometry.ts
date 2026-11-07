import type { PhysicsWorld } from "../engine/world";

export const VERTEX_SIZE = 7;

const section = Array.from({ length: 13 }, (_, index) => {
  const angle = index / 12 * Math.PI - Math.PI / 2;
  return { across: Math.sin(angle), rise: Math.cos(angle) };
});

function makeChain(capacity: number) {
  return {
    capacity, count: 0, spans: 0, phase: 0, firstVertex: 0, vertexCount: 0, firstCircle: 0, circleCount: 0,
    ids: new Int32Array(capacity), starts: new Int32Array(capacity), ends: new Int32Array(capacity),
    rawX: new Float32Array(capacity), rawY: new Float32Array(capacity),
    x: new Float32Array(capacity), y: new Float32Array(capacity),
    nx: new Float32Array(capacity), ny: new Float32Array(capacity),
    radius: new Float32Array(capacity), arc: new Float32Array(capacity),
    sumX: new Float64Array(capacity + 1), sumY: new Float64Array(capacity + 1), sumRadius: new Float64Array(capacity + 1),
  };
}

/** Full-sample tapered meshes. Triangle coverage stays solid when a thick chain overlaps itself. */
export class RootGeometry {
  vertices = new Float32Array(65536);
  floats = 0;
  circles = new Float32Array(4096);
  circleCount = 0;
  readonly chains: ReturnType<typeof makeChain>[] = [];
  order = new Int32Array(64);
  rootCount = 0;

  get vertexCount() { return this.floats / VERTEX_SIZE; }

  private reserve(floats: number) {
    if (this.floats + floats <= this.vertices.length) return;
    const expanded = new Float32Array(Math.max(this.vertices.length * 2, this.floats + floats));
    expanded.set(this.vertices); this.vertices = expanded;
  }

  private vertex(x: number, y: number, height: number, nx: number, ny: number, nz: number, phase: number) {
    const data = this.vertices;
    let offset = this.floats;
    data[offset++] = x; data[offset++] = y; data[offset++] = height;
    data[offset++] = nx; data[offset++] = ny; data[offset++] = nz; data[offset++] = phase;
    this.floats = offset;
  }

  private circle(x: number, y: number, radius: number, phase: number) {
    if ((this.circleCount + 1) * 4 > this.circles.length) {
      const expanded = new Float32Array(this.circles.length * 2); expanded.set(this.circles); this.circles = expanded;
    }
    const circle = this.circleCount++ * 4;
    this.circles[circle] = x; this.circles[circle + 1] = y;
    this.circles[circle + 2] = radius; this.circles[circle + 3] = phase;
  }

  private prepare(world: PhysicsWorld, index: number, interpolation: number, detail: number) {
    const root = world.roots[index], p = world.particles;
    let g = this.chains[index];
    if (root.count < 2) { if (g) g.count = g.spans = 0; return; }
    if (!g || g.capacity < root.count) g = this.chains[index] = makeChain(root.ids.length);
    const exploding = world.state === "EXPLODING";
    const stride = detail === 0 && !exploding ? Math.max(2, 2 ** Math.ceil(Math.log2(p.used / 5000))) : 1;
    g.count = Math.ceil((root.count - 1) / stride) + 1;
    g.spans = 0; g.sumX[0] = g.sumY[0] = g.sumRadius[0] = 0;
    let start = 0;
    for (let joint = 0; joint < g.count; joint++) {
      const id = root.ids[Math.min(root.count - 1, joint * stride)];
      g.ids[joint] = id;
      g.rawX[joint] = p.renderX[id] + (p.x[id] - p.renderX[id]) * interpolation;
      g.rawY[joint] = p.renderY[id] + (p.y[id] - p.renderY[id]) * interpolation;
      g.sumX[joint + 1] = g.sumX[joint] + g.rawX[joint];
      g.sumY[joint + 1] = g.sumY[joint] + g.rawY[joint];
      g.sumRadius[joint + 1] = g.sumRadius[joint] + p.radius[id];
      if (!p.alive[id] || (joint > start && exploding && !p.connected[id])) {
        if (joint - start > 1) { g.starts[g.spans] = start; g.ends[g.spans++] = joint - 1; }
        start = p.alive[id] ? joint : joint + 1;
      }
    }
    if (g.count - start > 1) { g.starts[g.spans] = start; g.ends[g.spans++] = g.count - 1; }
    for (let span = 0; span < g.spans; span++) {
      const first = g.starts[span], last = g.ends[span];
      g.arc[first] = 0;
      for (let joint = first; joint <= last; joint++) {
        if (joint > first) g.arc[joint] = g.arc[joint - 1] + Math.hypot(g.rawX[joint] - g.rawX[joint - 1], g.rawY[joint] - g.rawY[joint - 1]);
        const spacing = Math.max(4, p.length[g.ids[joint]] * stride);
        const smoothing = exploding ? 0 : p.radius[g.ids[joint]] / (spacing * 1.5);
        const window = Math.floor(smoothing), blend = smoothing - window;
        const left = Math.max(first, joint - window), right = Math.min(last, joint + window), count = right - left + 1;
        const outerLeft = Math.max(first, left - 1), outerRight = Math.min(last, right + 1), outerCount = outerRight - outerLeft + 1;
        const x = (g.sumX[right + 1] - g.sumX[left]) / count;
        const y = (g.sumY[right + 1] - g.sumY[left]) / count;
        const radius = (g.sumRadius[right + 1] - g.sumRadius[left]) / count;
        const influence = Math.min(1, Math.min(joint - first, last - joint) / Math.max(1, smoothing + 1));
        g.x[joint] = g.rawX[joint] + (x + ((g.sumX[outerRight + 1] - g.sumX[outerLeft]) / outerCount - x) * blend - g.rawX[joint]) * influence;
        g.y[joint] = g.rawY[joint] + (y + ((g.sumY[outerRight + 1] - g.sumY[outerLeft]) / outerCount - y) * blend - g.rawY[joint]) * influence;
        g.radius[joint] = radius + ((g.sumRadius[outerRight + 1] - g.sumRadius[outerLeft]) / outerCount - radius) * blend;
      }
      const total = g.arc[last];
      for (let joint = first; joint <= last; joint++) {
        const radius = g.radius[joint], spacing = Math.max(4, p.length[g.ids[joint]] * stride);
        const sampling = exploding ? 1 : Math.max(1, radius / (spacing * 1.8));
        const reach = Math.floor(sampling), blend = sampling - reach;
        const previous = Math.max(first, joint - reach), next = Math.min(last, joint + reach);
        const outerPrevious = Math.max(first, previous - 1), outerNext = Math.min(last, next + 1);
        let dx = g.x[next] - g.x[previous], dy = g.y[next] - g.y[previous];
        dx += (g.x[outerNext] - g.x[outerPrevious] - dx) * blend;
        dy += (g.y[outerNext] - g.y[outerPrevious] - dy) * blend;
        if (dx * dx + dy * dy < 0.000001) {
          dx = g.rawX[Math.min(last, joint + 1)] - g.rawX[Math.max(first, joint - 1)];
          dy = g.rawY[Math.min(last, joint + 1)] - g.rawY[Math.max(first, joint - 1)];
        }
        const length = Math.max(0.001, Math.hypot(dx, dy));
        g.nx[joint] = -dy / length; g.ny[joint] = dx / length;
        const taper = exploding ? 1 : Math.min(1, (total - g.arc[joint]) / Math.max(30, radius * 2) + 0.035);
        const grain = 1 + Math.sin(g.arc[joint] / (40 + radius * 2.2) + root.phase) * 0.055
          + Math.sin(g.arc[joint] / (22 + radius * 0.8) + root.phase * 0.73) * 0.022;
        const pulse = 1 + Math.sin(world.age * 0.8 - root.phase + g.arc[joint] / 100) * 0.014;
        g.radius[joint] = Math.max(0.15, radius * grain * pulse * taper);
      }
    }
  }

  private strip(g: ReturnType<typeof makeChain>, first: number, last: number, phase: number, detail: number) {
    const stride = detail === 0 ? 3 : detail === 1 ? 2 : 1;
    this.reserve((last - first) * (12 / stride) * 6 * VERTEX_SIZE);
    for (let joint = first; joint < last; joint++) {
      const next = joint + 1;
      const ax = g.x[joint], ay = g.y[joint], an = g.nx[joint], am = g.ny[joint], ar = g.radius[joint];
      const bx = g.x[next], by = g.y[next], bn = g.nx[next], bm = g.ny[next], br = g.radius[next];
      for (let slice = 0; slice < 12; slice += stride) {
        const a = section[slice], b = section[slice + stride];
        this.vertex(ax + an * ar * a.across, ay + am * ar * a.across, ar * a.rise, an * a.across, am * a.across, a.rise, phase);
        this.vertex(ax + an * ar * b.across, ay + am * ar * b.across, ar * b.rise, an * b.across, am * b.across, b.rise, phase);
        this.vertex(bx + bn * br * a.across, by + bm * br * a.across, br * a.rise, bn * a.across, bm * a.across, a.rise, phase);
        this.vertex(ax + an * ar * b.across, ay + am * ar * b.across, ar * b.rise, an * b.across, am * b.across, b.rise, phase);
        this.vertex(bx + bn * br * b.across, by + bm * br * b.across, br * b.rise, bn * b.across, bm * b.across, b.rise, phase);
        this.vertex(bx + bn * br * a.across, by + bm * br * a.across, br * a.rise, bn * a.across, bm * a.across, a.rise, phase);
      }
    }
    this.circle(g.x[first], g.y[first], g.radius[first], phase);
    this.circle(g.x[last], g.y[last], g.radius[last], phase);
  }

  build(world: PhysicsWorld, interpolation: number, detail: number) {
    this.floats = this.rootCount = this.circleCount = 0;
    if (this.order.length < world.roots.length) this.order = new Int32Array(world.roots.length);
    for (let index = 0; index < world.rootCount; index++) {
      this.prepare(world, index, interpolation, detail);
      if (!this.chains[index]?.spans) continue;
      let slot = this.rootCount++;
      while (slot > 0 && world.roots[this.order[slot - 1]].depth > world.roots[index].depth) {
        this.order[slot] = this.order[slot - 1]; slot--;
      }
      this.order[slot] = index;
    }
    for (let slot = 0; slot < this.rootCount; slot++) {
      const index = this.order[slot], g = this.chains[index], root = world.roots[index];
      // Connected forks share their parent's skin field, including while they merge.
      const phase = g.phase = root.parentJoint >= 0 ? this.chains[root.parentRoot].phase : root.phase;
      g.firstVertex = this.vertexCount;
      g.firstCircle = this.circleCount;
      for (let span = 0; span < g.spans; span++) this.strip(g, g.starts[span], g.ends[span], phase, detail);
      g.vertexCount = this.vertexCount - g.firstVertex;
      g.circleCount = this.circleCount - g.firstCircle;
    }
    const p = world.particles, exploding = world.state === "EXPLODING";
    for (let slot = 0; slot < p.used; slot++) {
      const id = p.active[slot];
      if (!p.alive[id]) continue;
      const x = p.renderX[id] + (p.x[id] - p.renderX[id]) * interpolation;
      const y = p.renderY[id] + (p.y[id] - p.renderY[id]) * interpolation;
      if (p.root[id] < 0 || (exploding && !p.connected[id])) {
        const phase = p.root[id] < 0 ? id * 0.37 : this.chains[p.root[id]]?.phase ?? world.roots[p.root[id]].phase;
        this.circle(x, y, p.radius[id], phase);
      }
      if (world.state === "RETRACTING" && detail > 0 && slot % 19 === 0) {
        const dx = (p.previousX[id] - p.x[id]) * 0.4, dy = (p.previousY[id] - p.y[id]) * 0.4;
        const length = Math.max(0.01, Math.hypot(dx, dy)), nx = -dy / length * 0.55, ny = dx / length * 0.55;
        this.reserve(6 * VERTEX_SIZE);
        this.vertex(x + nx, y + ny, 0, 0, 0, 1, -1);
        this.vertex(x - nx, y - ny, 0, 0, 0, 1, -1);
        this.vertex(x + dx, y + dy, 0, 0, 0, 1, -1);
        this.vertex(x - nx, y - ny, 0, 0, 0, 1, -1);
        this.vertex(x + dx, y + dy, 0, 0, 0, 1, -1);
        this.vertex(x + nx, y + ny, 0, 0, 0, 1, -1);
      }
    }
  }
}
