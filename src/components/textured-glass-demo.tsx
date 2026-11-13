"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DEFAULT_GLASS_SETTINGS, TexturedGlass, type DepthState, type GlassFrame, type TexturedGlassController } from "@/registry/textured-glass/TexturedGlass";
import { LiquidButton, LiquidDisclosure } from "@/registry/liquid-animations/LiquidControls";
import { InterfaceSlider } from "./interface-slider";
import { LiquidTrack } from "@/registry/liquid-animations/LiquidTrack";
import styles from "./textured-glass-demo.module.css";

declare global { interface Window { texturedGlass?: TexturedGlassController; } }

const DEFAULT_IMAGE = "/artwork/stay.jpeg";
const ranges = {
  roughness: { label: "Glass texture", min: 0, max: 2, step: 0.01 },
  distortion: { label: "Distortion", min: 0, max: 0.05, step: 0.001 },
  blur: { label: "Blur", min: 0, max: 30, step: 1 },
  depth: { label: "Image depth", min: 0, max: 2, step: 0.05 },
  parallax: { label: "Perspective", min: 0, max: 1.5, step: 0.05 },
  depthStrength: { label: "Object depth", min: 0, max: 2, step: 0.05 },
  focusDepth: { label: "Focus depth", min: 0, max: 1, step: 0.01 },
  focusBlur: { label: "Focus blur", min: 0, max: 30, step: 1 },
  lightIntensity: { label: "Light intensity", min: 0, max: 2, step: 0.01 },
  textureScale: { label: "Texture scale", min: 0.25, max: 8, step: 0.05 },
  grid: { label: "Grid opacity", min: 0, max: 1, step: 0.01 },
  gridSize: { label: "Grid density", min: 10, max: 200, step: 1 },
  lightSize: { label: "Light size", min: 0.1, max: 1.5, step: 0.01 },
  speed: { label: "Light speed", min: 0, max: 2, step: 0.05 },
};
const basicRanges = ["roughness", "distortion", "depthStrength", "parallax", "focusDepth", "focusBlur"] satisfies (keyof typeof ranges)[];
const advancedRanges = ["depth", "lightIntensity", "blur", "textureScale", "grid", "gridSize", "lightSize", "speed"] satisfies (keyof typeof ranges)[];

