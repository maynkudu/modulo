import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { entranceInitialization } from "@/lib/site-entrance";
import { StructuredData } from "@/components/structured-data";
import { defaultMetadata, siteStructuredData } from "@/lib/seo";
import "./globals.css";
const inter = localFont({ src: "./fonts/InterVariable.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const stackNotch = localFont({ src: "./fonts/StackSansNotch-latin.woff2", variable: "--font-stack-notch", weight: "200 700", display: "swap" });
export const metadata = defaultMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="modulo-scroll" suppressHydrationWarning className={`${inter.variable} ${GeistSans.variable} ${GeistMono.variable} ${stackNotch.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: entranceInitialization }} /></head>
      <body><StructuredData data={siteStructuredData} />{children}</body>
    </html>
  );
}
