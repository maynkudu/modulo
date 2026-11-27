"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ComponentMedia } from "@/lib/catalog";
import { entranceCompleteEvent } from "@/lib/site-entrance";
import styles from "./catalog-index.module.css";

/** Keeps the poster in place until the selected, visible clip has a presented frame. */
export function CatalogPreviewMedia({ thumbnail, video, active }: {
  thumbnail: Pick<ComponentMedia["thumbnail"], "src" | "width" | "height">;
  video: Pick<ComponentMedia["video"], "src" | "width" | "height">;
  active: boolean;
}) {
  const slot = useRef<HTMLSpanElement>(null);
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = slot.current;
    const clip = player.current;
    if (!active || !container || !clip) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let failed = false;
    let request = 0;
    let videoFrame: number | undefined;
    let paintFrame: number | undefined;

    function canPlay() {
      const entrance = document.documentElement.dataset.entrance;
      return !disposed && visible && !document.hidden && !motion.matches && !failed && entrance !== "pending" && entrance !== "revealing";
    }

    function cancelFrame() {
      if (videoFrame !== undefined) clip?.cancelVideoFrameCallback(videoFrame);
      if (paintFrame !== undefined) cancelAnimationFrame(paintFrame);
      videoFrame = undefined;
      paintFrame = undefined;
    }

    function stop() {
      request++;
      cancelFrame();
      clip?.pause();
      container?.removeAttribute("data-video-ready");
    }

    function updatePlayback() {
      if (!clip || !container) return;
      if (!canPlay()) { stop(); return; }
      if (!clip.getAttribute("src")) clip.src = video.src;
      clip.muted = true;
      const current = ++request;
      cancelFrame();
      void clip.play().then(() => {
        if (current !== request) return;
        if (!canPlay()) { clip.pause(); return; }
        const reveal = () => {
          if (canPlay() && current === request) container.dataset.videoReady = "true";
        };
        if (typeof clip.requestVideoFrameCallback === "function") {
          videoFrame = clip.requestVideoFrameCallback(reveal);
        } else {
          paintFrame = requestAnimationFrame(reveal);
        }
      }).catch(() => {
        if (current === request) container.removeAttribute("data-video-ready");
      });
    }

    function videoFailed() {
      failed = true;
      stop();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      updatePlayback();
    }, { threshold: 0.01 });
    observer.observe(container);
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    document.addEventListener(entranceCompleteEvent, updatePlayback);
    clip.addEventListener("error", videoFailed);

    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      document.removeEventListener(entranceCompleteEvent, updatePlayback);
      clip.removeEventListener("error", videoFailed);
      stop();
      clip.removeAttribute("src");
      clip.load();
    };
  }, [active, video.src]);

  return <span ref={slot} className={styles.artSlot} aria-hidden="true" data-modulo-entrance-target={active || undefined}>
    <Image src={thumbnail.src} alt="" width={thumbnail.width} height={thumbnail.height}
      loading={active ? "eager" : "lazy"} fetchPriority={active ? "high" : "auto"} unoptimized
      data-modulo-entrance-image={active || undefined} />
    <video ref={player} width={video.width} height={video.height} poster={thumbnail.src}
      muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} />
  </span>;
}
