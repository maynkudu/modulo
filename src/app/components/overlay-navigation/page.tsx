import Link from "next/link";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentSection } from "@/components/component-section";
import { SiteHeader } from "@/components/site-header";
import { OverlayNavigationDemo } from "@/components/overlay-navigation-demo";
import { InstallCommand } from "@/components/install-command";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { StructuredData } from "@/components/structured-data";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import { overlayNavigation, overlayNavigationProps, overlayNavigationUsage } from "@/lib/catalog";
import styles from "../../page.module.css";
import localStyles from "./page.module.css";

export const metadata = getComponentMetadata(overlayNavigation);
export default function OverlayNavigationPage() {
  return <div className={`${styles.page} ${localStyles.page}`}>
    <a className={styles.skipLink} href="#content">Skip to component</a>
    <SiteHeader page="component" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(overlayNavigation)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">Overlay navigation</li></ol></nav>
      <div className={styles.heading}><div><h1>{overlayNavigation.title}</h1><p>{overlayNavigation.description}</p></div><ComponentHeadingActions name="overlay-navigation" /></div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><div className={`${styles.demo} ${localStyles.preview}`}><OverlayNavigationDemo /></div></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="overlay-navigation" />
          <h3>Usage</h3><pre><code>{overlayNavigationUsage}</code></pre>
          <p>The navbar, menu, CSS, fonts, and preview images install together. Requires React 19 and GSAP. Mount once around your page content.</p>
          <p>Pass your pathname to <code>currentHref</code> and route through <code>onNavigate</code>. Supply <code>items</code>, <code>brand</code>, <code>trailing</code>, <code>contact</code>, and <code>social</code> to replace the portfolio defaults.</p>
          <ComponentMediaLinks component={overlayNavigation} />
          <h3>Interaction</h3>
          <p>Open the menu to reveal the route list. Hover or focus a route to change its preview. Escape closes the menu and restores focus. Tab stays within the menu while it is open. Reduced motion shows the same states immediately.</p>
          <p>This component preserves the portfolio navigation before its redesign, including the original toggle, link dimming, and map circles.</p>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}><div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Overlay navigation properties"><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>{overlayNavigationProps.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}</tbody></table></div></div></ComponentSection>
        <ComponentSource name="overlay-navigation" />
      </div>
    </main>
  </div>;
}
