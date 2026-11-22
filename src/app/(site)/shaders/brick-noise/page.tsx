import Link from "next/link";
import { BrickNoiseDemo } from "@/components/brick-noise-demo";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { brickNoise } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(brickNoise);
const usage = `import { BrickNoise } from "@/components/brick-noise/BrickNoise";

export default function Example() {
  return <BrickNoise speed={1} paused={false} />;
}`;
const properties = [
  ["speed", "number", "1", "Playback multiplier from 0 to 4. One preserves the 1.35 second reference loop."],
  ["paused", "boolean", "false", "Stops playback without resetting time."],
  ["alt", "string", "Grid description", "Accessible description of the animation."],
  ["className / style", "string / CSSProperties", "Optional", "The component fills a square container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller after initialization, null on cleanup or graphics failure."],
  ["onFrame", "(snapshot) => void", "Optional", "Source frame, time, playback, visibility, reduced motion and resource counts."],
  ["onError", "(error: Error) => void", "Optional", "Initialization or context loss. The still image remains visible."],
];

export default function BrickNoisePage() {
  return <div className={styles.page}><main className={styles.main} id="content">
    <StructuredData data={getComponentStructuredData(brickNoise)} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
      <li><Link href="/">Home</Link></li><li><Link href="/shaders">Shaders</Link></li><li aria-current="page">Brick noise</li>
    </ol></nav>
    <div className={styles.heading}>
      <div><h1>{brickNoise.title}</h1><p>{brickNoise.description}</p></div>
      <ComponentHeadingActions name="brick-noise" />
    </div>
    <div className={styles.sections}>
      <ComponentSection title="Preview" id="preview"><div className={styles.demo}><BrickNoiseDemo /></div></ComponentSection>
      <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
        <InstallCommand name="brick-noise" />
        <h3>Usage</h3><LiquidCode><code>{usage}</code></LiquidCode>
        <p>React 19.2 or newer and WebGL. The component, renderer, recovered brightness data and stylesheet install together. No additional npm dependencies.</p>
        <ComponentMediaLinks component={brickNoise} />
        <h3>Playback</h3>
        <p>Pause to inspect any of the 45 frames. Reset returns to the first frame. Speed changes preserve the current time. Reduced motion, hidden tabs and scrolling the shader out of view stop automatic playback.</p>
        <h3>Reference</h3>
        <p>Reconstructed from <a href="https://pin.it/63qzQQIsv" target="_blank" rel="noreferrer">this Pinterest animation</a>. The shader draws the fixed grid and reads measured tile brightness values. It does not play a GIF or video. The original noise formula and author are unavailable. The reference does not state reuse terms.</p>
      </div></ComponentSection>
      <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
        <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Brick noise properties"><table>
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>
            {properties.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}
          </tbody>
        </table></LiquidScrollArea>
        <h3>Controller</h3>
        <p><code>configure(settings)</code>, <code>pause()</code> and <code>resume()</code> control playback. <code>seek(seconds)</code> selects a source time. <code>seekFrame(index)</code> selects a zero-based frame from 0 to 44.</p>
        <p><code>snapshot()</code> reports runtime state. <code>readPixels()</code> returns top-to-bottom RGBA bytes at the canvas resolution. The component calls <code>destroy()</code> on unmount.</p>
      </div></ComponentSection>
      <ComponentSource name="brick-noise" />
    </div>
  </main></div>;
}
