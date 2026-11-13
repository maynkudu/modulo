"use client";

import { LiquidCode } from "@/components/liquid-documentation";
import { useEffect, useState, type FormEvent } from "react";
import { accessRequest, createdKeySchema, keyListSchema, okSchema, sessionStatusSchema, type KeyInfo } from "@/lib/access-schema";
import { LiquidButton, LiquidInput } from "@/registry/liquid-animations/LiquidControls";
import styles from "@/app/page.module.css";

type MintState = { kind: "checking" } | { kind: "locked" } | { kind: "unlocked"; keys: KeyInfo[] };

export function Mint() {
  const [state, setState] = useState<MintState>({ kind: "checking" });
  const [newKey, setNewKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const session = await accessRequest("/api/mint/session", sessionStatusSchema);
        const data = session.authenticated ? await accessRequest("/api/mint/keys", keyListSchema) : null;
        if (active) setState(data ? { kind: "unlocked", keys: data.keys } : { kind: "locked" });
      } catch (error) {
        if (active) { setState({ kind: "locked" }); setError(error instanceof Error ? error.message : "Could not load the mint."); }
      }
    }
    void restore();
    return () => { active = false; };
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const passphrase = new FormData(form).get("passphrase");
    form.reset(); setPending(true); setError(""); setMessage("");
    try {
      await accessRequest("/api/mint/session", okSchema, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passphrase }),
      });
      const { keys } = await accessRequest("/api/mint/keys", keyListSchema);
      setState({ kind: "unlocked", keys });
    } catch (error) { setError(error instanceof Error ? error.message : "Could not unlock the mint."); }
    finally { setPending(false); }
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const label = new FormData(form).get("label");
    setNewKey(null); setPending(true); setError(""); setMessage("");
    try {
      const result = await accessRequest("/api/mint/keys", createdKeySchema, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label }),
      });
      setState(previous => previous.kind === "unlocked" ? { kind: "unlocked", keys: [result.info, ...previous.keys] } : previous);
      setNewKey(result.key); form.reset(); setMessage("Key created.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not create a key."); }
    finally { setPending(false); }
  }

  async function revoke(id: string) {
    setNewKey(null); setPending(true); setError(""); setMessage("");
    try {
      await accessRequest(`/api/mint/keys/${id}`, okSchema, { method: "DELETE" });
      const { keys } = await accessRequest("/api/mint/keys", keyListSchema);
      setState({ kind: "unlocked", keys }); setMessage("Key revoked.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not revoke the key."); }
    finally { setPending(false); }
  }

  async function lock() {
    setNewKey(null); setPending(true); setError(""); setMessage("");
    try { await accessRequest("/api/mint/session", okSchema, { method: "DELETE" }); setState({ kind: "locked" }); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not lock the mint."); }
    finally { setPending(false); }
  }

  async function copy() {
    if (!newKey) return;
    try { await navigator.clipboard.writeText(newKey); setMessage("Key copied."); }
    catch { setError("Select and copy the key above."); }
  }

  return <>
    <div className={styles.heading}><div><h1>Mint</h1></div>
      {state.kind === "unlocked" && <LiquidButton type="button" className={styles.sourceLink} onClick={lock} disabled={pending}>Lock mint</LiquidButton>}
    </div>
    {state.kind === "checking" && <p className={styles.emptyResults} role="status">Checking mint access...</p>}
    {state.kind === "locked" && <section className={`${styles.panel} ${styles.mintLogin}`}>
      <h2>Enter passphrase</h2>
      <form className={styles.accessForm} onSubmit={login}>
        <label htmlFor="mint-passphrase">Passphrase</label>
        <LiquidInput id="mint-passphrase" name="passphrase" type="password" autoComplete="current-password" required maxLength={256} disabled={pending} />
        <LiquidButton type="submit" disabled={pending}>{pending ? "Checking..." : "Unlock mint"}</LiquidButton>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>}
    {state.kind === "unlocked" && <div className={styles.mintPanels}>
      <section className={styles.panel}>
        <h2>Create a key</h2>
        <form className={styles.accessForm} onSubmit={create}>
          <label htmlFor="mint-key-name">Key name</label>
          <LiquidInput id="mint-key-name" name="label" placeholder="e.g. Studio" required maxLength={80} disabled={pending} />
          <LiquidButton type="submit" disabled={pending}>{pending ? "Working..." : "Create key"}</LiquidButton>
        </form>
        {newKey && <div className={styles.newKey}>
          <p>Copy this key now. You will not see it again.</p><LiquidCode><code>{newKey}</code></LiquidCode>
          <div className={styles.accessActions}><LiquidButton type="button" onClick={copy}>Copy key</LiquidButton><LiquidButton type="button" className={styles.secondaryButton} onClick={() => setNewKey(null)}>Done</LiquidButton></div>
        </div>}
        {error && <p role="alert">{error}</p>}
        <p role="status">{message}</p>
      </section>
      <section className={styles.panel}><h2>Keys</h2>
        {state.keys.length === 0 && <p>No keys yet.</p>}
        {state.keys.map(key => <div className={styles.keyRow} key={key.id}>
          <div><h3>{key.label}</h3><code>maynkudu_••••••••{key.suffix}</code>
            <p>{key.revokedAt === null ? "Active" : "Revoked"} · <time dateTime={new Date(key.createdAt).toISOString()}>{new Date(key.createdAt).toISOString().slice(0, 10)}</time></p>
          </div>
          <LiquidButton type="button" className={styles.secondaryButton} disabled={pending || key.revokedAt !== null} onClick={() => revoke(key.id)} aria-label={`Revoke ${key.label}`}>
            {key.revokedAt === null ? "Revoke" : "Revoked"}
          </LiquidButton>
        </div>)}
      </section>
    </div>}
  </>;
}
