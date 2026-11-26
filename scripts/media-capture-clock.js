(() => {
  const nativeRaf = window.requestAnimationFrame.bind(window);
  const nativeCancel = window.cancelAnimationFrame.bind(window);
  const realNow = performance.now.bind(performance);
  const realDate = Date.now.bind(Date);
  const realSetTimeout = window.setTimeout.bind(window);
  const realSetInterval = window.setInterval.bind(window);
  const realClearTimeout = window.clearTimeout.bind(window);
  const timers = new Map();
  const nativeTimers = new Map();
  const frames = new Map();
  const nativeIds = new Map();
  const animations = new Map();
  let id = 0;
  let time = null;
  let animationStart = 0;
  let epoch = 0;
  let timerId = 100000000;

  function schedule(handler, delay, repeating, args) {
    if (typeof handler !== "function") throw new Error("Capture timers require a function.");
    const key = ++timerId;
    const interval = repeating ? Math.max(1, Number(delay) || 0) : null;
    const timer = { callback: () => handler(...args), due: (time ?? realNow()) + (Number(delay) || 0), interval };
    timers.set(key, timer);
    const fire = () => {
      if (time !== null) return;
      if (interval === null) { timers.delete(key); nativeTimers.delete(key); }
      else timer.due = realNow() + interval;
      timer.callback();
    };
    if (time === null) nativeTimers.set(key, repeating ? realSetInterval(fire, delay) : realSetTimeout(fire, delay));
    return key;
  }
  window.setTimeout = (handler, delay, ...args) => schedule(handler, delay, false, args);
  window.setInterval = (handler, delay, ...args) => schedule(handler, delay, true, args);
  window.clearTimeout = window.clearInterval = key => {
    timers.delete(key);
    if (nativeTimers.has(key)) realClearTimeout(nativeTimers.get(key));
    nativeTimers.delete(key);
  };

  window.requestAnimationFrame = callback => {
    const key = ++id;
    frames.set(key, callback);
    if (time === null) nativeIds.set(key, nativeRaf(timestamp => {
      nativeIds.delete(key);
      if (time !== null) return;
      frames.delete(key);
      callback(timestamp);
    }));
    return key;
  };
  window.cancelAnimationFrame = key => {
    frames.delete(key);
    if (nativeIds.has(key)) nativeCancel(nativeIds.get(key));
    nativeIds.delete(key);
  };
  Object.defineProperty(performance, "now", { value: () => time ?? realNow() });
  Date.now = () => time === null ? realDate() : epoch + time - animationStart;
  window.startOfflineCapture = () => {
    time = realNow();
    animationStart = time;
    epoch = realDate();
    for (const nativeId of nativeIds.values()) nativeCancel(nativeId);
    nativeIds.clear();
    for (const nativeId of nativeTimers.values()) realClearTimeout(nativeId);
    nativeTimers.clear();
  };
  window.advanceOfflineCapture = milliseconds => {
    // Avoid rounding a nominal 1/60 step just below a component's 60 Hz gate.
    time = animationStart + milliseconds * (1 + 1e-8);
    for (const [key, timer] of [...timers]) {
      if (timer.due > time) continue;
      if (timer.interval === null) timers.delete(key);
      else timer.due += timer.interval;
      timer.callback();
    }
    const callbacks = [...frames.values()];
    frames.clear();
    for (const callback of callbacks) callback(time);
    window.dispatchEvent(new CustomEvent("modulo-media-time", { detail: milliseconds / 1000 }));
    for (const animation of document.getAnimations()) {
      if (!animations.has(animation)) {
        animations.set(animation, { time: animation.currentTime ?? 0, start: milliseconds });
        animation.pause();
      }
      const origin = animations.get(animation);
      animation.currentTime = origin.time + milliseconds - origin.start;
    }
  };
})();
