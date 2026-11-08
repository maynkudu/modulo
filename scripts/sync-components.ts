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
  files: z.array(z.object({ path: relativePath, sha256: z.string().regex(/^[a-f0-9]{64}$/) })),
})) }).parse(JSON.parse(await readFile(resolve(root, "components.lock.json"), "utf8")));
const force = process.argv.includes("--force");
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const githubFileSchema = z.object({ encoding: z.literal("base64"), content: z.string() });

for (const component of lock.components) {
  let fetched = 0;
  for (const file of component.files) {
    const target = resolve(root, "src/registry", component.name, file.path);
    let local: Buffer | null;
    try { local = await readFile(target); }
    catch (error) { if (error instanceof Error && "code" in error && error.code === "ENOENT") local = null; else throw error; }
    if (!force && local) {
      if (hash(local) !== file.sha256) throw new Error(`Modified component file: ${component.name}/${file.path}. Update its private repository and lock revision, or explicitly use --force.`);
      continue;
    }
    const endpoint = `repos/${component.repository}/contents/${file.path}?ref=${component.revision}`;
    let payload: unknown;
    const token = process.env.MODULO_COMPONENTS_TOKEN;
    if (token) {
      const response = await fetch(`https://api.github.com/${endpoint}`, { headers: {
        Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
      } });
      if (!response.ok) throw new Error(`Could not fetch ${component.name}/${file.path}. GitHub returned ${response.status}.`);
      payload = await response.json();
    } else if (!process.env.VERCEL) {
      try { payload = JSON.parse((await run("gh", ["api", "-H", "Accept: application/vnd.github+json", endpoint], { maxBuffer: 8 * 1024 * 1024 })).stdout); }
      catch { throw new Error(`Private component access is unavailable. Log in with gh or set MODULO_COMPONENTS_TOKEN to a read-only token for the component repositories.`); }
    } else throw new Error("MODULO_COMPONENTS_TOKEN is required to build private components on Vercel.");
    const bytes = Buffer.from(githubFileSchema.parse(payload).content, "base64");
    if (hash(bytes) !== file.sha256) throw new Error(`Source checksum mismatch for ${component.name}/${file.path}.`);
    await mkdir(dirname(target), { recursive: true });
    const temporary = `${target}.${randomUUID()}.tmp`;
    await writeFile(temporary, bytes);
    await rename(temporary, target);
    fetched++;
  }
  console.log(`${component.name}: verified ${component.files.length} files, fetched ${fetched}.`);
}
