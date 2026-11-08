import { NextRequest } from "next/server";
import { z } from "zod";
import { accessJson, AccessError, clearAccessSession, createAccessSession, handleAccessRequest, hasSourceAccess, hashSecret, readAccessBody, requireSameOrigin, SOURCE_COOKIE, tokenPattern } from "@/lib/access";
import { getMintStore } from "@/lib/mint-store";

export async function GET(request: NextRequest) {
  return handleAccessRequest(async () => accessJson({ authenticated: await hasSourceAccess(request) }));
}
export async function POST(request: NextRequest) {
  return handleAccessRequest(async () => {
    requireSameOrigin(request);
    const { key } = await readAccessBody(request, z.object({ key: z.string().max(128) }));
    const keyId = tokenPattern.test(key) ? await (await getMintStore()).findActiveKey(hashSecret(key)) : null;
    if (!keyId) throw new AccessError("This key is invalid or has been revoked.", 401);
    return createAccessSession(request, { kind: "source", keyId });
  });
}
export async function DELETE(request: NextRequest) {
  return handleAccessRequest(async () => { requireSameOrigin(request); return clearAccessSession(request, SOURCE_COOKIE); });
}
