type Obstacle = { left: number; top: number; right: number; bottom: number };

/** Cached rectangle distance queries. DOM reads happen only when geometry is invalidated. */
export class CollisionField {
  private readonly cellSize = 64;
  private columns = 1;
  private rows = 1;
  private cells: number[][] = [[]];
  private obstacles: Obstacle[] = [];
  private elements: Element[] = [];
  private readonly contactTimes = new Map<Element, number>();
  private readonly animations = new Set<Animation>();
  obstacle = -1;
  distance = Infinity;
  normalX = 0;
  normalY = 0;

  setObstacles(obstacles: readonly Obstacle[], width: number, height: number) {
    this.obstacles = obstacles.slice(0, 128);
    this.columns = Math.ceil(width / this.cellSize) + 1;
    this.rows = Math.ceil(height / this.cellSize) + 1;
    this.cells = Array.from({ length: this.columns * this.rows }, () => []);
    this.obstacles.forEach((rect, id) => {
      const left = Math.max(0, Math.floor((rect.left - 28) / this.cellSize));
      const top = Math.max(0, Math.floor((rect.top - 28) / this.cellSize));
      const right = Math.min(this.columns - 1, Math.floor((rect.right + 28) / this.cellSize));
      const bottom = Math.min(this.rows - 1, Math.floor((rect.bottom + 28) / this.cellSize));
      for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) this.cells[y * this.columns + x].push(id);
      }
    });
  }

  refresh(document: Document, host: HTMLElement, width: number, height: number) {
    const obstacles: Obstacle[] = [];
    const elements: Element[] = [];
    for (const element of document.querySelectorAll("[data-root-obstacle], button, a, input, select, textarea")) {
      if (element === host || host.contains(element) || element.closest("[data-root-ignore]")) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8 || rect.width > width * 0.75 || rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) continue;
      obstacles.push({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom });
      elements.push(element);
      if (obstacles.length >= 128) break;
    }
    this.setObstacles(obstacles, width, height);
    this.elements = elements;
  }

  sample(x: number, y: number) {
    this.distance = Infinity;
    this.obstacle = -1;
    this.normalX = this.normalY = 0;
    const column = Math.max(0, Math.min(this.columns - 1, Math.floor(x / this.cellSize)));
    const row = Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.cellSize)));
    const candidates = this.cells[row * this.columns + column];
    for (let index = 0; index < candidates.length; index++) {
      const rect = this.obstacles[candidates[index]];
      const nearestX = Math.max(rect.left, Math.min(rect.right, x));
      const nearestY = Math.max(rect.top, Math.min(rect.bottom, y));
      let dx = x - nearestX, dy = y - nearestY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 0.001) {
        const left = x - rect.left, right = rect.right - x;
        const top = y - rect.top, bottom = rect.bottom - y;
        const depth = Math.min(left, right, top, bottom);
        distance = -depth;
        dx = depth === left ? -1 : depth === right ? 1 : 0;
        dy = depth === top ? -1 : depth === bottom ? 1 : 0;
      } else {
        dx /= distance;
        dy /= distance;
      }
      if (distance < this.distance) {
        this.distance = distance;
        this.obstacle = candidates[index];
        this.normalX = dx;
        this.normalY = dy;
      }
    }
  }

  /** A small contact reaction uses the element's existing appearance and restores it on cancel. */
  reactToContact(time: number, strength: number) {
    const element = this.elements[this.obstacle];
    if (!element || strength < 0.4 || this.animations.size >= 8 || time - (this.contactTimes.get(element) ?? -Infinity) < 1.5) return;
    this.contactTimes.set(element, time);
    const direction = this.normalX + this.normalY >= 0 ? 1 : -1;
    const animation = element.animate([
      { translate: "0 0", rotate: "0deg" },
      { translate: `${this.normalX * 1.5}px ${this.normalY * 1.5}px`, rotate: `${direction * 0.6}deg`, offset: 0.3 },
      { translate: `${-this.normalX * 0.5}px ${-this.normalY * 0.5}px`, rotate: `${-direction * 0.2}deg`, offset: 0.65 },
      { translate: "0 0", rotate: "0deg" },
    ], { duration: 420, easing: "ease-out" });
    this.animations.add(animation);
    animation.onfinish = () => { this.animations.delete(animation); animation.cancel(); };
  }

  clearReactions() {
    for (const animation of this.animations) animation.cancel();
    this.animations.clear();
    this.contactTimes.clear();
  }
}
