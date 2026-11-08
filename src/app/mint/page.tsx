import type { Metadata } from "next";
import { Mint } from "@/components/mint";
import { SiteHeader } from "@/components/site-header";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Mint", robots: { index: false, follow: false } };

export default function MintPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to mint</a>
    <SiteHeader page="mint" />
    <main className={styles.main} id="content"><Mint /></main>
  </div>;
}
