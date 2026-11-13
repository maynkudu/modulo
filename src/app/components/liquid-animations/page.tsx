import { LiquidCode } from "@/components/liquid-documentation";
import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { LiquidAnimationsDemo } from "@/components/liquid-animations-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { liquidAnimations, liquidAnimationsProps, liquidAnimationsUsage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(liquidAnimations);

export default function LiquidAnimationsPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(liquidAnimations)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Liquid Animations</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{liquidAnimations.title}</h1><p>{liquidAnimations.description}</p></div>
        <ComponentHeadingActions name="liquid-animations" />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><LiquidAnimationsDemo /></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="liquid-animations" />
          <h3>Usage</h3><LiquidCode><code>{liquidAnimationsUsage}</code></LiquidCode>
          <p>React 19, Base UI and Rune Icons. Installation includes Elastic Slider. Keep both component directories beside each other.</p>
          <a href="/r/liquid-animations.json">Registry JSON</a>
          <ComponentMediaLinks component={liquidAnimations} />
          <h3>Interaction</h3>
          <p>Change the motion speed, open a popup and reverse it while it grows. Text, icons and swatches keep their size while the background changes shape. The Account menu reveals its identity and actions together.</p>
          <p>Use Arrow keys to move through tabs and choices. Escape closes a popup and returns focus to its trigger. Reduced motion applies the final shape immediately.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Liquid Animations properties"><table>
            <thead><tr><th>Control</th><th>Props</th><th>Default</th></tr></thead>
            <tbody>{liquidAnimationsProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
        </div></ComponentSection>
        <ComponentSource name="liquid-animations" />
      </div>
    </main>
  </div>;
}
