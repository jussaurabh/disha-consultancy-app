/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DataTable } from "./data-table"

type Org = { id: string; name: string; status: string }

const columns = [
  { key: "name", header: "Company", cell: (o: Org) => o.name },
  { key: "status", header: "Status", cell: (o: Org) => o.status },
]

const rows: Org[] = [
  { id: "1", name: "Sri Venkateswara Textiles Pvt Ltd", status: "active" },
  { id: "2", name: "Nagpur Steel Works Ltd", status: "inactive" },
]

describe("DataTable", () => {
  it("renders headers and one row per item", () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(o) => o.id} />)
    expect(screen.getByText("Company")).toBeInTheDocument()
    expect(screen.getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument()
    expect(screen.getByText("Nagpur Steel Works Ltd")).toBeInTheDocument()
  })

  it("calls onRowClick with the clicked row", () => {
    const onRowClick = vi.fn()
    render(
      <DataTable columns={columns} rows={rows} rowKey={(o) => o.id} onRowClick={onRowClick} />
    )
    // Click on the first company name text
    const companyName = screen.getByText("Sri Venkateswara Textiles Pvt Ltd")
    companyName.click()
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })

  it("renders the empty state when there are no rows", () => {
    render(
      <DataTable columns={columns} rows={[]} rowKey={(o) => o.id} emptyState={<p>No organizations yet</p>} />
    )
    expect(screen.getByText("No organizations yet")).toBeInTheDocument()
  })

  it("renders skeleton rows while loading", () => {
    const { container } = render(
      <DataTable columns={columns} rows={[]} rowKey={(o) => o.id} isLoading skeletonRows={3} />
    )
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
  })

  it("truncates long company names via the column class", () => {
    const { container } = render(
      <DataTable columns={[{ ...columns[0], className: "min-w-0 truncate" }]} rows={rows} rowKey={(o) => o.id} />
    )
    expect(container.querySelector(".truncate")).not.toBeNull()
  })
})