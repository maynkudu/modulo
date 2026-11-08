import type { ReactNode } from "react";
import styles from "./component-section.module.css";

export function ComponentSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return <section className={styles.section} id={id} aria-labelledby={`${id}-heading`}>
    <h2 className={styles.label} id={`${id}-heading`}>{title}</h2>
    <div className={styles.content}>{children}</div>
  </section>;
}
