import Link from "next/link";
import styles from "@/components/studio-destinations.module.css";
import { getSiteMetadata } from "@/lib/seo";
import { studioServices } from "@/lib/studio-content";

export const metadata = getSiteMetadata("services");

/** Lists the studio's four services with relevant project examples. */
export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <main className={styles.services} id="content">
        <div className={styles.servicesIntro}>
          <h1 className={styles.title}>Services</h1>
          <p>We design and build the identity, site, motion and campaign materials around a launch.</p>
        </div>
        <div className={styles.serviceList}>
          {studioServices.map(({ title, copy, example }) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{copy}</p>
              {example ? <Link href={`/components/${example.slug}`}>See {example.title}</Link> : <Link href="/contact">Discuss a project</Link>}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
