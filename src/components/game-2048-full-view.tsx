"use client";

import { Game2048, type Game2048Controller } from "@/registry/2048/Game2048";
import styles from "./full-view.module.css";

function ready(controller: Game2048Controller | null) {
  if (process.env.NODE_ENV !== "development") return;
  if (controller) window.game2048 = controller; else delete window.game2048;
}

/** The game alone, at page size, for the play route linked from its catalogue page. */
export function Game2048FullView() {
  return <div className={`${styles.viewport} ${styles.game}`}><Game2048 onReady={ready} /></div>;
}
