import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { MultiStepDownloadDemo } from "@/components/multi-step-download-demo";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { multiStepDownload, multiStepDownloadProps, multiStepDownloadUsage } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = getComponentMetadata(multiStepDownload);

/** Documentation and public preview for the multi-step download component. */
export default function MultiStepDownloadPage() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(multiStepDownload)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/components">Components</Link></nav>
      <header className={styles.heading}>
        <div><h1>{multiStepDownload.title}</h1><p>{multiStepDownload.description}</p></div>
        <ComponentHeadingActions name={multiStepDownload.name} />
      </header>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={styles.demo}><MultiStepDownloadDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={styles.documentation}>
          <InstallCommand name={multiStepDownload.name} />
          <h3>Usage</h3><LiquidCode><code>{multiStepDownloadUsage}</code></LiquidCode>
          <p>React and SVG. Both source files install together, with no animation package required.</p>
          <p>Pass transfer progress from 0 to 1 in the loading state. Set success when your operation resolves, or error with a message to allow retry. Your app owns cancellation and reset.</p>
          <a href="/r/multi-step-download.json">Registry JSON</a>
          <ComponentMediaLinks component={multiStepDownload} />
        </div></ComponentSection>
        <ComponentSection title="Interaction" id="interaction"><div className={styles.documentation}>
          <p>Click the button, or press Enter or Space. The ring expands clockwise while the arrow moves. Success contracts the ring and reveals a green check with a short particle burst. Replay starts another sequence, and Reset interrupts the current one.</p>
          <p>Reduced motion shows immediate states and preserves progress and keyboard focus. The installed component displays your operation state. The public preview runs a timed simulation and resets after its success hold.</p>
          <p>Reconstructed from <a href="https://x.com/nitishkmrk/status/2123364229495632098" target="_blank" rel="noreferrer">Nitish Khagwal&apos;s multi-step micro interaction</a>. The original native source and animation constants were not supplied.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><dl className={styles.api}>
          {multiStepDownloadProps.map(([name, type, value, description]) => <div key={name}>
            <dt><code>{name}</code></dt><dd><code>{type}</code><span>Default: <code>{value}</code></span><p>{description}</p></dd>
          </div>)}
        </dl></ComponentSection>
        <ComponentSource name={multiStepDownload.name} />
      </div>
    </main>
  </div>;
}
