import { NextRequest } from "next/server";
import { z } from "zod";
import { accessJson, handleAccessRequest, mintKey, readAccessBody, requireMintAccess, requireSameOrigin } from "@/lib/access";
import { keyNameSchema } from "@/lib/access-schema";
import { getMintStore } from "@/lib/mint-store";

export async function GET(request: NextRequest) {
  return handleAccessRequest(async () => { await requireMintAccess(request); return accessJson({ keys: await (await getMintStore()).listKeys() }); });
}
export async function POST(request: NextRequest) {
  return handleAccessRequest(async () => {
    requireSameOrigin(request);
    await requireMintAccess(request);
    const { label } = await readAccessBody(request, z.object({ label: keyNameSchema }));
    return accessJson(await mintKey(label), 201);
  });
}
