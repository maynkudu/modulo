import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { ModuloLogo } from "@/components/modulo-logo";
import { StudioGrain } from "@/components/studio-grain";
import { StudioProjectPreview } from "@/components/studio-project-preview";
import { InterfaceSounds, SoundControl } from "@/components/interface-sounds";
import { LiquidTextReveal, type LiquidTextRevealProps } from "@/registry/liquid-text-reveal/LiquidTextReveal";
import { catalogItems } from "@/lib/catalog";
import { getSiteMetadata } from "@/lib/seo";
import styles from "./studio-home.module.css";

const rethink = localFont({ src: "./fonts/RethinkSans-latin.woff2", weight: "400 800", variable: "--font-rethink", display: "swap" });
const stackNotch = localFont({ src: "./fonts/StackSansNotch-latin.woff2", weight: "200 700", variable: "--font-stack-notch", display: "swap" });
export const metadata = getSiteMetadata("home");

const projects = [
  { slug: "nilkamal", title: "Nilkamal", type: "Interactive art", alt: "A blue lotus on a night pond", frame: styles.garden },
  { slug: "diwali-26", title: "Diwali / 26", type: "Moving poster", alt: "A digital Diwali poster with floral rangoli and fireworks", frame: styles.festival },
  { slug: "logo-refraction", title: "Logo Refraction", type: "Identity in motion", alt: "A white Devanagari mark refracted through glass", frame: styles.refraction, wide: true },
];

const services = [
  { title: "Brand identity", copy: "Visual direction, wordmarks, typography and guidelines your team can work with.", example: projects[2] },
  { title: "Websites", copy: "Art direction, design and frontend development for launches and brand sites.", example: projects[0] },
  { title: "Motion", copy: "Animated identities, site interactions and moving artwork for launches and campaigns.", example: projects[1] },
  { title: "Print and merch", copy: "Posters, apparel and campaign graphics, with files prepared for production." },
];

const processSteps = [
  { title: "Find the direction", copy: "We start with what you're launching, who it's for, and where people will first see it. Then we show you a visual direction using real content." },
  { title: "Make it real", copy: "You review the parts that are hardest to judge in a mockup. That might be a working homepage, a moving wordmark, or a poster at print size." },
  { title: "Build and hand over", copy: "We finish the agreed work and hand over the files your team needs to launch, produce, or update it." },
];

function StudioHeading({ className, ...props }: LiquidTextRevealProps) {
  return <LiquidTextReveal {...props} profile="studio" revealMode={props.revealMode ?? "proximity"} color="var(--studio-red)" className={`${props.as === "h3" ? "" : styles.display} ${className ?? ""}`} />;
}

function StudioNavigationLink({ href, label, count }: { href: string; label: string; count?: number }) {
  return <Link className={styles.navItem} href={href} aria-label={count ? `${label}, ${count} items` : undefined}>
    <span className={styles.navRoll}><span>{label}</span><span aria-hidden="true">{label}</span></span>
    {count ? <sup aria-hidden="true">{count}</sup> : null}
  </Link>;
}

function StudioHeader() {
  return <header className={`${styles.header} ${styles.wrap}`}>
    <a className={styles["nav-brand"]} href="#top" aria-label="maynkudu, back to top">
      <Image src="/brand/maynkudu-studio-logo.png" width={2149} height={732} alt="" unoptimized />
    </a>
    <nav className={styles["main-nav"]} aria-label="Main">
      <StudioNavigationLink href="#work" label="Work" count={catalogItems.length} />
      <StudioNavigationLink href="#services" label="Services" count={services.length} />
      <StudioNavigationLink href="#contact" label="Contact" />
      <SoundControl className={styles.ambience} label="Ambience" placement="drawer" />
    </nav>
  </header>;
}

