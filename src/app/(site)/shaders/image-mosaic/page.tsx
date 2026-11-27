import { ComponentDetail } from "@/components/component-detail";
import { ImageMosaicDemo } from "@/components/image-mosaic-demo";
import { imageMosaicItem } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(imageMosaicItem);

export default function ImageMosaicPage() {
  return <ComponentDetail
    item={imageMosaicItem}
    layout="self-contained"
    fullHref="/view/image-mosaic"
    idea={<p>Color variation determines the mosaic density. Full element cards show atomic number, symbol, name and weight. Smaller cells use symbols, then dots or crosses, to keep dense areas readable.</p>}
    interaction={<><p>Drag the comparison line, or use the arrow keys, Home and End. Upload a photograph, change the metallic finish and detail, then move across the elements to add reflection, refraction and a fading trail.</p><p>Metallic sweeps vary in pattern, angle, width and timing. Reduced motion freezes decorative animation and clears pointer effects. Hidden or offscreen previews suspend rendering. The original image remains visible if WebGL is unavailable.</p></>}
    attribution={<p>The 118-element dataset uses pinned PubChem, CIAAW and IUPAC sources. Display colors are illustrative. The provenance files record those sources and the Geist revision. Keep the included SIL Open Font License with the font.</p>}
  >
    <ImageMosaicDemo />
  </ComponentDetail>;
}
