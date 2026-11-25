/// <reference types="@testing-library/jest-dom" />
import { cleanup, fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Stepper } from "./stepper"
import { resolveStepState, type StepperStep } from "./shared"

afterEach(() => cleanup())

const STEPS: StepperStep[] = [
  { title: "Company", subtitle: "Registration basics · 8 fields" },
  { title: "Contact", subtitle: "Address & communication · 7 fields" },
  { title: "Bank", subtitle: "Salary disbursement · 4 fields" },
  { title: "Payroll", subtitle: "Tax, leave & overtime · 15 fields" },
  { title: "PF", subtitle: "Provident fund · 16 fields" },
  { title: "ESI", subtitle: "State insurance · 8 fields" },
]

describe("Stepper — vertical", () => {
  it("renders ol with list role and 6 listitems showing 1-based numbers", () => {
    const { container } = render(<Stepper steps={STEPS} current={0} />)
    const ol = container.querySelector('[data-slot="stepper"]') as HTMLElement
    expect(ol).not.toBeNull()
    expect(ol.dataset.orientation).toBe("vertical")
    expect(ol.tagName).toBe("OL")
    const items = ol.querySelectorAll('[data-slot="stepper-item"]')
    expect(items).toHaveLength(6)
    items.forEach((item, i) => {
      const indicator = item.querySelector('[data-slot="stepper-indicator"]')
      expect(indicator?.textContent).toBe(String(i + 1))
    })
  })

  it("current=0: first item current with aria-current and Current badge; rest upcoming", () => {
    const { container } = render(<Stepper steps={STEPS} current={0} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    const first = items[0] as HTMLElement
    expect(first.dataset.state).toBe("current")
    expect(first.getAttribute("aria-current")).toBe("step")
    expect(first.textContent).toContain("Current")
    for (let i = 1; i < 6; i++) {
      expect(items[i].dataset.state).toBe("upcoming")
    }
  })

  it("current=2: items 1-2 completed with check; item 3 current; 4-6 upcoming", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    expect(items[0].dataset.state).toBe("completed")
    expect(items[0].querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    expect(items[1].dataset.state).toBe("completed")
    expect(items[1].querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    expect(items[2].dataset.state).toBe("current")
    for (let i = 3; i < 6; i++) {
      expect(items[i].dataset.state).toBe("upcoming")
    }
  })

  it("current=6 (all complete): all items completed, no Current badge", () => {
    const { container } = render(<Stepper steps={STEPS} current={6} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    items.forEach((item) => {
      expect(item.dataset.state).toBe("completed")
      expect(item.querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    })
    expect(container.textContent).not.toContain("Current")
  })

  it("current=-1: all upcoming, no crash, no badge", () => {
    const { container } = render(<Stepper steps={STEPS} current={-1} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    items.forEach((item) => {
      expect(item.dataset.state).toBe("upcoming")
    })
    expect(container.textContent).not.toContain("Current")
  })

  it("error state: step 3 with state=error, current=2 — item data-state=error with danger classes and keeps number", () => {
    const stepsWithError: StepperStep[] = STEPS.map((s, i) =>
      i === 2 ? { ...s, state: "error" as const } : s
    )
    const { container } = render(<Stepper steps={stepsWithError} current={2} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    const errorItem = items[2] as HTMLElement
    expect(errorItem.dataset.state).toBe("error")
    const indicator = errorItem.querySelector('[data-slot="stepper-indicator"]') as HTMLElement
    expect(indicator.className).toContain("bg-danger")
    expect(indicator.className).toContain("ring-[3px]")
    expect(indicator.className).toContain("ring-danger/16")
    expect(indicator.className).toContain("dark:ring-danger/28")
    expect(indicator.textContent).toBe("3")
  })

  it("locked state: step 5 with state=locked — item data-state=locked with dashed border and opacity-55", () => {
    const stepsWithLocked: StepperStep[] = STEPS.map((s, i) =>
      i === 4 ? { ...s, state: "locked" as const } : s
    )
    const { container } = render(<Stepper steps={stepsWithLocked} current={2} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    const lockedItem = items[4] as HTMLElement
    expect(lockedItem.dataset.state).toBe("locked")
    const indicator = lockedItem.querySelector('[data-slot="stepper-indicator"]') as HTMLElement
    expect(indicator.className).toContain("border-dashed")
    expect(indicator.className).toContain("opacity-55")
    expect(indicator.textContent).toBe("5")
  })

  it("single step: no stepper-connector rendered", () => {
    const { container } = render(<Stepper steps={[{ title: "Only" }]} current={0} />)
    expect(container.querySelector('[data-slot="stepper-connector"]')).toBeNull()
  })

  it("step without subtitle renders no stepper-subtitle p", () => {
    const stepsNoSubtitle = [{ title: "Only" }]
    const { container } = render(<Stepper steps={stepsNoSubtitle} current={0} />)
    expect(container.querySelector('[data-slot="stepper-subtitle"]')).toBeNull()
  })

  it("long title (200 chars): grid-cols-[29px_1fr] preserved, text column has min-w-0", () => {
    const longTitle = "A".repeat(200)
    const { container } = render(
      <Stepper steps={[{ title: longTitle, subtitle: "Sub" }]} current={0} />
    )
    const item = container.querySelector('[data-slot="stepper-item"]') as HTMLElement
    expect(item.className).toContain("grid-cols-[29px_1fr]")
    const textCol = item.querySelector('[data-slot="stepper-item"] > div:last-child') as HTMLElement
    expect(textCol.className).toContain("min-w-0")
  })

  it("rendered HTML contains no hex color tokens", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} />)
    const html = container.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
  })

  it("onStepSelect: clicking item 3 calls spy with 2; without it no role=button", () => {
    const spy = vi.fn()
    const { container } = render(<Stepper steps={STEPS} current={0} onStepSelect={spy} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    fireEvent.click(items[2])
    expect(spy).toHaveBeenCalledWith(2)

    const { container: c2 } = render(<Stepper steps={STEPS} current={0} />)
    const items2 = c2.querySelectorAll('[data-slot="stepper-item"]')
    items2.forEach((item) => {
      expect(item.getAttribute("role")).not.toBe("button")
    })
  })
})

describe("resolveStepState", () => {
  it("index < current => completed", () => {
    expect(resolveStepState({ title: "A" }, 0, 2)).toBe("completed")
  })
  it("index === current => current", () => {
    expect(resolveStepState({ title: "A" }, 1, 1)).toBe("current")
  })
  it("index > current => upcoming", () => {
    expect(resolveStepState({ title: "A" }, 2, 1)).toBe("upcoming")
  })
  it("explicit state=error overrides", () => {
    expect(resolveStepState({ title: "A", state: "error" }, 0, 2)).toBe("error")
  })
  it("explicit state=locked overrides", () => {
    expect(resolveStepState({ title: "A", state: "locked" }, 0, 2)).toBe("locked")
  })
  it("current === steps.length (6) => all completed", () => {
    expect(resolveStepState({ title: "A" }, 0, 6)).toBe("completed")
    expect(resolveStepState({ title: "A" }, 5, 6)).toBe("completed")
  })
  it("current < 0 => all upcoming", () => {
    expect(resolveStepState({ title: "A" }, 0, -1)).toBe("upcoming")
    expect(resolveStepState({ title: "A" }, 5, -1)).toBe("upcoming")
  })
})