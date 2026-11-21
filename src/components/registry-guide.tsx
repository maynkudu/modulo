"use client";

import { LiquidCode } from "@/components/liquid-documentation";
import { InstallCommand } from "./install-command";
import { RegistryConfiguration } from "./registry-configuration";
import styles from "@/app/(site)/page.module.css";

export function RegistryGuide() {
  return (
    <div className={styles.grid}>
      <section className={`${styles.panel} ${styles.install}`}>
        <h2>Install a component</h2>
        <InstallCommand />
        <p>The CLI copies the selected component and its supporting files into your project. Requirements are listed on each component page.</p>
      </section>
      <section className={`${styles.panel} ${styles.api}`}>
        <h2>Configure the registry</h2>
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
