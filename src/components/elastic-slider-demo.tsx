"use client";

import { useCallback, useRef, useState } from "react";
import { ElasticSlider, type ElasticSliderController } from "@/registry/elastic-slider/ElasticSlider";
import { DemoPanel, DemoRange, DemoSelect, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import styles from "./elastic-slider-demo.module.css";

declare global { interface Window { elasticSlider?: ElasticSliderController; } }

export function ElasticSliderDemo() {
  const controller = useRef<ElasticSliderController | null>(null);
  const [value, setValue] = useState(65), [commit, setCommit] = useState<number | null>(null);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [disabled, setDisabled] = useState(false), [reducedMotion, setReducedMotion] = useState(false);
  const onReady = useCallback((instance: ElasticSliderController | null) => {
    controller.current = instance;
    if (process.env.NODE_ENV === "development") {
      if (instance) window.elasticSlider = instance; else delete window.elasticSlider;
    }
  }, []);
  const replay = () => controller.current?.replay();
  const reset = () => { setValue(65); setCommit(null); };
  const menu = [
    { kind: "action", label: "Replay", onClick: replay, disabled },
    { kind: "action", label: "Reset", onClick: reset },
    { kind: "toggle", label: "Reduce motion", checked: reducedMotion, onCheckedChange: setReducedMotion },
    { kind: "toggle", label: "Disable control", checked: disabled, onCheckedChange: setDisabled },
  ] satisfies DemoMenuEntry[];
  return <>
    <DemoSurface className={styles.artwork} label="Elastic Slider preview" menu={menu}>
      <header className={styles.artworkHeader}><h2>Elastic Slider</h2><span>{orientation === "horizontal" ? "Horizontal" : "Vertical"}</span></header>
      <div className={styles.stage}>
        <ElasticSlider label="Level" min={10} max={90} step={5} value={value} onValueChange={setValue}
          onValueCommit={setCommit} orientation={orientation} disabled={disabled} reducedMotion={reducedMotion} onReady={onReady} />
      </div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset} replayDisabled={disabled}>
      <DemoSelect label="Orientation" value={orientation} options={[{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }]} onValueChange={setOrientation} />
      <DemoRange label="Value" min={10} max={90} step={5} value={value} onValueChange={setValue} disabled={disabled} />
      <div className={styles.options}>
        <DemoToggle label="Reduce motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        <DemoToggle label="Disable control" checked={disabled} onCheckedChange={setDisabled} />
      </div>
      <p className={styles.hint}>Drag past either end. Arrow keys adjust the value. Release to commit.</p>
      {commit !== null && <p className={styles.status} aria-live="polite">Committed value: {commit}</p>}
    </DemoPanel>
  </>;
}
