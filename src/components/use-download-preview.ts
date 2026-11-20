"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MultiStepDownloadState } from "@/registry/multi-step-download/MultiStepDownload";

/** Simulates the reference download sequence for public demos and media capture only. */
export function useDownloadPreview() {
  const [state, setState] = useState<MultiStepDownloadState>({ kind: "idle" });
  const frame = useRef(0);
  const running = useRef(false);

  const reset = useCallback(() => {
    cancelAnimationFrame(frame.current);
    running.current = false;
    setState({ kind: "idle" });
  }, []);

  const start = useCallback(({ fail = false }: { fail?: boolean } = {}) => {
    if (running.current) return;
    running.current = true;
    const started = performance.now();
    let lastUpdate = -Infinity;
    let completed = false;
    setState({ kind: "loading", progress: 0 });

    const update = (now: number) => {
      const elapsed = now - started;
      if (elapsed < 2480) {
        if (now - lastUpdate > 45) {
          setState({ kind: "loading", progress: Math.min(1, elapsed / 2400) });
          lastUpdate = now;
        }
      } else if (!completed) {
        completed = true;
        setState(fail ? { kind: "error", message: "Download failed" } : { kind: "success" });
        if (fail) { running.current = false; return; }
      }
      if (elapsed > 4000) {
        running.current = false;
        setState({ kind: "idle" });
        return;
      }
      frame.current = requestAnimationFrame(update);
    };
    frame.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return { state, start, reset };
}
