import { ComponentDetail } from "@/components/component-detail";
import { InlineDownloadDemo } from "@/components/inline-download-demo";
import { inlineDownload } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(inlineDownload);

export default function InlineDownloadPage() {
  return <ComponentDetail
    item={inlineDownload}
    layout="split"
    fullHref="/view/inline-download"
    idea={<p>A download button keeps progress, cancellation, completion and retry in the same control. Its moving arrow, label and color change with the current state.</p>}
    interaction={<><p>Press the button, or use Enter or Space, to start the simulated download. Press again or use Escape to cancel. Hovering a running button reveals its cancellation action.</p><p>When the run finishes, press the completed button to open its result. Turn on Fail next run to try the error and retry states. Duration and reset controls change the preview timing.</p><p>The public preview simulates progress. Reduced motion removes travel, blur and digit swaps while preserving every state and keyboard focus.</p></>}
    attribution={<p>Adapted from <a href="https://uibrik.com/components/download-button" target="_blank" rel="noreferrer">Malay&apos;s download button on uibrik</a>. The original gesture timing was matched against that source and rebuilt without its dependencies.</p>}
  >
    <InlineDownloadDemo />
  </ComponentDetail>;
}
