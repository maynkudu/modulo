"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PortraitWave, type PortraitShaderState, type PortraitWaveController } from "@/registry/portrait-wave/PortraitWave";
import { PreviewButton } from "./preview-controls";
import { portraitWaveImages } from "@/lib/portrait-wave-content";
import { InterfaceSlider } from "./interface-slider";
import styles from "./portrait-wave-demo.module.css";

declare global { interface Window { portraitWave?: PortraitWaveController; } }
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(notify: () => void) { const query = matchMedia(motionQuery); query.addEventListener("change", notify); return () => query.removeEventListener("change", notify); }
const reducedMotion = () => matchMedia(motionQuery).matches;
const serverMotion = () => false;

/** Public controls and local image replacement, independent of the installable shader. */
export function PortraitWaveDemo() {
  const [images, setImages] = useState<readonly string[]>(portraitWaveImages);
  const [state, setState] = useState<PortraitShaderState>({ kind: "loading", count: images.length });
  const [paused, setPaused] = useState(false), [warp, setWarp] = useState(1), [instance, setInstance] = useState(0);
  const [count, setCount] = useState(0), [uploadError, setUploadError] = useState("");
  const controller = useRef<PortraitWaveController | null>(null), time = useRef<HTMLInputElement>(null), output = useRef<HTMLOutputElement>(null);
  const uploads = useRef<string[]>([]), currentURLs = useRef<readonly string[]>(portraitWaveImages);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, serverMotion);
  useEffect(() => () => { uploads.current.forEach(url => URL.revokeObjectURL(url)); }, []);
  const onReady = useCallback((value: PortraitWaveController | null) => {
    controller.current = value;
    if (!value) setCount(0);
    if (process.env.NODE_ENV === "development") { if (value) window.portraitWave = value; else delete window.portraitWave; }
  }, []);
  const onState = useCallback((value: PortraitShaderState) => {
    setState(value);
    if (value.kind === "ready") {
      setCount(value.count);
      uploads.current = uploads.current.filter(url => { if (currentURLs.current.includes(url)) return true; URL.revokeObjectURL(url); return false; });
    } else if (value.kind === "empty" || value.kind === "disposed") setCount(0);
  }, []);
  const onTime = useCallback((milliseconds: number) => {
    if (time.current) time.current.value = String(Math.round(milliseconds));
    if (output.current) output.current.value = `${Math.round(milliseconds)} ms`;
  }, []);
  function replace(next: readonly string[]) { currentURLs.current = next; setUploadError(""); setImages(next); }
  const busy = state.kind === "loading";
  return <section className={styles.preview} aria-label="Portrait wave preview">
    <PortraitWave key={instance} images={images} paused={paused} warp={warp} onReady={onReady} onState={onState} onTime={onTime} />
    <div className={styles.toolbar}>
      <PreviewButton disabled={count < 2 || reduced} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</PreviewButton>
      <PreviewButton disabled={!count} onClick={() => controller.current?.seek(0)}>Reset</PreviewButton>
      <PreviewButton onClick={() => replace(portraitWaveImages)}>Use sample images</PreviewButton>
      {state.kind === "error" && <PreviewButton onClick={() => setInstance(value => value + 1)}>Retry</PreviewButton>}
    </div>
    <div className={styles.settings}>
      <label className={styles.time}>Time<output ref={output}>0 ms</output>
        <input ref={time} type="range" aria-label="Time" min={0} max={1940} step={1} defaultValue={0} disabled={count < 2 || reduced}
          onChange={event => { setPaused(true); controller.current?.pause(); controller.current?.seek(Number(event.currentTarget.value)); }} />
      </label>
      <InterfaceSlider className={styles.deformation} label="Deformation" min={0} max={100} step={1} value={Math.round(warp * 100)} disabled={count < 2 || reduced}
        formatValue={value => `${value}%`} onValueChange={value => setWarp(value / 100)} />
    </div>
    <label className={styles.upload}>Replace images
      <input type="file" accept="image/*" multiple onChange={event => {
        const files = event.currentTarget.files;
        if (!files?.length) return;
        if (files.length > 64) { setUploadError("Choose up to 64 images."); return; }
        const next = Array.from(files, file => URL.createObjectURL(file));
        event.currentTarget.value = "";
        uploads.current.push(...next); replace(next);
      }} />
    </label>
    <p className={styles.status}>Selected files stay in this browser.</p>
    {busy && <p className={styles.status} role="status">Loading images and computing their correspondence.</p>}
    {state.kind === "empty" && <p className={styles.status} role="status">No images supplied.</p>}
    {reduced && <p className={styles.status} role="status">Reduced motion displays the first portrait without animation.</p>}
    {(state.kind === "error" || uploadError) && <p className={styles.error} role="alert">{uploadError || (state.kind === "error" ? state.message : "")}</p>}
  </section>;
}
