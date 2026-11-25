/// <reference types="@testing-library/jest-dom" />
import { cleanup, fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Stepper } from "./stepper"
import { StepperDots } from "./stepper-dots"
import { StepperProgress } from "./stepper-progress"
import { StepperCards } from "./stepper-cards"
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

describe("StepperDots", () => {
  it("root div[data-slot=stepper-dots] contains dot row and caption when provided", () => {
    const { container } = render(
      <StepperDots
        steps={STEPS}
        current={2}
        caption={<>Step 3 of 6 · <span>Bank details</span></>}
      />
    )
    const root = container.querySelector('[data-slot="stepper-dots"]')
    expect(root).not.toBeNull()
    expect(root?.querySelector('[data-slot="stepper-dot"]')).not.toBeNull()
    expect(root?.textContent).toContain("Step 3 of 6")
    expect(root?.textContent).toContain("Bank details")
  })

  it("exactly 6 dots and 5 connectors", () => {
    const { container } = render(<StepperDots steps={STEPS} current={2} />)
    const dots = container.querySelectorAll('[data-slot="stepper-dot"]')
    const connectors = container.querySelectorAll('[data-slot="stepper-connector"]')
    expect(dots).toHaveLength(6)
    expect(connectors).toHaveLength(5)
  })

  it("dot states: completed/upcoming size-2.5; current size-3 with ring-accent-soft", () => {
    const { container } = render(<StepperDots steps={STEPS} current={2} />)
    const dots = container.querySelectorAll('[data-slot="stepper-dot"]')
    // Completed dots (0, 1)
    expect((dots[0] as HTMLElement).className).toContain("size-2.5")
    expect((dots[0] as HTMLElement).className).toContain("bg-accent")
    expect((dots[1] as HTMLElement).className).toContain("size-2.5")
    expect((dots[1] as HTMLElement).className).toContain("bg-accent")
    // Current dot (2)
    expect((dots[2] as HTMLElement).className).toContain("size-3")
    expect((dots[2] as HTMLElement).className).toContain("bg-accent")
    expect((dots[2] as HTMLElement).className).toContain("ring-[3px]")
    expect((dots[2] as HTMLElement).className).toContain("ring-accent-soft")
    // Upcoming dots (3, 4, 5)
    for (let i = 3; i < 6; i++) {
      expect((dots[i] as HTMLElement).className).toContain("size-2.5")
      expect((dots[i] as HTMLElement).className).toContain("border-line")
      expect((dots[i] as HTMLElement).className).toContain("bg-surface")
    }
  })

  it("connectors after completed steps have bg-accent; rest bg-line; all h-[2px] rounded-full", () => {
    const { container } = render(<StepperDots steps={STEPS} current={2} />)
    const connectors = container.querySelectorAll('[data-slot="stepper-connector"]')
    // After completed steps (0-1, 1-2) => bg-accent
    expect((connectors[0] as HTMLElement).className).toContain("bg-accent")
    expect((connectors[1] as HTMLElement).className).toContain("bg-accent")
    // After current/upcoming (2-3, 3-4, 4-5) => bg-line
    for (let i = 2; i < 5; i++) {
      expect((connectors[i] as HTMLElement).className).toContain("bg-line")
    }
    connectors.forEach((conn) => {
      expect((conn as HTMLElement).className).toContain("h-[2px]")
      expect((conn as HTMLElement).className).toContain("rounded-full")
    })
  })

  it("without caption: no caption node", () => {
    const { container } = render(<StepperDots steps={STEPS} current={2} />)
    // The caption is a p with text-xs leading-4 text-muted-foreground
    const captions = container.querySelectorAll('p.text-xs.leading-4.text-muted-foreground')
    expect(captions.length).toBe(0)
  })

  it("current=6: all dots bg-accent, no halo", () => {
    const { container } = render(<StepperDots steps={STEPS} current={6} />)
    const dots = container.querySelectorAll('[data-slot="stepper-dot"]')
    dots.forEach((dot) => {
      expect((dot as HTMLElement).className).toContain("bg-accent")
      expect((dot as HTMLElement).className).not.toContain("ring-accent-soft")
    })
  })

  it("error dot: bg-danger with ring", () => {
    const stepsWithError: StepperStep[] = STEPS.map((s, i) =>
      i === 2 ? { ...s, state: "error" as const } : s
    )
    const { container } = render(<StepperDots steps={stepsWithError} current={2} />)
    const dots = container.querySelectorAll('[data-slot="stepper-dot"]')
    const errorDot = dots[2] as HTMLElement
    expect(errorDot.className).toContain("bg-danger")
    expect(errorDot.className).toContain("ring-[3px]")
    expect(errorDot.className).toContain("ring-danger/16")
    expect(errorDot.className).toContain("dark:ring-danger/28")
  })

  it("locked dot: border-dashed opacity-55", () => {
    const stepsWithLocked: StepperStep[] = STEPS.map((s, i) =>
      i === 4 ? { ...s, state: "locked" as const } : s
    )
    const { container } = render(<StepperDots steps={stepsWithLocked} current={2} />)
    const dots = container.querySelectorAll('[data-slot="stepper-dot"]')
    const lockedDot = dots[4] as HTMLElement
    expect(lockedDot.className).toContain("border-dashed")
    expect(lockedDot.className).toContain("opacity-55")
  })

  it("rendered HTML contains no hex and no style=", () => {
    const { container } = render(<StepperDots steps={STEPS} current={2} />)
    const html = container.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
    expect(html).not.toContain("style=")
  })
})

