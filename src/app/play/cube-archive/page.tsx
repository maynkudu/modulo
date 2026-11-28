import type { Metadata } from "next";
import { CubeArchiveDemo } from "@/components/cube-archive-demo";
import { cubeArchive } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import styles from "./page.module.css";

const archiveMetadata = getComponentMetadata(cubeArchive);
export const metadata: Metadata = {
  ...archiveMetadata,
  title: "Cube Archive",
  alternates: { canonical: absoluteUrl("/play/cube-archive") },
  openGraph: { ...archiveMetadata.openGraph, title: "Cube Archive | Modulo", url: absoluteUrl("/play/cube-archive") },
  twitter: { ...archiveMetadata.twitter, title: "Cube Archive | Modulo" },
};

export default function PlayCubeArchive() {
  return <main className={styles.page}><CubeArchiveDemo /></main>;
}
