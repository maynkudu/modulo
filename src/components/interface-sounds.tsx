"use client";

import { useEffect, useState } from "react";
import { LiquidButton, LiquidPopover } from "@/registry/liquid-animations/LiquidControls";
import { LiquidSlider } from "@/registry/liquid-animations/LiquidSlider";
import { closeSounds, playSound, setSoundEnabled, setSoundVolume, useSoundSettings, suspendSounds } from "@/lib/interface-sounds";
import styles from "./interface-sounds.module.css";

export function SoundControl({ className }: { className?: string }) {
  const { enabled, volume } = useSoundSettings();
  const [open, setOpen] = useState(false);
  return <div className={`${styles.root} ${className ?? ""}`} data-sound-managed>
    <LiquidPopover label="Sound settings" open={open} onOpenChange={next => { setOpen(next); if (next) playSound("click"); }} width={280}
      trigger={<LiquidButton className={styles.trigger}>Sound {enabled && volume > 0 ? "on" : "off"}</LiquidButton>}>
      <section className={styles.panel} data-sound-managed data-liquid-item="" data-liquid-paint="box">
        <h2>Sound</h2>
        <LiquidSlider label="Volume" min={0} max={1} step={.05} value={volume} formatValue={value => `${Math.round(value * 100)}%`}
          onValueChange={value => { setSoundVolume(value); playSound("slide"); }} />
        <div className={styles.actions}>
          <LiquidButton aria-pressed={!enabled} onClick={() => setSoundEnabled(!enabled)}>{enabled ? "Mute" : "Unmute"}</LiquidButton>
          <LiquidButton disabled={!enabled || volume === 0} onClick={() => playSound("click")}>Test sound</LiquidButton>
        </div>
      </section>
    </LiquidPopover>
  </div>;
}

export function InterfaceSounds() {
  useEffect(() => {
    const events = new AbortController();
    const { signal } = events;
    let dragging: { pointer: number; x: number; y: number } | undefined;
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest("a, button, summary, input:not([type=range]), select, [role=button], [role=tab], [role=checkbox], [role=switch], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=option]");
      if (!control || control.matches("[data-festival-feedback], :disabled, [aria-disabled=true], [data-disabled]") || control.closest("[data-sound-managed]")) return;
      if (control.hasAttribute("data-scene-object") && event.detail !== 0) return;
      const stateAttribute = control.hasAttribute("aria-checked") ? "aria-checked" : "aria-pressed";
      const before = control.getAttribute(stateAttribute);
      if (before === null) {
        playSound("click");
        return;
      }
      // React commits a discrete state change after the capture listener returns.
      setTimeout(() => {
        if (signal.aborted) return;
        const after = control.getAttribute(stateAttribute);
        playSound(before !== after && after !== null ? after === "true" ? "on" : "off" : "click");
      }, 0);
    }, { capture: true, signal });
    document.addEventListener("pointerover", (event) => {
      if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
      const button = event.target.closest("a, button, input, select, summary, [role=button], [role=tab], [role=checkbox], [role=switch], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=option], [data-haptic-hover]");
      if (!button || button.matches(":disabled, [aria-disabled=true], [data-disabled], [data-scene-object], [data-festival-feedback]") || button.closest("[data-sound-managed]")) return;
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
