"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./component-detail.module.css";

export type PreviewLayout = "split" | "self-contained" | "embedded-page" | "scoped-experience";

export function PreviewWorkbench({ slug, title, description, image, layout, fullHref, children }: {
  slug: string;
  title: string;
  description?: string;
  image: string;
  layout: PreviewLayout;
  fullHref?: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded || !stage.current) return;
    const viewport = stage.current;
    const opener = expandButton.current;
    const previousOverflow = document.body.style.overflow;
    const previousInert: { element: HTMLElement; inert: boolean }[] = [];
    for (let branch: HTMLElement | null = viewport; branch?.parentElement && branch !== document.body; branch = branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          previousInert.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
    }
    document.body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setExpanded(false);
      }
      if (event.key !== "Tab") return;
      const controls = [...viewport.querySelectorAll("a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),summary,iframe,[tabindex='0']")]
        .filter((element): element is HTMLElement => element instanceof HTMLElement && element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("keydown", keyboard, true);
      previousInert.forEach(({ element, inert }) => { element.inert = inert; });
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [expanded]);

  return <>
    <header className={styles.heading}>
      <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      <div className={styles.actions}>
        <Link className={styles.primary} href="/access" aria-label={`Get access to copy ${title} instructions for your agent`}>Copy for agent</Link>
        <button ref={expandButton} className={styles.secondary} type="button" aria-expanded={expanded} onClick={() => setExpanded(true)}>Expand preview</button>
      </div>
    </header>
    <section ref={stage} className={`${styles.stage} ${expanded ? styles.expanded : ""}`} role={expanded ? "dialog" : undefined}
      aria-modal={expanded ? true : undefined} aria-label={expanded ? `${title} expanded preview` : `${title} playground`}
      data-modulo-entrance-target="" data-modulo-entrance-src={image}>
      <div className={styles.expandedTools} hidden={!expanded}>
        <span>{title}</span><div>{fullHref && <Link href={fullHref} target="_blank" rel="noopener">Open standalone</Link>}
          <button ref={closeButton} type="button" onClick={() => setExpanded(false)}>Exit expanded view</button></div>
      </div>
      <div className={`${styles.body} preview-workbench`} data-preview-slug={slug} data-preview-layout={layout}>{children}</div>
    </section>
  </>;
}
