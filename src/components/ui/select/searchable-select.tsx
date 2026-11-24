"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { selectPanelClasses, selectRowClasses } from "./select"

/**
 * DC design system — "05 / Select fields" board · TRIGGERS — "Search · type to filter".
 *
 * A single-select combobox: the field carries a 14px magnifier, typing
 * filters, the panel shows plain rows with the accent-soft selected tint
 * and a trailing check. Opening resets the query; the field shows the
 * chosen label when closed. Chevron toggles; Escape closes.
 */
export type SearchableSelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SearchableSelectProps = {
  options: SearchableSelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  size?: "sm" | "default" | "lg"
  disabled?: boolean
  invalid?: boolean
  className?: string
} & React.ComponentProps<typeof PopoverPrimitive.Root>

const sizeShellClasses = {
  sm: "h-9 gap-2 px-3 font-body text-xs leading-4",
  default: "h-10.5 gap-2.5 px-3.5 font-body text-sm leading-[18px]",
  lg: "h-12 gap-2.5 px-4 font-body text-[15px] leading-5",
} as const

function SearchableSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search…",
  searchPlaceholder = "Type to filter…",
  size = "default",
  disabled = false,
  invalid = false,
  className,
  ...props
}: SearchableSelectProps) {
  const listId = React.useId()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [active, setActive] = React.useState(0)

  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const selectedValue = isControlled ? value : internal
  const selectedOption = options.find((o) => o.value === selectedValue)
  const display = selectedOption?.label ?? ""

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )
  const enabled = filtered.filter((o) => !o.disabled)

  React.useEffect(() => setActive(0), [search, open])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    // Opening starts a fresh query; the effect below restores the label on close.
    if (next) setSearch("")
  }

  // While closed, the field mirrors the chosen label (also covers
  // controlled value changes made while the panel is shut).
  React.useEffect(() => {
    if (!open) setSearch(display)
  }, [display, open])

  const pick = (option?: SearchableSelectOption) => {
    if (!option || option.disabled) return
    onValueChange?.(option.value)
    if (!isControlled) setInternal(option.value)
    setOpen(false)
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false)
      return
    }
    if (enabled.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % enabled.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
      setActive((i) => (i - 1 + enabled.length) % enabled.length)
    } else if (event.key === "Home") {
      event.preventDefault()
      setActive(0)
    } else if (event.key === "End") {
      event.preventDefault()
      setActive(enabled.length - 1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      pick(enabled[active])
    }
  }

  const activeOption = enabled[active]

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props}>
      <PopoverPrimitive.Anchor asChild>
        <div
          data-slot="searchable-select"
          data-size={size}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          onClick={() => {
            if (disabled) return
            setOpen(true)
            inputRef.current?.focus()
          }}
          className={cn(
            "flex w-full cursor-text items-center rounded-lg border border-line bg-field font-body whitespace-nowrap text-foreground outline-hidden transition-[color,border-color,box-shadow] duration-150",
            "not-data-[disabled=true]:not-data-[invalid=true]:hover:border-line-strong",
            "focus-within:border-[1.5px] focus-within:border-primary",
            "data-[invalid=true]:border-destructive",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-line data-[disabled=true]:bg-background dark:data-[disabled=true]:bg-muted data-[disabled=true]:text-muted-foreground/60 dark:data-[disabled=true]:text-muted-foreground",
            sizeShellClasses[size],
            className
          )}
        >
          <SearchIcon
            strokeWidth={1.4}
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listId}
            aria-invalid={invalid || undefined}
            aria-activedescendant={
              activeOption ? `${listId}-opt-${enabled.indexOf(activeOption)}` : undefined
            }
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={onInputKeyDown}
            onFocus={() => {
              if (!disabled) setOpen(true)
            }}
            placeholder={open ? searchPlaceholder : placeholder}
            className="h-full w-full min-w-0 flex-1 cursor-text bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <span
            aria-hidden="true"
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation()
              setOpen((o) => !o)
            }}
            className="shrink-0"
          >
            <ChevronDownIcon className="size-3.5 text-muted-foreground" />
          </span>
        </div>
      </PopoverPrimitive.Anchor>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="searchable-select-content"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            selectPanelClasses,
            "min-w-(--radix-popover-trigger-width) max-h-(--radix-popover-content-available-height) origin-(--radix-popover-content-transform-origin)",
            // Frame padding stays fixed; only the rows scroll.
            "overflow-hidden p-2",
            className
          )}
        >
          <div
            role="listbox"
            id={listId}
            className="flex max-h-[calc(var(--radix-popover-content-available-height)-16px)] flex-col gap-0.5 overflow-y-auto"
          >
            {filtered.map((option) => {
              const checked = option.value === selectedValue
              const isActive = enabled[active] === option
              return (
                <div
                  key={option.value}
                  role="option"
                  id={`${listId}-opt-${enabled.indexOf(option)}`}
                  aria-selected={checked}
                  aria-disabled={option.disabled || undefined}
                  data-active={isActive || undefined}
                  data-disabled={option.disabled || undefined}
                  onClick={() => pick(option)}
                  className={cn(selectRowClasses, "cursor-pointer pr-8 text-left")}
                >
                  <span className="truncate">{option.label}</span>
                  <span className="pointer-events-none absolute right-2.5 flex size-3.5 items-center justify-center">
                    {checked ? (
                      <CheckIcon
                        strokeWidth={1.7}
                        className="pointer-events-none size-3.5 text-primary"
                      />
                    ) : null}
                  </span>
                </div>
              )
            })}
            {filtered.length === 0 ? (
              <div className="px-2.5 py-3 font-body text-xs leading-4 text-muted-foreground">
                No matches
              </div>
            ) : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { SearchableSelect }