export function TexturedGlassDemo() {
  const id = useId();
  const instance = useRef<TexturedGlassController | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const lastStatus = useRef("");
  const [settings, setSettings] = useState(DEFAULT_GLASS_SETTINGS);
  const [image, setImage] = useState({ src: DEFAULT_IMAGE, name: "stay.jpeg" });
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [depthState, setDepthState] = useState<DepthState>({ kind: "idle" });
  useEffect(() => () => { if (image.src.startsWith("blob:")) URL.revokeObjectURL(image.src); }, [image.src]);

  const onReady = useCallback((controller: TexturedGlassController | null) => {
    instance.current = controller; setReady(Boolean(controller));
    if (process.env.NODE_ENV === "development") { if (controller) window.texturedGlass = controller; else delete window.texturedGlass; }
  }, []);
  const onFrame = useCallback((frame: GlassFrame) => {
    const status = `${frame.reducedMotion}`;
    if (lastStatus.current === status) return;
    lastStatus.current = status; setReducedMotion(frame.reducedMotion);
  }, []);
  const onError = useCallback((failure: Error) => { setError(failure.message); setDepthState({ kind: "idle" }); }, []);
  const onDepth = useCallback((state: DepthState) => setDepthState(state), []);

  function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose an image file."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("Choose an image smaller than 20 MB."); return; }
    setError(""); setDepthState({ kind: "loading", progress: 0 }); setImage({ src: URL.createObjectURL(file), name: file.name });
  }
  function reset() {
    setImage({ src: DEFAULT_IMAGE, name: "stay.jpeg" }); setSettings(DEFAULT_GLASS_SETTINGS);
    setPaused(false); setError(""); instance.current?.reset();
  }
  async function save() {
    if (!instance.current) return;
    setSaving(true); setError("");
    try {
      const blob = await instance.current.exportPNG();
      const url = URL.createObjectURL(blob); const link = document.createElement("a");
      link.href = url; link.download = "textured-glass.png"; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Could not save the image."); }
    finally { setSaving(false); }
  }
  function range(key: keyof typeof ranges) {
    const config = ranges[key];
    return <InterfaceSlider key={key} className={styles.slider} label={config.label} min={config.min} max={config.max} step={config.step}
      value={settings[key]} disabled={!ready} onValueChange={value => setSettings(current => ({ ...current, [key]: value }))} />;
  }

  return <>
    <section className={styles.artwork} aria-label="Textured glass preview">
      <header className={styles.artworkHeader}><h2>{image.name}</h2><span>{reducedMotion ? "Still preview" : paused ? "Paused" : ""}</span></header>
      <TexturedGlass src={image.src} depthMap={image.src === DEFAULT_IMAGE ? "/artwork/stay-depth.png" : undefined} alt="A photograph through textured glass" {...settings} paused={paused} className={styles.scene} onReady={onReady} onFrame={onFrame} onError={onError} onDepth={onDepth} />
      {image.src !== DEFAULT_IMAGE && (depthState.kind === "loading" || depthState.kind === "estimating") && <div className={styles.processing} role="status" aria-live="polite"><span>{depthState.kind === "loading" ? "Analyzing Image" : "Adapting Depth"}</span></div>}
    </section>
    <section className={styles.controlsPanel} aria-labelledby={`${id}-controls`}>
      <h2 id={`${id}-controls`}>Glass</h2>
      <div className={styles.actionsTop}>
        <LiquidButton type="button" onClick={() => input.current?.click()}>Upload image</LiquidButton>
        <LiquidButton type="button" disabled={image.src === DEFAULT_IMAGE} onClick={() => { setImage({ src: DEFAULT_IMAGE, name: "stay.jpeg" }); setError(""); }}>Use default</LiquidButton>
      </div>
      <input ref={input} className={styles.fileInput} type="file" accept="image/*" aria-label="Upload an image" onChange={event => { upload(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
      <LiquidTrack className={styles.modes}>
        <LiquidButton type="button" disabled={!ready} aria-pressed={settings.enabled} onClick={() => setSettings(current => ({ ...current, enabled: !current.enabled }))}>{settings.enabled ? "Glass on" : "Original"}</LiquidButton>
        <LiquidButton type="button" disabled={!ready || reducedMotion} aria-pressed={settings.animate} onClick={() => setSettings(current => ({ ...current, animate: !current.animate }))}>Auto light</LiquidButton>
      </LiquidTrack>
      {basicRanges.map(range)}
      <div className={styles.depthStatus} role="status">
        {depthState.kind === "ready" ? "Depth ready" : ""}
      </div>
      <LiquidButton type="button" className={styles.depthMap} disabled={depthState.kind !== "ready"} aria-pressed={settings.showDepth} onClick={() => setSettings(current => ({ ...current, showDepth: !current.showDepth }))}>Depth map</LiquidButton>
      {depthState.kind === "error" && <div className={styles.error} role="alert"><p>{depthState.message}</p><LiquidButton type="button" onClick={() => { void instance.current?.estimateDepth(); }}>Retry depth</LiquidButton></div>}
      <LiquidDisclosure className={styles.advanced} label="More settings">{advancedRanges.map(range)}</LiquidDisclosure>
      <div className={styles.actions}>
        <LiquidButton type="button" disabled={!ready || reducedMotion} aria-pressed={paused} onClick={() => setPaused(current => !current)}>{paused ? "Resume" : "Pause"}</LiquidButton>
        <LiquidButton type="button" disabled={!ready} onClick={reset}>Reset</LiquidButton>
        <LiquidButton className={styles.save} type="button" disabled={!ready || saving} onClick={save}>{saving ? "Saving..." : "Save PNG"}</LiquidButton>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  </>;
}
