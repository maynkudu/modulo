"use client";

import { useState } from "react";
import { MultiStepDownload } from "@/registry/multi-step-download/MultiStepDownload";
import { DemoPanel, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import { useDownloadPreview } from "./use-download-preview";
import styles from "./multi-step-download-demo.module.css";

/** Interactive multi-step download demo; its transfer progress is explicitly simulated. */
export function MultiStepDownloadDemo() {
  const { state, start, reset } = useDownloadPreview();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const busy = state.kind === "loading";

  function replay() {
    if (disabled || busy) return;
    start({ fail: failNext });
    setFailNext(false);
  }

  const menu = [
    { kind: "action", label: "Replay", onClick: replay, disabled: disabled || busy },
    { kind: "action", label: "Reset", onClick: reset },
    { kind: "toggle", label: "Reduce motion", checked: reducedMotion, onCheckedChange: setReducedMotion },
    { kind: "toggle", label: "Disable button", checked: disabled, onCheckedChange: setDisabled },
    { kind: "toggle", label: "Fail next download", checked: failNext, onCheckedChange: setFailNext },
  ] satisfies DemoMenuEntry[];

  return <>
    <DemoSurface className={styles.artwork} label="Multi-step download preview" menu={menu}>
      <div className={styles.stage}>
        <MultiStepDownload size={136} state={state} onActivate={replay} reducedMotion={reducedMotion} disabled={disabled} />
      </div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset} replayDisabled={disabled || busy}>
      <div className={styles.options}>
        <DemoToggle label="Reduce motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        <DemoToggle label="Disable button" checked={disabled} onCheckedChange={setDisabled} />
        <DemoToggle label="Fail next download" checked={failNext} onCheckedChange={setFailNext} />
      </div>
      <p className={styles.status} role="status">{state.kind === "loading" ? "Downloading..." : state.kind === "success" ? "Download complete" : state.kind === "error" ? "Download failed. Press the button to retry." : "Ready"}</p>
      <p className={styles.hint}>Progress is simulated in this preview.</p>
    </DemoPanel>
  </>;
}
