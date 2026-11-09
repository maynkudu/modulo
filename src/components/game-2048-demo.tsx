"use client";

import { useCallback } from "react";
import { Game2048, type Game2048Controller } from "@/registry/2048/Game2048";
import { useSoundSettings } from "@/lib/interface-sounds";

declare global { interface Window { game2048?: Game2048Controller; } }

export function Game2048Demo() {
  const sound = useSoundSettings();
  const onReady = useCallback((game: Game2048Controller | null) => {
    if (process.env.NODE_ENV === "development") {
      if (game) window.game2048 = game; else delete window.game2048;
    }
  }, []);
  return <Game2048 enableAudio={sound.enabled} volume={sound.volume * .45} onReady={onReady} />;
}
