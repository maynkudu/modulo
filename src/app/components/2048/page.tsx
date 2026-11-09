import Link from "next/link";
import { ComponentSection } from "@/components/component-section";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { SiteHeader } from "@/components/site-header";
import { Game2048Demo } from "@/components/game-2048-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { game2048, game2048Props, game2048Usage } from "@/lib/catalog";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(game2048);

export default function Game2048Page() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(game2048)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">2048</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{game2048.title}</h1><p>{game2048.description}</p></div>
        <ComponentHeadingActions name="2048" />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.gameDemo}><Game2048Demo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="2048" />
          <div className={styles.panelDivider} />
          <h3>Usage</h3><pre><code>{game2048Usage}</code></pre>
          <p>React, Rune Icons, and Web Audio. All five source files install together. No game or animation package required.</p>
          <a href="/r/2048.json">Registry JSON</a><ComponentMediaLinks component={game2048} />
          <div className={styles.panelDivider} />
          <h3>Interaction</h3>
          <p>Use arrow keys or WASD without selecting the board. Swipe anywhere in the game on touch screens. Equal tiles merge once per move. Press U or use Undo to take back the last move. Reach 2048, then keep playing.</p>
          <p>Score counts merged values. Best keeps your local record. The segmented meter tracks the highest tile toward 2048. Your board and last move save in this browser.</p>
          <p>Sound starts after interaction. Use the game control or header sound toggle to mute. Reduced motion updates tiles instantly. Hidden tabs stop sound.</p>
          <p>Visual direction from <a href="https://chess.aryank.space/" target="_blank" rel="noopener">Aryan&apos;s chess game</a>.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="2048 properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{game2048Props.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></div>
          <details className={styles.details}><summary>Controller methods</summary>
            <p><code>move(direction)</code> accepts left, right, up, or down. <code>undo()</code> restores one move. <code>reset()</code> starts a new game while preserving the best score.</p>
            <p><code>snapshot()</code> reports the board, score, best, highest tile, game status, undo availability, and audio state. <code>setAudio(enabled, volume)</code> controls sound. <code>unlockAudio()</code> unlocks it from an external gesture. The component calls <code>destroy()</code> on unmount.</p>
          </details>
        </div></ComponentSection>
        <ComponentSource name="2048" />
      </div>
    </main>
  </div>;
}
