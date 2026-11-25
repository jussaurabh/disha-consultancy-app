"use client"

import * as React from "react"

import {
  RadioGroupContext,
  RadioGroupItem,
  type RadioGroupSize,
  type RadioGroupVariant,
} from "./radio-group"
import { cn } from "@/lib/utils"

/**
 * DC design system — "06 / Radio Group" board (V1.0) — option composite.
 *
 * `RadioOption` pairs the bare dot with its label, an optional description
 * and the Messages register (a helper `hint` or `error` line below the
 * option row). The surface comes from the group's `variant` + `size`
 * context: list rows, selector cards, pill cards and joined bar segments.
 */
export type RadioOptionProps = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  hint?: string
  error?: string
  disabled?: boolean
} & Omit<React.ComponentProps<"label">, "htmlFor">

// Row pitch — label-only rows ride the board heights; a description grows
// the row, so the fixed height only applies to the label-only case.
const rowHeights: Record<RadioGroupSize, string> = {
  sm: "h-6",
  default: "h-7",
  lg: "h-8",
}

const pillHeights: Record<RadioGroupSize, string> = {
  sm: "h-9",
  default: "h-[42px]",
  lg: "h-12",
}

const labelSizes: Record<RadioGroupSize, string> = {
  sm: "text-[12px]",
  default: "text-[13px]",
  lg: "text-[14px]",
}

// The option root owns the register surface; the row span spaces the dot
// against the text column inside it.
const optionRoots: Record<RadioGroupVariant, string> = {
  list: "flex flex-col has-data-[state=checked]:[&_[data-slot=radio-option-label]]:font-semibold",
  card: "flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 has-data-[state=checked]:border-accent has-data-[state=checked]:bg-accent-soft has-data-[state=checked]:[border-width:1.5px]",
  pill: "flex h-[42px] items-center gap-[9px] rounded-lg border border-line bg-surface px-[18px] has-data-[state=checked]:border-accent has-data-[state=checked]:[border-width:1.5px]",
  joined: "flex h-10 items-center gap-2 px-4 has-data-[state=checked]:bg-accent-soft",
}

const rowLayouts: Record<RadioGroupVariant, string> = {
  list: "items-start gap-2.5",
  card: "items-start gap-2",
  pill: "items-center gap-[9px]",
  joined: "items-center gap-2",
}

function RadioOption({
  value,
  label,
  description,
  hint,
  error,
  disabled,
  className,
  ...props
}: RadioOptionProps) {
  const id = React.useId()
  const { variant, size } = React.useContext(RadioGroupContext)
  const message = error ?? hint

  return (
    <label
      data-slot="radio-option"
      data-variant={variant}
      data-size={size}
      className={cn(
        optionRoots[variant],
        variant === "pill" && pillHeights[size],
        variant === "pill" && disabled && "bg-surface-pressed",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex",
          rowLayouts[variant],
          variant === "list" && !description && rowHeights[size],
        )}
      >
        <RadioGroupItem
          value={value}
          id={id}
          disabled={disabled}
          className={variant === "list" && description ? "mt-px" : undefined}
        />
        <span className="flex flex-col gap-[3px]">
          <span
            data-slot="radio-option-label"
            className={cn(
              labelSizes[size],
              "leading-4",
              disabled ? "text-muted-foreground/60" : "text-ink",
            )}
          >
            {label}
          </span>
          {description ? (
            <span className="text-xs leading-[1.45] text-muted-foreground">{description}</span>
          ) : null}
        </span>
      </span>
      {message ? (
        <span
          className={cn("mt-2 text-xs leading-[14px]", error ? "text-danger" : "text-muted-foreground")}
        >
          {message}
        </span>
      ) : null}
    </label>
  )
}

export { RadioOption }
