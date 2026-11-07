import type { ParticlePool } from "./particles";

/** Dense cell heads with intrusive particle links. Hash storage expands with the pool and is reused between steps. */
export class SpatialHash {
  readonly cellSize = 24;
  columns = 1;
  rows = 1;
  heads = new Int32Array(1);
  next: Int32Array;

  constructor(capacity: number) {
    this.next = new Int32Array(capacity);
  }

  resize(width: number, height: number) {
    this.columns = Math.ceil(width / this.cellSize) + 1;
    this.rows = Math.ceil(height / this.cellSize) + 1;
    this.heads = new Int32Array(this.columns * this.rows);
  }

  build(p: ParticlePool) {
    if (this.next.length < p.capacity) this.next = new Int32Array(p.capacity);
    this.heads.fill(-1);
    for (let slot = 0; slot < p.used; slot++) {
      const id = p.active[slot];
      if (!p.alive[id]) continue;
      const column = Math.min(this.columns - 1, Math.max(0, Math.floor(p.x[id] / this.cellSize)));
      const row = Math.min(this.rows - 1, Math.max(0, Math.floor(p.y[id] / this.cellSize)));
      const cell = row * this.columns + column;
      this.next[id] = this.heads[cell];
      this.heads[cell] = id;
    }
  }

  repel(p: ParticlePool) {
    this.build(p);
    for (let slot = 0; slot < p.used; slot++) {
      const a = p.active[slot];
      if (!p.alive[a] || !p.inverseMass[a]) continue;
      const column = Math.floor(p.x[a] / this.cellSize);
      const row = Math.floor(p.y[a] / this.cellSize);
      let checked = 0;
      for (let yy = Math.max(0, row - 1); yy <= Math.min(this.rows - 1, row + 1); yy++) {
        for (let xx = Math.max(0, column - 1); xx <= Math.min(this.columns - 1, column + 1); xx++) {
          for (let b = this.heads[yy * this.columns + xx]; b !== -1 && checked < 48; b = this.next[b]) {
            checked++;
            // Branch intersections and adjacent joints must remain connected.
            if (b <= a || p.root[a] === p.root[b] || p.parent[a] === b || p.parent[b] === a || (p.parent[a] >= 0 && p.parent[a] === p.parent[b])) continue;
            const dx = p.x[b] - p.x[a], dy = p.y[b] - p.y[a];
            const separation = (Math.min(10, p.radius[a]) + Math.min(10, p.radius[b])) * 0.65;
            const squared = dx * dx + dy * dy;
            if (squared >= separation * separation || squared < 0.0001) continue;
            const distance = Math.sqrt(squared);
            const correction = Math.min(1.4, (separation - distance) * 0.35) / distance;
            const mass = p.inverseMass[a] + p.inverseMass[b];
            p.x[a] -= dx * correction * p.inverseMass[a] / mass;
            p.y[a] -= dy * correction * p.inverseMass[a] / mass;
            p.x[b] += dx * correction * p.inverseMass[b] / mass;
            p.y[b] += dy * correction * p.inverseMass[b] / mass;
          }
        }
      }
    }
  }
}
