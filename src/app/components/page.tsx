import { CatalogIndex } from "@/components/catalog-index";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";
import { LiquidTextReveal } from "@/components/liquid-text-reveal";
import styles from "./components.module.css";

export const metadata = getSiteMetadata("components");

export default function Components() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to components</a>
      <SiteHeader page="catalog" />
        <main className={styles.main} id="content" aria-label="Components">
          <div className={styles.intro}><LiquidTextReveal as="h1" text="Components" /><p>Search the collection and try each preview. Source and installation require an active Modulo key.</p></div>
        <StructuredData data={getCollectionStructuredData("components")} />
        <CatalogIndex />
      </main>
    </div>
  );
}
