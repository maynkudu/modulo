"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImageMosaic } from "@/registry/image-mosaic/ImageMosaic";
import type { MetallicFinish } from "@/registry/image-mosaic/create-image-mosaic";
import { PreviewButton } from "./preview-controls";
import styles from "./image-mosaic-demo.module.css";

export function ImageMosaicDemo() {
  const [src, setSrc] = useState("/artwork/image-mosaic.jpg");
  const [name, setName] = useState("People assembling a large horse sculpture outdoors");
  const [status, setStatus] = useState("");
  const [detail, setDetail] = useState(.6);
  const [finish, setFinish] = useState<MetallicFinish>("chrome");
  const [refraction, setRefraction] = useState(.4);
  const [seed, setSeed] = useState(7);
  const input = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  const localUrl = useRef<string | null>(null);

  useEffect(() => () => { generation.current++; if (localUrl.current) URL.revokeObjectURL(localUrl.current); }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]; event.currentTarget.value = "";
    if (!file) return;
    const token = ++generation.current;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setStatus("Choose a PNG, JPEG or WebP image."); return; }
    if (file.size > 15 * 1024 * 1024) { setStatus("Choose an image smaller than 15 MB."); return; }
    const url = URL.createObjectURL(file);
    setStatus("Opening image...");
    try {
      const image = new Image(); image.src = url; await image.decode();
      if (token !== generation.current) { URL.revokeObjectURL(url); return; }
      if (Math.max(image.naturalWidth, image.naturalHeight) > 8192) throw new Error("Choose an image no larger than 8192 pixels on either side.");
      if (localUrl.current) URL.revokeObjectURL(localUrl.current);
      localUrl.current = url; setSrc(url); setName(file.name); setStatus(""); setSeed(value => value + 1);
    } catch (error) {
      URL.revokeObjectURL(url);
      if (token === generation.current) setStatus(error instanceof Error && error.message.startsWith("Choose") ? error.message : "This image could not be opened. Try a PNG, JPEG or WebP.");
    }
  }

  return <section className={styles.preview} aria-label="Image mosaic preview">
    <input ref={input} className={styles.hidden} aria-label="Upload image" type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} />
    <ImageMosaic className={styles.scene} src={src} alt={name} cellSize={24 - detail * 20} detail={detail} seed={seed} finish={finish} refraction={refraction} />
    <div className={styles.controls}><h2>Controls</h2><div className={styles.upload}><PreviewButton onClick={() => input.current?.click()}>Upload image</PreviewButton></div>
      <label>Finish<select aria-label="Finish" value={finish} onChange={event => {
        const value = event.currentTarget.value;
        if (value === "chrome" || value === "brushed" || value === "iridescent") setFinish(value);
      }}><option value="chrome">Chrome</option><option value="brushed">Brushed</option><option value="iridescent">Iridescent</option></select></label>
      <PreviewButton onClick={() => setSeed(value => value + 1)}>Shuffle elements</PreviewButton>
      <label>Detail<output>{Math.round(detail * 100)}%</output><input aria-label="Detail" type="range" min="0" max="100" step="1" value={Math.round(detail * 100)} onChange={event => setDetail(event.currentTarget.valueAsNumber / 100)} /></label>
      <label>Refraction<output>{Math.round(refraction * 100)}%</output><input aria-label="Refraction" type="range" min="0" max="100" step="1" value={Math.round(refraction * 100)} onChange={event => setRefraction(event.currentTarget.valueAsNumber / 100)} /></label>
    </div>
    {status && <p role="status" className={styles.status}>{status}</p>}
  </section>;
}
