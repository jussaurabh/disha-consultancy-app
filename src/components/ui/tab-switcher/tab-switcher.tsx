"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export interface TabSwitcherItem {
  value: string
  label: string
  count?: string | number
}

export interface TabSwitcherProps {
  items: TabSwitcherItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function TabSwitcher({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: TabSwitcherProps): React.JSX.Element {
  const rootClasses = cn("data-slot=tab-switcher", className)
  const listClasses = "flex w-full items-center gap-8 border-b border-line px-4 md:px-6"
  const triggerClasses = cn(
    "group/tab-trigger flex h-11 items-center gap-2 border-b-2 border-transparent -mb-px text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:text-ink",
  )
  const badgeBaseClasses = "rounded-full border bg-surface px-2 py-0.5 text-[11px] leading-[14px] font-semibold text-muted"
  const badgeActiveClasses = "group-data-[state=active]/tab-trigger:border-0 group-data-[state=active]/tab-trigger:bg-accent-soft group-data-[state=active]/tab-trigger:text-accent"

  return (
    <TabsPrimitive.Root
      data-slot="tab-switcher"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={rootClasses}
    >
      <TabsPrimitive.List data-slot="tab-switcher-list" className={listClasses}>
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            data-slot="tab-switcher-trigger"
            className={triggerClasses}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                data-slot="tab-switcher-badge"
                className={cn(badgeBaseClasses, badgeActiveClasses)}
              >
                {item.count}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}