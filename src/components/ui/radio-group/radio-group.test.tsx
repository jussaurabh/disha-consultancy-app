/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { RadioOption } from "./radio-option"

afterEach(() => cleanup())

describe("RadioGroup", () => {
  it("renders 16px dots with a 1.5px ring", () => {
    const { getByRole } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    )
    expect(getByRole("radio").className).toContain("border-[1.5px]")
  })

  it("card variant marks the selected card with accent ring + accent-soft", () => {
    const { getByRole } = render(
      <RadioGroup defaultValue="a" variant="card">
        <RadioOption value="a" label="Monthly" description="12 runs a year." />
      </RadioGroup>,
    )
    const option = getByRole("radio").closest('[data-slot="radio-option"]') as HTMLElement
    expect(option.className).toContain("has-data-[state=checked]:border-accent")
    expect(option.className).toContain("has-data-[state=checked]:bg-accent-soft")
  })

  it("joined variant renders the divided bar container", () => {
    const { container } = render(
      <RadioGroup defaultValue="a" variant="joined">
        <RadioOption value="a" label="Monthly" />
      </RadioGroup>,
    )
    expect((container.firstElementChild as HTMLElement).className).toContain("divide-line")
  })

  it("sm size shrinks the dot", () => {
    const { getByRole } = render(
      <RadioGroup defaultValue="a" size="sm">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    )
    expect(getByRole("radio").className).toContain("size-3.5")
  })

  it("RadioOption renders description and error message", () => {
    const { getByText } = render(
      <RadioGroup defaultValue="a">
        <RadioOption
          value="a"
          label="Monthly"
          description="Payslips on the last working day."
          error="Pick one before running payroll."
        />
      </RadioGroup>,
    )
    expect(getByText("Payslips on the last working day.")).not.toBeNull()
    expect(getByText("Pick one before running payroll.").className).toContain("text-danger")
  })
})
