"use client";

import { useId, type ReactNode } from "react";
import { LiquidButton, LiquidContextMenu, LiquidMenu, LiquidSelect, LiquidSwitch, type LiquidMenuEntry } from "@/registry/liquid-animations/LiquidControls";
import { InterfaceSlider } from "./interface-slider";
import styles from "./demo-controls-ui.module.css";

export type DemoMenuEntry = LiquidMenuEntry;

export function DemoSurface({ children, className, label, menu }: { children: ReactNode; className: string; label: string; menu: readonly DemoMenuEntry[] }) {
  return <LiquidContextMenu className={className} label={label} entries={menu}>{children}</LiquidContextMenu>;
}

export function DemoPanel({ children, menu, onReplay, onReset, replayDisabled = false }: {
  children: ReactNode; menu: readonly DemoMenuEntry[]; onReplay: () => void; onReset: () => void; replayDisabled?: boolean;
}) {
  const id = useId();
  return <section className={styles.panel} aria-labelledby={id}>
    <header className={styles.panelHeader}><h2 id={id}>Controls</h2>
      <LiquidMenu label="More preview actions" entries={menu} align="end" round className={styles.menuTrigger}><span aria-hidden="true">•••</span></LiquidMenu>
    </header>
    <div className={styles.fields}>{children}</div>
    <footer className={styles.footer}>
      <LiquidButton className={styles.replay} onClick={onReplay} disabled={replayDisabled}>Replay</LiquidButton>
      <LiquidButton className={styles.reset} onClick={onReset}>Reset</LiquidButton>
    </footer>
  </section>;
}

export function DemoSelect<Value extends string>({ label, value, options, onValueChange }: {
  label: string; value: Value; options: readonly { value: Value; label: string }[]; onValueChange: (value: Value) => void;
}) {
  const id = useId();
  return <div className={styles.selectField}><label htmlFor={id}>{label}</label>
    <LiquidSelect id={id} label={label} value={value} options={options} onValueChange={onValueChange} className={styles.selectTrigger} align="end" />
  </div>;
}

export function DemoRange({ label, value, min, max, step = 1, onValueChange, format = String, disabled = false }: {
  label: string; value: number; min: number; max: number; step?: number; onValueChange: (value: number) => void; format?: (value: number) => string; disabled?: boolean;
}) {
  return <InterfaceSlider className={styles.range} label={label} min={min} max={max} step={step} value={value} onValueChange={onValueChange} formatValue={format} disabled={disabled} />;
}

export function DemoToggle({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  const id = useId();
  return <label className={styles.toggleRow} htmlFor={id}><span>{label}</span><LiquidSwitch id={id} aria-label={label} checked={checked} onCheckedChange={onCheckedChange} /></label>;
}
