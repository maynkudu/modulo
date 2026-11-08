"use client";

import { useState } from "react";
import { RegistryConfiguration } from "./registry-configuration";
import styles from "@/app/page.module.css";

export function InstallCommand({ name = "interactive-art" }: { name?: string }) {
  const [runner, setRunner] = useState<"bunx" | "npx">("bunx");
  const command = `${runner} shadcn@latest add @modulo/${name}`;
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <details className={styles.details}><summary>Registry setup</summary><RegistryConfiguration /></details>
      <div role="group" aria-label="Installation command" className={styles.commandRunners}>
        {(["bunx", "npx"] as const).map((value) => (
          <button key={value} type="button" aria-pressed={runner === value} onClick={() => {
            setRunner(value);
            setStatus("idle");
          }}>{value === "bunx" ? "Bun" : "npx"}</button>
        ))}
      </div>
      <pre><code>{command}</code></pre>
      <button type="button" onClick={copy}>
        {status === "copied" ? "Copied" : "Copy command"}
      </button>
      <p role="status">
        {status === "failed"
          ? "Clipboard access is unavailable. Select and copy the command above."
          : status === "copied" ? "Command copied." : "Requires an active Modulo key and a project configured for shadcn."}
      </p>
    </>
  );
}
