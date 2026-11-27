import { ComponentDetail } from "@/components/component-detail";
import { DotOrbDemo } from "@/components/dot-orb-demo";
import { dotOrb } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(dotOrb);

export default function DotOrbPage() {
  return <ComponentDetail
    item={dotOrb}
    layout="self-contained"
    fullHref="/view/dot-orb"
    idea={<p>A field of dots responds to sound and pointer movement. Sensitivity changes its audio response, while interaction controls the pointer effect.</p>}
    interaction={<><p>Hover to pull nearby dots, or click or tap to send a ripple. Focus the orb and use the arrow keys to move the interaction point, Enter or Space for a ripple, and Escape to reset.</p><p>Choose a local audio file and press Play, or allow microphone access and speak. Audio stays in your browser. Microphone input needs HTTPS and browser permission, and never plays through your speakers.</p><p>Reduced motion holds the geometry still while color follows audio. Hidden or offscreen previews pause rendering.</p></>}
    attribution={<p>Based on <a href="https://x.com/KelvinAdithya/status/2125575228357009808" target="_blank" rel="noreferrer">Kelvin Adithya&apos;s dot orb</a>. The original generator was unavailable. The reference informed its static appearance; live audio and interaction drive this implementation. Exact visual parity remains unverified.</p>}
  >
    <DotOrbDemo />
  </ComponentDetail>;
}
