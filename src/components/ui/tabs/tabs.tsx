"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      // Horizontal roots stack the list above the content (flex-col); vertical
      // keeps the default row so the side rail sits beside the content.
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:w-[200px] group-data-vertical/tabs:gap-0.5 group-data-vertical/tabs:rounded-[12px] group-data-vertical/tabs:border group-data-vertical/tabs:border-line group-data-vertical/tabs:bg-surface group-data-vertical/tabs:p-2",
  {
    variants: {
      variant: {
        default: "gap-1 rounded-lg bg-accent-soft p-1 dark:bg-surface-pressed",
        line: "gap-1 rounded-none border-b border-line bg-transparent",
        pill: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  scrollable = false,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants> & { scrollable?: boolean }) {
  const listRef = React.useRef<HTMLDivElement>(null)

  if (!scrollable) {
    return (
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    )
  }

  const scroll = (delta: number) =>
    listRef.current?.scrollBy({ left: delta, behavior: "smooth" })

  return (
    <div className="relative flex min-w-0 items-center gap-2">
      <button
        type="button"
        aria-label="Scroll tabs backward"
        onClick={() => scroll(-240)}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-line text-muted-foreground"
      >
        <ChevronLeft aria-hidden className="size-4" />
      </button>
      <TabsPrimitive.List
        ref={listRef}
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          tabsListVariants({ variant }),
          "relative min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className
        )}
        {...props}
      />
      <button
        type="button"
        aria-label="Scroll tabs forward"
        onClick={() => scroll(240)}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-line text-muted-foreground"
      >
        <ChevronRight aria-hidden className="size-4" />
      </button>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-r from-transparent via-ground/60 to-ground"
      />
    </div>
  )
}

function TabsTrigger({
  className,
  count,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { count?: number }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-body text-[13px] font-medium leading-4 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Variant-scoped rules — the trigger cannot read the list variant, so
        // every register styles the trigger through the list's group name.
        "group-data-[variant=default]/tabs-list:h-[36px] group-data-[variant=default]/tabs-list:px-4 group-data-[variant=default]/tabs-list:rounded-lg group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:data-active:bg-surface dark:group-data-[variant=default]/tabs-list:data-active:bg-ground group-data-[variant=default]/tabs-list:data-active:border-line group-data-[variant=default]/tabs-list:data-active:text-foreground group-data-[variant=default]/tabs-list:data-active:font-semibold group-data-[variant=default]/tabs-list:data-active:shadow-[0_1px_2px_#201E191A] dark:group-data-[variant=default]/tabs-list:data-active:shadow-[0_1px_2px_#00000066]",
        "group-data-[variant=line]/tabs-list:h-10 group-data-[variant=line]/tabs-list:px-3.5 group-data-[variant=line]/tabs-list:rounded-t-lg group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:data-active:border-accent group-data-[variant=line]/tabs-list:data-active:text-foreground group-data-[variant=line]/tabs-list:data-active:font-semibold",
        "group-data-[variant=pill]/tabs-list:h-[36px] group-data-[variant=pill]/tabs-list:px-4 group-data-[variant=pill]/tabs-list:rounded-full group-data-[variant=pill]/tabs-list:data-active:bg-accent-soft group-data-[variant=pill]/tabs-list:data-active:text-accent group-data-[variant=pill]/tabs-list:data-active:font-semibold",
        // Side rail (vertical) — the rail is its own register, so its rules
        // carry !important where they compete with the variant-scoped rules
        // above (height, padding, radius, active fill and text color).
        "group-data-vertical/tabs:h-9! group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:gap-2.5 group-data-vertical/tabs:px-3! group-data-vertical/tabs:rounded-lg! group-data-vertical/tabs:data-active:bg-accent-soft! group-data-vertical/tabs:data-active:text-accent! group-data-vertical/tabs:data-active:font-semibold",
        "group-data-vertical/tabs:before:absolute group-data-vertical/tabs:before:left-0 group-data-vertical/tabs:before:h-4 group-data-vertical/tabs:before:w-0.5 group-data-vertical/tabs:before:rounded-[1px] group-data-vertical/tabs:before:bg-transparent group-data-vertical/tabs:data-active:before:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined ? (
        <span
          data-slot="tabs-count"
          className="inline-flex h-[18px] items-center rounded-full bg-copper/15 px-[7px] text-[11px] font-semibold leading-[14px] text-copper"
        >
          {count}
        </span>
      ) : null}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
