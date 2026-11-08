import { NextRequest } from "next/server";
import { z } from "zod";
import { accessJson, AccessError, clearAccessSession, createAccessSession, handleAccessRequest, hasMintAccess, limitMintLogin, MINT_COOKIE, readAccessBody, requireSameOrigin, verifyMintPassphrase } from "@/lib/access";

export async function GET(request: NextRequest) {
  return handleAccessRequest(async () => accessJson({ authenticated: await hasMintAccess(request) }));
}
export async function POST(request: NextRequest) {
  return handleAccessRequest(async () => {
    requireSameOrigin(request);
    const { passphrase } = await readAccessBody(request, z.object({ passphrase: z.string().min(1).max(256) }));
    await limitMintLogin(request);
    if (!await verifyMintPassphrase(passphrase)) throw new AccessError("Incorrect passphrase.", 401);
    return createAccessSession(request, { kind: "mint" });
  });
}
export async function DELETE(request: NextRequest) {
  return handleAccessRequest(async () => { requireSameOrigin(request); return clearAccessSession(request, MINT_COOKIE); });
}
