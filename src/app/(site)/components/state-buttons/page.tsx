import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { StateButtonsDemo } from "@/components/state-buttons-demo";
import { StructuredData } from "@/components/structured-data";
import { stateButtons, stateButtonsProps, stateButtonsUsage } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(stateButtons);

/** Public preview and documentation for the controlled State Buttons component. */
export default function StateButtonsPage() {
  return <div className={styles.page}>
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(stateButtons)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">State buttons</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>{stateButtons.title}</h1><p>{stateButtons.description}</p></div>
        <ComponentHeadingActions name={stateButtons.name} />
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><StateButtonsDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name={stateButtons.name} />
          <div className={styles.panelDivider} /><h3>Usage</h3><LiquidCode><code>{stateButtonsUsage}</code></LiquidCode>
          <p>React, Canvas and CSS. All three files install together. The component has no animation package dependency.</p>
          <a href="/r/state-buttons.json">Registry JSON</a><ComponentMediaLinks component={stateButtons} />
        </div></ComponentSection>
        <ComponentSection title="Interaction" id="interaction"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <p>Your application controls the state and label. Loading, Thinking and Pending keep the same 7 by 7 matrix while ripple, orbit, scan, wave, spark or breathe changes its brightness. Success draws a check through the cells. Error draws a cross.</p>
          <p>Set <code>onCancel</code> to support Escape or a second press while the button is active. The component never starts an operation or invents progress. It pauses the canvas while hidden or offscreen, and reduced motion holds a still frame.</p>
          <p>Adapted from <a href="https://x.com/uixamjad/status/2125155886922625241" target="_blank" rel="noreferrer">uixamjad&apos;s button animation</a>. The original code, font and interaction behavior were not available. This component uses new matrix formulas and editable text. It is not an exact reconstruction.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
          <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="State Buttons properties"><table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{stateButtonsProps.map(([name, type, value, description]) => <tr key={name}>
              <td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td>
            </tr>)}</tbody>
          </table></LiquidScrollArea>
        </div></ComponentSection>
        <ComponentSource name={stateButtons.name} />
      </div>
    </main>
  </div>;
}
