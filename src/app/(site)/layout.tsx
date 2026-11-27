import type { ReactNode } from "react";
import { InterfaceSounds } from "@/components/interface-sounds";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteEntrance } from "@/components/site-entrance";
import { SitePageTransition } from "@/components/site-page-transition";
import { SiteContextMenu } from "@/components/site-context-menu";
import styles from "./site-layout.module.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <><SiteEntrance /><SiteContextMenu><div className={styles.site} id="site-shell">
    <a className={styles.skipLink} href="#content">Skip to content</a>
    <InterfaceSounds />
    <SiteHeader />
    <div className={styles.content}><SitePageTransition>{children}</SitePageTransition></div>
    <SiteFooter />
  </div></SiteContextMenu></>;
}
