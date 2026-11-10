"use client";

import { useCallback, useId, useRef, useState } from "react";
import { LogoRefraction, type LogoRefractionController, type LogoRefractionFrame } from "@/registry/logo-refraction/LogoRefraction";
import styles from "./logo-refraction-demo.module.css";

declare global { interface Window { logoRefraction?: LogoRefractionController; } }

export function LogoRefractionDemo() {
  const id = useId();
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
      <button type="button" disabled={!ready || reducedMotion} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</button>
      <button type="button" disabled={!ready} aria-pressed={showOriginal} onClick={() => setShowOriginal(!showOriginal)}>{showOriginal ? "Show refraction" : "Show original"}</button>
    </div>
    <div className={styles.settings}>
      {controls.map(({ name, label, value, setValue }) => <div className={styles.setting} key={name}>
        <label htmlFor={`${id}-${name}`}>{label}<output>{Math.round(value * 100)}%</output></label>
        <input id={`${id}-${name}`} name={name} type="range" min="0" max="100" step="1" value={Math.round(value * 100)} disabled={!ready} onChange={event => setValue(Number(event.currentTarget.value) / 100)} />
      </div>)}
    </div>
    {reducedMotion && <p className={styles.status} role="status">Motion follows your reduced-motion preference.</p>}
    {error && <p className={styles.error} role="alert">{error}</p>}
  </section>;
}
