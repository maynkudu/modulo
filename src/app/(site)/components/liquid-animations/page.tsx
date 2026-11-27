import { ComponentDetail } from "@/components/component-detail";
import { LiquidAnimationsDemo } from "@/components/liquid-animations-demo";
import { liquidAnimations } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(liquidAnimations);

export default function LiquidAnimationsPage() {
  return <ComponentDetail
    item={liquidAnimations}
    layout="self-contained"
    fullHref="/view/liquid-animations"
    idea={<p>Menus, selects, tooltips and other controls change shape while their text, icons and swatches keep their size.</p>}
    interaction={<><p>Choose an example, change the motion speed, then open a popup and reverse it while it grows. The Account menu reveals its identity before its actions.</p><p>Use the arrow keys to move through tabs and choices. Escape closes a popup and returns focus to its trigger. Reduced motion keeps the controls available without the animated deformation.</p></>}
  >
    <LiquidAnimationsDemo />
  </ComponentDetail>;
}
