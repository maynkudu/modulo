"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SitePageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <ViewTransition key={pathname} enter="modulo-page-enter" exit="modulo-page-exit" default="none">{children}</ViewTransition>;
}
