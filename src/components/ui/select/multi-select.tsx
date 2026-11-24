"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { selectPanelClasses, selectRowClasses } from "./select"

/**
 * DC design system — "05 / Select fields" board · MULTI-SELECT.
 *
 * Chips carry chosen values; the field grows, never scrolls. Square
 * checkboxes inside the panel — circles stay single-choice. Search rides
 * the panel top; a count and Clear all close the panel bottom.
 * Chip scale follows the trigger size (18 / 22 / 24 high).
 */
export type MultiSelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type MultiSelectProps = {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  clearLabel?: string
  size?: "sm" | "default" | "lg"
  leadingIcon?: React.ReactNode
  disabled?: boolean
  invalid?: boolean
} & React.ComponentProps<typeof PopoverPrimitive.Root>

const sizeShellClasses = {
  sm: "min-h-9 gap-1.5 py-2 pl-[9px] pr-[7px] font-body text-xs leading-4",
  default: "min-h-10.5 gap-2 py-2.5 pl-2.5 pr-2 font-body text-sm leading-[18px]",
  lg: "min-h-12 gap-2 py-3 pl-3 pr-[9px] font-body text-[15px] leading-5",
} as const

const chipClasses = {
  sm: "h-[18px] gap-[5px] rounded-full px-[7px] text-[11px] leading-3.5",
  default: "h-[22px] gap-1.5 rounded-full px-2 text-xs leading-4",
  lg: "h-6 gap-1.5 rounded-full px-[9px] text-[13px] leading-[17px]",
} as const

const chipRemoveClasses = {
  sm: "text-[10px] leading-3.5",
  default: "text-[11px] leading-4",
  lg: "text-xs leading-[17px]",
} as const

