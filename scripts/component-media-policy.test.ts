import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { test, type TestContext } from "node:test";
import { allCatalogItems } from "../src/lib/catalog";
import { componentMediaPolicy, verifyMediaFiles, verifyMediaMetadata } from "./component-media-policy";

const entry = allCatalogItems[0];
const videoName = basename(entry.media.video.src);
const posterName = basename(entry.media.thumbnail.src);

async function fixture(context: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "modulo-media-policy-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, videoName), "video");
  await writeFile(join(directory, posterName), "poster");
  return directory;
}

test("accepts the current catalog metadata and a complete preview pair", async context => {
  allCatalogItems.forEach(verifyMediaMetadata);
  await verifyMediaFiles([entry], await fixture(context));
});

test("accepts exactly one million bytes and rejects one byte more", async context => {
  const directory = await fixture(context);
  await writeFile(join(directory, videoName), Buffer.alloc(componentMediaPolicy.maxVideoBytes));
  await verifyMediaFiles([entry], directory);
  await writeFile(join(directory, videoName), Buffer.alloc(componentMediaPolicy.maxVideoBytes + 1));
  await assert.rejects(verifyMediaFiles([entry], directory), /exceeds 1000000 bytes/);
});

test("rejects a module listed in more than one category", async context => {
  await assert.rejects(verifyMediaFiles([entry, entry], await fixture(context)), /Duplicate catalog module/);
});

for (const name of ["old.gif", "raw-capture.mp4", "recording.mov"]) {
  test(`rejects uncataloged ${name}`, async context => {
    const directory = await fixture(context);
    await writeFile(join(directory, name), "unexpected");
    await assert.rejects(verifyMediaFiles([entry], directory), /Unexpected component media/);
  });
}

test("rejects a missing poster", async context => {
  const directory = await fixture(context);
  await rm(join(directory, posterName));
  await assert.rejects(verifyMediaFiles([entry], directory), /ENOENT/);
});

for (const video of [
  { ...entry.media.video, width: 1200 },
  { ...entry.media.video, height: 481 },
  { ...entry.media.video, duration: 6.1 },
  { ...entry.media.video, duration: 4.001 },
]) {
  test(`rejects invalid video metadata ${JSON.stringify(video)}`, () => {
    assert.throws(() => verifyMediaMetadata({ ...entry, media: { ...entry.media, video } }), /Invalid media metadata/);
  });
}

test("rejects a poster with different dimensions", () => {
  assert.throws(() => verifyMediaMetadata({ ...entry, media: {
    ...entry.media, thumbnail: { ...entry.media.thumbnail, height: entry.media.video.height + 2 },
  } }), /Invalid media metadata/);
});
