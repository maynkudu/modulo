import { ComponentGallery } from "@/components/component-gallery";
import { SiteHeader } from "@/components/site-header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to previews</a>
      <SiteHeader page="home" />
      <main id="content" className={`${styles.main} ${styles.galleryMain}`} aria-label="Component previews">
        <ComponentGallery />
      </main>
    </div>
  );
}
