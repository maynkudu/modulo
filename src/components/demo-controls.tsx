"use client";

import { useId, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ContextMenu } from "@base-ui/react/context-menu";
import { Menu } from "@base-ui/react/menu";
import type { LiquidMenuEntry } from "@/registry/liquid-animations/LiquidControls";
import styles from "./demo-controls-ui.module.css";
import { playSound } from "@/lib/interface-sounds";

export type DemoMenuEntry = LiquidMenuEntry;

const panelQuery = "(min-width: 861px)";

function subscribePanelSize(notify: () => void) {
  const query = window.matchMedia(panelQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function getPanelSize() {
  return window.matchMedia(panelQuery).matches;
}

function getServerPanelSize() {
  return true;
}

function MenuEntryContent({ entry }: { entry: DemoMenuEntry }) {
  return <>{entry.icon}<span className={styles.controlMenuLabel}>{entry.content ?? entry.label}</span></>;
}

function MoreMenu({ entries }: { entries: readonly DemoMenuEntry[] }) {
  return <Menu.Root modal={false}>
    <Menu.Trigger className={styles.controlsMore} aria-label="More preview actions">More</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner align="end" sideOffset={8} collisionPadding={12} className={styles.controlPositioner}>
        <Menu.Popup className={styles.controlMenu} aria-label="Preview actions">
          {entries.map(entry => entry.kind === "action"
            ? <Menu.Item key={entry.label} className={styles.controlMenuItem} disabled={entry.disabled} onClick={entry.onClick} aria-label={entry.label}>
                <MenuEntryContent entry={entry} />
              </Menu.Item>
            : <Menu.CheckboxItem key={entry.label} className={styles.controlMenuItem} disabled={entry.disabled}
                checked={entry.checked} onCheckedChange={entry.onCheckedChange} closeOnClick={false} aria-label={entry.label}>
                <MenuEntryContent entry={entry} />
                <Menu.CheckboxItemIndicator className={styles.controlMenuCheck} aria-hidden="true">✓</Menu.CheckboxItemIndicator>
              </Menu.CheckboxItem>)}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>;
}

export function DemoSurface({ children, className, label, menu }: {
  children: ReactNode;
  className: string;
  label: string;
  menu: readonly DemoMenuEntry[];
}) {
  return <ContextMenu.Root>
    <ContextMenu.Trigger render={<section className={`${className} ${styles.demoSurface}`} aria-label={label} tabIndex={0} />}>{children}</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner sideOffset={6} collisionPadding={12} className={styles.controlPositioner}>
        <ContextMenu.Popup className={styles.controlMenu} aria-label="Preview actions">
          {menu.map(entry => entry.kind === "action"
            ? <ContextMenu.Item key={entry.label} className={styles.controlMenuItem} disabled={entry.disabled} onClick={entry.onClick} aria-label={entry.label}>
                <MenuEntryContent entry={entry} />
              </ContextMenu.Item>
            : <ContextMenu.CheckboxItem key={entry.label} className={styles.controlMenuItem} disabled={entry.disabled}
                checked={entry.checked} onCheckedChange={entry.onCheckedChange} closeOnClick={false} aria-label={entry.label}>
                <MenuEntryContent entry={entry} />
                <ContextMenu.CheckboxItemIndicator className={styles.controlMenuCheck} aria-hidden="true">✓</ContextMenu.CheckboxItemIndicator>
              </ContextMenu.CheckboxItem>)}
        </ContextMenu.Popup>
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>;
}

export function DemoPanel({ children, menu, onReplay, onReset, replayDisabled = false }: {
  children: ReactNode;
  menu: readonly DemoMenuEntry[];
  onReplay: () => void;
  onReset: () => void;
  replayDisabled?: boolean;
}) {
  const id = useId();
  const wide = useSyncExternalStore(subscribePanelSize, getPanelSize, getServerPanelSize);
  const [expandedOverride, setExpandedOverride] = useState<boolean | null>(null);
  const expanded = expandedOverride ?? wide;

  return <aside className={styles.controlsPanel} aria-labelledby={id}>
    <details open={expanded}>
      <summary className={styles.controlsSummary} onClick={event => {
        event.preventDefault();
        setExpandedOverride(!expanded);
      }}>
        <h2 id={id}>Controls</h2>
        <span className={styles.controlsDisclosureState} aria-hidden="true">{expanded ? "Hide" : "Show"}</span>
      </summary>
      <div className={styles.controlsBody}>
        <div className={styles.controlsFields}>{children}</div>
        <footer className={styles.controlsFooter}>
          <button className={styles.controlsReplay} type="button" onClick={onReplay} disabled={replayDisabled}>Replay</button>
          <button className={styles.controlsReset} type="button" onClick={onReset}>Reset</button>
        </footer>
      </div>
    </details>
    <MoreMenu entries={menu} />
  </aside>;
}

export function DemoSelect<Value extends string>({ label, value, options, onValueChange }: {
  label: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onValueChange: (value: Value) => void;
}) {
  const id = useId();
  return <div className={styles.controlSelectField}>
    <label htmlFor={id}>{label}</label>
    <select id={id} className={styles.controlSelect} value={value} onChange={event => {
      const selected = options.find(option => option.value === event.currentTarget.value);
      if (selected) onValueChange(selected.value);
    }}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </div>;
}

type RangeFillStyle = CSSProperties & { "--demo-range-fill": string };

export function DemoRange({ label, value, min, max, step = 1, onValueChange, format = String, disabled = false, className = "", showValue = true }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  format?: (value: number) => string;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
}) {
  const id = useId();
  const progress = max === min ? 0 : (Math.min(max, Math.max(min, value)) - min) / (max - min) * 100;
  const style: RangeFillStyle = { "--demo-range-fill": `${progress}%` };
  const formatted = format(value);

  return <div className={`${styles.controlRangeField} ${className}`} data-disabled={disabled || undefined}>
    <div className={styles.controlRangeHeading}>
      <label htmlFor={id}>{label}</label>
      {showValue && <output htmlFor={id} aria-live="off">{formatted}</output>}
    </div>
    <input id={id} className={styles.controlRange} type="range" min={min} max={max} step={step}
      value={value} disabled={disabled} aria-valuetext={formatted} style={style} data-sound-managed
      onChange={event => { onValueChange(event.currentTarget.valueAsNumber); playSound("slide"); }} />
  </div>;
}

export function DemoToggle({ label, checked, onCheckedChange }: {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  const id = useId();
  return <label className={styles.controlToggleRow} htmlFor={id}>
    <span>{label}</span>
    <input id={id} className={styles.controlToggle} type="checkbox" role="switch" checked={checked}
      onChange={event => onCheckedChange(event.currentTarget.checked)} />
  </label>;
}
