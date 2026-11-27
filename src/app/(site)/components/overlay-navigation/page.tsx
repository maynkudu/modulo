import { ComponentDetail } from "@/components/component-detail";
import { OverlayNavigationDemo } from "@/components/overlay-navigation-demo";
import { overlayNavigation } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(overlayNavigation);

export default function OverlayNavigationPage() {
  return <ComponentDetail
    item={overlayNavigation}
    layout="embedded-page"
    fullHref="/view/overlay-navigation"
    idea={<p>A full-screen navigation menu pairs its route list with changing previews. It preserves the portfolio navigation before its redesign, including its toggle, link dimming and map circles.</p>}
    interaction={<><p>Open the menu, then hover or focus a route to change the preview. Escape closes the menu and restores focus. Tab stays inside the menu while it is open.</p><p>Switch between the demo&apos;s Fine and Bold layouts. Reduced motion shows the same navigation states immediately.</p></>}
  >
    <OverlayNavigationDemo />
  </ComponentDetail>;
}
