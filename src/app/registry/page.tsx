import { RegistryGuide } from "@/components/registry-guide";
import { SiteHeader } from "@/components/site-header";
import { getSiteMetadata } from "@/lib/seo";
import styles from "../page.module.css";

export const metadata = getSiteMetadata("registry");

export default function RegistryPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to installation</a>
      <SiteHeader page="registry" />
      <main className={styles.main} id="content">
        <div className={styles.heading}>
          <div><h1>Registry</h1><p>Install Modulo components with the shadcn CLI.</p></div>
        </div>
        <RegistryGuide />
      </main>
    </div>
  );
}
