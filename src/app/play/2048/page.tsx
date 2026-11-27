import type { Metadata } from "next";
import { Game2048FullView } from "@/components/game-2048-full-view";
import { game2048 } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const gameMetadata = getComponentMetadata(game2048);
export const metadata: Metadata = {
  ...gameMetadata,
  title: "Play 2048",
  alternates: { canonical: absoluteUrl("/play/2048") },
  openGraph: { ...gameMetadata.openGraph, title: "Play 2048 | Modulo", url: absoluteUrl("/play/2048") },
  twitter: { ...gameMetadata.twitter, title: "Play 2048 | Modulo" },
};

export default function Play2048() {
  return <main><Game2048FullView /></main>;
}
