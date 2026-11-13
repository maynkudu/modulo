import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { InterfaceSounds } from "@/components/interface-sounds";
import { LiquidDocumentScrollbar } from "@/components/liquid-documentation";
import { SiteFooter } from "@/components/site-footer";
import { CatalogChrome } from "@/components/catalog-chrome";
import { StructuredData } from "@/components/structured-data";
import { defaultMetadata, siteStructuredData } from "@/lib/seo";
import "./globals.css";
const inter = localFont({ src: "./fonts/InterVariable.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
export const metadata = defaultMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="modulo-scroll" className={`dark ${inter.variable} ${GeistMono.variable}`}>
      <body><StructuredData data={siteStructuredData} /><CatalogChrome><InterfaceSounds /><LiquidDocumentScrollbar /></CatalogChrome>{children}<CatalogChrome><SiteFooter /></CatalogChrome></body>
    </html>
  );
}
