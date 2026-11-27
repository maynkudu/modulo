import Link from "next/link";
import { SoundControl } from "./interface-sounds";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return <footer className={styles.footer}>
    <p>Made by maynkudu.</p>
    <nav className={styles.links} aria-label="Footer navigation">
      <SoundControl label="Sound" placement="drawer" />
      <Link href="/access">Get Access</Link>
    </nav>
  </footer>;
}
