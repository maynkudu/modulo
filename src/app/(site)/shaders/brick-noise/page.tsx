import { ComponentDetail } from "@/components/component-detail";
import { BrickNoiseDemo } from "@/components/brick-noise-demo";
import { brickNoise } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(brickNoise);

export default function BrickNoisePage() {
  return <ComponentDetail
    item={brickNoise}
    layout="self-contained"
    fullHref="/view/brick-noise"
    idea={<p>A fixed grid animates through measured tile brightness values. The shader renders the grid directly rather than playing a video or GIF.</p>}
    interaction={<><p>Pause to inspect any of the 45 frames. Reset returns to the first frame. Changing Speed preserves the current playback time.</p><p>Reduced motion, hidden tabs and offscreen previews stop automatic playback. The still image remains if the graphics renderer cannot start.</p></>}
    attribution={<p>Reconstructed from <a href="https://pin.it/63qzQQIsv" target="_blank" rel="noreferrer">this Pinterest animation</a>. The original noise formula and author are unavailable, and the reference does not state reuse terms.</p>}
  >
    <BrickNoiseDemo />
  </ComponentDetail>;
}
