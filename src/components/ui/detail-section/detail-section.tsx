"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * DC design system — "Detail Section" shell.
 *
 * Spec: rounded-lg · border-line · bg-surface · header band h-10 bg-ground
 * · px-6 · title 11px/14px uppercase semibold · actions inline.
 * Content area flows beneath the band with no extra wrapper padding.
 * Matches the organization detail tabs: Company, Contact, Bank, PF, ESI…
 */
function DetailSection({
  className,
  title,
  description,
  children,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  /** Section title shown in the header band */
  title: string
  /** Optional description shown below title in header (hidden on narrow) */
  description?: string
  /** Trailing action node(s) — typically Edit/Save/Cancel buttons */
  action?: React.ReactNode
}) {
  return (
    <div
      data-slot="detail-section"
      className={cn(
        "min-w-0 flex-1 overflow-hidden rounded-lg border border-line bg-surface",
        className
      )}
      {...props}
    >
      {/* Header band */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-line bg-ground px-6">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted truncate">
            {title}
          </span>
          {description && (
            <span className="text-[10px] leading-3 text-muted-foreground hidden sm:block truncate">
              {description}
            </span>
          )}
        </div>
        {action && (
          <div data-slot="detail-section-action" className="flex items-center gap-2 shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      <div data-slot="detail-section-content" className="min-w-0">
        {children}
      </div>
    </div>
  )
}

/**
 * Compound component for header actions — keeps action layout consistent.
 * Use inside DetailSection's action prop: <DetailSection.Action><Button>Edit</Button></DetailSection.Action>
 */
function DetailSectionAction({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-section-action"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

DetailSection.Action = DetailSectionAction

export { DetailSection, DetailSectionAction }