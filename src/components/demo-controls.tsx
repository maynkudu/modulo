"use client";

import { useId, type ReactNode } from "react";
import { ContextMenu } from "@base-ui/react/context-menu";
import { Menu } from "@base-ui/react/menu";
import { Select } from "@base-ui/react/select";
import { Slider } from "@base-ui/react/slider";
import { Switch } from "@base-ui/react/switch";
import { RuneIcon } from "runeicons-react";
import styles from "./demo-controls-ui.module.css";

export type DemoMenuEntry =
  | { kind: "action"; label: string; onClick: () => void; disabled?: boolean }
  | { kind: "toggle"; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void };

function MenuEntries({ entries }: { entries: readonly DemoMenuEntry[] }) {
  return entries.map((entry, index) => entry.kind === "action"
    ? <Menu.Item key={entry.label} className={styles.menuItem} disabled={entry.disabled} onClick={entry.onClick}>{entry.label}</Menu.Item>
    : <Menu.CheckboxItem key={entry.label} className={`${styles.menuItem} ${index > 0 && entries[index - 1]?.kind === "action" ? styles.menuDivider : ""}`} checked={entry.checked} onCheckedChange={entry.onCheckedChange} closeOnClick={false}>
      <span>{entry.label}</span><Menu.CheckboxItemIndicator className={styles.checkmark}>✓</Menu.CheckboxItemIndicator>
    </Menu.CheckboxItem>);
}

export function DemoSurface({ children, className, label, menu }: { children: ReactNode; className: string; label: string; menu: readonly DemoMenuEntry[] }) {
  return <ContextMenu.Root>
    <ContextMenu.Trigger render={<section className={className} aria-label={label} />}>{children}</ContextMenu.Trigger>
    <ContextMenu.Portal><ContextMenu.Positioner className={styles.positioner} sideOffset={6}>
      <ContextMenu.Popup className={styles.popup} aria-label="Preview actions"><MenuEntries entries={menu} /></ContextMenu.Popup>
    </ContextMenu.Positioner></ContextMenu.Portal>
  </ContextMenu.Root>;
}

export function DemoPanel({ children, menu, onReplay, onReset, replayDisabled = false }: {
  children: ReactNode; menu: readonly DemoMenuEntry[]; onReplay: () => void; onReset: () => void; replayDisabled?: boolean;
}) {
  const id = useId();
  return <section className={styles.panel} aria-labelledby={id}>
    <header className={styles.panelHeader}><h2 id={id}>Controls</h2>
      <Menu.Root><Menu.Trigger className={styles.menuTrigger} aria-label="More preview actions"><span aria-hidden="true">•••</span></Menu.Trigger>
        <Menu.Portal><Menu.Positioner className={styles.positioner} align="end" sideOffset={8}>
          <Menu.Popup className={styles.popup} aria-label="Preview actions"><MenuEntries entries={menu} /></Menu.Popup>
        </Menu.Positioner></Menu.Portal>
      </Menu.Root>
    </header>
    <div className={styles.fields}>{children}</div>
    <footer className={styles.footer}>
      <button className={styles.replay} type="button" onClick={onReplay} disabled={replayDisabled}>Replay</button>
      <button className={styles.reset} type="button" onClick={onReset}>Reset</button>
    </footer>
  </section>;
}

export function DemoSelect<Value extends string>({ label, value, options, onValueChange }: {
  label: string; value: Value; options: readonly { value: Value; label: string }[]; onValueChange: (value: Value) => void;
}) {
  const id = useId();
  return <div className={styles.selectField}><label id={id}>{label}</label>
    <Select.Root value={value} items={options} onValueChange={next => { if (next !== null) onValueChange(next); }}>
      <Select.Trigger aria-labelledby={id} className={styles.selectTrigger}><Select.Value /><Select.Icon className={styles.chevron}><RuneIcon name="arrows-chevron-down" size={14} /></Select.Icon></Select.Trigger>
      <Select.Portal><Select.Positioner className={styles.positioner} align="end" sideOffset={6} alignItemWithTrigger={false}>
        <Select.Popup className={styles.popup}><Select.List>{options.map(option => <Select.Item key={option.value} value={option.value} className={styles.menuItem}><Select.ItemText>{option.label}</Select.ItemText><Select.ItemIndicator className={styles.checkmark}>✓</Select.ItemIndicator></Select.Item>)}</Select.List></Select.Popup>
      </Select.Positioner></Select.Portal>
    </Select.Root>
  </div>;
}

export function DemoRange({ label, value, min, max, step = 1, onValueChange, format = String, disabled = false }: {
  label: string; value: number; min: number; max: number; step?: number; onValueChange: (value: number) => void; format?: (value: number) => string; disabled?: boolean;
}) {
  return <Slider.Root className={styles.range} min={min} max={max} step={step} value={value} onValueChange={onValueChange} disabled={disabled}>
    <div className={styles.rangeHeading}><Slider.Label>{label}</Slider.Label><output>{format(value)}</output></div>
    <Slider.Control className={styles.rangeControl}><Slider.Track className={styles.track}><Slider.Indicator className={styles.indicator} /><Slider.Thumb className={styles.thumb} aria-label={label} getAriaValueText={(_, next) => format(next)} /></Slider.Track></Slider.Control>
  </Slider.Root>;
}

export function DemoToggle({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  const id = useId();
  return <label className={styles.toggleRow} htmlFor={id}><span>{label}</span><Switch.Root id={id} className={styles.toggle} checked={checked} onCheckedChange={onCheckedChange}><Switch.Thumb className={styles.toggleThumb} /></Switch.Root></label>;
}
