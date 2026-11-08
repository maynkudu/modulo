import Link from "next/link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return <footer className={styles.footer}><span>Modulo</span><Link href="/registry">Installation guide</Link></footer>;
}
