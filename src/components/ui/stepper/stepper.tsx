"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { resolveStepState, type StepperState, type StepperStep } from "./shared"

const indicatorClasses: Record<StepperState, string> = {
  completed: "bg-accent font-bold text-primary-foreground",
  current: "bg-accent font-bold text-primary-foreground",
  upcoming: "border border-line bg-surface font-semibold text-muted-foreground",
  error: "bg-danger font-bold text-danger-foreground ring-[3px] ring-danger/16 dark:ring-danger/28",
  locked: "border border-dashed border-line bg-surface font-bold text-muted-foreground opacity-55",
}

export interface StepperProps extends React.ComponentProps<"ol"> {
  steps: StepperStep[]
  /** Zero-based index of the active step. Indices < current render completed; current may equal steps.length (all complete). */
  current: number
  /** Layout direction. Default "vertical". */
  orientation?: "vertical" | "horizontal"
  /** Compact density: 24px circles, titles only (subtitles hidden), tighter rows. Vertical only. */
  size?: "default" | "compact"
  /** When provided, clicking an item calls it with the item index. Default: non-interactive. */
  onStepSelect?: (index: number) => void
}

export function Stepper({
  steps,
  current,
  orientation = "vertical",
  onStepSelect,
  className,
  ...props
}: StepperProps) {
  if (orientation === "horizontal") {
    return <StepperHorizontal steps={steps} current={current} onStepSelect={onStepSelect} className={className} {...props} />
  }

  return (
    <ol
      data-slot="stepper"
      data-orientation="vertical"
      className={cn("relative flex flex-col gap-[22px]", className)}
      {...props}
    >
      {steps.length > 1 && (
        <span
          data-slot="stepper-connector"
          aria-hidden="true"
          className="absolute left-[14px] top-[15px] bottom-[15px] w-px bg-line"
        />
      )}
      {steps.map((step, index) => {
        const state = resolveStepState(step, index, current)
        const isCurrent = state === "current"
        const isInteractive = typeof onStepSelect === "function"

        return (
          <li
            key={index}
            data-slot="stepper-item"
            data-state={state}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "grid grid-cols-[29px_1fr] items-start gap-x-4",
              isInteractive && "cursor-pointer"
            )}
            onClick={isInteractive ? () => onStepSelect!(index) : undefined}
          >
            <span
              data-slot="stepper-indicator"
              className={cn(
                "relative z-10 grid size-[29px] place-items-center rounded-full font-body text-xs leading-4",
                indicatorClasses[state]
              )}
            >
              {state === "completed" ? (
                <Check data-slot="stepper-check" className="size-3.5" aria-hidden="true" />
              ) : (
                String(index + 1)
              )}
            </span>
            <div className="flex min-w-0 flex-col gap-[3px] pt-0.5">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-sm leading-[18px]",
                    isCurrent
                      ? "font-semibold text-ink"
                      : "font-medium text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                {isCurrent && (
                  <Badge size="sm" shape="pill" className="uppercase tracking-[0.06em]">
                    Current
                  </Badge>
                )}
              </div>
              {step.subtitle && (
                <p
                  data-slot="stepper-subtitle"
                  className="text-xs leading-4 text-muted-foreground"
                >
                  {step.subtitle}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function StepperHorizontal({
  steps,
  current,
  onStepSelect,
  className,
  ...props
}: Omit<StepperProps, "orientation" | "size">) {
  return (
    <ol
      data-slot="stepper"
      data-orientation="horizontal"
      className={cn("flex flex-row items-start", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state = resolveStepState(step, index, current)
        const isCurrent = state === "current"
        const isInteractive = typeof onStepSelect === "function"
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            <li
              data-slot="stepper-item"
              data-state={state}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex w-[118px] min-w-0 flex-col items-start gap-[7px]",
                isInteractive && "cursor-pointer"
              )}
              onClick={isInteractive ? () => onStepSelect!(index) : undefined}
            >
              <span
                data-slot="stepper-indicator"
                className={cn(
                  "relative z-10 grid size-[29px] place-items-center rounded-full font-body text-xs leading-4",
                  indicatorClasses[state]
                )}
              >
                {state === "completed" ? (
                  <Check data-slot="stepper-check" className="size-3.5" aria-hidden="true" />
                ) : (
                  String(index + 1)
                )}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span
                  className={cn(
                    "text-[13px] font-semibold leading-4",
                    isCurrent ? "text-accent" : "text-ink"
                  )}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                  <span className="text-[11px] leading-[14px] text-muted-foreground">
                    {step.subtitle}
                  </span>
                )}
                {isCurrent && (
                  <Badge size="sm" shape="pill" className="uppercase tracking-[0.06em]">
                    Current
                  </Badge>
                )}
              </div>
            </li>
            {!isLast && (
              <span
                data-slot="stepper-connector"
                aria-hidden="true"
                className={cn(
                  "mt-[13px] h-[2px] min-w-4 flex-1 self-start rounded-full",
                  index < current ? "bg-accent" : "bg-line"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </ol>
  )
}