import { ComponentDetail } from "@/components/component-detail";
import { cubeArchive } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(cubeArchive);

const projectProps = [
  ["projects", "readonly CubeArchiveProject[]", "Required", "Project order, title, category, description, featured media and case images."],
  ["startAt", "number", "0", "Initial selected project index. Values outside the list are clamped."],
] satisfies readonly (readonly [string, string, string, string])[];

export default function CubeArchiveDocumentation() {
  return <>
    <ComponentDetail
      item={cubeArchive}
      layout="embedded-page"
      fullHref="/play/cube-archive"
      idea={<p>Each project occupies a face of the selector. The selected image turns forward as you move through the archive, then opens into a larger case view.</p>}
      interaction={<p>Scroll, swipe, use the arrow keys, or choose a numbered index. Activate the selected image to open its case. Back returns to the same project, while Info opens its description.</p>}
    >
      <iframe
        src="/play/cube-archive"
        title="Cube Archive project selector and case view"
        allow="autoplay"
        style={{ display: "block", width: "100%", height: 760, border: 0 }}
      />
    </ComponentDetail>
    <div className={[styles.page, styles.main].join(" ")}>
      <section className={[styles.panel, styles.docPanel, styles.api].join(" ")}>
        <h2>Project data</h2>
        <table>
          <thead><tr><th>Prop</th><th>Type and use</th><th>Default</th></tr></thead>
          <tbody>{projectProps.map(([name, type, fallback, description]) => (
            <tr key={name}>
              <td><code>{name}</code></td>
              <td><code>{type}</code><span>{description}</span></td>
              <td>{fallback}</td>
            </tr>
          ))}</tbody>
        </table>
        <h3>Featured media</h3>
        <p>Use image media with a source and alt description, or video media with a source, poster and alt description. Case images each need their own source and alt text.</p>
      </section>
    </div>
  </>;
}
