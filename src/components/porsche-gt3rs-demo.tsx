"use client";

import { useState } from "react";
import { PorscheGT3RS, initialPorscheView } from "@/registry/porsche-gt3rs/PorscheGT3RS";
import { porscheGT3RSPath } from "@/registry/porsche-gt3rs/asset";
import { DemoPanel, DemoRange, DemoSelect } from "./demo-controls";

const angles = {
  Front: initialPorscheView, Rear: { angle: 224, elevation: 10, zoom: 1 },
  Side: { angle: 0, elevation: 1, zoom: 1 }, Roof: { angle: 0, elevation: 90, zoom: 1 },
  Underbody: { angle: 0, elevation: -90, zoom: 1 },
};
export function PorscheGT3RSDemo() {
  const [view, setView] = useState(initialPorscheView);
  const selected = Object.entries(angles).find(([, camera]) => camera.angle === view.angle && camera.elevation === view.elevation)?.[0] ?? "Custom";
  const reset = () => setView(initialPorscheView);
  return <div>
    <PorscheGT3RS src={porscheGT3RSPath} view={view} onViewChange={setView} />
    <DemoPanel menu={[{ kind: "action", label: "Reset view", onClick: reset }]} onReplay={reset} onReset={reset}>
      <DemoSelect label="View" value={selected} options={[...Object.keys(angles).map(value => ({ value, label: value })), ...(selected === "Custom" ? [{ value: "Custom", label: "Custom" }] : [])]} onValueChange={name => {
        const camera = Object.entries(angles).find(([key]) => key === name)?.[1];
        if (camera) setView(camera);
      }} />
      <DemoRange label="Zoom" min={.65} max={3} step={.05} value={view.zoom} format={value => `${value.toFixed(2)}×`} onValueChange={zoom => setView(current => ({ ...current, zoom }))} />
    </DemoPanel>
  </div>;
}
