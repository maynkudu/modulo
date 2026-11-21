import type { Metadata } from "next";
import { Mint } from "@/components/mint";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Mint", robots: { index: false, follow: false } };

export default function MintPage() {
  return <div className={styles.page}>
    <main className={styles.main} id="content"><Mint /></main>
  </div>;
}
