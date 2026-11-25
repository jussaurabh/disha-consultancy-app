"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * DC design system — "06 / Radio Group" board (V1.0).
 *
 * The root carries the register (`variant`) and the scale (`size`) through a
 * module-level context so every item and option below it can read them.
 *
 * Dot: 16px circle with a 1.5px `border-line` ring — selected dyes the ring
 * `accent` and fills an 8px accent dot at the center. Focus paints a 3px
 * accent ring at 30%. Disabled keeps the line ring; invalid dyes the ring
 * danger. Registers: `list` rows, `card` selector cards, `pill` compact
 * cards, `joined` — a divided bar the root owns.
 */
type RadioGroupVariant = "list" | "card" | "pill" | "joined";
type RadioGroupSize = "sm" | "default" | "lg";

const RadioGroupContext = React.createContext<{
  variant: RadioGroupVariant;
  size: RadioGroupSize;
}>({
  variant: "list",
  size: "default",
});

const groupLayouts: Record<RadioGroupVariant, string> = {
  list: "grid gap-3",
  card: "flex flex-wrap gap-5",
  pill: "flex flex-wrap gap-3",
  joined:
    "inline-flex overflow-hidden rounded-lg border border-line bg-surface divide-x divide-line",
};

function RadioGroup({
  className,
  variant = "list",
  size = "default",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  variant?: RadioGroupVariant;
  size?: RadioGroupSize;
}) {
  return (
    <RadioGroupContext.Provider value={{ variant, size }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        data-variant={variant}
        data-size={size}
        className={cn(groupLayouts[variant], className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

const itemSizes: Record<RadioGroupSize, string> = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-5",
};

const fillSizes: Record<RadioGroupSize, string> = {
  sm: "size-[7px]",
  default: "size-2",
  lg: "size-2.5",
};

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { size } = React.useContext(RadioGroupContext);

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border-[1.5px] border-line bg-transparent outline-none transition-[color,box-shadow] focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:border-line data-[state=checked]:border-accent aria-invalid:border-danger aria-invalid:ring-danger/20 cursor-pointer",
        itemSizes[size],
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <span className={cn("rounded-full bg-accent", fillSizes[size])} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupContext };
export type { RadioGroupVariant, RadioGroupSize };
