import Link from "next/link";
import { ImageMosaicDemo } from "@/components/image-mosaic-demo";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { imageMosaicItem } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

const component = imageMosaicItem;
export const metadata = getComponentMetadata(component);
const usage = `import { ImageMosaic } from "@/components/image-mosaic/ImageMosaic";

export default function Example() {
  return <ImageMosaic
    src="/photo.jpg"
    alt="Describe your image"
    cellSize={12}
    detail={0.6}
    finish="chrome"
    refraction={0.4}
  />;
}`;
const properties = [
  ["src", "string", "Required", "Image URL. Remote images must permit cross-origin canvas access."],
  ["alt", "string", "Required", "Accessible description of the image."],
  ["cellSize", "number", "12", "Base cell size in CSS pixels, clamped from 4 to 80."],
  ["detail", "number", "0.6", "Color and edge subdivision sensitivity from 0 to 1."],
  ["seed", "number", "0", "Element assignment seed. Changing it reshuffles color-neighbor choices while preserving geometry."],
  ["finish", '"chrome" | "brushed" | "iridescent"', '"chrome"', "Metallic material finish."],
  ["refraction", "number", "0.4", "Refraction strength from 0 to 1."],
  ["animated", "boolean", "true", "Ambient metallic lighting. Pointer optics remain available independently."],
  ["autoPlay", "boolean", "true", "Stepped idle comparison. Pointer and keyboard input interrupt playback."],
  ["className / style", "string / CSSProperties", "Optional", "Layout overrides. The image keeps its natural aspect ratio."],
];

export default function ImageMosaicPage() {
  return <div className={styles.page}><main className={styles.main} id="content">
    <StructuredData data={getComponentStructuredData(component)} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
      <li><Link href="/">Home</Link></li><li><Link href="/shaders">Shaders</Link></li><li aria-current="page">Image mosaic</li>
    </ol></nav>
    <div className={styles.heading}>
      <div><h1>{component.title}</h1><p>{component.description}</p></div>
      <ComponentHeadingActions name="image-mosaic" />
    </div>
    <div className={styles.sections}>
      <ComponentSection title="Preview" id="preview"><div className={styles.demo}><ImageMosaicDemo /></div></ComponentSection>
      <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
        <InstallCommand name="image-mosaic" />
        <h3>Usage</h3><LiquidCode><code>{usage}</code></LiquidCode>
        <p>React 18 or newer and WebGL 1. The renderer, element data, local stylesheet, embedded variable Geist font and font license install together. No additional graphics package is required.</p>
        <p>Supply a same-origin image, a local blob URL or an image that permits CORS. The public upload control processes images in your browser. Upload controls and demo photographs belong to the example, so you can connect the component to your own image picker.</p>
        <ComponentMediaLinks component={component} />
        <h3>Interaction</h3>
        <p>Drag the comparison line or use the arrow keys, Home and End. Colorful regions receive smaller element cards. Full cards show atomic number, symbol, name and weight; smaller cells use symbols, then dots or crosses to keep dense areas readable.</p>
        <p>Metallic sweeps vary in pattern, angle, width and timing. Hover adds reflection and refraction with a fading trail. Reduced motion freezes decorative animation and clears pointer effects. Hidden tabs and offscreen surfaces suspend rendering. If WebGL is unavailable, the original image remains visible.</p>
        <h3>Data and font</h3>
        <p>The 118-element dataset uses pinned PubChem, CIAAW and IUPAC sources. Display colors are illustrative. The installed provenance files record those sources and the Geist revision. Keep the included SIL Open Font License with the font.</p>
      </div></ComponentSection>
      <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
        <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Image mosaic properties"><table>
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
          <tbody>{properties.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}</tbody>
        </table></LiquidScrollArea>
      </div></ComponentSection>
      <ComponentSource name="image-mosaic" />
    </div>
  </main></div>;
}
