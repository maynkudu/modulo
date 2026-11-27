import { ComponentDetail } from "@/components/component-detail";
import { EyeSpiceDemo } from "@/components/eyespice-demo";
import { eyeSpice } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(eyeSpice);

export default function EyeSpicePage() {
  return <ComponentDetail
    item={eyeSpice}
    layout="self-contained"
    fullHref="/view/eyespice"
    idea={<p>The eye follows the pointer across the page. Approach it to close the curved eyelids, then retreat to reopen them.</p>}
    interaction={<><p>Move the cursor anywhere on the page. A new pointer target reverses an unfinished eyelid transition. Close eye and Open eye also work from the keyboard.</p><p>Turn tracking off to freeze the gaze, or pause the scene. Touch release and cancellation reopen the eye. Reduced motion applies gaze and eyelid changes immediately; hidden and offscreen scenes stop rendering.</p></>}
    attribution={<p>Reconstructed from <a href="https://www.pinterest.com/pin/794674296784100176/" target="_blank" rel="noreferrer">the eye animation attributed to @o6scure</a>. Surface maps derive from its rendered views. The original authoring rig was unavailable, and this is not a verified 1:1 copy. The inspected source did not state reuse terms.</p>}
  >
    <EyeSpiceDemo />
  </ComponentDetail>;
}
