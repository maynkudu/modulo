import { NextRequest } from "next/server";
import { z } from "zod";
import { accessJson, AccessError, handleAccessRequest, requireMintAccess, requireSameOrigin } from "@/lib/access";
import { getMintStore } from "@/lib/mint-store";

export async function DELETE(request: NextRequest, context: RouteContext<"/api/mint/keys/[id]">) {
  return handleAccessRequest(async () => {
    requireSameOrigin(request);
    await requireMintAccess(request);
    const { id } = z.object({ id: z.string().uuid() }).parse(await context.params);
    if (!await (await getMintStore()).revokeKey(id)) throw new AccessError("This key was not found.", 404);
    return accessJson({ ok: true });
  });
}
