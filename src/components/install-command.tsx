"use client";

import { useState, useSyncExternalStore } from "react";
import styles from "@/app/page.module.css";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "<registry-url>";

export function InstallCommand() {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const [runner, setRunner] = useState<"bunx" | "npx">("bunx");
  const command = `${runner} shadcn@latest add ${origin}/r/interactive-art.json`;
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
          : status === "copied" ? "Command copied." : "Run from a project configured for shadcn."}
      </p>
    </>
  );
}
