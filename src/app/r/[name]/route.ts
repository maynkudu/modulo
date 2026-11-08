import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextRequest } from "next/server";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import { accessJson, AccessError, handleAccessRequest, requireSourceAccess } from "@/lib/access";
import { catalogItems } from "@/lib/catalog";

export async function GET(request: NextRequest, context: RouteContext<"/r/[name]">) {
  return handleAccessRequest(async () => {
    await requireSourceAccess(request);
    const { name } = await context.params;
    if (name !== "registry.json" && !catalogItems.some(item => `${item.component.name}.json` === name)) throw new AccessError("This component was not found.", 404);
    const content: unknown = JSON.parse(await readFile(resolve(process.cwd(), ".private-registry", name), "utf8"));
    return accessJson(name === "registry.json" ? registrySchema.parse(content) : registryItemSchema.parse(content));
  });
}
