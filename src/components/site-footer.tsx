import Link from "next/link";
import styles from "./site-footer.module.css";

/** Keeps studio information and installation utilities accessible on every site page. */
export function SiteFooter() {
  return <footer className={styles.footer}>
    <Link href="/">Modulo</Link>
    <nav className={styles.links} aria-label="Footer navigation">
      <Link href="/work">Work</Link>
      <Link href="/services">Services</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/studio">Studio</Link>
      <Link href="/registry">Library</Link>
      <Link href="/mint">Mint</Link>
    </nav>
  </footer>;
}
