import Link from "next/link";
import { ComponentDetail } from "@/components/component-detail";
import { ComponentMediaLinks } from "@/components/component-media-links";
import { ComponentSource } from "@/components/component-source";
import { InstallCommand } from "@/components/install-command";
import { PorscheGT3RSDemo } from "@/components/porsche-gt3rs-demo";
import { getCatalogPath, porscheGT3RS } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(porscheGT3RS);

export default function PorscheGT3RSPage() {
  return <>
    <ComponentDetail item={porscheGT3RS} layout="self-contained" fullHref="/view/porsche-gt3rs"
      idea={<p>A 992-generation GT3 RS modeled from the olive side profile, Porsche studio photographs and underbody lift photographs. The same GLB supplies the car in <Link href={getCatalogPath("thermal-image")}>Thermal Image</Link>.</p>}
      interaction={<p>Drag to orbit, or focus the car and use the arrow keys. Choose Roof or Underbody for a straight-on inspection. Use plus and minus to zoom, and Home to reset.</p>}>
      <PorscheGT3RSDemo />
    </ComponentDetail>
    <div className={`${styles.page} ${styles.main}`}>
      <section className={`${styles.panel} ${styles.docPanel} ${styles.install}`}><h2>Use this render</h2><InstallCommand name={porscheGT3RS.name} />
        <pre><code>{'import { PorscheGT3RS } from "@/components/porsche-gt3rs/PorscheGT3RS";\n\n<PorscheGT3RS />'}</code></pre>
        <p>Pass <code>src</code> to load a self-hosted GLB. Use <code>view</code> and <code>onViewChange</code> to control azimuth, elevation and zoom.</p>
        <ComponentMediaLinks component={porscheGT3RS} />
      </section>
      <ComponentSource name={porscheGT3RS.name} />
    </div>
  </>;
}
