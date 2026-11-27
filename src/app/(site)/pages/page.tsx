import { CatalogIndex } from "@/components/catalog-index";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("pages");

export default function Pages() {
  return <>
    <StructuredData data={getCollectionStructuredData("pages")} />
    <CatalogIndex collection="pages" />
  </>;
}
