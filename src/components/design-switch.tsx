"use client";

import { useEffect, useSyncExternalStore } from "react";
import { designStorageKey, isSiteDesign, type SiteDesign } from "@/lib/site-design";
import styles from "./design-switch.module.css";

const designEvent = "modulo-design-change";

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

function changeDesign(design: SiteDesign) {
  if (snapshot() === design) return;
  try { localStorage.setItem(designStorageKey, design); } catch { /* Storage can be disabled. */ }
  applyDesign(design);
}

/** Syncs the stored presentation preference without remounting page content. */
export function DesignRuntime() {
  useEffect(() => {
    function syncStorage(event: StorageEvent) {
      if (event.key === designStorageKey && isSiteDesign(event.newValue)) applyDesign(event.newValue);
    }
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);
  return null;
}

export function DesignSwitch() {
  const design = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return <div className={styles.switch} role="group" aria-label="Site design">
    <button type="button" data-design-mode="artistic" aria-pressed={design === "artistic"} onClick={() => changeDesign("artistic")}>Artistic</button>
    <button type="button" data-design-mode="bold" aria-pressed={design === "bold"} onClick={() => changeDesign("bold")}>Bold</button>
  </div>;
}
