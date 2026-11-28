"use client";

import { CubeArchivePage } from "@/components/cube-archive/CubeArchivePage";
import { cubeArchiveProjects } from "@/lib/cube-archive-projects";

export function CubeArchiveDemo() {
  return <CubeArchivePage projects={cubeArchiveProjects} />;
}
