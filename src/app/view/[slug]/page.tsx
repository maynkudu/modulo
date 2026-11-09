import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FullView } from "@/components/full-view";
import { catalogItems } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return catalogItems.map(({ component }) => ({ slug: component.name }));
}

function getComponent(slug: string) {
  const entry = catalogItems.find(({ component }) => component.name === slug);
  if (!entry) notFound();
  return entry.component;
}

export async function generateMetadata({ params }: PageProps<"/view/[slug]">) {
  const component = getComponent((await params).slug);
  const metadata = getComponentMetadata(component);
  const url = absoluteUrl(`/view/${component.name}`);
  return { ...metadata, alternates: { canonical: url }, openGraph: { ...metadata.openGraph, url } };
}

async function ResolvedFullView({ params }: PageProps<"/view/[slug]">) {
  return <FullView name={getComponent((await params).slug).name} />;
}

export default function FullViewPage(props: PageProps<"/view/[slug]">) {
  return <Suspense fallback={null}><ResolvedFullView {...props} /></Suspense>;
}
