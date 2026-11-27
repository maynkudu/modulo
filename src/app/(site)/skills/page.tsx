import { CatalogIndex } from "@/components/catalog-index";
import { getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata("skills");

export default function SkillsPage() {
  return <CatalogIndex collection="skills" />;
}
