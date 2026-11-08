import { z } from "zod";

export const keyNameSchema = z.string().trim().min(1).max(80);
export const keyInfoSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  suffix: z.string(),
  createdAt: z.number(),
  revokedAt: z.number().nullable(),
});
export type KeyInfo = z.infer<typeof keyInfoSchema>;
export const keyListSchema = z.object({ keys: z.array(keyInfoSchema) });
export const createdKeySchema = z.object({ key: z.string(), info: keyInfoSchema });
export const sessionStatusSchema = z.object({ authenticated: z.boolean() });
export const okSchema = z.object({ ok: z.literal(true) });
export const sourceItemSchema = z.object({
  name: z.string(),
  files: z.array(z.object({ path: z.string(), target: z.string().optional(), content: z.string() })),
});

export async function accessRequest<T>(url: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const body: unknown = await response.json();
  if (!response.ok) {
    const error = z.object({ error: z.string() }).safeParse(body);
    throw new Error(error.success ? error.data.error : "The request failed. Try again.");
  }
  return schema.parse(body);
}
