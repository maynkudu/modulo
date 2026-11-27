"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SitePageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname} className="modulo-page">{children}</div>;
}
