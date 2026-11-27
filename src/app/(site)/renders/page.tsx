import { CatalogIndex } from "@/components/catalog-index";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("renders");

export default function RendersPage() {
  return <>
    <StructuredData data={getCollectionStructuredData("renders")} />
    <CatalogIndex collection="renders" />
  </>;
}
