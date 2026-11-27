"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { ComponentMedia } from "@/lib/catalog";
import { CatalogPreviewMedia } from "./catalog-preview-media";
import styles from "./catalog-index.module.css";

const collections = [
  { name: "everything", label: "Everything", href: "/" },
  { name: "components", label: "Components", href: "/components" },
  { name: "shaders", label: "Shaders", href: "/shaders" },
  { name: "renders", label: "Renders", href: "/renders" },
  { name: "pages", label: "Pages", href: "/pages" },
  { name: "skills", label: "Skills", href: "/skills" },
  { name: "inspiration", label: "Inspiration", href: "/inspiration" },
  { name: "rules", label: "Rules", href: "/rules" },
] as const;

export type CatalogCollection = (typeof collections)[number]["name"];
type PublishedCollection = "components" | "shaders" | "pages" | "renders";
export type CatalogIndexEntry = {
  name: string;
  title: string;
  description: string;
  keywords: readonly string[];
  addedAt: string;
  category: PublishedCollection;
  href: string;
  thumbnail: Pick<ComponentMedia["thumbnail"], "src" | "width" | "height">;
  video: Pick<ComponentMedia["video"], "src" | "width" | "height">;
};

const categoryNames = { components: "Component", shaders: "Shader", pages: "Page", renders: "Render" } satisfies Record<PublishedCollection, string>;
const categoryAliases = {
  components: ["components", "component type", "component listing", "ui", "interface", "interaction"],
  shaders: ["shaders", "shader type", "shader listing", "visual effect", "effects", "webgl"],
  pages: ["pages", "page type", "page listing", "template", "templates", "game"],
  renders: ["renders", "render type", "render listing", "3d model", "models"],
} satisfies Record<PublishedCollection, readonly string[]>;
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function titleParts(title: string) {
  const separator = title.indexOf(" ");
  return separator < 0 ? { first: title, last: "" } : { first: title.slice(0, separator), last: title.slice(separator + 1) };
}

export function CatalogIndexClient({ collection, entries, searchIcon }: {
  collection: CatalogCollection;
  entries: readonly CatalogIndexEntry[];
  searchIcon: ReactNode;
}) {
  const search = useRef<HTMLInputElement>(null);
  const rowLinks = useRef(new Map<string, HTMLAnchorElement>());
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState("");
  const words = normalize(query).split(" ").filter(Boolean);

  useEffect(() => {
    if (window.location.hash !== "#collection-search") return;
    const frame = requestAnimationFrame(() => search.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = entries.filter((entry) => {
    if (collection !== "everything" && entry.category !== collection) return false;
    const text = normalize([entry.title, entry.name, entry.description, categoryNames[entry.category],
      ...categoryAliases[entry.category], ...entry.keywords, entry.addedAt, dateFormat.format(new Date(entry.addedAt))].join(" "));
    return words.every((word) => text.includes(word));
  });
  const selectedName = visible.some((entry) => entry.name === selection) ? selection : undefined;
  const currentCollection = collections.find((item) => item.name === collection);

  function moveSelection(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowDown": nextIndex = (index + 1) % visible.length; break;
      case "ArrowUp": nextIndex = (index - 1 + visible.length) % visible.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = visible.length - 1; break;
      default: return;
    }
    const next = visible[nextIndex];
    if (!next) return;
    event.preventDefault();
    setSelection(next.name);
    rowLinks.current.get(next.name)?.focus({ preventScroll: true });
    rowLinks.current.get(next.name)?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }

  return <main className={`${styles.index} catalog-index`} id="content" tabIndex={-1}>
    <h1 className="sr-only">{collection === "everything" ? "The index" : currentCollection?.label}</h1>
    <div className={styles.tools}>
      <nav className={styles.categories} aria-label="Resource type">
        {collections.map((item) => <Link key={item.name} href={item.href} className={styles.category}
          aria-current={item.name === collection ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
        <span className={styles.searchIcon} aria-hidden="true">{searchIcon}</span>
        <label className="sr-only" htmlFor="collection-search">Search collection</label>
        <input ref={search} id="collection-search" type="search" autoComplete="off" aria-keyshortcuts="/"
          placeholder="Search name, type or topic"
          value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
        <button className={styles.searchShortcut} type="button" aria-label="Focus collection search, slash key"
          onClick={() => search.current?.focus()}><kbd>/</kbd></button>
      </form>
    </div>

    <div className={styles.list}>
      {visible.map((entry, index) => {
        const active = entry.name === selectedName;
        const { first, last } = titleParts(entry.title);
        const titleSize = entry.title.length > 18 ? "long" : entry.title.length > 13 ? "medium" : "short";
        return <article key={entry.name} className={styles.row} data-selected={active || undefined} data-title-size={titleSize}>
          <Link ref={(node) => { if (node) rowLinks.current.set(entry.name, node); else rowLinks.current.delete(entry.name); }}
            className={styles.rowHead} href={entry.href} aria-label={entry.title}
            onPointerEnter={event => { if (event.pointerType !== "touch") setSelection(entry.name); }}
            onPointerLeave={event => {
              if (!event.currentTarget.matches(":focus-visible")) setSelection(current => current === entry.name ? "" : current);
            }}
            onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setSelection(entry.name); }}
            onBlur={event => {
              if (!event.currentTarget.matches(":hover")) setSelection(current => current === entry.name ? "" : current);
            }}
            onKeyDown={(event) => moveSelection(event, index)}>
            <span className={styles.nameStart}>{first}</span>
            <CatalogPreviewMedia thumbnail={entry.thumbnail} video={entry.video} active={active} />
            {last && <span className={styles.nameEnd}>{last}</span>}
          </Link>
          <span className={styles.kind}>{categoryNames[entry.category]}</span>
        </article>;
      })}
    </div>

    {visible.length === 0 && <section className={styles.empty} aria-labelledby="empty-collection-title">
      <h2 id="empty-collection-title">{query.trim() ? "No matching items." : "Nothing here yet."}</h2>
      <p>{query.trim() ? "Try another name, or return to the full collection." : "This collection has not been published yet."}</p>
      {query.trim() ? <button type="button" onClick={() => { setQuery(""); search.current?.focus(); }}>Clear search</button>
        : <Link href="/">Back to the collection</Link>}
    </section>}
    <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? "item" : "items"}{query.trim() ? " found" : " in this collection"}.</p>
  </main>;
}
