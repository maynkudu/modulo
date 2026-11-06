"use client";

import Link from "next/link";
import { useState } from "react";
import { catalogItems } from "@/lib/catalog";
import styles from "@/app/page.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function CatalogIndex() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [order, setOrder] = useState("newest");
  const words = normalize(query).split(" ").filter(Boolean);
  const visible = catalogItems.filter((item) => {
    const text = normalize([item.component.title, item.component.name, item.component.description, ...item.keywords, item.addedAt, dateFormat.format(new Date(item.addedAt))].join(" "));
    return (!date || item.addedAt === date) && words.every((word) => text.includes(word));
  }).toSorted((a, b) => order === "title"
    ? a.component.title.localeCompare(b.component.title)
    : order === "oldest" ? a.addedAt.localeCompare(b.addedAt) : b.addedAt.localeCompare(a.addedAt));

  return (
    <>
      <form className={styles.catalogSearch} role="search" onSubmit={(event) => event.preventDefault()}>
        <label className={styles.searchField}>
          <span>Search</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Title, keyword, or date" aria-label="Search components" />
        </label>
        <label className={styles.dateField}>
          <span>Added on</span>
          <input type="date" value={date} onChange={(event) => setDate(event.currentTarget.value)} />
        </label>
        <label className={styles.sortField}>
          <span>Sort</span>
          <select value={order} onChange={(event) => setOrder(event.currentTarget.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A to Z</option>
          </select>
        </label>
      </form>
      <ul className={styles.catalog}>
        {visible.map(({ component, addedAt }) => (
          <li key={component.name}>
            <Link className={styles.componentName} href={`/components/${component.name}`}>
              <span>{component.title}</span>
              <time dateTime={addedAt}>{dateFormat.format(new Date(addedAt))}</time>
            </Link>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className={styles.emptyResults} role="status">No components found.</p>}
    </>
  );
}
