/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { KpiBar } from "./kpi-bar"

describe("KpiBar", () => {
  it("renders labels, values and deltas", () => {
    render(
      <KpiBar
        items={[
          { label: "Organizations", value: 24, delta: "+3 this month" },
          { label: "Users", value: 132 },
        ]}
      />,
    )
    expect(screen.getByText("Organizations")).toBeInTheDocument()
    expect(screen.getByText("24")).toBeInTheDocument()
    expect(screen.getByText("+3 this month")).toBeInTheDocument()
    expect(screen.getByText("132")).toBeInTheDocument()
  })

  it("colors deltas by tone: accent by default, muted when tone is muted", () => {
    render(
      <KpiBar
        items={[
          { label: "Organizations", value: 24, delta: "+3 this month" },
          { label: "Roles", value: 6, delta: "2 custom", tone: "muted" },
        ]}
      />,
    )
    expect(screen.getByText("+3 this month")).toHaveClass("text-primary")
    expect(screen.getByText("2 custom")).toHaveClass("text-muted-foreground")
  })

  it("renders a skeleton while loading", () => {
    const { container } = render(<KpiBar items={[{ label: "Roles", value: 6 }]} isLoading />)
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull()
  })

  it("applies the shared gutter with mx-4 md:mx-6", () => {
    const { container } = render(
      <KpiBar items={[{ label: "Roles", value: 6 }]} />,
    )
    const root = container.querySelector('[data-slot="kpi-bar"]')!
    expect(root).toHaveClass("mx-4", "md:mx-6")
  })
})