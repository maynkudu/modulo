"use client";

import Image from "next/image";
import Link from "next/link";
import { getCatalogPath, type CatalogItem } from "@/lib/catalog";
import styles from "./component-library.module.css";

type ComponentLibraryProps = {
  /** Filtered catalog records shown in the source library. */
  items: readonly CatalogItem[];
};

/** Renders the component library with preview and catalog details. */
export function ComponentLibrary({ items }: ComponentLibraryProps) {
  return (
    <div className={styles.library}>
      <div className={styles.grid}>
        {items.map(({ component, media, addedAt }) => (
          <article className={styles.card} key={component.name}>
            <Link className={styles.preview} href={getCatalogPath(component.name)} aria-label={`Open ${component.title} preview`}>
              <Image src={media.thumbnail.src} alt={media.thumbnail.alt} fill sizes="(max-width: 600px) 90vw, (max-width: 800px) 46vw, 36vw" unoptimized />
              <span>Preview</span>
            </Link>
            <div className={styles.cardBody}>
              <div>
                <h2><Link href={getCatalogPath(component.name)}>{component.title}</Link></h2>
                <p>{component.description}</p>
              </div>
              <div className={styles.cardFoot}>
                <span>{component.name}</span>
                <span>{addedAt.slice(0, 4)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
