import { LiquidCode } from "@/components/liquid-documentation";
import { LiquidDisclosure } from "@/registry/liquid-animations/LiquidControls";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { ElasticSliderDemo } from "@/components/elastic-slider-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { StructuredData } from "@/components/structured-data";
import { ComponentSource } from "@/components/component-source";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { elasticSlider, elasticSliderProps, elasticSliderUsage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(elasticSlider);

export default function ElasticSliderPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(elasticSlider)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Elastic Slider</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{elasticSlider.title}</h1><p>{elasticSlider.description}</p></div>
        <ComponentHeadingActions name="elastic-slider" />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><ElasticSliderDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="elastic-slider" />
          <div className={styles.panelDivider} /><h3>Usage</h3><LiquidCode><code>{elasticSliderUsage}</code></LiquidCode>
          <p>React and scoped CSS. No animation package required.</p>
          <a href="/r/elastic-slider.json">Registry JSON</a><ComponentMediaLinks component={elasticSlider} />
          <div className={styles.panelDivider} /><h3>Interaction</h3>
          <p>Drag horizontally or vertically. The value stays within its bounds while the shell stretches at either end. Labels, content, and input targets keep their shape.</p>
          <p>Arrow keys adjust one step. Page Up and Page Down adjust ten steps. Home and End select the bounds. Step rounding starts at the minimum.</p>
          <p>Changes arrive during adjustment. A successful pointer release or keyboard release commits the requested value. Cancellation settles the shell without a commit. Controlled values remain owned by the parent.</p>
          <p>Reduced motion preserves value adjustment without elastic stretching. Preference changes, hidden tabs, and unmounting stop pending animation and replay.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Elastic Slider properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{elasticSliderProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
          <LiquidDisclosure className={styles.details} label="Controller methods">
            <p><code>update(options)</code> updates the existing instance. <code>snapshot()</code> reports accepted value, pending proposal, raw and rendered stretch, velocity, gesture phase, and runtime status.</p>
            <p><code>replay()</code> runs finite simulated input for media. User input cancels it. <code>destroy()</code> releases the instance&apos;s listeners, observers, timers, and frames. React calls it on unmount.</p>
          </LiquidDisclosure>
        </div></ComponentSection>
        <ComponentSource name="elastic-slider" />
      </div>
    </main>
  </div>;
}
