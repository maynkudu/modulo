"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function CatalogChrome({ children }: { children: ReactNode }) {
  return usePathname().startsWith("/view/") ? null : children;
}
