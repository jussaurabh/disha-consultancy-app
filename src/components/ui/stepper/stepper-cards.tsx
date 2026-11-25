"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { resolveStepState, type StepperState, type StepperStep } from "./shared"

const indicatorClasses: Record<StepperState, string> = {
  completed: "bg-accent font-bold text-primary-foreground",
  current: "bg-accent font-bold text-primary-foreground",
  upcoming: "border border-line bg-surface font-semibold text-muted-foreground",
  error: "bg-danger font-bold text-danger-foreground ring-[3px] ring-danger/16 dark:ring-danger/28",
  locked: "border border-dashed border-line bg-surface font-bold text-muted-foreground opacity-55",
}

const statusText: Record<StepperState, string> = {
  completed: "Done",
  current: "Current",
  upcoming: "Upcoming",
  error: "Failed",
  locked: "Locked",
}

const statusColor: Record<StepperState, string> = {
  completed: "text-muted-foreground",
  current: "text-accent",
  upcoming: "text-muted-foreground",
  error: "text-danger",
  locked: "text-muted-foreground",
}

export interface StepperCardsProps extends React.ComponentProps<"div"> {
  steps: StepperStep[]
  current: number
  /** When provided, cards render as buttons and call it with the index. Default: non-interactive. */
  onStepSelect?: (index: number) => void
}

export function StepperCards({
  steps,
  current,
  onStepSelect,
  className,
  ...props
}: StepperCardsProps) {
  const isInteractive = typeof onStepSelect === "function"

  return (
    <div
      data-slot="stepper-cards"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state = resolveStepState(step, index, current)
        const isCurrent = state === "current"
        const Comp = isInteractive ? "button" : "div"

        return (
          <Comp
            key={index}
            data-slot="stepper-card"
            data-state={state}
            type={isInteractive ? "button" : undefined}
            onClick={isInteractive ? () => onStepSelect!(index) : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-[10px] border px-3.5 py-3 text-left",
              isCurrent ? "border-accent bg-accent-soft" : "border-line",
              isInteractive && "cursor-pointer"
            )}
          >
            <span
              data-slot="stepper-indicator"
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full font-body",
                indicatorClasses[state]
              )}
            >
              {state === "completed" ? (
                <Check data-slot="stepper-check" className="size-3" aria-hidden="true" />
              ) : (
                String(index + 1)
              )}
            </span>
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              <span
                className={cn(
                  "block truncate text-[13px] font-semibold leading-4",
                  isCurrent ? "text-ink" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              {step.subtitle && (
                <span className="block truncate text-[11px] leading-[14px] text-muted-foreground">
                  {step.subtitle}
                </span>
              )}
            </div>
            <span
              data-slot="stepper-card-status"
              className={cn(
                "shrink-0 text-[10px] font-bold uppercase leading-3 tracking-[0.08em]",
                statusColor[state]
              )}
            >
              {statusText[state]}
            </span>
          </Comp>
        )
      })}
    </div>
  )
}