import Link from "next/link";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { TexturedGlassDemo } from "@/components/textured-glass-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { texturedGlass, texturedGlassProps, texturedGlassUsage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(texturedGlass);

export default function TexturedGlassPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(texturedGlass)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Textured glass</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{texturedGlass.title}</h1><p>{texturedGlass.description}</p></div>
        <a className={styles.sourceLink} href="#source">View source</a>
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><TexturedGlassDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="textured-glass" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><pre><code>{texturedGlassUsage}</code></pre>
          <p>React, Three.js, and Transformers.js. All six source files install together. Give the component an image URL and a bounded container.</p>
          <a href="/r/textured-glass.json">Registry JSON</a>
          <ComponentMediaLinks component={texturedGlass} />
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Move the pointer across the image to change the camera angle and light. An estimated depth map shapes the photograph into a mesh behind the glass. Closer objects move differently from distant ones. Focus the image and use the arrow keys for keyboard control.</p>
          <p>Focus depth ranges from distant objects at 0 to nearby objects at 1. Focus blur softens objects outside that depth. Object depth controls the mesh relief. Depth map displays the estimate, with brighter areas closer to you.</p>
          <p>Uploads stay in your browser. The first upload downloads Depth Anything V2 Small and analyzes the image in a worker. Later uploads reuse the model. The default image uses its precomputed depth map. The demo accepts images up to 20 MB. Use default restores stay.jpeg. Save PNG captures the current view.</p>
          <p>Depth is estimated from one photograph. Large movements can stretch object boundaries where hidden image content is unavailable.</p>
          <p>Pause freezes the camera and light. Hidden tabs and offscreen previews stop rendering. Reduced motion keeps a still view while image uploads and settings remain available.</p>
          <p>Reconstructed from <a href="https://x.com/neilsonks/status/2118757539957633115" target="_blank" rel="noreferrer">Neilson Koerner-Safrata&apos;s video</a>. The original shader is unpublished, so exact fidelity has not been verified.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Textured glass properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{texturedGlassProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></div>
          <details className={styles.details}><summary>Controller methods</summary>
            <p><code>configure(settings)</code> updates the effect. <code>setImage(url)</code> replaces the image without rebuilding the renderer. <code>setLight(x, y)</code> sets a normalized light position.</p>
            <p><code>pause()</code>, <code>resume()</code>, and <code>reset()</code> control the scene. <code>estimateDepth()</code> retries local image analysis. <code>snapshot()</code> reports camera position, depth-map status, settings and GPU resource counts. <code>exportPNG()</code> returns a PNG blob. The component calls <code>destroy()</code> on unmount.</p>
          </details>
        </div></ComponentSection>
        <ComponentSource name="textured-glass" />
      </div>
    </main>
  </div>;
}
