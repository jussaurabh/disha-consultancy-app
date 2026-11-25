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

describe("Stepper — horizontal", () => {
  it("renders ol with data-orientation=horizontal and row layout", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} orientation="horizontal" />)
    const ol = container.querySelector('[data-slot="stepper"]') as HTMLElement
    expect(ol).not.toBeNull()
    expect(ol.dataset.orientation).toBe("horizontal")
    expect(ol.className).toContain("flex-row")
  })

  it("renders exactly steps.length - 1 connectors (2px segments, not spine)", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} orientation="horizontal" />)
    const connectors = container.querySelectorAll('[data-slot="stepper-connector"]')
    expect(connectors).toHaveLength(5)
    connectors.forEach((conn) => {
      expect(conn.className).toContain("h-[2px]")
      expect(conn.className).toContain("rounded-full")
    })
  })

  it("segments after completed steps have bg-accent; after current/upcoming have bg-line", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} orientation="horizontal" />)
    const connectors = container.querySelectorAll('[data-slot="stepper-connector"]')
    // Between items 0-1 (completed) and 1-2 (completed) => bg-accent
    expect((connectors[0] as HTMLElement).className).toContain("bg-accent")
    expect((connectors[1] as HTMLElement).className).toContain("bg-accent")
    // Between items 2-3 (current), 3-4 (upcoming), 4-5 (upcoming) => bg-line
    expect((connectors[2] as HTMLElement).className).toContain("bg-line")
    expect((connectors[3] as HTMLElement).className).toContain("bg-line")
    expect((connectors[4] as HTMLElement).className).toContain("bg-line")
  })

  it("labels sit below circles; current item shows title, subtitle, Current badge; current title text-accent", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} orientation="horizontal" />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    const currentItem = items[2] as HTMLElement
    // Title
    const title = currentItem.querySelector("span.text-\\[13px\\]")
    expect(title).not.toBeNull()
    expect(title?.className).toContain("text-accent")
    expect(title?.textContent).toBe("Bank")
    // Subtitle
    const subtitle = currentItem.querySelector("span.text-\\[11px\\]")
    expect(subtitle).not.toBeNull()
    expect(subtitle?.textContent).toBe("Salary disbursement · 4 fields")
    // Current badge
    expect(currentItem.textContent).toContain("Current")
    // Other items have text-ink titles
    const otherTitle = items[0].querySelector("span.text-\\[13px\\]") as HTMLElement
    expect(otherTitle.className).toContain("text-ink")
  })

  it("long title: label column has min-w-0 and item has w-[118px]", () => {
    const longTitle = "A".repeat(200)
    const { container } = render(
      <Stepper steps={[{ title: longTitle, subtitle: "Sub" }]} current={0} orientation="horizontal" />
    )
    const item = container.querySelector('[data-slot="stepper-item"]') as HTMLElement
    expect(item.className).toContain("w-[118px]")
    expect(item.className).toContain("min-w-0")
  })

  it("single step + horizontal: no connectors", () => {
    const { container } = render(<Stepper steps={[{ title: "Only" }]} current={0} orientation="horizontal" />)
    expect(container.querySelector('[data-slot="stepper-connector"]')).toBeNull()
  })

  it("error circle carries same state classes as vertical (bg-danger)", () => {
    const stepsWithError: StepperStep[] = STEPS.map((s, i) =>
      i === 2 ? { ...s, state: "error" as const } : s
    )
    const { container } = render(<Stepper steps={stepsWithError} current={2} orientation="horizontal" />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    const errorItem = items[2] as HTMLElement
    const indicator = errorItem.querySelector('[data-slot="stepper-indicator"]') as HTMLElement
    expect(indicator.className).toContain("bg-danger")
    expect(indicator.className).toContain("ring-[3px]")
    expect(indicator.className).toContain("ring-danger/16")
    expect(indicator.className).toContain("dark:ring-danger/28")
  })

  it("rendered HTML contains no hex color tokens", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} orientation="horizontal" />)
    const html = container.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
  })

  it("onStepSelect: clicking item 3 calls spy with 2", () => {
    const spy = vi.fn()
    const { container } = render(<Stepper steps={STEPS} current={0} orientation="horizontal" onStepSelect={spy} />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    fireEvent.click(items[2])
    expect(spy).toHaveBeenCalledWith(2)
  })
})

describe("Stepper — compact", () => {
  it("items are center-aligned rows with pt-1 pb-3.5 and gap-x-3", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    items.forEach((item) => {
      expect(item.className).toContain("items-center")
      expect(item.className).toContain("pt-1")
      expect(item.className).toContain("pb-3.5")
      expect(item.className).toContain("gap-x-3")
    })
  })

  it("circles are size-6 (24px) not size-[29px]", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    items.forEach((item) => {
      const indicator = item.querySelector('[data-slot="stepper-indicator"]')
      expect(indicator?.className).toContain("size-6")
      expect(indicator?.className).not.toContain("size-[29px]")
    })
  })

  it("subtitles are not rendered even when provided", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    expect(container.querySelector('[data-slot="stepper-subtitle"]')).toBeNull()
  })

  it("completed titles text-muted-foreground; current title text-ink; Current badge still shows", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    // Completed items (0, 1) should have text-muted-foreground titles
    const completedTitle0 = items[0].querySelector("span.text-sm") as HTMLElement
    const completedTitle1 = items[1].querySelector("span.text-sm") as HTMLElement
    expect(completedTitle0.className).toContain("text-muted-foreground")
    expect(completedTitle1.className).toContain("text-muted-foreground")
    // Current item (2) should have text-ink title
    const currentTitle = items[2].querySelector("span.text-sm") as HTMLElement
    expect(currentTitle.className).toContain("text-ink")
    // Current badge still shows
    expect(items[2].textContent).toContain("Current")
  })

  it("spine is at left-3 and bg-line", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    const spine = container.querySelector('[data-slot="stepper-connector"]') as HTMLElement
    expect(spine).not.toBeNull()
    expect(spine.className).toContain("left-3")
    expect(spine.className).toContain("bg-line")
  })

  it("completed circle shows check (size-3), current shows number", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    // Completed items show check
    const completedIndicator0 = items[0].querySelector('[data-slot="stepper-indicator"]')
    const completedIndicator1 = items[1].querySelector('[data-slot="stepper-indicator"]')
    expect(completedIndicator0?.querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    expect(completedIndicator1?.querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    // Current item shows number "3"
    const currentIndicator = items[2].querySelector('[data-slot="stepper-indicator"]')
    expect(currentIndicator?.textContent).toBe("3")
  })

  it("size=default rendering unchanged (vertical assertions still pass)", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="default" />)
    const ol = container.querySelector('[data-slot="stepper"]') as HTMLElement
    expect(ol.dataset.orientation).toBe("vertical")
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    expect(items).toHaveLength(6)
    expect(items[0].dataset.state).toBe("completed")
    expect(items[0].querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    expect(items[1].dataset.state).toBe("completed")
    expect(items[1].querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    expect(items[2].dataset.state).toBe("current")
    for (let i = 3; i < 6; i++) {
      expect(items[i].dataset.state).toBe("upcoming")
    }
  })

  it("rendered HTML contains no hex color tokens", () => {
    const { container } = render(<Stepper steps={STEPS} current={2} size="compact" />)
    const html = container.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
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