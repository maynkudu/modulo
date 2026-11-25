import type { RegistryItem } from "shadcn/schema";
import { spriteRacer } from "./page-catalog";
export { spriteRacer } from "./page-catalog";

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

/** Installable scroll-driven typography with an SVG liquid filter. */
export const liquidTextReveal = {
  name: "liquid-text-reveal" as const,
  type: "registry:component",
  title: "Liquid Text Reveal",
  description: "Colored liquid shapes resolve into sharp text as you scroll. Scroll back to reverse the reveal.",
  dependencies: [],
  registryDependencies: [],
  files: [{ path: "src/registry/liquid-text-reveal/LiquidTextReveal.tsx", target: "components/liquid-text-reveal/LiquidTextReveal.tsx", type: "registry:component" }],
} satisfies RegistryItem;

/** Installable multi-step download feedback with caller-owned operation state. */
export const multiStepDownload = {
  name: "multi-step-download" as const,
  type: "registry:component",
  title: "Multi-step download",
  description: "A circular download button with an expanding progress ring, a moving arrow and a green success check.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/multi-step-download/MultiStepDownload.tsx", target: "components/multi-step-download/MultiStepDownload.tsx", type: "registry:component" },
    { path: "src/registry/multi-step-download/multi-step-download.css", target: "components/multi-step-download/multi-step-download.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

/** Caller-controlled operation states with a stationary animated light matrix. */
export const stateButtons = {
  name: "state-buttons" as const,
  type: "registry:component",
  title: "State buttons",
  description: "A customizable button for loading, thinking, pending, success and error states.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/state-buttons/StateButton.tsx", target: "components/state-buttons/StateButton.tsx", type: "registry:component" },
    { path: "src/registry/state-buttons/state-matrix.ts", target: "components/state-buttons/state-matrix.ts", type: "registry:lib" },
    { path: "src/registry/state-buttons/state-button.css", target: "components/state-buttons/state-button.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

/** Pill download button that carries its own progress readout. */
export const inlineDownload = {
  name: "inline-download" as const,
  type: "registry:component",
  title: "Inline download",
  description: "A download button that fills with progress, counts up, then offers Open.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/inline-download/InlineDownload.tsx", target: "components/inline-download/InlineDownload.tsx", type: "registry:component" },
    { path: "src/registry/inline-download/create-progress-track.ts", target: "components/inline-download/create-progress-track.ts", type: "registry:lib" },
    { path: "src/registry/inline-download/inline-download.css", target: "components/inline-download/inline-download.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

/** Cursor-tracked spherical eye with modeled proximity eyelids. */
export const eyeSpice = {
  name: "eyespice" as const,
  type: "registry:component",
  title: "EyeSpice",
  description: "A textured 3D eye that follows your cursor and closes when you get too close.",
  dependencies: ["three@^0.186.0", "@types/three@^0.186.0"],
  registryDependencies: [],
  files: [
    { path: "src/registry/eyespice/EyeSpice.tsx", target: "components/eyespice/EyeSpice.tsx", type: "registry:component" },
    { path: "src/registry/eyespice/create-eyespice.ts", target: "components/eyespice/create-eyespice.ts", type: "registry:lib" },
    { path: "src/registry/eyespice/eye-material.ts", target: "components/eyespice/eye-material.ts", type: "registry:lib" },
    { path: "src/registry/eyespice/eye-lids.ts", target: "components/eyespice/eye-lids.ts", type: "registry:lib" },
    { path: "src/registry/eyespice/eye-motion.ts", target: "components/eyespice/eye-motion.ts", type: "registry:lib" },
    { path: "src/registry/eyespice/eye-surface-data.ts", target: "components/eyespice/eye-surface-data.ts", type: "registry:lib" },
    { path: "src/registry/eyespice/eyespice.css", target: "components/eyespice/eyespice.css", type: "registry:file" },
  ],
} satisfies RegistryItem;

function componentMedia({ name, alt, height = 630, duration = 4 }: { name: string; alt: string; height?: number; duration?: number }) {
  return {
    thumbnail: { src: `/media/${name}.jpg`, alt, width: 1200, height, type: "image/jpeg" },
    animation: { src: `/media/${name}.gif`, width: 1200, height, type: "image/gif" },
    video: { src: `/media/${name}.mp4`, width: 1200, height, type: "video/mp4", duration },
  };
}

export type ComponentMedia = ReturnType<typeof componentMedia>;

export type CatalogItem = {
  component: RegistryItem;
  addedAt: string;
  keywords: string[];
  seoDescription: string;
  media: ComponentMedia;
};

export const catalogItems = [{
  component: stateButtons,
  addedAt: "2026-11-25",
  keywords: ["button", "state", "status", "loading", "thinking", "pending", "success", "error", "animation", "canvas", "matrix"],
  seoDescription: "A controlled React button with loading, thinking, pending, success and error states. Choose six stationary light-matrix animations, accent color, size, speed and reduced motion. Preview it and install with an active Modulo key.",
  media: componentMedia({ name: stateButtons.name, alt: "A dark button labeled Thinking with a red light matrix rippling outward.", height: 800, duration: 5 }),
}, {
  component: inlineDownload,
  addedAt: "2026-11-24",
  keywords: ["download", "button", "progress", "percentage", "pill", "cancel", "check", "open"],
  seoDescription: "A pill download button that fills with progress, counts the percentage up, and turns into Open. Cancel by pressing again. Preview the React component and install the source with an active Modulo key.",
  media: componentMedia({ name: inlineDownload.name, alt: "A light download pill on black, part-filled with progress and counting up.", height: 800, duration: 6 }),
}, {
  component: eyeSpice,
  addedAt: "2026-11-23",
  keywords: ["eye", "eyespice", "3d", "three", "webgl", "cursor", "gaze", "eyelids", "proximity"],
  seoDescription: "A textured monochrome 3D eye for React with global cursor tracking, modeled proximity eyelids, keyboard demo controls and reduced motion. Preview EyeSpice and install with an active Modulo key.",
  media: componentMedia({ name: eyeSpice.name, alt: "A textured monochrome 3D eye with a dark iris and bright silhouette rim.", height: 1200, duration: 6 }),
}, {
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
}, {
  component: liquidTextReveal,
  addedAt: "2026-11-20",
  keywords: ["liquid", "typography", "text", "scroll", "svg", "blur", "heading"],
  seoDescription: "A reversible SVG liquid text reveal for React. Try four color presets in the full-page demo and install its source with a Modulo key.",
  media: componentMedia({ name: liquidTextReveal.name, alt: "Text on warm paper with sharp letters on the left and liquid red letters on the right.", height: 800 }),
}, {
  component: multiStepDownload,
  addedAt: "2026-11-20",
  keywords: ["download", "button", "progress", "ring", "success", "check", "microinteraction", "nitish", "khagwal"],
  seoDescription: "A React download button with a clockwise progress ring, moving down arrow and animated success check. Try the preview and install the controlled component with an active Modulo key.",
  media: componentMedia({ name: multiStepDownload.name, alt: "A raised circular download button with a clockwise black progress ring on a pale background.", height: 800, duration: 5 }),
}] satisfies CatalogItem[];

export const pageCatalogItems = [{
  component: game2048,
  addedAt: "2026-11-09",
  keywords: ["2048", "game", "puzzle", "tiles", "merge", "score", "keyboard", "swipe", "audio"],
  seoDescription: "Play a minimal 2048 game with grayscale tiles, animated merges, score meters, undo, local saves, and procedural sounds. Install the complete React page with an active Modulo key.",
  media: componentMedia({ name: game2048.name, alt: "Grayscale 2048 tiles beneath score and best meters on an almost-white background.", height: 800 }),
}, {
  component: spriteRacer,
  addedAt: "2026-11-21",
  keywords: ["page", "game", "racing", "drift", "delivery", "sprite", "stack", "layered", "canvas", "audio"],
  seoDescription: "Play Switchback, a layered pixel driving game with six original vehicles, five circuits, a drift yard, engine audio and an exploded-world inspector. Install the complete React page with an active Modulo key.",
  media: componentMedia({ name: spriteRacer.name, alt: "A pixel car driving on a raised road through a layered forest world.", height: 800, duration: 6 }),
}] satisfies CatalogItem[];

/** Image-array portrait morphing with a diagonal tile clock. */
export const portraitWave = {
  name: "portrait-wave" as const,
  type: "registry:component",
  title: "Portrait wave",
  description: "Portraits morph through a diagonal wave of tiles. Supply your own image array.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/portrait-wave/PortraitWave.tsx", target: "components/portrait-wave/PortraitWave.tsx", type: "registry:component" },
    { path: "src/registry/portrait-wave/portrait-shader.ts", target: "components/portrait-wave/portrait-shader.ts", type: "registry:lib" },
    { path: "src/registry/portrait-wave/flow-worker.ts", target: "components/portrait-wave/flow-worker.ts", type: "registry:lib" },
    { path: "src/registry/portrait-wave/portrait-wave.css", target: "components/portrait-wave/portrait-wave.css", type: "registry:file" },
    { path: "src/registry/portrait-wave/align_portrait.py", target: "components/portrait-wave/align_portrait.py", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const halftone = {
  name: "halftone" as const,
  type: "registry:component",
  title: "Halftone",
  description: "Flowing light on a dot grid, with an eased liquid trail that follows your pointer.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "src/registry/halftone/Halftone.tsx", target: "components/halftone/Halftone.tsx", type: "registry:component" },
    { path: "src/registry/halftone/ShaderSurface.tsx", target: "components/halftone/ShaderSurface.tsx", type: "registry:component" },
    { path: "src/registry/halftone/halftone.css", target: "components/halftone/halftone.css", type: "registry:file" },
    { path: "src/registry/halftone/LICENSE", target: "components/halftone/LICENSE", type: "registry:file" },
  ],
} satisfies RegistryItem;

export const shaderCatalogItems = [{
  component: {
    name: "brick-noise" as const,
    type: "registry:component",
    title: "Brick noise",
    description: "A staggered grayscale grid with a repeating wave of tile brightness.",
    dependencies: [],
    registryDependencies: [],
    files: [
      { path: "src/registry/brick-noise/BrickNoise.tsx", target: "components/brick-noise/BrickNoise.tsx", type: "registry:component" },
      { path: "src/registry/brick-noise/create-brick-noise.ts", target: "components/brick-noise/create-brick-noise.ts", type: "registry:lib" },
      { path: "src/registry/brick-noise/brick-noise-data.ts", target: "components/brick-noise/brick-noise-data.ts", type: "registry:lib" },
      { path: "src/registry/brick-noise/brick-noise.css", target: "components/brick-noise/brick-noise.css", type: "registry:file" },
    ],
  } satisfies RegistryItem,
  addedAt: "2026-11-22",
  keywords: ["shader", "webgl", "brick", "noise", "grayscale", "grid", "tiles", "loop"],
  seoDescription: "A WebGL brick noise shader for React, reconstructed from a 45-frame reference. Try playback controls and install the source with an active Modulo key.",
  media: componentMedia({ name: "brick-noise", alt: "Staggered grayscale tiles separated by thin black lines.", height: 1200, duration: 4.05 }),
}, {
  component: portraitWave,
  addedAt: "2026-11-23",
  keywords: ["shader", "portrait", "faces", "morph", "wave", "tiles", "images", "webgl", "optical flow"],
  seoDescription: "A React portrait morph shader with an image-array API, local correspondence computation and a diagonal tile wave. Try your images, prepare aligned portraits and install with a Modulo key.",
  media: componentMedia({ name: "portrait-wave", alt: "Two grayscale portraits morphing through diagonally delayed rectangular tiles.", height: 900, duration: 3.88 }),
}, {
  component: halftone,
  addedAt: "2026-11-23",
  keywords: ["shader", "halftone", "webgl", "dots", "noise", "pointer", "hover", "trail", "palette", "background"],
  seoDescription: "A React halftone shader with flowing dot patterns, an eased pointer trail and editable colors. Try the live controls and install with an active Modulo key.",
  media: componentMedia({ name: "halftone", alt: "Copper and cream dots tracing flowing light and a soft pointer trail on a dark background.", height: 1200, duration: 6 }),
}] satisfies CatalogItem[];

export const brickNoise = shaderCatalogItems[0].component;
export const previewCatalogItems = [...catalogItems, ...shaderCatalogItems];
export const allCatalogItems = [...previewCatalogItems, ...pageCatalogItems];

export function getCatalogPath(name: string) {
  const category = pageCatalogItems.some(item => item.component.name === name) ? "/pages"
    : shaderCatalogItems.some(item => item.component.name === name) ? "/shaders" : "/components";
  return `${category}/${name}`;
}

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

/** Usage connects the multi-step download button to the caller's operation state. */
export const multiStepDownloadUsage = `"use client";

import { MultiStepDownload, type MultiStepDownloadState } from "@/components/multi-step-download/MultiStepDownload";

export function DownloadButton({ state, onDownload }: {
  state: MultiStepDownloadState;
  onDownload: () => void;
}) {
  return <MultiStepDownload state={state} onActivate={onDownload} />;
}`;

/** Usage leaves operation state and cancellation with the application. */
export const stateButtonsUsage = `"use client";

import { StateButton, type StateButtonState } from "@/components/state-buttons/StateButton";

export function SaveButton({ state, onSave, onCancel }: {
  state: StateButtonState;
  onSave: () => void;
  onCancel?: () => void;
}) {
  return <StateButton state={state} label="Save changes" onClick={onSave} onCancel={onCancel} />;
}`;

/** Public properties for the controlled State Buttons component. */
export const stateButtonsProps = [
  ["state", '"idle" | "loading" | "thinking" | "pending" | "success" | "error" | "disabled"', '"idle"', "Controlled operation state. Active states set aria-busy and prevent duplicate activation."],
  ["label", "string", "State label", "Visible text and default accessible name. Defaults to Continue, Loading, Thinking, Pending, Complete, Try again or Unavailable by state."],
  ["animation", '"ripple" | "orbit" | "scan" | "wave" | "spark" | "breathe"', "Depends on state", "Select a matrix motion independently from loading, thinking or pending."],
  ["color", "string", '"#ff4a3e"', "CSS color for the matrix and focus indicator. The preview provides five presets and a custom hex color."],
  ["surface", '"dark" | "light"', '"dark"', "Button face and label contrast."],
  ["size", '"sm" | "md" | "lg" | number', '"lg"', "Target height. Numeric values are clamped from 44 to 120 CSS pixels."],
  ["speed", "number", "1", "Motion and label-sheen speed, clamped from 0.25 to 2.5."],
  ["glow", "number", "0.65", "Matrix glow strength from 0 to 1."],
  ["reducedMotion", "boolean", "false", "Use a stable matrix frame. The system reduced-motion preference also applies."],
  ["disabled", "boolean", "false", "Native disabled button state. State \"disabled\" also disables the button."],
  ["onClick", "(event: MouseEvent<HTMLButtonElement>) => void", "Optional", "Called for idle, success and error. Active states ignore activation."],
  ["onCancel", "() => void", "Optional", "Called by a second click or Escape while loading, thinking or pending."],
  ["type / className / style / aria-label", "Native button props", '"button" / Optional', "Other native button attributes are forwarded."],
] satisfies readonly (readonly [string, string, string, string])[];

/** Usage shows both the simulated run and a caller-driven progress value. */
export const inlineDownloadUsage = `import { InlineDownload } from "@/components/inline-download/InlineDownload";

// Simulated: the button runs its own timed download.
<InlineDownload label="Download invoice" onOpen={() => openInvoice()} />

// Controlled: your operation owns the value.
<InlineDownload
  progress={bytesWritten / bytesTotal}
  label="Export report"
  doneLabel="Open report"
  error={failure}
  onDownload={startExport}
  onCancel={cancelExport}
  onOpen={() => openReport()}
/>`;

/** Public properties for the inline download button. */
export const inlineDownloadProps = [
  ["label", "string", '"Download"', "Label at rest. It also names the button when nothing is running."],
  ["doneLabel", "string", '"Open"', "Shown once the download finishes. Pressing it calls onOpen."],
  ["retryLabel", "string", '"Try again"', "Shown while error is set. Pressing it calls onDownload again."],
  ["error", "string | null", "null", "Failure message. A string stops the run, names the failure and holds the button in its failed state until you clear it."],
  ["progress", "number", "Unset", "Real progress from 0 to 1. Leave it out to simulate a download of duration seconds."],
  ["duration", "number", "2.8", "Seconds a simulated download takes."],
  ["resetAfter", "number", "3", "Seconds the finished state shows before returning to the start. Zero keeps it. The timer waits while the button holds focus."],
  ["successColor", "string", '"#43dc84"', "Colour of the check, the label and the finished surface."],
  ["size", '"sm" | "md" | "lg"', '"md"', "Height, padding, label size and glyph size."],
  ["reducedMotion", "boolean", "false", "Show immediate states without travel, blur or digit swaps. The system preference also applies."],
  ["onDownload / onCancel / onOpen", "() => void", "Optional", "Pressed at rest or to retry, pressed while loading to cancel, pressed once finished. Escape cancels too."],
  ["className / style / disabled / ref", "string / CSSProperties / boolean / Ref", "Optional", "Style, disable, or reach the native button. The ref points at the button element."],
] satisfies readonly (readonly [string, string, string, string])[];

/** Public properties for the controlled multi-step download button. */
export const multiStepDownloadProps = [
  ["state", "MultiStepDownloadState", '{ kind: "idle" }', "Idle, loading with progress from 0 to 1, success, or error with a message. Your operation owns these transitions."],
  ["onActivate", "() => void", "Optional", "Starts or retries your operation. Repeated activation while loading is ignored."],
  ["label", "string", '"Download"', "Accessible action label. Progress, completion and errors update the button's accessible name."],
  ["size", "number", "68", "Face diameter in CSS pixels, with a 44 px minimum. The progress ring extends outside the face."],
  ["disabled", "boolean", "false", "Native disabled button state."],
  ["reducedMotion", "boolean", "false", "Show immediate states without travel, blur transitions or particles. The system preference also applies."],
  ["className / style", "string / CSSProperties", "Optional", "Style the native button. Internal SVG shapes scale with its size."],
] satisfies readonly (readonly [string, string, string, string])[];
