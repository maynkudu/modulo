"use client";

import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { catalogItems } from "@/lib/catalog";
import styles from "./component-gallery.module.css";

const depths = [-0.55, 0.35, -1];
const items = catalogItems.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt));
const columns = depths.map((_, column) => items.filter((_, index) => index % depths.length === column));
const thumbnailSizes = "(max-width: 760px) calc((100vw - 52px) / 3), (max-width: 1050px) calc((100vw - 80px) / 3), (max-width: 1344px) calc((100vw - 96px) / 3), 416px";

function subscribeToMotion(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeToVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

function pageVisible() {
  return document.visibilityState !== "hidden";
}

const noReducedMotionOnServer = () => false;
const visibleOnServer = () => true;

function ComponentTile({ item, canAnimate, eager }: {
  item: (typeof catalogItems)[number];
  canAnimate: boolean;
  eager: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failed, setFailed] = useState(false);
  const { component, media } = item;
  const playing = canAnimate && !failed && (hovered || focused);

  return <article className={styles.tile}
    style={{ aspectRatio: component.name === "interactive-art" ? "1 / 1" : "4 / 3" }}
    aria-labelledby={`preview-${component.name}`}
    onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
    <h2 className="sr-only" id={`preview-${component.name}`}>{component.title}</h2>
    <div className={styles.preview}>
      <Image className={styles.scene} src={media.thumbnail.src} alt={media.thumbnail.alt}
        fill sizes={thumbnailSizes} loading={eager ? "eager" : "lazy"} />
      {playing && <Image className={`${styles.scene} ${styles.animation}`} src={media.animation.src}
        alt="" aria-hidden="true" fill sizes={thumbnailSizes} unoptimized loading="eager" onError={() => setFailed(true)} />}
    </div>
    <Link className={styles.tileLink} href={`/components/${component.name}`} aria-label={`Open ${component.title}`} />
  </article>;
}

export function ComponentGallery() {
  const gallery = useRef<HTMLElement>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, reducedMotion, noReducedMotionOnServer);
  const visible = useSyncExternalStore(subscribeToVisibility, pageVisible, visibleOnServer);

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
          {column.map((item, row) => (
            <ComponentTile key={item.component.name} item={item} eager={row === 0} canAnimate={!reduced && visible} />
          ))}
        </div>
      ))}
    </section>
  );
}
