"use client";

import { useCallback, useRef, useState } from "react";
import { SnapRail, type SnapRailController, type SnapDetent } from "@/registry/snap-rail/SnapRail";
import { DemoPanel, DemoRange, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import styles from "./snap-rail-demo.module.css";

const detents = [{ id: "left", label: "Left", position: 0 }, { id: "center", label: "Center", position: 50 }, { id: "right", label: "Right", position: 100 }] satisfies readonly SnapDetent[];
declare global { interface Window { snapRail?: SnapRailController; } }

export function SnapRailDemo() {
  const controller = useRef<SnapRailController | null>(null);
  const [selectedId, setSelectedId] = useState("center"), [decaySeconds, setDecaySeconds] = useState(.12), [hysteresis, setHysteresis] = useState(8);
  const [reducedMotion, setReducedMotion] = useState(false), [disabled, setDisabled] = useState(false), [ready, setReady] = useState(false);
  const onReady = useCallback((instance: SnapRailController | null) => {
    controller.current = instance; setReady(Boolean(instance));
    if (process.env.NODE_ENV === "development") { if (instance) window.snapRail = instance; else delete window.snapRail; }
  }, []);
  const replay = () => controller.current?.replay();
  const reset = () => { controller.current?.reset(); setDecaySeconds(.12); setHysteresis(8); };
  const menu = [
    { kind: "action", label: "Replay", onClick: replay, disabled: !ready || disabled },
    { kind: "action", label: "Reset", onClick: reset },
    { kind: "toggle", label: "Reduce motion", checked: reducedMotion, onCheckedChange: setReducedMotion },
    { kind: "toggle", label: "Disable control", checked: disabled, onCheckedChange: setDisabled },
  ] satisfies DemoMenuEntry[];
  return <>
    <DemoSurface className={styles.preview} label="Snap rail preview" menu={menu}>
      <header className={styles.header}><h2>Snap rail</h2><span>{disabled ? "Disabled" : "Drag to select"}</span></header>
      <div className={styles.rail}><SnapRail detents={detents} selectedId={selectedId} onSelectionChange={setSelectedId} decaySeconds={decaySeconds} hysteresis={hysteresis} reducedMotion={reducedMotion} disabled={disabled} onReady={onReady} /></div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset} replayDisabled={!ready || disabled}>
      <DemoRange label="Projection time" min={.04} max={.3} step={.01} value={decaySeconds} onValueChange={setDecaySeconds} format={value => `${Math.round(value * 1000)} ms`} />
      <DemoRange label="Preview hysteresis" min={0} max={24} value={hysteresis} onValueChange={setHysteresis} format={value => `${value} px`} />
      <div className={styles.options}>
        <DemoToggle label="Reduce motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        <DemoToggle label="Disable control" checked={disabled} onCheckedChange={setDisabled} />
      </div>
      <p className={styles.hint}>Flick toward a destination. Grab the item again while it settles.</p>
    </DemoPanel>
  </>;
}
