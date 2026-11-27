import { Halftone } from "../src/registry/halftone/Halftone";
import { ImageMosaic } from "../src/registry/image-mosaic/ImageMosaic";
import { PortraitWave } from "../src/registry/portrait-wave/PortraitWave";
import { EyeSpice, type EyeSpiceController } from "../src/registry/eyespice/EyeSpice";
import { BrickNoise } from "../src/registry/brick-noise/BrickNoise";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { GardenCanvas } from "../src/registry/interactive-art/examples/GardenCanvas";
import { Nilkamal } from "../src/registry/nilkamal/Nilkamal";
import { Diwali26, type Diwali26Controller, type FrameState } from "../src/registry/diwali-26/Diwali26";
import { RootInfection } from "../src/registry/root-infection/RootInfection";
import { TexturedGlass } from "../src/registry/textured-glass/TexturedGlass";
import { Game2048, type Game2048Controller } from "../src/registry/2048/Game2048";
import { ElasticSlider, type ElasticSliderController } from "../src/registry/elastic-slider/ElasticSlider";
import { SnapRail, type SnapRailController } from "../src/registry/snap-rail/SnapRail";
import { LiquidCluster, type LiquidClusterController } from "../src/registry/liquid-cluster/LiquidCluster";
import { LiquidAnimationsDemo } from "../src/components/liquid-animations-demo";
import { LogoRefraction } from "../src/registry/logo-refraction/LogoRefraction";

import { OverlayNavigation } from "../src/registry/overlay-navigation/OverlayNavigation";
import { LiquidTextDemo } from "../src/components/liquid-text-demo";
import { MultiStepDownload } from "../src/registry/multi-step-download/MultiStepDownload";
import { InlineDownload } from "../src/registry/inline-download/InlineDownload";
import { StateButton, type StateButtonState } from "../src/registry/state-buttons/StateButton";
import { DotOrb } from "../src/registry/dot-orb/DotOrb";
import { useDownloadPreview } from "../src/components/use-download-preview";
import { SwitchbackPage, type SwitchbackPageProps } from "../src/registry/sprite-racer/SwitchbackPage";
import { ThermalImage } from "../src/registry/thermal-image/thermal-image";

const switchbackReady: SwitchbackPageProps["onReady"] = controller => {
  if (!controller) return;
  controller.start();
  markReady(controller);
};

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
  // Establish the best score before the loop, since undo retains it.
  controller.move("left");
  controller.undo();
  markReady(controller);
  let index = 0;
  gameTimer = setInterval(() => {
    if (index++ % 2 === 0) controller.move("left");
    else controller.undo();
  }, 1000);
}

let capturedControl: ElasticSliderController | SnapRailController | LiquidClusterController | null = null;
function controlReady(controller: ElasticSliderController | SnapRailController | LiquidClusterController | null) {
  capturedControl = controller;
  if (!controller) return;
  markReady(controller);
}
window.addEventListener("modulo-media-replay", () => capturedControl?.replay());
window.addEventListener("keydown", event => { if (event.key === "r") capturedControl?.replay(); });
window.addEventListener("keydown", event => {
  if (event.key !== "0" || !capturedControl) return;
  if ("select" in capturedControl) capturedControl.select("center");
  else if ("setSeparation" in capturedControl) capturedControl.setSeparation(0);
  else capturedControl.update({ label: "Brightness", value: 65, onValueChange: () => {}, orientation: "vertical" });
});
window.addEventListener("modulo-media-time", () => {
  if (document.activeElement instanceof HTMLElement && document.activeElement.closest(".inline-download,.liquid-media")) document.activeElement.blur();
});
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
  useEffect(() => {
    void document.fonts.ready.then(() => markReady(true));
    let opened = false;
    let closed = false;
    function update(event: Event) {
      const seconds: unknown = event instanceof CustomEvent ? event.detail : null;
      if (typeof seconds !== "number") return;
      if (!opened && seconds >= .7) {
        document.querySelector<HTMLButtonElement>('button[aria-label="Jane Doe account"]')?.click();
        opened = true;
      } else if (!closed && seconds >= 2.7) {
        document.querySelector<HTMLButtonElement>('button[aria-label="Jane Doe account"]')?.click();
        closed = true;
      }
    }
    window.addEventListener("modulo-media-time", update);
    return () => window.removeEventListener("modulo-media-time", update);
  }, []);
  return <section className="liquid-media"><LiquidAnimationsDemo initialExample="Account" compact /></section>;
}

