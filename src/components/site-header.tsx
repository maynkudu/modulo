import Link from "next/link";
import { SoundControl } from "./interface-sounds";
import { LiquidTrack } from "@/registry/liquid-animations/LiquidTrack";
import { ModuloMark } from "./modulo-mark";
import { ModuloLogo } from "./modulo-logo";
import styles from "./site-header.module.css";

/** Provides site navigation and sound controls outside the dedicated homepage. */
export function SiteHeader({ page }: { page: "home" | "catalog" | "component" | "studio" | "registry" | "mint" }) {
  const navigation = <>
    {page !== "home" ? <Link href="/">Home</Link> : null}
    <Link href="/components" aria-current={page === "catalog" || page === "component" ? "page" : undefined}>Work</Link>
    <Link href="/studio" aria-current={page === "studio" ? "page" : undefined}>Studio</Link>
    <Link href="/registry" aria-current={page === "registry" ? "page" : undefined}>Library</Link>
    <Link href="/mint" aria-current={page === "mint" ? "page" : undefined}>Mint</Link>
  </>;

  return (
    <header className={styles.header} data-page={page}>
      <Link className={styles.brand} href="/" aria-label="Modulo home" aria-current={page === "home" ? "page" : undefined}>
        {page === "home" ? <ModuloLogo className={styles.wordmark} /> : <><ModuloMark className={styles.mark} /><span>modulo</span></>}
      </Link>
      <nav aria-label="Main navigation">
        {page === "home"
          ? <div className={styles.navigation}>{navigation}</div>
          : <LiquidTrack className={styles.navigation}>{navigation}</LiquidTrack>}
      </nav>
      <div className={styles.controls}>
        <Link className={styles.projectLink} href="mailto:maynkudu@gmail.com">Start a project</Link>
        <SoundControl className={styles.sound} />
      </div>
    </header>
  );
}
