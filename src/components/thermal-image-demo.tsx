"use client";

import { ThermalImage, type ThermalImageProps } from "@/registry/thermal-image/thermal-image";
import { DemoPanel, DemoRange, DemoSelect, DemoToggle, type DemoMenuEntry } from "@/components/demo-controls";
import { PreviewButton, PreviewDisclosure } from "@/components/preview-controls";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./thermal-image-demo.module.css";

const defaults = { speed: 1, blurStrength: 1, halo: 0.85, warp: 0.012, grain: 0.055 };
const defaultImage = "/artwork/thermal-image-car.png";
type ImageChoice = { kind: "default"; src: string } | { kind: "upload"; src: string; name: string };
type RenderStatus = { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };

export function ThermalImageDemo({ freezeTime = null }: { freezeTime?: number | null }) {
  const [settings, setSettings] = useState(defaults);
  const [playing, setPlaying] = useState(true);
  const [background, setBackground] = useState<NonNullable<ThermalImageProps["background"]>>("studio");
  const [instance, setInstance] = useState(0);
  const [image, setImage] = useState<ImageChoice>({ kind: "default", src: defaultImage });
  const [status, setStatus] = useState<RenderStatus>({ kind: "loading" });
  const [uploadError, setUploadError] = useState("");
  const pendingImage = useRef(0);
  const ready = useCallback(() => setStatus({ kind: "ready" }), []);
  const failed = useCallback((error: Error) => setStatus({ kind: "error", message: error.message }), []);

  useEffect(() => () => { if (image.kind === "upload") URL.revokeObjectURL(image.src); }, [image]);
  useEffect(() => () => { pendingImage.current += 1; }, []);

  function replay() { setStatus({ kind: "loading" }); setInstance(value => value + 1); }
  function reset() { setSettings(defaults); setPlaying(true); setBackground("studio"); replay(); }
  function useDefault() {
    pendingImage.current += 1;
    setImage({ kind: "default", src: defaultImage }); setUploadError(""); setStatus({ kind: "loading" });
  }
  async function chooseImage(file: File | undefined) {
    if (!file) return;
    const request = ++pendingImage.current;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) { setUploadError("Choose a JPG, PNG, WebP or AVIF image."); return; }
    if (file.size > 12 * 1024 * 1024) { setUploadError("Choose an image smaller than 12 MB."); return; }
    const src = URL.createObjectURL(file);
    const probe = new Image(); probe.src = src;
    try {
      await probe.decode();
      if (probe.naturalWidth * probe.naturalHeight > 32_000_000) throw new Error("Choose an image smaller than 32 megapixels.");
      if (request !== pendingImage.current) { URL.revokeObjectURL(src); return; }
      setImage({ kind: "upload", src, name: file.name }); setUploadError(""); setStatus({ kind: "loading" });
    } catch (error) {
      URL.revokeObjectURL(src);
      if (request === pendingImage.current) setUploadError(error instanceof Error && error.message.includes("megapixels") ? error.message : "That image could not be opened. Try another file.");
    }
  }
  const menu: DemoMenuEntry[] = [{ kind: "action", label: "Replay", onClick: replay }, { kind: "action", label: "Reset settings", onClick: reset }];
  return <section className={styles.preview} aria-label="Thermal image preview">
    <div className={styles.artwork}>
      <div className={styles.stage} data-render-status={status.kind}>
        <ThermalImage key={instance} src={image.src} alt={image.kind === "default" ? "A Porsche rendered through moving thermal color bands" : "Uploaded image rendered in thermal colors"}
          className={styles.scene} imageScale={1} {...settings} background={background} playing={playing} freezeTime={freezeTime} onReady={ready} onError={failed} />
      </div>
      {status.kind === "error" && <p role="status">{status.message} The original image is shown. Use Replay to retry.</p>}
    </div>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset}>
      <div className={styles.controlsGrid}>
        <DemoToggle label="Animate" checked={playing} onCheckedChange={setPlaying} />
        <DemoSelect label="Background" value={background} options={[{ value: "studio", label: "Studio" }, { value: "reference", label: "Original field" }]} onValueChange={setBackground} />
        <DemoRange label="Speed" value={settings.speed} min={0.1} max={2} step={0.05} format={value => `${value.toFixed(2)}×`} onValueChange={speed => setSettings(current => ({ ...current, speed }))} />
        <DemoRange label="Blur wave" value={settings.blurStrength} min={0} max={1} step={0.01} format={value => `${Math.round(value * 100)}%`} onValueChange={blurStrength => setSettings(current => ({ ...current, blurStrength }))} />
        <DemoRange label="Halo" value={settings.halo} min={0} max={1} step={0.01} format={value => `${Math.round(value * 100)}%`} onValueChange={halo => setSettings(current => ({ ...current, halo }))} />
        <PreviewDisclosure label="Texture">
          <DemoRange label="Distortion" value={settings.warp} min={0} max={0.05} step={0.001} format={value => `${Math.round(value * 1000)}`} onValueChange={warp => setSettings(current => ({ ...current, warp }))} />
          <DemoRange label="Grain" value={settings.grain} min={0} max={0.15} step={0.005} format={value => `${Math.round(value * 1000)}`} onValueChange={grain => setSettings(current => ({ ...current, grain }))} />
        </PreviewDisclosure>
        <div className={styles.upload}>
          <label className={styles.uploadButton}>Choose image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => { void chooseImage(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>
          {image.kind === "upload" && <><span className={styles.filename}>{image.name}</span><PreviewButton onClick={useDefault}>Use default image</PreviewButton></>}
          <p>Images stay in your browser. Transparent PNGs preserve the subject halo.</p>
          {uploadError && <p role="alert">{uploadError}</p>}
        </div>
      </div>
    </DemoPanel>
  </section>;
}
