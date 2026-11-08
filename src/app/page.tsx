import { ComponentGallery } from "@/components/component-gallery";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = getSiteMetadata("home");

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to previews</a>
      <SiteHeader page="home" />
      <main id="content" className={styles.main} aria-label="Component previews">
        <h1 className={styles.authorTitle}>interfaces for <Image src="/brand/maynkudu-logo.png" alt="maynkudu" width={154} height={48} priority /></h1>
        <StructuredData data={getCollectionStructuredData("home")} />
        <ComponentGallery />
      </main>
    </div>
  );
}
