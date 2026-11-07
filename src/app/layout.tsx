import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel/square";
import { InterfaceSounds } from "@/components/interface-sounds";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StructuredData } from "@/components/structured-data";
import { defaultMetadata, siteStructuredData } from "@/lib/seo";
import "lenis/dist/lenis.css";
import "./globals.css";
export const metadata = defaultMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${GeistMono.variable} ${GeistPixelSquare.variable}`}>
      <body><StructuredData data={siteStructuredData} /><InterfaceSounds /><SmoothScroll />{children}</body>
    </html>
  );
}
