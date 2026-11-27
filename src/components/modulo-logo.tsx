import Image from "next/image";
import styles from "./modulo-logo.module.css";

/** Displays the supplied transparent wordmark as vector artwork. */
export function ModuloLogo({ className, alt = "Modulo", preload = false }: {
  className?: string;
  alt?: string;
  preload?: boolean;
}) {
  return <Image className={`${styles.logo} ${className ?? ""}`} src="/brand/modulo-wordmark.svg" width={1255.465644163} height={382.48143689} alt={alt} preload={preload} unoptimized />;
}
