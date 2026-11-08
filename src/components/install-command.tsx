"use client";

import { useState } from "react";
import { playSound } from "@/lib/interface-sounds";
import { RegistryConfiguration } from "./registry-configuration";
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
        {(["npm", "pnpm", "yarn", "bun"] as const).map(value => <button key={value} type="button" aria-pressed={runner === value} onClick={() => {
          setRunner(value);
          setStatus("idle");
        }}>{value}</button>)}
        <button type="button" className={styles.copy} data-sound-managed onClick={copy}>{status === "copied" ? "Copied" : "Copy"}</button>
      </div>
      <pre className={styles.code}><code>{command}</code></pre>
    </div>
    <p role="status">{status === "failed" ? "Clipboard access is unavailable. Select and copy the command above." : status === "copied" ? "Command copied." : "Requires an active Modulo key and a project configured for shadcn."}</p>
    <details className={styles.setup}><summary>Registry setup</summary><RegistryConfiguration /></details>
  </>;
}
