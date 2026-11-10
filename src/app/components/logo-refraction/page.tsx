import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { LogoRefractionDemo } from "@/components/logo-refraction-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { logoRefraction, logoRefractionProps, logoRefractionUsage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(logoRefraction);

export default function LogoRefractionPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(logoRefraction)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Logo refraction</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{logoRefraction.title}</h1><p>{logoRefraction.description}</p></div>
        <ComponentHeadingActions name="logo-refraction" />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><LogoRefractionDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="logo-refraction" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><pre><code>{logoRefractionUsage}</code></pre>
          <p>React and WebGL. The component, renderer, shader, and stylesheet install together. Use an opaque square image with a light mark on a dark field. Remote images require CORS access.</p>
          <a href="/r/logo-refraction.json">Registry JSON</a><a href="/artwork/maynkudu-warehouse.png" download>Download original logo</a>
          <ComponentMediaLinks component={logoRefraction} />
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Move the pointer over the image to steer the metallic light. Focus the image and use the arrow keys to move the light, or Home to reset it. Black refraction and dispersion affect the dark field. The n sheen control adjusts its separate iridescent sweep and outline glint.</p>
          <p>The complete image keeps its original framing. This sweep and outline glint are positioned for maynkudu&apos;s n in the lower right. Show original displays the uploaded PNG without the effect.</p>
          <p>Pause freezes time and pointer response. Reduced motion, hidden tabs, and scrolling the image out of view stop animation. The original image appears when WebGL is unavailable.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Logo refraction properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{logoRefractionProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></div>
          <details className={styles.details}><summary>Controller methods</summary>
            <p><code>configure(settings)</code> updates the effect. <code>pause()</code> and <code>resume()</code> control playback. <code>seek(time)</code> selects a shader time in seconds. <code>setPointer(x, y)</code> sets a normalized light target while motion is enabled.</p>
            <p><code>snapshot()</code> reports time, pointer position, settings, runtime status, and GPU resource counts. The component calls <code>destroy()</code> on unmount.</p>
          </details>
        </div></ComponentSection>
        <ComponentSource name="logo-refraction" />
      </div>
    </main>
  </div>;
}
