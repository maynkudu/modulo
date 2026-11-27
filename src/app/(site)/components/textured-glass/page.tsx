import { ComponentDetail } from "@/components/component-detail";
import { TexturedGlassDemo } from "@/components/textured-glass-demo";
import { texturedGlass } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(texturedGlass);

export default function TexturedGlassPage() {
  return <ComponentDetail
    item={texturedGlass}
    layout="split"
    fullHref="/view/textured-glass"
    idea={<p>A depth estimate shapes a photograph into a mesh behind textured glass. Closer objects move differently from distant ones as the camera and light move.</p>}
    interaction={<><p>Move across the image, or focus it and use the arrow keys, to change the camera angle and light. Adjust glass, depth, focus and blur with the controls. Depth map shows the estimate with brighter areas closer to you.</p><p>Uploads stay in your browser. The first upload downloads Depth Anything V2 Small for local analysis; later uploads reuse the model. The demo accepts images up to 20 MB. Use default restores the sample, and Save PNG captures the current view.</p><p>Depth is estimated from one photograph, so large movements can stretch object boundaries. Pause freezes the camera and light. Reduced motion keeps a still view while uploads and settings remain available.</p></>}
    attribution={<p>Reconstructed from <a href="https://x.com/neilsonks/status/2118757539957633115" target="_blank" rel="noreferrer">Neilson Koerner-Safrata&apos;s video</a>. The original shader is unpublished, so exact fidelity has not been verified.</p>}
  >
    <TexturedGlassDemo />
  </ComponentDetail>;
}
