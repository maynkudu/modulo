"use client";

import { useEffect, useState } from "react";
import { StateButton, type StateButtonAnimation, type StateButtonState, type StateButtonSurface } from "@/registry/state-buttons/StateButton";
import { DemoPanel, DemoRange, DemoSelect, DemoSurface, DemoToggle, type DemoMenuEntry } from "./demo-controls";
import styles from "./state-buttons-demo.module.css";

const stateOptions: { value: StateButtonState; label: string }[] = [
  { value: "idle", label: "Idle" },
  { value: "loading", label: "Loading" },
  { value: "thinking", label: "Thinking" },
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
  { value: "disabled", label: "Disabled" },
];

const animationOptions: { value: StateButtonAnimation; label: string }[] = [
  { value: "ripple", label: "Ripple" },
  { value: "orbit", label: "Orbit" },
  { value: "scan", label: "Scan" },
  { value: "wave", label: "Wave" },
  { value: "spark", label: "Spark" },
  { value: "breathe", label: "Breathe" },
];

const sizeOptions: { value: "sm" | "md" | "lg"; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const colorOptions = [
  { label: "Ember", value: "#ff4a3e" },
  { label: "Amber", value: "#ffb329" },
  { label: "Ice", value: "#77baff" },
  { label: "Mint", value: "#7fe0bb" },
  { label: "Violet", value: "#bba0ff" },
] as const;

const stateLabels: Record<StateButtonState, string> = {
  idle: "Continue",
  loading: "Loading",
  thinking: "Thinking",
  pending: "Pending",
  success: "Complete",
  error: "Try again",
  disabled: "Unavailable",
};

const exampleButtons: { state: "loading" | "thinking" | "pending"; animation: StateButtonAnimation }[] = [
  { state: "loading", animation: "orbit" },
  { state: "thinking", animation: "wave" },
  { state: "pending", animation: "scan" },
];

const demoTransitions: Partial<Record<StateButtonState, StateButtonState>> = {
  loading: "thinking",
  thinking: "pending",
  pending: "success",
};

/** Interactive preview for State Buttons. Its timed operation is a demo only. */
export function StateButtonsDemo() {
  const [state, setState] = useState<StateButtonState>("thinking");
  const [animation, setAnimation] = useState<StateButtonAnimation>("ripple");
  const [color, setColor] = useState<string>(colorOptions[0].value);
  const [size, setSize] = useState<"sm" | "md" | "lg">("lg");
  const [speed, setSpeed] = useState(1);
  const [glow, setGlow] = useState(0.65);
  const [surface, setSurface] = useState<StateButtonSurface>("dark");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    if (!demoRunning) return;

    const next = demoTransitions[state];
    if (!next) {
      return;
    }

    const timer = window.setTimeout(() => {
      setState(next);
      if (next === "success") setDemoRunning(false);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [demoRunning, state]);

  useEffect(() => {
    if (!demoRunning) return;
    function cancelWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDemoRunning(false);
        setState("idle");
      }
    }
    document.addEventListener("keydown", cancelWithEscape);
    return () => document.removeEventListener("keydown", cancelWithEscape);
  }, [demoRunning]);

  function stopDemo() {
    setDemoRunning(false);
  }

  function setManualState(next: StateButtonState) {
    stopDemo();
    setState(next);
  }

  function runDemo() {
    if (state === "disabled") return;
    if (demoRunning) {
      cancelDemo();
      return;
    }
    setDemoRunning(true);
    setState("loading");
  }

  function cancelDemo() {
    stopDemo();
    setState("idle");
  }

  function resetDemo() {
    stopDemo();
    setState("thinking");
    setAnimation("ripple");
    setColor(colorOptions[0].value);
    setSize("lg");
    setSpeed(1);
    setGlow(0.65);
    setSurface("dark");
    setReducedMotion(false);
  }

  const menu = [
    { kind: "action", label: demoRunning ? "Cancel demo" : "Run demo", onClick: demoRunning ? cancelDemo : runDemo, disabled: state === "disabled" },
    { kind: "action", label: "Reset", onClick: resetDemo },
    { kind: "toggle", label: "Reduce motion", checked: reducedMotion, onCheckedChange: setReducedMotion },
    { kind: "toggle", label: "Light surface", checked: surface === "light", onCheckedChange: checked => setSurface(checked ? "light" : "dark") },
  ] satisfies DemoMenuEntry[];

  return <>
    <DemoSurface className={styles.artwork} label="State buttons preview" menu={menu}>
      <div className={styles.stage} data-surface={surface}>
        <StateButton
          id="state-buttons-preview"
          state={state}
          label={stateLabels[state]}
          animation={animation}
          color={color}
          surface={surface}
          size={size}
          speed={speed}
          glow={glow}
          reducedMotion={reducedMotion}
          onClick={runDemo}
          onCancel={cancelDemo}
        />
        <div className={styles.states} role="group" aria-label="Button state">
          {stateOptions.map(option => <button
            key={option.value}
            type="button"
            aria-pressed={state === option.value}
            onClick={() => setManualState(option.value)}
          >{option.label}</button>)}
        </div>
        <div className={styles.examples} role="group" aria-label="Independent state and animation examples">
          {exampleButtons.map(example => <div className={styles.example} key={example.state}>
            <StateButton state={example.state} animation={example.animation} label={stateLabels[example.state]} size="sm" color={color} surface={surface} reducedMotion={reducedMotion} glow={glow} />
            <span>{animationOptions.find(option => option.value === example.animation)?.label}</span>
          </div>)}
        </div>
      </div>
    </DemoSurface>
    <DemoPanel menu={menu} onReplay={runDemo} onReset={resetDemo} replayDisabled={state === "disabled" || demoRunning}>
      <DemoSelect label="State" value={state} options={stateOptions} onValueChange={setManualState} />
      <DemoSelect label="Animation" value={animation} options={animationOptions} onValueChange={setAnimation} />
      <DemoSelect label="Size" value={size} options={sizeOptions} onValueChange={setSize} />
      <DemoRange label="Speed" min={0.25} max={2.5} step={0.05} value={speed} onValueChange={setSpeed} format={value => `${value.toFixed(2)}×`} />
      <DemoRange label="Glow" min={0} max={1} step={0.05} value={glow} onValueChange={setGlow} format={value => `${Math.round(value * 100)}%`} />
      <div className={styles.colorField}>
        <span>Accent</span>
        <div className={styles.swatches} role="group" aria-label="Accent color presets">
          {colorOptions.map(option => <button
              key={option.value}
              type="button"
              className={styles.swatch}
              style={{ backgroundColor: option.value }}
              aria-label={option.label}
              aria-pressed={color === option.value}
              onClick={() => setColor(option.value)}
            />)}
          <label className={styles.customColor}>
            <span>Custom</span>
            <input aria-label="Custom accent color" type="color" value={color} onChange={event => setColor(event.currentTarget.value)} />
          </label>
        </div>
      </div>
      <div className={styles.toggles}>
        <DemoToggle label="Reduce motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        <DemoToggle label="Light surface" checked={surface === "light"} onCheckedChange={checked => setSurface(checked ? "light" : "dark")} />
      </div>
      <p className={styles.status} role="status">{demoRunning ? `${stateLabels[state]} demo` : stateLabels[state]}</p>
    </DemoPanel>
  </>;
}
