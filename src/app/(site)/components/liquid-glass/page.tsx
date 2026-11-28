import { ComponentDetail } from "@/components/component-detail";
import { LiquidGlassDemo } from "@/components/liquid-glass-demo";
import { ComponentSection } from "@/components/component-section";
import { liquidGlass } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(liquidGlass);

const usage = `import { LiquidGlass } from "@/components/liquid-glass/liquid-glass";

export function Example() {
  return <LiquidGlass
    mode="lucid"
    source={{ kind: "image", src: "/photo.jpg", alt: "A portrait" }}
    label="Portrait through liquid glass"
    cornerMorph={0.35}
  />;
}`;

const properties = [
  ["mode", '"chroma" | "swell" | "lucid" | "mist"', '"chroma"', "Chromatic dispersion, stronger curvature, clear transmission, or Gaussian frosting."],
  ["source", "LiquidGlassSource", "Typography", 'Typography accepts lines, displayFont and serifFont. Images use { kind: "image", src, alt }.'],
  ["label", "string", "Derived from source", "Accessible name for the rendered scene."],
  ["cornerMorph", "number", "0.35", "Lucid corner deformation from 0 to 1. Other modes ignore this setting."],
  ["reducedMotion", "boolean", "false", "Use the still pointer path. The system preference also applies."],
  ["className / style", "string / CSSProperties", "Optional", "Style the scene container."],
] as const;

export default function LiquidGlassPage() {
  return <>
    <ComponentDetail
      item={liquidGlass}
      layout="split"
      fullHref="/view/liquid-glass"
      idea={<><p>The lens traces refraction through the rendered scene beneath it. Reflections follow the glass surface, while Chroma separates the transmitted red, green and blue samples.</p><pre style={{ maxWidth: "100%", overflowX: "auto", padding: 16, background: "var(--surface)", color: "var(--butter)", fontSize: 13, lineHeight: 1.6 }}><code>{usage}</code></pre></>}
      interaction={<><p>Move the pointer across the lens or focus the preview and use the arrow keys. Choose typography, a photograph, an illustration or a local image. The image stays in your browser.</p><p>Lucid adds a small corner deformation. Mist blurs the scene beneath the glass and keeps the lens marks sharp. Reduced motion stops the pointer-follow movement.</p></>}
      attribution={<p>Adapted from <a href="https://x.com/desdivj/status/2124447391416033354" target="_blank" rel="noreferrer">desdivj&apos;s Liquid Glass reference</a>. The original implementation was unavailable. This component reconstructs the visible optical behavior with an independent WebGL implementation.</p>}
    >
      <LiquidGlassDemo />
    </ComponentDetail>
    <ComponentSection title="Properties" id="properties">
      <div style={{ maxWidth: 1000, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead><tr><th scope="col" style={{ padding: "10px 14px 10px 0" }}>Property</th><th scope="col" style={{ padding: 10 }}>Type</th><th scope="col" style={{ padding: 10 }}>Default</th><th scope="col" style={{ padding: 10 }}>Description</th></tr></thead>
          <tbody>{properties.map(([name, type, defaultValue, description]) => <tr key={name}>
            <th scope="row" style={{ padding: "10px 14px 10px 0", verticalAlign: "top", fontWeight: 550 }}>{name}</th>
            <td style={{ padding: 10, verticalAlign: "top", color: "var(--quiet)" }}>{type}</td>
            <td style={{ padding: 10, verticalAlign: "top", color: "var(--quiet)" }}>{defaultValue}</td>
            <td style={{ padding: 10, verticalAlign: "top", color: "var(--quiet)" }}>{description}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </ComponentSection>
  </>;
}
