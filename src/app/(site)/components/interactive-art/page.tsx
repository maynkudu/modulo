import { ComponentDetail } from "@/components/component-detail";
import { GardenDemo } from "@/components/garden-demo";
import { interactiveArt } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(interactiveArt);

export default function InteractiveArtPage() {
  return <ComponentDetail
    item={interactiveArt}
    layout="split"
    fullHref="/view/interactive-art"
    idea={<p>A lotus garden grows through a day and night cycle. Individual flowers bend under the pointer and return when released.</p>}
    interaction={<><p>Hover over a flower, or hold and pull it. Pause the garden, bend a lotus, advance time or start again from the controls.</p><p>Change the growth speed and save the whole scene or selected artwork layers as a PNG. Reduced motion keeps the garden still; Advance 20 seconds lets you inspect its later growth.</p></>}
  >
    <GardenDemo />
  </ComponentDetail>;
}