function EyeSpiceCapture() {
  function ready(controller: EyeSpiceController | null) {
    if (!controller) return;
    Object.defineProperty(window, "eyeSpiceCapture", { value: controller, configurable: true });
    markReady(controller);
  }
  return <section className="eyespice-media"><EyeSpice onReady={ready} /><span className="eyespice-rest" /></section>;
}

const portraitCaptureImages = ["__PORTRAIT_WAVE_A__", "__PORTRAIT_WAVE_B__"];

function InlineDownloadCapture() {
  useEffect(() => { document.body.dataset.ready = "true"; }, []);
  return <section className="inline-download-media">
    <InlineDownload size="lg" resetAfter={1.2} />
    <span className="inline-download-media-rest" aria-hidden="true" />
  </section>;
}

function StateButtonsCapture() {
  const [state, setState] = useState<StateButtonState>("idle");
  useEffect(() => {
    void document.fonts.ready.then(() => markReady(true));
    function update(event: Event) {
      const seconds: unknown = event instanceof CustomEvent ? event.detail : null;
      if (typeof seconds !== "number") return;
      setState(seconds < .7 || seconds >= 4.3 ? "idle" : seconds < 1.4 ? "loading" : seconds < 2.1 ? "thinking" : seconds < 2.8 ? "pending" : "success");
    }
    window.addEventListener("modulo-media-time", update);
    return () => window.removeEventListener("modulo-media-time", update);
  }, []);
  return <section className="state-buttons-media">
    <StateButton state={state} size={120} color="#ff4a3e" />
  </section>;
}

function ImageMosaicCapture() {
  useEffect(() => {
    function checkReady() {
      if (document.querySelector('.image-mosaic-media canvas[data-ready="true"]')) { observer.disconnect(); markReady(true); }
    }
    const observer = new MutationObserver(checkReady);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-ready"] });
    checkReady();
    return () => observer.disconnect();
  }, []);
  return <section className="image-mosaic-media">
    <ImageMosaic className="media-scene" src="__IMAGE_MOSAIC_IMAGE__" alt="People assembling a large horse sculpture outdoors"
      cellSize={12} detail={.6} seed={7} autoPlay={false} />
  </section>;
}

