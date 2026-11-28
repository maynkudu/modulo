"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { LiquidGlass, type LiquidGlassMode, type LiquidGlassSource } from "@/registry/liquid-glass/liquid-glass";
import { DemoPanel, DemoRange, DemoSurface, type DemoMenuEntry } from "./demo-controls";
import { PreviewButton } from "./preview-controls";
import styles from "./liquid-glass-demo.module.css";

const modes = [
  { value: "chroma", label: "Chroma" },
  { value: "swell", label: "Swell" },
  { value: "lucid", label: "Lucid" },
  { value: "mist", label: "Mist" },
] satisfies readonly { value: LiquidGlassMode; label: string }[];

const typeLines = {
  chroma: ["Color", "theory"],
  swell: ["Take a", "closer look"],
  lucid: ["Nothing", "to hide"],
  mist: ["Soft", "focus"],
} satisfies Record<LiquidGlassMode, readonly [string, string]>;

const scenes = [
  { value: "typography", label: "Typography", source: { kind: "typography", lines: typeLines.chroma } },
  { value: "photograph", label: "Photograph", source: { kind: "image", src: "/artwork/stay.jpeg", alt: "A person standing in a dim rehearsal room." }, thumbnail: "/artwork/stay.jpeg" },
  { value: "illustration", label: "Illustration", source: { kind: "image", src: "/artwork/lotus-garden.png", alt: "Lotus flowers growing in a garden beneath the sun." }, thumbnail: "/artwork/lotus-garden.png" },
] satisfies readonly { value: string; label: string; source: LiquidGlassSource; thumbnail?: string }[];

function subscribeReducedMotion(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}

function subscribeDisplayFont() {
  return () => {};
}

function getDisplayFont() {
  return window.getComputedStyle(document.body).fontFamily;
}

function getServerDisplayFont() {
  return "Arial, sans-serif";
}

/** The controls own mode and scene state. LiquidGlass owns the rendered lens and pointer path. */
export function LiquidGlassDemo() {
  const [mode, setMode] = useState<LiquidGlassMode>("chroma");
  const [source, setSource] = useState<LiquidGlassSource>(scenes[0].source);
  const [cornerMorph, setCornerMorph] = useState(0.35);
  const [uploadedUrl, setUploadedUrl] = useState<string>();
  const [imageError, setImageError] = useState("");
  const [instance, setInstance] = useState(0);
  const uploadUrl = useRef<string | undefined>(undefined);
  const uploadRequest = useRef(0);
  const systemReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const displayFont = useSyncExternalStore(subscribeDisplayFont, getDisplayFont, getServerDisplayFont);

  useEffect(() => () => {
    uploadRequest.current += 1;
    if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current);
  }, []);

  const typographySource = useMemo<LiquidGlassSource>(() => ({
    kind: "typography",
    lines: typeLines[mode],
    displayFont,
    serifFont: '"Roxborough CF", Georgia, serif',
  }), [displayFont, mode]);
  const activeSource = source.kind === "typography" ? typographySource : source;

  function reset() {
    uploadRequest.current += 1;
    if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current);
    uploadUrl.current = undefined;
    setUploadedUrl(undefined);
    setImageError("");
    setMode("chroma");
    setSource(scenes[0].source);
    setCornerMorph(0.35);
    setInstance(value => value + 1);
  }

  async function chooseImage(file: File | undefined) {
    if (!file) return;
    const request = ++uploadRequest.current;
    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setImageError("Choose an image smaller than 20 MB.");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    try {
      const image = new window.Image();
      image.src = nextUrl;
      await image.decode();
      if (request !== uploadRequest.current) {
        URL.revokeObjectURL(nextUrl);
        return;
      }
      if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current);
      uploadUrl.current = nextUrl;
      setUploadedUrl(nextUrl);
      setSource({ kind: "image", src: nextUrl, alt: "An uploaded image" });
    } catch {
      URL.revokeObjectURL(nextUrl);
      if (request === uploadRequest.current) setImageError("This image could not be opened. Try another file.");
    }
  }

  const menu: DemoMenuEntry[] = [
    { kind: "action", label: "Reset preview", onClick: reset },
  ];

  return <div className={styles.preview}>
    <div className={styles.stage}>
      <DemoSurface className={styles.surface} label="Liquid Glass preview" menu={menu}>
        <div className={styles.scene}>
          <LiquidGlass key={instance} mode={mode}
            label={activeSource.kind === "image" ? `Liquid Glass over ${activeSource.alt}` : `Liquid Glass: ${typeLines[mode].join(" ")}`}
            source={activeSource} reducedMotion={systemReducedMotion} cornerMorph={cornerMorph} className={styles.glass} />
        </div>
      </DemoSurface>
      <p className={styles.instruction}>Move over the preview. Focus it and use the arrow keys to move the glass.</p>
      {systemReducedMotion && <p className={styles.motionStatus} role="status">Reduced motion is on.</p>}
    </div>
    <DemoPanel menu={menu} onReplay={() => setInstance(value => value + 1)} onReset={reset}>
      <div className={styles.controlGroup} role="group" aria-label="Glass mode">
        <span className={styles.groupLabel}>Mode</span>
        <div className={styles.modeButtons}>
          {modes.map(option => <PreviewButton key={option.value} aria-pressed={mode === option.value}
            onClick={() => setMode(option.value)}>{option.label}</PreviewButton>)}
        </div>
      </div>
      <div className={styles.controlGroup} role="group" aria-label="Background">
        <span className={styles.groupLabel}>Background</span>
        <div className={styles.sceneButtons}>
          {scenes.map(scene => <PreviewButton key={scene.value} aria-pressed={source === scene.source}
            onClick={() => { setSource(scene.source); setImageError(""); }}>
            {scene.thumbnail && <Image src={scene.thumbnail} width={28} height={28} alt="" />}
            {scene.label}
          </PreviewButton>)}
          {uploadedUrl && <PreviewButton aria-pressed={source.kind === "image" && source.src === uploadedUrl}
            onClick={() => setSource({ kind: "image", src: uploadedUrl, alt: "Uploaded image" })}>Your image</PreviewButton>}
        </div>
        <label className={styles.upload}>
          <span>Upload image</span>
          <input type="file" accept="image/*" aria-label="Upload image" onChange={event => {
            void chooseImage(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }} />
        </label>
        {imageError && <p className={styles.error} role="alert">{imageError}</p>}
      </div>
      <DemoRange label="Lucid corner morph" value={cornerMorph} min={0} max={1} step={0.01}
        disabled={mode !== "lucid"} format={value => `${Math.round(value * 100)}%`} onValueChange={setCornerMorph} />
    </DemoPanel>
  </div>;
}
