import Link from "next/link";
import type { ReactNode } from "react";
import type { RegistryItem } from "shadcn/schema";
import { allCatalogItems, getCatalogPath } from "@/lib/catalog";
import { getComponentDetails, getComponentStructuredData } from "@/lib/seo";
import { StructuredData } from "./structured-data";
import { PreviewWorkbench, type PreviewLayout } from "./preview-workbench";
import styles from "./component-detail.module.css";

export function ComponentDetail({ item, layout, fullHref, idea, interaction, attribution, children }: {
  item: RegistryItem;
  layout: PreviewLayout;
  fullHref?: string;
  idea: ReactNode;
  interaction: ReactNode;
  attribution?: ReactNode;
  children: ReactNode;
}) {
  const entry = getComponentDetails(item);
  const index = allCatalogItems.findIndex(value => value.component.name === item.name);
  const following = allCatalogItems[(index + 1) % allCatalogItems.length];
  return <main className={styles.page} id="content">
    <StructuredData data={getComponentStructuredData(item)} />
    <Link className={styles.back} href="/">← The index</Link>
    <PreviewWorkbench slug={item.name} title={item.title ?? item.name} description={item.description} image={entry.media.thumbnail.src} layout={layout} fullHref={fullHref}>
      {children}
    </PreviewWorkbench>
    <div className={styles.notes}>
      <section><h2>The idea</h2>{idea}</section>
      <section><h2>Interaction</h2>{interaction}</section>
    </div>
    {attribution && <div className={styles.attribution}>{attribution}</div>}
    <nav className={styles.bottom} aria-label="More from the collection">
      <Link className={styles.back} href="/">Back to the collection</Link>
      {following && <Link className={styles.next} href={getCatalogPath(following.component.name)}>Explore {following.component.title}</Link>}
    </nav>
  </main>;
}
