"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  GardenCanvas,
  type GardenController,
} from "@/registry/interactive-art/examples/GardenCanvas";
import { GARDEN_LAYERS, gardenLighting } from "@/registry/interactive-art/scenes/garden";
import type { FrameState } from "@/registry/interactive-art/engine/runtime";
import styles from "./garden-demo.module.css";

declare global {
  interface Window {
    garden?: GardenController;
  }
}

export function GardenDemo() {
  const garden = useRef<GardenController | null>(null);
  const lastStatus = useRef("");
  const direction = useRef(1);
  const id = useId();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [time, setTime] = useState("Day 0:16");
  const [speed, setSpeed] = useState("3");
  const [layer, setLayer] = useState("whole");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onReady = useCallback((instance: GardenController | null) => {
    garden.current = instance;
    setReady(Boolean(instance));
    if (process.env.NODE_ENV === "development") {
      if (instance) window.garden = instance;
      else delete window.garden;
    }
  }, []);

  const onError = useCallback((failure: Error) => setError(failure.message), []);
  const onFrame = useCallback((frame: FrameState) => {
    const second = Math.floor(frame.elapsed);
    const signature = `${second}/${frame.paused}/${frame.reducedMotion}`;
    if (lastStatus.current === signature) return;
    lastStatus.current = signature;
    setTime(
      `${gardenLighting(frame.elapsed).name} ${Math.floor(second / 60)}:${String(second % 60).padStart(2, "0")}`,
    );
    setPaused(frame.paused);
    setReducedMotion(frame.reducedMotion);
  }, []);

  async function saveImage() {
    const instance = garden.current;
    if (!instance) return;
    setSaving(true);
    setError("");
    try {
      const selected = GARDEN_LAYERS.find((name) => name === layer);
      const layers = layer === "plants"
        ? ["stems", "leaves", "blossoms"] as const
        : selected ? [selected] : undefined;
      const blob = await instance.exportPNG({ layers });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = layer === "whole" ? "lotus-garden.png" : `lotus-${layer}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not save the image.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className={styles.artwork} aria-labelledby={`${id}-garden`}>
        <header className={styles.artworkHeader}>
          <h2 id={`${id}-garden`}>Lotus garden</h2>
          <span role="timer" aria-live="off" aria-label="Scene time">{time}</span>
        </header>
        <GardenCanvas
          timeScale={3}
          onReady={onReady}
          onFrame={onFrame}
          onError={onError}
          fallback="/artwork/lotus-garden.png"
        />
      </section>

      <section className={styles.controlsPanel} aria-labelledby={`${id}-controls`}>
        <div className={styles.panelHeading}>
          <h2 id={`${id}-controls`}>Controls</h2>
          <span>Live preview</span>
        </div>
        <p className={styles.hint}>
          {reducedMotion
            ? "Motion is paused for your preference. Advance time to see the garden grow."
            : "Hover over a flower, or hold and pull it. The stem returns when you let go."}
        </p>
        <div className={styles.controls} role="group" aria-label="Garden controls">
          <button type="button" disabled={!ready || reducedMotion} aria-pressed={paused}
            onClick={() => paused ? garden.current?.resume() : garden.current?.pause()}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" disabled={!ready || paused || reducedMotion}
            onClick={() => {
              garden.current?.bend("flower-4", direction.current);
              direction.current *= -1;
            }}>
            Bend lotus
          </button>
          <button type="button" disabled={!ready} onClick={() => {
            const instance = garden.current;
            if (instance) instance.seek(instance.snapshot().elapsed + 20);
          }}>
            Advance 20 seconds
          </button>
          <button type="button" disabled={!ready} onClick={() => garden.current?.seek(0)}>
            Start again
          </button>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-speed`}>Speed</label>
          <output htmlFor={`${id}-speed`}>{speed}x</output>
        </div>
        <input className={styles.slider} type="range" id={`${id}-speed`} min="1" max="6" step="1" value={speed} disabled={!ready} onChange={(event) => {
            setSpeed(event.currentTarget.value);
            garden.current?.setTimeScale(Number(event.currentTarget.value));
          }} />
        <div className={styles.export}>
          <h3>Export artwork</h3>
          <div className={styles.field}>
            <label htmlFor={`${id}-layer`}>Layer</label>
            <select id={`${id}-layer`} value={layer} onChange={(event) => setLayer(event.currentTarget.value)}>
              <option value="whole">Whole scene</option>
              <option value="plants">Plants</option>
              {GARDEN_LAYERS.map((name) => (
                <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
              ))}
            </select>
          </div>
          <button className={styles.save} type="button" disabled={!ready || saving} onClick={saveImage}>
            {saving ? "Saving..." : "Save PNG"}
          </button>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
    </>
  );
}
