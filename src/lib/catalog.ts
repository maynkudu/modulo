import type { RegistryItem } from "shadcn/schema";

export const interactiveArt = {
  name: "interactive-art",
  type: "registry:component",
  title: "Interactive art",
  description:
    "A growing lotus garden with flexible stems, a day and night cycle, and PNG layer exports.",
  dependencies: [],
  registryDependencies: [],
  files: [
    {
      path: "src/registry/interactive-art/examples/GardenCanvas.tsx",
      target: "components/interactive-art/examples/GardenCanvas.tsx",
      type: "registry:component",
    },
    {
      path: "src/registry/interactive-art/scenes/garden.ts",
      target: "components/interactive-art/scenes/garden.ts",
      type: "registry:lib",
    },
    {
      path: "src/registry/interactive-art/engine/runtime.ts",
      target: "components/interactive-art/engine/runtime.ts",
      type: "registry:lib",
    },
    {
      path: "src/registry/interactive-art/engine/elastic.ts",
      target: "components/interactive-art/engine/elastic.ts",
      type: "registry:lib",
    },
    {
      path: "src/registry/interactive-art/engine/math.ts",
      target: "components/interactive-art/engine/math.ts",
      type: "registry:lib",
    },
    {
      path: "src/registry/interactive-art/engine/scene.css",
      target: "components/interactive-art/engine/scene.css",
      type: "registry:file",
    },
  ],
} satisfies RegistryItem;

export const rootInfection = {
  name: "root-infection",
  type: "registry:component",
  title: "Root Infection",
  description: "Stay still. Roots grow from your cursor and spread across the page.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/root-infection/RootInfection.tsx", target: "components/root-infection/RootInfection.tsx", type: "registry:component" },
    { path: "src/registry/root-infection/types.ts", target: "components/root-infection/types.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/engine/runtime.ts", target: "components/root-infection/engine/runtime.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/engine/world.ts", target: "components/root-infection/engine/world.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/engine/particles.ts", target: "components/root-infection/engine/particles.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/engine/spatial-hash.ts", target: "components/root-infection/engine/spatial-hash.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/engine/collision-field.ts", target: "components/root-infection/engine/collision-field.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/rendering/renderer.ts", target: "components/root-infection/rendering/renderer.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/rendering/root-geometry.ts", target: "components/root-infection/rendering/root-geometry.ts", type: "registry:lib" },
    { path: "src/registry/root-infection/audio/sound-engine.ts", target: "components/root-infection/audio/sound-engine.ts", type: "registry:lib" },
  ],
} satisfies RegistryItem;

