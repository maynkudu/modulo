import { execFileSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { catalogItems } from "../src/lib/catalog";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
let dryRun = false;
let selectedComponent: string | undefined;
let outputDirectory: string | undefined;
for (let index = 0; index < args.length; index++) {
  const argument = args[index];
  if (argument === "--dry-run") dryRun = true;
  else if (argument === "--component") {
    selectedComponent = args[++index];
    if (!selectedComponent || selectedComponent.startsWith("--")) throw new Error("--component requires a name.");
  }
  else if (argument === "--output-dir") {
    const directory = args[++index];
    if (!directory || directory.startsWith("--")) throw new Error("--output-dir requires a directory.");
    outputDirectory = resolve(root, directory);
  } else throw new Error(`Unknown media build argument: ${argument}`);
}

const workspace = resolve(root, ".plannotator/component-media");
const bundle = resolve(workspace, "bundle");
const ffmpeg = process.env.FFMPEG_PATH ?? "ffmpeg";
await mkdir(workspace, { recursive: true });
execFileSync("bun", ["build", "scripts/component-media-preview.tsx", "--target=browser", "--format=iife", "--production", `--outdir=${bundle}`], {
  cwd: root, stdio: "inherit",
});
const [javascript, css, font] = await Promise.all([
  readFile(resolve(bundle, "component-media-preview.js"), "utf8"),
  readFile(resolve(bundle, "component-media-preview.css"), "utf8"),
  readFile(resolve(root, "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2")),
]);
const previewPath = resolve(workspace, "capture.html");
await writeFile(previewPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Modulo component media</title><style>${css}
@font-face{font-family:GeistMono;src:url(data:font/woff2;base64,${font.toString("base64")}) format("woff2")}
html,body,#root{margin:0;width:100%;height:100%;overflow:hidden;background:#050304;color:#c9bfc1;font-family:GeistMono,monospace}
.media-scene{width:100%!important;height:100%!important;min-height:0!important;aspect-ratio:auto!important}
.media-scene canvas{width:100%;height:100%}
</style></head><body><main id="root"></main><script>${javascript.replaceAll("</script", "<\\/script")}</script></body></html>`);

const specifications = [
  { name: "diwali-26", flow: "diwali-skyshots", height: 630, pause: 6500, seek: 1.6, movePointer: false },
  { name: "root-infection", flow: "root-growth", height: 630, pause: 32000, seek: 25, movePointer: true },
  { name: "nilkamal", flow: "lotus-rain", height: 816, pause: 8000, seek: 2, movePointer: false },
  { name: "interactive-art", flow: "garden-growth", height: 816, pause: 8000, seek: 2, movePointer: false },
];
const selectedItems = selectedComponent ? catalogItems.filter(entry => entry.component.name === selectedComponent) : catalogItems;
if (!selectedItems.length) throw new Error(`Unknown component: ${selectedComponent}`);
const captures = selectedItems.map((entry) => {
  const specification = specifications.find(({ name }) => name === entry.component.name);
  if (!specification) throw new Error(`Add a media capture for ${entry.component.name}.`);
  return { entry, specification };
});
const configPath = resolve(workspace, "webreel.config.json");
await writeFile(configPath, `${JSON.stringify({
  $schema: "https://webreel.dev/schema/v1.json",
  outDir: "./recordings",
  defaultDelay: 0,
  theme: { cursor: { size: 1 } },
  videos: Object.fromEntries(captures.map(({ entry, specification }) => [specification.flow, {
    url: `${pathToFileURL(previewPath).href}?component=${entry.component.name}`,
    output: `${entry.component.name}.mp4`,
    viewport: { width: entry.media.video.width, height: specification.height },
    fps: 20,
    waitFor: "body[data-ready=true]",
    steps: [
      ...(specification.movePointer ? [{ action: "moveTo", selector: ".media-scene" }] : []),
      { action: "pause", ms: specification.pause },
    ],
  }])),
}, null, 2)}\n`);
execFileSync("npx", ["--offline", "webreel", "validate", "-c", configPath], { cwd: root, stdio: "inherit" });
execFileSync("npx", ["--offline", "webreel", "record", "-c", configPath, "--dry-run"], { cwd: root, stdio: "inherit" });

if (!dryRun) {
  execFileSync("npx", ["--offline", "webreel", "record", "-c", configPath], { cwd: root, stdio: "inherit" });
  const destination = outputDirectory ?? resolve(root, "public/media");
  await mkdir(destination, { recursive: true });
  for (const { entry: { component, media }, specification } of captures) {
    const recording = resolve(workspace, `recordings/${component.name}.mp4`);
    const video = resolve(destination, basename(media.video.src));
    const thumbnail = resolve(destination, basename(media.thumbnail.src));
    const animation = resolve(destination, basename(media.animation.src));
    const crop = `crop=${media.video.width}:${media.video.height}`;
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(specification.seek), "-i", recording,
      "-t", String(media.video.duration), "-vf", crop, "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "25", "-movflags", "+faststart", video]);
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", video, "-frames:v", "1", "-q:v", "2", thumbnail]);
    const palette = `fps=10,scale=${media.animation.width}:${media.animation.height}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3`;
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", video, "-filter_complex", palette, "-loop", "0", animation]);
    for (const asset of [thumbnail, animation, video]) {
      if ((await stat(asset)).size === 0) throw new Error(`Empty component media: ${asset}`);
    }
    console.log(`Built thumbnail, GIF, and MP4 for ${component.name}.`);
  }
  if (!selectedComponent) {
    const logoPath = outputDirectory ? resolve(outputDirectory, "modulo-og.jpg") : resolve(root, "public/brand/modulo-og.jpg");
    await mkdir(dirname(logoPath), { recursive: true });
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", resolve(root, "public/brand/modulo-logo.png"),
      "-vf", "scale=1000:-1,pad=1200:630:(ow-iw)/2:(oh-ih)/2:black", "-frames:v", "1", "-q:v", "2", logoPath]);
    console.log(`Built logo sharing image: ${logoPath}`);
  }
}
