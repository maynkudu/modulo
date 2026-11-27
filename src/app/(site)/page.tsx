import { CatalogIndex } from "@/components/catalog-index";
import { StructuredData } from "@/components/structured-data";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("home");

export default function Home() {
  return <>
    <StructuredData data={getCollectionStructuredData("home")} />
    <CatalogIndex collection="everything" />
  </>;
}
