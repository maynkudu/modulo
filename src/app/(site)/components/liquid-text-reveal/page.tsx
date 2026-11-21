import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { liquidTextReveal } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = getComponentMetadata(liquidTextReveal);

const usage = `import { LiquidTextReveal } from "@/components/liquid-text-reveal/LiquidTextReveal";

<LiquidTextReveal
  as="h2"
  text="Modulo is a collection of interactive components. Living gardens, liquid controls, playful details. Open a preview, try it for yourself, and bring it into your own project."
  color="#ff0000"
  profile="studio"
  revealMode="scroll"
/>`;

export default function LiquidTextRevealPage() {
  return <div className={styles.page}>
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(liquidTextReveal)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/components">Components</Link></nav>
      <header className={styles.heading}><div><h1>{liquidTextReveal.title}</h1><p>{liquidTextReveal.description}</p></div><ComponentHeadingActions name={liquidTextReveal.name} /></header>
      <ComponentSection title="Preview" id="preview">
        <Link href="/view/liquid-text-reveal">Open the full-page demo</Link>
        <ComponentMediaLinks component={liquidTextReveal} />
      </ComponentSection>
      <ComponentSection title="Installation" id="installation">
        <InstallCommand name={liquidTextReveal.name} />
        <LiquidCode><code>{usage}</code></LiquidCode>
      </ComponentSection>
      <ComponentSection title="API" id="api">
        <dl className={styles.api}>
          <div><dt><code>text</code></dt><dd>A string or an array of lines. Set <code>wrapLines</code> to separate lines with spaces instead of hard breaks.</dd></div>
          <div><dt><code>as</code></dt><dd>Use <code>h1</code>, <code>h2</code>, <code>h3</code>, or <code>p</code>. Defaults to <code>h2</code>.</dd></div>
          <div><dt><code>color</code></dt><dd>A CSS color for the liquid phase. The finished text inherits its color.</dd></div>
          <div><dt><code>trigger</code></dt><dd>Use <code>scroll</code> for a reversible reveal or <code>entrance</code> for a one-time reveal.</dd></div>
          <div><dt><code>revealMode</code></dt><dd><code>scroll</code> resolves words in reading order. <code>proximity</code> moves one boundary across every line, either as you scroll or as you move a mouse or pen over the text.</dd></div>
          <div><dt><code>words</code></dt><dd>Use <code>all</code> or animate only the <code>last</code> word.</dd></div>
          <div><dt><code>profile</code></dt><dd><code>studio</code> blends each word over a longer interval than <code>editorial</code> in reading-order mode.</dd></div>
          <div><dt><code>id</code> and <code>className</code></dt><dd>Set the anchor and style the heading. Reduced motion keeps the text sharp.</dd></div>
        </dl>
      </ComponentSection>
      <ComponentSource name={liquidTextReveal.name} />
    </main>
  </div>;
}