export const nilkamal = {
  name: "nilkamal",
  type: "registry:component",
  title: "Nilkamal",
  description: "A blue lotus on a living pond. Rain, storms, snow, and ice change the scene.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/nilkamal/Nilkamal.tsx", target: "components/nilkamal/Nilkamal.tsx", type: "registry:component" },
    { path: "src/registry/nilkamal/create-nilkamal.ts", target: "components/nilkamal/create-nilkamal.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/scene.ts", target: "components/nilkamal/scene.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/lotus.ts", target: "components/nilkamal/lotus.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/weather.ts", target: "components/nilkamal/weather.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/audio.ts", target: "components/nilkamal/audio.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/engine/runtime.ts", target: "components/nilkamal/engine/runtime.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/engine/elastic.ts", target: "components/nilkamal/engine/elastic.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/engine/math.ts", target: "components/nilkamal/engine/math.ts", type: "registry:lib" },
    { path: "src/registry/nilkamal/scene.css", target: "components/nilkamal/scene.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const diwali26 = {
  name: "diwali-26",
  type: "registry:component",
  title: "Diwali/26",
  description: "Lotus rangoli beneath a night sky. Launch floral bursts, DIWALI and 2026 with a click.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/diwali-26/Diwali26.tsx", target: "components/diwali-26/Diwali26.tsx", type: "registry:component" },
    { path: "src/registry/diwali-26/create-diwali-26.ts", target: "components/diwali-26/create-diwali-26.ts", type: "registry:lib" },
    { path: "src/registry/diwali-26/artwork.ts", target: "components/diwali-26/artwork.ts", type: "registry:lib" },
    { path: "src/registry/diwali-26/fireworks.ts", target: "components/diwali-26/fireworks.ts", type: "registry:lib" },
    { path: "src/registry/diwali-26/audio.ts", target: "components/diwali-26/audio.ts", type: "registry:lib" },
    { path: "src/registry/diwali-26/types.ts", target: "components/diwali-26/types.ts", type: "registry:lib" },
    { path: "src/registry/diwali-26/scene.css", target: "components/diwali-26/scene.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

function componentMedia({ name, alt, height = 630 }: { name: string; alt: string; height?: number }) {
  return {
    thumbnail: { src: `/media/${name}.jpg`, alt, width: 1200, height, type: "image/jpeg" },
    animation: { src: `/media/${name}.gif`, width: 1200, height, type: "image/gif" },
    video: { src: `/media/${name}.mp4`, width: 1200, height, type: "video/mp4", duration: 4 },
  };
}

export type ComponentMedia = ReturnType<typeof componentMedia>;

type CatalogItem = {
  component: RegistryItem;
  addedAt: string;
  keywords: string[];
  seoDescription: string;
  media: ComponentMedia;
};

export const catalogItems = [{
  component: interactiveArt,
  addedAt: "2026-11-06",
  keywords: ["lotus", "garden", "canvas", "growth", "day", "night", "elastic"],
  seoDescription: "An interactive lotus garden for React with elastic stems, a day and night cycle, keyboard controls, and PNG exports. Preview and install the TypeScript source.",
  media: componentMedia({ name: interactiveArt.name, alt: "White and purple lotus flowers growing above a pond in daylight.", height: 816 }),
}, {
  component: rootInfection,
  addedAt: "2026-11-07",
  keywords: ["roots", "horror", "infection", "worms", "physics", "verlet", "canvas", "webgl", "cursor", "audio"],
  seoDescription: "Cursor-driven root growth for React with Verlet physics, WebGL rendering, retraction, and procedural audio. Try the demo and install the TypeScript source.",
  media: componentMedia({ name: rootInfection.name, alt: "Maroon roots branching from the cursor across a dark page." }),
}, {
  component: nilkamal,
  addedAt: "2026-11-07",
  keywords: ["blue", "lotus", "kamal", "pond", "weather", "rain", "storm", "snow", "hail", "ice", "water", "interactive", "art", "audio"],
  seoDescription: "An interactive blue lotus for React with rain, storms, snow, and ice. Try the Canvas demo, adjust the weather, and install the TypeScript source.",
  media: componentMedia({ name: nilkamal.name, alt: "A blue lotus and its reflection on a moonlit pond in the rain.", height: 816 }),
}, {
  component: diwali26,
  addedAt: "2026-11-08",
  keywords: ["diwali", "2026", "rangoli", "fireworks", "skyshot", "flowers", "paisley", "mandala", "canvas", "audio", "haptics"],
  seoDescription: "An interactive Diwali scene for React with floral rangoli, pointer wind, skyshots, festival sounds and PNG layer exports. Try the preview and install the TypeScript source.",
  media: componentMedia({ name: diwali26.name, alt: "Flowers, leafy paisleys, marigold garlands and diyas beneath skyshots in a dark Diwali sky.", height: 1072 }),
}] satisfies CatalogItem[];

export const gardenUsage = `import { GardenCanvas } from "@/components/interactive-art/examples/GardenCanvas";

export default function Example() {
  return <GardenCanvas initialTime={16} timeScale={3} />;
}`;

export const gardenProps = [
  ["initialTime", "number", "16", "Scene age in seconds."],
  ["timeScale", "number", "1", "Growth and lighting speed. Physics keeps its own clock."],
  ["seed", "number", "1486", "Repeatable scene composition."],
  ["cycleSeconds", "number", "120", "Length of a complete day and night cycle."],
  ["wind", "number", "1", "Strength of the wind."],
  ["plants", "readonly PlantDefinition[]", "DEFAULT_PLANTS", "Positions, growth, and flower colors."],
  ["paused", "boolean", "false", "Initial pause state."],
  ["fallback", "string", "Optional", "Your own still image URL, displayed behind the canvas."],
  ["className", "string", '""', "Class names for the scene container."],
  ["onReady", "(garden | null) => void", "Optional", "Controller on mount, null on cleanup. Keep callbacks stable."],
  ["onFrame", "(FrameState) => void", "Optional", "Scene status after a rendered frame."],
  ["onError", "(Error) => void", "Optional", "Canvas initialization failure."],
] as const;

export const rootInfectionUsage = `import { RootInfection } from "@/components/root-infection/RootInfection";

export default function Example() {
  return <RootInfection inactivityDelay={2400} volume={0.45} />;
}`;

export const rootInfectionProps = [
  ["inactivityDelay", "number", "2400", "Pointer inactivity in milliseconds before emergence."],
  ["fullInfectionDelay", "number", "24000", "Milliseconds to full infection. Thin-root consolidation starts halfway through, after at least eight seconds."],
  ["maxRoots", "number", "Infinity", "Optional allocation budget across all phases. Mature growth reuses absorbed branch slots."],
  ["maxParticles", "number", "Infinity", "Optional particle budget. Omit for an expanding pool. Finite budgets have a minimum of 16."],
  ["growthSpeed", "number", "1", "Growth multiplier. Clamped to 0.1 through 4."],
  ["branchingProbability", "number", "0.075", "Branch probability per growth interval. Clamped to 0 through 0.5. Generations spread breadth-first."],
  ["physicsIterations", "number", "5", "Distance constraint passes per fixed step. Clamped to 1 through 12."],
  ["particleRadius", "number", "4.2", "Starting radius in CSS pixels. Roots vary, taper, and keep thickening without a size ceiling."],
  ["enableAudio", "boolean", "true", "Mute all procedural audio when false. Changes apply immediately."],
  ["volume", "number", "0.45", "Master volume from 0 through 1. Changes apply immediately."],
  ["enableExplosion", "boolean", "true", "Primary pointer press releases fragments with outward impulses and gravity."],
  ["enableRetraction", "boolean", "true", "Meaningful pointer movement or keyboard interaction retracts the roots."],
  ["quality", '"low" | "medium" | "high" | "auto"', '"auto"', "Auto keeps full detail and can advance consolidation when frame cost grows. Low and medium apply only when explicitly selected."],
  ["className", "string", '""', "Class names for the preview host. The overlay remains fixed to the viewport."],
  ["onReady", "(controller | null) => void", "Optional", "Stable callback for diagnostics, reset, and audio control. Receives null on unmount."],
] as const;

export const nilkamalUsage = `import { Nilkamal } from "@/components/nilkamal/Nilkamal";

export default function Example() {
  return <Nilkamal weather="rain" intensity={0.8} volume={0.45} />;
}`;

export const nilkamalProps = [
  ["weather", '"clear" | "rain" | "storm" | "snow" | "hail"', '"clear"', "Transitions without resetting the accumulated snow or ice."],
  ["intensity", "number", "0.8", "Weather strength from 0.2 to 1. Changes precipitation and ambience."],
  ["seed", "number", "731", "Repeatable particle, sky, and texture setup. Changing the seed starts a fresh scene."],
  ["paused", "boolean", "false", "Stops animation and audio. Weather can still be selected."],
  ["enableAudio", "boolean", "true", "Sound unlocks after interaction. Turning this off suspends audio."],
  ["volume", "number", "0.45", "Master volume from 0 to 1."],
  ["fallback", "string", "Optional", "A still image displayed behind the canvas."],
  ["className", "string", '""', "Class names for the scene container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller on mount and null on cleanup. Keep callbacks stable."],
  ["onFrame", "(FrameState) => void", "Optional", "Animation, visibility, pause, and reduced-motion status."],
  ["onError", "(Error) => void", "Optional", "Canvas initialization failure."],
] as const;

export const diwali26Usage = `import { Diwali26 } from "@/components/diwali-26/Diwali26";

export default function Example() {
  return <Diwali26 pattern="surprise" volume={0.9} />;
}`;

export const diwali26Props = [
  ["pattern", '"surprise" | "chrysanthemum" | "lotus" | "rings" | "willow" | "diwali" | "2026"', '"surprise"', "Pattern for new launches. Surprise cycles through all six."],
  ["seed", "number", "731", "Repeatable stars, powder and burst geometry. Changing it starts a fresh scene."],
  ["paused", "boolean", "false", "Stops animation, wind and sound."],
  ["enableAudio", "boolean", "true", "Sound unlocks after interaction. Mutes sound and haptics when false."],
  ["volume", "number", "0.9", "Master festival volume from 0 to 1."],
  ["fallback", "string", "Optional", "Your still image URL, displayed behind the canvas."],
  ["className", "string", '""', "Class names for the scene container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller on mount, null on cleanup. Keep callbacks stable."],
  ["onFrame", "(FrameState) => void", "Optional", "Scene time, visibility, pause and reduced-motion state."],
  ["onError", "(Error) => void", "Optional", "Canvas initialization failure."],
] as const;
