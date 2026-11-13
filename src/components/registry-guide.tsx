"use client";

import { LiquidCode } from "@/components/liquid-documentation";
import { InstallCommand } from "./install-command";
import { RegistryConfiguration } from "./registry-configuration";
import styles from "@/app/page.module.css";

export function RegistryGuide() {
  return (
    <div className={styles.grid}>
      <section className={`${styles.panel} ${styles.install}`}>
        <h2>Install a component</h2>
        <InstallCommand />
        <p>Shadcn copies the source files into your project. The garden requires React and Canvas 2D.</p>
      </section>
      <section className={`${styles.panel} ${styles.api}`}>
        <h2>Use @modulo</h2>
        <RegistryConfiguration />
        <LiquidCode><code>bunx shadcn@latest add @modulo/interactive-art</code></LiquidCode>
        <p>For npm projects, use <code>npx</code> in place of <code>bunx</code>.</p>
        <a href="/r/registry.json">Registry catalog</a>
        <a href="/r/interactive-art.json">Interactive art manifest</a>
        <a href="/r/root-infection.json">Root Infection manifest</a>
        <a href="/r/nilkamal.json">Nilkamal manifest</a>
      </section>
    </div>
  );
}
