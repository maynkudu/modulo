import { type Point, type Size } from './math';

export type HitRegion = Point & { id: string; label: string; radius: number };
export type SceneInput = { pointer: Point | null; drag: { id: string; target: Point } | null };
export type PaintState = { elapsed: number; physicalTime: number; reducedMotion: boolean; selectedId: string | null };
export type FrameState = PaintState & { paused: boolean; inView: boolean; running: boolean };

export type SceneDefinition<Details, Layer extends string> = {
  size: Size;
  layers: readonly Layer[];
  update: (elapsed: number, resetPose: boolean) => void;
  step: (dt: number, physicalTime: number, input: SceneInput) => void;
  paint: (context: CanvasRenderingContext2D, state: PaintState, layers: ReadonlySet<Layer>) => void;
  targets: () => HitRegion[];
  activate: (id: string, direction: number, physicalTime: number) => void;
  release: () => void;
  inspect: () => Details;
};

export type RuntimeOptions = {
  initialTime?: number;
  timeScale?: number;
  paused?: boolean;
  onFrame?: (state: FrameState) => void;
};

export type ExportOptions<Layer extends string> = {
  layers?: readonly Layer[];
  width?: number;
  height?: number;
};

const STEP = 1 / 120;
const MAX_STEPS = 6;

function nonnegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be a finite nonnegative number.`);
  return value;
}

/** Mount one scene. The host owns its surrounding layout and any persistence. */
export function mountScene<Details, Layer extends string>(canvas: HTMLCanvasElement, scene: SceneDefinition<Details, Layer>, options: RuntimeOptions = {}) {
  const maybeContext = canvas.getContext('2d');
  const host = canvas.parentElement;
  if (!maybeContext || !host) throw new Error('Mount the canvas in a positioned container with Canvas 2D support.');
  const context = maybeContext;
  let elapsed = nonnegative(options.initialTime ?? 0, 'Initial time');
  let timeScale = nonnegative(options.timeScale ?? 1, 'Time scale');
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const signal = events.signal;
  const allLayers = new Set(scene.layers);
  const originalCursor = canvas.style.cursor;
  const overlay = canvas.ownerDocument.createElement('div');
  overlay.className = 'interactive-art-targets';
  Object.assign(overlay.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
  host.append(overlay);
  const buttons = new Map<string, HTMLButtonElement>();
  const directions = new Map<string, number>();
  let paused = options.paused ?? false, destroyed = false, inView = false;
  let physicalTime = 0, frame = 0, last: number | null = null, accumulator = 0, renderedFrames = 0;
  let width = 1, height = 1, scale = 1, offsetX = 0, offsetY = 0;
  let pointer: Point | null = null;
  let drag: { id: string; pointerId: number; target: Point; offset: Point; capture: HTMLElement } | null = null;

  const active = () => !destroyed && !paused && inView && !document.hidden && !motionQuery.matches;
  const paintState = (): PaintState => ({ elapsed, physicalTime, reducedMotion: motionQuery.matches, selectedId: drag?.id ?? null });

  function updateTargets() {
    const seen = new Set<string>();
    for (const target of scene.targets()) {
      seen.add(target.id);
      let button = buttons.get(target.id);
      if (!button) {
        button = canvas.ownerDocument.createElement('button');
        button.type = 'button';
        button.className = 'interactive-art-target';
        button.dataset.sceneObject = target.id;
        Object.assign(button.style, { position: 'absolute', pointerEvents: 'auto', touchAction: 'none', borderRadius: '50%', padding: '0', transform: 'translate(-50%, -50%)', background: 'transparent' });
        button.addEventListener('click', event => {
          if (event.detail !== 0 || !active()) return;
          const direction = directions.get(target.id) ?? 1;
          scene.activate(target.id, direction, physicalTime);
          directions.set(target.id, -direction);
        }, { signal });
        overlay.append(button);
        buttons.set(target.id, button);
      }
      const diameter = Math.max(44, target.radius * 2 * scale);
      const x = target.x * scale + offsetX, y = target.y * scale + offsetY;
      const visible = x + diameter / 2 > 0 && x - diameter / 2 < width && y + diameter / 2 > 0 && y - diameter / 2 < height;
      button.hidden = !visible && drag?.id !== target.id;
      button.setAttribute('aria-label', target.label);
      button.disabled = !active() || button.hidden;
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.style.width = button.style.height = `${diameter}px`;
    }
    for (const [id, button] of buttons) {
      if (!seen.has(id)) { button.remove(); buttons.delete(id); }
    }
  }

  function render() {
    if (destroyed) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(canvas.width / width * scale, 0, 0, canvas.height / height * scale, canvas.width / width * offsetX, canvas.height / height * offsetY);
    scene.paint(context, paintState(), allLayers);
    renderedFrames++;
    updateTargets();
    options.onFrame?.({ ...paintState(), paused, inView, running: active() });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    scale = height / scene.size.height;
    offsetX = (width - scene.size.width * scale) / 2;
    offsetY = 0;
    render();
  }

  function localPoint(event: PointerEvent): Point {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left - offsetX) / scale, y: (event.clientY - rect.top - offsetY) / scale };
  }

  function nearest(point: Point) {
    let closest: HitRegion | null = null, distance = Infinity;
    for (const target of scene.targets()) {
      const d = Math.hypot(point.x - target.x, point.y - target.y);
      if (d < Math.max(target.radius, 22 / scale) && d < distance) { closest = target; distance = d; }
    }
    return closest;
  }

  function clearInteraction() {
    const held = drag;
    drag = null;
    pointer = null;
    scene.release();
    if (held?.capture.hasPointerCapture(held.pointerId)) held.capture.releasePointerCapture(held.pointerId);
    canvas.style.cursor = originalCursor;
  }

  function tick(now: number) {
    frame = 0;
    if (!active()) return;
    const delta = last === null ? 0 : Math.min(MAX_STEPS * STEP, Math.max(0, (now - last) / 1000));
    last = now;
    accumulator += delta;
    let steps = 0;
    while (accumulator >= STEP && steps < MAX_STEPS) {
      elapsed += STEP * timeScale;
      physicalTime += STEP;
      scene.update(elapsed, false);
      scene.step(STEP, physicalTime, { pointer, drag: drag ? { id: drag.id, target: drag.target } : null });
      accumulator -= STEP;
      steps++;
    }
    render();
    if (active()) frame = requestAnimationFrame(tick);
  }

  function schedule() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = null;
    accumulator = 0;
    if (active()) frame = requestAnimationFrame(tick);
  }

  host.addEventListener('pointermove', event => {
    if (!active()) return;
    const point = localPoint(event);
    if (drag?.pointerId === event.pointerId) {
      drag.target = { x: point.x - drag.offset.x, y: point.y - drag.offset.y };
      event.preventDefault();
    } else if (event.pointerType !== 'touch') {
      pointer = point;
      canvas.style.cursor = nearest(point) ? 'grab' : originalCursor;
    }
  }, { signal });
  host.addEventListener('pointerleave', () => { pointer = null; if (!drag) canvas.style.cursor = originalCursor; }, { signal });
  host.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag || !active()) return;
    const point = localPoint(event), target = nearest(point);
    if (!target) return;
    // Capture only flower targets on touch, leaving the canvas available for page scrolling.
    if (event.pointerType === 'touch' && !(event.target instanceof HTMLButtonElement)) return;
    const capture = event.target instanceof HTMLElement ? event.target : canvas;
    drag = { id: target.id, pointerId: event.pointerId, target: { x: target.x, y: target.y }, offset: { x: point.x - target.x, y: point.y - target.y }, capture };
    pointer = null;
    capture.setPointerCapture(event.pointerId);
    event.preventDefault();
  }, { signal });
  const release = (event: PointerEvent) => { if (drag?.pointerId === event.pointerId) clearInteraction(); };
  host.addEventListener('pointerup', release, { signal });
  host.addEventListener('pointercancel', release, { signal });
  host.addEventListener('lostpointercapture', release, { signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearInteraction(); schedule(); render(); }, { signal });
  motionQuery.addEventListener('change', () => {
    clearInteraction();
    if (motionQuery.matches) scene.update(elapsed, true);
    schedule();
    render();
  }, { signal });
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  const visibilityObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    inView = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= .05);
    if (!inView) clearInteraction();
    schedule();
    render();
  }, { threshold: [0, .05] });
  visibilityObserver.observe(canvas);
  scene.update(elapsed, true);
  resize();

  return {
    pause() { if (destroyed) return; paused = true; clearInteraction(); schedule(); render(); },
    resume() { if (destroyed) return; paused = false; schedule(); render(); },
    setTimeScale(value: number) { if (destroyed) return; timeScale = nonnegative(value, 'Time scale'); },
    seek(seconds: number) {
      if (destroyed) return;
      elapsed = nonnegative(seconds, 'Time');
      clearInteraction();
      scene.update(elapsed, true);
      last = null;
      accumulator = 0;
      render();
    },
    bend(id: string, direction = 1) { if (active()) scene.activate(id, direction, physicalTime); },
    snapshot() {
      return { elapsed, physicalTime, timeScale, paused, inView, hidden: document.hidden, reducedMotion: motionQuery.matches, running: Boolean(frame), destroyed, renderedFrames, drag: drag?.id ?? null,
        view: { width, height, scale, offsetX, offsetY },
        targets: scene.targets().map(target => ({ ...target, screen: { x: target.x * scale + offsetX, y: target.y * scale + offsetY } })),
        details: scene.inspect() };
    },
    async exportPNG(settings: ExportOptions<Layer> = {}) {
      if (destroyed) throw new Error('Cannot export a destroyed scene.');
      const output = canvas.ownerDocument.createElement('canvas');
      const outputWidth = settings.width ?? scene.size.width, outputHeight = settings.height ?? scene.size.height;
      if (![outputWidth, outputHeight].every(value => Number.isInteger(value) && value > 0 && value <= 8192)) throw new Error('Export dimensions must be integers between 1 and 8192.');
      const selected = new Set(settings.layers ?? scene.layers);
      for (const layer of selected) if (!allLayers.has(layer)) throw new Error(`Unknown scene layer: ${layer}`);
      output.width = outputWidth;
      output.height = outputHeight;
      const outputContext = output.getContext('2d');
      if (!outputContext) throw new Error('Canvas 2D is unavailable.');
      const layerCanvas = canvas.ownerDocument.createElement('canvas');
      layerCanvas.width = outputWidth;
      layerCanvas.height = outputHeight;
      const layerContext = layerCanvas.getContext('2d');
      if (!layerContext) throw new Error('Canvas 2D is unavailable.');
      const state = { ...paintState(), selectedId: null };
      // Quantize every layer before composition, just as separate PNG assets are quantized.
      for (const layer of scene.layers) {
        if (!selected.has(layer)) continue;
        layerContext.clearRect(0, 0, outputWidth, outputHeight);
        layerContext.save();
        layerContext.scale(outputWidth / scene.size.width, outputHeight / scene.size.height);
        scene.paint(layerContext, state, new Set([layer]));
        layerContext.restore();
        outputContext.drawImage(layerCanvas, 0, 0);
      }
      return new Promise<Blob>((resolve, reject) => output.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG export failed.')), 'image/png'));
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(frame);
      frame = 0;
      clearInteraction();
      events.abort();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      overlay.remove();
      buttons.clear();
    },
  };
}
