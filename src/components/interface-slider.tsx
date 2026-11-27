"use client";

import type { ComponentProps } from "react";
import { DemoRange } from "./demo-controls";

type InterfaceSliderProps = Omit<ComponentProps<typeof DemoRange>, "format"> & {
  formatValue?: (value: number) => string;
};

export function InterfaceSlider({ formatValue, ...props }: InterfaceSliderProps) {
  return <DemoRange {...props} format={formatValue} />;
}
