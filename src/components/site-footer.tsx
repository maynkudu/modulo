import Link from "next/link";
import { ModuloMark } from "./modulo-mark";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return <footer className={styles.footer}>
    <div className={styles.identity}>
      <Link className={styles.brand} href="/" aria-label="Modulo home"><ModuloMark className={styles.mark} /><span>modulo</span></Link>
      <p>Brand identities, campaigns, websites, and interactive details.</p>
    </div>
    <div className={styles.contact}>
      <span>Start a project</span>
      <a href="mailto:maynkudu@gmail.com">maynkudu@gmail.com</a>
    </div>
    <nav className={styles.links} aria-label="Footer navigation">
      <Link href="/components">Work</Link>
      <Link href="/studio">Studio</Link>
      <Link href="/registry">Library</Link>
    </nav>
    <div className={styles.footnote}><span>Independent design studio</span><span>© Modulo 2026</span></div>
  </footer>;
}
