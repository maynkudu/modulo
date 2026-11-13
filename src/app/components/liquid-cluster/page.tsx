import { LiquidCode } from "@/components/liquid-documentation";
import { LiquidDisclosure } from "@/registry/liquid-animations/LiquidControls";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { LiquidClusterDemo } from "@/components/liquid-cluster-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { liquidCluster, liquidClusterProps, liquidClusterUsage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(liquidCluster);

export default function LiquidClusterPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(liquidCluster)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Apple Liquid Cluster</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{liquidCluster.title}</h1><p>{liquidCluster.description}</p></div>
        <ComponentHeadingActions name="liquid-cluster" />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><LiquidClusterDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="liquid-cluster" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><LiquidCode><code>{liquidClusterUsage}</code></LiquidCode>
          <p>React and Canvas 2D. All three source files install together. No animation package required.</p>
          <a href="/r/liquid-cluster.json">Registry JSON</a>
          <ComponentMediaLinks component={liquidCluster} />
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Click the notification, or press Enter or Space, to reveal Clear. Clear dismisses the demo notification. Replay and Reset restore it. Right-click the preview or open the Controls menu for the same actions and preferences.</p>
          <p>Notification layout uses two independently operable buttons. At zero separation, their backgrounds form one rectangle. As the gap opens, the inner corners round and a liquid bridge narrows until the card and action separate. Text stays rigid.</p>
          <p>Separation ranges from 0 for joined shapes to 1 for separated shapes. Available space determines the gap in pixels. Join and Separate update the same value. A new value retargets the current spring.</p>
          <p>Reduced motion applies the final geometry directly. Opaque background removes transparency and the shared shadow. Native buttons remain available if Canvas cannot render or the labels need to wrap.</p>
          <p>The background uses geometric smooth-union blending. It is an original adaptation of proximity merging, with no physical fluid simulation or optical refraction.</p>
          <p>The default buttons layout also supports ordinary labeled action groups. Supply optional content for a custom card. Handle onSelect in your app to open or dismiss your own notification.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Liquid cluster properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{liquidClusterProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
          <LiquidDisclosure className={styles.details} label="Controller methods">
            <p><code>setSeparation(value)</code> requests a normalized value through the same controlled or uncontrolled path. <code>replay()</code> joins then separates the group, or sets the final separated state with reduced motion.</p>
            <p><code>snapshot()</code> reports semantic separation, rendered separation, velocity per second, pixel gap, renderer, preference and lifecycle state. <code>update(options)</code> supplies runtime options. The component calls <code>destroy()</code> on unmount.</p>
          </LiquidDisclosure>
        </div></ComponentSection>
        <ComponentSource name="liquid-cluster" />
      </div>
    </main>
  </div>;
}
