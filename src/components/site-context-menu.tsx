"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { ContextMenu } from "@base-ui/react/context-menu";
import styles from "./site-context-menu.module.css";

const destinations = [
  { label: "The collection", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Shaders", href: "/shaders" },
  { label: "Pages", href: "/pages" },
] as const;

export function SiteContextMenu({ children }: { children: ReactNode }) {
  const router = useRouter();

  const focusSearch = useCallback(() => {
    const input = document.getElementById("collection-search");
    if (input instanceof HTMLInputElement) {
      requestAnimationFrame(() => input.focus());
      return;
    }
    router.push("/#collection-search");
  }, [router]);

  function handleContextMenuShortcut(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!(event.key === "F10" && event.shiftKey) && event.key !== "ContextMenu") return;
    if (!(event.target instanceof Element)) return;
    event.preventDefault();
    const bounds = event.target.getBoundingClientRect();
    event.target.dispatchEvent(new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      button: 2,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    }));
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key !== "/" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof HTMLElement
        && (event.target.isContentEditable || event.target.closest("input, textarea, select, [role='combobox']"))) return;
      event.preventDefault();
      focusSearch();
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [focusSearch]);

  return <ContextMenu.Root>
    <ContextMenu.Trigger render={<div className={styles.contextArea} />} onKeyDown={handleContextMenuShortcut}>
      {children}
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner className={styles.positioner} sideOffset={4} collisionPadding={12}>
        <ContextMenu.Popup className={styles.popup} aria-label="Collection menu">
          <ContextMenu.Item className={styles.item} onClick={focusSearch}>
            <span>Search the collection</span><kbd>/</kbd>
          </ContextMenu.Item>
          {destinations.map(({ label, href }) => <ContextMenu.LinkItem key={href} className={styles.item}
            href={href} render={<Link href={href} />} closeOnClick>{label}</ContextMenu.LinkItem>)}
        </ContextMenu.Popup>
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>;
}
