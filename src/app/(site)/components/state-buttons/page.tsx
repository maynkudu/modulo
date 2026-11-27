import { ComponentDetail } from "@/components/component-detail";
import { StateButtonsDemo } from "@/components/state-buttons-demo";
import { stateButtons } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(stateButtons);

export default function StateButtonsPage() {
  return <ComponentDetail
    item={stateButtons}
    layout="split"
    fullHref="/view/state-buttons"
    idea={<p>The dot matrix keeps its shape while its light pattern changes. Loading, thinking, pending, success and error share one button.</p>}
    interaction={<><p>Change state, animation, size, speed, glow or accent. Press the large button to run the short simulated operation. Press again or use Escape to cancel it.</p><p>Success draws a check through the cells, while error draws a cross. Reduced motion holds a still frame, and hidden or offscreen previews pause the canvas.</p></>}
    attribution={<p>Adapted from <a href="https://x.com/uixamjad/status/2125155886922625241" target="_blank" rel="noreferrer">uixamjad&apos;s button animation</a>. The original code, font and interaction behavior were unavailable. This component uses new matrix formulas and editable text; it is not an exact reconstruction.</p>}
  >
    <StateButtonsDemo />
  </ComponentDetail>;
}
