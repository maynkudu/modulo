export const halftoneNumericDefaults = {
  speed: 1, spacing: 7, dotSize: 0.95, minDot: 0.3, angle: 0,
  frequency: 1.3, flow: 1.2, bandWidth: 1, contrast: 1.1,
  glow: 0.5, softness: 0, grain: 0, seed: 0,
  radius: 70, trailStrength: 0.85, trailLength: 0.9, follow: 0.55, fade: 0,
};

export const halftonePalettes = [
  { value: "copper", label: "Copper", colors: ["#2b0d05", "#9c2f14", "#f08a3c", "#fff1d6"], background: "#0a0403" },
  { value: "original", label: "Original", colors: ["#1b2533", "#5c7a9a", "#c9d6e0", "#f6ecdc"], background: "#050608" },
];

type NumericField = {
  key: keyof typeof halftoneNumericDefaults;
  label: string; min: number; max: number; step: number; description: string;
};

/** Bounded demo inputs. These are UI ranges, not additional restrictions on the shader API. */
export const halftoneControlGroups = [
  { label: "Dots", fields: [
    { key: "spacing", label: "Spacing", min: 4, max: 24, step: 1, description: "Distance between dot centers in CSS pixels." },
    { key: "dotSize", label: "Maximum size", min: 0.1, max: 1, step: 0.01, description: "Brightest dot diameter as a share of spacing." },
    { key: "minDot", label: "Minimum size", min: 0, max: 1, step: 0.01, description: "Darkest dot diameter as a share of maximum size." },
    { key: "angle", label: "Grid angle", min: -90, max: 90, step: 1, description: "Grid rotation in degrees." },
    { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01, description: "Blur along each dot edge." },
    { key: "glow", label: "Glow", min: 0, max: 2, step: 0.01, description: "Light spilled between bright dots." },
  ] },
  { label: "Flow", fields: [
    { key: "frequency", label: "Frequency", min: 0.1, max: 5, step: 0.1, description: "Higher values create smaller and busier ribbons." },
    { key: "flow", label: "Curl", min: 0, max: 4, step: 0.1, description: "Noise deformation applied to the flowing ribbons." },
    { key: "bandWidth", label: "Band width", min: 0.1, max: 3, step: 0.1, description: "Thickness of the bright ribbons. Use positive values." },
    { key: "contrast", label: "Contrast", min: 0, max: 3, step: 0.1, description: "Contrast between dark dots and bright dots." },
    { key: "grain", label: "Grain", min: 0, max: 0.15, step: 0.005, description: "Film grain intensity." },
    { key: "seed", label: "Seed", min: 0, max: 100, step: 1, description: "Offsets the noise composition without restarting playback." },
  ] },
  { label: "Hover", fields: [
    { key: "radius", label: "Radius", min: 10, max: 250, step: 1, description: "Width of the pointer trail in CSS pixels." },
    { key: "trailStrength", label: "Strength", min: 0, max: 2, step: 0.01, description: "How strongly the trail lights nearby dots." },
    { key: "trailLength", label: "Lifetime", min: 0.1, max: 3, step: 0.1, description: "Seconds before each path point fades away." },
    { key: "follow", label: "Follow", min: 0, max: 1, step: 0.01, description: "Zero follows closely; one follows with more delay." },
  ] },
  { label: "Fade", fields: [
    { key: "fade", label: "Amount", min: 0, max: 1, step: 0.01, description: "How strongly dots fade toward the selected direction." },
  ] },
] satisfies { label: string; fields: NumericField[] }[];
