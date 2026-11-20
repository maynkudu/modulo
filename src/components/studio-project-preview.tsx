"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

/** Plays the project clip on mouse hover or keyboard focus and retains its still image. */
export function StudioProjectPreview({ href, className, mediaClassName, clip, still, caption }: {
  href: string; className: string; mediaClassName: string; clip: string; still: ReactNode; caption: ReactNode;
}) {
  const link = useRef<HTMLAnchorElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const revision = useRef(0);

  function stop() {
    revision.current++;
    video.current?.pause();
    link.current?.removeAttribute("data-playing");
  }

  async function play() {
    const player = video.current;
    const anchor = link.current;
    if (!player || !anchor || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!player.getAttribute("src")) player.src = clip;
    const requested = ++revision.current;
    try {
      await player.play();
      if (revision.current === requested && anchor.matches(":hover, :focus-visible")) anchor.dataset.playing = "";
    } catch { /* The still stays visible if the clip cannot play. */ }
  }

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const player = video.current;
    motion.addEventListener("change", stop);
    return () => { motion.removeEventListener("change", stop); player?.pause(); };
  }, []);

  return <Link ref={link} href={href} className={className}
    onPointerEnter={event => { if (event.pointerType === "mouse") void play(); }}
    onPointerLeave={() => { if (!link.current?.matches(":focus-visible")) stop(); }}
    onFocus={event => { if (event.currentTarget.matches(":focus-visible")) void play(); }}
    onBlur={() => { if (!link.current?.matches(":hover")) stop(); }}>
    <div className={mediaClassName}>{still}<video ref={video} muted loop playsInline preload="none" aria-hidden="true" /></div>
    {caption}
  </Link>;
}
