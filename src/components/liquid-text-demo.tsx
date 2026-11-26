"use client";

import { useState } from "react";
import { LiquidTextReveal } from "@/registry/liquid-text-reveal/LiquidTextReveal";
import styles from "./liquid-text-demo.module.css";

const colors = [
  { name: "Red", value: "#ff0000" },
  { name: "Burgundy", value: "#a50d3e" },
  { name: "Blue", value: "#334dce" },
  { name: "Green", value: "#1c7747" },
];

const paragraphs = [
  "Light studies at his desk while L and his father watch through hidden cameras.",
  "Inside a bag of potato chips, a miniature television supplies the news. Light secretly writes the reported criminals' names on a scrap of the Death Note while his visible hand keeps doing homework.",
  '"I\'ll take a potato chip... and eat it!"',
  "To the cameras, it is an ordinary study break. The killings continue, and the surveillance fails to expose him.",
];

/** Demonstrates a reversible liquid reveal across a scrolling reading page. */
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
    <section className={styles.intro}><h1>Liquid Text Reveal</h1><a href="#sample">Scroll to read</a></section>
    <article className={styles.sample} id="sample" aria-label="Death Note potato chip scene summary">
      {paragraphs.map(paragraph => <LiquidTextReveal key={paragraph} as="p" className={styles.paragraph} text={paragraph} color={color} profile="studio" revealMode="scroll" />)}
    </article>
    <footer className={styles.end}><p>Death Note, episode 8. Scene summary.</p><a href="#demo-top">Back to top</a></footer>
  </main>;
}
