"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function CatalogChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" || pathname.startsWith("/view/") || pathname.startsWith("/play/") ? null : children;
}
