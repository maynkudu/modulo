"use client";

import { porscheGT3RSPath } from "@/registry/porsche-gt3rs/asset";
import { ThermalImage, type ThermalImageProps } from "@/registry/thermal-image/thermal-image";
import { DemoPanel, DemoRange, DemoSelect, DemoToggle, type DemoMenuEntry } from "@/components/demo-controls";
import { PreviewButton, PreviewDisclosure } from "@/components/preview-controls";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./thermal-image-demo.module.css";

const defaults = { speed: 1, blurStrength: 0.55, halo: 0.85, warp: 0.012, grain: 0.055 };

const initialAngle = 12;
type ImageChoice = { kind: "model" } | { kind: "upload"; src: string; name: string };
type RenderStatus = { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };

export function ThermalImageDemo({ freezeTime = null }: { freezeTime?: number | null }) {
  const [settings, setSettings] = useState(defaults);
  const [playing, setPlaying] = useState(true);
  const [background, setBackground] = useState<NonNullable<ThermalImageProps["background"]>>("studio");
  const [look, setLook] = useState<NonNullable<ThermalImageProps["look"]> | "material">("thermal");
  const [angle, setAngle] = useState(initialAngle);
  const [elevation, setElevation] = useState(5);
  const drag = useRef<{ pointer: number; x: number; y: number; angle: number; elevation: number } | null>(null);
  const [instance, setInstance] = useState(0);
  const [image, setImage] = useState<ImageChoice>({ kind: "model" });
  const [status, setStatus] = useState<RenderStatus>({ kind: "loading" });
  const [uploadError, setUploadError] = useState("");
  const pendingImage = useRef(0);
  const ready = useCallback(() => setStatus({ kind: "ready" }), []);
  const failed = useCallback((error: Error) => setStatus({ kind: "error", message: error.message }), []);

  useEffect(() => () => { if (image.kind === "upload") URL.revokeObjectURL(image.src); }, [image]);
  useEffect(() => () => { pendingImage.current += 1; }, []);

  function replay() { setStatus({ kind: "loading" }); setInstance(value => value + 1); }
  function reset() { setSettings(defaults); setPlaying(true); setBackground("studio"); setLook("thermal"); setAngle(initialAngle); setElevation(5); replay(); }
  function useDefault() {
    pendingImage.current += 1;
    setAngle(initialAngle); setElevation(5); setImage({ kind: "model" }); setUploadError(""); setStatus({ kind: "loading" });
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
      setLook(current => current === "material" ? "thermal" : current);
      setImage({ kind: "upload", src, name: file.name }); setUploadError(""); setStatus({ kind: "loading" });
    } catch (error) {
      URL.revokeObjectURL(src);
      if (request === pendingImage.current) setUploadError(error instanceof Error && error.message.includes("megapixels") ? error.message : "That image could not be opened. Try another file.");
    }
  }
  const menu: DemoMenuEntry[] = [{ kind: "action", label: "Replay", onClick: replay }, { kind: "action", label: "Reset settings", onClick: reset }];
  return <section className={styles.preview} aria-label="Thermal image preview">
    <div className={styles.artwork}>
      <div className={styles.stage} data-source={image.kind} data-render-status={status.kind}
        onPointerDown={event => {
          if (image.kind !== "model" || !event.isPrimary || event.button !== 0) return;
          drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, angle, elevation };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const start = drag.current;
          if (!start || start.pointer !== event.pointerId) return;
          const delta = (event.clientX - start.x) / event.currentTarget.clientWidth;
          setElevation(Math.max(-90, Math.min(90, Math.round(start.elevation + (event.clientY - start.y) / event.currentTarget.clientHeight * 180))));
          setAngle(((Math.round(start.angle + delta * 360) % 360) + 360) % 360);
        }}
        onLostPointerCapture={() => { drag.current = null; }}>
        <ThermalImage key={instance} src={image.kind === "model" ? porscheGT3RSPath : image.src}
          sourceType={image.kind === "model" ? "model" : "image"} modelAngle={angle} modelElevation={elevation} showModelMaterial={look === "material"} look={look === "material" ? "thermal" : look}
          alt={image.kind === "model" ? "3D study of a Porsche 911 GT3 RS" : "Uploaded image in the selected thermal effect"}
          className={styles.scene} imageScale={1} {...settings} background={background} playing={playing} freezeTime={freezeTime} onReady={ready} onError={failed} />
        {image.kind === "model" && status.kind === "loading" && <span className={styles.loading} role="status">Loading GT3 RS…</span>}
      </div>
      {status.kind === "error" && <p role="status">Use Replay to retry or choose another image.</p>}
    </div>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset}>
      <div className={styles.controlsGrid}>
        <DemoSelect label="Effect" value={look} options={[{ value: "thermal", label: "Thermal" }, { value: "night-vision", label: "Night vision" }, { value: "ultraviolet", label: "Ultraviolet" }, { value: "ice", label: "Ice" }, ...(image.kind === "model" ? [{ value: "material" as const, label: "Original paint" }] : [])]} onValueChange={setLook} />
        {image.kind === "model" && <DemoRange label="Car angle" min={0} max={359} value={angle} format={value => `${value}°`} onValueChange={setAngle} />}
        {image.kind === "model" && <DemoRange label="Camera elevation" min={-90} max={90} value={elevation} format={value => `${value}°`} onValueChange={setElevation} />}
        {look !== "material" && <>
          <DemoToggle label="Animate" checked={playing} onCheckedChange={setPlaying} />
          <DemoSelect label="Background" value={background} options={[{ value: "studio", label: "Studio" }, { value: "reference", label: "Original field" }]} onValueChange={setBackground} />
          <DemoRange label="Speed" value={settings.speed} min={0.1} max={2} step={0.05} format={value => `${value.toFixed(2)}×`} onValueChange={speed => setSettings(current => ({ ...current, speed }))} />
          <DemoRange label="Blur wave" value={settings.blurStrength} min={0} max={1} step={0.01} format={value => `${Math.round(value * 100)}%`} onValueChange={blurStrength => setSettings(current => ({ ...current, blurStrength }))} />
          <DemoRange label="Halo" value={settings.halo} min={0} max={1} step={0.01} format={value => `${Math.round(value * 100)}%`} onValueChange={halo => setSettings(current => ({ ...current, halo }))} />
          <PreviewDisclosure label="Texture">
            <DemoRange label="Distortion" value={settings.warp} min={0} max={0.05} step={0.001} format={value => `${Math.round(value * 1000)}`} onValueChange={warp => setSettings(current => ({ ...current, warp }))} />
            <DemoRange label="Grain" value={settings.grain} min={0} max={0.15} step={0.005} format={value => `${Math.round(value * 1000)}`} onValueChange={grain => setSettings(current => ({ ...current, grain }))} />
          </PreviewDisclosure>
        </>}
        <div className={styles.upload}>
          <label className={styles.uploadButton}>Choose image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => { void chooseImage(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>
          {image.kind === "upload" && <><span className={styles.filename}>{image.name}</span><PreviewButton onClick={useDefault}>Use GT3 RS model</PreviewButton></>}
          <p>Images stay in your browser. Transparent PNGs preserve the subject halo.</p>
          {uploadError && <p role="alert">{uploadError}</p>}
        </div>
      </div>
    </DemoPanel>
  </section>;
}
