"use client";

import { Fragment, useEffect, useId, useRef } from "react";
import styles from "./liquid-text-reveal.module.css";

type LiquidTextTag = "h1" | "h2" | "p";

type LiquidTextRevealProps = {
  /** Semantic tag for the single accessible text block. */
  as: LiquidTextTag;
  /** Text that resolves from a red liquid blur as the block enters the viewport. */
  text: string;
  className?: string;
};

const clampUnit = (value: number) => Math.min(1, Math.max(0, value));

/** Reveals words through the reference's red blur and SVG threshold effect as the page scrolls. */
export function LiquidTextReveal({ as: Tag, text, className }: LiquidTextRevealProps) {
  const rootRef = useRef<HTMLElement>(null);
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const elements = [...root.querySelectorAll<HTMLElement>("[data-liquid-word]")];
    const filters = elements.map((_, index) => ({
      filter: document.getElementById(`${prefix}-${index}`),
      blur: document.getElementById(`${prefix}-blur-${index}`),
      matrix: document.getElementById(`${prefix}-matrix-${index}`),
    }));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduced.matches) {
        elements.forEach((word) => {
          word.style.filter = "none";
          word.style.removeProperty("color");
        });
        return;
      }

      const bounds = root.getBoundingClientRect();
      const phone = window.innerWidth < 810;
      const progress = clampUnit(((phone ? 0.95 : 0.92) * window.innerHeight - bounds.top) /
        (bounds.height + window.innerHeight * (phone ? 0.35 : 0.47)));

      elements.forEach((word, index) => {
        const at = elements.length > 1 ? index / (elements.length - 1) * 0.78 : 0;
        const wordProgress = clampUnit((progress - at) / (elements.length > 1 ? 0.22 : 1));
        const fontSize = Number.parseFloat(getComputedStyle(word).fontSize);
        const maximum = Math.max(2, Math.min(40, fontSize * 0.2));
        const amount = maximum * Math.pow(1 - wordProgress, 1.6);
        if (amount < 0.25) {
          word.style.filter = "none";
          word.style.removeProperty("color");
          return;
        }

        const { filter, blur, matrix } = filters[index];
        const width = Math.max(1, word.offsetWidth);
        const height = Math.max(1, word.offsetHeight);
        const ratio = Math.min(0.42, 0.5 * Math.min(1, 0.19 + 5.3 / Math.max(amount * (40 / maximum), 0.01)));
        const alphaGain = 24 - 18 * Math.min(1, amount / maximum);
        const padding = maximum * 3;

        filter?.setAttribute("x", String(-padding / width));
        filter?.setAttribute("width", String(1 + 2 * padding / width));
        filter?.setAttribute("y", String(-padding / height));
        filter?.setAttribute("height", String(1 + 2 * padding / height));
        blur?.setAttribute("stdDeviation", amount.toFixed(2));
        matrix?.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaGain.toFixed(3)} ${(0.5 - alphaGain * ratio).toFixed(3)}`);
        word.style.filter = `url(#${prefix}-${index})`;
        word.style.color = `color-mix(in srgb, var(--coral) ${100 * Math.min(1, amount / (8 * maximum / 40))}%, currentColor)`;
      });
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    document.fonts.ready.then(schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [prefix]);

  const accessibleText = <>
    {words.map((word, index) => (
      <Fragment key={`${word}-${index}`}>
        <span className={styles.word} data-liquid-word="true" aria-hidden="true">{word}</span>
        {index < words.length - 1 ? " " : null}
      </Fragment>
    ))}
  </>;
  const attachRoot = (element: HTMLElement | null) => { rootRef.current = element; };

  return (
    <>
      <svg className={styles.filters} aria-hidden="true" focusable="false">
        <defs>
          {words.map((_, index) => (
            <filter id={`${prefix}-${index}`} key={index} colorInterpolationFilters="sRGB">
              <feGaussianBlur id={`${prefix}-blur-${index}`} in="SourceGraphic" result="blurred" stdDeviation="0" />
              <feColorMatrix id={`${prefix}-matrix-${index}`} in="blurred" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 0" />
            </filter>
          ))}
        </defs>
      </svg>
      {Tag === "h1" ? <h1 ref={attachRoot} className={`${styles.text} ${className ?? ""}`} aria-label={text}>{accessibleText}</h1> : null}
      {Tag === "h2" ? <h2 ref={attachRoot} className={`${styles.text} ${className ?? ""}`} aria-label={text}>{accessibleText}</h2> : null}
      {Tag === "p" ? <p ref={attachRoot} className={`${styles.text} ${className ?? ""}`} aria-label={text}>{accessibleText}</p> : null}
    </>
  );
}
