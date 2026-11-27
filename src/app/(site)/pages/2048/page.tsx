import { ComponentDetail } from "@/components/component-detail";
import { Game2048Demo } from "@/components/game-2048-demo";
import { game2048 } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(game2048);

export default function Game2048Page() {
  return <ComponentDetail
    item={game2048}
    layout="self-contained"
    fullHref="/play/2048"
    idea={<p>Equal tiles merge once per move. The score counts merged values, while the segmented meter tracks the highest tile toward 2048.</p>}
    interaction={<><p>Use the arrow keys or WASD without selecting the board. On touch screens, swipe anywhere in the game. Press U or use Undo to take back the last move. Reach 2048, then keep playing.</p><p>Your board, last move and best score save in this browser. Sound starts after interaction and can be muted with the game control. Reduced motion updates tiles, numbers, meters and panels immediately.</p></>}
    attribution={<p>Visual direction from <a href="https://chess.aryank.space/" target="_blank" rel="noreferrer">Aryan&apos;s chess game</a>.</p>}
  >
    <Game2048Demo />
  </ComponentDetail>;
}
