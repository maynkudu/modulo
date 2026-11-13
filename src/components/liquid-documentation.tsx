"use client";

import { useId, useLayoutEffect, useRef, type ComponentProps } from "react";
import { LiquidScrollbar } from "@/registry/liquid-animations/LiquidScrollbar";
import "./liquid-documentation.css";

export function LiquidCode({ children, className = "", ...props }: ComponentProps<"pre">) {
  const id = useId(), viewport = useRef<HTMLPreElement>(null);
  return <div className="liquid-code-block">
    <pre {...props} ref={viewport} id={id} className={`liquid-scroll-viewport ${className}`} tabIndex={0}>{children}</pre>
    <LiquidScrollbar viewport={viewport} controls={id} />
    <LiquidScrollbar viewport={viewport} controls={id} orientation="horizontal" />
  </div>;
}

export function LiquidDocumentScrollbar() {
  useLayoutEffect(() => {
    document.documentElement.dataset.liquidScrolling = "";
    return () => { delete document.documentElement.dataset.liquidScrolling; };
  }, []);
  return <LiquidScrollbar controls="modulo-scroll" />;
}
