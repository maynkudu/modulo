"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DesignSwitch } from "./design-switch";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className={styles.header}>
    <Link className={styles.brand} href="/" aria-label="Modulo collection">modulo</Link>
    <DesignSwitch />
    <nav className={styles.navigation} aria-label="Main navigation">
      <Link className={styles.collection} href="/" aria-current={pathname === "/" ? "page" : undefined}>The collection</Link>
      <Link className={styles.access} href="/access" aria-current={pathname === "/access" ? "page" : undefined}>Get Access</Link>
    </nav>
  </header>;
}
