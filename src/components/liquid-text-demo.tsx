"use client";

import { useState } from "react";
import { collectionStatementText } from "@/lib/collection-statement-text";
import { LiquidTextReveal } from "@/registry/liquid-text-reveal/LiquidTextReveal";
import styles from "./liquid-text-demo.module.css";

const colors = [
  { name: "Red", value: "#ff0000" },
  { name: "Burgundy", value: "#a50d3e" },
  { name: "Blue", value: "#334dce" },
  { name: "Green", value: "#1c7747" },
];

/** Demonstrates the collection statement's liquid text reveal. */
export function LiquidTextDemo() {
  const [color, setColor] = useState(colors[0].value);
  return <main className={styles.page} id="demo-top">
    <header className={styles.controls}>
      <a href="/components/liquid-text-reveal">Component details</a>
      <fieldset className={styles.colors}>
        <legend>Liquid color</legend>
        {colors.map(({ name, value }) => <label key={value}>
          <input type="radio" name="liquid-color" value={value} checked={color === value} onChange={() => setColor(value)} />
          <span className={styles.choice}><span className={styles.swatch} style={{ backgroundColor: value }} aria-hidden="true" />{name}</span>
        </label>)}
      </fieldset>
    </header>
    <section className={styles.intro}><h1>Liquid Text Reveal</h1><a href="#sample">Scroll to the reveal</a></section>
    <section className={styles.sample} id="sample">
      <LiquidTextReveal as="h2" className={styles.heading} text={collectionStatementText} color={color} profile="studio" revealMode="scroll" />
    </section>
    <footer className={styles.end}><a href="#demo-top">Back to top</a></footer>
  </main>;
}
