import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { z } from "zod";

const root = fileURLToPath(new URL("../", import.meta.url));
const run = promisify(execFile);
const relativePath = z.string().regex(/^[a-zA-Z0-9._/-]+$/).refine(path =>
  !path.startsWith("/") && path.split("/").every(part => part !== ".." && part !== "." && part !== ".git"),
);
const lock = z.object({ components: z.array(z.object({
  name: z.string().regex(/^[a-z0-9-]+$/), repository: z.string().regex(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/),
  revision: z.string().regex(/^[a-f0-9]{40}$/),
  files: z.array(z.object({ path: relativePath, publicAsset: z.string().regex(/^artwork\/[a-z0-9-]+\.glb$/).optional(), sha256: z.string().regex(/^[a-f0-9]{64}$/) })),
})) }).parse(JSON.parse(await readFile(resolve(root, "components.lock.json"), "utf8")));
const force = process.argv.includes("--force");
let token = process.env.MODULO_COMPONENTS_TOKEN;
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
async function writeAtomically(target: string, bytes: Buffer) {
  await mkdir(dirname(target), { recursive: true });
  const temporary = `${target}.${randomUUID()}.tmp`;
  await writeFile(temporary, bytes);
  await rename(temporary, target);
}
async function publishPreview(path: string | undefined, bytes: Buffer, checksum: string) {
  if (!path) return;
  const target = resolve(root, "public", path);
  try {
    if (hash(await readFile(target)) === checksum) return;
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
  await writeAtomically(target, bytes);
}

for (const component of lock.components) {
  let fetched = 0;
  for (const file of component.files) {
    const target = resolve(root, "src/registry", component.name, file.path);
    let local: Buffer | null;
    try { local = await readFile(target); }
    catch (error) { if (error instanceof Error && "code" in error && error.code === "ENOENT") local = null; else throw error; }
    if (!force && local) {
      if (hash(local) !== file.sha256) throw new Error(`Modified component file: ${component.name}/${file.path}. Update its private repository and lock revision, or explicitly use --force.`);
      await publishPreview(file.publicAsset, local, file.sha256);
      continue;
    }
    const endpoint = `repos/${component.repository}/contents/${file.path}?ref=${component.revision}`;
    if (!token && !process.env.VERCEL) {
      try { token = (await run("gh", ["auth", "token"], { encoding: "utf8" })).stdout.trim(); }
      catch { throw new Error(`Private component access is unavailable. Log in with gh or set MODULO_COMPONENTS_TOKEN to a read-only token for the component repositories.`); }
    }
    if (!token) throw new Error("MODULO_COMPONENTS_TOKEN is required to build private components on Vercel.");
    const response = await fetch(`https://api.github.com/${endpoint}`, { headers: {
      Authorization: `Bearer ${token}`, Accept: "application/vnd.github.raw+json", "X-GitHub-Api-Version": "2022-11-28",
    } });
    if (!response.ok) throw new Error(`Could not fetch ${component.name}/${file.path}. GitHub returned ${response.status}.`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (hash(bytes) !== file.sha256) throw new Error(`Source checksum mismatch for ${component.name}/${file.path}.`);
    await writeAtomically(target, bytes);
    await publishPreview(file.publicAsset, bytes, file.sha256);
    fetched++;
  }
  console.log(`${component.name}: verified ${component.files.length} files, fetched ${fetched}.`);
}
