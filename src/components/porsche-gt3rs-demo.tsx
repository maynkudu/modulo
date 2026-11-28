"use client";

import { useEffect, useRef, useState } from "react";
import { PorscheGT3RS, initialPorscheView, type PorscheView } from "@/registry/porsche-gt3rs/PorscheGT3RS";
import { DemoPanel, DemoRange, DemoSelect, DemoToggle } from "./demo-controls";
import styles from "./porsche-gt3rs-demo.module.css";

const paints = [
  { label: "Olive", color: null, swatch: "#68704b" },
  { label: "Chalk", color: "#b8b5a9", swatch: "#b8b5a9" },
  { label: "Guards red", color: "#8d2f29", swatch: "#8d2f29" },
  { label: "Midnight", color: "#323a43", swatch: "#323a43" },
] as const;
const renderModes = ["Normal", "Studio"] as const;
const wheelStyles = ["Y-spoke", "Five-spoke", "Mesh"] as const;
const wheelFinishes = [
  { value: "#785b3b", label: "Bronze" },
  { value: "#32383c", label: "Graphite" },
  { value: "#b5b8b5", label: "Silver" },
] as const;
const views = {
  Front: initialPorscheView,
  Rear: { angle: 224, elevation: 10, zoom: 1 },
  Side: { angle: 0, elevation: 1, zoom: 1 },
  Roof: { angle: 0, elevation: 90, zoom: 1 },
  Underbody: { angle: 0, elevation: -90, zoom: 1 },
} satisfies Record<string, PorscheView>;

export function PorscheGT3RSDemo() {
  const [view, setView] = useState<PorscheView>(initialPorscheView);
  const [mode, setMode] = useState<(typeof renderModes)[number]>("Studio");
  const [paint, setPaint] = useState<string | null>(paints[0].color);
  const [wheel, setWheel] = useState<(typeof wheelStyles)[number]>("Y-spoke");
  const [wheelFinish, setWheelFinish] = useState<string>(wheelFinishes[0].value);
  const [lights, setLights] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [collapseRequest, setCollapseRequest] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const selectedView = Object.entries(views).find(([, camera]) =>
    camera.angle === view.angle && camera.elevation === view.elevation,
  )?.[0] ?? "Custom";

  useEffect(() => {
    const updateFullscreen = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  const reset = () => {
    setMode("Studio");
    setPaint(paints[0].color);
    setWheel("Y-spoke");
    setWheelFinish(wheelFinishes[0].value);
    setLights(false);
    setView(initialPorscheView);
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else {
      setCollapseRequest(request => request + 1);
      void root.current?.requestFullscreen();
    }
  };

  return <div className={styles.demo} data-gt3rs-showcase ref={root}>
    <div className={styles.scene}>
      <PorscheGT3RS src="/artwork/porsche-gt3rs.glb" view={view} onViewChange={setView}
        mode={mode} paint={paint} wheel={wheel} wheelFinish={wheelFinish} lights={lights} />
    </div>
    <div className={styles.controls}>
      <DemoPanel menu={[{ kind: "action", label: "Reset camera", onClick: () => setView(initialPorscheView) }]}
        onReplay={() => setView(initialPorscheView)} onReset={reset} collapseRequest={collapseRequest}>
        <div className={styles.paintField} role="group" aria-label="Paint color">
          <span>Paint</span>
          <div className={styles.swatches}>
            {paints.map(item => <button type="button" key={item.label} className={styles.swatch}
              style={{ background: item.swatch }} aria-label={item.label} aria-pressed={paint === item.color}
              onClick={() => setPaint(item.color)} />)}
          </div>
        </div>
        <DemoSelect label="Render mode" value={mode}
          options={renderModes.map(value => ({ value, label: value }))} onValueChange={setMode} />
        <DemoSelect label="Wheel style" value={wheel}
          options={wheelStyles.map(value => ({ value, label: value }))} onValueChange={setWheel} />
        <DemoSelect label="Wheel finish" value={wheelFinish}
          options={wheelFinishes.map(({ value, label }) => ({ value, label }))} onValueChange={setWheelFinish} />
        <DemoToggle label="Lights" checked={lights} onCheckedChange={setLights} />
        <DemoToggle label="Doors" checked={false} disabled onCheckedChange={() => {}} />
        <DemoToggle label="Interior view" checked={false} disabled onCheckedChange={() => {}} />
        <DemoSelect label="View" value={selectedView}
          options={[...Object.keys(views).map(value => ({ value, label: value })), ...(selectedView === "Custom" ? [{ value: "Custom", label: "Custom" }] : [])]}
          onValueChange={name => { const camera = views[name as keyof typeof views]; if (camera) setView(camera); }} />
        <DemoRange label="Zoom" min={0.65} max={3} step={0.05} value={view.zoom}
          format={value => `${value.toFixed(2)}×`} onValueChange={zoom => setView(current => ({ ...current, zoom }))} />
        <button type="button" className={styles.fullscreenButton} onClick={toggleFullscreen}>
          {fullscreen ? "Exit full screen" : "Full screen"}
        </button>
      </DemoPanel>
    </div>
  </div>;
}
