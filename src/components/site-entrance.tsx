"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { playSiteEntrance } from "@/lib/site-entrance";
import styles from "./site-entrance.module.css";

let entered = false;

export function SiteEntrance() {
  const pathname = usePathname();
  useEffect(() => {
    if (entered || pathname === "/access" || pathname === "/mint") return;
    let cancel: (() => void) | undefined;
    let observer: MutationObserver | undefined;
    let finished = false;
    document.documentElement.dataset.entranceReady = "false";
    const complete = () => { document.documentElement.dataset.entranceReady = "true"; };
    function start() {
      if (finished) return;
      const root = document.getElementById("site-shell");
      const target = root?.querySelector<HTMLElement>("[data-modulo-entrance-target]");
      const image = target instanceof HTMLImageElement ? target.currentSrc || target.src
        : target?.dataset.moduloEntranceSrc || target?.querySelector<HTMLImageElement>("img")?.src;
      if (!root || !target || !image) return;
      finished = true;
      entered = true;
      observer?.disconnect();
      cancel = playSiteEntrance({ root, target, image, classes: { overlay: styles.overlay, backdrop: styles.backdrop, window: styles.window, image: styles.image, skip: styles.skip }, onFinish: complete });
    }
    const frame = requestAnimationFrame(() => {
      start();
      if (!finished) { observer = new MutationObserver(start); observer.observe(document.body, { childList: true, subtree: true }); }
    });
    const timeout = window.setTimeout(() => { if (!finished) { observer?.disconnect(); finished = true; complete(); } }, 2500);
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); observer?.disconnect(); cancel?.(); };
  }, [pathname]);
  return null;
}