function MediaPreview() {
  const name = new URLSearchParams(location.search).get("component");
  if (name === "thermal-image") return <ThermalImageCapture />;
  if (name === "dot-orb") return <DotOrbCapture />;
  if (name === "image-mosaic") return <ImageMosaicCapture />;
  if (name === "halftone") return <section className="halftone-media">
    <Halftone className="media-scene" onReady={markReady} />
    <span className="halftone-start" aria-hidden="true" /><span className="halftone-end" aria-hidden="true" />
  </section>;
  if (name === "portrait-wave") return <PortraitWave className="media-scene" images={portraitCaptureImages} onState={state => { if (state.kind === "ready") markReady(true); }} />;
  if (name === "eyespice") return <EyeSpiceCapture />;
  if (name === "brick-noise") return <BrickNoise onReady={markReady} />;
  if (name === "sprite-racer") return <SwitchbackPage initialMap="pine" initialCar="turbo" demo onReady={switchbackReady} />;
  if (name === "multi-step-download") return <DownloadCapture />;
  if (name === "inline-download") return <InlineDownloadCapture />;
  if (name === "state-buttons") return <StateButtonsCapture />;
  if (name === "liquid-text-reveal") return <LiquidTextCapture />;
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
    return <section className="control-media"><div className="control-media-stage">
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

const captureLooks = ["thermal", "night-vision", "ultraviolet", "ice"] as const;

function ThermalImageCapture() {
  const [look, setLook] = useState<(typeof captureLooks)[number]>("thermal");
  useEffect(() => {
    let currentLook: (typeof captureLooks)[number] = "thermal";
    function update(event: Event) {
      const seconds: unknown = event instanceof CustomEvent ? event.detail : null;
      if (typeof seconds !== "number") return;
      const index = Math.min(captureLooks.length - 1, Math.floor(Math.max(0, seconds) / 1.5));
      const nextLook = captureLooks[index] ?? "thermal";
      if (nextLook === currentLook) return;
      currentLook = nextLook;
      setLook(nextLook);
    }
    window.addEventListener("modulo-media-time", update);
    return () => window.removeEventListener("modulo-media-time", update);
  }, []);

  return <section className="thermal-image-media">
    <ThermalImage
      src="__THERMAL_IMAGE__"
      alt="A sports car moving through four animated color field looks"
      look={look}
      background="studio"
      imageScale={1}
      pixelRatio={1}
      onReady={() => markReady(true)}
    />
  </section>;
}

/** A repeatable pointer-only teaser. Live audio is exercised separately through real input. */
function DotOrbCapture() {
  useEffect(() => {
    let rippled = false;
    function update(event: Event) {
      const seconds: unknown = event instanceof CustomEvent ? event.detail : null;
      const canvas = document.querySelector<HTMLCanvasElement>(".dot-orb-media canvas");
      if (typeof seconds !== "number" || !canvas) return;
      const box = canvas.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (seconds - .5) / 4.5));
      const x = box.left + box.width * (.25 + .5 * (1 - Math.cos(progress * Math.PI)) / 2);
      const y = box.top + box.height * (.5 + .12 * Math.sin(progress * Math.PI * 2));
      canvas.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y }));
      if (!rippled && seconds >= 2) {
        canvas.dispatchEvent(new PointerEvent("pointerdown", { clientX: x, clientY: y }));
        rippled = true;
      }
      if (seconds >= 5) canvas.dispatchEvent(new PointerEvent("pointerleave"));
    }
    window.addEventListener("modulo-media-time", update);
    return () => window.removeEventListener("modulo-media-time", update);
  }, []);
  return <section className="dot-orb-media" style={{ width: "100%", height: "100%", background: "#000" }}>
    <DotOrb onReady={markReady} />
  </section>;
}

function LiquidTextCapture() {
  useEffect(() => {
    void document.fonts.ready.then(() => markReady(true));
    function update(event: Event) {
      const seconds: unknown = event instanceof CustomEvent ? event.detail : null;
      if (typeof seconds !== "number") return;
      const progress = seconds < .2 ? 0 : seconds < 1.8 ? (seconds - .2) / 1.6 : seconds < 2.1 ? 1 : seconds < 3.8 ? 1 - (seconds - 2.1) / 1.7 : 0;
      const eased = (1 - Math.cos(progress * Math.PI)) / 2;
      window.scrollTo({ top: eased * (document.documentElement.scrollHeight - innerHeight), behavior: "instant" });
      window.dispatchEvent(new Event("scroll"));
    }
    window.addEventListener("modulo-media-time", update);
    return () => window.removeEventListener("modulo-media-time", update);
  }, []);
  return <section className="liquid-text-media"><LiquidTextDemo /></section>;
}

function DownloadCapture() {
  const { state, start } = useDownloadPreview();
  useEffect(() => { void document.fonts.ready.then(() => markReady(true)); }, []);
  return <section className="download-media">
    <MultiStepDownload size={153} state={state} onActivate={() => start()} />
    <span className="download-media-rest" aria-hidden="true" />
  </section>;
}

const root = document.getElementById("root");
if (!root) throw new Error("Media preview root is missing.");
createRoot(root).render(<MediaPreview />);
