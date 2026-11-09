import Link from "next/link";
import { ComponentSection } from "@/components/component-section";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { SiteHeader } from "@/components/site-header";
import { SnapRailDemo } from "@/components/snap-rail-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { snapRail, snapRailProps, snapRailUsage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(snapRail);

export default function SnapRailPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a><SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(snapRail)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Snap rail</li></ol></nav>
      <div className={styles.heading}><div><h1>{snapRail.title}</h1><p>{snapRail.description}</p></div><ComponentHeadingActions name="snap-rail" /></div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><SnapRailDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="snap-rail" /><div className={styles.panelDivider} /><h3>Usage</h3><pre><code>{snapRailUsage}</code></pre>
          <p>React and browser Pointer Events. All four source files install together. No animation package required.</p><a href="/r/snap-rail.json">Registry JSON</a><ComponentMediaLinks component={snapRail} />
          <div className={styles.panelDivider} /><h3>Interaction</h3>
          <p>Drag the item horizontally. Release speed projects a destination, then the item springs to the nearest detent. Grab it again to interrupt. A hold before release discards stale flick speed.</p>
          <p>Use the destination buttons, arrow keys, Home or End. Labels stay rigid. Cancellation returns to the selected detent without committing. Reduced motion selects the destination immediately. Hidden and offscreen previews stop animation.</p>
          <p>The spring tuning and projection are original examples. They are not Apple implementation constants.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Snap rail properties"><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>{snapRailProps.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}</tbody></table></div>
          <details className={styles.details}><summary>Selection and controller</summary>
            <p>Detents have stable IDs, labels and strictly increasing finite positions. One detent is supported. Pass either <code>selectedId</code> with <code>onSelectionChange</code>, or <code>defaultSelectedId</code>. The parent owns a controlled selection.</p>
            <p><code>onSelectionCommit(id)</code> fires once after a successful pointer release or keyboard destination request. <code>onSelectionCancel()</code> reports an interrupted gesture. Controller selections and replays emit changes without user commits.</p>
            <p><code>select(id)</code> retargets from the current position and velocity. <code>replay()</code> runs a finite sequence. <code>reset()</code> restores the first uncontrolled selection, or the current controlled selection. <code>snapshot()</code> exposes geometry, velocity, preview, lifecycle and event counts. The component calls <code>destroy()</code> on unmount.</p>
          </details>
        </div></ComponentSection>
        <ComponentSource name="snap-rail" />
      </div>
    </main>
  </div>;
}
