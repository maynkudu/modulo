import { CatalogIndex } from "@/components/catalog-index";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("shaders");

export default function ShadersPage() {
  return <>
    <StructuredData data={getCollectionStructuredData("shaders")} />
    <CatalogIndex collection="shaders" />
  </>;
}
