"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { GardenCanvas, type GardenController } from "@/registry/interactive-art/examples/GardenCanvas";
import styles from "./component-gallery.module.css";

const views = [
  { name: "daylight", time: 34, seed: 1486, ratio: "4 / 5" },
  { name: "sunset", time: 70, seed: 1486, ratio: "3 / 2" },
  { name: "moonlight", time: 102, seed: 786, ratio: "1 / 1" },
  { name: "new growth", time: 14, seed: 2120, ratio: "4 / 3" },
  { name: "night", time: 102, seed: 1486, ratio: "4 / 3" },
  { name: "morning", time: 22, seed: 786, ratio: "4 / 5" },
  { name: "golden hour", time: 62, seed: 2120, ratio: "3 / 2" },
  { name: "blue hour", time: 86, seed: 1789, ratio: "1 / 1" },
  { name: "buds", time: 8, seed: 1486, ratio: "1 / 1" },
  { name: "blossoms", time: 54, seed: 2120, ratio: "4 / 3" },
  { name: "dusk", time: 76, seed: 786, ratio: "4 / 5" },
  { name: "first light", time: 118, seed: 1789, ratio: "3 / 2" },
] as const;

const columns = [views.slice(0, 4), views.slice(4, 8), views.slice(8, 12)];
const depths = [-0.55, 0.35, -1];

export function ComponentGallery() {
  const gallery = useRef<HTMLElement>(null);
  const gardens = useRef<(GardenController | null)[]>([]);
  const activeGarden = useRef<GardenController | null>(null);
  const readyCallbacks = useMemo(() => views.map((_, index) => (garden: GardenController | null) => {
    if (!garden && activeGarden.current === gardens.current[index]) activeGarden.current = null;
    gardens.current[index] = garden;
  }), []);

  function activate(index: number) {
    const garden = gardens.current[index];
    if (!garden || activeGarden.current === garden) return;
    activeGarden.current?.pause();
    activeGarden.current = garden;
    garden.resume();
  }

  function deactivate(index: number) {
    if (activeGarden.current !== gardens.current[index]) return;
    activeGarden.current?.pause();
    activeGarden.current = null;
  }

  useEffect(() => {
    const root = gallery.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      Array.from(root.children).forEach((column, index) => {
        gsap.to(column, {
          y: () => Math.min(root.clientHeight * 0.08, 160) * depths[index],
          ease: "none",
          scrollTrigger: { trigger: root, start: 0, end: "max", scrub: true, invalidateOnRefresh: true },
        });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => motion.revert();
  }, []);

  return (
    <section ref={gallery} className={styles.gallery} aria-label="Component gallery">
      {columns.map((column, index) => (
        <div key={index} className={styles.column}>
          {column.map((view, row) => (
            <article key={view.name} className={styles.tile} style={{ aspectRatio: view.ratio }}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") activate(index * 4 + row); }}
              onPointerLeave={() => deactivate(index * 4 + row)}
              onFocus={() => activate(index * 4 + row)} onBlur={() => deactivate(index * 4 + row)}>
              <div className={styles.preview} aria-hidden="true" inert>
                <GardenCanvas className={styles.scene} initialTime={view.time} seed={view.seed}
                  timeScale={0.2} wind={0.5} paused onReady={readyCallbacks[index * 4 + row]}
                  fallback="/artwork/lotus-garden.png" />
              </div>
              <Link className={styles.tileLink} href="/components/interactive-art"
                aria-label={`Open Interactive art, ${view.name} preview`} />
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}
