import type { Metadata } from "next";
import { CatalogIndex } from "@/components/catalog-index";

export const metadata: Metadata = { title: "Inspiration", alternates: { canonical: "/inspiration" } };

export default function InspirationPage() {
  return <CatalogIndex collection="inspiration" />;
}
