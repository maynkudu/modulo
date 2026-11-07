import { SoundEngine } from "../audio/sound-engine";
import { RootRenderer } from "../rendering/renderer";
import { configure, FIXED_STEP, type InfectionState, type RootInfectionProps } from "../types";
import { PhysicsWorld } from "./world";

/** Owns one overlay, clock, input subscription, and audio context. No site state is required. */
export function mountRootInfection(host: HTMLElement, options: RootInfectionProps = {}) {
  const config = configure(options);
  const document = host.ownerDocument;
  const browser = document.defaultView;
  if (!browser) throw new Error("Root Infection requires a browser window.");
  const view = browser;
  const canvas = document.createElement("canvas");
  canvas.dataset.rootInfectionOverlay = "";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "2147483000", display: "none" });
  const world = new PhysicsWorld(config);
  const renderer = new RootRenderer(canvas);
  document.body.append(canvas);
  const backgroundCanvas = document.createElement("canvas");
  backgroundCanvas.width = 5; backgroundCanvas.height = 1;
  const backgroundContext = backgroundCanvas.getContext("2d", { willReadFrequently: true });
  const backgroundColors: string[] = [];
  const backgroundStyles = new Map<Element, string>();
  const luminances = new Float32Array(5);
  const samplePoints = [[0.12, 0.16], [0.88, 0.16], [0.5, 0.5], [0.12, 0.84], [0.88, 0.84]];
  let nextBackgroundRead = 0;
  const sound = new SoundEngine(config.enableAudio, config.volume);
  const events = new AbortController();
  const { signal } = events;
  const motion = view.matchMedia("(prefers-reduced-motion: reduce)");
  const frameTimes = new Float32Array(180), workTimes = new Float32Array(180);
  const physicsTimes = new Float32Array(180), geometryTimes = new Float32Array(180);
  const bodyTimes = new Float32Array(180), detailTimes = new Float32Array(180);
  let frame = 0, timer: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false, inView = false, armed = true, geometryDirty = true;
  let x = 0, y = 0, movementX = 0, movementY = 0;
  let lastFrame = 0, accumulator = 0, frames = 0, fixedSteps = 0;
  const quality = config.quality === "low" ? 0 : config.quality === "medium" ? 1 : 2;
  let averageFrame = 16.67, averageWork = 0, droppedSeconds = 0;
  let state: InfectionState = "IDLE";
  let density = 1;
  const isIdle = () => world.state === "IDLE";
  let capture: HTMLElement | null = null;
  let captureId = -1;
  let scrollY = view.scrollY;
  world.iterations = Math.max(1, config.physicsIterations - (quality === 0 ? 3 : quality === 1 ? 1 : 0));
  world.collisionEvery = quality === 0 ? 3 : 1;

  /** Composite ancestor backgrounds at a few visible points. Canvas resolves CSS color spaces and alpha. */
  function refreshBackground() {
    const scheme = view.getComputedStyle(document.documentElement).colorScheme;
    const darkCanvas = scheme.includes("dark") && (!scheme.includes("light") || view.matchMedia("(prefers-color-scheme: dark)").matches);
    const c = backgroundContext;
    if (!c) { renderer.setBackgroundLuminance(darkCanvas ? 0 : 1); return; }
    c.fillStyle = darkCanvas ? "#121212" : "#fff";
    c.fillRect(0, 0, 5, 1);
    backgroundStyles.clear();
    for (let sample = 0; sample < samplePoints.length; sample++) {
      const point = samplePoints[sample];
      backgroundColors.length = 0;
      for (let element = document.elementFromPoint(world.width * point[0], world.height * point[1]); element; element = element.parentElement) {
        let color = backgroundStyles.get(element);
        if (color === undefined) { color = view.getComputedStyle(element).backgroundColor; backgroundStyles.set(element, color); }
        backgroundColors.push(color);
      }
      for (let layer = backgroundColors.length - 1; layer >= 0; layer--) {
        c.fillStyle = backgroundColors[layer]; c.fillRect(sample, 0, 1, 1);
      }
    }
    const pixels = c.getImageData(0, 0, 5, 1).data;
    const linear = (channel: number) => { const value = channel / 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4; };
    for (let sample = 0; sample < 5; sample++) {
      const offset = sample * 4;
      luminances[sample] = linear(pixels[offset]) * 0.2126 + linear(pixels[offset + 1]) * 0.7152 + linear(pixels[offset + 2]) * 0.0722;
    }
    luminances.sort();
    renderer.setBackgroundLuminance(luminances[2]);
  }

  function publishState() {
    if (world.state === state) return;
    state = world.state;
    host.dataset.infectionState = state;
    if (state === "IDLE") {
      canvas.style.display = "none";
      sound.setInfestation(0);
      scheduleIdle();
    } else canvas.style.display = "block";
  }

  function resize() {
    const width = Math.max(1, view.innerWidth), height = Math.max(1, view.innerHeight);
    world.resize(width, height);
    density = quality === 2 ? view.devicePixelRatio || 1 : 1;
    renderer.resize(width, height, density);
    renderer.detail = quality;
    geometryDirty = true;
    nextBackgroundRead = 0;
    if (world.state === "IDLE") {
      const rect = host.getBoundingClientRect();
      x = rect.left + rect.width / 2; y = rect.top + rect.height / 2;
      movementX = x; movementY = y;
    }
  }

  function stopFrame() {
    view.cancelAnimationFrame(frame);
    frame = 0; lastFrame = 0; accumulator = 0;
  }

  function scheduleFrame() {
    if (!frame && !destroyed && !document.hidden && !motion.matches && world.state !== "IDLE") frame = view.requestAnimationFrame(tick);
  }

  function clearIdle() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function scheduleIdle() {
    clearIdle();
    if (destroyed || document.hidden || motion.matches || !inView || !armed || world.state !== "IDLE") return;
    timer = setTimeout(() => {
      timer = undefined;
      if (destroyed || document.hidden || motion.matches || !inView || !armed || world.state !== "IDLE") return;
      world.field.refresh(document, host, world.width, world.height);
      refreshBackground(); nextBackgroundRead = performance.now() + 1000;
      geometryDirty = false;
      world.awaken(x, y);
      movementX = x; movementY = y;
      publishState();
      scheduleFrame();
    }, config.inactivityDelay);
  }

  function adaptGrowth() {
    if (config.quality !== "auto" || frames % 30 !== 0) return;
    if (averageWork > 5.5 || averageFrame > 20) world.consolidateEarly();
  }

  function tick(now: number) {
    frame = 0;
    if (destroyed || document.hidden || motion.matches || world.state === "IDLE") return;
    const start = performance.now();
    if (now >= nextBackgroundRead) { refreshBackground(); nextBackgroundRead = now + 1000; }
    const delta = lastFrame ? Math.max(0, (now - lastFrame) / 1000) : FIXED_STEP;
    lastFrame = now;
    droppedSeconds += Math.max(0, delta - 0.1);
    accumulator += Math.min(0.1, delta);
    if (geometryDirty) { world.field.refresh(document, host, world.width, world.height); geometryDirty = false; }
    const stepBudget = quality === 0 ? 1 : 6;
    if (accumulator > FIXED_STEP * stepBudget) {
      droppedSeconds += accumulator - FIXED_STEP * stepBudget;
      accumulator = FIXED_STEP * stepBudget;
    }
    let steps = 0;
    const physicsStart = performance.now();
    while (accumulator >= FIXED_STEP && steps < stepBudget) {
      world.step();
      accumulator -= FIXED_STEP;
      steps++; fixedSteps++;
      if (isIdle()) break;
    }
    const physicsMs = performance.now() - physicsStart;
    world.drainSounds(playSound);
    renderer.paint(world, Math.min(1, accumulator / FIXED_STEP));
    if (frames % 30 === 0) sound.setInfestation(world.state === "INFESTING" || world.state === "FULL_INFECTION" ? Math.max(0, world.age / (config.fullInfectionDelay / 1000) - 0.25) : 0);
    const work = performance.now() - start;
    frameTimes[frames % frameTimes.length] = delta * 1000;
    workTimes[frames % workTimes.length] = work;
    physicsTimes[frames % physicsTimes.length] = physicsMs;
    geometryTimes[frames % geometryTimes.length] = renderer.timings.geometryMs;
    bodyTimes[frames % bodyTimes.length] = renderer.timings.bodyMs;
    detailTimes[frames % detailTimes.length] = renderer.timings.detailMs;
    averageFrame += (Math.min(100, delta * 1000) - averageFrame) * 0.025;
    averageWork += (work - averageWork) * 0.025;
    frames++;
    adaptGrowth();
    publishState();
    scheduleFrame();
  }

  function playSound(event: Parameters<SoundEngine["play"]>[0]) {
    sound.play(event, world.originX / world.width * 2 - 1);
  }

  function outcome(next: "RETRACTING" | "EXPLODING", px: number, py: number) {
    if (!world.react(next, px, py)) return;
    sound.setInfestation(0);
    world.drainSounds(playSound);
    publishState();
    scheduleFrame();
  }

  function inside(px: number, py: number) {
    const rect = host.getBoundingClientRect();
    return px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
  }

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !event.isPrimary) return;
    if (world.state === "RETRACTING" || world.state === "EXPLODING") {
      movementX = x = event.clientX; movementY = y = event.clientY;
      armed = inside(x, y);
      return;
    }
    if (world.held >= 0) {
      world.moveHeld(event.clientX, event.clientY);
      movementX = x = event.clientX; movementY = y = event.clientY;
      return;
    }
    if (event.shiftKey && world.state !== "IDLE") {
      movementX = x = event.clientX; movementY = y = event.clientY;
      world.disturb(x, y);
      return;
    }
    const distance = Math.hypot(event.clientX - movementX, event.clientY - movementY);
    if (distance < 6) return;
    x = event.clientX; y = event.clientY;
    movementX = x; movementY = y;
    armed = inside(x, y);
    if (world.state === "IDLE") {
      scheduleIdle();
    } else if (config.enableRetraction) outcome("RETRACTING", x, y);
  }, { passive: true, signal });

  document.addEventListener("pointerdown", (event) => {
    if (event.isTrusted) void sound.unlock();
    if (world.state === "RETRACTING" || world.state === "EXPLODING" || event.button !== 0) return;
    if (event.shiftKey && world.hold(event.clientX, event.clientY)) {
      if (event.target instanceof HTMLElement) {
        capture = event.target; captureId = event.pointerId;
        capture.setPointerCapture(captureId);
      }
      event.preventDefault();
      return;
    }
    if (world.state !== "IDLE") {
      if (config.enableExplosion) {
        // Schedule audio after resume resolves without delaying the physical impulse.
        outcome("EXPLODING", event.clientX, event.clientY);
        if (event.isTrusted) void sound.unlock().then(() => {
          if (!destroyed && world.state === "EXPLODING") sound.play("impact", event.clientX / world.width * 2 - 1);
        });
      }
    } else {
      x = event.clientX; y = event.clientY;
      movementX = x; movementY = y;
      armed = inside(x, y);
      scheduleIdle();
    }
  }, { signal });

  const release = () => {
    world.release();
    if (capture?.hasPointerCapture(captureId)) capture.releasePointerCapture(captureId);
    capture = null; captureId = -1;
  };
  document.addEventListener("pointerup", release, { signal });
  document.addEventListener("pointercancel", release, { signal });
  document.addEventListener("lostpointercapture", release, { signal });

  document.addEventListener("keydown", (event) => {
    if (event.isTrusted) void sound.unlock();
    if (["Shift", "Alt", "Control", "Meta"].includes(event.key)) return;
    if (event.key === "Escape") {
      release();
      world.reset(); renderer.paint(world, 1); stopFrame(); publishState();
      armed = false; clearIdle();
    } else if (world.state === "IDLE") { armed = false; clearIdle(); }
    else if (config.enableRetraction) outcome("RETRACTING", x, y);
  }, { signal });

  document.addEventListener("scroll", () => {
    geometryDirty = true;
    nextBackgroundRead = 0;
    world.pushFromScroll(view.scrollY - scrollY);
    scrollY = view.scrollY;
  }, { passive: true, capture: true, signal });
  view.addEventListener("resize", resize, { passive: true, signal });
  document.addEventListener("visibilitychange", () => {
    clearIdle(); stopFrame();
    release();
    sound.setHidden(document.hidden);
    if (!document.hidden) { geometryDirty = true; nextBackgroundRead = 0; scheduleIdle(); scheduleFrame(); }
  }, { signal });
  motion.addEventListener("change", () => {
    clearIdle(); stopFrame();
    release();
    if (motion.matches) {
      world.reset(); renderer.paint(world, 1); sound.setHidden(true); publishState();
    } else { sound.setHidden(document.hidden); scheduleIdle(); }
  }, { signal });
  const intersection = new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
    scheduleIdle();
  }, { threshold: 0.05 });
  const layout = new ResizeObserver(() => { geometryDirty = true; });
  intersection.observe(host); layout.observe(document.body);
  host.dataset.infectionState = "IDLE";
  resize();
  if (motion.matches) sound.setHidden(true);

  return {
    reset() { if (destroyed) return; world.reset(); renderer.paint(world, 1); stopFrame(); publishState(); scheduleIdle(); },
    setAudio(enabled: boolean, volume = config.volume) { if (!destroyed) sound.setOptions(enabled, volume); },
    snapshot() {
      const count = Math.min(frames, frameTimes.length);
      const intervals = Array.from(frameTimes.subarray(0, count)).sort((a, b) => a - b);
      const work = Array.from(workTimes.subarray(0, count)).sort((a, b) => a - b);
      const physics = Array.from(physicsTimes.subarray(0, count)).sort((a, b) => a - b);
      const geometry = Array.from(geometryTimes.subarray(0, count)).sort((a, b) => a - b);
      const body = Array.from(bodyTimes.subarray(0, count)).sort((a, b) => a - b);
      const detail = Array.from(detailTimes.subarray(0, count)).sort((a, b) => a - b);
      const median = intervals[Math.floor(count / 2)] ?? 0;
      return { ...world.inspect(), running: Boolean(frame), destroyed, hidden: document.hidden, reducedMotion: motion.matches, armed, inView,
        viewport: { width: world.width, height: world.height, density }, audio: sound.inspect(), rendering: renderer.inspect(),
        performance: { renderedFrames: frames, fixedSteps, fps: median ? 1000 / median : 0, medianFrameMs: median,
          p95FrameMs: intervals[Math.floor(count * 0.95)] ?? 0, medianWorkMs: work[Math.floor(count / 2)] ?? 0,
          p95WorkMs: work[Math.floor(count * 0.95)] ?? 0,
          medianPhysicsMs: physics[Math.floor(count / 2)] ?? 0, medianGeometryMs: geometry[Math.floor(count / 2)] ?? 0,
          medianBodyMs: body[Math.floor(count / 2)] ?? 0, medianDetailMs: detail[Math.floor(count / 2)] ?? 0,
          quality, droppedSeconds } };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clearIdle(); stopFrame(); events.abort();
      release();
      intersection.disconnect(); layout.disconnect();
      sound.dispose(); renderer.dispose(); world.reset(); canvas.remove();
      backgroundStyles.clear(); backgroundColors.length = 0;
      backgroundCanvas.width = backgroundCanvas.height = 0;
      delete host.dataset.infectionState;
    },
  };
}

export type RootInfectionController = ReturnType<typeof mountRootInfection>;
