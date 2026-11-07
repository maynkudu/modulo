/** Expandable structure of arrays. Reset reuses the same storage every cycle. */
export class ParticlePool {
  count = 0;
  used = 0;
  private freeCount = 0;
  private free: Int32Array;
  /** Dense iteration list. Stable particle IDs remain valid when another particle is freed. */
  active: Int32Array;
  private slots: Int32Array;
  x: Float32Array;
  y: Float32Array;
  previousX: Float32Array;
  previousY: Float32Array;
  renderX: Float32Array;
  renderY: Float32Array;
  radius: Float32Array;
  baseRadius: Float32Array;
  /** Extra cross-sectional area delivered by absorbed branches. */
  tissue: Float32Array;
  born: Float32Array;
  inverseMass: Float32Array;
  length: Float32Array;
  growth: Float32Array;
  parent: Int32Array;
  root: Int32Array;
  alive: Uint8Array;
  collision: Uint8Array;
  connected: Uint8Array;

  constructor(readonly limit: number) {
    const capacity = Number.isFinite(limit) ? limit : 2048;
    this.x = new Float32Array(capacity);
    this.y = new Float32Array(capacity);
    this.previousX = new Float32Array(capacity);
    this.previousY = new Float32Array(capacity);
    this.renderX = new Float32Array(capacity);
    this.renderY = new Float32Array(capacity);
    this.radius = new Float32Array(capacity);
    this.baseRadius = new Float32Array(capacity);
    this.tissue = new Float32Array(capacity);
    this.born = new Float32Array(capacity);
    this.free = new Int32Array(capacity);
    this.active = new Int32Array(capacity);
    this.slots = new Int32Array(capacity);
    this.inverseMass = new Float32Array(capacity);
    this.length = new Float32Array(capacity);
    this.growth = new Float32Array(capacity);
    this.parent = new Int32Array(capacity);
    this.root = new Int32Array(capacity);
    this.alive = new Uint8Array(capacity);
    this.collision = new Uint8Array(capacity);
    this.connected = new Uint8Array(capacity);
  }

  get capacity() { return this.x.length; }

  /** Grow geometrically only when needed. Finite caller-supplied budgets remain optional. */
  ensureCapacity(required: number) {
    if (required <= this.capacity) return true;
    const capacity = Math.min(this.limit, Math.max(required, this.capacity * 2));
    if (capacity < required) return false;
    const floats = ["x", "y", "previousX", "previousY", "renderX", "renderY", "radius", "baseRadius", "tissue", "born", "inverseMass", "length", "growth"] as const;
    for (const field of floats) {
      const expanded = new Float32Array(capacity); expanded.set(this[field]); this[field] = expanded;
    }
    const integers = ["parent", "root", "active", "slots"] as const;
    for (const field of integers) {
      const expanded = new Int32Array(capacity); expanded.set(this[field]); this[field] = expanded;
    }
    const bytes = ["alive", "collision", "connected"] as const;
    for (const field of bytes) {
      const expanded = new Uint8Array(capacity); expanded.set(this[field]); this[field] = expanded;
    }
    const free = new Int32Array(capacity); free.set(this.free); this.free = free;
    return true;
  }

  acquire(x: number, y: number, radius: number, root: number, parent = -1) {
    if (this.freeCount === 0 && !this.ensureCapacity(this.count + 1)) return -1;
    const id = this.freeCount > 0 ? this.free[--this.freeCount] : this.count++;
    this.slots[id] = this.used;
    this.active[this.used++] = id;
    this.x[id] = this.previousX[id] = this.renderX[id] = x;
    this.y[id] = this.previousY[id] = this.renderY[id] = y;
    this.baseRadius[id] = this.radius[id] = radius;
    this.tissue[id] = 0;
    this.born[id] = 0;
    this.root[id] = root;
    this.parent[id] = parent;
    this.length[id] = parent < 0 ? 0 : 0.7;
    this.growth[id] = 0;
    this.inverseMass[id] = parent < 0 ? 0 : 1;
    this.alive[id] = 1;
    this.collision[id] = 0;
    this.connected[id] = parent < 0 ? 0 : 1;
    return id;
  }

  reset() {
    this.alive.fill(0, 0, this.count);
    this.count = this.used = this.freeCount = 0;
  }

  release(id: number) {
    if (!this.alive[id]) return;
    this.alive[id] = this.connected[id] = 0;
    const slot = this.slots[id], last = this.active[--this.used];
    this.active[slot] = last;
    this.slots[last] = slot;
    this.free[this.freeCount++] = id;
  }

  saveRenderPositions() {
    for (let slot = 0; slot < this.used; slot++) {
      const id = this.active[slot];
      this.renderX[id] = this.x[id]; this.renderY[id] = this.y[id];
    }
  }
}
