import Link from "next/link";
import { ComponentDetail } from "@/components/component-detail";
import { PorscheGT3RSDemo } from "@/components/porsche-gt3rs-demo";
import { getCatalogPath, porscheGT3RS } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(porscheGT3RS);

export default function PorscheGT3RSPage() {
  return <>
    <ComponentDetail item={porscheGT3RS} layout="self-contained" fullHref="/view/porsche-gt3rs"
      idea={<p>A 992-generation GT3 RS modeled from the olive side profile, Porsche studio photographs and underbody lift photographs. Configure its paint and wheel finish, inspect the body under studio lighting, and see the same GLB in <Link href={getCatalogPath("thermal-image")}>Thermal Image</Link>.</p>}
      interaction={<p>Drag to orbit, or focus the car and use the arrow keys. Choose a view, paint color, wheel style and finish. Switch between Normal and Studio lighting, turn the lights on, or use Full screen for the 3D stage. Doors and interior controls are disabled while those features are unavailable.</p>}>
      <PorscheGT3RSDemo />
    </ComponentDetail>
  </>;
}
