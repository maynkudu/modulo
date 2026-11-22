import Link from "next/link";
import { PortraitWaveDemo } from "@/components/portrait-wave-demo";
import { PortraitPreparation } from "@/components/portrait-preparation";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { portraitWave } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(portraitWave);
const usage = `import { PortraitWave } from "@/components/portrait-wave/PortraitWave";

const images = ["/portrait-a.png", "/portrait-b.png", "/portrait-c.png"];

export default function Example() {
  return <PortraitWave images={images} />;
}`;
const properties = [
  ["images", "readonly string[]", "Required", "Ordered image URLs, up to 64. Replacements cancel pending loads and correspondence workers."],
  ["paused", "boolean", "false", "Stops playback without resetting time."],
  ["warp", "number", "1", "Spatial deformation strength from 0 to 2. Zero removes geometric deformation."],
  ["durationMs", "number", "1940", "Positive loop duration. Changing it recreates the renderer and resets playback."],
  ["tileDelayMs", "number", "40", "Nonnegative delay per row and column. Changing it recreates the renderer."],
  ["alt", "string", "Portrait description", "Accessible description of the rendered portraits."],
  ["className / style", "string / CSSProperties", "Optional", "The component fills a 401:301 container."],
  ["onReady", "(controller | null) => void", "Optional", "Renderer on mount, null on cleanup or unrecoverable graphics failure."],
  ["onState", "(PortraitShaderState) => void", "Optional", "Empty, loading, ready, error or disposed. A failed replacement retains the previous valid textures."],
  ["onTime", "(milliseconds: number) => void", "Optional", "Source time after a rendered frame. Avoid React updates on every frame."],
];

export default function PortraitWavePage() {
  return <div className={styles.page}><main className={styles.main} id="content">
    <StructuredData data={getComponentStructuredData(portraitWave)} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
      <li><Link href="/">Home</Link></li><li><Link href="/shaders">Shaders</Link></li><li aria-current="page">Portrait wave</li>
    </ol></nav>
    <div className={styles.heading}>
      <div><h1>{portraitWave.title}</h1><p>{portraitWave.description}</p></div>
      <ComponentHeadingActions name="portrait-wave" />
    </div>
    <div className={styles.sections}>
      <ComponentSection title="Preview" id="preview"><div className={styles.demo}><PortraitWaveDemo /></div></ComponentSection>
      <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
        <InstallCommand name="portrait-wave" />
        <h3>Usage</h3><LiquidCode><code>{usage}</code></LiquidCode>
        <p>React 19.2 or newer, WebGL 2 and a Web Worker. The component, renderer, correspondence worker and stylesheet install together without additional npm dependencies. An optional local portrait-alignment script is included.</p>
        <p>Use same-origin images, browser object URLs or remote images with CORS access. A restrictive Content Security Policy must allow your image sources and <code>worker-src &apos;self&apos; blob:</code>.</p>
        <p>Empty arrays render black. One image stays still. Reduced motion displays the first portrait. Hidden tabs and offscreen canvases stop animation. The first image remains as a fallback if WebGL is unavailable.</p>
        <ComponentMediaLinks component={portraitWave} />
        <h3>Reference and sample images</h3>
        <p>Inspired by <a href="https://pin.it/24VEWvBBt" target="_blank" rel="noreferrer">this Pinterest animation</a>. The original morph maps and masks are unavailable, and exact fidelity did not pass. This is the approved reconstruction.</p>
        <p>Sample photos by <a href="https://unsplash.com/photos/rDEOVtE7vOs" target="_blank" rel="noreferrer">Christopher Campbell</a> and <a href="https://unsplash.com/photos/mEZ3PoFGs_k" target="_blank" rel="noreferrer">Michael Dam</a>, used under the Unsplash License. They are temporary portraits and have not been processed with the preparation prompt.</p>
      </div></ComponentSection>
      <ComponentSection title="Prepare your images" id="preparation"><div className={`${styles.panel} ${styles.docPanel}`}>
        <p>Attach one authorized photo to an image editor and use this prompt for each person. Keep the original for identity review. This is a consistent preparation template, not the original artist&apos;s process.</p>
        <PortraitPreparation />
        <h3>Check alignment</h3>
        <p>A prompt cannot guarantee matching facial landmarks. Review identity, direct gaze and neutral expression first. Then mark the two pupil centers and align the whole image with uniform scaling, rotation and cropping. Do not stretch individual facial features.</p>
        <p>Export opaque grayscale PNGs at 1604 by 1204 pixels. The proposed pupil targets are (620, 400) and (1020, 400), or (155, 100) and (255, 100) at 401 by 301. Re-mark the exported pupils and check them within 4 pixels on the larger image. These targets are a preparation choice, not recovered anatomical landmarks.</p>
        <p>The installed <code>align_portrait.py</code> script uses manually marked pupils, refuses missing crop coverage and records its transform. It requires Python with Pillow. It does not detect faces or generate images.</p>
        <LiquidCode><code>{`python src/components/portrait-wave/align_portrait.py input.png prepared.png \\\n  --eyes LEFT_X LEFT_Y RIGHT_X RIGHT_Y --scale 4`}</code></LiquidCode>
      </div></ComponentSection>
      <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
        <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Portrait wave properties"><table>
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>
            {properties.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}
          </tbody>
        </table></LiquidScrollArea>
        <h3>Controller</h3>
        <p><code>setImages(urls)</code> replaces the array and returns a promise that resolves to success or cancellation. <code>pause()</code>, <code>resume()</code> and <code>seek(milliseconds)</code> control playback. <code>setWarp(value)</code> changes deformation strength.</p>
        <p><code>snapshot()</code> reports state, time, visibility, reduced motion and owned resources. The component calls <code>dispose()</code> on unmount. Remount it to retry after a lost graphics context.</p>
      </div></ComponentSection>
      <ComponentSource name="portrait-wave" />
    </div>
  </main></div>;
}
