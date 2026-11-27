import { RuneIcon } from "runeicons-react";
import { allCatalogItems, getCatalogPath } from "@/lib/catalog";
import { CatalogIndexClient, type CatalogCollection, type CatalogIndexEntry } from "./catalog-index-client";

export type { CatalogCollection } from "./catalog-index-client";

/** Passes only public presentation metadata to the interactive index. */
export function CatalogIndex({ collection = "everything" }: { collection?: CatalogCollection }) {
  const entries = allCatalogItems.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt)).map((item) => {
    const href = getCatalogPath(item.component.name);
    const category = href.startsWith("/pages/") ? "pages" : href.startsWith("/shaders/") ? "shaders" : "components";
    return {
      name: item.component.name,
      title: item.component.title ?? item.component.name,
      description: item.component.description,
      keywords: item.keywords,
      addedAt: item.addedAt,
      category,
      href,
      thumbnail: { src: item.media.thumbnail.src, width: item.media.thumbnail.width, height: item.media.thumbnail.height },
    } satisfies CatalogIndexEntry;
  });

  return <CatalogIndexClient collection={collection} entries={entries} searchIcon={<RuneIcon name="tools-search" type="normal" size={18} />} />;
}
