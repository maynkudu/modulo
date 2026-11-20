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

test("the displayed logo is the user's original PNG", () => {
  const displayed = readFileSync(new URL("../../public/brand/modulo-supplied-logo.png", import.meta.url));
  assert.equal(sha256(displayed), "68c997507baf55b9e29579ada66a777c43d4f46dcb583dace201d7a21e823696");
  assert.ok(read("./modulo-logo.tsx").includes('src="/brand/modulo-supplied-logo.png"'));
});
