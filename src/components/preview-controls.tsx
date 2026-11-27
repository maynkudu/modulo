"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import styles from "./preview-controls.module.css";

export function PreviewButton({ className = "", ...props }: ComponentProps<"button">) {
  return <button type="button" {...props} className={`${styles.button} ${className}`} />;
}

export function PreviewSelect<Value extends string>({ id, label, value, options, onValueChange, className = "", disabled, align }: {
  id?: string;
  label: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onValueChange: (value: Value) => void;
  className?: string;
  disabled?: boolean;
  align?: "start" | "end" | "center";
}) {
  return <select id={id} aria-label={label} value={value} className={`${styles.select} ${className}`} disabled={disabled} data-align={align}
    onChange={event => {
      const selected = options.find(option => option.value === event.currentTarget.value);
      if (selected) onValueChange(selected.value);
    }}>
    {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
  </select>;
}

export function PreviewDisclosure({ children, label, open = false, className = "" }: {
  children: ReactNode;
  label: string;
  open?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(open);
  return <details className={`${styles.disclosure} ${className}`} open={expanded}>
    <summary onClick={event => { event.preventDefault(); setExpanded(value => !value); }}>
      <span>{label}</span><span aria-hidden="true">{expanded ? "Hide" : "Show"}</span>
    </summary>
    <div className={styles.disclosureContent}>{children}</div>
  </details>;
}

export function PreviewTrack({ className = "", ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${styles.track} ${className}`} />;
}
