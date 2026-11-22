"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SoundControl } from "./interface-sounds";
import { ModuloLogo } from "./modulo-logo";
import styles from "./site-header.module.css";

function SiteNavLabel({ label, count }: { label: string; count?: number }) {
  return <>
    <span className={styles.roll}><span>{label}</span><span aria-hidden="true">{label}</span></span>
    {count !== undefined ? <sup aria-hidden="true">{count}</sup> : null}
  </>;
}

/** Links the public site routes and marks the Work section on catalog and detail pages. */
export function SiteHeader({ workCount, serviceCount }: { workCount: number; serviceCount: number }) {
  const pathname = usePathname();
  const section = pathname.split("/")[1];
  const insideWork = section === "components" || section === "pages" || section === "shaders";
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Modulo home" aria-current={pathname === "/" ? "page" : undefined}>
        <ModuloLogo />
      </Link>
      <div className={styles.actions}>
        <nav className={styles.navigation} aria-label="Main navigation">
          <Link href="/work" aria-label={`Work, ${workCount} items`} aria-current={pathname === "/work" ? "page" : insideWork ? "location" : undefined}><SiteNavLabel label="Work" count={workCount} /></Link>
          <Link href="/services" aria-label={`Services, ${serviceCount} items`} aria-current={pathname === "/services" ? "page" : undefined}><SiteNavLabel label="Services" count={serviceCount} /></Link>
          <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}><SiteNavLabel label="Contact" /></Link>
        </nav>
        <SoundControl label="Ambience" placement="drawer" />
      </div>
    </header>
  );
}
