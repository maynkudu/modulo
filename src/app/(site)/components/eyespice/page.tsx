import Link from "next/link";
import { EyeSpiceDemo } from "@/components/eyespice-demo";
import { ComponentHeadingActions } from "@/components/component-heading-actions";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSection } from "@/components/component-section";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { LiquidCode } from "@/components/liquid-documentation";
import { StructuredData } from "@/components/structured-data";
import { LiquidScrollArea } from "@/registry/liquid-animations/LiquidScrollbar";
import { eyeSpice } from "@/lib/catalog";
import { getComponentMetadata, getComponentStructuredData } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(eyeSpice);
const usage = `import { EyeSpice } from "@/components/eyespice/EyeSpice";

export default function Example() {
  return <EyeSpice />;
}`;
const properties = [
  ["tracking", "boolean", "true", "Follow pointer movement anywhere in the window. False freezes the gaze and disables automatic proximity closure."],
  ["paused", "boolean", "false", "Freeze gaze and eyelids. Resume continues from the current pose."],
  ["closeDistance", "number", ".19", "Distance from the displayed eye center, relative to the smaller canvas dimension. Range 0 to .45."],
  ["reopenDistance", "number", ".245", "Retreat threshold. Must be at least closeDistance and no more than .6."],
  ["reducedMotion", "boolean", "false", "Apply gaze and eyelid states immediately. The system preference also applies."],
  ["alt", "string", "Eye description", "Accessible description of the rendered eye."],
  ["className / style", "string / CSSProperties", "Optional", "The scene fills its square container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller after textures render, null on cleanup or graphics failure."],
  ["onFrame", "(snapshot) => void", "Optional", "Gaze, eyelid state, visibility, reduced motion and GPU resource counts. Avoid updating React state every frame."],
  ["onError", "(error: Error) => void", "Optional", "Graphics initialization, texture loading or context loss."],
];

export default function EyeSpicePage() {
  return <div className={styles.page}><main className={styles.main} id="content">
    <StructuredData data={getComponentStructuredData(eyeSpice)} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><ol>
      <li><Link href="/">Home</Link></li><li><Link href="/components">Components</Link></li><li aria-current="page">EyeSpice</li>
    </ol></nav>
    <div className={styles.heading}>
      <div><h1>{eyeSpice.title}</h1><p>{eyeSpice.description}</p></div>
      <ComponentHeadingActions name="eyespice" />
    </div>
    <div className={styles.sections}>
      <ComponentSection title="Preview" id="preview"><div className={styles.demo}><EyeSpiceDemo /></div></ComponentSection>
      <ComponentSection title="Installation" id="installation"><div className={`${styles.panel} ${styles.docPanel} ${styles.install}`}>
        <InstallCommand name="eyespice" />
        <h3>Usage</h3><LiquidCode><code>{usage}</code></LiquidCode>
        <p>React 19.2 or newer and Three.js 0.186. All seven component files install together with relative internal imports.</p>
        <ComponentMediaLinks component={eyeSpice} />
        <h3>Interaction</h3>
        <p>Move the cursor anywhere on the page. Approach the eye to close its curved eyelids, then retreat to reopen them. A new pointer target reverses an unfinished transition. Close eye and Open eye also work from the keyboard.</p>
        <p>Touch release and cancellation reopen the eye. Hidden tabs and offscreen scenes stop rendering. Reduced motion keeps the same controls with immediate gaze and eyelid changes.</p>
        <h3>Reference</h3>
        <p>The accepted appearance is reconstructed from <a href="https://www.pinterest.com/pin/794674296784100176/" target="_blank" rel="noreferrer">the eye animation attributed to @o6scure</a>. Surface maps derive from its rendered views. The original authoring rig was unavailable, and this reconstruction is not a verified 1:1 copy. The inspected source did not state reuse terms.</p>
      </div></ComponentSection>
      <ComponentSection title="API" id="api"><div className={`${styles.panel} ${styles.docPanel} ${styles.api}`}>
        <LiquidScrollArea orientation="horizontal" viewportClassName={styles.tableScroll} role="region" aria-label="EyeSpice properties"><table>
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>
            {properties.map(([name, type, value, description]) => <tr key={name}><td><code>{name}</code><span>{description}</span></td><td><code>{type}</code></td><td><code>{value}</code></td></tr>)}
          </tbody>
        </table></LiquidScrollArea>
        <h3>Controller</h3>
        <p><code>configure(settings)</code> updates interaction without rebuilding the scene. <code>setClosed(true)</code> closes the eye and <code>setClosed(false)</code> opens it. <code>setClosed(null)</code> returns eyelids to proximity control. Pointer movement also restores proximity control.</p>
        <p><code>setPointer(x, y)</code> accepts viewport coordinates. <code>snapshot()</code> reports current state. The component calls <code>destroy()</code> on unmount to dispose listeners, observers, geometry, textures and render targets.</p>
      </div></ComponentSection>
      <ComponentSource name="eyespice" />
    </div>
  </main></div>;
}
