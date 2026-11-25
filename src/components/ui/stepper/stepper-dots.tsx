"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { resolveStepState, type StepperState, type StepperStep } from "./shared"

const dotClasses: Record<StepperState, string> = {
  completed: "size-2.5 bg-accent",
  current: "size-3 bg-accent ring-[3px] ring-accent-soft",
  upcoming: "size-2.5 border border-line bg-surface",
  error: "size-2.5 bg-danger ring-[3px] ring-danger/16 dark:ring-danger/28",
  locked: "size-2.5 border border-dashed border-line bg-surface opacity-55",
}

export interface StepperDotsProps extends React.ComponentProps<"div"> {
  steps: StepperStep[]
  current: number
  /** Caption under the rail, e.g. <>Step 3 of 6 · <span className="font-semibold text-ink">Bank details</span></> */
  caption?: React.ReactNode
}

export function StepperDots({
  steps,
  current,
  caption,
  className,
  ...props
}: StepperDotsProps) {
  return (
    <div
      data-slot="stepper-dots"
      className={cn("flex w-full flex-col gap-2.5", className)}
      {...props}
    >
      <div className="flex items-center">
        {steps.map((step, index) => {
          const state = resolveStepState(step, index, current)
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={index}>
              <span
                data-slot="stepper-dot"
                data-state={state}
                className={cn("rounded-full", dotClasses[state])}
              />
              {!isLast && (
                <span
                  data-slot="stepper-connector"
                  aria-hidden="true"
                  className={cn(
                    "h-[2px] min-w-4 flex-1 rounded-full",
                    index < current ? "bg-accent" : "bg-line"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
      {caption && (
        <p className="text-xs leading-4 text-muted-foreground">{caption}</p>
      )}
    </div>
  )
}