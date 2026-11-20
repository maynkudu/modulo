"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { LiquidButton, LiquidPopover } from "@/registry/liquid-animations/LiquidControls";
import { LiquidSlider } from "@/registry/liquid-animations/LiquidSlider";
import { closeSounds, playSound, setSoundEnabled, setSoundEqualizerBand, setSoundVolume, useSoundSettings, suspendSounds } from "@/lib/interface-sounds";
import styles from "./interface-sounds.module.css";

function SpeakerIcon({ enabled, volume }: { enabled: boolean; volume: number }) {
  const level = !enabled || volume === 0 ? "muted" : volume < .45 ? "low" : volume < .8 ? "medium" : "high";
  return <svg className={styles.icon} data-level={level} viewBox="0 0 32 32" aria-hidden="true">
    <path className={styles.speaker} d="M5 13h5l7-6v18l-7-6H5z" />
    <path className={styles.wave} data-wave="one" d="M21 12.5c1.7 1.8 1.7 5.2 0 7" />
    <path className={styles.wave} data-wave="two" d="M24.5 9c3.5 3.7 3.5 10.3 0 14" />
    <path className={styles.wave} data-wave="three" d="M27.5 5.5c5.4 5.8 5.4 15.2 0 21" />
    <path className={styles.mute} d="M22 12l7 8M29 12l-7 8" />
  </svg>;
}

export function SoundControl({ className, label, placement = "popover" }: { className?: string; label?: string; placement?: "popover" | "drawer" }) {
  const { enabled, volume, equalizer } = useSoundSettings();
  const [open, setOpen] = useState(false);
  const changeOpen = (next: boolean) => { setOpen(next); if (next) playSound("click"); };
  if (placement === "drawer") return <Dialog.Root open={open} onOpenChange={changeOpen}>
    <Dialog.Trigger className={`${styles.navTrigger} ${className ?? ""}`} aria-label={`${label ?? "Ambience"}, ${enabled && volume > 0 ? "on" : "muted"}`} data-sound-managed>
      <span className={styles.navLabel}><span>{label ?? "Ambience"}</span><span aria-hidden="true">{label ?? "Ambience"}</span></span>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.drawerBackdrop} />
      <Dialog.Popup className={styles.drawer} aria-labelledby="studio-ambience-title">
        <header className={styles.drawerHeader}>
          <div><Dialog.Title className={styles.drawerTitle} id="studio-ambience-title">Ambience</Dialog.Title></div>
          <Dialog.Close className={styles.drawerClose} aria-label="Close ambience settings"><span aria-hidden="true">×</span></Dialog.Close>
        </header>
        <section className={styles.drawerSection} aria-labelledby="effects-title">
          <h3 id="effects-title">Sound effects</h3>
          <label className={styles.switchRow}><input type="checkbox" checked={enabled} onChange={event => setSoundEnabled(event.currentTarget.checked)} data-sound-managed /><span>Interface sounds</span></label>
          <div className={styles.rangeRow}><label htmlFor="studio-sound-volume">Volume</label><input id="studio-sound-volume" type="range" min="0" max="1" step=".05" value={volume} onChange={event => setSoundVolume(Number(event.currentTarget.value))} /><output>{Math.round(volume * 100)}%</output></div>
          <button className={styles.soundTest} type="button" disabled={!enabled || volume === 0} onClick={() => playSound("click")} data-sound-managed>Test sound</button>
        </section>
        <section className={styles.drawerSection} aria-labelledby="equalizer-title">
          <h3 id="equalizer-title">Equalizer</h3>
          <p>Adjust the tone of interface sounds.</p>
          {(["low", "mid", "high"] as const).map(band => <div className={styles.rangeRow} key={band}>
            <label htmlFor={`studio-eq-${band}`}>{band[0].toUpperCase() + band.slice(1)}</label>
            <input id={`studio-eq-${band}`} type="range" min="-12" max="12" step="1" value={equalizer[band]} onChange={event => setSoundEqualizerBand(band, Number(event.currentTarget.value))} />
            <output>{equalizer[band] > 0 ? "+" : ""}{equalizer[band]} dB</output>
          </div>)}
        </section>
        <section className={styles.drawerSection} aria-labelledby="ambient-audio-title">
          <h3 id="ambient-audio-title">Ambient audio</h3>
          <p>Ambient tracks aren&apos;t connected yet.</p>
        </section>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;

  return <div className={`${styles.root} ${className ?? ""}`} data-sound-managed>
    <LiquidPopover label="Sound settings" open={open} onOpenChange={changeOpen} width={280}
      trigger={<LiquidButton className={styles.trigger} aria-label={`${label ? `${label}, ` : "Sound settings, "}${enabled && volume > 0 ? `${Math.round(volume * 100)} percent` : "muted"}`} aria-pressed={enabled && volume > 0}>{label ? <span className={styles.triggerLabel}>{label}</span> : null}<SpeakerIcon enabled={enabled} volume={volume} /></LiquidButton>}>
      <section className={styles.panel} data-sound-managed>
        <h2 data-liquid-item="">Ambience</h2>
        <div data-liquid-item="" data-liquid-paint="box">
          <LiquidSlider label="Volume" min={0} max={1} step={.05} value={volume} formatValue={value => `${Math.round(value * 100)}%`}
            onValueChange={value => { setSoundVolume(value); playSound("slide"); }} />
        </div>
        <div className={styles.actions} data-liquid-item="" data-liquid-paint="box">
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
