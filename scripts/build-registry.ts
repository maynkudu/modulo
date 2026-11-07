import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import { catalogItems } from "../src/lib/catalog";
import { siteUrl } from "../src/lib/site";

const root = fileURLToPath(new URL("../", import.meta.url));
const homepage = process.env.REGISTRY_BASE_URL ?? siteUrl;
await Promise.all(catalogItems.flatMap(({ media }) => Object.values(media).map(async ({ src }) => {
  const asset = await stat(resolve(root, `public${src}`));
  if (!asset.isFile() || asset.size === 0) throw new Error(`Missing component media: ${src}`);
})));
const sourceItems = catalogItems.map(({ component, media }) => ({
  ...component,
  meta: {
    media: Object.fromEntries(Object.entries(media).map(([kind, { src, ...details }]) => [kind, {
      ...details,
      url: new URL(src, homepage).href,
    }])),
  },
}));
await mkdir(resolve(root, "public/r"), { recursive: true });
const items = await Promise.all(sourceItems.map(async (component) => {
  const files = await Promise.all(component.files.map(async (file) => ({
    ...file,
    content: await readFile(resolve(root, file.path), "utf8"),
  })));
  const item = registryItemSchema.parse({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...component,
    files,
  });
  await writeFile(resolve(root, `public/r/${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
  console.log(`Built ${item.name}, ${files.length} source files.`);
  return item;
}));
const catalog = registrySchema.parse({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "modulo",
  homepage,
  items,
});
await writeFile(resolve(root, "public/r/registry.json"), `${JSON.stringify(catalog, null, 2)}\n`);
const sourceRegistry = registrySchema.parse({
  ...catalog,
  items: sourceItems,
});
await writeFile(resolve(root, "registry.json"), `${JSON.stringify(sourceRegistry, null, 2)}\n`);
