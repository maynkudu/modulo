import type { Metadata } from "next";
import { CatalogIndex } from "@/components/catalog-index";

export const metadata: Metadata = { title: "Rules", alternates: { canonical: "/rules" } };

export default function RulesPage() {
  return <CatalogIndex collection="rules" />;
}
