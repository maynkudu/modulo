import type { Metadata } from "next";
import type { RegistryItem } from "shadcn/schema";
import { allCatalogItems, catalogItems, pageCatalogItems, shaderCatalogItems, renderCatalogItems, getCatalogPath, type CatalogItem, type ComponentMedia } from "./catalog";
import { absoluteUrl, siteUrl } from "./site";

export const sitePages = {
  access: { path: "/access", title: "Get Access", description: "We aint sharing these" },
  skills: { path: "/skills", title: "Skills", description: "Agent skills in the Modulo collection." },
  inspiration: { path: "/inspiration", title: "Inspiration", description: "Design references in the Modulo collection." },
  rules: { path: "/rules", title: "Rules", description: "Reusable rules in the Modulo collection." },
  home: {
    path: "/",
    title: "Modulo | The collection",
    description: "Interactive components, shaders, pages and resources by maynkudu. Try the live previews and explore the controls.",
  },
  work: {
    path: "/work",
    title: "Work",
    description: "Explore the Modulo collection of interactive components, shaders and complete pages.",
  },
  services: {
    path: "/services",
    title: "Services",
    description: "Explore interactive components, shaders and pages in the Modulo collection.",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description: "Explore the Modulo collection of interactive work by maynkudu.",
  },
  components: {
    path: "/components",
    title: "Components",
    description: "Explore interactive components from Modulo. Search the collection and try the real demos and controls.",
  },
  pages: {
    path: "/pages",
    title: "Pages",
    description: "Complete interactive pages from Modulo. Play the public previews and explore their controls.",
  },
  renders: {
    path: "/renders", title: "Renders",
    description: "Explore original 3D models and inspect their materials and geometry from every angle.",
  },
  shaders: {
    path: "/shaders",
    title: "Shaders",
    description: "Shaders and image effects from Modulo. Try the live previews, upload your own images and explore the controls.",
  },
  studio: {
    path: "/studio",
    title: "Studio",
    description: "Interactive components, shaders and pages made by maynkudu.",
  },
  registry: {
    path: "/registry",
    title: "Registry",
    description: "Access to original Modulo components and agent instructions.",
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
  const entry = allCatalogItems.find((item) => item.component.name === component.name);
  if (!entry) throw new Error(`Missing catalog entry for ${component.name}.`);
  return entry;
}

export function getComponentMetadata(component: RegistryItem) {
  const { seoDescription, media } = getComponentDetails(component);
  return createMetadata({
    title: component.title ?? component.name,
    description: seoDescription,
    path: getCatalogPath(component.name),
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

function componentSource(entry: CatalogItem) {
  const { component, addedAt, media, seoDescription } = entry;
  const url = absoluteUrl(getCatalogPath(component.name));
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
    isAccessibleForFree: false,
    author: { "@id": author["@id"] },
  };
}

export function getCollectionStructuredData(page: "home" | "components" | "pages" | "shaders" | "renders") {
  const { title, description, path } = sitePages[page];
  const entries = page === "home" ? allCatalogItems : page === "pages" ? pageCatalogItems : page === "shaders" ? shaderCatalogItems : page === "renders" ? renderCatalogItems : catalogItems;
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
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: componentSource(entry),
      })),
    },
  };
}

export function getComponentStructuredData(component: RegistryItem) {
  const source = componentSource(getComponentDetails(component));
  const categoryPath = getCatalogPath(component.name).split("/")[1];
  const categoryTitle = categoryPath === "pages" ? "Pages" : categoryPath === "shaders" ? "Shaders" : "Components";
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
          { "@type": "ListItem", position: 2, name: categoryTitle, item: absoluteUrl(`/${categoryPath}`) },
          { "@type": "ListItem", position: 3, name: component.title, item: source.url },
        ],
      },
    }],
  };
}
