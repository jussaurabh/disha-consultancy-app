/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Badge, BadgeCount } from "./badge"

afterEach(() => cleanup())

describe("Badge", () => {
  it("default variant tints accent-soft with accent text", () => {
    const { container } = render(<Badge>Payroll</Badge>)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain("bg-accent-soft")
    expect(el.className).toContain("text-accent")
    expect(el.dataset.variant).toBe("default")
  })

  it("solid variant uses primary-foreground text", () => {
    const { container } = render(<Badge variant="solid">Approved</Badge>)
    expect((container.firstElementChild as HTMLElement).className).toContain("text-primary-foreground")
  })

  it("sm size drops to 18px with 10px type", () => {
    const { container } = render(<Badge size="sm">sm</Badge>)
    const cls = (container.firstElementChild as HTMLElement).className
    expect(cls).toContain("h-[18px]")
    expect(cls).toContain("text-[10px]")
  })

  it("dot prop renders a 6px status dot before the label", () => {
    const { container } = render(<Badge dot>Active</Badge>)
    expect(container.querySelector('[data-slot="badge-dot"]')).not.toBeNull()
  })

  it("BadgeCount renders the copper bubble", () => {
    const { container } = render(<BadgeCount>3</BadgeCount>)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain("bg-copper")
    expect(el.className).toContain("min-w-[18px]")
  })
})
