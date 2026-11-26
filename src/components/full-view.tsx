"use client";

import { useId, useRef, type ReactNode } from "react";
import { LiquidScrollbar } from "@/registry/liquid-animations/LiquidScrollbar";
import { GardenCanvas } from "@/registry/interactive-art/examples/GardenCanvas";
import { Nilkamal } from "@/registry/nilkamal/Nilkamal";
import { Diwali26 } from "@/registry/diwali-26/Diwali26";
import { RootInfection } from "@/registry/root-infection/RootInfection";
import { TexturedGlass } from "@/registry/textured-glass/TexturedGlass";
import { ElasticSliderDemo } from "./elastic-slider-demo";
import { SnapRailDemo } from "./snap-rail-demo";
import { LiquidClusterDemo } from "./liquid-cluster-demo";
import { LiquidAnimationsDemo } from "./liquid-animations-demo";
import { LogoRefractionDemo } from "./logo-refraction-demo";
import { OverlayNavigationDemo } from "./overlay-navigation-demo";
import { LiquidTextDemo } from "./liquid-text-demo";
import { MultiStepDownloadDemo } from "./multi-step-download-demo";
import { InlineDownloadDemo } from "./inline-download-demo";
import { StateButtonsDemo } from "./state-buttons-demo";
import { EyeSpiceDemo } from "./eyespice-demo";
import { PortraitWaveDemo } from "./portrait-wave-demo";
import { HalftoneDemo } from "./halftone-demo";
import { BrickNoiseDemo } from "./brick-noise-demo";
import { ImageMosaicDemo } from "./image-mosaic-demo";
import { DotOrbDemo } from "./dot-orb-demo";
import { previewCatalogItems as catalogItems } from "@/lib/catalog";
import styles from "./full-view.module.css";

type ComponentName = (typeof catalogItems)[number]["component"]["name"];
const views = {
  "dot-orb": () => <div className={styles.controls}><DotOrbDemo /></div>,
  "image-mosaic": () => <div className={styles.controls}><ImageMosaicDemo /></div>,
  "halftone": () => <div className={styles.controls}><HalftoneDemo /></div>,
  "eyespice": () => <div className={styles.controls}><EyeSpiceDemo /></div>,
  "portrait-wave": () => <div className={styles.controls}><PortraitWaveDemo /></div>,
  "brick-noise": () => <div className={styles.controls}><BrickNoiseDemo /></div>,
  "multi-step-download": () => <div className={styles.controls}><MultiStepDownloadDemo /></div>,
  "inline-download": () => <div className={styles.controls}><InlineDownloadDemo /></div>,
  "state-buttons": () => <div className={styles.controls}><StateButtonsDemo /></div>,
  "overlay-navigation": () => <OverlayNavigationDemo full />,
  "interactive-art": () => <GardenCanvas className={styles.scene} fallback="/artwork/lotus-garden.png" />,
  "nilkamal": () => <Nilkamal className={styles.scene} fallback="/artwork/nilkamal.png" />,
  "diwali-26": () => <Diwali26 className={styles.scene} fallback="/artwork/diwali-26.png" />,
  "root-infection": () => <RootInfection className={styles.scene} />,
  "textured-glass": () => <TexturedGlass className={styles.scene} src="/artwork/stay.jpeg" depthMap="/artwork/stay-depth.png" alt="A photograph through textured glass" />,
  "elastic-slider": () => <div className={styles.controls}><ElasticSliderDemo /></div>,
  "snap-rail": () => <div className={styles.controls}><SnapRailDemo /></div>,
  "liquid-cluster": () => <div className={styles.controls}><LiquidClusterDemo /></div>,
  "liquid-animations": () => <div className={styles.controls}><LiquidAnimationsDemo /></div>,
  "logo-refraction": () => <div className={styles.controls}><LogoRefractionDemo /></div>,
  "liquid-text-reveal": LiquidTextDemo,
} satisfies Record<ComponentName, () => ReactNode>;

export function FullView({ name }: { name: ComponentName }) {
  const id = useId(), viewport = useRef<HTMLElement>(null);
  const View = views[name];
  if (name === "liquid-text-reveal") return <View />;
  const control = name === "elastic-slider" || name === "snap-rail" || name === "liquid-cluster" || name === "multi-step-download" || name === "inline-download" || name === "state-buttons";
  const scrollable = control || name === "dot-orb" || name === "image-mosaic" || name === "halftone" || name === "portrait-wave" || name === "eyespice" || name === "brick-noise" || name === "logo-refraction" || name === "liquid-animations";
  return <div className={styles.frame}>
    <main ref={viewport} id={id} className={`${styles.viewport} ${scrollable ? "liquid-scroll-viewport" : ""} ${control ? styles.controlViewport : ""} ${name === "logo-refraction" ? styles.logoViewport : ""} ${name === "liquid-animations" || name === "dot-orb" ? styles.liquidViewport : ""} ${name === "image-mosaic" ? styles.mosaicViewport : ""}`}><View /></main>
    {scrollable && <LiquidScrollbar viewport={viewport} controls={id} />}
  </div>;
}
