"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { catalogItems } from "@/lib/catalog";
import styles from "./catalog-index.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function CatalogIndex() {
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("newest");
  const words = normalize(query).split(" ").filter(Boolean);
  const visible = catalogItems.filter((item) => {
    const text = normalize([item.component.title, item.component.name, item.component.description, ...item.keywords, item.addedAt, dateFormat.format(new Date(item.addedAt))].join(" "));
    return words.every((word) => text.includes(word));
  }).toSorted((a, b) => order === "title"
    ? a.component.title.localeCompare(b.component.title)
    : order === "oldest" ? a.addedAt.localeCompare(b.addedAt) : b.addedAt.localeCompare(a.addedAt));

  return (
    <>
      <form className={styles.catalogSearch} role="search" onSubmit={(event) => event.preventDefault()}>
        <label className={styles.searchField}>
          <span className="sr-only">Search components</span>
          <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search titles, keywords, or dates" aria-label="Search components" />
        </label>
        <label className={styles.sortField}>
          <span className="sr-only">Sort components</span>
          <select value={order} onChange={(event) => setOrder(event.currentTarget.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Name A to Z</option>
          </select>
        </label>
      </form>
      <ul className={styles.catalog}>
        {visible.map(({ component, addedAt }) => (
          <li key={component.name}>
            <Link className={styles.componentName} href={`/components/${component.name}`}>
              <span className={styles.year}>{addedAt.slice(0, 4)}</span>
              <span>{component.title}</span>
              <time dateTime={addedAt}>{dateFormat.format(new Date(addedAt)).replace(/ \d{4}$/, "")}</time>
            </Link>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <div className={styles.emptyResults}><p>No components found.</p><button type="button" onClick={() => { setQuery(""); search.current?.focus(); }}>Clear search</button></div>}
      <p className={styles.status} role="status">{visible.length} {visible.length === 1 ? "component" : "components"}</p>
    </>
  );
}
