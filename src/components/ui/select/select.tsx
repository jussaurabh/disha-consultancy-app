"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

/**
 * DC design system — "05 / Select fields" board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: trigger = the 42 field shell (36 dense · 48 hero; radius and chrome
 * stay constant) · chevron trails 14px muted · leading slots mirror how
 * options render open (16px icon · 6px dot · 20px avatar) · panel 8px under
 * the trigger · radius 14 · rows 40 · radius 6 · selected tints accent/10
 * with a check · hover fills ground (dropdown-menu parity) · disabled rows
 * read faint.
 * Multi = square checks (MultiSelect) · search = SearchableSelect.
 *
 * Shared panel/row classes below also style MultiSelect and
 * SearchableSelect so all three stay one shell.
 */
export const selectPanelClasses =
  "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-line bg-field text-popover-foreground shadow-[0_16px_40px_#201E191A] dark:shadow-[0_16px_40px_#00000073] duration-100 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1"

export const selectRowClasses =
  "relative flex h-10 w-full cursor-default items-center gap-2.5 rounded-sm px-2.5 py-0 font-body text-sm leading-[18px] text-foreground outline-hidden select-none hover:not-aria-selected:bg-ground focus:not-aria-selected:bg-ground data-active:not-aria-selected:bg-ground aria-selected:bg-accent/10 data-disabled:pointer-events-none data-disabled:text-muted-foreground/60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground aria-selected:[&_svg:not([class*='text-'])]:text-primary"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "lg"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-line bg-field font-body text-sm leading-[18px] whitespace-nowrap text-foreground outline-hidden select-none transition-[color,border-color,box-shadow] duration-150 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        "not-disabled:not-aria-invalid:not-data-[state=open]:hover:border-line-strong [&_svg:not([class*='text-'])]:text-muted-foreground",
        "focus-visible:border-[1.5px] focus-visible:border-primary data-[state=open]:border-[1.5px] data-[state=open]:border-primary",
        "aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-background dark:disabled:bg-muted disabled:text-muted-foreground/60 dark:disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "data-placeholder:text-muted-foreground",
        "data-[size=default]:h-10.5 data-[size=default]:px-3.5",
        "data-[size=sm]:h-9 data-[size=sm]:px-3 data-[size=sm]:text-xs data-[size=sm]:leading-4",
        "data-[size=lg]:h-12 data-[size=lg]:px-4 data-[size=lg]:text-[15px] data-[size=lg]:leading-5",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-3.5 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/** 6px status dot for trigger and option rows — color via className (bg-accent, bg-copper, bg-muted-foreground, bg-line). */
function SelectDot({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="select-dot"
      aria-hidden="true"
      className={cn("inline-block size-1.5 shrink-0 rounded-full bg-accent", className)}
      {...props}
    />
  )
}

/** Initials avatar — 20px in the trigger, 24px in rows (pass className="size-6"). */
function SelectAvatar({
  initials,
  className,
  ...props
}: React.ComponentProps<"span"> & { initials: string }) {
  return (
    <span
      data-slot="select-avatar"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft font-body text-[9px] font-semibold leading-3 text-accent select-none",
        className
      )}
      {...props}
    >
      {initials}
    </span>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const isPopper = position === "popper"
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          selectPanelClasses,
          // Long lists scroll inside the panel frame — the 8px padding stays
          // fixed so scrolled rows keep the same spacing as a short menu.
          // (Radix's scroll buttons never trigger when the content scrolls,
          // so they are left out; the scrollbar carries long lists.)
          isPopper && "overflow-hidden p-2",
          className
        )}
        position={position}
        align={align}
        sideOffset={sideOffset}
        {...props}
      >
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "flex flex-col gap-0.5 outline-none",
            isPopper
              ? "min-w-0 max-h-[calc(var(--radix-select-content-available-height)-18px)] min-w-[calc(var(--radix-select-trigger-width)-16px)] overflow-x-hidden overflow-y-auto"
              : "max-h-full overflow-y-auto"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2.5 py-1.5 font-body text-xs leading-4 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectRowClasses, "pr-8", className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span
        data-slot="select-item-indicator"
        className="pointer-events-none absolute right-2.5 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            strokeWidth={1.7}
            className="pointer-events-none size-3.5 text-primary"
          />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none mx-0.5 my-1 h-px bg-line", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex h-6 shrink-0 cursor-default items-center justify-center bg-field text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex h-6 shrink-0 cursor-default items-center justify-center bg-field text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectAvatar,
  SelectContent,
  SelectDot,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
