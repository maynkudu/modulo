"use client";

import { useRef, useState } from "react";
import { InlineDownload, type InlineDownloadSize } from "@/registry/inline-download/InlineDownload";
import { DemoPanel, DemoRange, DemoSelect, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import styles from "./inline-download-demo.module.css";

const sizes: { value: InlineDownloadSize; label: string }[] = [
  { value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" },
];

/** Preview for the inline download button. The button runs its own timed download. */
export function InlineDownloadDemo() {
  const button = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState<InlineDownloadSize>("md");
  const [duration, setDuration] = useState(2.8);
  const [resetAfter, setResetAfter] = useState(3);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [failed, setFailed] = useState(false);
  const [run, setRun] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const press = () => button.current?.click();
  const reset = () => {
    setSize("md"); setDuration(2.8); setResetAfter(3);
    setReducedMotion(false); setDisabled(false); setFailNext(false); setFailed(false); setLastAction(null);
    setRun((current) => current + 1);
  };

  const menu = [
    { kind: "action", label: "Start download", onClick: press, disabled },
    { kind: "action", label: "Reset", onClick: reset },
    { kind: "toggle", label: "Reduce motion", checked: reducedMotion, onCheckedChange: setReducedMotion },
    { kind: "toggle", label: "Disable button", checked: disabled, onCheckedChange: setDisabled },
    { kind: "toggle", label: "Fail next run", checked: failNext, onCheckedChange: setFailNext },
  ] satisfies DemoMenuEntry[];

  return <>
    <DemoSurface className={styles.artwork} label="Inline download preview" menu={menu}>
      <header className={styles.artworkHeader}><h2>Inline download</h2><span>{sizes.find((option) => option.value === size)?.label}</span></header>
      <div className={styles.stage}>
        <InlineDownload
          key={run}
          ref={button}
          size={size}
          duration={duration}
          resetAfter={resetAfter}
          reducedMotion={reducedMotion}
          disabled={disabled}
          error={failed ? "The download failed." : null}
          onDownload={() => { setLastAction("onDownload"); setFailed(false); if (failNext) { setFailNext(false); setTimeout(() => setFailed(true), 900); } }}
          onCancel={() => { setLastAction("onCancel"); setFailed(false); }}
          onOpen={() => setLastAction("onOpen")}
        />
      </div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={press} onReset={reset} replayDisabled={disabled}>
      <DemoSelect label="Size" value={size} options={sizes} onValueChange={setSize} />
      <DemoRange label="Duration" min={1} max={8} step={0.2} value={duration} onValueChange={setDuration} format={(value) => `${value.toFixed(1)}s`} disabled={disabled} />
      <DemoRange label="Reset after" min={0} max={10} step={0.5} value={resetAfter} onValueChange={setResetAfter} format={(value) => value === 0 ? "Keep" : `${value.toFixed(1)}s`} disabled={disabled} />
      <div className={styles.options}>
        <DemoToggle label="Reduce motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        <DemoToggle label="Disable button" checked={disabled} onCheckedChange={setDisabled} />
        <DemoToggle label="Fail next run" checked={failNext} onCheckedChange={setFailNext} />
      </div>
      <p className={styles.hint}>Press the pill. Press it again, or press Escape, to cancel.</p>
      <p className={styles.status} role="status">{lastAction ? `${lastAction}() called` : "No callback yet"}</p>
    </DemoPanel>
  </>;
}
