"use client";

import { SwitchbackPage } from "@/registry/sprite-racer/SwitchbackPage";

/** The public game runs locally in the browser. Source uses the existing mint gate. */
export function SpriteRacerDemo() {
  return <SwitchbackPage debug={process.env.NODE_ENV === "development"} />;
}
