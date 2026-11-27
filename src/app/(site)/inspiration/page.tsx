import { CatalogIndex } from "@/components/catalog-index";
import { getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("inspiration");

export default function InspirationPage() {
  return <CatalogIndex collection="inspiration" />;
}
