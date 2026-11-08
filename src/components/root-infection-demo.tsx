"use client";

import { useCallback } from "react";
import { RootInfection, type RootInfectionController } from "@/registry/root-infection/RootInfection";
import { useSoundSettings } from "@/lib/interface-sounds";
import styles from "./root-infection-demo.module.css";

declare global {
  interface Window { rootInfection?: RootInfectionController; }
}


export function RootInfectionDemo() {
  const sound = useSoundSettings();
  const onReady = useCallback((controller: RootInfectionController | null) => {
    if (process.env.NODE_ENV !== "development") return;
    if (controller) window.rootInfection = controller;
    else delete window.rootInfection;
  }, []);

  return <section className={styles.preview} aria-label="Root Infection preview">
    <RootInfection volume={.85 * sound.volume} enableAudio={sound.enabled && sound.volume > 0} className={styles.experience} onReady={onReady} />
  </section>;
}
