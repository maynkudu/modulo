import { ComponentDetail } from "@/components/component-detail";
import { RootInfectionDemo } from "@/components/root-infection-demo";
import { rootInfection } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(rootInfection);

export default function RootInfectionPage() {
  return <ComponentDetail
    item={rootInfection}
    layout="scoped-experience"
    fullHref="/view/root-infection"
    idea={<p>Roots grow from a still pointer, cling to nearby controls and spread through the page. Thin roots merge into thicker trunks as the infection matures.</p>}
    interaction={<><p>Keep the pointer still inside the preview. Move to pull the roots back, click to scatter them, or press Escape to clear the screen.</p><p>Hold Shift to approach without clearing the roots. Shift-drag a root to pull it, or scroll to push them sideways.</p><p>Sound starts after the first click or key press and can be muted with the sound control. Reduced motion keeps the preview still. Moving outside the preview stops new infections while you read; the overlay does not intercept links or controls.</p></>}
    attribution={<p>The root physics was inspired by <a href="https://youtube.com/shorts/HJas6mdFDqI" target="_blank" rel="noreferrer">this simulation</a>.</p>}
  >
    <RootInfectionDemo />
  </ComponentDetail>;
}
