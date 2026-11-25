export interface StepperStep {
  /** Step title, e.g. "Company" */
  title: string
  /** Muted second line, e.g. "Registration basics · 8 fields" */
  subtitle?: string
  /** Overrides the index-derived state — e.g. a failed or locked step. */
  state?: "error" | "locked"
}

export type StepperState = "completed" | "current" | "upcoming" | "error" | "locked"

/**
 * step.state ?? (index < current ? "completed" : index === current ? "current" : "upcoming")
 */
export function resolveStepState(
  step: StepperStep,
  index: number,
  current: number
): StepperState {
  if (step.state) return step.state
  if (index < current) return "completed"
  if (index === current) return "current"
  return "upcoming"
}