/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { FormPanel } from "./form-panel"

afterEach(() => cleanup())

describe("FormPanel", () => {
  it("renders section[data-slot=form-panel] with header and body", () => {
    const { container } = render(
      <FormPanel title="Test Title">
        <div>Body content</div>
      </FormPanel>
    )
    const section = container.querySelector('[data-slot="form-panel"]')
    expect(section).not.toBeNull()
    expect(section?.tagName).toBe("SECTION")
    expect(container.querySelector('[data-slot="form-panel-header"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="form-panel-body"]')).not.toBeNull()
  })

  it("with all props: shows eyebrow, title, description, meta, note, and children", () => {
    const { container } = render(
      <FormPanel
        eyebrow="Step 2 of 6 — Contact"
        title="Contact & address"
        description="Business contact details and registered address."
        meta={<span>Takes ~2 minutes</span>}
        note={<div>Note content</div>}
      >
        <div>Body content</div>
      </FormPanel>
    )
    // Check eyebrow
    expect(container.textContent).toContain("Step 2 of 6 — Contact")
    // Check title
    expect(container.textContent).toContain("Contact & address")
    // Check description
    expect(container.textContent).toContain("Business contact details and registered address.")
    // Check meta
    expect(container.querySelector('[data-slot="form-panel-meta"]')?.textContent).toContain("Takes ~2 minutes")
    // Check note
    expect(container.querySelector('[data-slot="form-panel-note"]')?.textContent).toContain("Note content")
    // Check body children
    expect(container.querySelector('[data-slot="form-panel-body"]')?.textContent).toContain("Body content")
  })

  it("title-only: no note, no meta, no empty p in header", () => {
    const { container } = render(<FormPanel title="Only Title" />)
    expect(container.querySelector('[data-slot="form-panel-note"]')).toBeNull()
    expect(container.querySelector('[data-slot="form-panel-meta"]')).toBeNull()
    const header = container.querySelector('[data-slot="form-panel-header"]')
    const paragraphs = header?.querySelectorAll("p")
    if (paragraphs) {
      Array.from(paragraphs).forEach((p) => {
        expect(p.textContent).toBeTruthy()
        expect(p.textContent?.length).toBeGreaterThan(0)
      })
    }
  })

  it("rendered HTML contains no style= and no hex color", () => {
    const { container } = render(
      <FormPanel
        eyebrow="Step 2 of 6 — Contact"
        title="Contact & address"
        description="Business contact details and registered address."
        meta={<span>Takes ~2 minutes</span>}
        note={<div>Note content</div>}
      >
        <div>Body content</div>
      </FormPanel>
    )
    const html = container.innerHTML
    expect(html).not.toContain("style=")
    expect(html).not.toMatch(/#[0-9a-f]{3}\b/i)
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i)
  })
})