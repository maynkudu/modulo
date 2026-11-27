import { ComponentDetail } from "@/components/component-detail";
import { LiquidClusterDemo } from "@/components/liquid-cluster-demo";
import { liquidCluster } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(liquidCluster);

export default function LiquidClusterPage() {
  return <ComponentDetail
    item={liquidCluster}
    layout="split"
    fullHref="/view/liquid-cluster"
    idea={<p>Two independently operable buttons share a background that joins and separates. The connecting shape narrows as their gap opens, while the text stays rigid.</p>}
    interaction={<><p>Click the notification, or use Enter or Space, to reveal Clear. Clear dismisses the notification. Replay and Reset restore it.</p><p>Change Separation or use Join and Separate. A new value redirects the current movement. Right-click the preview or open More for the same actions and preferences.</p><p>Reduced motion applies the final shape directly. Opaque background removes transparency and the shared shadow. Native buttons remain available if Canvas cannot render.</p></>}
    attribution={<p>The background uses geometric smooth-union blending. This is an original adaptation of proximity merging, without physical fluid simulation or optical refraction.</p>}
  >
    <LiquidClusterDemo />
  </ComponentDetail>;
}
