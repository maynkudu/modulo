import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import { interactiveArt } from "../src/lib/catalog";

const root = fileURLToPath(new URL("../", import.meta.url));
const files = await Promise.all(
  interactiveArt.files.map(async (file) => ({
    ...file,
    content: await readFile(resolve(root, file.path), "utf8"),
  })),
);

const item = registryItemSchema.parse({
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  ...interactiveArt,
  files,
});

await mkdir(resolve(root, "public/r"), { recursive: true });
await writeFile(
  resolve(root, "public/r/interactive-art.json"),
  `${JSON.stringify(item, null, 2)}\n`,
);
const homepage = process.env.REGISTRY_BASE_URL ?? "http://modulo.localhost:1355";
const catalog = registrySchema.parse({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "modulo",
  homepage,
  items: [item],
});
await writeFile(resolve(root, "public/r/registry.json"), `${JSON.stringify(catalog, null, 2)}\n`);
const sourceRegistry = registrySchema.parse({
  ...catalog,
  items: [interactiveArt],
});
await writeFile(resolve(root, "registry.json"), `${JSON.stringify(sourceRegistry, null, 2)}\n`);
console.log(`Built ${item.name}, ${files.length} source files.`);
