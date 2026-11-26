export const dotOrbUsage = `"use client";

import { DotOrb } from "@/components/dot-orb/DotOrb";

export default function Example() {
  return <div style={{ height: 480 }}>
    <DotOrb color="#8792ff" sensitivity={1.2} interaction={1} />
  </div>;
}`;

export const dotOrbAudioUsage = `"use client";

import { useEffect, useRef, useState } from "react";
import { DotOrb } from "@/components/dot-orb/DotOrb";
import type { DotOrbController } from "@/components/dot-orb/dot-orb-engine";
import { AudioInputSession, type AudioInputState } from "@/components/dot-orb/audio-input-session";

export function AudioOrb() {
  const orb = useRef<DotOrbController | null>(null);
  const input = useRef<AudioInputSession | null>(null);
  const [state, setState] = useState<AudioInputState>({ kind: "idle" });
  const [error, setError] = useState("");

  useEffect(() => {
    const session = new AudioInputSession({
      onAnalyser: analyser => orb.current?.setAnalyser(analyser),
      onState: setState,
      onTime: () => {},
    });
    input.current = session;
    return () => { session.dispose(); input.current = null; };
  }, []);

  return <>
    <div style={{ height: 480 }}>
      <DotOrb onReady={controller => { orb.current = controller; }} onError={setError} />
    </div>
    <button onClick={() => void input.current?.useMicrophone()}>Use microphone</button>
    <button onClick={() => input.current?.stop()}>Stop</button>
    <input type="file" accept="audio/*" aria-label="Choose audio" onChange={event => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      try { input.current?.loadFile(file); setError(""); }
      catch (failure) { setError(failure instanceof Error ? failure.message : "Choose another audio file."); }
    }} />
    <button disabled={state.kind !== "file"} onClick={() => void input.current?.playFile()}>Play</button>
    <button disabled={state.kind !== "file"} onClick={() => input.current?.pauseFile()}>Pause</button>
    {(error || state.kind === "error") && <p role="alert">{error || (state.kind === "error" ? state.message : "")}</p>}
  </>;
}`;

export const dotOrbProps = [
  ["color", "string", '"#8792ff"', "Six-digit hex accent. Bright highlights stay white."],
  ["sensitivity", "number", "1.2", "Audio gain response, clamped from 0.25 to 3."],
  ["interaction", "number", "1", "Pointer attraction strength, from 0 to 1."],
  ["reducedMotion", "boolean", "false", "Keep geometry still and show audio through color. Pass the system preference from your application."],
  ["className", "string", "Optional", "Class for the canvas. Give its parent an explicit height."],
  ["onReady", "(controller | null) => void", "Optional", "Connect an AnalyserNode through setAnalyser. Also exposes ripple, resetInteraction and getSnapshot. Receives null on cleanup."],
  ["onError", "(message: string) => void", "Optional", "Canvas initialization failure."],
] satisfies readonly (readonly [string, string, string, string])[];
