"use client";

import { LiquidCode } from "@/components/liquid-documentation";
import { useState } from "react";
import { playSound } from "@/lib/interface-sounds";
import { RegistryConfiguration } from "./registry-configuration";
import { LiquidButton, LiquidDisclosure } from "@/registry/liquid-animations/LiquidControls";
import { LiquidTrack } from "@/registry/liquid-animations/LiquidTrack";
import styles from "./install-command.module.css";

const runners = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx" };

export function InstallCommand({ name = "interactive-art" }: { name?: string }) {
  const [runner, setRunner] = useState<keyof typeof runners>("bun");
  const command = runners[runner] + " shadcn@latest add @modulo/" + name;
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus("copied");
      playSound("copy");
    } catch { setStatus("failed"); }
  }

  return <>
    <div className={styles.command}>
      <div className={styles.runners} role="group" aria-label="Package runner">
        <LiquidTrack className={styles.runnerChoices}>
        {(["npm", "pnpm", "yarn", "bun"] as const).map(value => <button key={value} type="button" aria-pressed={runner === value} onClick={() => {
          setRunner(value);
          setStatus("idle");
        }}>{value}</button>)}
        </LiquidTrack>
        <LiquidButton className={styles.copy} data-sound-managed onClick={copy}>{status === "copied" ? "Copied" : "Copy"}</LiquidButton>
      </div>
      <LiquidCode className={styles.code}><code>{command}</code></LiquidCode>
    </div>
    <p role="status">{status === "failed" ? "Clipboard access is unavailable. Select and copy the command above." : status === "copied" ? "Command copied." : "Requires an active Modulo key and a project configured for shadcn."}</p>
    <LiquidDisclosure className={styles.setup} label="Registry setup"><RegistryConfiguration /></LiquidDisclosure>
  </>;
}
