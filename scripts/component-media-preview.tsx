import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GardenCanvas } from "../src/registry/interactive-art/examples/GardenCanvas";
import { Nilkamal } from "../src/registry/nilkamal/Nilkamal";
import { Diwali26, type Diwali26Controller, type FrameState } from "../src/registry/diwali-26/Diwali26";
import { RootInfection } from "../src/registry/root-infection/RootInfection";
import { TexturedGlass } from "../src/registry/textured-glass/TexturedGlass";
import { Game2048, type Game2048Controller } from "../src/registry/2048/Game2048";
import type { Direction } from "../src/registry/2048/game";
import { ElasticSlider, type ElasticSliderController } from "../src/registry/elastic-slider/ElasticSlider";
import { SnapRail, type SnapRailController } from "../src/registry/snap-rail/SnapRail";
import { LiquidCluster, type LiquidClusterController } from "../src/registry/liquid-cluster/LiquidCluster";
import { LiquidAnimationsDemo } from "../src/components/liquid-animations-demo";
import { LogoRefraction } from "../src/registry/logo-refraction/LogoRefraction";

import { OverlayNavigation } from "../src/registry/overlay-navigation/OverlayNavigation";

function markReady(controller: unknown) {
  if (controller) document.body.dataset.ready = "true";
}

let diwaliController: Diwali26Controller | null = null;
let nextLaunch = .2;
let launchIndex = 0;
const positions = [[.5, .21], [.5, .38], [.25, .27], [.80, .32]];
function diwaliReady(controller: Diwali26Controller | null) { diwaliController = controller; markReady(controller); }
function diwaliFrame(frame: FrameState) {
  if (!diwaliController || frame.time < nextLaunch) return;
  nextLaunch = frame.time + 1.2;
  const index = launchIndex++;
  diwaliController.setPattern(index % 3 === 0 ? "diwali" : index % 3 === 1 ? "2026" : "lotus");
  const position = positions[index % positions.length];
  diwaliController.launch(position[0], position[1]);
}

const gameBoard = [2, 2, 4, 0, 4, 8, 16, 0, 8, 16, 64, 0, 16, 32, 128, 256];
let gameTimer: ReturnType<typeof setInterval> | undefined;
function gameReady(controller: Game2048Controller | null) {
  clearInterval(gameTimer);
  if (!controller) return;
  markReady(controller);
  const moves: Direction[] = ["left", "up", "right", "down", "left", "up", "left", "down"];
  let index = 0;
  gameTimer = setInterval(() => controller.move(moves[index++ % moves.length]), 800);
}

let capturedControl: ElasticSliderController | SnapRailController | LiquidClusterController | null = null;
function controlReady(controller: ElasticSliderController | SnapRailController | LiquidClusterController | null) {
  capturedControl = controller;
  if (!controller) return;
  markReady(controller);
}
const railDetents = [{ id: "left", label: "Left", position: 0 }, { id: "center", label: "Center", position: 50 }, { id: "right", label: "Right", position: 100 }];
const clusterItems = [
  { id: "notification", label: "Design review", content: <span style={{ display: "grid", gap: 6 }}><span style={{ fontSize: 11, color: "#777" }}>Messages</span><strong style={{ fontSize: 14 }}>Design review</strong><span style={{ fontSize: 12 }}>The updated preview is ready.</span></span> },
  { id: "clear", label: "Clear" },
];

function NavigationCapture() {
  useEffect(() => { document.body.dataset.ready = "true"; }, []);
  return <OverlayNavigation defaultOpen trailing={<span className="india-time inline-block min-w-[10ch] text-[14px] whitespace-nowrap tabular-nums mobile:text-[13px]">IND | 21:45</span>} />;
}

function LiquidAnimationsCapture() {
  useEffect(() => { void document.fonts.ready.then(() => markReady(true)); }, []);
  return <section className="liquid-media"><LiquidAnimationsDemo initialExample="Account" compact /></section>;
}

function MediaPreview() {
  const name = new URLSearchParams(location.search).get("component");
  if (name === "liquid-animations") {
    return <LiquidAnimationsCapture />;
  }
  if (name === "overlay-navigation") {
    return <NavigationCapture />;
  }
  if (name === "logo-refraction") {
    return <LogoRefraction className="media-scene" src="__LOGO_REFRACTION_IMAGE__" alt="The complete maynkudu logo" onReady={markReady} />;
  }
  if (name === "elastic-slider" || name === "snap-rail" || name === "liquid-cluster") {
    return <section className="control-media"><header><span>Modulo</span><h1>{name === "elastic-slider" ? "Elastic slider" : name === "snap-rail" ? "Snap rail" : "Liquid cluster"}</h1><button type="button" data-control-replay onClick={() => capturedControl?.replay()}>Replay</button></header><div className="control-media-stage">
      {name === "elastic-slider" ? <ElasticSlider label="Brightness" defaultValue={65} orientation="vertical" onReady={controlReady} /> : name === "snap-rail" ? <SnapRail ariaLabel="Placement" detents={railDetents} defaultSelectedId="center" onReady={controlReady} /> : <LiquidCluster ariaLabel="Notification actions" layout="notification" items={clusterItems} defaultSeparation={0} onReady={controlReady} />}
    </div></section>;
  }
  if (name === "2048") {
    return <Game2048 className="media-scene" seed={2048} initialBoard={gameBoard} initialScore={1832} storageKey={null} enableAudio={false} onReady={gameReady} />;
  }
  if (name === "textured-glass") {
    return <TexturedGlass className="media-scene" src="__TEXTURED_GLASS_IMAGE__" depthMap="__TEXTURED_GLASS_DEPTH__" alt="A photograph through textured glass" onDepth={state => { if (state.kind === "ready") markReady(true); }} />;
  }
  if (name === "diwali-26") {
    return <Diwali26 className="media-scene" enableAudio={false} onReady={diwaliReady} onFrame={diwaliFrame} />;
  }
  if (name === "root-infection") {
    return <RootInfection className="media-scene" enableAudio={false} onReady={markReady} />;
  }
  if (name === "nilkamal") {
    return <Nilkamal className="media-scene" weather="rain" enableAudio={false} onReady={markReady} />;
  }
  if (name === "interactive-art") {
    return <GardenCanvas className="media-scene" initialTime={34} timeScale={1} wind={1} onReady={markReady} />;
  }
  throw new Error("Select a component for media capture.");
}

const root = document.getElementById("root");
if (!root) throw new Error("Media preview root is missing.");
createRoot(root).render(<MediaPreview />);
