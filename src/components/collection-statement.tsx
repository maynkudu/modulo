import Link from "next/link";
import { collectionStatementText } from "@/lib/collection-statement-text";
import { LiquidTextReveal } from "@/registry/liquid-text-reveal/LiquidTextReveal";
import styles from "./collection-statement.module.css";

/** Retains the selected collection statement and its reversible liquid text reveal. */
export function CollectionStatement() {
  return (
    <section className={styles.statement} aria-labelledby="collection-statement">
      <div className={styles.statementInner}>
        <LiquidTextReveal
          id="collection-statement"
          as="h2"
          className={styles.statementTitle}
          text={collectionStatementText}
          color="#ff0000"
          profile="studio"
          revealMode="scroll"
        />
        <div className={styles.statementBody}>
          <p>Each component has a working demo, controls, and installation instructions. Source access uses a Modulo key.</p>
          <Link href="/registry">Install a component</Link>
        </div>
      </div>
    </section>
  );
}
