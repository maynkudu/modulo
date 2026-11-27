import { CatalogIndex } from "@/components/catalog-index";
import { CollectionStatement } from "@/components/collection-statement";
import { StructuredData } from "@/components/structured-data";
import { allCatalogItems, getCatalogPath } from "@/lib/catalog";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("home");

export default function Home() {
  const featured = allCatalogItems.find(({ component }) => component.name === "thermal-image") ?? allCatalogItems[0];

  return <>
    <StructuredData data={getCollectionStructuredData("home")} />
    {featured && <CollectionStatement featured={{
      title: featured.component.title ?? featured.component.name,
      href: getCatalogPath(featured.component.name),
      thumbnail: featured.media.thumbnail,
    }} />}
    <CatalogIndex collection="everything" />
  </>;
}
