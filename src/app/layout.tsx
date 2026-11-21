import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { GeistSerif } from "geist/font/serif";
import localFont from "next/font/local";
import { StructuredData } from "@/components/structured-data";
import { defaultMetadata, siteStructuredData } from "@/lib/seo";
import "./globals.css";
const inter = localFont({ src: "./fonts/InterVariable.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
export const metadata = defaultMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="modulo-scroll" className={`${inter.variable} ${GeistSans.variable} ${GeistSerif.variable} ${GeistMono.variable}`}>
      <body><StructuredData data={siteStructuredData} />{children}</body>
    </html>
  );
}
