import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { allCatalogItems as catalogItems } from "../src/lib/catalog";

import { verifyComponentMedia } from "./verify-component-media";
import { componentMediaPolicy, verifyMediaMetadata } from "./component-media-policy";

const { fps, maxVideoBytes, targetVideoBytes } = componentMediaPolicy;

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
let dryRun = false;
let encodeOnly = false;
let selectedComponent: string | undefined;
let outputDirectory: string | undefined;
for (let index = 0; index < args.length; index++) {
  const argument = args[index];
  if (argument === "--dry-run") dryRun = true;
  else if (argument === "--encode-only") encodeOnly = true;
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

if (dryRun && encodeOnly) throw new Error("--dry-run and --encode-only cannot be combined.");

const specifications = [
  { name: "dot-orb", flow: "dot-orb-pointer-ripples", pause: 6500, seek: 0, thumbnailSeek: 2, movePointer: false },
  { name: "image-mosaic", flow: "image-mosaic-metallic-sweep", pause: 7000, seek: .1, thumbnailSeek: 1.5, movePointer: false },
  { name: "porsche-gt3rs", flow: "porsche-gt3rs-orbit", pause: 4500, seek: .1, thumbnailSeek: .2, movePointer: false },
  { name: "thermal-image", flow: "thermal-image-model-orbit", pause: 6500, seek: .1, thumbnailSeek: 2.5, movePointer: false },
  { name: "cube-archive", flow: "cube-archive-case-return", pause: 1800, seek: 0, thumbnailSeek: 2, movePointer: false },
  { name: "halftone", flow: "halftone-hover-trail", pause: 7000, seek: .1, thumbnailSeek: 2, movePointer: false },
  { name: "portrait-wave", flow: "portrait-wave-loop", pause: 6500, seek: .5, thumbnailSeek: 0, movePointer: false },
  { name: "eyespice", flow: "eyespice-gaze-close-retreat", pause: 4500, seek: .1, thumbnailSeek: 0, movePointer: false },
  { name: "brick-noise", flow: "brick-noise-loop", pause: 6500, seek: .1, thumbnailSeek: 0, movePointer: false },
  { name: "sprite-racer", flow: "switchback-driving", pause: 11500, seek: 4, thumbnailSeek: 2, movePointer: false },
  { name: "multi-step-download", flow: "download-complete", pause: 6500, seek: .1, thumbnailSeek: 1.5, movePointer: false },
  { name: "inline-download", flow: "inline-download-run", pause: 6600, seek: .2, thumbnailSeek: 1.7, movePointer: false },
  { name: "state-buttons", flow: "state-buttons-thinking", pause: 6500, seek: .1, thumbnailSeek: 2, movePointer: false },
  { name: "liquid-text-reveal", flow: "liquid-text-sharpen", pause: 6500, seek: 0, thumbnailSeek: .5, movePointer: false },
  { name: "liquid-animations", flow: "liquid-account-retarget", pause: 8000, seek: .1, thumbnailSeek: 2, movePointer: false },
  { name: "overlay-navigation", flow: "overlay-navigation-open", pause: 8000, seek: 1.6, movePointer: false },
  { name: "logo-refraction", flow: "logo-refraction-sweep", pause: 12000, seek: .5, movePointer: false },
  { name: "elastic-slider", flow: "elastic-slider-stretch", pause: 8000, seek: .3, movePointer: false },
  { name: "snap-rail", flow: "snap-rail-retarget", pause: 8000, seek: .3, movePointer: false },
  { name: "liquid-cluster", flow: "liquid-cluster-separate", pause: 8000, seek: .3, movePointer: false },
  { name: "2048", flow: "2048-merges", pause: 8000, seek: .4, movePointer: false },
  { name: "textured-glass", flow: "textured-glass-light", pause: 6500, seek: 1, movePointer: false },
  { name: "diwali-26", flow: "diwali-skyshots", pause: 6500, seek: .75, movePointer: false },
  { name: "root-infection", flow: "root-growth", pause: 13000, seek: 8, movePointer: true },
  { name: "nilkamal", flow: "lotus-rain", pause: 8000, seek: 2, movePointer: false },
  { name: "interactive-art", flow: "garden-growth", pause: 8000, seek: 2, movePointer: false },
];
const selectedNames = selectedComponent?.split(",");
const unknownNames = selectedNames?.filter(name => !catalogItems.some(entry => entry.component.name === name));
if (unknownNames?.length) throw new Error(`Unknown component: ${unknownNames.join(", ")}`);
const selectedItems = selectedNames ? catalogItems.filter(entry => selectedNames.includes(entry.component.name)) : catalogItems;
if (!selectedItems.length) throw new Error(`Unknown component: ${selectedComponent}`);
const captures = selectedItems.map((entry) => {
  const specification = specifications.find(({ name }) => name === entry.component.name);
  if (!specification) throw new Error(`Add a media capture for ${entry.component.name}.`);
  return { entry, specification };
});
const ambient = new Set(["porsche-gt3rs", "dot-orb", "image-mosaic", "thermal-image", "halftone", "portrait-wave", "eyespice", "brick-noise", "sprite-racer", "logo-refraction", "textured-glass", "diwali-26", "root-infection", "nilkamal", "interactive-art"]);
for (const { entry } of captures) verifyMediaMetadata(entry);

const workspace = resolve(root, process.env.MODULO_MEDIA_WORKSPACE ?? resolve(homedir(), ".webreel/modulo-component-media"));
const bundle = resolve(workspace, "bundle");
const ffmpeg = process.env.FFMPEG_PATH ?? "ffmpeg";
const ffprobe = process.env.FFPROBE_PATH ?? "ffprobe";
await mkdir(workspace, { recursive: true });
const previewPath = resolve(workspace, "capture.html");
const configPath = resolve(workspace, "webreel.config.json");
if (!encodeOnly) {
  execFileSync("bun", ["build", "scripts/component-media-preview.tsx", "--target=browser", "--format=esm", "--production", `--outdir=${bundle}`], {
    cwd: root, stdio: "inherit",
  });
  const [javascript, css, font, sansFont, geistFont, glassImage, glassDepth, logoImage, portraitA, portraitB, mosaicImage, thermalModel] = await Promise.all([
    readFile(resolve(bundle, "component-media-preview.js"), "utf8"),
    readFile(resolve(bundle, "component-media-preview.css"), "utf8"),
    readFile(resolve(root, "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2")),
    readFile(resolve(root, "src/app/fonts/InterVariable.woff2")),
    readFile(resolve(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2")),
    readFile(resolve(root, "public/artwork/stay.jpeg")),
    readFile(resolve(root, "public/artwork/stay-depth.png")),
    readFile(resolve(root, "public/artwork/maynkudu-warehouse.png")),
    readFile(resolve(root, "public/artwork/portrait-wave/christopher-campbell.jpg")),
    readFile(resolve(root, "public/artwork/portrait-wave/michael-dam.jpg")),
    readFile(resolve(root, "public/artwork/image-mosaic.jpg")),
    readFile(resolve(root, "public/artwork/porsche-gt3rs.glb")),
  ]);
  const cubeArchiveCaptureAssets = [
    ["__CUBE_ARCHIVE_INDIA_MAIN__", "india-main.avif", "image/avif"],
    ["__CUBE_ARCHIVE_INDIA_PORTRAIT__", "india-portrait.avif", "image/avif"],
    ["__CUBE_ARCHIVE_INDIA_CROWD__", "india-crowd.avif", "image/avif"],
    ["__CUBE_ARCHIVE_SAIGON_MAIN__", "saigon-main.avif", "image/avif"],
    ["__CUBE_ARCHIVE_SAIGON_STREET__", "saigon-street.avif", "image/avif"],
    ["__CUBE_ARCHIVE_SAIGON_DARKROOM__", "saigon-darkroom.avif", "image/avif"],
    ["__CUBE_ARCHIVE_ARCHIVE_01__", "archive-01.avif", "image/avif"],
    ["__CUBE_ARCHIVE_ARCHIVE_02__", "archive-02.avif", "image/avif"],
    ["__CUBE_ARCHIVE_KITSE_POSTER__", "kitse-poster.jpg", "image/jpeg"],
    ["__CUBE_ARCHIVE_KITSE_FRAME_02__", "kitse-frame-02.jpg", "image/jpeg"],
  ] as const;
  const cubeArchiveDataUrls = await Promise.all(cubeArchiveCaptureAssets.map(async ([token, filename, mime]) => ({
    token,
    value: `data:${mime};base64,${(await readFile(resolve(root, "public/artwork/cube-archive", filename))).toString("base64")}`,
  })));
  let captureJavaScript = javascript;
  for (const { token, value } of cubeArchiveDataUrls) captureJavaScript = captureJavaScript.replaceAll(token, value);
  const captureClock = await readFile(resolve(root, "scripts/media-capture-clock.js"), "utf8");
  await writeFile(previewPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Modulo component media</title><style>${css}
  @font-face{font-family:GeistMono;src:url(data:font/woff2;base64,${font.toString("base64")}) format("woff2")}
  @font-face{font-family:Inter;src:url(data:font/woff2;base64,${sansFont.toString("base64")}) format("woff2");font-weight:100 900}
  @font-face{font-family:GeistSans;src:url(data:font/woff2;base64,${geistFont.toString("base64")}) format("woff2")}
  *{box-sizing:border-box}html,body,#root{margin:0;width:100%;height:100%;overflow:hidden;background:#050304;color:#c9bfc1;font-family:GeistMono,monospace}
  .media-scene{width:100%!important;height:100%!important;min-height:0!important;aspect-ratio:auto!important}
  .media-scene canvas{width:100%;height:100%}
  .control-media{height:100%;background:#f7f8fa;color:#20242b;font-family:Inter,sans-serif;padding:32px;display:flex;flex-direction:column}
  .control-media-stage{flex:1;display:flex;align-items:center;justify-content:center}.control-media-stage>.snap-rail{width:480px}.control-media-stage>.liquid-cluster{width:500px}
  .liquid-media{height:100%;padding:32px;box-sizing:border-box;background:#000;color:#e8e8e8;font-family:Inter,sans-serif;--font-sans:Inter,sans-serif;--foreground:#e8e8e8;--background:#000;--muted-foreground:#999}
  .liquid-media .liquid-demo-tabs{display:none}
  .liquid-media .liquid-demo{height:100%}.liquid-media .liquid-demo-stage{height:100%;min-height:0}
  .liquid-text-media{min-height:100%;background:#000;--paper:#000;--background:#000;--ink:#f6efed;--foreground:#f6efed;--font-geist-sans:GeistSans,sans-serif}
  .liquid-text-media>main>header,.liquid-text-media>main>section,.liquid-text-media>main>footer{display:none}
  .liquid-text-media article{padding-block:70px}
  body:has(.liquid-text-media),html:has(.liquid-text-media),#root:has(.liquid-text-media){overflow:visible;background:#000}
  .download-media{position:relative;display:grid;place-items:center;width:100%;height:100%;background:#f1f1f1}
  .eyespice-media{width:100%;height:100%;display:grid;place-items:center;background:#000}.eyespice-media .eyespice{width:88%;height:88%;aspect-ratio:1}.eyespice-rest{position:absolute;left:3%;top:3%;width:2px;height:2px}
  .halftone-media{position:relative;width:100%;height:100%;background:#0a0403}.halftone-start,.halftone-end{position:absolute;width:2px;height:2px;pointer-events:none}.halftone-start{left:15%;top:25%}.halftone-end{left:80%;top:70%}
  .download-media-rest{position:absolute;left:78%;top:75%;width:1px;height:1px;pointer-events:none}
  .inline-download-media{position:relative;display:grid;place-items:center;width:100%;height:100%;background:#050505}
  .inline-download-media>.inline-download{scale:2.4}
  .inline-download-media-rest{position:absolute;left:10%;top:14%;width:1px;height:1px;pointer-events:none}
  .state-buttons-media{width:100%;height:100%;display:grid;place-items:center;background:#080808}
  .state-buttons-media .state-button{gap:22px;padding-inline:30px;border-radius:32px}
  .state-buttons-media .state-button canvas{width:50px;height:50px}
  .state-buttons-media .state-button-label{min-width:155px;font-size:30px;letter-spacing:-.8px}
  .image-mosaic-media{width:100%;height:100%;background:#0b0c0b}
  .image-mosaic-media .image-mosaic__image{border-radius:0}
  .thermal-image-media{width:100%;height:100%;background:#070707}
  .thermal-image-media canvas,.thermal-image-media img{width:100%;height:100%;object-fit:contain}
  .cube-archive-media{width:100%;height:100%;background:#fff}
  </style></head><body><main id="root"></main><script>${captureClock}</script><script type="module">${captureJavaScript.replaceAll("__TEXTURED_GLASS_IMAGE__", `data:image/jpeg;base64,${glassImage.toString("base64")}`).replaceAll("__TEXTURED_GLASS_DEPTH__", `data:image/png;base64,${glassDepth.toString("base64")}`).replaceAll("__LOGO_REFRACTION_IMAGE__", `data:image/png;base64,${logoImage.toString("base64")}`).replaceAll("__PORTRAIT_WAVE_A__", `data:image/jpeg;base64,${portraitA.toString("base64")}`).replaceAll("__PORTRAIT_WAVE_B__", `data:image/jpeg;base64,${portraitB.toString("base64")}`).replaceAll("__IMAGE_MOSAIC_IMAGE__", `data:image/jpeg;base64,${mosaicImage.toString("base64")}`).replaceAll("__THERMAL_MODEL__", `data:model/gltf-binary;base64,${thermalModel.toString("base64")}`).replaceAll("</script", "<\\/script")}</script></body></html>`);

  const budgets = Object.fromEntries(captures.map(({ entry, specification }) => [specification.flow, Math.max(Math.round(specification.seek * fps) + Math.round(entry.media.video.duration * fps) + (ambient.has(entry.component.name) ? 15 : 0), entry.component.name === "liquid-text-reveal" ? 420 : 300)]));
  await writeFile(resolve(workspace, "capture-frame-budgets.json"), JSON.stringify(budgets, null, 2));
  await writeFile(configPath, `${JSON.stringify({
    $schema: "https://webreel.dev/schema/v1.json",
    outDir: "./recordings",
    defaultDelay: 0,
    theme: { cursor: { size: 1 } },
    videos: Object.fromEntries(captures.map(({ entry, specification }) => [specification.flow, {
      url: `${pathToFileURL(previewPath).href}?component=${entry.component.name}`,
      output: `${entry.component.name}.mp4`,
      viewport: { width: entry.media.video.width, height: entry.media.video.height },
      fps,
      waitFor: "body[data-ready=true]",
      steps: [
        ...(entry.component.name === "halftone" ? [
          { action: "moveTo", selector: ".halftone-start" },
          { action: "pause", ms: 800 },
          { action: "moveTo", selector: ".halftone-end" },
          { action: "pause", ms: 800 },
          { action: "moveTo", selector: ".halftone-start" },
        ] : []),
        ...(entry.component.name === "eyespice" ? [
          { action: "pause", ms: 1000 },
          { action: "moveTo", selector: ".eyespice-rest" },
          { action: "pause", ms: 1000 },
          { action: "moveTo", selector: ".eyespice canvas" },
          { action: "pause", ms: 600 },
          { action: "moveTo", selector: ".eyespice-rest" },
        ] : []),
        ...(entry.component.name === "inline-download" ? [
          { action: "pause", ms: 200 },
          { action: "click", selector: ".inline-download" },
          { action: "moveTo", selector: ".inline-download-media-rest" },
        ] : []),
        ...(entry.component.name === "multi-step-download" ? [
          { action: "pause", ms: 200 },
          { action: "click", selector: ".msd-button" },
          { action: "moveTo", selector: ".download-media-rest" },
        ] : []),
        ...(entry.component.name === "overlay-navigation" ? [
          { action: "pause", ms: 2200 },
          { action: "click", selector: '.site-header-menu[aria-expanded="true"]' },
          { action: "pause", ms: 700 },
          { action: "click", selector: '.site-header-menu[aria-expanded="false"]' },
        ] : []),
        ...(entry.component.name === "cube-archive" ? [
          { action: "pause", ms: 200 },
          { action: "click", selector: '[data-project-index="1"]' },
          { action: "pause", ms: 600 },
          { action: "click", selector: "[data-stage]" },
          { action: "pause", ms: 950 },
          { action: "pause", ms: 900 },
          { action: "click", selector: '[data-action="back"]' },
          { action: "pause", ms: 950 },
          { action: "click", selector: '[data-project-index="0"]' },
          { action: "pause", ms: 600 },
        ] : []),
        ...(["elastic-slider", "snap-rail", "liquid-cluster"].includes(entry.component.name) ? [{ action: "key", key: "r" }] : []),
        ...(["elastic-slider", "snap-rail", "liquid-cluster"].includes(entry.component.name) ? [{ action: "pause", ms: 2400 }, { action: "key", key: "0" }] : []),
        ...(specification.movePointer ? [{ action: "moveTo", selector: ".media-scene" }] : []),
        { action: "pause", ms: specification.pause },
      ],
    }])),
  }, null, 2)}\n`);
  execFileSync("npx", ["--offline", "webreel", "validate", "-c", configPath], { cwd: root, stdio: "inherit" });
  execFileSync("npx", ["--offline", "webreel", "record", "-c", configPath, "--dry-run"], { cwd: root, stdio: "inherit" });
}

if (!dryRun) {
  const destination = outputDirectory ?? resolve(root, "public/media");
  const staging = resolve(workspace, "encoded");
  await mkdir(destination, { recursive: true });
  await mkdir(staging, { recursive: true });
  const reports = [];
  for (const { entry, specification } of captures) {
    const { component, media } = entry;
    if (!encodeOnly) execFileSync("node", [resolve(root, "scripts/record-component-media.mjs"), configPath, specification.flow], { cwd: root, stdio: "inherit" });
    const recording = resolve(workspace, `recordings/${component.name}.mp4`);
    const video = resolve(staging, basename(media.video.src));
    const thumbnail = resolve(staging, basename(media.thumbnail.src));
    const frames = Math.round(media.video.duration * fps);
    const start = Math.round(specification.seek * fps);
    const blend = ambient.has(component.name);
    const requiredFrames = start + frames + (blend ? 15 : 0);
    const actualFrames = Number(execFileSync(ffprobe, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=nb_frames", "-of", "default=noprint_wrappers=1:nokey=1", recording], { encoding: "utf8" }).trim());
    if (!Number.isFinite(actualFrames) || actualFrames < requiredFrames) throw new Error(`Incomplete raw capture for ${component.name}: ${actualFrames} frames, need ${requiredFrames}.`);
    const base = `[0:v]scale=${media.video.width}:${media.video.height}:flags=lanczos:out_range=tv,fps=${fps},trim=start_frame=${start}:end_frame=${requiredFrames},setpts=PTS-STARTPTS`;
    const filter = blend
      ? `${base},split=3[m][t][h];[m]trim=start_frame=15:end_frame=${frames},setpts=PTS-STARTPTS[body];[t]trim=start_frame=${frames},setpts=PTS-STARTPTS,fps=${fps}[tail];[h]trim=end_frame=15,setpts=PTS-STARTPTS,fps=${fps}[head];[tail][head]xfade=transition=fade:duration=0.233333:offset=0[blend];[body][blend]concat=n=2:v=1:a=0,format=yuv420p[out]`
      : `${base},format=yuv420p[out]`;
    const common = ["-hide_banner", "-loglevel", "error", "-y", "-i", recording, "-filter_complex", filter, "-map", "[out]", "-an", "-r", String(fps), "-frames:v", String(frames), "-c:v", "libx264", "-preset", "slow", "-threads", "2", "-profile:v", "high", "-level:v", "3.2", "-pix_fmt", "yuv420p", "-color_range", "tv"];
    const bitrate = Math.floor(targetVideoBytes * 8 / media.video.duration / 1000);
    execFileSync(ffmpeg, [...common, "-crf", "24", "-maxrate", `${bitrate}k`, "-bufsize", `${bitrate}k`, "-movflags", "+faststart", video]);
    if ((await stat(video)).size > maxVideoBytes) {
      const passlog = resolve(staging, `${component.name}-pass`);
      execFileSync(ffmpeg, [...common, "-b:v", `${bitrate}k`, "-pass", "1", "-passlogfile", passlog, "-f", "null", "-"]);
      execFileSync(ffmpeg, [...common, "-b:v", `${bitrate}k`, "-pass", "2", "-passlogfile", passlog, "-movflags", "+faststart", video]);
    }
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(Math.min(specification.thumbnailSeek ?? .5, media.video.duration - .1)), "-i", video, "-frames:v", "1", "-q:v", "3", thumbnail]);
    const report = await verifyComponentMedia(entry, staging);
    for (const file of [video, thumbnail]) {
      const target = resolve(destination, basename(file));
      await copyFile(file, `${target}.tmp`);
      await rename(`${target}.tmp`, target);
      await rm(file);
    }
    await rm(resolve(destination, `${component.name}.gif`), { force: true });
    reports.push(report);
    await writeFile(resolve(workspace, "media-report.json"), `${JSON.stringify(reports, null, 2)}\n`);
    console.log(`Verified ${component.name}: ${report.frames} frames at ${fps} fps, ${report.bytes} bytes.`);
  }
}
