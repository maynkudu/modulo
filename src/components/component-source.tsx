"use client";

import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { accessRequest, okSchema, sessionStatusSchema, sourceItemSchema } from "@/lib/access-schema";
import styles from "@/app/page.module.css";

type SourceState = { kind: "loading" } | { kind: "locked" } | { kind: "ready"; item: z.infer<typeof sourceItemSchema> };

export function ComponentSource({ name }: { name: string }) {
  const [state, setState] = useState<SourceState>({ kind: "loading" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const session = await accessRequest("/api/source-access", sessionStatusSchema);
        const item = session.authenticated ? await accessRequest(`/r/${name}.json`, sourceItemSchema) : null;
        if (active) setState(item ? { kind: "ready", item } : { kind: "locked" });
      } catch (error) {
        if (active) { setState({ kind: "locked" }); setError(error instanceof Error ? error.message : "Could not load source."); }
      }
    }
    void restore();
    return () => { active = false; };
  }, [name]);

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const key = new FormData(form).get("key");
    form.reset();
    setPending(true); setError("");
    try {
      await accessRequest("/api/source-access", okSchema, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }),
      });
      const item = await accessRequest(`/r/${name}.json`, sourceItemSchema);
      setState({ kind: "ready", item });
    } catch (error) { setError(error instanceof Error ? error.message : "Could not unlock source."); }
    finally { setPending(false); }
  }

  async function lock() {
    setState({ kind: "locked" }); setPending(true); setError("");
    try { await accessRequest("/api/source-access", okSchema, { method: "DELETE" }); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not lock the source session."); }
    finally { setPending(false); }
  }

  return <section className={`${styles.panel} ${styles.source}`} id="source" aria-labelledby="source-heading">
    <div className={styles.accessHeading}><h2 id="source-heading">Source</h2>
      {state.kind === "ready" && <button type="button" className={styles.secondaryButton} onClick={lock} disabled={pending}>Lock source</button>}
    </div>
    {state.kind === "loading" && <p role="status">Checking source access...</p>}
    {state.kind === "locked" && <form className={styles.accessForm} onSubmit={unlock}>
      <label htmlFor={`source-key-${name}`}>Key</label>
      <input id={`source-key-${name}`} name="key" type="password" placeholder="maynkudu_..." autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={128} disabled={pending} />
      <button type="submit" disabled={pending}>{pending ? "Checking..." : "Unlock source"}</button>
    </form>}
    {error && <p role="alert">{error}</p>}
    {state.kind === "ready" && state.item.files.map(file => <details className={styles.details} key={file.path}>
      <summary>{file.target ?? file.path}</summary><pre><code>{file.content}</code></pre>
    </details>)}
  </section>;
}
