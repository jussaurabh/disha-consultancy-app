/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { InfoNote } from "./info-note"

afterEach(() => cleanup())

describe("InfoNote", () => {
  it("hint is the default: copper bar on surface", () => {
    const { container } = render(<InfoNote>Optional sections can be completed later.</InfoNote>)
    const cls = container.firstElementChild!.className
    expect(cls).toContain("border-l-2")
    expect(cls).toContain("border-copper")
    expect(cls).toContain("bg-surface")
    expect(cls).toContain("rounded-l-none")
  })

  it("confirm bar and title dye accent", () => {
    const { container, getByText } = render(<InfoNote variant="confirm" title="Verified">Checks pass.</InfoNote>)
    expect(container.firstElementChild!.className).toContain("border-accent")
    expect(getByText("Verified").className).toContain("text-accent")
  })

  it("caution bar and title dye danger", () => {
    const { container } = render(<InfoNote variant="caution" title="PAN mismatch">Rejected.</InfoNote>)
    expect(container.firstElementChild!.className).toContain("border-danger")
  })

  it("nested flips the fill to ground", () => {
    const { container } = render(<InfoNote nested>Inside a card.</InfoNote>)
    expect(container.firstElementChild!.className).toContain("bg-ground")
  })
})
