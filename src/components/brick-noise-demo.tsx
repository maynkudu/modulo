"use client";

import { useCallback, useRef, useState } from "react";
import { BrickNoise, type BrickNoiseController, type BrickNoiseSnapshot } from "@/registry/brick-noise/BrickNoise";
import { LiquidButton } from "@/registry/liquid-animations/LiquidControls";
import { InterfaceSlider } from "./interface-slider";
import styles from "./brick-noise-demo.module.css";

declare global { interface Window { brickNoise?: BrickNoiseController; } }

/** Public playback controls. The shader keeps its source-time clock outside React. */
export function BrickNoiseDemo() {
  const controller = useRef<BrickNoiseController | null>(null);
  const [ready, setReady] = useState(false), [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1), [frame, setFrame] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false), [error, setError] = useState("");
  const onReady = useCallback((value: BrickNoiseController | null) => {
    controller.current = value; setReady(Boolean(value));
    if (value) setError("");
    if (process.env.NODE_ENV === "development") {
      if (value) window.brickNoise = value; else delete window.brickNoise;
    }
  }, []);
  const onFrame = useCallback((value: BrickNoiseSnapshot) => {
    setReducedMotion(value.reducedMotion);
  }, []);
  const onError = useCallback((value: Error) => setError(value.message), []);
  return <section className={styles.preview} aria-label="Brick noise preview">
    <BrickNoise speed={speed} paused={paused} onReady={onReady} onFrame={onFrame} onError={onError} />
    <div className={styles.toolbar}>
      <LiquidButton disabled={!ready || reducedMotion} aria-pressed={paused} onClick={() => {
        const next = !paused; setPaused(next);
        if (next && controller.current) setFrame(controller.current.snapshot().frame);
      }}>{paused ? "Resume" : "Pause"}</LiquidButton>
      <LiquidButton disabled={!ready} onClick={() => { controller.current?.seekFrame(0); setFrame(0); }}>Reset</LiquidButton>
    </div>
    <div className={styles.settings}>
      <InterfaceSlider label="Speed" min={25} max={200} step={25} value={speed * 100} disabled={!ready || reducedMotion}
        formatValue={value => `${value / 100}×`} onValueChange={value => setSpeed(value / 100)} />
      <InterfaceSlider label="Frame" min={0} max={44} step={1} value={frame} disabled={!ready || (!paused && !reducedMotion)}
        formatValue={value => `${value + 1} / 45`} onValueChange={value => { setFrame(value); controller.current?.seekFrame(value); }} />
    </div>
    {reducedMotion && <p className={styles.status} role="status">Animation is paused for reduced motion. You can still select a frame.</p>}
    {error && <p className={styles.error} role="alert">{error}</p>}
  </section>;
}
