import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel/square";
import { InterfaceSounds } from "@/components/interface-sounds";
import "./globals.css";
export const metadata: Metadata = {
  title: "Modulo",
  description: "A component library by maynkudu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${GeistMono.variable} ${GeistPixelSquare.variable}`}>
      <body><InterfaceSounds />{children}</body>
    </html>
  );
}