describe("StepperProgress", () => {
  it("root div[data-slot=stepper-progress] with 6 segments, no connectors", () => {
    const { container } = render(<StepperProgress steps={STEPS} current={2} progress={0.45} />)
    const root = container.querySelector('[data-slot="stepper-progress"]')
    expect(root).not.toBeNull()
    const segments = container.querySelectorAll('[data-slot="stepper-segment"]')
    expect(segments).toHaveLength(6)
    expect(container.querySelector('[data-slot="stepper-connector"]')).toBeNull()
  })

  it("completed segments bg-accent; upcoming bg-line; current bg-accent-soft with fill width 45%", () => {
    const { container } = render(<StepperProgress steps={STEPS} current={2} progress={0.45} />)
    const segments = container.querySelectorAll('[data-slot="stepper-segment"]')
    // Completed segments (0, 1)
    expect((segments[0] as HTMLElement).className).toContain("bg-accent")
    expect((segments[1] as HTMLElement).className).toContain("bg-accent")
    // Current segment (2)
    expect((segments[2] as HTMLElement).className).toContain("bg-accent-soft")
    const fill = segments[2].querySelector('[data-slot="stepper-segment-fill"]')
    expect(fill).not.toBeNull()
    expect((fill as HTMLElement).style.width).toBe("45%")
    expect((fill as HTMLElement).className).toContain("bg-accent")
    // Upcoming segments (3, 4, 5)
    for (let i = 3; i < 6; i++) {
      expect((segments[i] as HTMLElement).className).toContain("bg-line")
    }
  })

  it("progress clamps: progress=2 => width 100%; omitted => no fill element", () => {
    const { container: c1 } = render(<StepperProgress steps={STEPS} current={2} progress={2} />)
    const fill1 = c1.querySelector('[data-slot="stepper-segment-fill"]')
    expect((fill1 as HTMLElement).style.width).toBe("100%")

    const { container: c2 } = render(<StepperProgress steps={STEPS} current={2} />)
    const fill2 = c2.querySelector('[data-slot="stepper-segment-fill"]')
    expect(fill2).toBeNull()
  })

  it("labels row: 6 labels flex-1 text-[10px] font-bold uppercase; current text-accent", () => {
    const { container } = render(<StepperProgress steps={STEPS} current={2} progress={0.45} />)
    const labels = container.querySelectorAll('[data-slot="stepper-progress"] > div:last-child > span')
    expect(labels).toHaveLength(6)
    labels.forEach((label, i) => {
      const cls = (label as HTMLElement).className
      expect(cls).toContain("flex-1")
      expect(cls).toContain("text-[10px]")
      expect(cls).toContain("font-bold")
      expect(cls).toContain("uppercase")
      expect(cls).toContain("leading-3")
      expect(cls).toContain("tracking-[0.08em]")
      if (i === 2) {
        expect(cls).toContain("text-accent")
      } else {
        expect(cls).toContain("text-muted-foreground")
      }
      expect(label.textContent).toBe(STEPS[i].title)
    })
  })

  it("segments h-1.5 rounded-full; segments and labels rows share gap-1.5", () => {
    const { container } = render(<StepperProgress steps={STEPS} current={2} progress={0.45} />)
    const segments = container.querySelectorAll('[data-slot="stepper-segment"]')
    const segmentRow = container.querySelector('[data-slot="stepper-progress"] > div:first-child') as HTMLElement
    const labelsRow = container.querySelector('[data-slot="stepper-progress"] > div:last-child') as HTMLElement
    segments.forEach((seg) => {
      expect((seg as HTMLElement).className).toContain("h-1.5")
      expect((seg as HTMLElement).className).toContain("rounded-full")
    })
    expect(segmentRow.className).toContain("gap-1.5")
    expect(labelsRow.className).toContain("gap-1.5")
  })

  it("rendered HTML contains no hex", () => {
    const { container } = render(<StepperProgress steps={STEPS} current={2} progress={0.45} />)
    const html = container.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
  })
})

