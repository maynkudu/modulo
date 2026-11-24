import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { InlineDownloadDemo } from "@/components/inline-download-demo";
import { LiquidCode } from "@/components/liquid-documentation";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { StructuredData } from "@/components/structured-data";
import { inlineDownload, inlineDownloadProps, inlineDownloadUsage } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(inlineDownload);

export default function InlineDownloadPage() {
  return <div className={styles.page}>
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(inlineDownload)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Inline download</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{inlineDownload.title}</h1><p>{inlineDownload.description}</p></div>
        <ComponentHeadingActions name={inlineDownload.name} />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><InlineDownloadDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name={inlineDownload.name} />
          <div className={styles.panelDivider} /><h3>Usage</h3><LiquidCode><code>{inlineDownloadUsage}</code></LiquidCode>
          <p>React, SVG and CSS custom properties. All three source files install together, with no animation or measuring package.</p>
          <a href="/r/inline-download.json">Registry JSON</a><ComponentMediaLinks component={inlineDownload} />
          <div className={styles.panelDivider} /><h3>Interaction</h3>
          <p>Press the pill, or press Enter or Space. The arrow drops toward the tray and keeps dropping while the run lasts. Progress sweeps the surface from the left, and the label swaps to a percentage that counts up with a stall past halfway.</p>
          <p>Press again, or press Escape, to cancel, which calls <code>onCancel</code>. Pointing at a running button swaps the moving arrow for a cross, so cancellation is visible before it is needed. When the run finishes the label becomes <code>doneLabel</code>, a check draws beside it and the surface takes the success colour. Pressing that calls <code>onOpen</code>.</p>
          <p>Set <code>error</code> to a message and the run stops in place. The same button shows the failed surface, names the failure and offers <code>retryLabel</code>, which calls <code>onDownload</code> again. Clear the message when your next run starts.</p>
          <p>Leave out <code>progress</code> to let the button simulate its own download. Pass real progress from 0 to 1 and the button follows your value and finishes at 1. Either way your operation stays with the caller.</p>
          <p>Reduced motion removes travel, blur and digit swaps while keeping every state and the reading order. The finished state returns to the start after <code>resetAfter</code> seconds, or waits while the button holds focus.</p>
          <p>Adapted from <a href="https://uibrik.com/components/download-button" target="_blank" rel="noreferrer">Malay&apos;s download button on uibrik</a>. The original gesture timing was matched against that source and rebuilt without its dependencies.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Inline download properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{inlineDownloadProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
        </div></ComponentSection>
        <ComponentSource name={inlineDownload.name} />
      </div>
    </main>
  </div>;
}
