import Link from "next/link";
import { LiquidCode } from "@/components/liquid-documentation";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { InstallCommand } from "@/components/install-command";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { spriteRacer } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";
import local from "./sprite-racer.module.css";

export const metadata = getComponentMetadata(spriteRacer);

const usage = `import { SwitchbackPage } from "@/components/sprite-racer/SwitchbackPage";

export default function Page() {
  return <SwitchbackPage initialMap="pine" initialCar="rally" />;
}`;

const delivery = `<SwitchbackPage
  title="Coast Courier"
  variant="delivery"
  initialMap="coast"
  initialCar="pickup"
  deliveryStops={[
    { name: "Harbor parcels", progress: 0.18, radius: 28, maxSpeed: 7 },
    { name: "Lighthouse mail", progress: 0.82, radius: 28, maxSpeed: 5 },
  ]}
/>`;

export default function SwitchbackDocumentation() {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#content">Skip to Switchback</a>
    <SiteHeader page="pages" />
    <main className={styles.main} id="content">
      <StructuredData data={getComponentStructuredData(spriteRacer)} />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li><li><Link href="/pages">Pages</Link></li><li aria-current="page">Switchback</li>
      </ol></nav>
      <div className={styles.heading}>
        <div><h1>Switchback</h1><p>{spriteRacer.description}</p></div>
        <div className={styles.headingActions}><Link className={styles.sourceLink} href="/play/sprite-racer">Play full page</Link><a className={styles.sourceLink} href="#source">View source</a></div>
      </div>
      <div className={styles.sections}>
        <ComponentSection title="Preview" id="preview"><iframe className={local.preview} src="/play/sprite-racer" title="Play Switchback" allow="autoplay" /></ComponentSection>
        <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
          <InstallCommand name="sprite-racer" />
          <h3>Usage</h3><LiquidCode><code>{usage}</code></LiquidCode>
          <p>The install includes a route at <code>app/switchback/page.tsx</code>, a React adapter, the game rules, renderer, original slice artwork and synthesized audio. React and browser APIs are the only runtime dependencies.</p>
          <a href="/r/sprite-racer.json">Registry JSON</a><ComponentMediaLinks component={spriteRacer} />
          <h3>Driving</h3>
          <p>Use the arrow keys or WASD. Space applies the handbrake. R recovers the car and Escape pauses. Touch controls support accelerating and steering together. Circuits require three ordered laps. Drift Yard gives you two minutes to score.</p>
          <p>Choose a car and map before starting. World layers separates and rotates terrain, roads, structures, scenery and cars. Inspect the car shows its individual slices. Sound starts after a gesture and stops while paused or hidden.</p>
          <h3>Make another game</h3>
          <p>The delivery rules share the same renderer, vehicle handling and audio. Destinations require an ordered arrival within their radius and below their speed limit.</p>
          <LiquidCode><code>{delivery}</code></LiquidCode>
        </div></ComponentSection>
        <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel}`}>
          <dl className={local.api}>
            <dt><code>initialCar</code></dt><dd>rally, club, midgt, turbo, drift or pickup. Defaults to rally for circuits and pickup for delivery.</dd>
            <dt><code>initialMap</code></dt><dd>pine, coast, alpine, harbor, mesa or yard. Defaults to pine for circuits and coast for delivery.</dd>
            <dt><code>variant</code></dt><dd>circuit or delivery. The yard map uses drift scoring in the circuit variant.</dd>
            <dt><code>deliveryStops</code></dt><dd>Delivery only. Each stop has a name, normalized track progress, arrival radius and maximum speed in game units. Keep the array stable between renders.</dd>
            <dt><code>title</code></dt><dd>Optional game title, up to 80 characters.</dd>
            <dt><code>onReady</code></dt><dd>Receives the controller on mount and null on cleanup. Use a stable callback. The controller exposes start, pause, resume, select, setAudio, snapshot and destroy.</dd>
            <dt><code>debug / demo</code></dt><dd>Opt-in diagnostics or a demonstration driver. Both default to false. Debug exposes window.__spriteRacer for local checks.</dd>
          </dl>
          <p>Records and height-aware ghosts stay on the current device and are keyed by map, car and ruleset. Reduced motion removes camera easing and particles. Unmount releases frames, listeners, audio and cached world data.</p>
        </div></ComponentSection>
        <ComponentSource name="sprite-racer" />
      </div>
    </main>
  </div>;
}
