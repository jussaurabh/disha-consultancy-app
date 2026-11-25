import * as React from "react"

import { cn } from "@/lib/utils"
import { FirstRunIllustration, SearchIllustration } from "./illustrations"

/**
 * DC design system — empty / no-data state (Paper frames 5X4-1 / 5XZ-1).
 *
 * `variant` selects both the illustration and the title size:
 * - "no-data" — first-run folder art, text-xl title, gap-2.5 actions at mt-5
 * - "empty" — search art, text-lg title, gap-3.5 actions at mt-[18px]
 * - omitted — no illustration, a text-only centered block
 *
 * `emptyState` / `noDataState` booleans are deprecated aliases that map onto
 * `variant`; when both are given, `noDataState` takes precedence.
 */
type EmptyStateProps = React.ComponentProps<"div"> & {
  /** Picks the illustration and the title size. No default — omit for a text-only block. */
  variant?: "empty" | "no-data"
  title?: React.ReactNode
  subTitle?: React.ReactNode
  /** Renders inline after `actions` inside the actions row. */
  helperText?: React.ReactNode
  actions?: React.ReactNode
  /** @deprecated Use `variant="empty"`. */
  emptyState?: boolean
  /** @deprecated Use `variant="no-data"`. Takes precedence over `emptyState`. */
  noDataState?: boolean
}

function EmptyState({
  variant,
  title,
  subTitle,
  helperText,
  actions,
  className,
  emptyState,
  noDataState,
  ...props
}: EmptyStateProps) {
  const resolved: "empty" | "no-data" | undefined =
    noDataState ? "no-data" : emptyState ? "empty" : variant
  const isFirstRun = resolved === "no-data"

  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center px-5 pt-5 pb-9 text-center",
        className,
      )}
      {...props}
    >
      {resolved === "no-data" ? (
        <FirstRunIllustration />
      ) : resolved === "empty" ? (
        <SearchIllustration />
      ) : null}
      {title ? (
        <h3
          className={cn(
            "mt-2 font-display font-bold tracking-[-0.01em] text-ink",
            isFirstRun ? "text-xl leading-6" : "text-lg leading-[22px]",
          )}
        >
          {title}
        </h3>
      ) : null}
      {subTitle ? (
        <p className="mt-1.5 text-[13px] leading-[19px] text-muted-foreground">{subTitle}</p>
      ) : null}
      {actions || helperText ? (
        <div
          className={cn(
            "flex items-center",
            isFirstRun ? "gap-2.5" : "gap-3.5",
            isFirstRun ? "mt-5" : "mt-[18px]",
          )}
        >
          {actions}
          {helperText ? (
            <span className="text-xs leading-4 text-muted-foreground">{helperText}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { EmptyState }
