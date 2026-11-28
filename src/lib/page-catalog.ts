import type { RegistryItem } from "shadcn/schema";

const runtimeFiles = [
  "engine/layered-raster.ts", "engine/motor-audio.ts", "engine/motor-synth.ts",
  "engine/sprite-stack.ts", "engine/surface-vehicle.ts", "engine/terrain-grid.ts",
  "engine/vehicle-simulation.ts", "engine/world-collision.ts", "game/delivery-session.ts", "game/driving-world.ts",
  "game/engine-voices.ts", "game/garage-artwork.ts", "game/layered-world.ts",
  "game/race-artwork.ts", "game/race-pilot.ts", "game/race-session.ts",
  "game/race-track.ts", "game/racer-content.ts", "game/session-contract.ts",
  "game/switchback-markup.ts", "game/world-assets.ts", "game/world-layout.ts", "game/world-terrain.ts",
  "mount-switchback.ts",
];

/** Metadata and install paths only. Implementation comes from the private source pin. */
export const spriteRacer = {
  name: "sprite-racer",
  type: "registry:block",
  title: "Switchback",
  description: "A sprite-stacked driving game with six cars, five circuits and a drift yard.",
  dependencies: [],
  registryDependencies: [],
  files: [
    ...runtimeFiles.map(path => ({ path: `src/registry/sprite-racer/${path}`, target: `components/sprite-racer/${path}`, type: "registry:lib" as const })),
    { path: "src/registry/sprite-racer/SwitchbackPage.tsx", target: "components/sprite-racer/SwitchbackPage.tsx", type: "registry:component" },
    { path: "src/registry/sprite-racer/switchback.css", target: "components/sprite-racer/switchback.css", type: "registry:file" },
    { path: "src/registry/sprite-racer/sprite-racer.manifest.json", target: "components/sprite-racer/sprite-racer.manifest.json", type: "registry:file" },
    { path: "src/registry/sprite-racer/verify-game.mjs", target: "components/sprite-racer/verify-game.mjs", type: "registry:file" },
    { path: "src/registry/sprite-racer/page.tsx", target: "app/switchback/page.tsx", type: "registry:page" },
  ],
} satisfies RegistryItem;

export const cubeArchive = {
  name: "cube-archive",
  type: "registry:block",
  title: "Cube Archive",
  description: "A portfolio page where projects turn through a cube selector and open into full-width case views.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/cube-archive/CubeArchivePage.tsx", target: "components/cube-archive/CubeArchivePage.tsx", type: "registry:component" },
    { path: "src/registry/cube-archive/types.ts", target: "components/cube-archive/types.ts", type: "registry:lib" },
    { path: "src/registry/cube-archive/cube-archive.module.css", target: "components/cube-archive/cube-archive.module.css", type: "registry:file" },
    { path: "src/registry/cube-archive/example-projects.ts", target: "components/cube-archive/example-projects.ts", type: "registry:lib" },
    { path: "src/registry/cube-archive/README.md", target: "components/cube-archive/README.md", type: "registry:file" },
    { path: "src/registry/cube-archive/page.tsx", target: "app/cube-archive/page.tsx", type: "registry:page" },
  ],
} satisfies RegistryItem;
