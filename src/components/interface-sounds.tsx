"use client";

import { useEffect, useId, useRef, useState } from "react";
import { closeSounds, playSound, setSoundEnabled, setSoundVolume, useSoundSettings, suspendSounds } from "@/lib/interface-sounds";
import styles from "./interface-sounds.module.css";

export function SoundControl({ className }: { className?: string }) {
  const { enabled, volume } = useSoundSettings();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const events = new AbortController();
    document.addEventListener("pointerdown", event => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }, { signal: events.signal });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }, { signal: events.signal });
    return () => events.abort();
  }, [open]);

  return (
    <div ref={root} className={`${styles.root} ${className ?? ""}`} data-sound-managed>
      <button ref={trigger} type="button" className={styles.trigger} aria-expanded={open} aria-controls={`${id}-panel`}
        onClick={() => { setOpen(!open); playSound("click"); }}>Sound {enabled && volume > 0 ? "on" : "off"}</button>
      {open && <section className={styles.panel} id={`${id}-panel`} aria-label="Sound settings">
        <h2>Sound</h2>
        <label htmlFor={`${id}-volume`}>Volume <output>{Math.round(volume * 100)}%</output></label>
        <input id={`${id}-volume`} type="range" min="0" max="1" step=".05" value={volume} onChange={event => { setSoundVolume(event.currentTarget.valueAsNumber); playSound("slide"); }} />
        <div className={styles.actions}>
          <button type="button" aria-pressed={!enabled} onClick={() => setSoundEnabled(!enabled)}>{enabled ? "Mute" : "Unmute"}</button>
          <button type="button" disabled={!enabled || volume === 0} onClick={() => playSound("click")}>Test sound</button>
        </div>
      </section>}
    </div>
  );
}

export function InterfaceSounds() {
  useEffect(() => {
    const events = new AbortController();
    const { signal } = events;
    let dragging: { pointer: number; x: number; y: number } | undefined;
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest("a, button, summary, input:not([type=range]), select, [role=button], [role=tab], [role=checkbox], [role=switch]");
      if (!control || control.matches("[data-festival-feedback], :disabled") || control.closest("[data-sound-managed]")) return;
      if (control.hasAttribute("data-scene-object") && event.detail !== 0) return;
      const before = control.getAttribute("aria-pressed");
      if (before === null) {
        playSound("click");
        return;
      }
      // React commits a discrete state change after the capture listener returns.
      setTimeout(() => {
        if (signal.aborted) return;
        const after = control.getAttribute("aria-pressed");
        playSound(before !== after && after !== null ? after === "true" ? "on" : "off" : "click");
      }, 0);
    }, { capture: true, signal });
    document.addEventListener("pointerover", (event) => {
      if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
      const button = event.target.closest("a, button, input, select, summary, [role=button], [role=tab], [role=checkbox], [role=switch], [data-haptic-hover]");
      if (!button || button.matches(":disabled, [data-scene-object], [data-festival-feedback]") || button.closest("[data-sound-managed]")) return;
      if (event.relatedTarget instanceof Node && button.contains(event.relatedTarget)) return;
      playSound("hover");
    }, { signal });
    document.addEventListener("input", (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.type === "range") {
        if (!input.closest("[data-sound-managed]")) playSound("slide");
      } else if (input instanceof HTMLSelectElement) playSound("click");
    }, { capture: true, signal });
    document.addEventListener("pointerdown", (event) => {
      if (!(event.target instanceof Element)) return;
      const flower = event.target.closest("[data-scene-object]");
      if (flower && !flower.matches(":disabled")) {
        dragging = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
        playSound("click");
      }
    }, { capture: true, signal });
    document.addEventListener("pointermove", (event) => {
      if (dragging?.pointer !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y);
      if (distance < 8) return;
      dragging.x = event.clientX;
      dragging.y = event.clientY;
      playSound("slide");
    }, { signal });
    const release = () => { dragging = undefined; };
    document.addEventListener("pointerup", release, { signal });
    document.addEventListener("pointercancel", release, { signal });
    document.addEventListener("lostpointercapture", release, { signal });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { release(); suspendSounds(); }
    }, { signal });
    return () => { events.abort(); closeSounds(); };
  }, []);
  return null;
}
