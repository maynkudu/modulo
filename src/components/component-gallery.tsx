"use client";

import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { catalogItems } from "@/lib/catalog";
import styles from "./component-gallery.module.css";

const items = catalogItems.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt));
const depths = [-0.55, 0.35, -1];
const thumbnailSizes = "(max-width: 700px) calc((100vw - 52px) / 2), (max-width: 1000px) calc((100vw - 96px) / 2), (max-width: 1360px) calc((100vw - 112px) / 3), 416px";

function subscribeToColumns(notify: () => void) {
  const query = window.matchMedia("(max-width: 1000px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function galleryColumnCount() {
  return window.matchMedia("(max-width: 1000px)").matches ? 2 : 3;
}

const columnsOnServer = () => 3;

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
  const [videoReady, setVideoReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const { component, media } = item;
  const playing = canAnimate && (hovered || focused);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let active = true;
    if (playing && !failed) void player.play().catch(() => { if (active) setFailed(true); });
    else player.pause();
    return () => { active = false; player.pause(); };
  }, [playing, failed]);

  return <article className={styles.tile}
    data-component={component.name}
    style={{ aspectRatio: `${media.thumbnail.width} / ${media.thumbnail.height}` }}
    aria-labelledby={`preview-${component.name}`}
    onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
    <h2 className="sr-only" id={`preview-${component.name}`}>{component.title}</h2>
    <div className={styles.preview}>
      <Image className={styles.scene} src={media.thumbnail.src} alt={media.thumbnail.alt}
        fill sizes={thumbnailSizes} unoptimized loading={eager ? "eager" : "lazy"} />
      <video ref={video} className={`${styles.scene} ${styles.animation} ${playing && videoReady && !failed ? styles.playing : ""}`}
        src={media.video.src} muted loop playsInline preload="none" aria-hidden="true"
        onPlaying={() => setVideoReady(true)} onError={() => setFailed(true)} />
      {playing && failed && <Image className={styles.scene} src={media.animation.src} alt="" aria-hidden="true"
        fill sizes={thumbnailSizes} unoptimized loading="eager" />}
    </div>
    <Link className={styles.tileLink} href={`/components/${component.name}`} aria-label={`Open ${component.title}`} />
  </article>;
}

export function ComponentGallery() {
  const gallery = useRef<HTMLElement>(null);
  const columnCount = useSyncExternalStore(subscribeToColumns, galleryColumnCount, columnsOnServer);
  const columns = Array.from({ length: columnCount }, (_, column) => items.filter((_, index) => index % columnCount === column));
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
  }, [columnCount]);

  return (
    <section ref={gallery} className={styles.gallery} aria-label="Component gallery">
      {columns.map((column, index) => <div key={index} className={styles.column}>
        {column.map((item, row) => <ComponentTile key={item.component.name} item={item} eager={row === 0} canAnimate={!reduced && visible} />)}
      </div>)}
    </section>
  );
}
