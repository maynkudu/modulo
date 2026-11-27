"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModuloLogo } from "./modulo-logo";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className={styles.header}>
    <Link className={styles.brand} href="/" aria-label="Modulo collection"><ModuloLogo className={styles.logo} preload /></Link>
    <nav className={styles.navigation} aria-label="Main navigation">
      <Link className={styles.collection} href="/" aria-current={pathname === "/" ? "page" : undefined}>The collection</Link>
      <Link className={styles.access} href="/access" aria-current={pathname === "/access" ? "page" : undefined}>Get Access</Link>
    </nav>
  </header>;
}
