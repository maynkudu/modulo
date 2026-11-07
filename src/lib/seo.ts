import type { Metadata } from "next";
import type { RegistryItem } from "shadcn/schema";
import { catalogItems, type ComponentMedia } from "./catalog";
import { absoluteUrl, siteUrl } from "./site";

export const sitePages = {
  home: {
    path: "/",
    title: "Modulo | Interactive React components",
    description: "Interactive React components with live previews, TypeScript source, and shadcn installation. Built by maynkudu.",
  },
  components: {
    path: "/components",
    title: "Components",
    description: "Browse Modulo's React components. Search by name, keyword, or date, try the live demos, and install the TypeScript source with shadcn.",
  },
  registry: {
    path: "/registry",
    title: "Registry",
    description: "Install Modulo React components with the shadcn CLI. Use a direct registry URL or configure the @modulo namespace to copy the TypeScript source into your project.",
  },
};

const logoImage = { src: "/brand/modulo-og.jpg", alt: "Modulo", width: 1200, height: 630, type: "image/jpeg" };
const author = { "@type": "Person", "@id": absoluteUrl("/#author"), name: "maynkudu" };

function createMetadata({
  title, description, path, image = logoImage, video,
}: {
  title: string;
  description: string;
  path: string;
  image?: ComponentMedia["thumbnail"];
  video?: ComponentMedia["video"];
}): Metadata {
  const brandedTitle = path === "/" ? title : `${title} | Modulo`;
  const imageUrl = absoluteUrl(image.src);
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      siteName: "Modulo",
      locale: "en_US",
      title: brandedTitle,
      description,
      url: absoluteUrl(path),
      images: [{ url: imageUrl, secureUrl: imageUrl, alt: image.alt, width: image.width, height: image.height, type: image.type }],
      ...(video && { videos: [{ url: absoluteUrl(video.src), secureUrl: absoluteUrl(video.src), width: video.width, height: video.height, type: video.type }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [{ url: imageUrl, alt: image.alt }],
    },
  };
}

export function getSiteMetadata(page: keyof typeof sitePages) {
  return createMetadata(sitePages[page]);
}

export const defaultMetadata: Metadata = {
  ...getSiteMetadata("home"),
  metadataBase: new URL(siteUrl),
  title: { default: sitePages.home.title, template: "%s | Modulo" },
  applicationName: "Modulo",
  authors: [{ name: "maynkudu" }],
  creator: "maynkudu",
  publisher: "Modulo",
  robots: {
    index: process.env.VERCEL_ENV !== "preview",
    follow: true,
    googleBot: {
      index: process.env.VERCEL_ENV !== "preview",
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export function getComponentDetails(component: RegistryItem) {
  const entry = catalogItems.find((item) => item.component.name === component.name);
  if (!entry) throw new Error(`Missing catalog entry for ${component.name}.`);
  return entry;
}

export function getComponentMetadata(component: RegistryItem) {
  const { seoDescription, media } = getComponentDetails(component);
  return createMetadata({
    title: component.title ?? component.name,
    description: seoDescription,
    path: `/components/${component.name}`,
    image: media.thumbnail,
    video: media.video,
  });
}

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [author, {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: "Modulo",
    url: absoluteUrl("/"),
    description: sitePages.home.description,
    inLanguage: "en",
    image: absoluteUrl(logoImage.src),
    author: { "@id": author["@id"] },
  }],
};

function componentSource(entry: (typeof catalogItems)[number]) {
  const { component, addedAt, media, seoDescription } = entry;
  const url = absoluteUrl(`/components/${component.name}`);
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${url}#component`,
    name: component.title,
    description: seoDescription,
    url,
    image: absoluteUrl(media.thumbnail.src),
    datePublished: addedAt,
    programmingLanguage: { "@type": "ComputerLanguage", name: "TypeScript" },
    runtimePlatform: "React",
    isAccessibleForFree: true,
    author: { "@id": author["@id"] },
  };
}

export function getCollectionStructuredData(page: "home" | "components") {
  const { title, description, path } = sitePages[page];
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(`${path}#page`),
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: catalogItems.length,
      itemListElement: catalogItems.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: componentSource(entry),
      })),
    },
  };
}

export function getComponentStructuredData(component: RegistryItem) {
  const source = componentSource(getComponentDetails(component));
  return {
    "@context": "https://schema.org",
    "@graph": [source, {
      "@type": "WebPage",
      "@id": `${source.url}#page`,
      name: component.title,
      description: source.description,
      url: source.url,
      isPartOf: { "@id": absoluteUrl("/#website") },
      mainEntity: { "@id": source["@id"] },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Components", item: absoluteUrl("/components") },
          { "@type": "ListItem", position: 3, name: component.title, item: source.url },
        ],
      },
    }],
  };
}
