/** Draws Modulo's four-part mark, adapted from a rounded modular shape study on Shapes.gallery. */
export function ModuloMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M23 10h11c7 0 13 6 13 13v11c0 7-6 13-13 13H23c-7 0-13-6-13-13V23c0-7 6-13 13-13Z" />
      <path fill="currentColor" d="M23 10h11c7 0 13 6 13 13v11c0 7-6 13-13 13H23c-7 0-13-6-13-13V23c0-7 6-13 13-13Z" transform="rotate(90 50 50)" />
      <path fill="currentColor" d="M23 10h11c7 0 13 6 13 13v11c0 7-6 13-13 13H23c-7 0-13-6-13-13V23c0-7 6-13 13-13Z" transform="rotate(180 50 50)" />
      <path fill="var(--mark-accent, var(--coral, #ff745d))" d="M23 10h11c7 0 13 6 13 13v11c0 7-6 13-13 13H23c-7 0-13-6-13-13V23c0-7 6-13 13-13Z" transform="rotate(270 50 50)" />
      <circle cx="50" cy="50" r="8" fill="var(--mark-core, var(--acid, #d8fa59))" />
      <path d="M50 46v8M46 50h8" stroke="var(--mark-cross, var(--ink, #1b192b))" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
