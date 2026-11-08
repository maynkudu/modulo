"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Nilkamal, WEATHERS, type NilkamalController, type Weather } from "@/registry/nilkamal/Nilkamal";
import type { FrameState } from "@/registry/nilkamal/engine/runtime";
import { useSoundSettings } from "@/lib/interface-sounds";
import styles from "./nilkamal-demo.module.css";

declare global { interface Window { nilkamal?: NilkamalController; } }

export function NilkamalDemo() {
  const id = useId();
  const controller = useRef<NilkamalController | null>(null);
  const lastStatus = useRef("");
  const sound = useSoundSettings();
  const enabled = sound.enabled && sound.volume > 0;
  const [weather, setWeather] = useState<Weather>("clear");
  const [intensity, setIntensity] = useState(.8);
  const [volume, setVolume] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [bloom, setBloom] = useState(1);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onReady = useCallback((instance: NilkamalController | null) => {
    controller.current = instance; setReady(Boolean(instance));
    if (process.env.NODE_ENV === "development") { if (instance) window.nilkamal = instance; else delete window.nilkamal; }
  }, []);
  const onFrame = useCallback((frame: FrameState) => {
    const status = `${frame.reducedMotion}/${frame.paused}`;
    if (lastStatus.current === status) return;
    lastStatus.current = status; setReducedMotion(frame.reducedMotion);
  }, []);
  const onError = useCallback((error: Error) => setError(error.message), []);
  const unlock = () => { void controller.current?.unlockAudio().catch(() => {}); };

  async function save() {
    const instance = controller.current; if (!instance) return;
    setSaving(true); setError("");
    try {
      const blob = await instance.exportPNG(); const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url; link.download = `nilkamal-${weather}.png`; link.click(); URL.revokeObjectURL(url);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save the image."); }
    finally { setSaving(false); }
  }

  return <>
    <section className={styles.artwork} aria-label="Nilkamal preview">
      <header className={styles.artworkHeader}><h2>Nilkamal</h2><span>{reducedMotion ? "Still preview" : paused ? "Paused" : weather.charAt(0).toUpperCase() + weather.slice(1)}</span></header>
      <Nilkamal weather={weather} intensity={intensity} paused={paused} enableAudio={enabled} volume={volume * sound.volume} onReady={onReady} onFrame={onFrame} onError={onError} fallback="/artwork/nilkamal.png" />
    </section>
    <section className={styles.controlsPanel} aria-labelledby={`${id}-controls`}>
      <h2 id={`${id}-controls`}>Weather</h2>
      <div className={styles.weather} role="group" aria-label="Weather">
        {WEATHERS.map(value => <button type="button" key={value} aria-pressed={weather === value} disabled={!ready} onClick={() => { unlock(); setWeather(value); }}>{value.charAt(0).toUpperCase() + value.slice(1)}</button>)}
      </div>
      <p className={styles.hint}>{reducedMotion ? "Motion follows your reduced-motion preference. Select a weather to change the still." : "Hover over the petals, pull the lotus, or brush the water. Snow and ice build over time."}</p>
      <label className={styles.field} htmlFor={`${id}-intensity`}><span>Intensity</span><output>{Math.round(intensity * 100)}%</output></label>
      <input id={`${id}-intensity`} className={styles.slider} type="range" min="0.2" max="1" step="0.05" value={intensity} disabled={!ready} onChange={event => { unlock(); setIntensity(Number(event.currentTarget.value)); }} />
      <label className={styles.field} htmlFor={`${id}-bloom`}><span>Bloom</span><output>{Math.round(bloom * 100)}%</output></label>
      <input id={`${id}-bloom`} className={styles.slider} type="range" min="0" max="1" step="0.01" value={bloom} disabled={!ready} onChange={event => { const value = Number(event.currentTarget.value); setBloom(value); controller.current?.setBloom(value); unlock(); }} />
      <label className={styles.field} htmlFor={`${id}-volume`}><span>Volume</span><output>{enabled ? `${Math.round(volume * 100)}%` : "Muted"}</output></label>
      <input id={`${id}-volume`} className={styles.slider} type="range" min="0" max="1" step="0.05" value={volume} disabled={!ready || !enabled} onChange={event => { unlock(); setVolume(Number(event.currentTarget.value)); }} />
      <div className={styles.actions}>
        <button type="button" disabled={!ready || reducedMotion} aria-pressed={paused} onClick={() => { unlock(); setPaused(!paused); }}>{paused ? "Resume" : "Pause"}</button>
        <button type="button" disabled={!ready || reducedMotion || paused || weather !== "storm"} onClick={() => { unlock(); controller.current?.lightning(); }}>Lightning</button>
        <button type="button" disabled={!ready} onClick={() => { controller.current?.reset(); setBloom(1); }}>Reset</button>
        <button type="button" disabled={!ready || saving} onClick={save}>{saving ? "Saving..." : "Save PNG"}</button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  </>;
}
