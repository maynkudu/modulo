import Image from "next/image";
import styles from "./modulo-logo.module.css";

/** Displays the supplied PNG unchanged, cropping only its exported transparent padding. */
export function ModuloLogo({ className }: { className?: string }) {
  return (
    <span className={`${styles.frame} ${className ?? ""}`}>
      <Image className={styles.image} src="/brand/modulo-supplied-logo.png" width={2000} height={681} alt="Modulo" preload unoptimized />
    </span>
  );
}
