"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LiquidCluster, type LiquidClusterController } from "@/registry/liquid-cluster/LiquidCluster";
import { RuneIcon } from "runeicons-react";
import { LiquidTrack } from "@/registry/liquid-animations/LiquidTrack";
import { DemoPanel, DemoRange, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import styles from "./liquid-cluster-demo.module.css";

declare global { interface Window { liquidCluster?: LiquidClusterController; } }

export function LiquidClusterDemo() {
  const instance = useRef<LiquidClusterController | null>(null);
  const [separation, setSeparation] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [opaque, setOpaque] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback((controller: LiquidClusterController | null) => {
    instance.current = controller;
    setReady(Boolean(controller));
    if (process.env.NODE_ENV === "development") {
      if (controller) window.liquidCluster = controller;
      else delete window.liquidCluster;
    }
  }, []);
  useEffect(() => () => { delete window.liquidCluster; }, []);
  const replay = () => { setCleared(false); instance.current?.replay(); };
  const reset = () => { setCleared(false); instance.current?.setSeparation(0); };
  const items = [
    { id: "notification", label: "Open notification actions", content: <span className={styles.notification}>
      <span className={styles.appIcon} aria-hidden="true"><RuneIcon name="glass-bell-2-2" size={18} /></span>
      <span className={styles.message}><span className={styles.messageHeader}><span>Messages</span><span>now</span></span><strong>Design review</strong><span>The updated preview is ready.</span></span>
    </span> },
    { id: "clear", label: "Clear" },
  ];
  const menu = [
    { kind: "action", label: "Reveal Clear", onClick: () => instance.current?.setSeparation(1), disabled: disabled || cleared },
    { kind: "action", label: "Join", onClick: () => instance.current?.setSeparation(0), disabled: cleared },
    { kind: "action", label: "Replay", onClick: replay, disabled: disabled || !ready },
    { kind: "action", label: "Reset", onClick: reset },
    { kind: "toggle", label: "Opaque background", checked: opaque, onCheckedChange: setOpaque },
    { kind: "toggle", label: "Reduce motion", checked: reducedMotion, onCheckedChange: setReducedMotion },
    { kind: "toggle", label: "Disable actions", checked: disabled, onCheckedChange: setDisabled },
  ] satisfies DemoMenuEntry[];

  return <>
    <DemoSurface className={styles.artwork} label="Apple Liquid Cluster preview" menu={menu}>
      <header className={styles.artworkHeader}><h2>Notification</h2><span>{cleared ? "Cleared" : separation > .5 ? "Separated" : "Joined"}</span></header>
      <div className={styles.groups}>
        <div className={`${styles.notificationWrap} ${cleared ? styles.cleared : ""}`} data-reduced-motion={reducedMotion} inert={cleared}>
          <LiquidCluster items={items} layout="notification" ariaLabel="Notification actions" separation={separation} onSeparationChange={setSeparation}
            onSelect={action => { if (action === "clear") setCleared(true); else instance.current?.setSeparation(separation > .5 ? 0 : 1); }}
            opaque={opaque} reducedMotion={reducedMotion} disabled={disabled} className={styles.scene} onReady={onReady} />
        </div>
        {cleared && <p className={styles.empty} role="status">No notifications</p>}
      </div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset} replayDisabled={!ready || disabled}>
      <DemoRange label="Separation" min={0} max={1} step={.01} value={separation} format={value => `${Math.round(value * 100)}%`}
        disabled={!ready || cleared} onValueChange={value => instance.current?.setSeparation(value)} />
      <LiquidTrack className={styles.actions}>
        <button type="button" aria-pressed={separation === 0} disabled={!ready || cleared} onClick={() => instance.current?.setSeparation(0)}>Join</button>
        <button type="button" aria-pressed={separation === 1} disabled={!ready || cleared} onClick={() => instance.current?.setSeparation(1)}>Separate</button>
      </LiquidTrack>
      <div className={styles.options}>
        <DemoToggle label="Opaque background" checked={opaque} onCheckedChange={setOpaque} />
        <DemoToggle label="Reduce motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        <DemoToggle label="Disable actions" checked={disabled} onCheckedChange={setDisabled} />
      </div>
      <p className={styles.hint}>Click the notification to reveal Clear. Right-click for more actions.</p>
    </DemoPanel>
  </>;
}
