import { Fragment } from "react"
import { cn } from "@/lib/utils"

export type UiVariationVariant = "greeting" | "index" | "form"

export interface UiVariationProps {
  variant?: UiVariationVariant
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function UiVariation({
  variant = "index",
  eyebrow,
  title,
  description,
  actions,
  className,
}: UiVariationProps): React.JSX.Element {
  const rootClasses = cn(
    "flex w-full flex-wrap items-end justify-between gap-6 px-4 pt-4 md:px-6 md:pt-6",
    className,
  )

  const leftColumnClasses = "flex flex-col gap-2.5"

  const eyebrowClasses = cn(
    "font-body text-[11px] leading-[14px] font-semibold",
    variant === "index" && "uppercase tracking-[0.09em] text-muted",
    variant === "form" && "tracking-[0.1em] text-copper",
  )

  const titleClasses = cn(
    "font-display leading-none font-extrabold",
    variant === "form"
      ? "text-[46px] tracking-[-0.02em] text-ink"
      : "text-[52px] tracking-[-0.03em] text-ink",
  )

  const descriptionClasses = "font-body text-sm leading-[18px] text-muted"

  const actionsWrapperClasses = cn(
    "flex",
    variant === "greeting" && "flex-col items-end gap-2.5 pb-1.5",
    variant === "index" && "items-center gap-3.5 pb-1",
    variant === "form" && "items-center gap-3 pb-1",
  )

  return (
    <div data-slot="ui-variation" className={rootClasses}>
      <div className={leftColumnClasses}>
        {eyebrow && (
          <span data-slot="ui-variation-eyebrow" className={eyebrowClasses}>
            {eyebrow}
          </span>
        )}
        <span data-slot="ui-variation-title" className={titleClasses}>
          {title}
        </span>
        {description && (
          <span data-slot="ui-variation-description" className={descriptionClasses}>
            {description}
          </span>
        )}
      </div>
      {actions && (
        <div data-slot="ui-variation-actions" className={actionsWrapperClasses}>
          {actions}
        </div>
      )}
    </div>
  )
}

export function UiVariationMeta({
  label,
  value,
  suffix,
}: {
  label: string
  value: string
  suffix?: string
}): React.JSX.Element {
  const labelClasses = "font-body text-[13px] leading-4 text-muted"
  const valueClasses = "font-display text-[15px] leading-[18px] font-bold text-copper"
  const suffixClasses = "font-body text-xs leading-4 text-muted"

  return (
    <Fragment data-slot="ui-variation-meta">
      <span className={labelClasses}>{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={valueClasses}>{value}</span>
        {suffix && <span className={suffixClasses}>{suffix}</span>}
      </div>
    </Fragment>
  )
}