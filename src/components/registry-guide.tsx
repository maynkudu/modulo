"use client";

import { useSyncExternalStore } from "react";
import { InstallCommand } from "./install-command";
import styles from "@/app/page.module.css";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "<registry-url>";

export function RegistryGuide() {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  return (
    <div className={styles.grid}>
      <section className={`${styles.panel} ${styles.install}`}>
        <h2>Install a component</h2>
        <InstallCommand />
        <p>Shadcn copies the source files into your project. The garden requires React and Canvas 2D.</p>
      </section>
      <section className={`${styles.panel} ${styles.api}`}>
        <h2>Use @modulo</h2>
        <p>Add the registry once, then install by name.</p>
        <pre><code>{`bunx shadcn@latest registry add '@modulo=${origin}/r/{name}.json'\n\nbunx shadcn@latest add @modulo/interactive-art`}</code></pre>
        <p>For npm projects, use <code>npx</code> in place of <code>bunx</code>.</p>
        <a href="/r/registry.json">Registry catalog</a>
        <a href="/r/interactive-art.json">Interactive art manifest</a>
        <a href="/r/root-infection.json">Root Infection manifest</a>
      </section>
    </div>
  );
}
