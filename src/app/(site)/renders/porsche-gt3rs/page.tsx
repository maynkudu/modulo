import Link from "next/link";
import { ComponentDetail } from "@/components/component-detail";
import { InstallCommand } from "@/components/install-command";
import { PorscheGT3RSDemo } from "@/components/porsche-gt3rs-demo";
import { getCatalogPath, porscheGT3RS } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import styles from "../../page.module.css";

export const metadata = getComponentMetadata(porscheGT3RS);

export default function PorscheGT3RSPage() {
  return <>
    <ComponentDetail item={porscheGT3RS} layout="self-contained" fullHref="/view/porsche-gt3rs"
      idea={<p>A 992-generation GT3 RS modeled from the olive side profile, Porsche studio photographs and underbody lift photographs. Configure its paint and wheel finish, inspect the body under studio lighting, and see the same GLB in <Link href={getCatalogPath("thermal-image")}>Thermal Image</Link>.</p>}
      interaction={<p>Drag to orbit, or focus the car and use the arrow keys. Choose a view, paint color, wheel style and finish. Switch between Normal and Studio lighting, turn the lights on, or use Full screen for the 3D stage. Doors and interior controls are disabled while those features are unavailable.</p>}>
      <PorscheGT3RSDemo />
    </ComponentDetail>
    <div className={`${styles.page} ${styles.main}`}>
      <section className={`${styles.panel} ${styles.docPanel} ${styles.install}`}><h2>Use this render</h2><InstallCommand name={porscheGT3RS.name} />
        <pre><code>{'import { PorscheGT3RS } from "@/components/porsche-gt3rs/PorscheGT3RS";\n\n<PorscheGT3RS mode="Studio" paint="#68704b" wheel="Y-spoke" wheelFinish="#785b3b" lights />'}</code></pre>
        <p>Pass <code>src</code> to load a self-hosted GLB. Set <code>mode</code> to <code>Normal</code> or <code>Studio</code>, and configure <code>paint</code>, <code>wheel</code>, <code>wheelFinish</code> and <code>lights</code>. Use <code>view</code> and <code>onViewChange</code> to control azimuth, elevation and zoom.</p>
      </section>
    </div>
  </>;
}
