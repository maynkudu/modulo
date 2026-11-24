import { Game2048FullView } from "@/components/game-2048-full-view";
import { game2048 } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = {
  ...getComponentMetadata(game2048),
  title: "Play 2048",
  alternates: { canonical: absoluteUrl("/play/2048") },
};

export default function Play2048() {
  return <main><Game2048FullView /></main>;
}
