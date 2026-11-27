type EntranceClasses = { overlay: string; backdrop: string; window: string; image: string; skip: string };

/** Opens a real image slit into its target, with cancellation restoring the document. */
export function playSiteEntrance({ root, target, image, classes, onFinish }: {
  root: HTMLElement;
  target: HTMLElement;
  image: string;
  classes: EntranceClasses;
  onFinish: () => void;
}) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || typeof target.animate !== "function") {
    onFinish();
    return () => {};
  }
  const overlay = document.createElement("div");
  overlay.className = classes.overlay;
  overlay.dataset.siteEntrance = "";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Preparing preview");
  const backdrop = document.createElement("div");
  backdrop.className = classes.backdrop;
  const slit = document.createElement("div");
  slit.className = classes.window;
  const artwork = document.createElement("img");
  artwork.className = classes.image;
  artwork.alt = "";
  artwork.src = image;
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = classes.skip;
  skip.textContent = "Skip entrance";
  slit.append(artwork);
  overlay.append(backdrop, slit, skip);
  document.body.append(overlay);

  const previousFocus = document.activeElement;
  const previousInert = root.inert;
  root.inert = true;
  const events = new AbortController();
  const animations: Animation[] = [];
  let settled = false;
  const observer = new MutationObserver(() => {
    if (!target.isConnected || !root.isConnected) finish();
  });
  const watchdog = window.setTimeout(finish, 4500);
  function finish() {
    if (settled) return;
    settled = true;
    clearTimeout(watchdog);
    events.abort();
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    overlay.remove();
    root.inert = previousInert;
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected && !previousFocus.closest("[inert]")) previousFocus.focus({ preventScroll: true });
    onFinish();
  }
  skip.addEventListener("click", finish, { signal: events.signal });
  overlay.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); finish(); }
    else if (event.key === "Tab") { event.preventDefault(); skip.focus({ preventScroll: true }); }
    else if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) event.preventDefault();
  }, { signal: events.signal });
  overlay.addEventListener("wheel", event => event.preventDefault(), { passive: false, signal: events.signal });
  overlay.addEventListener("touchmove", event => event.preventDefault(), { passive: false, signal: events.signal });
  motion.addEventListener("change", event => { if (event.matches) finish(); }, { signal: events.signal });
  window.addEventListener("resize", finish, { signal: events.signal });
  document.addEventListener("visibilitychange", () => { if (document.hidden) finish(); }, { signal: events.signal });
  observer.observe(document.body, { childList: true, subtree: true });
  skip.focus({ preventScroll: true });

  async function prepare() {
    try {
      const visibleImages = [...root.querySelectorAll("img")].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
      });
      const finiteAnimations = new Set<Animation>();
      for (let element: HTMLElement | null = target; element; element = element.parentElement) {
        element.getAnimations().forEach(animation => {
          if (animation.playState === "running" && Number.isFinite(animation.effect?.getComputedTiming().endTime)) finiteAnimations.add(animation);
        });
        if (element === root) break;
      }
      await Promise.allSettled([document.fonts.ready, ...visibleImages.map(element => element.decode()), ...[...finiteAnimations].map(animation => animation.finished)]);
      await artwork.decode();
      if (settled) return;
      if (!target.isConnected || !root.isConnected || artwork.naturalWidth === 0) { finish(); return; }
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || rect.bottom <= 0 || rect.top >= innerHeight) { finish(); return; }
      let matrix = new DOMMatrix();
      for (let element: HTMLElement | null = target; element; element = element.parentElement) {
        const transform = getComputedStyle(element).transform;
        if (transform !== "none") matrix = new DOMMatrix(transform).multiply(matrix);
      }
      const width = matrix.is2D ? target.offsetWidth * Math.hypot(matrix.a, matrix.b) : rect.width;
      const height = matrix.is2D ? target.offsetHeight * Math.hypot(matrix.c, matrix.d) : rect.height;
      const angle = matrix.is2D ? Math.atan2(matrix.b, matrix.a) * 180 / Math.PI : 0;
      const style = getComputedStyle(target);
      Object.assign(artwork.style, {
        width: `${width}px`, height: `${height}px`, objectFit: target instanceof HTMLImageElement ? style.objectFit : "contain",
        objectPosition: style.objectPosition, clipPath: style.clipPath, borderRadius: style.borderRadius,
      });
      slit.style.backgroundColor = target instanceof HTMLImageElement ? "transparent" : style.backgroundColor;
      const unfold = slit.animate([
        { left: `${innerWidth / 2 - 32}px`, top: `${innerHeight / 2 - 110}px`, width: "64px", height: "220px", transform: "rotate(0deg)" },
        { left: `${rect.left + (rect.width - width) / 2}px`, top: `${rect.top + (rect.height - height) / 2}px`, width: `${width}px`, height: `${height}px`, transform: `rotate(${angle}deg)` },
      ], { duration: 1040, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
      animations.push(unfold, backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 550, delay: 170, fill: "forwards" }));
      [...root.querySelectorAll("[data-modulo-loader-reveal]")].slice(0, 8).forEach((row, index) => {
        animations.push(row.animate([
          { clipPath: "inset(0 100% 0 0)", transform: "translateX(-20px)" },
          { clipPath: "inset(0)", transform: "translateX(0)" },
        ], { duration: 650, delay: 220 + index * 45, easing: "cubic-bezier(.19,1,.22,1)", fill: "backwards" }));
      });
      await Promise.all(animations.map(animation => animation.finished));
      finish();
    } catch { finish(); }
  }
  void prepare();
  return finish;
}
