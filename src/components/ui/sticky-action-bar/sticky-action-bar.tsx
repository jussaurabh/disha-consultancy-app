import * as React from "react";
import { cn } from "@/lib/utils";

function StickyActionBarRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticky-action-bar"
      className={cn(
        "sticky bottom-0 z-30 flex min-h-[76px] w-full items-center gap-4 border-t border-border bg-card px-4 md:px-6",
        className,
      )}
      {...props}
    />
  );
}

function StickyActionBarLeft({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticky-action-bar-left"
      className={cn("flex min-w-0 items-center gap-3.5", className)}
      {...props}
    />
  );
}

function StickyActionBarRight({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticky-action-bar-right"
      className={cn("ml-auto flex items-center gap-3", className)}
      {...props}
    />
  );
}

export const StickyActionBar = Object.assign(StickyActionBarRoot, {
  Left: StickyActionBarLeft,
  Right: StickyActionBarRight,
});