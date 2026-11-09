import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { InterfaceSounds } from "@/components/interface-sounds";
import { SiteFooter } from "@/components/site-footer";
import { CatalogChrome } from "@/components/catalog-chrome";
import { StructuredData } from "@/components/structured-data";
import { defaultMetadata, siteStructuredData } from "@/lib/seo";
import "./globals.css";
export const metadata = defaultMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body><StructuredData data={siteStructuredData} /><CatalogChrome><InterfaceSounds /></CatalogChrome>{children}<CatalogChrome><SiteFooter /></CatalogChrome></body>
    </html>
  );
}
