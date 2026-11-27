"use client";

import { useCallback, useRef, useState } from "react";
import { EyeSpice, type EyeSpiceController } from "@/registry/eyespice/EyeSpice";
import { PreviewButton } from "./preview-controls";
import styles from "./eyespice-demo.module.css";

declare global { interface Window { eyeSpice?: EyeSpiceController; } }

/** Public controls stay outside the scene's frame loop. */
export function EyeSpiceDemo() {
  const controller = useRef<EyeSpiceController | null>(null);
  const [ready, setReady] = useState(false);
  const [tracking, setTracking] = useState(true);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState("");
  const onReady = useCallback((value: EyeSpiceController | null) => {
    controller.current = value; setReady(Boolean(value));
    if (value) setError("");
    if (process.env.NODE_ENV === "development") {
      if (value) window.eyeSpice = value; else delete window.eyeSpice;
    }
  }, []);
  const onError = useCallback((value: Error) => setError(value.message), []);
  return <section className={styles.preview} aria-label="EyeSpice preview">
    <EyeSpice tracking={tracking} paused={paused} onReady={onReady} onError={onError} />
    <div className={styles.controls} data-eyespice-controls>
      <PreviewButton disabled={!ready} aria-pressed={tracking} onClick={() => { setTracking(value => !value); controller.current?.setClosed(null); }}>Follow cursor</PreviewButton>
      <PreviewButton disabled={!ready || paused} onClick={() => controller.current?.setClosed(true)}>Close eye</PreviewButton>
      <PreviewButton disabled={!ready || paused} onClick={() => controller.current?.setClosed(false)}>Open eye</PreviewButton>
      <PreviewButton disabled={!ready} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume" : "Pause"}</PreviewButton>
    </div>
    {error && <p className={styles.error} role="alert">{error}</p>}
  </section>;
}
