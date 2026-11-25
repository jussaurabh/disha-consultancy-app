/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, fireEvent } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
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
    expect(container.textContent).toContain("Step 2 of 6 — Contact")
    expect(container.textContent).toContain("Contact & address")
    expect(container.textContent).toContain("Business contact details and registered address.")
    expect(container.querySelector('[data-slot="form-panel-meta"]')?.textContent).toContain("Takes ~2 minutes")
    expect(container.querySelector('[data-slot="form-panel-note"]')?.textContent).toContain("Note content")
    expect(container.querySelector('[data-slot="form-panel-body"]')?.textContent).toContain("Body content")
  })

  it("note has mt-6 spacing above it", () => {
    const { container } = render(
      <FormPanel title="Test" note={<div>Note</div>}>
        <div>Body</div>
      </FormPanel>
    )
    const note = container.querySelector('[data-slot="form-panel-note"]')
    expect(note).not.toBeNull()
    expect(note?.className).toContain("mt-6")
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

describe("FormPanel.Section", () => {
  it("renders title as copper uppercase label", () => {
    const { container } = render(
      <FormPanel.Section title="COMMUNICATION">
        <div>Content</div>
      </FormPanel.Section>
    )
    const title = container.querySelector("p")
    expect(title).not.toBeNull()
    expect(title?.textContent).toBe("COMMUNICATION")
    expect(title?.className).toContain("text-copper")
    expect(title?.className).toContain("uppercase")
    expect(title?.className).toContain("font-semibold")
  })

  it("vertical layout (default): stacks children vertically", () => {
    const { container } = render(
      <FormPanel.Section title="TEST">
        <div className="h-10 bg-accent">Field 1</div>
        <div className="h-10 bg-copper">Field 2</div>
      </FormPanel.Section>
    )
    const fields = container.querySelectorAll("div > div[class*='h-10']")
    expect(fields).toHaveLength(2)
  })

  it("horizontal layout: fields side by side on md", () => {
    const { container } = render(
      <FormPanel.Section title="TEST" layout="horizontal">
        <FormPanel.Field label="Field 1" placeholder="Value 1" />
        <FormPanel.Field label="Field 2" placeholder="Value 2" />
        <FormPanel.Field label="Field 3" placeholder="Value 3" />
      </FormPanel.Section>
    )
    const fields = container.querySelectorAll('[data-slot="form-panel-field"]')
    expect(fields).toHaveLength(3)
    // Check horizontal layout classes on parent
    const section = container.querySelector('[data-slot="form-panel-section"]') as HTMLElement
    expect(section).not.toBeNull()
    expect(section?.className).toContain("md:flex-row")
  })
})

describe("FormPanel.Separator", () => {
  it("renders hr with border-line class", () => {
    const { container } = render(<FormPanel.Separator />)
    const hr = container.querySelector("hr")
    expect(hr).not.toBeNull()
    expect(hr?.className).toContain("border-line")
  })
})

describe("FormPanel.Field", () => {
  it("renders label and input with data-slot", () => {
    const { container } = render(<FormPanel.Field label="Email" placeholder="name@company.com" />)
    expect(container.textContent).toContain("Email")
    const input = container.querySelector('[data-slot="form-panel-field"]')
    expect(input).not.toBeNull()
    expect(input?.getAttribute("placeholder")).toBe("name@company.com")
  })

  it("forwards ref for react-hook-form", () => {
    const ref = vi.fn()
    render(<FormPanel.Field label="Test" ref={ref} />)
    expect(ref).toHaveBeenCalled()
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement)
  })

  it("accepts all input props (onChange, value, etc.) for react-hook-form", () => {
    const onChange = vi.fn()
    const { container } = render(
      <FormPanel.Field label="Test" value="hello" onChange={onChange} />
    )
    const input = container.querySelector('[data-slot="form-panel-field"]') as HTMLInputElement
    expect(input.value).toBe("hello")
    fireEvent.change(input, { target: { value: "world" } })
    expect(onChange).toHaveBeenCalled()
  })

  it("applies custom className", () => {
    const { container } = render(<FormPanel.Field label="Test" className="custom-class" />)
    const input = container.querySelector('[data-slot="form-panel-field"]')
    expect(input?.className).toContain("custom-class")
  })
})

describe("FormPanel.Field.Row", () => {
  it("renders flex flex-wrap gap-4 container", () => {
    const { container } = render(
      <FormPanel.Field.Row>
        <FormPanel.Field label="Field 1" placeholder="Value 1" />
        <FormPanel.Field label="Field 2" placeholder="Value 2" />
      </FormPanel.Field.Row>
    )
    const row = container.querySelector("div.flex.flex-wrap.gap-4")
    expect(row).not.toBeNull()
    const fields = container.querySelectorAll('[data-slot="form-panel-field"]')
    expect(fields).toHaveLength(2)
  })
})