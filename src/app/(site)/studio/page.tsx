import Image from "next/image";
import Link from "next/link";
import { ModuloMark } from "@/components/modulo-mark";
import { getSiteMetadata } from "@/lib/seo";
import styles from "./studio.module.css";

export const metadata = getSiteMetadata("studio");

const studioWork = [
  { title: "Interactive garden", name: "interactive-art", image: "/media/interactive-art.jpg", alt: "A white and violet lotus garden growing above water" },
  { title: "Nilkamal", name: "nilkamal", image: "/media/nilkamal.jpg", alt: "A blue lotus reflected in a moonlit pond" },
  { title: "Root Infection", name: "root-infection", image: "/media/root-infection.jpg", alt: "Maroon roots branching across a dark page" },
  { title: "Diwali / 26", name: "diwali-26", image: "/media/diwali-26.jpg", alt: "A floral rangoli and fireworks beneath a dark sky" },
];

export default function StudioPage() {
  return (
    <div className={styles.page}>
      <main id="content" className={styles.main}>
        <section className={styles.intro}>
          <div>
            <h1>Make the launch feel like the product.</h1>
            <p>Modulo designs and builds websites and interactive product experiences for software teams. One practice covers the visual direction, the interaction, and the code that ships.</p>
            <div className={styles.actions}>
              <Link className={styles.contact} href="mailto:maynkudu@gmail.com">Discuss a project</Link>
              <Link className={styles.workLink} href="#selected-work">See the work</Link>
            </div>
          </div>
          <div className={styles.introMark} aria-hidden="true"><ModuloMark /></div>
        </section>

        <section className={styles.services} id="services" aria-labelledby="services-title">
          <h2 id="services-title">Studio services</h2>
          <div className={styles.serviceGrid}>
            <article><h3>Launch websites</h3><p>Art direction, responsive page design, and frontend development for a new product or a new chapter.</p></article>
            <article><h3>Product experiences</h3><p>Onboarding, feature flows, and the interactive details that make a software product feel like itself.</p></article>
            <article><h3>Interaction systems</h3><p>Custom motion, canvas and WebGL work, plus reusable React components for teams building in-house.</p></article>
          </div>
        </section>

        <section className={styles.work} id="selected-work" aria-labelledby="work-title">
          <div className={styles.workHeading}><h2 id="work-title">Experiments from the studio.</h2><p>These are original interface studies, not client case studies.</p></div>
          <div className={styles.workGrid}>
            {studioWork.map((item) => <Link className={styles.workItem} key={item.name} href={`/components/${item.name}`}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 680px) 90vw, (max-width: 1000px) 45vw, 30vw" unoptimized />
              <span>{item.title}</span>
            </Link>)}
          </div>
        </section>

        <section className={styles.contactBlock} id="contact">
          <h2>Have a product to launch?</h2>
          <div><p>Send the context, the deadline, and the part of the interface that needs to work harder.</p><Link href="mailto:maynkudu@gmail.com">Email maynkudu@gmail.com</Link></div>
        </section>
      </main>
    </div>
  );
}
