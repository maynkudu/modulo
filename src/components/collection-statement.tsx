"use client";

import { useSyncExternalStore } from "react";
import { DotOrb } from "@/registry/dot-orb/DotOrb";
import { collectionStatementText } from "@/lib/collection-statement-text";
import styles from "./collection-statement.module.css";

function subscribeMotion(notify: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const getMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerMotion = () => false;

export function CollectionStatement() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion);
  return <section className={styles.statement} aria-label="About Modulo">
    <div className={`${styles.statementInner} collection-statement-inner`}>
      <div className={styles.featured}><DotOrb reducedMotion={reducedMotion} /></div>
      <p className={styles.statementText}>{collectionStatementText}</p>
    </div>
  </section>;
}
