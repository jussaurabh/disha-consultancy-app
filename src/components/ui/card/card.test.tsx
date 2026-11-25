/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Card, CardFooter } from "./card"

afterEach(() => cleanup())

describe("Card", () => {
  it("shell uses field fill, line border, 14px radius, 20 padding", () => {
    const { container } = render(<Card data-testid="card">x</Card>)
    const cls = container.firstElementChild!.className
    expect(cls).toContain("bg-field")
    expect(cls).toContain("border-line")
    expect(cls).toContain("rounded-xl")
    expect(cls).toContain("p-5")
    expect(cls).not.toContain("ring-1")
  })

  it("footer rides a 1px top divider with no fill", () => {
    const { container } = render(
      <Card><CardFooter data-testid="footer">x</CardFooter></Card>,
    )
    const cls = container.querySelector('[data-slot="card-footer"]')!.className
    expect(cls).toContain("border-t")
    expect(cls).toContain("border-line")
    expect(cls).not.toContain("bg-muted")
  })

  it("selected prop takes the 1.5px accent ring + accent-soft tint", () => {
    const { container } = render(<Card selected>x</Card>)
    const cls = container.firstElementChild!.className
    expect(cls).toContain("border-accent")
    expect(cls).toContain("bg-accent-soft")
    expect(cls).toContain("[border-width:1.5px]")
  })
})
