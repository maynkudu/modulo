"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ModuloLogo } from "./modulo-logo";
import { playSiteEntrance } from "@/lib/site-entrance";
import styles from "./site-entrance.module.css";

export function SiteEntrance() {
  const overlay = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    const root = document.getElementById("site-shell");
    if (!root || !overlay.current) return;
    const html = document.documentElement;
    if (pathname !== "/") {
      if (html.dataset.entrance === "pending") {
        html.dataset.entrance = "complete";
        document.dispatchEvent(new Event("modulo-entrance-complete"));
      }
      return;
    }
    if (html.dataset.entrance !== "pending") return;
    return playSiteEntrance({ root, overlay: overlay.current });
  }, [pathname]);

  return <div ref={overlay} className={styles.overlay} data-site-entrance="" role="dialog" aria-modal="true" aria-label="Preparing preview">
    <div className={styles.top} data-entrance-panel="top" />
    <div className={styles.bottom} data-entrance-panel="bottom" />
    <div className={styles.mask} aria-hidden="true"><span className={styles.word} data-entrance-word=""><ModuloLogo alt="" className={styles.wordmark} /></span></div>
    <button className={styles.skip} type="button">Skip entrance</button>
  </div>;
}