describe("StepperCards", () => {
  it("root div[data-slot=stepper-cards] with 6 cards each carrying data-state", () => {
    const { container } = render(<StepperCards steps={STEPS} current={1} />)
    const root = container.querySelector('[data-slot="stepper-cards"]')
    expect(root).not.toBeNull()
    const cards = container.querySelectorAll('[data-slot="stepper-card"]')
    expect(cards).toHaveLength(6)
    cards.forEach((card) => {
      expect(card.dataset.state).toBeDefined()
    })
  })

  it("current card bg-accent-soft border-accent; others border-line no bg", () => {
    const { container } = render(<StepperCards steps={STEPS} current={1} />)
    const cards = container.querySelectorAll('[data-slot="stepper-card"]')
    const currentCard = cards[1] as HTMLElement
    expect(currentCard.className).toContain("bg-accent-soft")
    expect(currentCard.className).toContain("border-accent")
    // Other cards should have border-line but no bg-accent-soft
    const otherCard = cards[0] as HTMLElement
    expect(otherCard.className).toContain("border-line")
    expect(otherCard.className).not.toContain("bg-accent-soft")
  })

  it("circles size-6: completed/current bg-accent; completed shows check size-3; current shows number; upcoming border border-line bg-surface", () => {
    const { container } = render(<StepperCards steps={STEPS} current={1} />)
    const cards = container.querySelectorAll('[data-slot="stepper-card"]')
    // Completed card (0)
    const completedIndicator = cards[0].querySelector('[data-slot="stepper-indicator"]') as HTMLElement
    expect(completedIndicator.className).toContain("size-6")
    expect(completedIndicator.className).toContain("bg-accent")
    expect(completedIndicator.querySelector('[data-slot="stepper-check"]')).not.toBeNull()
    // Current card (1)
    const currentIndicator = cards[1].querySelector('[data-slot="stepper-indicator"]') as HTMLElement
    expect(currentIndicator.className).toContain("size-6")
    expect(currentIndicator.className).toContain("bg-accent")
    expect(currentIndicator.textContent).toBe("2")
    // Upcoming card (2)
    const upcomingIndicator = cards[2].querySelector('[data-slot="stepper-indicator"]') as HTMLElement
    expect(upcomingIndicator.className).toContain("size-6")
    expect(upcomingIndicator.className).toContain("border-line")
    expect(upcomingIndicator.className).toContain("bg-surface")
  })

  it("card text: title text-[13px] font-semibold leading-4; current text-ink, others text-muted-foreground; subtitle text-[11px] leading-[14px] text-muted-foreground", () => {
    const { container } = render(<StepperCards steps={STEPS} current={1} />)
    const cards = container.querySelectorAll('[data-slot="stepper-card"]')
    // Current card title
    const currentTitle = cards[1].querySelector('span.text-\\[13px\\]') as HTMLElement
    expect(currentTitle.className).toContain("text-[13px]")
    expect(currentTitle.className).toContain("font-semibold")
    expect(currentTitle.className).toContain("leading-4")
    expect(currentTitle.className).toContain("text-ink")
    // Other card title
    const otherTitle = cards[0].querySelector('span.text-\\[13px\\]') as HTMLElement
    expect(otherTitle.className).toContain("text-muted-foreground")
    // Subtitle
    const subtitle = cards[1].querySelector('span.text-\\[11px\\]') as HTMLElement
    expect(subtitle.className).toContain("text-[11px]")
    expect(subtitle.className).toContain("leading-[14px]")
    expect(subtitle.className).toContain("text-muted-foreground")
  })

  it("status word on right: Done/Current/Upcoming by state; text-[10px] font-bold uppercase; current text-accent", () => {
    const { container } = render(<StepperCards steps={STEPS} current={1} />)
    const statuses = container.querySelectorAll('[data-slot="stepper-card-status"]')
    expect(statuses).toHaveLength(6)
    // Completed card status
    expect(statuses[0].textContent).toBe("Done")
    expect((statuses[0] as HTMLElement).className).toContain("text-muted-foreground")
    // Current card status
    expect(statuses[1].textContent).toBe("Current")
    expect((statuses[1] as HTMLElement).className).toContain("text-accent")
    // Upcoming card status
    expect(statuses[2].textContent).toBe("Upcoming")
    expect((statuses[2] as HTMLElement).className).toContain("text-muted-foreground")
    // Check status classes
    statuses.forEach((status) => {
      const cls = (status as HTMLElement).className
      expect(cls).toContain("text-[10px]")
      expect(cls).toContain("font-bold")
      expect(cls).toContain("uppercase")
      expect(cls).toContain("leading-3")
      expect(cls).toContain("tracking-[0.08em]")
    })
  })

  it("with onStepSelect: cards are buttons; clicking card 3 calls spy with 2; without: cards are divs", () => {
    const spy = vi.fn()
    const { container: c1 } = render(<StepperCards steps={STEPS} current={1} onStepSelect={spy} />)
    const cards1 = c1.querySelectorAll('[data-slot="stepper-card"]')
    expect(cards1[0].tagName).toBe("BUTTON")
    fireEvent.click(cards1[2])
    expect(spy).toHaveBeenCalledWith(2)

    const { container: c2 } = render(<StepperCards steps={STEPS} current={1} />)
    const cards2 = c2.querySelectorAll('[data-slot="stepper-card"]')
    expect(cards2[0].tagName).toBe("DIV")
  })

  it("long title: card text wrapper has min-w-0 and flex-1", () => {
    const longTitle = "A".repeat(200)
    const { container } = render(<StepperCards steps={[{ title: longTitle, subtitle: "Sub" }]} current={0} />)
    const cards = container.querySelectorAll('[data-slot="stepper-card"]')
    const textWrapper = cards[0].querySelector('div.min-w-0.flex-1') as HTMLElement
    expect(textWrapper).not.toBeNull()
    expect(textWrapper.className).toContain("min-w-0")
    expect(textWrapper.className).toContain("flex-1")
  })

  it("error card: status Failed with text-danger; locked card: status Locked", () => {
    const stepsWithError: StepperStep[] = STEPS.map((s, i) =>
      i === 2 ? { ...s, state: "error" as const } : s
    )
    const { container: c1 } = render(<StepperCards steps={stepsWithError} current={1} />)
    const statuses1 = c1.querySelectorAll('[data-slot="stepper-card-status"]')
    expect(statuses1[2].textContent).toBe("Failed")
    expect((statuses1[2] as HTMLElement).className).toContain("text-danger")

    const stepsWithLocked: StepperStep[] = STEPS.map((s, i) =>
      i === 4 ? { ...s, state: "locked" as const } : s
    )
    const { container: c2 } = render(<StepperCards steps={stepsWithLocked} current={1} />)
    const statuses2 = c2.querySelectorAll('[data-slot="stepper-card-status"]')
    expect(statuses2[4].textContent).toBe("Locked")
  })

  it("rendered HTML contains no hex and no style=", () => {
    const { container } = render(<StepperCards steps={STEPS} current={1} />)
    const html = container.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
    expect(html).not.toContain("style=")
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