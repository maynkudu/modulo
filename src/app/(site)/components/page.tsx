import { CatalogIndex } from "@/components/catalog-index";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("components");

export default function Components() {
  return <>
    <StructuredData data={getCollectionStructuredData("components")} />
    <CatalogIndex collection="components" />
  </>;
}
