import { ComponentDetail } from "@/components/component-detail";
import { NilkamalDemo } from "@/components/nilkamal-demo";
import { nilkamal } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(nilkamal);

export default function NilkamalPage() {
  return <ComponentDetail
    item={nilkamal}
    layout="split"
    fullHref="/view/nilkamal"
    idea={<p>A blue lotus responds to changing weather on a living pond. Snow gathers on petals and pads, hail bounces on the water, and clear weather and rain gradually melt the ice.</p>}
    interaction={<><p>Hover over petals or hold and pull the lotus. Brush the pond to make ripples. Tab to the lotus or pond and press Enter for keyboard interaction.</p><p>Choose weather, change its intensity, adjust the bloom and volume, or save the scene as a PNG. Sound starts after interaction, and the sound control mutes it.</p><p>Pause, hidden tabs and offscreen previews stop animation and sound. Reduced motion shows still weather states without lightning flashes.</p></>}
  >
    <NilkamalDemo />
  </ComponentDetail>;
}
