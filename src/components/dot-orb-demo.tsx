"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DotOrb } from "@/registry/dot-orb/DotOrb";
import type { DotOrbController } from "@/registry/dot-orb/dot-orb-engine";
import { AudioInputSession, type AudioInputState } from "@/registry/dot-orb/audio-input-session";
import { PreviewButton } from "./preview-controls";
import { DemoPanel, DemoRange, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import styles from "./dot-orb-demo.module.css";

function subscribeMotion(notify: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const getMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerMotion = () => false;
function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

/** The public demo owns audio sources. The installable orb only draws their analyser. */
export function DotOrbDemo() {
  const [state, setState] = useState<AudioInputState>({ kind: "idle" });
  const [error, setError] = useState("");
  const [color, setColor] = useState("#8792ff");
  const [sensitivity, setSensitivity] = useState(1.2);
  const [interaction, setInteraction] = useState(1);
  const [reduced, setReduced] = useState(false);
  const systemReduced = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion);
  const controller = useRef<DotOrbController | null>(null);
  const session = useRef<AudioInputSession | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const seek = useRef<HTMLInputElement>(null);
  const time = useRef<HTMLOutputElement>(null);
  const meter = useRef<HTMLMeterElement>(null);
  const onReady = useCallback((value: DotOrbController | null) => { controller.current = value; }, []);
  const onError = useCallback((message: string) => setError(message), []);

  useEffect(() => {
    const input = new AudioInputSession({
      onState: setState,
      onAnalyser: analyser => controller.current?.setAnalyser(analyser),
      onTime: (current, duration) => {
        if (seek.current) { seek.current.max = String(duration || 1); seek.current.value = String(current); }
        if (time.current) time.current.value = `${formatTime(current)} / ${formatTime(duration)}`;
      },
    });
    session.current = input;
    const timer = window.setInterval(() => {
      if (meter.current) meter.current.value = controller.current?.getSnapshot().level ?? 0;
    }, 100);
    return () => { window.clearInterval(timer); input.dispose(); session.current = null; };
  }, []);

  useEffect(() => {
    const snapshot = session.current?.getSnapshot();
    if (time.current) time.current.value = `${formatTime(snapshot?.currentTime ?? 0)} / ${formatTime(snapshot?.duration ?? 0)}`;
    if (seek.current) seek.current.value = String(snapshot?.currentTime ?? 0);
  }, [state]);

  function reset() {
    session.current?.clearInput();
    controller.current?.resetInteraction();
    setError(""); setColor("#8792ff"); setSensitivity(1.2); setInteraction(1); setReduced(false);
  }
  function replay() {
    if (state.kind === "file") { session.current?.seek(0); void session.current?.playFile(); }
    else controller.current?.ripple();
  }
  const menu = [
    { kind: "action", label: state.kind === "file" ? "Replay audio" : "Send a ripple", onClick: replay },
    { kind: "action", label: "Stop audio", onClick: () => session.current?.stop() },
    { kind: "action", label: "Reset", onClick: reset },
  ] satisfies DemoMenuEntry[];
  const micBusy = state.kind === "requesting-microphone";
  const micActive = state.kind === "microphone";
  const file = state.kind === "file" ? state : null;
  const status = micBusy ? "Waiting for microphone permission."
    : micActive ? "Microphone active. Speak to move the dots."
    : file?.status === "playing" ? "Playing audio."
    : file?.status === "ended" ? "Playback finished."
    : file ? "Audio ready."
    : "Hover over the dots, or tap to send a ripple.";

  return <section className={styles.preview} aria-label="Dot orb preview">
    <DemoSurface className={styles.stage} label="Dot orb interaction" menu={menu}>
      <div className={styles.visualizer}><DotOrb color={color} sensitivity={sensitivity} interaction={interaction}
        reducedMotion={reduced || systemReduced} onReady={onReady} onError={onError} /></div>
      <div className={styles.audioControls}>
        <div className={styles.sourceButtons}>
          <PreviewButton aria-pressed={micActive} onClick={() => {
            setError("");
            if (micActive || micBusy) session.current?.stop();
            else void session.current?.useMicrophone();
          }}>{micBusy ? "Cancel microphone" : micActive ? "Stop microphone" : "Use microphone"}</PreviewButton>
          <PreviewButton onClick={() => fileInput.current?.click()}>Choose audio</PreviewButton>
          <input ref={fileInput} className={styles.fileInput} type="file" accept="audio/*,.m4a,.flac,.ogg,.wav,.mp3"
            aria-label="Choose an audio file" onChange={event => {
              const selected = event.currentTarget.files?.[0];
              if (!selected) return;
              try { session.current?.loadFile(selected); setError(""); }
              catch (failure) { setError(failure instanceof Error ? failure.message : "The audio file could not load."); }
              event.currentTarget.value = "";
            }} />
        </div>
        {file && <div className={styles.player}>
          <div className={styles.fileHeading}><span title={file.name}>{file.name}</span><output ref={time} aria-live="off" /></div>
          <div className={styles.transport}>
            <PreviewButton onClick={() => file.status === "playing" ? session.current?.pauseFile() : void session.current?.playFile()}>
              {file.status === "playing" ? "Pause" : file.status === "ended" ? "Replay audio" : "Play"}
            </PreviewButton>
            <input ref={seek} type="range" aria-label="Audio position" min={0} max={file.duration || 1} step={.01}
              defaultValue={0} disabled={!file.duration} onInput={event => session.current?.seek(Number(event.currentTarget.value))} />
          </div>
        </div>}
        <div className={styles.stateRow}>
          {state.kind !== "error" && <p role="status">{status}</p>}
          <meter ref={meter} min={0} max={1} value={0} aria-label="Audio input level" />
        </div>
        {(error || state.kind === "error") && <p className={styles.error} role="alert">{error || (state.kind === "error" ? state.message : "")}</p>}
        <p className={styles.privacy}>Audio stays in your browser.</p>
      </div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={replay} onReset={reset}>
      <DemoRange label="Sensitivity" min={.25} max={3} step={.05} value={sensitivity}
        onValueChange={setSensitivity} format={value => `${value.toFixed(1)}x`} />
      <DemoRange label="Interaction" min={0} max={1} step={.05} value={interaction}
        disabled={reduced || systemReduced} onValueChange={setInteraction} format={value => `${Math.round(value * 100)}%`} />
      <label className={styles.color}>Color<input type="color" aria-label="Orb color" value={color}
        onChange={event => setColor(event.currentTarget.value)} /></label>
      <DemoToggle label="Reduce motion" checked={reduced || systemReduced} onCheckedChange={setReduced} />
      {(reduced || systemReduced) && <p className={styles.motionNote}>Reduced motion keeps the dots still and uses color to show the audio level.{systemReduced ? " Your system preference is on." : ""}</p>}
    </DemoPanel>
  </section>;
}
