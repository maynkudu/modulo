import { ComponentLibrary } from "@/components/component-library";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { pageCatalogItems } from "@/lib/catalog";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";
import styles from "../components/components.module.css";

export const metadata = getSiteMetadata("pages");

export default function Pages() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to pages</a>
    <SiteHeader page="pages" />
    <main className={styles.main} id="content">
      <div className={styles.intro}><h1>Pages</h1><p>Complete interactive pages. Try each preview and install the source with an active Modulo key.</p></div>
      <StructuredData data={getCollectionStructuredData("pages")} />
      <ComponentLibrary items={pageCatalogItems} />
    </main>
  </div>;
}
