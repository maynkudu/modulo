import Image from "next/image";
import Link from "next/link";
import { ModuloLogo } from "@/components/modulo-logo";
import { StudioGrain } from "@/components/studio-grain";
import { StudioProjectPreview } from "@/components/studio-project-preview";
import { CollectionStatement } from "@/components/collection-statement";
import { LiquidTextReveal } from "@/registry/liquid-text-reveal/LiquidTextReveal";
import { catalogItems } from "@/lib/catalog";
import { getSiteMetadata } from "@/lib/seo";
import { studioInquiry, studioProjects, studioServices } from "@/lib/studio-content";
import styles from "./studio-home.module.css";

export const metadata = getSiteMetadata("home");

const projectFrames = {
  nilkamal: styles.garden,
  "diwali-26": styles.festival,
  "logo-refraction": styles.refraction,
};

const processSteps = [
  { title: "Find the direction", copy: "We start with what you're launching, who it's for, and where people will first see it. Then we show you a visual direction using real content." },
  { title: "Make it real", copy: "You review the parts that are hardest to judge in a mockup. That might be a working homepage, a moving wordmark, or a poster at print size." },
  { title: "Build and hand over", copy: "We finish the agreed work and hand over the files your team needs to launch, produce, or update it." },
];

/** Presents the studio's work, services and contact path on the homepage. */
export default function Home() {
  return <div className={styles.page}>
    <main id="content" className={styles.main}>
      <StudioGrain className={styles["hero-art"]} />
      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <div className={`${styles["hero-copy"]} ${styles.wrap}`}>
          <div className={styles["hero-intro"]}>
            <div className={styles["hero-branding"]}>
              <div className={styles["hero-logo"]} aria-hidden="true"><ModuloLogo /></div>
              <LiquidTextReveal id="hero-title" as="h1" className={styles.display} text="Independent design studio." color="var(--studio-red)" profile="studio" revealMode="scroll" />
            </div>
            <div className={styles["hero-side-copy"]}>
              <p>We design identity, websites, motion, posters and merch for product teams.</p>
              <p>Design and code happen together. You review working details before they reach the launch.</p>
            </div>
          </div>
          <div className={styles["hero-artwork"]} aria-hidden="true">
            {studioProjects.map(project => <div className={styles["hero-artwork-item"]} key={project.slug}><Image src={`/media/${project.slug}.jpg`} alt="" fill sizes="(max-width:550px) 29vw, 24vw" /></div>)}
          </div>
          <div className={styles["hero-work-heading"]}>
            <LiquidTextReveal id="work-title" className={styles.display} text="Selected work" color="var(--studio-red)" profile="studio" revealMode="scroll" />
          </div>
        </div>
      </section>

      <section className={`${styles.work} ${styles.wrap}`} id="work" aria-label="Selected work examples">
        <div className={styles.projects}>{studioProjects.map(({ slug, title, type, alt }) => {
          const wide = slug === "logo-refraction";
          return <StudioProjectPreview key={slug} href={`/components/${slug}`} clip={`/media/${slug}.mp4`}
            className={`${styles.project} ${wide ? styles["project-wide"] : ""}`} mediaClassName={`${styles["project-media"]} ${projectFrames[slug]}`}
            still={<Image src={`/media/${slug}.jpg`} alt={alt} fill sizes={wide ? "(max-width:550px) 92vw, 75vw" : "(max-width:550px) 92vw, 55vw"} />}
            caption={<div className={styles["project-caption"]}><LiquidTextReveal as="h3" text={title} color="var(--studio-red)" profile="studio" revealMode="scroll" /><span>{type}</span></div>} />;
        })}</div>
        <Link className={styles["work-index"]} href="/components">View all {catalogItems.length} catalog entries</Link>
      </section>

      <CollectionStatement />

      <section className={`${styles.purpose} ${styles.wrap}`} id="purpose" aria-labelledby="purpose-title">
        <LiquidTextReveal id="purpose-title" as="h2" className={`${styles.display} ${styles["purpose-title"]}`} text={["Designers that code,", "Coders that design"]} color="var(--studio-red)" profile="studio" revealMode="scroll" wrapLines />
        <div className={styles["purpose-copy"]}><p>We design and build in the same studio. That means we can test how an idea moves, responds and reads in the browser while it is still up for debate.</p><p>We work with teams launching something new or giving an existing brand a clearer identity.</p></div>
      </section>

      <section className={`${styles.services} ${styles.wrap}`} id="services" aria-labelledby="services-title">
        <LiquidTextReveal id="services-title" as="h2" className={styles.display} text="Services" color="var(--studio-red)" profile="studio" revealMode="scroll" />
        <div className={styles["service-list"]}>{studioServices.map(({ title, copy, example }, index) =>
          <details key={title} name="services" open={index === 0}>
            <summary>{title}<span aria-hidden="true" /></summary>
            <p>{copy}{example && <Link href={`/components/${example.slug}`}>See {example.title}</Link>}</p>
          </details>,
        )}</div>
      </section>

      <section className={`${styles.process} ${styles.wrap}`} id="process" aria-labelledby="process-title">
        <LiquidTextReveal id="process-title" as="h2" className={styles.display} text="How we work" color="var(--studio-red)" profile="studio" revealMode="scroll" />
        <ol role="list">{processSteps.map(({ title, copy }) => <li key={title}><LiquidTextReveal as="h3" text={title} color="var(--studio-red)" profile="studio" revealMode="scroll" /><p>{copy}</p></li>)}</ol>
      </section>

      <section className={styles.contact} id="contact" aria-labelledby="contact-title">
        <div className={`${styles.wrap} ${styles["contact-main"]}`}>
          <LiquidTextReveal id="contact-title" as="h2" className={styles.display} text={studioInquiry.heading} color="var(--studio-red)" profile="studio" revealMode="scroll" />
          <div><p>{studioInquiry.copy}</p><a className={styles.button} href={studioInquiry.emailHref}>Email the studio</a></div>
        </div>
      </section>
    </main>
  </div>;
}
