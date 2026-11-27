"use client";

import { flushSync } from "react-dom";
import { useEffect, useSyncExternalStore } from "react";
import { designStorageKey, isSiteDesign, type SiteDesign } from "@/lib/site-design";
import styles from "./design-switch.module.css";

const designEvent = "modulo-design-change";
let activeThemeTransition: ViewTransition | undefined;
let requestedDesign: SiteDesign | undefined;
let designRevision = 0;

function subscribe(notify: () => void) {
  window.addEventListener(designEvent, notify);
  return () => window.removeEventListener(designEvent, notify);
}
function snapshot(): SiteDesign {
  return document.documentElement.dataset.design === "bold" ? "bold" : "artistic";
}
function serverSnapshot(): SiteDesign { return "artistic"; }

function applyDesign(design: SiteDesign) {
  document.documentElement.dataset.design = design;
  window.dispatchEvent(new Event(designEvent));
}

function commitDesign(design: SiteDesign) {
  try { localStorage.setItem(designStorageKey, design); } catch { /* Storage can be disabled. */ }
  applyDesign(design);
}

function clearThemeTransition(transition: ViewTransition) {
  if (activeThemeTransition !== transition) return;
  activeThemeTransition = undefined;
  requestedDesign = undefined;
  document.documentElement.removeAttribute("data-design-transition");
  document.documentElement.style.removeProperty("--modulo-theme-origin-x");
  document.documentElement.style.removeProperty("--modulo-theme-origin-y");
}

function cancelThemeTransition() {
  const transition = activeThemeTransition;
  if (!transition) return;
  activeThemeTransition = undefined;
  designRevision += 1;
  requestedDesign = undefined;
  transition.skipTransition();
  document.documentElement.removeAttribute("data-design-transition");
  document.documentElement.style.removeProperty("--modulo-theme-origin-x");
  document.documentElement.style.removeProperty("--modulo-theme-origin-y");
}

function changeDesign(design: SiteDesign, origin: DOMRect) {
  if ((requestedDesign ?? snapshot()) === design) return;
  if (activeThemeTransition) {
    cancelThemeTransition();
    commitDesign(design);
    return;
  }

  const html = document.documentElement;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || typeof document.startViewTransition !== "function") {
    designRevision += 1;
    requestedDesign = undefined;
    commitDesign(design);
    return;
  }

  const revision = ++designRevision;
  requestedDesign = design;
  html.style.setProperty("--modulo-theme-origin-x", `${origin.left + origin.width / 2}px`);
  html.style.setProperty("--modulo-theme-origin-y", `${origin.top + origin.height / 2}px`);
  html.dataset.designTransition = "active";

  try {
    const transition = document.startViewTransition(() => {
      if (designRevision !== revision) return;
      flushSync(() => commitDesign(design));
    });
    activeThemeTransition = transition;
    void transition.finished.then(
      () => clearThemeTransition(transition),
      () => clearThemeTransition(transition),
    );
  } catch {
    if (designRevision === revision) requestedDesign = undefined;
    html.removeAttribute("data-design-transition");
    html.style.removeProperty("--modulo-theme-origin-x");
    html.style.removeProperty("--modulo-theme-origin-y");
    commitDesign(design);
  }
}

/** Syncs the stored presentation preference without remounting page content. */
export function DesignRuntime() {
  useEffect(() => {
    function syncStorage(event: StorageEvent) {
      if (event.key === designStorageKey && isSiteDesign(event.newValue)) {
        cancelThemeTransition();
        applyDesign(event.newValue);
      }
    }
    function cancelBeforeNavigation(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank") return;
      const destination = new URL(link.href, location.href);
      if (destination.origin === location.origin && (destination.pathname !== location.pathname || destination.search !== location.search)) {
        cancelThemeTransition();
      }
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    function cancelForReducedMotion(event: MediaQueryListEvent) {
      if (event.matches) cancelThemeTransition();
    }
    window.addEventListener("storage", syncStorage);
    document.addEventListener("click", cancelBeforeNavigation, true);
    window.addEventListener("popstate", cancelThemeTransition);
    reducedMotion.addEventListener("change", cancelForReducedMotion);
    return () => {
      window.removeEventListener("storage", syncStorage);
      document.removeEventListener("click", cancelBeforeNavigation, true);
      window.removeEventListener("popstate", cancelThemeTransition);
      reducedMotion.removeEventListener("change", cancelForReducedMotion);
    };
  }, []);
  return null;
}

export function DesignSwitch() {
  const design = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return <div className={styles.switch} role="group" aria-label="Site design">
    <button type="button" data-design-mode="artistic" aria-pressed={design === "artistic"} onClick={event => changeDesign("artistic", event.currentTarget.getBoundingClientRect())}>Artistic</button>
    <button type="button" data-design-mode="bold" aria-pressed={design === "bold"} onClick={event => changeDesign("bold", event.currentTarget.getBoundingClientRect())}>Bold</button>
  </div>;
}
