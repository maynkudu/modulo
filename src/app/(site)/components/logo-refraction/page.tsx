import { ComponentDetail } from "@/components/component-detail";
import { LogoRefractionDemo } from "@/components/logo-refraction-demo";
import { logoRefraction } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(logoRefraction);

export default function LogoRefractionPage() {
  return <ComponentDetail
    item={logoRefraction}
    layout="self-contained"
    fullHref="/view/logo-refraction"
    idea={<p>Metallic light moves over the complete logo without changing its framing. A separate iridescent sweep and outline glint follow the n in the lower right.</p>}
    interaction={<><p>Move over the image to steer the light. Focus it and use the arrow keys to move the light, or Home to reset.</p><p>Adjust black refraction, dispersion and n sheen. Show original displays the PNG without the effect. Pause freezes time and pointer response.</p><p>Reduced motion, hidden tabs and offscreen previews stop animation. The original image remains visible if WebGL is unavailable.</p></>}
  >
    <LogoRefractionDemo />
  </ComponentDetail>;
}
