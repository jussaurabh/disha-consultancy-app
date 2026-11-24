/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table"

type Org = { id: string; name: string; city: string; status: string }

const columns = [
  { key: "name", header: "Company" },
  { key: "city", header: "City" },
  { key: "status", header: "Status" },
]

const rows: Org[] = [
  { id: "1", name: "Sri Venkateswara Textiles Pvt Ltd", city: "Mysuru", status: "Active" },
  { id: "2", name: "Nagpur Steel Works Ltd", city: "Nagpur", status: "Inactive" },
]

describe("Table", () => {
  it("renders table container with correct styling", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => <TableHead key={col.key}>{col.header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )

    const container = screen.getByTestId("table-container")
    expect(container).toHaveClass("rounded-xl")
    expect(container).toHaveClass("border-line")
    expect(container).toHaveClass("bg-surface")
  })

  it("renders headers and rows", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => <TableHead key={col.key}>{col.header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )

    expect(screen.getByText("Company")).toBeInTheDocument()
    expect(screen.getByText("City")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()
    expect(screen.getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument()
    expect(screen.getByText("Nagpur Steel Works Ltd")).toBeInTheDocument()
  })

  it("applies hover and selected states to rows", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => <TableHead key={col.key}>{col.header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>Selected Row</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Hover Row</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const selectedRow = screen.getByText("Selected Row").closest("tr")
    const hoverRow = screen.getByText("Hover Row").closest("tr")

    expect(selectedRow).toHaveAttribute("data-state", "selected")
    expect(hoverRow).not.toHaveAttribute("data-state")
  })

  it("renders header with surface/50 background and border", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const header = screen.getByText("Company").closest("thead")
    expect(header).toHaveClass("bg-surface/50")
  })

  it("renders cells with correct padding and height", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Test Company</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const cell = screen.getByText("Test Company").closest("td")
    expect(cell).toHaveClass("h-14")
    expect(cell).toHaveClass("px-3")
  })

  it("renders header cells with correct height and styling", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const head = screen.getByText("Company").closest("th")
    expect(head).toHaveClass("h-11")
    expect(head).toHaveClass("px-3")
    expect(head).toHaveClass("font-semibold")
    expect(head).toHaveClass("uppercase")
    expect(head).toHaveClass("tracking-wide")
    expect(head).toHaveClass("text-muted")
  })

  it("applies zero right padding when cell has checkbox", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><input type="checkbox" role="checkbox" /></TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell><input type="checkbox" role="checkbox" /></TableCell>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const checkboxCell = screen.getByRole("checkbox").closest("td")
    const checkboxHead = screen.getByRole("checkbox").closest("th")
    expect(checkboxCell).toHaveStyle({ paddingRight: "0px" })
    expect(checkboxHead).toHaveStyle({ paddingRight: "0px" })
  })

  it("forwards additional props to table element", () => {
    render(
      <Table data-testid="custom-table" className="custom-class">
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const table = screen.getByTestId("custom-table")
    expect(table).toHaveClass("custom-class")
  })
})