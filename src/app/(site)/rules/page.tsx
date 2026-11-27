import { CatalogIndex } from "@/components/catalog-index";
import { getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("rules");

export default function RulesPage() {
  return <CatalogIndex collection="rules" />;
}
