import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import { NextRequest, type NextResponse } from "next/server";
import { GET as mintStatus, POST as login, DELETE as lockMint } from "../src/app/api/mint/session/route";
import { GET as listKeys, POST as createKey } from "../src/app/api/mint/keys/route";
import { DELETE as revokeKey } from "../src/app/api/mint/keys/[id]/route";
import { GET as sourceStatus, POST as unlockSource } from "../src/app/api/source-access/route";
import { GET as registry } from "../src/app/r/[name]/route";
import { createdKeySchema, keyListSchema, sessionStatusSchema, sourceItemSchema } from "../src/lib/access-schema";
import { getMintStore } from "../src/lib/mint-store";
import { catalogItems } from "../src/lib/catalog";

const directory = await mkdtemp(resolve(tmpdir(), "modulo-access-"));
const databaseUrl = `file:${directory}/mint.db`;
const passphrase = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
process.env.MODULO_DATABASE_URL = databaseUrl;
process.env.MODULO_MINT_PASSPHRASE_HASH = `scrypt:${salt}:${scryptSync(passphrase, salt, 64).toString("hex")}`;
const origin = "https://modulo.test";
let assertions = 0;
function check(value: unknown, message: string) { assert(value, message); assertions++; }
function request(path: string, options: { method?: string; cookie?: string; key?: string; body?: unknown; origin?: string } = {}) {
  const headers = new Headers({ host: "modulo.test", "x-forwarded-proto": "https", origin: options.origin ?? origin });
  if (options.cookie) headers.set("cookie", options.cookie);
  if (options.key !== undefined) headers.set("authorization", `Bearer ${options.key}`);
  if (options.body !== undefined) headers.set("content-type", "application/json");
  return new NextRequest(`${origin}${path}`, { method: options.method ?? "GET", headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}
function cookie(response: NextResponse) {
  const value = response.headers.get("set-cookie");
  assert(value); check(value.includes("HttpOnly") && value.includes("Secure") && value.includes("SameSite=strict"), "Sessions use HttpOnly, Secure, SameSite cookies.");
  return value.split(";")[0];
}
async function source(name: string, options?: Parameters<typeof request>[1]) {
  return registry(request(`/r/${name}.json`, options), { params: Promise.resolve({ name: `${name}.json` }) });
}

let db: ReturnType<typeof createClient> | undefined;
try {
  check(!sessionStatusSchema.parse(await (await mintStatus(request("/api/mint/session"))).json()).authenticated, "Missing sessions stay locked.");
  check((await listKeys(request("/api/mint/keys"))).status === 401, "Unauthenticated users cannot list keys.");
  check((await createKey(request("/api/mint/keys", { method: "POST", body: { label: "No access" } }))).status === 401, "Unauthenticated users cannot mint keys.");
  check((await login(request("/api/mint/session", { method: "POST", body: { passphrase }, origin: "https://other.test" }))).status === 403, "Cross-origin mint login is denied.");
  check((await login(request("/api/mint/session", { method: "POST", body: { passphrase: "incorrect" } }))).status === 401, "Incorrect passphrases are denied.");
  const authenticated = await login(request("/api/mint/session", { method: "POST", body: { passphrase } }));
  check(authenticated.status === 200, "The configured passphrase unlocks the mint.");
  const mintCookie = cookie(authenticated);
  check(sessionStatusSchema.parse(await (await mintStatus(request("/api/mint/session", { cookie: mintCookie }))).json()).authenticated, "Mint sessions survive another request.");
  const first = createdKeySchema.parse(await (await createKey(request("/api/mint/keys", { method: "POST", cookie: mintCookie, body: { label: "First key" } }))).json());
  const second = createdKeySchema.parse(await (await createKey(request("/api/mint/keys", { method: "POST", cookie: mintCookie, body: { label: "Second key" } }))).json());
  check(/^maynkudu_[a-zA-Z0-9_-]{43}$/.test(first.key), "Minted keys have the required prefix and 32 random bytes.");
  const listing = await listKeys(request("/api/mint/keys", { cookie: mintCookie }));
  const listingText = await listing.text();
  check(!listingText.includes(first.key) && !listingText.includes(second.key), "Listing never returns plaintext keys.");
  check(keyListSchema.parse(JSON.parse(listingText)).keys.length === 2, "Minted keys persist in the key list.");
  check((await createKey(request("/api/mint/keys", { method: "POST", cookie: mintCookie, body: { label: "   " } }))).status === 400, "Blank key names are rejected.");
  check((await createKey(request("/api/mint/keys", { method: "POST", cookie: mintCookie, body: { label: "Invalid origin" }, origin: "https://other.test" }))).status === 403, "Cross-origin key creation is denied.");

  for (const item of catalogItems) {
    const name = item.component.name;
    check((await source(name)).status === 401, `Missing keys cannot download ${name}.`);
    check((await source(name, { key: "invalid" })).status === 401, `Invalid keys cannot download ${name}.`);
    const response = await source(name, { key: first.key });
    check(response.status === 200 && response.headers.get("cache-control") === "private, no-store", `${name} requires live authorization and disallows caching.`);
    const manifest = sourceItemSchema.parse(await response.json());
    check(manifest.files.length === item.component.files.length && manifest.files.every(file => file.content.length > 0), `${name} serves every real source file.`);
  }
  check((await source("registry")).status === 401, "The full registry catalog is protected.");
  check((await source("registry", { key: first.key })).status === 200, "Active keys can read the registry catalog.");
  check((await source("missing", { key: first.key })).status === 404, "Unknown registry items are rejected.");
  check((await source("nilkamal", { cookie: mintCookie })).status === 401, "Mint sessions do not replace source keys.");

  const unlocked = await unlockSource(request("/api/source-access", { method: "POST", body: { key: first.key } }));
  const sourceCookie = cookie(unlocked);
  check((await source("nilkamal", { cookie: sourceCookie })).status === 200, "Browser source sessions authorize downloads.");
  check((await source("nilkamal", { cookie: sourceCookie, key: "invalid" })).status === 401, "Invalid explicit headers cannot fall back to a valid cookie.");
  check((await createKey(request("/api/mint/keys", { method: "POST", cookie: sourceCookie, body: { label: "Not an admin" } }))).status === 401, "Source keys cannot administer the mint.");
  const context = { params: Promise.resolve({ id: first.info.id }) };
  check((await revokeKey(request(`/api/mint/keys/${first.info.id}`, { method: "DELETE" }), context)).status === 401, "Unauthenticated revocation is denied.");
  check((await revokeKey(request(`/api/mint/keys/${first.info.id}`, { method: "DELETE", cookie: mintCookie }), context)).status === 200, "Mint administrators can revoke keys.");
  check((await source("nilkamal", { key: first.key })).status === 401, "Revocation immediately denies CLI access.");
  check((await source("nilkamal", { cookie: sourceCookie })).status === 401, "Revocation immediately denies existing browser sessions.");
  check(!sessionStatusSchema.parse(await (await sourceStatus(request("/api/source-access", { cookie: sourceCookie }))).json()).authenticated, "Revoked source sessions report locked status.");
  check((await unlockSource(request("/api/source-access", { method: "POST", body: { key: first.key } }))).status === 401, "Revoked keys cannot open new sessions.");
  check((await source("nilkamal", { key: second.key })).status === 200, "Another active key survives revocation.");
  check((await revokeKey(request(`/api/mint/keys/${first.info.id}`, { method: "DELETE", cookie: mintCookie }), context)).status === 200, "Repeated revocation is harmless.");

  db = createClient({ url: databaseUrl });
  const stored = await db.execute("SELECT * FROM access_keys");
  check(!JSON.stringify(stored.rows).includes(first.key), "The persistent database does not retain raw keys.");
  const reconnectListing = await db.execute("SELECT id FROM access_keys WHERE revoked_at IS NOT NULL");
  check(reconnectListing.rows.length === 1, "Revocation persists for a separate database connection.");
  const race = await Promise.all(Array.from({ length: 8 }, () => getMintStore().then(store => store.consumeAttempt("test:concurrent", 1, 60_000))));
  check(race.filter(attempt => attempt.allowed).length === 1, "Atomic admission allows exactly one concurrent attempt.");
  await db.execute("DELETE FROM login_attempts");
  for (let attempt = 0; attempt < 5; attempt++) await login(request("/api/mint/session", { method: "POST", body: { passphrase: "incorrect" } }));
  const limited = await login(request("/api/mint/session", { method: "POST", body: { passphrase } }));
  check(limited.status === 429 && Number(limited.headers.get("retry-after")) > 0, "Passphrase guessing is rate limited with Retry-After.");
  await db.execute("UPDATE access_sessions SET expires_at = 0");
  check((await listKeys(request("/api/mint/keys", { cookie: mintCookie }))).status === 401, "Expired mint sessions cannot list keys.");
  check((await lockMint(request("/api/mint/session", { method: "DELETE", cookie: mintCookie }))).status === 200, "Lock removes a mint session.");
  await (await getMintStore()).close();
  check((await source("nilkamal", { key: second.key })).status === 503, "Database failure denies source access.");
  console.log(`Access verification passed: ${assertions} assertions against real route handlers and a disposable database.`);
} finally {
  db?.close();
  await rm(directory, { recursive: true, force: true });
  delete process.env.MODULO_DATABASE_URL;
  delete process.env.MODULO_MINT_PASSPHRASE_HASH;
}