function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  clearLabel = "Clear all",
  size = "default",
  leadingIcon,
  disabled = false,
  invalid = false,
  className,
  ...props
}: MultiSelectProps) {
  const listId = React.useId()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [active, setActive] = React.useState(0)

  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const selected = isControlled ? value : internal

  const toggle = React.useCallback(
    (optionValue: string) => {
      const next = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue]
      onValueChange?.(next)
      if (!isControlled) setInternal(next)
    },
    [selected, onValueChange, isControlled]
  )

  const labelOf = (optionValue: string) =>
    options.find((o) => o.value === optionValue)?.label ?? optionValue

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )
  const enabled = filtered.filter((o) => !o.disabled)

  React.useEffect(() => setActive(0), [search, open])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setSearch("")
  }

  const select = (option: MultiSelectOption) => {
    if (option.disabled) return
    toggle(option.value)
  }

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (enabled.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((i) => (i + 1) % enabled.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((i) => (i - 1 + enabled.length) % enabled.length)
    } else if (event.key === "Home") {
      event.preventDefault()
      setActive(0)
    } else if (event.key === "End") {
      event.preventDefault()
      setActive(enabled.length - 1)
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const option = enabled[active]
      if (option) select(option)
    }
  }

  const activeOption = enabled[active]

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props}>
      <PopoverPrimitive.Trigger
        type="button"
        data-slot="multi-select-trigger"
        data-size={size}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex w-full items-center rounded-lg border border-line bg-field whitespace-nowrap text-foreground outline-hidden select-none transition-[color,border-color,box-shadow] duration-150",
          "not-disabled:not-aria-invalid:not-data-[state=open]:hover:border-line-strong",
          "focus-visible:border-[1.5px] focus-visible:border-primary data-[state=open]:border-[1.5px] data-[state=open]:border-primary",
          "aria-invalid:border-destructive",
          "disabled:cursor-not-allowed disabled:border-line disabled:bg-background dark:disabled:bg-muted disabled:text-muted-foreground/60 dark:disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground",
          sizeShellClasses[size],
          leadingIcon && "gap-2.5 pl-3.5",
          className
        )}
      >
        {leadingIcon}
        <span
          data-slot="multi-select-chips"
          className={cn(
            "flex min-w-0 flex-1 flex-wrap items-center",
            size === "sm" ? "gap-1.5" : "gap-2"
          )}
        >
          {selected.length === 0 ? (
            <span className="truncate text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map((optionValue) => {
              const chipDisabled = disabled || options.find((o) => o.value === optionValue)?.disabled
              return (
                <span
                  key={optionValue}
                  data-slot="multi-select-chip"
                  data-disabled={chipDisabled || undefined}
                  className={cn(
                    "inline-flex max-w-full items-center rounded-full bg-accent-soft text-foreground",
                    chipClasses[size],
                    chipDisabled &&
                      "bg-background dark:bg-muted text-muted-foreground/60 dark:text-muted-foreground"
                  )}
                >
                  <span className="truncate">{labelOf(optionValue)}</span>
                  <span
                    aria-hidden="true"
                    onPointerDown={(event) => {
                      if (chipDisabled) return
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (chipDisabled) return
                      toggle(optionValue)
                    }}
                    className={cn(
                      "cursor-pointer",
                      chipRemoveClasses[size],
                      chipDisabled ? "text-muted-foreground/60" : "text-muted-foreground"
                    )}
                  >
                    ×
                  </span>
                </span>
              )
            })
          )}
        </span>
        <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="multi-select-content"
          align="start"
          sideOffset={8}
          className={cn(
            selectPanelClasses,
            "min-w-(--radix-popover-trigger-width) max-h-(--radix-popover-content-available-height) origin-(--radix-popover-content-transform-origin)",
            // Frame padding stays fixed; only the rows scroll (search and
            // footer stay pinned).
            "overflow-hidden p-2",
            className
          )}
        >
          <div className="mb-1 flex h-8 shrink-0 items-center gap-2 rounded-sm bg-background px-2.5 dark:bg-muted">
            <SearchIcon
              strokeWidth={1.4}
              className="size-[13px] shrink-0 text-muted-foreground"
            />
            <input
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls={listId}
              aria-activedescendant={
                activeOption ? `${listId}-opt-${enabled.indexOf(activeOption)}` : undefined
              }
              autoComplete="off"
              autoFocus
              spellCheck={false}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={searchPlaceholder}
              className="h-full w-full min-w-0 flex-1 bg-transparent font-body text-[13px] leading-4 text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div
            role="listbox"
            id={listId}
            aria-multiselectable="true"
            // 93px = panel padding 16 + search 32 + 4 gap + separator 9 + footer 32
            className="flex max-h-[calc(var(--radix-popover-content-available-height)-93px)] flex-col gap-0.5 overflow-y-auto"
          >
            {filtered.map((option) => {
              const checked = selected.includes(option.value)
              const enabledIndex = enabled.indexOf(option)
              const isActive = enabled[active] === option
              return (
                <div
                  key={option.value}
                  role="option"
                  id={`${listId}-opt-${enabledIndex}`}
                  aria-selected={checked}
                  aria-disabled={option.disabled || undefined}
                  data-active={isActive || undefined}
                  data-disabled={option.disabled || undefined}
                  onClick={() => select(option)}
                  className={cn(selectRowClasses, "cursor-pointer text-left")}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-line"
                    )}
                  >
                    {checked ? <CheckIcon strokeWidth={2} className="size-2.5" /> : null}
                  </span>
                  <span className="truncate">{option.label}</span>
                </div>
              )
            })}
            {filtered.length === 0 ? (
              <div className="px-2.5 py-3 font-body text-xs leading-4 text-muted-foreground">
                No matches
              </div>
            ) : null}
          </div>
          <div className="mx-0.5 my-1 h-px shrink-0 bg-line" />
          <div className="flex h-8 shrink-0 items-center justify-between px-2.5">
            <span className="font-body text-xs leading-4 text-muted-foreground">
              {selected.length} of {options.length} selected
            </span>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => {
                onValueChange?.([])
                if (!isControlled) setInternal([])
              }}
              className="font-body text-xs font-semibold leading-4 text-accent underline-offset-2 transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              {clearLabel}
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { MultiSelect }
