import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { GardenDemo } from "@/components/garden-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { gardenProps, gardenUsage, interactiveArt } from "@/lib/catalog";
import item from "../../../../public/r/interactive-art.json";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(interactiveArt);

export default function InteractiveArtPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to component</a>
      <SiteHeader page="component" />
      <main className={styles.main} id="content">
        <StructuredData data={getComponentStructuredData(interactiveArt)} />
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/components">Components</Link></li>
            <li aria-current="page">{interactiveArt.title}</li>
          </ol>
        </nav>
        <div className={styles.heading} id="interactive-art">
          <div>
            <h1>{interactiveArt.title}</h1>
            <p>{interactiveArt.description}</p>
          </div>
          <a className={styles.sourceLink} href="#source">View source</a>
        </div>
        <div className={styles.grid}>
          <GardenDemo />
          <section className={`${styles.panel} ${styles.install}`} aria-labelledby="installation">
            <h2 id="installation">Installation</h2>
            <InstallCommand />
            <div className={styles.panelDivider} />
            <h3>Usage</h3>
            <pre><code>{gardenUsage}</code></pre>
            <p>React and Canvas 2D. No animation package required.</p>
            <a href="/r/interactive-art.json">Registry JSON</a>
            <a href="/artwork/lotus-garden.png" download>Download still fallback</a>
            <ComponentMediaLinks component={interactiveArt} />
          </section>
          <section className={`${styles.panel} ${styles.api}`} aria-labelledby="api">
            <h2 id="api">API</h2>
            <p>Pass scene options to <code>GardenCanvas</code>. Use the controller from <code>onReady</code> for live changes.</p>
            <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="GardenCanvas properties">
              <table>
                <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
                <tbody>{gardenProps.map(([name, type, defaultValue, description]) => (
                  <tr key={name}>
                    <td><code>{name}</code><span>{description}</span></td>
                    <td><code>{type}</code></td>
                    <td><code>{defaultValue}</code></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <details className={styles.details}>
              <summary>Controller methods</summary>
              <p><code>pause()</code>, <code>resume()</code>, <code>seek(seconds)</code>, <code>setTimeScale(value)</code>, and <code>bend(id, direction)</code> control the scene.</p>
              <p><code>snapshot()</code> and <code>saveState()</code> return scene state. <code>exportPNG(options)</code> saves the whole scene or selected layers. The React component calls <code>destroy()</code> on unmount.</p>
            </details>
          </section>
          <section className={`${styles.panel} ${styles.source}`} id="source" aria-labelledby="source-heading">
            <h2 id="source-heading">Source</h2>
            <p>The demo uses these same six files. Installation copies them into your project.</p>
            {item.files.map((file) => (
              <details className={styles.details} key={file.path}>
                <summary>{file.target}</summary>
                <pre><code>{file.content}</code></pre>
              </details>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
