import { ComponentLibrary } from "@/components/component-library";
import { StructuredData } from "@/components/structured-data";
import { WorkCollectionLayout } from "@/components/work-collection-layout";
import { shaderCatalogItems } from "@/lib/catalog";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("shaders");

export default function ShadersPage() {
  return <WorkCollectionLayout page="shaders" title="Shaders" description="WebGL shaders. Try the live previews and install the React source with an active Modulo key.">
    <StructuredData data={getCollectionStructuredData("shaders")} />
    <ComponentLibrary items={shaderCatalogItems} />
  </WorkCollectionLayout>;
}
