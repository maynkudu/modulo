import Image from "next/image";
import { StudioProjectPreview } from "@/components/studio-project-preview";
import { WorkCollectionLayout } from "@/components/work-collection-layout";
import styles from "@/components/studio-destinations.module.css";
import { getSiteMetadata } from "@/lib/seo";
import { studioProjects } from "@/lib/studio-content";

export const metadata = getSiteMetadata("work");

/** Shows selected studio projects with links to their live detail pages. */
export default function WorkPage() {
  return (
    <WorkCollectionLayout page="work" title="Selected work" description="Independent studies in interactive art, typography and motion.">
      <div className={styles.projectGrid}>
        {studioProjects.map(({ slug, title, type, alt }) => (
          <StudioProjectPreview
            key={slug}
            href={`/components/${slug}`}
            className={styles.projectCard}
            mediaClassName={styles.projectMedia}
            clip={`/media/${slug}.mp4`}
            still={<Image src={`/media/${slug}.jpg`} alt={alt} fill sizes="(max-width: 550px) 90vw, (max-width: 800px) 46vw, 36vw" />}
            caption={<><h2>{title}</h2><p>{type}</p></>}
          />
        ))}
      </div>
    </WorkCollectionLayout>
  );
}
