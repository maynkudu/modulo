import type { RegistryItem } from "shadcn/schema";
import { getComponentDetails } from "@/lib/seo";

export function ComponentMediaLinks({ component }: { component: RegistryItem }) {
  const { media } = getComponentDetails(component);
  return <>
    <a href={media.thumbnail.src} download>Download thumbnail</a>
    <a href={media.animation.src} download>Download preview GIF</a>
    <a href={media.video.src} download>Download preview video</a>
  </>;
}
