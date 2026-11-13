"use client";

import { LiquidSlider, type LiquidSliderProps } from "@/registry/liquid-animations/LiquidSlider";
import { playSound } from "@/lib/interface-sounds";

export function InterfaceSlider({ onValueChange, ...props }: LiquidSliderProps) {
  return <LiquidSlider {...props} onValueChange={value => {
    onValueChange?.(value);
    playSound("slide");
  }} />;
}
