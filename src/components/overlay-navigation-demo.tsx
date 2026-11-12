"use client";

import { useState } from "react";
import { OverlayNavigation } from "@/registry/overlay-navigation/OverlayNavigation";

const labels: Record<string, string> = { "/": "Home", "/work": "Works", "/playground": "Playground", "/about": "About", "/contact": "Contact" };
export function OverlayNavigationDemo({ full = false }: { full?: boolean }) {
  const [href, setHref] = useState("/");
  const [layout, setLayout] = useState<"fine" | "bold">("fine");
  if (!full) return <iframe src="/view/overlay-navigation" title="Overlay navigation interactive preview" style={{ display: "block", width: "100%", height: 650, border: 0 }} />;
  return <OverlayNavigation currentHref={href} onNavigate={setHref} layout={layout}>
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "112px clamp(24px, 6vw, 90px) 40px" }}>
      <h1 style={{ margin: 0, fontSize: "clamp(52px, 10vw, 150px)", fontWeight: 400, letterSpacing: "-.065em", lineHeight: 1 }}>{labels[href] ?? href}</h1>
      <button type="button" onClick={() => setLayout(layout === "fine" ? "bold" : "fine")} style={{ alignSelf: "flex-start", marginTop: 36, padding: "12px 0", background: "transparent", color: "inherit", border: 0, cursor: "pointer", font: "inherit" }}>Switch to {layout === "fine" ? "Bold" : "Fine"}</button>
    </div>
  </OverlayNavigation>;
}
