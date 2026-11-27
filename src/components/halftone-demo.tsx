"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Halftone, type HalftoneProps } from "@/registry/halftone/Halftone";
import { PreviewButton, PreviewDisclosure } from "./preview-controls";
import { DemoPanel, DemoRange, DemoSelect, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import { halftoneControlGroups, halftoneNumericDefaults, halftonePalettes } from "@/lib/halftone-demo-settings";
import styles from "./halftone-demo.module.css";

function subscribeMotion(notify: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const getMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerMotion = () => false;
const fadeOptions = [
  { value: "edges", label: "Edges" }, { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" }, { value: "left", label: "Left" }, { value: "right", label: "Right" },
] satisfies { value: NonNullable<HalftoneProps["fadeFrom"]>; label: string }[];

/** Public controls own settings; the installable shader owns its clock and pointer path. */
export function HalftoneDemo() {
  const [settings, setSettings] = useState(halftoneNumericDefaults);
  const [colors, setColors] = useState(halftonePalettes[0].colors);
  const [background, setBackground] = useState(halftonePalettes[0].background);
  const [animate, setAnimate] = useState(true), [interactive, setInteractive] = useState(true);
  const [fadeFrom, setFadeFrom] = useState<NonNullable<HalftoneProps["fadeFrom"]>>("edges");
  const [instance, setInstance] = useState(0);
  const [ready, setReady] = useState<boolean | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion);
  const onReady = useCallback((value: boolean) => setReady(value), []);
  function replay() { setReady(null); setInstance(value => value + 1); }
  function reset() {
    setSettings(halftoneNumericDefaults); setColors(halftonePalettes[0].colors);
    setBackground(halftonePalettes[0].background); setAnimate(true); setInteractive(true);
    setFadeFrom("edges"); replay();
  }
  const menu: DemoMenuEntry[] = [
    { kind: "action", label: "Replay", onClick: replay },
    { kind: "action", label: "Reset settings", onClick: reset },
  ];
  return <section className={styles.preview} aria-label="Halftone preview">
    <div className={styles.stage}>
      <Halftone key={instance} {...settings} colors={colors} background={background}
        animate={animate} interactive={interactive} fadeFrom={fadeFrom} onReady={onReady} className={styles.scene} />
      {ready === false && <p role="status">The CSS dot fallback is displayed. WebGL initialization is unavailable. Use Replay to retry.</p>}
      {reduced && <p role="status">Reduced motion keeps the shader still and disables the pointer trail. Color and dot controls remain available.</p>}
    </div>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset}>
      <DemoToggle label="Animate" checked={animate} onCheckedChange={setAnimate} />
      <DemoToggle label="Pointer interaction" checked={interactive} onCheckedChange={setInteractive} />
      <DemoRange label="Speed" value={settings.speed} min={0} max={3} step={0.1} disabled={reduced}
        format={value => `${value.toFixed(1)}×`} onValueChange={speed => setSettings(current => ({ ...current, speed }))} />
      <PreviewDisclosure label="Colors" open>
        <div className={styles.paletteButtons}>{halftonePalettes.map(palette => <PreviewButton key={palette.value}
          onClick={() => { setColors(palette.colors); setBackground(palette.background); }}>{palette.label}</PreviewButton>)}</div>
        <div className={styles.colors}>{colors.map((color, index) => <label key={index}>Color {index + 1}
          <input type="color" value={color} onChange={event => {
            const next = event.currentTarget.value;
            setColors(current => current.map((value, i) => i === index ? next : value));
          }} />
        </label>)}</div>
        <div className={styles.paletteButtons}>
          <PreviewButton disabled={colors.length >= 6} onClick={() => setColors(current => [...current, current[current.length - 1]])}>Add color</PreviewButton>
          <PreviewButton disabled={colors.length <= 2} onClick={() => setColors(current => current.slice(0, -1))}>Remove color</PreviewButton>
        </div>
        <label className={styles.background}>Background<input type="color" value={background} onChange={event => setBackground(event.currentTarget.value)} /></label>
      </PreviewDisclosure>
      {halftoneControlGroups.map(group => <PreviewDisclosure key={group.label} label={group.label}>
        <div className={styles.group}>{group.fields.map(field => <DemoRange key={field.key} label={field.label}
          value={settings[field.key]} min={field.min} max={field.max} step={field.step}
          format={value => field.key === "spacing" || field.key === "radius" ? `${value}px` : field.key === "angle" ? `${value}°` : field.key === "trailLength" ? `${value.toFixed(1)}s` : String(Number(value.toFixed(3)))}
          onValueChange={value => setSettings(current => ({ ...current, [field.key]: value }))} />)}
          {group.label === "Fade" && <DemoSelect label="Direction" value={fadeFrom} options={fadeOptions} onValueChange={setFadeFrom} />}
        </div>
      </PreviewDisclosure>)}
    </DemoPanel>
  </section>;
}
