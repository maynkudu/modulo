import localFont from "next/font/local";
import type { ReactNode } from "react";
import { InterfaceSounds } from "@/components/interface-sounds";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { catalogItems } from "@/lib/catalog";
import { studioServices } from "@/lib/studio-content";
import styles from "./site-layout.module.css";

const rethink = localFont({ src: "../fonts/RethinkSans-latin.woff2", weight: "400 800", variable: "--font-rethink", display: "swap" });
const stackNotch = localFont({ src: "../fonts/StackSansNotch-latin.woff2", weight: "200 700", variable: "--font-stack-notch", display: "swap" });

/** Shares the site navigation across pages while full-screen previews use their own layout. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.site} ${rethink.variable} ${stackNotch.variable}`}>
      <a className={styles.skipLink} href="#content">Skip to content</a>
      <InterfaceSounds />
      <SiteHeader workCount={catalogItems.length} serviceCount={studioServices.length} />
      <div className={styles.content}>{children}</div>
      <SiteFooter />
    </div>
  );
}
