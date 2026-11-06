import { CatalogIndex } from "@/components/catalog-index";
import { SiteHeader } from "@/components/site-header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to components</a>
      <SiteHeader page="catalog" />
      <main className={styles.main} id="content" aria-label="Components">
        <CatalogIndex />
      </main>
    </div>
  );
}
