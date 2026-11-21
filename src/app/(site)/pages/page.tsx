import { ComponentLibrary } from "@/components/component-library";
import { StructuredData } from "@/components/structured-data";
import { WorkCollectionLayout } from "@/components/work-collection-layout";
import { pageCatalogItems } from "@/lib/catalog";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("pages");

export default function Pages() {
  return (
    <WorkCollectionLayout page="pages" title="Pages" description="Complete interactive pages. Try each preview and install the source with an active Modulo key.">
      <StructuredData data={getCollectionStructuredData("pages")} />
      <ComponentLibrary items={pageCatalogItems} />
    </WorkCollectionLayout>
  );
}
