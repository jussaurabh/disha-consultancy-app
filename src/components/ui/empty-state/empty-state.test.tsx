/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { EmptyState } from "./empty-state"

afterEach(() => cleanup())

describe("EmptyState", () => {
  it("no-data renders the first-run illustration", () => {
    const { container } = render(<EmptyState variant="no-data" title="No organizations yet" />)
    expect(container.querySelector('[data-illustration="first-run"]')).not.toBeNull()
  })

  it("empty renders the search illustration", () => {
    const { container } = render(<EmptyState variant="empty" title="No organizations match" />)
    expect(container.querySelector('[data-illustration="search"]')).not.toBeNull()
  })

  it("renders title, subTitle, helperText and actions", () => {
    const { getByText } = render(
      <EmptyState
        variant="empty"
        title="No organizations match"
        subTitle="Nothing in 24 organizations matches “nagp”."
        helperText='or try “textiles”'
        actions={<button>Clear search &amp; filters</button>}
      />,
    )
    expect(getByText("No organizations match")).not.toBeNull()
    expect(getByText(/Nothing in 24/)).not.toBeNull()
    expect(getByText(/or try/)).not.toBeNull()
    expect(getByText("Clear search & filters")).not.toBeNull()
  })

  it("with neither state it renders a readable text-only block", () => {
    const { container, getByText } = render(<EmptyState title="Nothing here" />)
    expect(container.querySelector("[data-illustration]")).toBeNull()
    expect(getByText("Nothing here")).not.toBeNull()
    expect(container.firstElementChild!.className).toContain("text-center")
  })

  it("maps the deprecated booleans onto variant", () => {
    const { container } = render(<EmptyState noDataState title="t" />)
    expect(container.querySelector('[data-illustration="first-run"]')).not.toBeNull()
  })
})
