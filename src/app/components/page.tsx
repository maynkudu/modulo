import { CatalogIndex } from "@/components/catalog-index";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";
import styles from "../page.module.css";

export const metadata = getSiteMetadata("components");

export default function Components() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to components</a>
      <SiteHeader page="catalog" />
      <main className={styles.main} id="content" aria-label="Components">
        <h1 className="sr-only">Components</h1>
        <StructuredData data={getCollectionStructuredData("components")} />
        <CatalogIndex />
      </main>
    </div>
  );
}
