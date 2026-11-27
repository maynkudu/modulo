import { ComponentDetail } from "@/components/component-detail";
import { Diwali26Demo } from "@/components/diwali-26-demo";
import { diwali26 } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(diwali26);

export default function Diwali26Page() {
  return <ComponentDetail
    item={diwali26}
    layout="split"
    fullHref="/view/diwali-26"
    idea={<p>Lotus rangoli sits beneath a night sky. Floral bursts, DIWALI and 2026 skyshots share the same scene, with separate whistles, booms and crackle tails.</p>}
    interaction={<><p>Click the open sky to launch at that point. Brush the rangoli to move petals, leaves and powder. Tab to the sky or a flower and press Enter for keyboard interaction.</p><p>Choose a pattern, change volume, pause or clear the sky, and save the current artwork. Sound starts after interaction. The sound control mutes the scene and haptics; vibration depends on the browser and device.</p><p>Hidden tabs and offscreen scenes stop animation and sound. Reduced motion keeps the rangoli still and draws skyshots without rocket motion or flashes.</p></>}
  >
    <Diwali26Demo />
  </ComponentDetail>;
}
