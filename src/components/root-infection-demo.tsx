"use client";

import { useCallback, useSyncExternalStore } from "react";
import { RootInfection, type RootInfectionController } from "@/registry/root-infection/RootInfection";
import { soundEnabled, subscribeToSound } from "@/lib/interface-sounds";
import styles from "./root-infection-demo.module.css";

declare global {
  interface Window { rootInfection?: RootInfectionController; }
}

const enabledOnServer = () => true;

export function RootInfectionDemo() {
  const enabled = useSyncExternalStore(subscribeToSound, soundEnabled, enabledOnServer);
  const onReady = useCallback((controller: RootInfectionController | null) => {
    if (process.env.NODE_ENV !== "development") return;
    if (controller) window.rootInfection = controller;
    else delete window.rootInfection;
  }, []);

  return <section className={styles.preview} aria-label="Root Infection preview">
    <RootInfection volume={.85} enableAudio={enabled} className={styles.experience} onReady={onReady} />
  </section>;
}
