import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./studio-destinations.module.css";

const workCategories = [
  { href: "/work", label: "Projects", page: "work" },
  { href: "/pages", label: "Pages", page: "pages" },
  { href: "/components", label: "Components", page: "catalog" },
] as const;

type WorkCategoryPage = (typeof workCategories)[number]["page"];

/** Gives each Work index the same category navigation and independent URL. */
export function WorkCollectionLayout({ page, title, description, children }: {
  page: WorkCategoryPage;
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <main className={styles.workLayout} id="content">
        <nav className={styles.categories} aria-label="Work categories">
          {workCategories.map(category => (
            <Link key={category.href} href={category.href} aria-current={category.page === page ? "page" : undefined}>
              {category.label}
            </Link>
          ))}
        </nav>
        <div className={styles.collection}>
          {typeof title === "string" ? <h1 className={styles.title}>{title}</h1> : title}
          <p className={styles.collectionIntro}>{description}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
