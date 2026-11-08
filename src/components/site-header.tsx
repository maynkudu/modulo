import Image from "next/image";
import Link from "next/link";
import { SoundToggle } from "./interface-sounds";
import styles from "@/app/page.module.css";

export function SiteHeader({ page }: { page: "home" | "catalog" | "component" | "registry" | "mint" }) {
  return (
    <header className={styles.header}>
      <div className={styles.brandGroup}>
        <Link className={styles.brand} href="/" aria-label="Modulo home">
          <Image className={styles.brandImage} src="/brand/modulo-logo.png" alt="Modulo" width={1284} height={296} priority />
        </Link>
        <span className={styles.brandDescription}>React components, source included.</span>
      </div>
      <nav aria-label="Main navigation">
        <Link href="/" aria-current={page === "home" ? "page" : undefined}>Home</Link>
        <Link href="/components" aria-current={page === "catalog" ? "page" : undefined}>Components</Link>
        <Link href="/registry" aria-current={page === "registry" ? "page" : undefined}>Registry</Link>
        <Link href="/mint" aria-current={page === "mint" ? "page" : undefined}>Mint</Link>
        {page === "component" && <>
          <a href="#installation">Installation</a>
          <a href="#api">API</a>
        </>}
      </nav>
      <SoundToggle className={styles.soundToggle} />
    </header>
  );
}
