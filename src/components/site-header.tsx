import Image from "next/image";
import Link from "next/link";
import { SoundControl } from "./interface-sounds";
import styles from "./site-header.module.css";

export function SiteHeader({ page }: { page: "home" | "catalog" | "component" | "registry" | "mint" }) {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Modulo home">
        <Image src="/brand/modulo-logo.png" alt="Modulo" width={130} height={30} priority />
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/" aria-current={page === "home" ? "page" : undefined}>Home</Link>
        <Link href="/components" aria-current={page === "catalog" ? "page" : undefined}>Components</Link>
        <Link href="/registry" aria-current={page === "registry" ? "page" : undefined}>Registry</Link>
        <Link href="/mint" aria-current={page === "mint" ? "page" : undefined}>Mint</Link>
      </nav>
      <SoundControl className={styles.sound} />
    </header>
  );
}
