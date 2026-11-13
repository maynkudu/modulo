import type { RegistryItem } from "shadcn/schema";

export const interactiveArt = {
  name: "interactive-art" as const,
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
  name: "root-infection" as const,
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
  name: "nilkamal" as const,
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
  name: "diwali-26" as const,
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

export const texturedGlass = {
  name: "textured-glass" as const,
  type: "registry:component",
  title: "Textured glass",
  description: "Textured glass with image depth, mouse parallax, and adjustable focus.",
  dependencies: ["three@^0.186.0", "@types/three@^0.186.0", "@huggingface/transformers@3.8.1"],
  registryDependencies: [],
  files: [
    { path: "src/registry/textured-glass/TexturedGlass.tsx", target: "components/textured-glass/TexturedGlass.tsx", type: "registry:component" },
    { path: "src/registry/textured-glass/create-textured-glass.ts", target: "components/textured-glass/create-textured-glass.ts", type: "registry:lib" },
    { path: "src/registry/textured-glass/shaders.ts", target: "components/textured-glass/shaders.ts", type: "registry:lib" },
    { path: "src/registry/textured-glass/scene.css", target: "components/textured-glass/scene.css", type: "registry:file" },
    { path: "src/registry/textured-glass/depth-estimation.ts", target: "components/textured-glass/depth-estimation.ts", type: "registry:lib" },
    { path: "src/registry/textured-glass/depth-worker.ts", target: "components/textured-glass/depth-worker.ts", type: "registry:lib" },
  ],
} satisfies RegistryItem;

export const game2048 = {
  name: "2048" as const,
  type: "registry:component",
  title: "2048",
  description: "2048 with grayscale tiles, animated score meters, and merge sounds.",
  dependencies: ["runeicons-react@^0.1.0"],
  registryDependencies: [],
  files: [
    { path: "src/registry/2048/Game2048.tsx", target: "components/2048/Game2048.tsx", type: "registry:component" },
    { path: "src/registry/2048/create-game.ts", target: "components/2048/create-game.ts", type: "registry:lib" },
    { path: "src/registry/2048/motion.ts", target: "components/2048/motion.ts", type: "registry:lib" },
    { path: "src/registry/2048/game.ts", target: "components/2048/game.ts", type: "registry:lib" },
    { path: "src/registry/2048/audio.ts", target: "components/2048/audio.ts", type: "registry:lib" },
    { path: "src/registry/2048/game.css", target: "components/2048/game.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const elasticSlider = {
  name: "elastic-slider" as const,
  type: "registry:component",
  title: "Elastic slider",
  description: "A bounded slider with elastic endpoint stretch, rigid content, and interruptible settling.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/elastic-slider/ElasticSlider.tsx", target: "components/elastic-slider/ElasticSlider.tsx", type: "registry:component" },
    { path: "src/registry/elastic-slider/create-elastic-slider.ts", target: "components/elastic-slider/create-elastic-slider.ts", type: "registry:lib" },
    { path: "src/registry/elastic-slider/slider-math.ts", target: "components/elastic-slider/slider-math.ts", type: "registry:lib" },
    { path: "src/registry/elastic-slider/elastic-slider.css", target: "components/elastic-slider/elastic-slider.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const snapRail = {
  name: "snap-rail" as const,
  type: "registry:component",
  title: "Snap rail",
  description: "A draggable rail with velocity-projected detents and continuous spring retargeting.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/snap-rail/SnapRail.tsx", target: "components/snap-rail/SnapRail.tsx", type: "registry:component" },
    { path: "src/registry/snap-rail/create-snap-rail.ts", target: "components/snap-rail/create-snap-rail.ts", type: "registry:lib" },
    { path: "src/registry/snap-rail/motion.ts", target: "components/snap-rail/motion.ts", type: "registry:lib" },
    { path: "src/registry/snap-rail/snap-rail.css", target: "components/snap-rail/snap-rail.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const liquidCluster = {
  name: "liquid-cluster" as const,
  type: "registry:component",
  title: "Apple Liquid Cluster",
  description: "A notification that splits into a card and Clear button through a liquid seam.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/liquid-cluster/LiquidCluster.tsx", target: "components/liquid-cluster/LiquidCluster.tsx", type: "registry:component" },
    { path: "src/registry/liquid-cluster/create-liquid-cluster.ts", target: "components/liquid-cluster/create-liquid-cluster.ts", type: "registry:lib" },
    { path: "src/registry/liquid-cluster/liquid-cluster.css", target: "components/liquid-cluster/liquid-cluster.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const liquidAnimations = {
  name: "liquid-animations" as const,
  type: "registry:component",
  title: "Liquid Animations",
  description: "Menus, tooltips and controls with liquid growth, rigid content and interruptible motion.",
  dependencies: ["@base-ui/react@^1.9.0", "runeicons-react@^0.1.0"],
  registryDependencies: ["@modulo/elastic-slider"],
  files: [
    { path: "src/registry/liquid-animations/LiquidProvider.tsx", target: "components/liquid-animations/LiquidProvider.tsx", type: "registry:component" },
    { path: "src/registry/liquid-animations/LiquidSurface.tsx", target: "components/liquid-animations/LiquidSurface.tsx", type: "registry:component" },
    { path: "src/registry/liquid-animations/LiquidControls.tsx", target: "components/liquid-animations/LiquidControls.tsx", type: "registry:component" },
    { path: "src/registry/liquid-animations/LiquidTrack.tsx", target: "components/liquid-animations/LiquidTrack.tsx", type: "registry:component" },
    { path: "src/registry/liquid-animations/LiquidSlider.tsx", target: "components/liquid-animations/LiquidSlider.tsx", type: "registry:component" },
    { path: "src/registry/liquid-animations/LiquidScrollbar.tsx", target: "components/liquid-animations/LiquidScrollbar.tsx", type: "registry:component" },
    { path: "src/registry/liquid-animations/liquid-motion.ts", target: "components/liquid-animations/liquid-motion.ts", type: "registry:lib" },
    { path: "src/registry/liquid-animations/liquid-geometry.ts", target: "components/liquid-animations/liquid-geometry.ts", type: "registry:lib" },
    { path: "src/registry/liquid-animations/liquid-animations.css", target: "components/liquid-animations/liquid-animations.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const logoRefraction = {
  name: "logo-refraction" as const,
  type: "registry:component",
  title: "Logo refraction",
  description: "Metallic light across the black field, with an iridescent sweep and outline glint on the n.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/logo-refraction/LogoRefraction.tsx", target: "components/logo-refraction/LogoRefraction.tsx", type: "registry:component" },
    { path: "src/registry/logo-refraction/create-logo-refraction.ts", target: "components/logo-refraction/create-logo-refraction.ts", type: "registry:lib" },
    { path: "src/registry/logo-refraction/shaders.ts", target: "components/logo-refraction/shaders.ts", type: "registry:lib" },
    { path: "src/registry/logo-refraction/logo-refraction.css", target: "components/logo-refraction/logo-refraction.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const overlayNavigation = {
  name: "overlay-navigation" as const,
  type: "registry:component",
  title: "Overlay navigation",
  description: "A fixed navbar and full-screen menu with rolling labels, image previews, and coordinated transitions.",
  dependencies: ["gsap@^3.15.1"],
  registryDependencies: [],
  files: [
    { path: "src/registry/overlay-navigation/OverlayNavigation.tsx", target: "components/overlay-navigation/OverlayNavigation.tsx", type: "registry:component" },
    { path: "src/registry/overlay-navigation/NavigationPanel.tsx", target: "components/overlay-navigation/NavigationPanel.tsx", type: "registry:component" },
    { path: "src/registry/overlay-navigation/navigation-context.tsx", target: "components/overlay-navigation/navigation-context.tsx", type: "registry:lib" },
    { path: "src/registry/overlay-navigation/IndiaTime.tsx", target: "components/overlay-navigation/IndiaTime.tsx", type: "registry:component" },
    { path: "src/registry/overlay-navigation/useReducedMotion.ts", target: "components/overlay-navigation/useReducedMotion.ts", type: "registry:lib" },
    { path: "src/registry/overlay-navigation/useNavigationFeedback.ts", target: "components/overlay-navigation/useNavigationFeedback.ts", type: "registry:lib" },
    { path: "src/registry/overlay-navigation/motion.ts", target: "components/overlay-navigation/motion.ts", type: "registry:lib" },
    { path: "src/registry/overlay-navigation/assets.ts", target: "components/overlay-navigation/assets.ts", type: "registry:lib" },
    { path: "src/registry/overlay-navigation/navigation.css", target: "components/overlay-navigation/navigation.css", type: "registry:file" },
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
}, {
  component: texturedGlass,
  addedAt: "2026-11-08",
  keywords: ["threejs", "three", "webgl", "shader", "glass", "frosted", "textured", "refraction", "image", "upload", "light", "grid", "depth", "parallax", "focus"],
  seoDescription: "A Three.js textured glass effect for React with local image depth estimation, mouse parallax, and adjustable focus blur. Upload a photo and install the component with a mint key.",
  media: componentMedia({ name: texturedGlass.name, alt: "A photograph seen through rough glass with a fine square grid and a broad light reflection.", height: 800 }),
}, {
  component: game2048,
  addedAt: "2026-11-09",
  keywords: ["2048", "game", "puzzle", "tiles", "merge", "score", "keyboard", "swipe", "audio"],
  seoDescription: "Play a minimal 2048 game with grayscale tiles, animated merges, score meters, undo, local saves, and procedural sounds. Install the React component with shadcn.",
  media: componentMedia({ name: game2048.name, alt: "Grayscale 2048 tiles beneath score and best meters on an almost-white background.", height: 800 }),
}, {
  component: elasticSlider,
  addedAt: "2026-11-09",
  keywords: ["slider", "brightness", "elastic", "spring", "gesture", "keyboard", "controls"],
  seoDescription: "A React slider with bounded stepped values, horizontal and vertical input, elastic endpoint stretch, keyboard controls, and reduced motion. Preview and install the independent TypeScript component.",
  media: componentMedia({ name: elasticSlider.name, alt: "A vertical brightness slider stretching beyond its endpoint on a pale background.", height: 800 }),
}, {
  component: snapRail,
  addedAt: "2026-11-09",
  keywords: ["snap", "rail", "detents", "spring", "velocity", "drag", "gesture", "controls"],
  seoDescription: "A React snap rail with projected release targets, labeled detents, re-grab continuity, keyboard selection, and reduced motion. Preview and install the independent TypeScript component.",
  media: componentMedia({ name: snapRail.name, alt: "A rounded draggable marker settling between labeled rail positions.", height: 800 }),
}, {
  component: liquidCluster,
  addedAt: "2026-11-09",
  keywords: ["liquid", "notification", "clear", "buttons", "cluster", "merge", "separate", "geometry", "canvas", "controls"],
  seoDescription: "A React notification that separates into a card and Clear action with a liquid seam, keyboard targets, reduced motion, and an opaque fallback. Preview and install the independent TypeScript component.",
  media: componentMedia({ name: liquidCluster.name, alt: "A notification rectangle separating into a message card and Clear button.", height: 800 }),
}, {
  component: logoRefraction,
  addedAt: "2026-11-10",
  keywords: ["logo", "maynkudu", "refraction", "metallic", "iridescent", "sheen", "light", "webgl", "shader", "pointer"],
  seoDescription: "Logo refraction for React with metallic reflections on a dark field, a separate iridescent logo sweep, fixed image framing, and keyboard controls. Preview and install with a mint key.",
  media: componentMedia({ name: logoRefraction.name, alt: "The complete square maynkudu logo, with metallic light on its black field and an iridescent n in the lower right.", height: 1200 }),
}, {
  component: overlayNavigation,
  addedAt: "2026-11-12",
  keywords: ["navbar", "header", "menu", "overlay", "navigation", "gsap", "preview"],
  seoDescription: "A combined React navbar and overlay menu with animated image previews, route selection, keyboard focus containment, and reduced motion. Preview and install with a mint key.",
  media: componentMedia({ name: overlayNavigation.name, alt: "The portfolio navbar above a light navigation panel and abstract image previews.", height: 800 }),
}, {
  component: liquidAnimations,
  addedAt: "2026-11-13",
  keywords: ["liquid", "menu", "tooltip", "select", "tabs", "slider", "scrollbar", "spring", "svg", "controls"],
  seoDescription: "Liquid controls for React with menus, selects, tooltips, tabs, sliders and real scrollbars. Try interrupted spring motion and install with an active Modulo key.",
  media: componentMedia({ name: liquidAnimations.name, alt: "A liquid Account menu growing from a round avatar on a dark background.", height: 800 }),
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

export const texturedGlassUsage = `import { TexturedGlass } from "@/components/textured-glass/TexturedGlass";

export default function Example() {
  return (
    <TexturedGlass
      src="/photo.jpg"
      alt="Portrait through textured glass"
      roughness={0.68}
      distortion={0.012}
    />
  );
}`;

export const texturedGlassProps = [
  ["src", "string", "Required", "Image URL, including a browser object URL. Remote images need CORS access. Images larger than 4096 pixels are resized for the GPU."],
  ["alt", "string", "Required", "Accessible description of the image."],
  ["depthMap", "string", "Optional", "Precomputed depth image URL. White is near, black is far. Skips automatic analysis."],
  ["estimateDepth", "boolean", "true", "Estimate image depth locally with Depth Anything V2 Small in a worker. The first analysis downloads the model."],
  ["roughness", "number", "0.68", "Glass normal strength from 0 to 2."],
  ["distortion", "number", "0.012", "Refraction distance from 0 to 0.08, relative to image height."],
  ["blur", "number", "5", "Image blur radius from 0 to 30 CSS pixels."],
  ["textureScale", "number", "2.4", "Glass texture repetitions from 0.25 to 8."],
  ["grid", "number", "0.65", "Wire grid opacity from 0 to 1."],
  ["gridSize", "number", "90", "Square grid cells across image height, from 10 to 200."],
  ["lightIntensity", "number", "0.75", "Reflected light intensity from 0 to 2."],
  ["lightSize", "number", "0.5", "Highlight radius from 0.1 to 1.5, relative to image height."],
  ["speed", "number", "0.45", "Automatic light speed from 0 to 3."],
  ["depth", "number", "0.55", "Distance between the image and glass plane, from 0 to 2 world units."],
  ["parallax", "number", "0.7", "Pointer camera movement from 0 to 1.5 world units."],
  ["depthStrength", "number", "0.8", "Depth-map displacement from 0 to 2 world units. Zero flattens the image mesh."],
  ["focusDepth", "number", "1", "Focus distance from 0 for far objects to 1 for near objects."],
  ["focusBlur", "number", "12", "Blur away from the focus depth, from 0 to 30 CSS pixels."],
  ["showDepth", "boolean", "false", "Display the estimated depth map."],
  ["animate", "boolean", "true", "Move the light automatically. The pointer takes control while over the image."],
  ["enabled", "boolean", "true", "Turn off the glass to display the original image."],
  ["paused", "boolean", "false", "Freeze light movement. Settings still apply."],
  ["className", "string", '""', "Class names for the container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller after image loading, null on unmount."],
  ["onFrame", "(GlassFrame) => void", "Optional", "Time, light position, visibility, pause, and reduced-motion status."],
  ["onError", "(Error) => void", "Optional", "Image loading or WebGL initialization failure."],
  ["onDepth", "(DepthState) => void", "Optional", "Local depth loading progress, analysis, completion, or failure."],
] as const;

export const game2048Usage = `import { Game2048 } from "@/components/2048/Game2048";

export default function Example() {
  return <Game2048 volume={0.75} />;
}`;

export const game2048Props = [
  ["seed", "number", "Optional", "Repeatable tile spawns for a new game."],
  ["initialBoard", "readonly number[]", "Optional", "Sixteen zeros or powers of two. Saved state takes precedence."],
  ["initialScore", "number", "0", "Starting score when initialBoard is supplied."],
  ["storageKey", "string | null", '\"2048-game-v1\"', "Local save and sound preference key. Null disables storage."],
  ["enableAudio", "boolean", "true", "Allow game sounds after a gesture. False stops all voices."],
  ["volume", "number", "0.75", "Master volume from 0 to 1."],
  ["className", "string", '\"\"', "Class names for the game container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller on mount, null on cleanup. Keep callbacks stable."],
  ["onChange", "(GameSnapshot) => void", "Optional", "Board, score, best, progress, undo, and sound state. Keep callbacks stable."],
] satisfies readonly (readonly [string, string, string, string])[];

export const elasticSliderUsage = `import { ElasticSlider } from "@/components/elastic-slider/ElasticSlider";

export default function Example() {
  return <ElasticSlider label="Brightness" defaultValue={65} orientation="vertical" />;
}`;

export const elasticSliderProps = [
  ["label", "string", "Required", "Visible and accessible name for the value."],
  ["value / defaultValue", "number", "min", "Use value with onValueChange for controlled state, or defaultValue for local state."],
  ["min / max", "number", "0 / 100", "Finite ordered semantic bounds."],
  ["step", 'number | "any"', "1", "Value increment counted from min, or continuous pointer values with any."],
  ["orientation", '"horizontal" | "vertical"', '"horizontal"', "Input direction and shell layout."],
  ["disabled", "boolean", "false", "Blocks pointer and keyboard changes."],
  ["reducedMotion", "boolean", "false", "Requests a still alternate path. The system preference also applies."],
  ["onValueChange", "(value: number) => void", "Optional", "Bounded normalized value requests. Required with controlled value."],
  ["onValueCommit", "(value: number) => void", "Optional", "Successful user adjustment. Cancellation does not commit."],
  ["formatValue", "(value: number) => string", "Optional", "Formats the displayed and accessible value."],
  ["children", "ReactNode", "Optional", "Rigid decorative content outside shell deformation."],
  ["onReady", "(controller | null) => void", "Optional", "Controller on mount and null on cleanup. Keep callback stable."],
] as const;

export const snapRailUsage = `import { SnapRail } from "@/components/snap-rail/SnapRail";

const detents = [
  { id: "left", label: "Left", position: 0 },
  { id: "center", label: "Center", position: 140 },
  { id: "right", label: "Right", position: 280 },
];

export default function Example() {
  return <SnapRail ariaLabel="Placement" detents={detents} defaultSelectedId="center" />;
}`;

export const snapRailProps = [
  ["detents", "readonly SnapDetent[]", "Required", "Stable IDs, labels, and increasing finite relative positions mapped across the track."],
  ["ariaLabel", "string", '"Snap position"', "Accessible name of the placement control."],
  ["selectedId / defaultSelectedId", "string", "First detent", "Controlled selection or initial local selection."],
  ["onSelectionChange", "(id: string) => void", "Optional", "Selection requests. Required with controlled selectedId."],
  ["onSelectionCommit", "(id: string) => void", "Optional", "Successful user destination request."],
  ["onSelectionCancel", "() => void", "Optional", "Canceled pointer interaction without a commit."],
  ["decaySeconds", "number", "0.12", "Projection time constant in seconds."],
  ["hysteresis", "number", "8", "Preview midpoint margin in pixels."],
  ["omega / dampingRatio", "number", "20 / 0.85", "Illustrative spring tuning, not Apple constants."],
  ["disabled / reducedMotion", "boolean", "false", "Input availability and still alternate path."],
  ["onReady", "(controller | null) => void", "Optional", "Controller on mount and null on cleanup. Keep callback stable."],
] as const;

export const liquidClusterUsage = `import { LiquidCluster } from "@/components/liquid-cluster/LiquidCluster";

const items = [
  { id: "notification", label: "Open notification", content: <span>Design review is ready.</span> },
  { id: "clear", label: "Clear" },
];

export default function Example() {
  return <LiquidCluster ariaLabel="Notification actions" layout="notification" items={items} defaultSeparation={0} onSelect={id => console.log(id)} />;
}`;

export const liquidClusterProps = [
  ["items", "readonly LiquidClusterItem[]", "Required", "Unique IDs, accessible labels, optional ReactNode content, and per-item disabled state. Notification layout requires two items."],
  ["layout", '"buttons" | "notification"', '"buttons"', "Notification starts as one rectangle and separates into a wide card and smaller action."],
  ["ariaLabel", "string", "Required", "Accessible name of the related button group."],
  ["separation / defaultSeparation", "number", "0.65", "Normalized gap from 0 to 1. Controlled separation requires onSeparationChange."],
  ["onSeparationChange", "(value: number) => void", "Optional", "Requested normalized separation."],
  ["selectedId / defaultSelectedId", "string | null", "null", "Controlled or initial local active button. Controlled selection requires onSelect."],
  ["onSelect", "(id: string) => void", "Optional", "Independent button activation."],
  ["disabled", "boolean", "false", "Disables all native button targets."],
  ["opaque", "boolean", "false", "Requests an opaque material adaptation."],
  ["reducedMotion", "boolean", "false", "Disables automatic settling. System preference also applies."],
  ["onReady", "(controller | null) => void", "Optional", "Controller on mount and null on cleanup. Keep callback stable."],
] as const;

export const logoRefractionUsage = `import { LogoRefraction } from "@/components/logo-refraction/LogoRefraction";

export default function Example() {
  return <LogoRefraction src="/logo.png" alt="My complete logo" />;
}`;

export const logoRefractionProps = [
  ["src", "string", "Required", "Opaque square image URL. Use a light mark on a dark field. Remote images require CORS access."],
  ["alt", "string", "Required", "Accessible description of the complete logo."],
  ["strength", "number", "1", "Metallic refraction on the dark field, from 0 to 1."],
  ["dispersion", "number", "0.55", "Colour separation in the dark field's refracted light, from 0 to 1."],
  ["markSheen", "number", "0.7", "Independent iridescent sweep and outline glint on the light mark, from 0 to 1."],
  ["speed", "number", "0.4", "Shader time multiplier, from 0 to 3. Zero stops time while pointer control remains available."],
  ["paused", "boolean", "false", "Freeze time and pointer response. Settings still apply."],
  ["showOriginal", "boolean", "false", "Display the complete source image and suspend animation."],
  ["className", "string", '""', "Class names for the square image container."],
  ["onReady", "(controller | null) => void", "Optional", "Controller after image loading, null on cleanup or graphics failure. Keep callbacks stable."],
  ["onFrame", "(LogoRefractionFrame) => void", "Optional", "Time, frame count, pointer, visibility, pause, and reduced-motion status. Keep callback stable."],
  ["onError", "(Error) => void", "Optional", "Image loading or WebGL failure. The original image remains available."],
] as const;

export const overlayNavigationUsage = `import { OverlayNavigation } from "@/components/overlay-navigation/OverlayNavigation";

export default function Example() {
  return <OverlayNavigation><main>Your page content</main></OverlayNavigation>;
}`;

export const overlayNavigationProps = [
  ["items", "readonly NavigationItem[]", "Portfolio routes", "Nonempty route list with unique keys, labels, image URLs, and preview words."],
  ["currentHref", "string", "Local selection", "Current route. Update after your navigation callback runs."],
  ["onNavigate", "(href: string) => void", "Local selection", "Connect to your router. Modified clicks keep native link behavior."],
  ["brand / trailing", "ReactNode", "Portfolio mark / India clock", "Content at the two ends of the navbar."],
  ["brandHref / brandLabel", "string", '"/" / "maynkudu, home"', "Brand destination and accessible link name."],
  ["contact / social", "readonly NavigationLink[]", "Portfolio links", "Footer links with href, label, and optional external flag."],
  ["layout", '"fine" | "bold"', '"fine"', "Existing light or dark page treatment."],
  ["defaultOpen", "boolean", "false", "Initial menu state."],
  ["reducedMotion", "boolean", "false", "Show immediate states. The system preference also applies."],
  ["children / className", "ReactNode / string", "Optional", "Page content and wrapper class. Mount one navigation instance per page."],
] as const;

export const liquidAnimationsUsage = `"use client";

import { LiquidProvider } from "@/components/liquid-animations/LiquidProvider";
import { LiquidMenu } from "@/components/liquid-animations/LiquidControls";

export default function Example() {
  return <LiquidProvider>
    <LiquidMenu label="Actions" entries={[
      { kind: "action", label: "Save", onClick: () => console.log("Save") },
      { kind: "action", label: "Share", onClick: () => console.log("Share") },
    ]} />
  </LiquidProvider>;
}`;

export const liquidAnimationsProps = [
  ["LiquidProvider", "speed", "1", "Motion rate for liquid controls."],
  ["LiquidMenu", "label / entries", "Required", "Action or toggle entries with callbacks. Optional heading, edge alignment, width and controlled open state."],
  ["LiquidSelect", "value / options / onValueChange", "Required", "Controlled string selection. Use palette for color swatches and triggerValue for custom trigger content."],
  ["LiquidPopover", "label / trigger / children", "Required", "A dialog anchored to its trigger. Supports controlled open state and returns keyboard focus on dismissal."],
  ["LiquidTooltip", "label / children", "Required", "Wrap a button. Group adjacent tooltips in LiquidTooltipProvider."],
  ["LiquidTabs", "value / options / onValueChange", "Required", "A moving selection background with Arrow keys, Home and End. panelId links tabs to their panel."],
  ["LiquidSlider", "label / value or defaultValue", "Required / min", "Controlled or local state with min, max, step, formatValue and value callbacks. Uses Elastic Slider."],
  ["LiquidScrollArea", "orientation", '"vertical"', "Wrap a real overflow container. Horizontal and vertical thumbs support drag, wheel and keyboard input."],
  ["LiquidScrollbar", "viewport / controls", "Document", "Attach to a ref for a container or omit viewport for document scrolling. controls names the scroll container."],
  ["LiquidButton / LiquidInput", "Native props", "Native defaults", "Keep native form, disabled and keyboard behavior."],
  ["LiquidSwitch", "checked / onCheckedChange", "Optional", "Base UI switch semantics with a deforming thumb."],
  ["LiquidDisclosure", "label / children", "Required", "Native details behavior with a liquid trigger and readable content."],
] satisfies readonly (readonly [string, string, string, string])[];
