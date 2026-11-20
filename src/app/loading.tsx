import { ModuloMark } from "@/components/modulo-mark";
import styles from "./loading.module.css";

/** Shows a brief brand transition while a route is loading. */
export default function Loading() {
  return <div className={styles.loading} role="status" aria-live="polite">
    <ModuloMark className={styles.mark} />
    <span className={styles.wordmark}>modulo</span>
    <span className={styles.track} aria-hidden="true"><i /></span>
    <span className="sr-only">Loading page</span>
  </div>;
}
