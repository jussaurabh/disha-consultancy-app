"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { resolveStepState, type StepperState, type StepperStep } from "./shared"

const segmentClasses: Record<StepperState, string> = {
  completed: "bg-accent",
  current: "relative overflow-hidden bg-accent-soft",
  upcoming: "bg-line",
  error: "bg-danger",
  locked: "bg-line opacity-55",
}

export interface StepperProgressProps extends React.ComponentProps<"div"> {
  steps: StepperStep[]
  current: number
  /** 0–1 fill of the current segment. Default 0. Clamped. */
  progress?: number
}

export function StepperProgress({
  steps,
  current,
  progress = 0,
  className,
  ...props
}: StepperProgressProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress))

  return (
    <div
      data-slot="stepper-progress"
      className={cn("w-full", className)}
      {...props}
    >
      <div className="flex w-full gap-1.5">
        {steps.map((step, index) => {
          const state = resolveStepState(step, index, current)
          const isCurrent = state === "current"

          return (
            <span
              key={index}
              data-slot="stepper-segment"
              data-state={state}
              className={cn("h-1.5 flex-1 rounded-full", segmentClasses[state])}
            >
              {isCurrent && clampedProgress > 0 && (
                <span
                  data-slot="stepper-segment-fill"
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{ width: `${clampedProgress * 100}%` }}
                />
              )}
            </span>
          )
        })}
      </div>
      <div className="mt-2 flex w-full gap-1.5">
        {steps.map((step, index) => {
          const state = resolveStepState(step, index, current)
          const isCurrent = state === "current"

          return (
            <span
              key={index}
              className={cn(
                "flex-1 text-[10px] font-bold uppercase leading-3 tracking-[0.08em]",
                isCurrent ? "text-accent" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          )
        })}
      </div>
    </div>
  )
}