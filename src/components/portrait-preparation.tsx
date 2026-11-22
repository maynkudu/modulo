"use client";

import { useEffect, useRef, useState } from "react";
import { LiquidButton } from "@/registry/liquid-animations/LiquidControls";
import { portraitPreparationPrompt } from "@/lib/portrait-wave-content";
import styles from "./portrait-preparation.module.css";

/** Public preparation prompt with a clipboard action. No image generation or uploads. */
export function PortraitPreparation() {
  const [copied, setCopied] = useState(false), [error, setError] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(portraitPreparationPrompt);
      setCopied(true); setError(""); clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1600);
    } catch { setError("Clipboard access failed. Select and copy the prompt below."); }
  }
  return <div className={styles.prompt}>
    <LiquidButton onClick={() => void copy()} aria-label="Copy portrait preparation prompt">{copied ? "Copied" : "Copy prompt"}</LiquidButton>
    <textarea readOnly aria-label="Portrait preparation prompt" value={portraitPreparationPrompt} rows={14} />
    <span className="sr-only" role="status">{copied ? "Prompt copied." : ""}</span>
    {error && <p role="alert">{error}</p>}
  </div>;
}
