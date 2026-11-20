import { SpriteRacerDemo } from "@/components/sprite-racer-demo";
import { spriteRacer } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = {
  ...getComponentMetadata(spriteRacer),
  title: "Play Switchback",
  alternates: { canonical: absoluteUrl("/play/sprite-racer") },
};

export default function PlaySwitchback() {
  return <main><SpriteRacerDemo /></main>;
}
