import { ComponentDetail } from "@/components/component-detail";
import { HalftoneDemo } from "@/components/halftone-demo";
import { halftone } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(halftone);

export default function HalftonePage() {
  return <ComponentDetail
    item={halftone}
    layout="self-contained"
    fullHref="/view/halftone"
    idea={<p>A dot field blends its palette with ambient motion and an eased pointer trail. Its colors and fade direction can be adjusted independently.</p>}
    interaction={<><p>Move over the preview to light the dots and leave a trail. Turning Animate off freezes ambient motion while the pointer stays active. Replay restarts the scene; Reset restores the default settings.</p><p>Change the palette, dot geometry, trail and fade direction with the controls. Reduced motion disables ambient animation and pointer effects. A CSS dot pattern remains if WebGL 2 is unavailable.</p></>}
    attribution={<><p>Adapted from <a href="https://uibrik.com/components/halftone" target="_blank" rel="noreferrer">uibrik Halftone by Malay</a>, linked in <a href="https://x.com/pmalay694/status/2124541484338966808" target="_blank" rel="noreferrer">the original post</a>. The grid, noise, palette blending and pointer trail are preserved; the default colors and packaging are changed.</p><p>The included license retains uibrik&apos;s MIT terms for free components and the Ashima Arts, Stefan Gustavson and David Hoskins shader notices. Modulo&apos;s source gate does not change the upstream license.</p></>}
  >
    <HalftoneDemo />
  </ComponentDetail>;
}
