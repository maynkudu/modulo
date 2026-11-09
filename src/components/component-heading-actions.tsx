import Link from "next/link";
import styles from "@/app/page.module.css";

export function ComponentHeadingActions({ name }: { name: string }) {
  return <div className={styles.headingActions}>
    <Link className={styles.sourceLink} href={`/view/${name}`} target="_blank" rel="noopener" aria-label="View full, opens in a new tab">View full</Link>
    <a className={styles.sourceLink} href="#source">View source</a>
  </div>;
}
