import { ComponentDetail } from "@/components/component-detail";
import { PortraitWaveDemo } from "@/components/portrait-wave-demo";
import { portraitWave } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(portraitWave);

export default function PortraitWavePage() {
  return <ComponentDetail
    item={portraitWave}
    layout="self-contained"
    fullHref="/view/portrait-wave"
    idea={<p>An ordered set of portraits deforms and transitions across a tiled wave. The preview can use the sample portraits or images chosen from your device.</p>}
    interaction={<><p>Upload up to 64 images, change deformation, pause or resume, and scrub through the transition. Use consistent framing and aligned eyes for a clearer comparison.</p><p>One image stays still. Reduced motion displays the first portrait, and hidden or offscreen previews stop animation. The first image remains as a fallback if WebGL is unavailable.</p></>}
    attribution={<><p>Inspired by <a href="https://pin.it/24VEWvBBt" target="_blank" rel="noreferrer">this Pinterest animation</a>. The original morph maps and masks are unavailable, and exact fidelity did not pass. This is the approved reconstruction.</p><p>Sample photos by <a href="https://unsplash.com/photos/rDEOVtE7vOs" target="_blank" rel="noreferrer">Christopher Campbell</a> and <a href="https://unsplash.com/photos/mEZ3PoFGs_k" target="_blank" rel="noreferrer">Michael Dam</a>, used under the Unsplash License. They are temporary portraits and have not been processed with the preparation prompt.</p></>}
  >
    <PortraitWaveDemo />
  </ComponentDetail>;
}
