"use client";

import { useRef, useState } from "react";
import { catalogItems } from "@/lib/catalog";
import { LiquidButton, LiquidInput, LiquidSelect } from "@/registry/liquid-animations/LiquidControls";
import { ComponentLibrary } from "./component-library";
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
          <LiquidInput ref={search} type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search titles, keywords, or dates" aria-label="Search components" />
        </label>
        <LiquidSelect label="Sort components" className={styles.sortField} value={order} onValueChange={setOrder} align="end"
          options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }, { value: "title", label: "Name A to Z" }]} />
      </form>
      <ComponentLibrary items={visible} />
      {visible.length === 0 && <div className={styles.emptyResults}><p>No components found.</p><LiquidButton onClick={() => { setQuery(""); search.current?.focus(); }}>Clear search</LiquidButton></div>}
      <p className={styles.status} role="status">{visible.length} {visible.length === 1 ? "component" : "components"}</p>
    </>
  );
}
