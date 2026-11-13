"use client";

import { useCallback, useRef, useState } from "react";
import { LogoRefraction, type LogoRefractionController, type LogoRefractionFrame } from "@/registry/logo-refraction/LogoRefraction";
import { LiquidButton } from "@/registry/liquid-animations/LiquidControls";
import { InterfaceSlider } from "./interface-slider";
import styles from "./logo-refraction-demo.module.css";

declare global { interface Window { logoRefraction?: LogoRefractionController; } }

export function LogoRefractionDemo() {
  const lastMotion = useRef(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [strength, setStrength] = useState(1);
  const [dispersion, setDispersion] = useState(.55);
  const [markSheen, setMarkSheen] = useState(.7);
  const [speed, setSpeed] = useState(.4);
  const [error, setError] = useState("");

  const onReady = useCallback((controller: LogoRefractionController | null) => {
    setReady(Boolean(controller));
    if (controller) setError("");
    if (process.env.NODE_ENV === "development") {
      if (controller) window.logoRefraction = controller; else delete window.logoRefraction;
    }
  }, []);
  const onFrame = useCallback((frame: LogoRefractionFrame) => {
    if (lastMotion.current === frame.reducedMotion) return;
    lastMotion.current = frame.reducedMotion;
    setReducedMotion(frame.reducedMotion);
  }, []);
  const onError = useCallback((error: Error) => setError(error.message), []);
  const controls = [
    { name: "strength", label: "Black refraction", value: strength, setValue: setStrength },
    { name: "dispersion", label: "Dispersion", value: dispersion, setValue: setDispersion },
    { name: "markSheen", label: "n sheen", value: markSheen, setValue: setMarkSheen },
    { name: "speed", label: "Speed", value: speed, setValue: setSpeed },
  ];

  return <section className={styles.preview} aria-label="Logo refraction preview">
    <LogoRefraction src="/artwork/maynkudu-warehouse.png" alt="The complete maynkudu logo" strength={strength} dispersion={dispersion} markSheen={markSheen} speed={speed} paused={paused} showOriginal={showOriginal} onReady={onReady} onFrame={onFrame} onError={onError} />
    <div className={styles.toolbar}>
      <p>Move over the image</p>
      <LiquidButton type="button" disabled={!ready || reducedMotion} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</LiquidButton>
      <LiquidButton type="button" disabled={!ready} aria-pressed={showOriginal} onClick={() => setShowOriginal(!showOriginal)}>{showOriginal ? "Show refraction" : "Show original"}</LiquidButton>
    </div>
    <div className={styles.settings}>
      {controls.map(({ name, label, value, setValue }) => <InterfaceSlider className={styles.setting} key={name}
        label={label} min={0} max={100} step={1} value={Math.round(value * 100)} disabled={!ready}
        formatValue={next => `${next}%`} onValueChange={next => setValue(next / 100)} />)}
    </div>
    {reducedMotion && <p className={styles.status} role="status">Motion follows your reduced-motion preference.</p>}
    {error && <p className={styles.error} role="alert">{error}</p>}
  </section>;
}
