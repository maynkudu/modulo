export const entranceCompleteEvent = "modulo-entrance-complete";

/** Runs before paint and never waits on the page's image assets. */
export const entranceInitialization = `(()=>{const root=document.documentElement;if(window.top!==window||location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches){root.dataset.entrance="complete";return}root.dataset.entrance="pending";const deadline=setTimeout(()=>{root.dataset.entrance="complete";const shell=document.getElementById("site-shell");if(shell)shell.inert=false;document.dispatchEvent(new Event("${entranceCompleteEvent}"))},3500);document.addEventListener("${entranceCompleteEvent}",()=>clearTimeout(deadline),{once:true})})()`;

/** Reveals the actual page underneath fixed panels, without changing its geometry. */
export function playSiteEntrance({ root, overlay }: { root: HTMLElement; overlay: HTMLElement }) {
  const html = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const previousFocus = document.activeElement;
  const previousInert = root.inert;
  const events = new AbortController();
  const animations: Animation[] = [];
  let active = true;
  let contentObserver: MutationObserver | undefined;
  let finishContentWait: (() => void) | undefined;
  let firstFrame = 0;
  let secondFrame = 0;

  function finish() {
    if (!active) return;
    active = false;
    events.abort();
    finishContentWait?.();
    contentObserver?.disconnect();
    cancelAnimationFrame(firstFrame);
    cancelAnimationFrame(secondFrame);
    animations.forEach(animation => animation.cancel());
    root.inert = previousInert;
    html.dataset.entrance = "complete";
    document.dispatchEvent(new Event(entranceCompleteEvent));
    if (overlay.contains(document.activeElement)) {
      const target = previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected
        ? previousFocus : root.querySelector<HTMLElement>("main");
      if (target) {
        const tabindex = target.getAttribute("tabindex");
        if (tabindex === null) target.tabIndex = -1;
        target.focus({ preventScroll: true });
        if (tabindex === null) target.removeAttribute("tabindex");
      }
    }
  }

  if (html.dataset.entrance !== "pending" || motion.matches || document.hidden) {
    finish();
    return finish;
  }

  root.inert = true;
  const skip = overlay.querySelector<HTMLButtonElement>("button");
  skip?.addEventListener("click", finish, { signal: events.signal });
  overlay.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); finish(); }
    else if (event.key === "Tab") { event.preventDefault(); skip?.focus({ preventScroll: true }); }
  }, { signal: events.signal });
  overlay.addEventListener("wheel", event => event.preventDefault(), { passive: false, signal: events.signal });
  overlay.addEventListener("touchmove", event => event.preventDefault(), { passive: false, signal: events.signal });
  motion.addEventListener("change", finish, { signal: events.signal });
  window.addEventListener("resize", finish, { signal: events.signal });
  window.addEventListener("pagehide", finish, { signal: events.signal });
  document.addEventListener("visibilitychange", () => { if (document.hidden) finish(); }, { signal: events.signal });
  document.addEventListener(entranceCompleteEvent, finish, { signal: events.signal });
  skip?.focus({ preventScroll: true });

  async function prepare() {
    try {
      const content = new Promise<void>(resolve => {
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(deadline);
          contentObserver?.disconnect();
          finishContentWait = undefined;
          resolve();
        };
        const deadline = window.setTimeout(settle, 1200);
        finishContentWait = settle;
        const check = () => {
          if (root.querySelector("main")) settle();
        };
        contentObserver = new MutationObserver(check);
        contentObserver.observe(root, { childList: true, subtree: true });
        check();
      });
      await content;
      if (!active) return;
      await new Promise<void>(resolve => {
        firstFrame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(() => resolve()); });
      });
      if (!active) return;
      const top = overlay.querySelector<HTMLElement>("[data-entrance-panel='top']");
      const bottom = overlay.querySelector<HTMLElement>("[data-entrance-panel='bottom']");
      const word = overlay.querySelector<HTMLElement>("[data-entrance-word]");
      if (!top || !bottom || !word) { finish(); return; }
      html.dataset.entrance = "revealing";
      const easing = "cubic-bezier(.76,0,.24,1)";
      animations.push(
        word.animate([
          { transform: "translateY(110%)", opacity: 0, offset: 0 },
          { transform: "translateY(0)", opacity: 1, offset: .32 },
          { transform: "translateY(0)", opacity: 1, offset: .52 },
          { transform: "translateY(-110%)", opacity: 0, offset: 1 },
        ], { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }),
        top.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { delay: 380, duration: 850, easing, fill: "both" }),
        bottom.animate([{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], { delay: 380, duration: 850, easing, fill: "both" }),
      );
      await Promise.all(animations.map(animation => animation.finished));
      finish();
    } catch { finish(); }
  }
  void prepare();
  return finish;
}
