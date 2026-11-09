"use client";

import { Game2048, type Game2048Controller } from "@/registry/2048/Game2048";
import type { ReactNode } from "react";
import { GardenCanvas } from "@/registry/interactive-art/examples/GardenCanvas";
import { Nilkamal } from "@/registry/nilkamal/Nilkamal";
import { Diwali26 } from "@/registry/diwali-26/Diwali26";
import { RootInfection } from "@/registry/root-infection/RootInfection";
import { TexturedGlass } from "@/registry/textured-glass/TexturedGlass";
import { ElasticSliderDemo } from "./elastic-slider-demo";
import { SnapRailDemo } from "./snap-rail-demo";
import { LiquidClusterDemo } from "./liquid-cluster-demo";
import { catalogItems } from "@/lib/catalog";
import styles from "./full-view.module.css";

type ComponentName = (typeof catalogItems)[number]["component"]["name"];
function gameReady(game: Game2048Controller | null) {
  if (process.env.NODE_ENV === "development") {
    if (game) window.game2048 = game; else delete window.game2048;
  }
}
const views = {
  "2048": () => <Game2048 onReady={gameReady} />,
  "interactive-art": () => <GardenCanvas className={styles.scene} fallback="/artwork/lotus-garden.png" />,
  "nilkamal": () => <Nilkamal className={styles.scene} fallback="/artwork/nilkamal.png" />,
  "diwali-26": () => <Diwali26 className={styles.scene} fallback="/artwork/diwali-26.png" />,
  "root-infection": () => <RootInfection className={styles.scene} />,
  "textured-glass": () => <TexturedGlass className={styles.scene} src="/artwork/stay.jpeg" depthMap="/artwork/stay-depth.png" alt="A photograph through textured glass" />,
  "elastic-slider": () => <div className={styles.controls}><ElasticSliderDemo /></div>,
  "snap-rail": () => <div className={styles.controls}><SnapRailDemo /></div>,
  "liquid-cluster": () => <div className={styles.controls}><LiquidClusterDemo /></div>,
} satisfies Record<ComponentName, () => ReactNode>;

export function FullView({ name }: { name: ComponentName }) {
  const View = views[name];
  const control = name === "elastic-slider" || name === "snap-rail" || name === "liquid-cluster";
  return <main className={`${styles.viewport} ${name === "2048" ? styles.game : ""} ${control ? styles.controlViewport : ""}`}><View /></main>;
}
