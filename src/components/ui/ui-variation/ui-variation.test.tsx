/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { UiVariation, UiVariationMeta } from "./ui-variation"

describe("UiVariation", () => {
  it("renders eyebrow, title and description in index variant", () => {
    render(
      <UiVariation
        variant="index"
        eyebrow="Client companies · 24 total"
        title="Organizations"
        description="All client companies"
      />,
    )
    expect(screen.getByText("Client companies · 24 total")).toBeInTheDocument()
    expect(screen.getByText("Organizations")).toBeInTheDocument()
    expect(screen.getByText("All client companies")).toBeInTheDocument()
  })

  it("uses the 46px display title in form variant and 52px otherwise", () => {
    const { container, rerender } = render(
      <UiVariation variant="form" eyebrow="Client companies — new record" title="Create organization" />,
    )
    expect(container.querySelector('[data-slot="ui-variation-title"]')).toHaveClass("text-[46px]")
    rerender(<UiVariation title="Different title" />)
    expect(container.querySelector('[data-slot="ui-variation-title"]')).toHaveClass("text-[52px]")
  })

  it("renders a plain-text actions node instead of buttons", () => {
    render(<UiVariation title="Employees" actions="Managed by settings" />)
    expect(screen.getByText("Managed by settings")).toBeInTheDocument()
  })

  it("renders UiVariationMeta label, value and suffix", () => {
    render(
      <UiVariation
        variant="greeting"
        title="Good morning, Arjun."
        actions={<UiVariationMeta label="Next payroll run" value="01 Dec" suffix="· 12 days" />}
      />,
    )
    expect(screen.getByText("Next payroll run")).toBeInTheDocument()
    expect(screen.getByText("01 Dec")).toBeInTheDocument()
    expect(screen.getByText("· 12 days")).toBeInTheDocument()
  })

  it("wraps long content instead of clipping it", () => {
    const { container } = render(
      <UiVariation title="A very long organization title that must wrap on narrow viewports instead of being clipped" />,
    )
    expect(container.querySelector('[data-slot="ui-variation"]')).toHaveClass("flex-wrap")
  })
})