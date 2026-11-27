import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { DesignRuntime } from "@/components/design-switch";
import { designInitialization } from "@/lib/site-design";
import { StructuredData } from "@/components/structured-data";
import { defaultMetadata, siteStructuredData } from "@/lib/seo";
import "./globals.css";
const inter = localFont({ src: "./fonts/InterVariable.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const roxborough = localFont({ src: "./fonts/RoxboroughCF-Regular.woff2", variable: "--font-roxborough", weight: "400", display: "swap", adjustFontFallback: "Times New Roman" });
const instrument = localFont({ src: "./fonts/InstrumentSans.ttf", variable: "--font-instrument", weight: "400", display: "swap" });
const stackNotch = localFont({ src: "./fonts/StackSansNotch-latin.woff2", variable: "--font-stack-notch", weight: "200 700", display: "swap" });
export const metadata = defaultMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="modulo-scroll" data-design="artistic" suppressHydrationWarning className={`${inter.variable} ${GeistSans.variable} ${GeistMono.variable} ${roxborough.variable} ${instrument.variable} ${stackNotch.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: designInitialization }} /></head>
      <body><DesignRuntime /><StructuredData data={siteStructuredData} />{children}</body>
    </html>
  );
}
