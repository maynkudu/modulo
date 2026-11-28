import type { CubeArchiveProject } from "@/registry/cube-archive/types";

const artwork = "/artwork/cube-archive/";

export const cubeArchiveProjects = [
  {
    title: "India",
    category: "fashion, photography",
    description: "Portraits and fashion photographs from the India project.",
    featured: {
      kind: "image",
      src: artwork + "india-main.avif",
      alt: "Fashion portrait from India.",
    },
    images: [
      { src: artwork + "india-portrait.avif", alt: "Portrait from the India project." },
      { src: artwork + "india-crowd.avif", alt: "Group scene from the India project." },
      { src: artwork + "india-main.avif", alt: "Fashion portrait from India." },
    ],
  },
  {
    title: "Saigon",
    category: "fashion, photography",
    description: "Fashion photographs made in Saigon.",
    featured: {
      kind: "image",
      src: artwork + "saigon-main.avif",
      alt: "Fashion photograph from Saigon.",
    },
    images: [
      { src: artwork + "saigon-street.avif", alt: "Street photograph from Saigon." },
      { src: artwork + "saigon-darkroom.avif", alt: "Darkroom photograph from Saigon." },
      { src: artwork + "saigon-main.avif", alt: "Fashion photograph from Saigon." },
    ],
  },
  {
    title: "Archive",
    category: "fashion, photography",
    description: "Selected fashion photographs from the UGRFR archive.",
    featured: {
      kind: "image",
      src: artwork + "archive-01.avif",
      alt: "Fashion photograph from the UGRFR archive.",
    },
    images: [
      { src: artwork + "archive-02.avif", alt: "Second photograph from the UGRFR archive." },
      { src: artwork + "archive-01.avif", alt: "Fashion photograph from the UGRFR archive." },
    ],
  },
  {
    title: "Kitse",
    category: "film, art direction",
    description: "A short film and art direction project for Kitse.",
    featured: {
      kind: "video",
      src: artwork + "kitse-preview.mp4",
      poster: artwork + "kitse-poster.jpg",
      alt: "A still from the Kitse film.",
    },
    images: [
      { src: artwork + "kitse-poster.jpg", alt: "Opening frame from the Kitse film." },
      { src: artwork + "kitse-frame-02.jpg", alt: "A later frame from the Kitse film." },
    ],
  },
  {
    title: "Darkroom",
    category: "fashion, photography",
    description: "Fashion photographs with darkroom tones.",
    featured: {
      kind: "image",
      src: artwork + "saigon-darkroom.avif",
      alt: "Fashion photograph with darkroom tones.",
    },
    images: [
      { src: artwork + "saigon-street.avif", alt: "Street photograph from Saigon." },
      { src: artwork + "saigon-darkroom.avif", alt: "Darkroom photograph from Saigon." },
    ],
  },
  {
    title: "Portrait",
    category: "fashion, photography",
    description: "Portraits and group photographs from the India project.",
    featured: {
      kind: "image",
      src: artwork + "india-portrait.avif",
      alt: "Portrait from the India project.",
    },
    images: [
      { src: artwork + "india-crowd.avif", alt: "Group scene from the India project." },
      { src: artwork + "india-portrait.avif", alt: "Portrait from the India project." },
    ],
  },
] satisfies readonly CubeArchiveProject[];