/** Presents the studio's work, services and contact path on the homepage. */
export default function Home() {
  return <div className={`${styles.page} ${rethink.variable} ${stackNotch.variable}`}>
    <InterfaceSounds />
    <a className={styles.skip} href="#content">Skip to content</a>
    <StudioHeader />
    <main id="content" className={styles.main}>
      <StudioGrain className={styles["hero-art"]} />
      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <div className={`${styles["hero-copy"]} ${styles.wrap}`}>
          <div className={styles["hero-intro"]}>
            <div className={styles["hero-branding"]}>
              <div className={styles["hero-logo"]} aria-hidden="true"><ModuloLogo /></div>
              <StudioHeading id="hero-title" as="h1" text="Independent design studio." trigger="entrance" />
            </div>
            <div className={styles["hero-side-copy"]}>
              <p>We design identity, websites, motion, posters and merch for product teams.</p>
              <p>Design and code happen together. You review working details before they reach the launch.</p>
            </div>
          </div>
          <div className={styles["hero-artwork"]} aria-hidden="true">
            {projects.map(project => <div className={styles["hero-artwork-item"]} key={project.slug}><Image src={`/media/${project.slug}.jpg`} alt="" fill sizes="(max-width:550px) 29vw, 24vw" /></div>)}
          </div>
          <div className={styles["hero-work-heading"]}>
            <StudioHeading id="work-title" text="Selected work" revealMode="scroll" />
          </div>
        </div>
      </section>

      <section className={`${styles.work} ${styles.wrap}`} id="work" aria-label="Selected work examples">
        <div className={styles.projects}>{projects.map(({ slug, title, type, alt, frame, wide }) =>
          <StudioProjectPreview key={slug} href={`/components/${slug}`} clip={`/media/${slug}.mp4`}
            className={`${styles.project} ${wide ? styles["project-wide"] : ""}`} mediaClassName={`${styles["project-media"]} ${frame}`}
            still={<Image src={`/media/${slug}.jpg`} alt={alt} fill sizes={wide ? "(max-width:550px) 92vw, 75vw" : "(max-width:550px) 92vw, 55vw"} />}
            caption={<div className={styles["project-caption"]}><StudioHeading as="h3" text={title} /><span>{type}</span></div>} />,
        )}</div>
        <Link className={styles["work-index"]} href="/components">View all {catalogItems.length} catalog entries</Link>
      </section>

      <section className={styles.statement} aria-labelledby="brand-statement">
        <div className={`${styles.wrap} ${styles["statement-copy"]}`}>
          <StudioHeading id="brand-statement" className={styles["feature-title"]} text={["Good identity is felt", "before it is explained."]} />
          <p>The first thing people notice might be a wordmark on a shirt, a moving poster, or the way a site opens. We make those first encounters feel like they came from the same brand.</p>
        </div>
      </section>

      <section className={`${styles.purpose} ${styles.wrap}`} id="purpose" aria-labelledby="purpose-title">
        <StudioHeading id="purpose-title" className={styles["purpose-title"]} text={["Designers that code,", "Coders that design"]} wrapLines />
        <div className={styles["purpose-copy"]}><p>We design and build in the same studio. That means we can test how an idea moves, responds and reads in the browser while it is still up for debate.</p><p>We work with teams launching something new or giving an existing brand a clearer identity.</p></div>
      </section>

      <section className={`${styles.services} ${styles.wrap}`} id="services" aria-labelledby="services-title">
        <StudioHeading id="services-title" text="Services" />
        <div className={styles["service-list"]}>{services.map(({ title, copy, example }, index) =>
          <details key={title} name="services" open={index === 0}>
            <summary>{title}<span aria-hidden="true" /></summary>
            <p>{copy}{example && <Link href={`/components/${example.slug}`}>See {example.title}</Link>}</p>
          </details>,
        )}</div>
      </section>

      <section className={`${styles.process} ${styles.wrap}`} id="process" aria-labelledby="process-title">
        <StudioHeading id="process-title" text="How we work" />
        <ol role="list">{processSteps.map(({ title, copy }) => <li key={title}><StudioHeading as="h3" text={title} /><p>{copy}</p></li>)}</ol>
      </section>

      <section className={styles.contact} id="contact" aria-labelledby="contact-title">
        <div className={`${styles.wrap} ${styles["contact-main"]}`}>
          <StudioHeading id="contact-title" text="Start a project" />
          <div><p>Tell us what you&apos;re making, when it needs to launch and the budget you have in mind.</p><a className={styles.button} href="mailto:maynkudu@gmail.com?subject=Modulo%20project%20inquiry">Email the studio</a></div>
        </div>
      </section>
    </main>
    <footer className={`${styles.wrap} ${styles["contact-nav"]}`}>
      <a className={styles.brand} href="#top">Modulo</a>
      <nav aria-label="Secondary"><Link href="/studio">Studio</Link><Link href="/components">Components</Link><Link href="/registry">Registry</Link></nav>
      <a href="mailto:maynkudu@gmail.com">maynkudu@gmail.com</a>
    </footer>
  </div>;
}
