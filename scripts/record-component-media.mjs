import "./media-chrome.mjs";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const { Recorder, InteractionTimeline } = await import("@webreel/core");
// Component previews show the interaction itself without tutorial key overlays.
InteractionTimeline.prototype.showHud = function () {};
const webreel = dirname(fileURLToPath(import.meta.resolve("webreel")));
const core = import.meta.resolve("@webreel/core");
const configPath = resolve(process.argv[2]);
const work = dirname(configPath);
const config = JSON.parse(readFileSync(configPath, "utf8"));
const outDir = resolve(work, config.outDir);
mkdirSync(outDir, { recursive: true });
let active = null;
let frameLimit = Infinity;
const waits = [];

globalThis.waitForCaptureFrames = ms => {
  if (!active) return new Promise(resolve => setTimeout(resolve, ms));
  const target = active.getFrameCount() + Math.ceil(ms * active.fps / 1000);
  return new Promise(resolve => waits.push({ target, resolve }));
};

// The stock loop duplicates screenshots to catch up with wall time. Sample
// every animation frame instead, letting slower machines render offline.
Recorder.prototype.captureLoop = async function (client) {
  active = { getFrameCount: () => this.frameCount, fps: this.fps };
  const hashes = new Set();
  const { createHash } = await import("node:crypto");
  await client.Runtime.evaluate({ expression: "window.startOfflineCapture()" });
  try {
    while (this.running && this.frameCount < frameLimit) {
      this.timeline?.tick();
      await client.Runtime.evaluate({ expression: `window.advanceOfflineCapture(${this.frameCount * 1000 / this.fps})` });
      const result = await this.raceStop(client.Page.captureScreenshot({ format: "jpeg", quality: 95, optimizeForSpeed: true }));
      if (!result) break;
      const bytes = Buffer.from(result.data, "base64");
      hashes.add(createHash("sha256").update(bytes).digest("hex"));
      await this.writeFrame(bytes);
      this.frameCount++;
      for (let i = waits.length - 1; i >= 0; i--) if (this.frameCount >= waits[i].target) waits.splice(i, 1)[0].resolve();
      if (this.frameCount % 60 === 0) console.log(`Captured ${this.frameCount} frame samples`);
    }
  } finally {
    active = null;
    for (const wait of waits.splice(0)) wait.resolve();
    writeFileSync(resolve(work, "last-capture.json"), JSON.stringify({ frames: this.frameCount, distinctImages: hashes.size, fps: this.fps }, null, 2));
  }
};

// Scope the compatibility adapter to this run. Never patch installed packages.
const source = readFileSync(resolve(webreel, "lib/runner.js"), "utf8");
const pauseImport = "injectOverlays, pause,";
const coreImport = 'from "@webreel/core";';
if (!source.includes(pauseImport) || !source.includes(coreImport)) throw new Error("Webreel capture adapter needs review for this version.");
const adapted = source.replace(pauseImport, "injectOverlays, pause as realPause,")
  .replace(coreImport, `from ${JSON.stringify(core)};\nconst pause = ms => globalThis.waitForCaptureFrames(ms);`);
mkdirSync(work, { recursive: true });
const runnerPath = resolve(work, "offline-runner.mjs");
writeFileSync(runnerPath, adapted);
const { runVideo } = await import(pathToFileURL(runnerPath).href);
const names = process.argv.slice(3);
for (const name of names.length ? names : Object.keys(config.videos)) {
  const video = config.videos[name];
  if (!video) throw new Error(`Unknown video: ${name}`);
  const budgetsPath = resolve(work, "capture-frame-budgets.json");
  const budget = existsSync(budgetsPath) ? JSON.parse(readFileSync(budgetsPath, "utf8"))[name] : undefined;
  frameLimit = budget === undefined ? Infinity : budget;
  if (frameLimit !== Infinity && (!Number.isInteger(frameLimit) || frameLimit < 1)) throw new Error(`Invalid capture frame budget: ${name}`);
  const timeout = setTimeout(() => { console.error(`Capture timed out: ${name}`); process.exit(1); }, 30 * 60 * 1000);
  try {
    await runVideo({ ...video, theme: config.theme, defaultDelay: 0, name, output: resolve(outDir, video.output) }, { configDir: work, verbose: true });
    const evidence = readFileSync(resolve(work, "last-capture.json"));
    writeFileSync(resolve(outDir, `${video.output}.capture.json`), evidence);
  } finally {
    clearTimeout(timeout);
  }
}
