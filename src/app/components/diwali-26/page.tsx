import Link from "next/link";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { Diwali26Demo } from "@/components/diwali-26-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { diwali26, diwali26Props, diwali26Usage } from "@/lib/catalog";
import { ComponentSource } from "@/components/component-source";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(diwali26);

export default function Diwali26Page() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(diwali26)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Diwali/26</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{diwali26.title}</h1><p>{diwali26.description}</p></div>
        <a className={styles.sourceLink} href="#source">View source</a>
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><Diwali26Demo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="diwali-26" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><pre><code>{diwali26Usage}</code></pre>
          <p>React, Canvas 2D, and Web Audio. All seven source files install together. No runtime artwork or audio downloads.</p>
          <a href="/r/diwali-26.json">Registry JSON</a><a href="/artwork/diwali-26.png" download>Download still fallback</a>
          <ComponentMediaLinks component={diwali26} />
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Click the open sky to launch at that point. Brush the rangoli to move individual petals, leaves and powder. Tab to the sky or a flower and press Enter for keyboard interaction.</p>
          <p>Each skyshot has its own whistle, boom and crackle tail. Sound starts after interaction. The header sound toggle mutes the scene and haptics. Vibration depends on browser and device support.</p>
          <p>Pause, hidden tabs and scrolling the scene out of view stop animation and sound. Reduced motion keeps the rangoli still and draws skyshots without rocket motion or flashes.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Diwali/26 properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{diwali26Props.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></div>
          <details className={styles.details}><summary>Controller methods</summary>
            <p><code>launch(x, y)</code> launches at normalized sky coordinates. <code>gust({"{ x, y }"})</code> disturbs the rangoli. <code>clear()</code>, <code>pause()</code>, <code>resume()</code> and <code>seek(seconds)</code> control playback.</p>
            <p><code>setPattern(pattern)</code> changes new skyshots. <code>unlockAudio()</code> unlocks sound from an external gesture. <code>setAudio(enabled, volume)</code> controls sound and haptics. <code>snapshot()</code> reports geometry, skyshots and runtime state.</p>
            <p><code>exportPNG()</code> exports the current pose. Pass <code>layers</code> to export sky, fireworks, rangoli, powder or lamps separately. All layers share coordinates. The component calls <code>destroy()</code> on unmount.</p>
          </details>
        </div></ComponentSection>
        <ComponentSource name="diwali-26" />
      </div>
    </main>
  </div>;
}
