import { readdir, stat } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { CatalogItem } from "../src/lib/catalog";

export const componentMediaPolicy = {
  width: 720,
  fps: 60,
  maxDuration: 6,
  maxVideoBytes: 1_000_000,
  targetVideoBytes: 850_000,
} as const;

type MediaEntry = Pick<CatalogItem, "component" | "media">;

/** Checks catalog metadata before capture or build work starts. */
export function verifyMediaMetadata({ component, media }: MediaEntry) {
  const { video, thumbnail } = media;
  const frames = video.duration * componentMediaPolicy.fps;
  if (Object.keys(media).sort().join(",") !== "thumbnail,video"
    || video.src !== `/media/${component.name}.mp4` || video.type !== "video/mp4"
    || thumbnail.src !== `/media/${component.name}.jpg` || thumbnail.type !== "image/jpeg"
    || video.width !== componentMediaPolicy.width || !Number.isInteger(video.height) || video.height <= 0 || video.height % 2 !== 0
    || !Number.isFinite(video.duration) || video.duration <= 0 || video.duration > componentMediaPolicy.maxDuration
    || Math.abs(frames - Math.round(frames)) > 1e-6
    || thumbnail.width !== video.width || thumbnail.height !== video.height) {
    throw new Error(`Invalid media metadata for ${component.name}. Use a matching 720 px MP4/JPG pair and a whole 60 fps frame count within six seconds.`);
  }
}

/** Checks deployment assets without requiring FFmpeg or browser dependencies. */
export async function verifyMediaFiles(entries: readonly MediaEntry[], directory: string) {
  const expected = new Set<string>();
  for (const entry of entries) {
    verifyMediaMetadata(entry);
    if (expected.has(basename(entry.media.video.src))) {
      throw new Error(`Duplicate catalog module: ${entry.component.name}. Choose exactly one category.`);
    }
    expected.add(basename(entry.media.video.src));
    expected.add(basename(entry.media.thumbnail.src));
  }
  for (const file of await readdir(directory, { withFileTypes: true })) {
    if (!file.isFile() || !expected.has(file.name)) {
      throw new Error(`Unexpected component media: ${file.name}. Keep only catalog MP4/JPG pairs in public/media; store raw captures elsewhere.`);
    }
  }
  for (const name of expected) {
    const asset = await stat(resolve(directory, name));
    if (!asset.isFile() || asset.size === 0) throw new Error(`Missing or empty component media: ${name}`);
    if (name.endsWith(".mp4") && asset.size > componentMediaPolicy.maxVideoBytes) {
      throw new Error(`Component video exceeds ${componentMediaPolicy.maxVideoBytes} bytes: ${name}`);
    }
  }
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const { allCatalogItems } = await import("../src/lib/catalog");
  const directory = fileURLToPath(new URL("../public/media/", import.meta.url));
  await verifyMediaFiles(allCatalogItems, directory);
  console.log(`Checked ${allCatalogItems.length} catalog MP4/JPG pairs and the public/media file list.`);
}
