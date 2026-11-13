import { LiquidCode } from "@/components/liquid-documentation";
import { LiquidDisclosure } from "@/registry/liquid-animations/LiquidControls";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import Link from "next/link";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { NilkamalDemo } from "@/components/nilkamal-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { nilkamal, nilkamalProps, nilkamalUsage } from "@/lib/catalog";
import { ComponentSource } from "@/components/component-source";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(nilkamal);

export default function NilkamalPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(nilkamal)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Nilkamal</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{nilkamal.title}</h1><p>{nilkamal.description}</p></div>
        <ComponentHeadingActions name="nilkamal" />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><NilkamalDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="nilkamal" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><LiquidCode><code>{nilkamalUsage}</code></LiquidCode>
          <p>React, Canvas 2D, and Web Audio. All ten source files install together. No animation package required.</p>
          <a href="/r/nilkamal.json">Registry JSON</a><a href="/artwork/nilkamal.png" download>Download still fallback</a>
          <ComponentMediaLinks component={nilkamal} />
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Hover over individual petals or hold and pull the lotus. The stem stays anchored below the water. Brush the pond to make ripples. Tab to the lotus or pond and press Enter for keyboard interaction.</p>
          <p>Snow collects on the petals and pads as the pond freezes. Hail bounces off the water. Clear weather and rain gradually melt the ice.</p>
          <p>Sound starts after interaction. The header sound toggle mutes the scene. Pause, hidden tabs, and scrolling the scene out of view stop animation and sound. Reduced motion shows still weather states without lightning flashes.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Nilkamal properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{nilkamalProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
          <LiquidDisclosure className={styles.details} label="Controller methods">
            <p><code>setWeather(weather)</code>, <code>setIntensity(value)</code>, <code>setBloom(value)</code>, <code>lightning()</code>, and <code>reset()</code> change the scene. <code>pause()</code> and <code>resume()</code> control playback.</p>
            <p><code>unlockAudio()</code> can be called from an external control&apos;s gesture. <code>setAudio(enabled, volume)</code> controls the sound. <code>snapshot()</code> reports weather accumulation, stem geometry, runtime status, and audio state.</p>
            <p><code>exportPNG()</code> exports the scene. Pass <code>layers</code> to export sky, landscape, water, ice, lotus, weather, or foreground separately. The component calls <code>destroy()</code> on unmount.</p>
          </LiquidDisclosure>
        </div></ComponentSection>
        <ComponentSource name="nilkamal" />
      </div>
    </main>
  </div>;
}
