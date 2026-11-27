import Link from "next/link";
import { getSiteMetadata } from "@/lib/seo";
import styles from "./access.module.css";

export const metadata = getSiteMetadata("access");

export default function AccessPage() {
  return <main className={styles.page} id="content">
    <h1>We aint sharing these</h1>
    <Link href="/">Back to the collection →</Link>
  </main>;
}
