import { ComponentDetail } from "@/components/component-detail";
import { spriteRacer } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(spriteRacer);

export default function SwitchbackDocumentation() {
  return <ComponentDetail
    item={spriteRacer}
    layout="embedded-page"
    fullHref="/play/sprite-racer"
    idea={<p>A driving game built from stacked artwork slices. Circuit races use ordered laps, while Drift Yard gives you two minutes to score.</p>}
    interaction={<><p>Use the arrow keys or WASD. Space applies the handbrake, R recovers the car and Escape pauses. Touch controls support accelerating and steering together.</p><p>Choose a car and map before starting. World layers separates and rotates the scene, while Inspect the car reveals its individual slices. Sound starts after a gesture and stops while paused or hidden.</p><p>Records and ghosts stay on this device. Reduced motion removes camera easing and particles.</p></>}
  >
    <iframe src="/play/sprite-racer" title="Play Switchback" allow="autoplay" style={{ display: "block", width: "100%", height: 760, border: 0 }} />
  </ComponentDetail>;
}
