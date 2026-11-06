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

export const catalogItems = [{
  component: interactiveArt,
  addedAt: "2026-11-06",
  keywords: ["lotus", "garden", "canvas", "growth", "day", "night", "elastic"],
}];

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
