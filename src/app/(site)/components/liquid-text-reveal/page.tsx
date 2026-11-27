import { ComponentDetail } from "@/components/component-detail";
import { liquidTextReveal } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(liquidTextReveal);

export default function LiquidTextRevealPage() {
  return <ComponentDetail
    item={liquidTextReveal}
    layout="embedded-page"
    fullHref="/view/liquid-text-reveal"
    idea={<p>Words resolve from a liquid edge into sharp text as you scroll. Scrolling back reverses the reveal in reading order.</p>}
    interaction={<><p>Scroll inside the preview to move through the four reveal passages. Change the color with the demo&apos;s controls, then scroll back to reverse the effect.</p><p>Open the full preview for a complete reading page. Reduced motion keeps the text sharp.</p></>}
  >
    <iframe src="/view/liquid-text-reveal" title="Liquid Text Reveal interactive reading preview" style={{ display: "block", width: "100%", height: 760, border: 0 }} />
  </ComponentDetail>;
}
