import { execFileSync } from "node:child_process";
import { stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { allCatalogItems, type CatalogItem } from "../src/lib/catalog";
import { componentMediaPolicy, verifyMediaFiles, verifyMediaMetadata } from "./component-media-policy";

const { maxVideoBytes, fps } = componentMediaPolicy;
const root = fileURLToPath(new URL("../", import.meta.url));
const probeSchema = z.object({ streams: z.array(z.object({
  codec_type: z.string(), codec_name: z.string(), width: z.number().optional(), height: z.number().optional(),
  pix_fmt: z.string().optional(), r_frame_rate: z.string().optional(), avg_frame_rate: z.string().optional(),
  duration: z.string().optional(), nb_frames: z.string().optional(),
})) });

function probe(file: string) {
  return probeSchema.parse(JSON.parse(execFileSync(process.env.FFPROBE_PATH ?? "ffprobe", [
    "-v", "error", "-show_streams", "-of", "json", file,
  ], { encoding: "utf8" }))).streams;
}

/** Checks the actual encoded files, including a complete decode. */
export async function verifyComponentMedia(entry: Pick<CatalogItem, "component" | "media">, directory: string) {
  verifyMediaMetadata(entry);
  const videoPath = resolve(directory, basename(entry.media.video.src));
  const posterPath = resolve(directory, basename(entry.media.thumbnail.src));
  const videoBytes = (await stat(videoPath)).size;
  const posterBytes = (await stat(posterPath)).size;
  if (!videoBytes || videoBytes > maxVideoBytes || !posterBytes) throw new Error(`Invalid media size: ${entry.component.name} (${videoBytes} video bytes).`);
  const streams = probe(videoPath);
  const stream = streams[0];
  const expectedFrames = Math.round(entry.media.video.duration * fps);
  if (streams.length !== 1 || !stream || stream.codec_type !== "video" || stream.codec_name !== "h264"
    || stream.pix_fmt !== "yuv420p" || stream.r_frame_rate !== `${fps}/1` || stream.avg_frame_rate !== `${fps}/1`
    || stream.width !== entry.media.video.width || stream.height !== entry.media.video.height
    || Number(stream.nb_frames) !== expectedFrames || !Number.isFinite(Number(stream.duration))
    || Math.abs(Number(stream.duration) - expectedFrames / fps) > .02) {
    throw new Error(`Invalid 60 fps MP4: ${videoPath}. Expected ${expectedFrames} frames and matching catalog dimensions.`);
  }
  const poster = probe(posterPath)[0];
  if (!poster || poster.width !== stream.width || poster.height !== stream.height) throw new Error(`Poster dimensions do not match: ${posterPath}`);
  execFileSync(process.env.FFMPEG_PATH ?? "ffmpeg", ["-hide_banner", "-loglevel", "error", "-xerror", "-i", videoPath, "-f", "null", "-"], { stdio: "pipe" });
  return { name: entry.component.name, bytes: videoBytes, posterBytes, frames: expectedFrames, fps, duration: expectedFrames / fps, width: stream.width, height: stream.height };
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const directory = resolve(root, process.argv[2] ?? "public/media");
  await verifyMediaFiles(allCatalogItems, directory);
  const results = [];
  for (const entry of allCatalogItems) results.push(await verifyComponentMedia(entry, directory));
  if (process.argv[3]) await writeFile(resolve(root, process.argv[3]), `${JSON.stringify(results, null, 2)}\n`);
  console.table(results);
  console.log(`Verified ${results.length} silent 60 fps MP4s, all at or below ${maxVideoBytes} bytes.`);
}
