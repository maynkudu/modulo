import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { DotOrbDemo } from "@/components/dot-orb-demo";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { dotOrb } from "@/lib/catalog";
import { dotOrbAudioUsage, dotOrbProps, dotOrbUsage } from "@/lib/dot-orb-docs";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(dotOrb);

export default function DotOrbPage() {
  return <div className={styles.page}>
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(dotOrb)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Dot orb</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{dotOrb.title}</h1><p>{dotOrb.description}</p></div>
        <ComponentHeadingActions name={dotOrb.name} />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><DotOrbDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name={dotOrb.name} />
          <h3>Usage</h3><LiquidCode><code>{dotOrbUsage}</code></LiquidCode>
          <p>All four files install together. React, Canvas and Web Audio handle the effect without an animation dependency.</p>
          <a href="/r/dot-orb.json">Registry JSON</a><ComponentMediaLinks component={dotOrb} />
        </div></ComponentSection>
        <ComponentSection title="Audio input" id="audio-input"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <p>Choose a local audio file and press Play, or allow microphone access and speak. Audio stays in your browser. Microphone input needs HTTPS and browser permission, and never plays through your speakers.</p>
          <p>The orb accepts a caller-owned <code>AnalyserNode</code>. Use <code>AudioInputSession</code> for file playback, microphone permission, source switching and cleanup. Call <code>dispose</code> when its owner unmounts.</p>
          <LiquidCode><code>{dotOrbAudioUsage}</code></LiquidCode>
        </div></ComponentSection>
        <ComponentSection title="Interaction" id="interaction"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <p>Hover pulls nearby dots. Click or tap sends a ripple. Focus the orb and use Arrow keys to move the interaction point, Enter or Space for a ripple, and Escape to reset.</p>
          <p>Respect <code>prefers-reduced-motion</code> in your application and pass it to <code>reducedMotion</code>. Geometry stays still while color follows audio. The renderer pauses when hidden or offscreen.</p>
          <p>Based on <a href="https://x.com/KelvinAdithya/status/2125575228357009808" target="_blank" rel="noreferrer">Kelvin Adithya&apos;s dot orb</a>. The original generator was unavailable. The reference informed its static appearance; live audio and interaction drive this implementation. Exact visual parity remains unverified.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Dot orb properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{dotOrbProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
        </div></ComponentSection>
        <ComponentSource name={dotOrb.name} />
      </div>
    </main>
  </div>;
}
