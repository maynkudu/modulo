"use client";

import { useEffect, useSyncExternalStore } from "react";
import { closeSounds, playSound, setSoundEnabled, soundEnabled, subscribeToSound, suspendSounds } from "@/lib/interface-sounds";

const enabledOnServer = () => true;

export function SoundToggle({ className }: { className?: string }) {
  const enabled = useSyncExternalStore(subscribeToSound, soundEnabled, enabledOnServer);
  return (
    <button type="button" className={className} data-sound-toggle
      aria-label={enabled ? "Mute interface sounds" : "Unmute interface sounds"}
      aria-pressed={enabled} onClick={() => setSoundEnabled(!enabled)}>
      Sound {enabled ? "on" : "off"}
    </button>
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
      if (!control || control.matches("[data-sound-toggle], [data-festival-feedback], :disabled")) return;
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
      if (!button || button.matches(":disabled, [data-scene-object], [data-festival-feedback]")) return;
      if (event.relatedTarget instanceof Node && button.contains(event.relatedTarget)) return;
      playSound("hover");
    }, { signal });
    document.addEventListener("input", (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.type === "range") {
        const position = (input.valueAsNumber - Number(input.min)) / (Number(input.max) - Number(input.min));
        playSound("slide", position);
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
      playSound("slide", Math.min(1, distance / 80));
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
