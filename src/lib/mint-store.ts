import "server-only";
import { createClient, type Config } from "@libsql/client";
import { mkdir } from "node:fs/promises";
import { z } from "zod";

const keyRowSchema = z.object({
  id: z.string().uuid(), label: z.string(), suffix: z.string(),
  created_at: z.number(), revoked_at: z.number().nullable(),
});
const sessionRowSchema = z.object({ session_hash: z.string() });
const idRowSchema = z.object({ id: z.string().uuid() });
const attemptSchema = z.object({ count: z.number(), reset_at: z.number() });

export function createMintStore(config: Config) {
  const db = createClient(config);
  const ready = db.batch([
    `CREATE TABLE IF NOT EXISTS access_keys (
      id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL, suffix TEXT NOT NULL, created_at INTEGER NOT NULL, revoked_at INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS access_sessions (
      session_hash TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK (kind IN ('mint', 'source')),
      key_id TEXT REFERENCES access_keys(id), verifier_hash TEXT, expires_at INTEGER NOT NULL,
      CHECK ((kind = 'mint' AND key_id IS NULL AND verifier_hash IS NOT NULL)
        OR (kind = 'source' AND key_id IS NOT NULL AND verifier_hash IS NULL))
    )`,
    "CREATE INDEX IF NOT EXISTS access_sessions_expiry ON access_sessions(expires_at)",
    `CREATE TABLE IF NOT EXISTS login_attempts (
      bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL
    )`,
  ], "write");

  function keyInfo(row: unknown) {
    const key = keyRowSchema.parse(row);
    return { id: key.id, label: key.label, suffix: key.suffix, createdAt: key.created_at, revokedAt: key.revoked_at };
  }

  return {
    async createKey(input: { id: string; tokenHash: string; label: string; suffix: string; createdAt: number }) {
      await ready;
      const result = await db.execute({
        sql: "INSERT INTO access_keys (id, token_hash, label, suffix, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id, label, suffix, created_at, revoked_at",
        args: [input.id, input.tokenHash, input.label, input.suffix, input.createdAt],
      });
      return keyInfo(result.rows[0]);
    },
    async listKeys() {
      await ready;
      const result = await db.execute("SELECT id, label, suffix, created_at, revoked_at FROM access_keys ORDER BY created_at DESC, id");
      return result.rows.map(keyInfo);
    },
    async findActiveKey(tokenHash: string) {
      await ready;
      const result = await db.execute({ sql: "SELECT id FROM access_keys WHERE token_hash = ? AND revoked_at IS NULL", args: [tokenHash] });
      return result.rows.length ? idRowSchema.parse(result.rows[0]).id : null;
    },
    async revokeKey(id: string) {
      await ready;
      const result = await db.execute({
        sql: "UPDATE access_keys SET revoked_at = COALESCE(revoked_at, ?) WHERE id = ? RETURNING id",
        args: [Date.now(), id],
      });
      return result.rows.length > 0;
    },
    async createSession(input: { sessionHash: string; expiresAt: number } & (
      { kind: "mint"; verifierHash: string } | { kind: "source"; keyId: string }
    )) {
      await ready;
      await db.batch([
        { sql: "DELETE FROM access_sessions WHERE expires_at <= ?", args: [Date.now()] },
        { sql: "INSERT INTO access_sessions (session_hash, kind, key_id, verifier_hash, expires_at) VALUES (?, ?, ?, ?, ?)",
          args: [input.sessionHash, input.kind, input.kind === "source" ? input.keyId : null, input.kind === "mint" ? input.verifierHash : null, input.expiresAt] },
      ], "write");
    },
    async hasMintSession(sessionHash: string, verifierHash: string) {
      await ready;
      const result = await db.execute({
        sql: "SELECT session_hash FROM access_sessions WHERE session_hash = ? AND kind = 'mint' AND verifier_hash = ? AND expires_at > ?",
        args: [sessionHash, verifierHash, Date.now()],
      });
      return result.rows.length > 0 && sessionRowSchema.safeParse(result.rows[0]).success;
    },
    async hasSourceSession(sessionHash: string) {
      await ready;
      const result = await db.execute({
        sql: `SELECT s.session_hash FROM access_sessions s JOIN access_keys k ON s.key_id = k.id
          WHERE s.session_hash = ? AND s.kind = 'source' AND s.expires_at > ? AND k.revoked_at IS NULL`,
        args: [sessionHash, Date.now()],
      });
      return result.rows.length > 0 && sessionRowSchema.safeParse(result.rows[0]).success;
    },
    async deleteSession(sessionHash: string) {
      await ready;
      await db.execute({ sql: "DELETE FROM access_sessions WHERE session_hash = ?", args: [sessionHash] });
    },
    async consumeAttempt(bucket: string, limit: number, windowMs: number) {
      await ready;
      const now = Date.now();
      const result = await db.execute({
        sql: `INSERT INTO login_attempts (bucket, count, reset_at) VALUES (?, 1, ?)
          ON CONFLICT(bucket) DO UPDATE SET
          count = CASE WHEN reset_at <= ? THEN 1 ELSE count + 1 END,
          reset_at = CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at END
          RETURNING count, reset_at`,
        args: [bucket, now + windowMs, now, now],
      });
      const attempt = attemptSchema.parse(result.rows[0]);
      return { allowed: attempt.count <= limit, retryAfter: Math.max(1, Math.ceil((attempt.reset_at - now) / 1000)) };
    },
    async close() { await ready; db.close(); },
  };
}

let store: Promise<ReturnType<typeof createMintStore>> | undefined;
export function getMintStore() {
  store ??= (async () => {
    const url = process.env.MODULO_DATABASE_URL;
    if (!url && process.env.NODE_ENV === "production") throw new Error("The mint database is not configured.");
    if (process.env.VERCEL && (!url || url.startsWith("file:"))) throw new Error("Vercel requires a persistent remote mint database.");
    if (!url) await mkdir(".data", { recursive: true, mode: 0o700 });
    return createMintStore({ url: url ?? "file:.data/mint.db", authToken: process.env.MODULO_DATABASE_AUTH_TOKEN });
  })().catch(error => { store = undefined; throw error; });
  return store;
}
