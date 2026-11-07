import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NilkamalDemo } from "@/components/nilkamal-demo";
import { InstallCommand } from "@/components/install-command";
import { nilkamal, nilkamalProps, nilkamalUsage } from "@/lib/catalog";
import item from "../../../../public/r/nilkamal.json";
import styles from "../../page.module.css";

export const metadata = { title: "Nilkamal | Modulo" };

export default function NilkamalPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Nilkamal</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{nilkamal.title}</h1><p>{nilkamal.description}</p></div>
        <a className={styles.sourceLink} href="#source">View source</a>
      </div>
      <div className={styles.grid}>
        <NilkamalDemo />
        <section className={`${styles.panel} ${styles.install}`} aria-labelledby="installation">
          <h2 id="installation">Installation</h2>
          <InstallCommand name="nilkamal" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><pre><code>{nilkamalUsage}</code></pre>
          <p>React, Canvas 2D, and Web Audio. All ten source files install together. No animation package required.</p>
          <a href="/r/nilkamal.json">Registry JSON</a><a href="/artwork/nilkamal.png" download>Download still fallback</a>
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Hover over individual petals or hold and pull the lotus. The stem stays anchored below the water. Brush the pond to make ripples. Tab to the lotus or pond and press Enter for keyboard interaction.</p>
          <p>Snow collects on the petals and pads as the pond freezes. Hail bounces off the water. Clear weather and rain gradually melt the ice.</p>
          <p>Sound starts after interaction. The header sound toggle mutes the scene. Pause, hidden tabs, and scrolling the scene out of view stop animation and sound. Reduced motion shows still weather states without lightning flashes.</p>
        </section>
        <section className={`${styles.panel} ${styles.api}`} aria-labelledby="api">
          <h2 id="api">API</h2>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Nilkamal properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{nilkamalProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></div>
          <details className={styles.details}><summary>Controller methods</summary>
            <p><code>setWeather(weather)</code>, <code>setIntensity(value)</code>, <code>setBloom(value)</code>, <code>lightning()</code>, and <code>reset()</code> change the scene. <code>pause()</code> and <code>resume()</code> control playback.</p>
            <p><code>unlockAudio()</code> can be called from an external control&apos;s gesture. <code>setAudio(enabled, volume)</code> controls the sound. <code>snapshot()</code> reports weather accumulation, stem geometry, runtime status, and audio state.</p>
            <p><code>exportPNG()</code> exports the scene. Pass <code>layers</code> to export sky, landscape, water, ice, lotus, weather, or foreground separately. The component calls <code>destroy()</code> on unmount.</p>
          </details>
        </section>
        <section className={`${styles.panel} ${styles.source}`} id="source" aria-labelledby="source-heading">
          <h2 id="source-heading">Source</h2>
          <p>The preview runs these same files. Relative imports keep the component independent of Modulo.</p>
          {item.files.map(file => <details className={styles.details} key={file.path}>
            <summary>{file.target}</summary><pre><code>{file.content}</code></pre>
          </details>)}
        </section>
      </div>
    </main>
  </div>;
}
