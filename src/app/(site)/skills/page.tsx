import type { Metadata } from "next";
import { CatalogIndex } from "@/components/catalog-index";

export const metadata: Metadata = { title: "Skills", alternates: { canonical: "/skills" } };

export default function SkillsPage() {
  return <CatalogIndex collection="skills" />;
}
