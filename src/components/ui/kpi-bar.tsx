import { Fragment } from "react"
import { Skeleton } from "./skeleton"

export interface KpiBarItem {
  label: string
  value: string | number
  /** Optional secondary line, e.g. "+3 this month" */
  delta?: string
  /** Visual tone of the delta: "accent" for positive movement, "muted" for neutral notes. Defaults to "accent". */
  tone?: "accent" | "muted"
}

// "Stats band" shell (dc · component library 02): surface card, 1px line border, 14px radius.
const bandClass = "flex mx-4 w-full rounded-xl border border-border bg-card py-[26px] md:mx-6"
// Equal columns; 32px inline padding and 8px label/value gap match the design export.
const columnClass = "flex min-w-0 flex-1 flex-col gap-2 px-8"
// Full-height 1px divider between items.
const dividerClass = "w-px shrink-0 self-stretch bg-border"

export function KpiBar({
  items,
  isLoading = false,
}: {
  items: KpiBarItem[]
  isLoading?: boolean
}): React.JSX.Element {
  // Loading state: render skeleton placeholders inside the same band shell
  if (isLoading) {
    return (
      <div data-slot="kpi-bar" className={bandClass}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <span className={dividerClass} aria-hidden="true" />}
            <div className={columnClass}>
              <Skeleton className="h-3.5 w-24" />
              <div className="flex items-baseline gap-3">
                <Skeleton className="h-11 w-16" />
                {item.delta && <Skeleton className="h-4 w-24" />}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    )
  }

  // Rendered state: label, baseline-aligned value + delta, dividers between items
  return (
    <div data-slot="kpi-bar" className={bandClass}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span className={dividerClass} aria-hidden="true" />}
          <div className={columnClass}>
            <span className="font-body text-[11px] font-semibold uppercase leading-[14px] tracking-[0.09em] text-muted-foreground">
              {item.label}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[44px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {item.value}
              </span>
              {item.delta && (
                <span
                  className={`font-body text-xs font-semibold leading-4 ${
                    item.tone === "muted" ? "text-muted-foreground" : "text-primary"
                  }`}
                >
                  {item.delta}
                </span>
              )}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
