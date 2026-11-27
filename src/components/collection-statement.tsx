import Image from "next/image";
import Link from "next/link";
import type { ComponentMedia } from "@/lib/catalog";
import { collectionStatementText } from "@/lib/collection-statement-text";
import styles from "./collection-statement.module.css";

export function CollectionStatement({ featured }: {
  featured: {
    title: string;
    href: string;
    thumbnail: Pick<ComponentMedia["thumbnail"], "src" | "alt" | "width" | "height">;
  };
}) {
  return <section className={styles.statement} aria-labelledby="collection-statement">
    <div className={styles.statementInner}>
      <Link className={styles.featured} href={featured.href} aria-label={`Preview ${featured.title}`}>
        <Image className={styles.featuredImage} src={featured.thumbnail.src} alt={featured.thumbnail.alt}
          width={featured.thumbnail.width} height={featured.thumbnail.height} sizes="(max-width: 700px) 88px, 142px" priority unoptimized />
        <span>{featured.title}</span>
      </Link>
      <h2 id="collection-statement" className={styles.statementTitle}>{collectionStatementText}</h2>
    </div>
  </section>;
}
