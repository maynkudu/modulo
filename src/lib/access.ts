import "server-only";
import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMintStore } from "./mint-store";

export const MINT_COOKIE = "modulo_mint";
export const SOURCE_COOKIE = "modulo_source";
const SESSION_SECONDS = 8 * 60 * 60;
const sessionPattern = /^[a-zA-Z0-9_-]{43}$/;
export const tokenPattern = /^maynkudu_[a-zA-Z0-9_-]{43}$/;
export const hashSecret = (value: string) => createHash("sha256").update(value).digest("hex");

export class AccessError extends Error {
  constructor(message: string, readonly status: number, readonly retryAfter?: number) { super(message); }
}

function mintVerifier() {
  const verifier = process.env.MODULO_MINT_PASSPHRASE_HASH;
  if (!verifier || !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(verifier)) throw new Error("The mint passphrase is not configured.");
  return verifier;
}

export async function verifyMintPassphrase(passphrase: string) {
  const verifier = mintVerifier();
  const [, salt, expected] = verifier.split(":");
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scrypt(passphrase, salt, 64, (error, key) => { if (error) reject(error); else resolve(key); });
  });
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

export function accessJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: {
    "Cache-Control": "private, no-store", "Vary": "Cookie, Authorization", "X-Robots-Tag": "noindex",
  } });
}

export async function handleAccessRequest(action: () => Promise<NextResponse>) {
  try { return await action(); }
  catch (error) {
    if (error instanceof AccessError) {
      const response = accessJson({ error: error.message }, error.status);
      if (error.retryAfter) response.headers.set("Retry-After", String(error.retryAfter));
      return response;
    }
    if (error instanceof z.ZodError || error instanceof SyntaxError) return accessJson({ error: "Check the submitted fields." }, 400);
    return accessJson({ error: "Access is temporarily unavailable. Try again." }, 503);
  }
}

export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  if (!origin || origin !== `${protocol}://${host}`) throw new AccessError("This request must come from Modulo.", 403);
}

export async function readAccessBody<T>(request: NextRequest, schema: z.ZodType<T>) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new AccessError("Submit JSON fields.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new AccessError("Submit the required fields.", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.length;
      if (length > 4096) { await reader.cancel(); throw new AccessError("The submitted fields are too long.", 413); }
      chunks.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  const body: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  return schema.parse(body);
}

export async function hasMintAccess(request: NextRequest) {
  const session = request.cookies.get(MINT_COOKIE)?.value;
  if (!session || !sessionPattern.test(session)) return false;
  return (await getMintStore()).hasMintSession(hashSecret(session), hashSecret(mintVerifier()));
}

export async function requireMintAccess(request: NextRequest) {
  if (!await hasMintAccess(request)) throw new AccessError("Unlock the mint first.", 401);
}

export async function hasSourceAccess(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization !== null) {
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    return tokenPattern.test(token) && Boolean(await (await getMintStore()).findActiveKey(hashSecret(token)));
  }
  const session = request.cookies.get(SOURCE_COOKIE)?.value;
  return Boolean(session && sessionPattern.test(session) && await (await getMintStore()).hasSourceSession(hashSecret(session)));
}

export async function requireSourceAccess(request: NextRequest) {
  if (!await hasSourceAccess(request)) throw new AccessError("Enter an active Modulo key to access source.", 401);
}

export async function limitMintLogin(request: NextRequest) {
  const store = await getMintStore();
  const global = await store.consumeAttempt("mint:global", 60, 15 * 60_000);
  if (!global.allowed) throw new AccessError("Too many attempts. Try again later.", 429, global.retryAfter);
  // Vercel supplies this header. Other hosts share a bucket unless a trusted proxy is configured.
  const client = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") ?? "unknown" : "local";
  const attempt = await store.consumeAttempt(`mint:client:${hashSecret(client)}`, 5, 15 * 60_000);
  if (!attempt.allowed) throw new AccessError("Too many attempts. Try again later.", 429, attempt.retryAfter);
}

export async function createAccessSession(request: NextRequest, input: { kind: "mint" } | { kind: "source"; keyId: string }) {
  const session = randomBytes(32).toString("base64url");
  const common = { sessionHash: hashSecret(session), expiresAt: Date.now() + SESSION_SECONDS * 1000 };
  const store = await getMintStore();
  if (input.kind === "mint") await store.createSession({ ...common, kind: input.kind, verifierHash: hashSecret(mintVerifier()) });
  else await store.createSession({ ...common, kind: input.kind, keyId: input.keyId });
  const response = accessJson({ ok: true });
  response.cookies.set(input.kind === "mint" ? MINT_COOKIE : SOURCE_COOKIE, session, {
    httpOnly: true, secure: request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:",
    sameSite: "strict", path: "/", maxAge: SESSION_SECONDS,
  });
  return response;
}

export async function clearAccessSession(request: NextRequest, cookie: typeof MINT_COOKIE | typeof SOURCE_COOKIE) {
  const session = request.cookies.get(cookie)?.value;
  if (session && sessionPattern.test(session)) await (await getMintStore()).deleteSession(hashSecret(session));
  const response = accessJson({ ok: true });
  response.cookies.set(cookie, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0,
    secure: request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:",
  });
  return response;
}

export async function mintKey(label: string) {
  const key = `maynkudu_${randomBytes(32).toString("base64url")}`;
  const info = await (await getMintStore()).createKey({
    id: randomUUID(), tokenHash: hashSecret(key), label, suffix: key.slice(-4), createdAt: Date.now(),
  });
  return { key, info };
}
