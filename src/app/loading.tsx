import { ModuloLogo } from "@/components/modulo-logo";
import styles from "./loading.module.css";

/** Shows the route's real loading state without a timer or fake progress. */
export default function Loading() {
  return <div className={styles.loading} role="status" aria-live="polite">
    <ModuloLogo alt="" className={styles.wordmark} />
    <span className="sr-only">Loading page</span>
  </div>;
}
