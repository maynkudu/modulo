import { ComponentDetail } from "@/components/component-detail";
import { SnapRailDemo } from "@/components/snap-rail-demo";
import { snapRail } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(snapRail);

export default function SnapRailPage() {
  return <ComponentDetail
    item={snapRail}
    layout="split"
    fullHref="/view/snap-rail"
    idea={<p>A draggable item projects a destination from its release speed, then springs to the nearest stop. Grab it again to interrupt the movement.</p>}
    interaction={<><p>Drag horizontally and release. Holding before release discards stale flick speed. Change the selected destination, projection time and preview hysteresis with the controls.</p><p>Use the destination buttons, arrow keys, Home or End. Cancellation returns to the selected stop without committing. Reduced motion selects a destination immediately, and hidden or offscreen previews stop animation.</p></>}
    attribution={<p>The spring tuning and projection are original examples. They are not Apple implementation constants.</p>}
  >
    <SnapRailDemo />
  </ComponentDetail>;
}
