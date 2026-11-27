import { ComponentDetail } from "@/components/component-detail";
import { MultiStepDownloadDemo } from "@/components/multi-step-download-demo";
import { multiStepDownload } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(multiStepDownload);

export default function MultiStepDownloadPage() {
  return <ComponentDetail
    item={multiStepDownload}
    layout="split"
    fullHref="/view/multi-step-download"
    idea={<p>A download interaction moves through a progress ring, success check and short particle burst. The button keeps its place through each state.</p>}
    interaction={<><p>Click the button, or use Enter or Space. The ring expands clockwise while the arrow moves. Success contracts the ring and reveals a check. Replay starts another sequence; Reset interrupts the current one.</p><p>This preview runs a timed simulation and resets after its success hold. Try the disabled, error and retry states with the controls. Reduced motion applies immediate states while preserving progress and keyboard focus.</p></>}
    attribution={<p>Reconstructed from <a href="https://x.com/nitishkmrk/status/2123364229495632098" target="_blank" rel="noreferrer">Nitish Khagwal&apos;s multi-step micro interaction</a>. The original native source and animation constants were not supplied.</p>}
  >
    <MultiStepDownloadDemo />
  </ComponentDetail>;
}
