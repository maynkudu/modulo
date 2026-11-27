import { CatalogIndex } from "@/components/catalog-index";
import { CollectionStatement } from "@/components/collection-statement";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("home");

export default function Home() {
  return <>
    <StructuredData data={getCollectionStructuredData("home")} />
    <CollectionStatement />
    <CatalogIndex collection="everything" />
  </>;
}
