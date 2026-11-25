/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Sheet, SheetContent, SheetTitle } from "./sheet"

afterEach(() => cleanup())

describe("Sheet", () => {
  it("content edge uses the line token and field fill", () => {
    const { container } = render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Edit employee</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    // SheetContent renders in a portal on document.body, not in `container`.
    const cls = document.querySelector('[data-slot="sheet-content"]')!.className
    expect(cls).toContain("border-line")
    expect(cls).toContain("bg-field")
  })
})
