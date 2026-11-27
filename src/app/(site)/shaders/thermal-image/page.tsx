import { ComponentDetail } from "@/components/component-detail";
import { ThermalImageDemo } from "@/components/thermal-image-demo";
import { thermalImage } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(thermalImage);

export default function ThermalImagePage() {
  return <ComponentDetail
    item={thermalImage}
    layout="self-contained"
    fullHref="/view/thermal-image"
    idea={<p>A flat photograph passes through the recovered thermal pipeline. Luminance and transparency drive the blur wave, a five-stop spectrum maps the image, and the studio field adds a soft floor and reflection.</p>}
    interaction={<><p>Choose Thermal, Night vision, Ultraviolet, or Ice from the Effect control. These are stylized color treatments, not sensor readings. Upload another image to try the same field with your own artwork.</p><p>Adjust speed, blur wave, halo and texture, or switch between the recovered field and the studio background. Replay restarts the renderer. Reset restores the studio defaults. Reduced motion freezes the field; if WebGL is unavailable, the source image stays blurred.</p></>}
    attribution={<p>The effect is a 2D adaptation of the heatcar shader at <a href="https://www.blankinterfaces.com/f1/heatcar.html" target="_blank" rel="noreferrer">Blank Interfaces</a>. The reference credits Studio Gruhl&apos;s Rerun gear film. This version uses a cleaned user-supplied Porsche image and keeps the source comparison package separate from the installable component.</p>}
  >
    <ThermalImageDemo />
  </ComponentDetail>;
}
