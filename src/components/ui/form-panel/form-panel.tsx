"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormPanelProps extends React.ComponentProps<"section"> {
  /** Small-caps copper kicker, rendered uppercase, e.g. "Step 2 of 6 — Contact" */
  eyebrow?: string
  /** Panel heading, e.g. "Contact & address" */
  title: string
  /** Muted line under the title */
  description?: string
  /** Right side of the header, e.g. <><Clock aria-hidden /> Takes ~2 minutes</> */
  meta?: React.ReactNode
  /** Bottom note slot inside the body, e.g. an <InfoNote nested> */
  note?: React.ReactNode
}

export function FormPanel({
  eyebrow,
  title,
  description,
  meta,
  note,
  className,
  children,
  ...props
}: FormPanelProps) {
  return (
    <section
      data-slot="form-panel"
      className={cn("rounded-lg border border-line bg-surface", className)}
      {...props}
    >
      <div
        data-slot="form-panel-header"
        className="flex items-start justify-between gap-6 border-b border-line px-8 pt-[26px] pb-[22px]"
      >
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.1em] text-copper">
              {eyebrow}
            </p>
          )}
          <div className="font-display text-[21px] font-extrabold leading-[26px] tracking-[-0.01em] text-ink">
            {title}
          </div>
          {description && (
            <p className="text-[13px] leading-4 text-muted-foreground">{description}</p>
          )}
        </div>
        {meta && (
          <div
            data-slot="form-panel-meta"
            className="flex shrink-0 items-center gap-1.5 text-xs leading-4 text-muted-foreground [&_svg]:size-3.5"
          >
            {meta}
          </div>
        )}
      </div>
      <div data-slot="form-panel-body" className="px-8 pt-[26px] pb-[30px]">
        {children}
        {note && (
          <div data-slot="form-panel-note" className="mt-[22px]">
            {note}
          </div>
        )}
      </div>
    </section>
  )
}