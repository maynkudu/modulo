import Link from "next/link";
import { HalftoneDemo } from "@/components/halftone-demo";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { halftone } from "@/lib/catalog";
import { halftoneControlGroups, halftoneNumericDefaults } from "@/lib/halftone-demo-settings";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(halftone);
const usage = `import { Halftone } from "@/components/halftone/Halftone";

export default function Example() {
  return <Halftone
    colors={["#2b0d05", "#9c2f14", "#f08a3c", "#fff1d6"]}
    background="#0a0403"
    spacing={7}
    radius={70}
    trailLength={0.9}
    style={{ width: "100%", aspectRatio: "1" }}
  />;
}`;
const properties = [
  ["colors", "string[]", "Copper palette", "Two to six hex colors, blended in OKLCH from dark to light."],
  ["background", "string", '"#0a0403"', "Color behind the dots."],
  ["animate", "boolean", "true", "Controls ambient motion. Pointer interaction remains available when animation is off."],
  ["interactive", "boolean", "true", "Enables the eased pointer trail."],
  ["speed", "number", "1", "Nonnegative animation multiplier. Zero freezes ambient time."],
  ...halftoneControlGroups.flatMap(group => group.fields.map(field => [field.key, "number", String(halftoneNumericDefaults[field.key]), field.description])),
  ["fadeFrom", '"edges" | "top" | "bottom" | "left" | "right"', '"edges"', "Direction toward which the dots fade."],
  ["maxFps", "number", "60", "Positive frame-rate cap. Resolution also steps down automatically on slow devices."],
  ["alt", "string", "Dot description", "Accessible description for a standalone shader."],
  ["className / style", "string / CSSProperties", "Optional", "Give the surface an explicit height or aspect ratio. It fills that box."],
  ["children", "ReactNode", "Optional", "Content layered above the background."],
  ["onReady", "(ready: boolean) => void", "Optional", "True after initialization; false on initialization fallback or cleanup. Keep the callback stable."],
];

export default function HalftonePage() {
  return <div className={styles.page}><main className={styles.main} id="content">
    <StructuredData data={getComponentStructuredData(halftone)} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
      <li><Link href="/">Home</Link></li><li><Link href="/shaders">Shaders</Link></li><li aria-current="page">Halftone</li>
    </ol></nav>
    <div className={styles.heading}>
      <div><h1>{halftone.title}</h1><p>{halftone.description}</p></div>
      <ComponentHeadingActions name="halftone" />
    </div>
    <div className={styles.sections}>
      <ComponentSection title="Preview" id="preview"><div className={styles.demo}><HalftoneDemo /></div></ComponentSection>
      <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
        <InstallCommand name="halftone" />
        <h3>Usage</h3><LiquidCode><code>{usage}</code></LiquidCode>
        <p>React 18 or newer and WebGL 2. The component, renderer, local stylesheet and upstream license install together. No additional npm dependencies or Tailwind setup are required.</p>
        <p>Give the surface a height or aspect ratio. Children render above the shader, so it can also be used behind a heading or page content.</p>
        <ComponentMediaLinks component={halftone} />
        <h3>Playback and hover</h3>
        <p>Move across the preview to light the dots and leave a liquid trail. Turning Animate off freezes ambient motion while the pointer remains active. Replay restarts the scene; Reset restores the default settings.</p>
        <p>Reduced motion disables ambient animation and pointer effects. Hidden tabs and offscreen surfaces suspend rendering. Without WebGL 2, a CSS dot pattern remains visible.</p>
        <h3>Reference and license</h3>
        <p>Adapted from <a href="https://uibrik.com/components/halftone" target="_blank" rel="noreferrer">uibrik Halftone by Malay</a>, linked in <a href="https://x.com/pmalay694/status/2124541484338966808" target="_blank" rel="noreferrer">the original post</a>. The grid, noise, palette blending and pointer trail are preserved; the default colors and packaging are changed.</p>
        <p>The installed LICENSE retains uibrik&apos;s MIT terms for free components. The shared shader keeps the Ashima Arts, Stefan Gustavson and David Hoskins notices. Modulo&apos;s source gate does not change the upstream license.</p>
      </div></ComponentSection>
      <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
        <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="Halftone properties"><table>
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
          <tbody>{properties.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}</tbody>
        </table></LiquidScrollArea>
        <p>Use positive finite spacing, radius, band width and trail lifetime. Keep speed nonnegative and maxFps positive. The preview controls supply bounded values. Other settings update the existing renderer without resetting its clock.</p>
      </div></ComponentSection>
      <ComponentSource name="halftone" />
    </div>
  </main></div>;
}
