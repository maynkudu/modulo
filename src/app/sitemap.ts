import type { MetadataRoute } from "next";
import { catalogItems } from "@/lib/catalog";
import { sitePages } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...Object.values(sitePages).map(({ path }) => ({
      url: absoluteUrl(path),
      images: [absoluteUrl("/brand/modulo-og.jpg")],
    })),
    ...catalogItems.map(({ component, media }) => ({
      url: absoluteUrl(`/components/${component.name}`),
      images: [absoluteUrl(media.thumbnail.src)],
    })),
  ];
}
