import Link from "next/link";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { RootInfectionDemo } from "@/components/root-infection-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { rootInfection, rootInfectionProps, rootInfectionUsage } from "@/lib/catalog";
import { ComponentSource } from "@/components/component-source";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(rootInfection);

export default function RootInfectionPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to component</a>
      <SiteHeader page="component" />
      <main className={styles.main} id="content">
        <StructuredData data={getComponentStructuredData(rootInfection)} />
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/components">Components</Link></li>
            <li aria-current="page">{rootInfection.title}</li>
          </ol>
        </nav>
        <div className={styles.heading}>
          <div><h1>{rootInfection.title}</h1><p>{rootInfection.description}</p></div>
          <a className={styles.sourceLink} href="#source">View source</a>
        </div>
        <div className={styles.sections}>
          <ComponentSection title="Preview" id="preview"><RootInfectionDemo /></ComponentSection>
          <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
            <InstallCommand name="root-infection" />
            <div className={styles.panelDivider} />
            <h3>Usage</h3>
            <pre><code>{rootInfectionUsage}</code></pre>
            <p>React, WebGL 2 with a Canvas 2D fallback, and Web Audio. No physics or animation package required. All ten source files install together.</p>
            <a href="/r/root-infection.json">Registry JSON</a>
            <ComponentMediaLinks component={rootInfection} />
            <div className={styles.panelDivider} />
            <h3>Interaction</h3>
            <p>Keep the pointer still in the preview. Move it to pull the roots back, or click to scatter them. Press Escape to clear the screen.</p>
            <p>Hold Shift to approach the roots without clearing them. They recoil from the pointer. Shift-drag a root to pull on it. Scrolling pushes them sideways.</p>
            <p>Roots cling to buttons and links and tug their edges. As the infection matures, thinner roots merge into larger trunks. Thick new forks keep spreading while the existing roots grow wider and press against the viewport.</p>
            <p>Sound starts after the first click or key press. The header sound toggle mutes the demo. Reduced motion keeps the preview still.</p>
            <p>Moving outside the preview stops new infections while you read the documentation. The overlay never intercepts links or controls.</p>
          </div></ComponentSection>
          <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
            <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Root Infection properties">
              <table>
                <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
                <tbody>{rootInfectionProps.map(([name, type, defaultValue, description]) => (
                  <tr key={name}>
                    <td><code>{name}</code><span>{description}</span></td>
                    <td><code>{type}</code></td><td><code>{defaultValue}</code></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <details className={styles.details}>
              <summary>Controller methods</summary>
            <p><code>snapshot()</code> reports particle counts, branch counts, solver error, audio state, rendering backend, and measured frame timings. WebGL body timings measure CPU submission, while frame intervals include browser scheduling. <code>reset()</code> clears the infection. <code>setAudio(enabled, volume)</code> changes audio immediately.</p>
              <p>Keep <code>onReady</code> stable. Physics prop changes create a fresh simulation. Audio and class changes preserve the current infection. Cleanup calls <code>destroy()</code> automatically.</p>
            </details>
          </div></ComponentSection>
          <ComponentSection title="How it works" id="physics"><div className={`${styles.panel} ${styles.docPanel} ${styles.source}`}>
            <p>Each root is a chain of pooled particles. Verlet integration derives velocity from position history. Distance constraints keep neighboring joints connected, and angular constraints resist sharp folds more strongly as the roots thicken. Branches share a parent joint.</p>
            <p>A shared breadth-first frontier fills sibling branch slots before opening a deeper generation. New roots and segments inherit the infection age, so later branches start thicker and occupy more space between joints. Segment additions slow as their size increases.</p>
            <p>At the default settings, consolidation starts 12 seconds after emergence. Thin roots, including earlier branches and detached worms, converge onto larger trunks in staggered 1.8-second merges. Substantial forks and their supporting parents stay connected.</p>
            <p>Mature branches start with at least 60% of their parent&apos;s radius before tapering. A coarse occupancy grid guides new forks into uncovered areas. Crowded leaves merge into their parents to release particles for new growth. Once the viewport fills, thick forks keep pushing toward its edges. Existing chains pull toward their targets before adding more joints.</p>
            <p>Merges add cross-sectional tissue once. Mature forks return the tissue added since birth, so their inherited girth does not get counted again on every recycling cycle. Radial growth continues without a size ceiling.</p>
            <p>Thickness has no size ceiling. Released particles leave the active iteration list, so physics and rendering process the surviving network. The pool reuses storage on the next infection. Pass finite root and particle budgets to limit allocation. Outward forces and edge oscillations increase with age while the viewport contains the roots.</p>
            <p>A fixed 60 Hz physics clock runs separately from interpolated rendering. The solver clamps velocity and catches up at most six steps per frame. A spatial hash limits root collision queries. Cached rectangular distance fields push particles out of controls and steer growing tips around their edges. Mark an element with <code>data-root-obstacle</code> to include it, or <code>data-root-ignore</code> to exclude it.</p>
            <p>Retraction slides joints backward along captured root paths with increasing speed. Branch anchors follow their moving parents. An impact cuts the chains into short ligaments, gives them outward and rotational impulses, and releases them under gravity until they fall below the viewport.</p>
            <p>Auto quality keeps the full pixel density, configured constraint passes, and all rendering detail. If measured frame cost grows, it can start consolidation after eight seconds. It changes growth timing to reduce the active network. Low and medium quality remain explicit options. Collision proxies stay small enough for local hash queries as visible tissue swells. Hidden tabs stop the clock. Unmount removes the overlay, listeners, observers, timers, and audio resources.</p>
            <p>The renderer builds rounded tube meshes whose neighboring joints share surface normals. Connected forks share a skin field, so their texture stays continuous as they merge. WebGL depth-tests the tissue into a floating-point field and adds lighting, pores, veins, small scars, and wet highlights once per visible pixel. The roots use brighter maroon tones on dark pages and near-black tones on light pages. Background sampling updates once a second during the infection, including after a theme change. Browsers without floating-point targets use the same material directly. Canvas 2D provides a fallback. Geometry and GPU buffers are reused.</p>
            <p>The sound engine synthesizes filtered noise, small cracks, a beating bass drone, a stereo suction sweep, and a descending sub-bass impact. A compressor and voice limit control overlapping sound.</p>
            <a href="https://youtube.com/shorts/HJas6mdFDqI" target="_blank" rel="noreferrer">Physics inspiration</a>
          </div></ComponentSection>
          <ComponentSource name="root-infection" />
        </div>
      </main>
    </div>
  );
}
