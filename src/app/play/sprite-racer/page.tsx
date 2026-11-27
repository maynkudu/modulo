import type { Metadata } from "next";
import { SpriteRacerDemo } from "@/components/sprite-racer-demo";
import { spriteRacer } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const gameMetadata = getComponentMetadata(spriteRacer);
export const metadata: Metadata = {
  ...gameMetadata,
  title: "Play Switchback",
  alternates: { canonical: absoluteUrl("/play/sprite-racer") },
  openGraph: { ...gameMetadata.openGraph, title: "Play Switchback | Modulo", url: absoluteUrl("/play/sprite-racer") },
  twitter: { ...gameMetadata.twitter, title: "Play Switchback | Modulo" },
};

export default function PlaySwitchback() {
  return <main><SpriteRacerDemo /></main>;
}
