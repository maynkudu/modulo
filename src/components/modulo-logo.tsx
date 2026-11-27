import Image from "next/image";
import styles from "./modulo-logo.module.css";

/** Displays the supplied transparent wordmark as vector artwork. */
export function ModuloLogo({ className, alt = "Modulo", animated = false, preload = false }: {
  className?: string;
  alt?: string;
  animated?: boolean;
  preload?: boolean;
}) {
  return <Image className={`${styles.logo} ${className ?? ""}`} src={animated ? "/brand/modulo-wordmark-assemble.svg" : "/brand/modulo-wordmark-white.svg"}
    width={animated ? 1124 : 1028} height={animated ? 286 : 170} alt={alt} preload={preload} unoptimized />;
}
