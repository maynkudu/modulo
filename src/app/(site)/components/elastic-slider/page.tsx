import { ComponentDetail } from "@/components/component-detail";
import { ElasticSliderDemo } from "@/components/elastic-slider-demo";
import { elasticSlider } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(elasticSlider);

export default function ElasticSliderPage() {
  return <ComponentDetail
    item={elasticSlider}
    layout="split"
    fullHref="/view/elastic-slider"
    idea={<p>The slider stretches at its bounds while its value stays within range. Labels and input targets keep their shape as the surrounding control deforms.</p>}
    interaction={<><p>Drag horizontally or vertically. Release to commit the value, or cancel the gesture to settle the control without committing.</p><p>Arrow keys adjust one step. Page Up and Page Down adjust ten steps. Home and End select the bounds. Use the controls to change orientation, value and motion.</p><p>Reduced motion preserves value adjustment without elastic stretching. Hidden tabs and offscreen previews stop animation.</p></>}
  >
    <ElasticSliderDemo />
  </ComponentDetail>;
}
