import { mix, type Point } from './math';

type Node = Point & { previousX: number; previousY: number };

export type ElasticChain = {
  nodes: Node[];
  rest: Point[];
  lengths: number[];
  maxPull: number;
  headAngle: number;
  headVelocity: number;
};

/** A fixed root and at least two joints define an anchored elastic object. */
export function createChain(rest: Point[], maxPull: number): ElasticChain {
  if (rest.length < 2 || !Number.isFinite(maxPull) || maxPull <= 0) {
    throw new Error('An elastic chain needs two or more points and a positive pull limit.');
  }
  const chain = {
    nodes: rest.map(point => ({ ...point, previousX: point.x, previousY: point.y })),
    rest,
    lengths: rest.slice(1).map((point, index) => {
      const previous = rest[index];
      if (!previous) throw new Error('Missing chain point.');
      return Math.hypot(point.x - previous.x, point.y - previous.y);
    }),
    maxPull,
    headAngle: 0,
    headVelocity: 0,
  };
  resetChain(chain);
  return chain;
}

export function resetChain(chain: ElasticChain) {
  for (let index = 0; index < chain.nodes.length; index++) {
    const node = chain.nodes[index], rest = chain.rest[index];
    if (!node || !rest) continue;
    node.x = node.previousX = rest.x;
    node.y = node.previousY = rest.y;
  }
  const a = chain.nodes.at(-2), b = chain.nodes.at(-1);
  if (a && b) chain.headAngle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
  chain.headVelocity = 0;
}

/** Growth changes the rest geometry, independently of the simulation clock. */
export function updateRest(chain: ElasticChain, rest: Point[], reset = false) {
  if (rest.length !== chain.nodes.length) throw new Error('The chain joint count must stay constant.');
  chain.rest = rest;
  for (let index = 1; index < rest.length; index++) {
    const a = rest[index - 1], b = rest[index];
    if (a && b) chain.lengths[index - 1] = Math.hypot(b.x - a.x, b.y - a.y);
  }
  if (reset) resetChain(chain);
}

export function boundedTarget(chain: ElasticChain, point: Point): Point {
  const rest = chain.rest.at(-1);
  if (!rest) throw new Error('Missing chain tip.');
  const dx = point.x - rest.x, dy = point.y - rest.y;
  const distance = Math.hypot(dx, dy);
  const ratio = distance > chain.maxPull ? chain.maxPull / distance : 1;
  return { x: rest.x + dx * ratio, y: rest.y + dy * ratio };
}

/** Fixed-step Verlet integration, length constraints, and a separately damped head. */
export function simulateChain(chain: ElasticChain, dt: number, time: number, wind: number, target: Point | null) {
  const root = chain.nodes[0], anchor = chain.rest[0], tipRest = chain.rest.at(-1);
  if (!root || !anchor || !tipRest) return;
  const goal = target ? boundedTarget(chain, target) : null;
  const damping = Math.exp(-(goal ? 11 : 5.8) * dt);
  root.x = root.previousX = anchor.x;
  root.y = root.previousY = anchor.y;
  for (let index = 1; index < chain.nodes.length; index++) {
    const node = chain.nodes[index], rest = chain.rest[index];
    if (!node || !rest) continue;
    const progress = index / (chain.nodes.length - 1);
    const velocityX = (node.x - node.previousX) * damping;
    const velocityY = (node.y - node.previousY) * damping;
    node.previousX = node.x;
    node.previousY = node.y;
    const gust = (Math.sin(time * .85 + anchor.x * .006) * 22 + Math.sin(time * 1.9 + progress) * 6) * wind * progress;
    const goalX = goal ? rest.x + (goal.x - tipRest.x) * progress ** 2 : rest.x;
    const goalY = goal ? rest.y + (goal.y - tipRest.y) * progress ** 2 : rest.y;
    const stiffness = goal ? 105 : 48;
    node.x += velocityX + ((goalX - node.x) * stiffness + gust) * dt * dt;
    node.y += velocityY + (goalY - node.y) * stiffness * dt * dt;
  }
  for (let pass = 0; pass < 10; pass++) {
    for (let index = 1; index < chain.nodes.length; index++) {
      const a = chain.nodes[index - 1], b = chain.nodes[index], length = chain.lengths[index - 1];
      if (!a || !b || length === undefined) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const distance = Math.max(.001, Math.hypot(dx, dy));
      const correction = (distance - length) / distance;
      if (index > 1) { a.x += dx * correction * .5; a.y += dy * correction * .5; }
      const share = index === 1 ? 1 : .5;
      b.x -= dx * correction * share;
      b.y -= dy * correction * share;
    }
    const tip = chain.nodes.at(-1);
    if (tip) Object.assign(tip, boundedTarget(chain, tip));
  }
  const a = chain.nodes.at(-2), b = chain.nodes.at(-1);
  if (a && b) {
    const angle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
    chain.headVelocity += ((angle - chain.headAngle) * 42 - chain.headVelocity * 7.8) * dt;
    chain.headAngle += chain.headVelocity * dt;
  }
}

/** Attach an ornament at a fractional joint position, using the current tangent. */
export function attachment(chain: ElasticChain, progress: number) {
  const position = Math.max(0, Math.min(1, progress)) * (chain.nodes.length - 1);
  const index = Math.min(Math.floor(position), chain.nodes.length - 2);
  const a = chain.nodes[index], b = chain.nodes[index + 1];
  if (!a || !b) throw new Error('Missing attachment joints.');
  return { x: mix(a.x, b.x, position - index), y: mix(a.y, b.y, position - index), angle: Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2 };
}

export function chainSnapshot(chain: ElasticChain) {
  const root = chain.nodes[0], tip = chain.nodes.at(-1), rest = chain.rest.at(-1);
  if (!root || !tip || !rest) throw new Error('Missing chain geometry.');
  return {
    root: { x: root.x, y: root.y },
    tip: { x: tip.x, y: tip.y },
    rest: { ...rest },
    maxPull: chain.maxPull,
    maxSegmentError: Math.max(...chain.nodes.slice(1).map((node, index) => {
      const previous = chain.nodes[index], length = chain.lengths[index];
      if (!previous || !length) return 0;
      return Math.abs(Math.hypot(node.x - previous.x, node.y - previous.y) / length - 1);
    })),
  };
}
