import { CatalogIndex } from "@/components/catalog-index";
import { LiquidTextReveal } from "@/registry/liquid-text-reveal/LiquidTextReveal";
import { StructuredData } from "@/components/structured-data";
import { WorkCollectionLayout } from "@/components/work-collection-layout";
import styles from "@/components/studio-destinations.module.css";
import { getCollectionStructuredData, getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("components");

export default function Components() {
  return (
    <WorkCollectionLayout page="catalog" title={<LiquidTextReveal as="h1" text="Components" className={styles.title} color="#ff0000" profile="studio" revealMode="scroll" />} description="Search the collection and try each preview. Source and installation require an active Modulo key.">
      <StructuredData data={getCollectionStructuredData("components")} />
      <CatalogIndex />
    </WorkCollectionLayout>
  );
}
