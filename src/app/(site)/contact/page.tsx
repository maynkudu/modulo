import styles from "@/components/studio-destinations.module.css";
import { getSiteMetadata } from "@/lib/seo";
import { studioInquiry } from "@/lib/studio-content";

export const metadata = getSiteMetadata("contact");

/** Opens an email inquiry with the studio's existing contact address. */
export default function ContactPage() {
  return (
    <div className={styles.page}>
      <main className={styles.contact} id="content">
        <h1 className={styles.title}>{studioInquiry.heading}</h1>
        <div>
          <p>{studioInquiry.copy}</p>
          <a className={styles.email} href={studioInquiry.emailHref}>Email the studio</a>
        </div>
      </main>
    </div>
  );
}
