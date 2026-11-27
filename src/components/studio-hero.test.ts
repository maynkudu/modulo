import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { grainGradientFragmentShader } from "@paper-design/shaders";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const sha256 = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");

test("the wave implementation retains the live reference shader", () => {
  const wave = "float wave = cos(.5 * shape_uv.x - 4. * t) * sin(1.5 * shape_uv.x + 2. * t) * (.75 + .25 * cos(6. * t));";
  const baseline = grainGradientFragmentShader
    .replace("void main()", "float mfWave(float x, float t) { return cos(.5 * x - 4. * t) * sin(1.5 * x + 2. * t) * (.75 + .25 * cos(6. * t)); }\nvoid main()")
    .replace(wave, "float wave = mfWave(shape_uv.x, 1.75) + 0.25 * (mfWave(shape_uv.x, t) - mfWave(shape_uv.x, 1.75));");
  assert.equal(sha256(baseline), "2a832470632661f3fabdd9c16ca84f526fa883c4bb1e1b14bdbfbebd9b412781");
});

test("the supplied lettering remains a transparent vector wordmark", () => {
  const wordmark = read("../../public/brand/modulo-wordmark.svg");
  const dimensions = wordmark.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/);
  assert.ok(dimensions);
  assert.equal(Number(dimensions[1]), 1255.465644163);
  assert.equal(Number(dimensions[2]), 382.48143689);
  assert.match(wordmark, /fill="url\(#wordmark-fill\)"/);
  assert.doesNotMatch(wordmark, /<(?:rect|image)\b/);
  const logo = read("./modulo-logo.tsx");
  assert.ok(logo.includes('src="/brand/modulo-wordmark.svg"'));
  assert.match(logo, /width=\{1255\.465644163\} height=\{382\.48143689\}/);
});
