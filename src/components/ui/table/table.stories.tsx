import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./table"
import { Badge } from "../badge/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar"
import { Checkbox } from "../checkbox/checkbox"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../dropdown/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination/pagination"
import { MoreHorizontal, MapPin, Eye, Edit, Trash2, ChevronDown, Download, X } from "lucide-react"
import { EmptyState as EmptyStateComponent } from "../empty-state/empty-state"

/**
 * Table component stories
 *
 * A semantic HTML table component matching the Paper dc spec ("18 / Tables · Light"):
 * - Container: 14px radius (rounded-xl), border-line, bg-surface
 * - Header: solid bg-surface, 44px height (46px with checkbox), uppercase tracking-wide labels
 * - Rows: 56px height (60px with checkbox), border-line dividers, hover accent 5%, selected accent 7%
 * - Footer: bg-ground band — no divider line (Paper has none)
 * - Checkbox column: zero right padding, 18px checkbox (radius 5)
 *
 * Three variations from the design:
 * 1. Row actions — leading avatar, data columns, trailing action menu
 * 2. State and tags — leading checkbox, data columns, multi-badge tags, status badge
 * 3. Bulk and numbers — leading checkbox, avatar + name, numeric columns, action menu
 */

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic HTML table with styled header, body, footer, rows, and cells. Follows the Paper dc spec: 14px container radius, solid surface header, ground-tone footer band without a divider, row hover at accent 5% and selection at accent 7%. Composable with Badge, Avatar, Checkbox, DropdownMenu for rich cell content.",
      },
    },
  },
  argTypes: {},
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Shared test data
// ============================================================================

const companies = [
  {
    id: "1",
    initial: "S",
    name: "Sri Venkateswara Textiles Pvt Ltd",
    gstin: "GSTIN 29AAACT · since 2019",
    city: "Mysuru",
    users: 12,
    status: "Active",
    tags: ["Manufacturing", "Textiles", "Export"],
  },
  {
    id: "2",
    initial: "N",
    name: "Nagpur Steel Works Ltd",
    gstin: "GSTIN 27AABCS · since 2015",
    city: "Nagpur",
    users: 8,
    status: "Inactive",
    tags: ["Steel", "Manufacturing"],
  },
  {
    id: "3",
    initial: "K",
    name: "Kerala Spice Exports",
    gstin: "GSTIN 32AACCK · since 2020",
    city: "Kochi",
    users: 24,
    status: "Active",
    tags: ["Spices", "Export", "Food"],
  },
  {
    id: "4",
    initial: "G",
    name: "Gujarat Chemical Industries",
    gstin: "GSTIN 24AAACG · since 2018",
    city: "Ahmedabad",
    users: 15,
    status: "Pending",
    tags: ["Chemicals", "Industrial"],
  },
  {
    id: "5",
    initial: "T",
    name: "Tamil Nadu Auto Parts",
    gstin: "GSTIN 33AAACT · since 2017",
    city: "Chennai",
    users: 31,
    status: "Active",
    tags: ["Automotive", "Manufacturing", "OEM"],
  },
  {
    id: "6",
    initial: "P",
    name: "Punjab Agro Products Ltd",
    gstin: "GSTIN 03AAACP · since 2021",
    city: "Ludhiana",
    users: 7,
    status: "Inactive",
    tags: ["Agriculture", "Food Processing"],
  },
]

const employees = [
  {
    id: "1",
    initial: "R",
    name: "Rajesh Kumar",
    department: "Engineering",
    netPay: "₹84,500",
    status: "Paid",
  },
  {
    id: "2",
    initial: "P",
    name: "Priya Sharma",
    department: "Finance",
    netPay: "₹72,300",
    status: "Pending",
  },
  {
    id: "3",
    initial: "A",
    name: "Amit Patel",
    department: "Operations",
    netPay: "₹65,800",
    status: "Paid",
  },
  {
    id: "4",
    initial: "S",
    name: "Sneha Reddy",
    department: "HR",
    netPay: "₹58,200",
    status: "Failed",
  },
  {
    id: "5",
    initial: "V",
    name: "Vikram Singh",
    department: "Sales",
    netPay: "₹91,000",
    status: "Paid",
  },
]

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost"> = {
  Active: "default",
  Inactive: "secondary",
  Pending: "outline",
  Paid: "default",
  Failed: "destructive",
}

// ============================================================================
// Helper components for rich cells
// ============================================================================

function CompanyCell({ company }: { company: (typeof companies)[0] }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`} alt="" />
        <AvatarFallback>{company.initial}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-medium text-ink truncate">{company.name}</p>
        <p className="text-xs text-muted truncate">{company.gstin}</p>
      </div>
    </div>
  )
}

function EmployeeCell({ employee }: { employee: (typeof employees)[0] }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`} alt="" />
        <AvatarFallback>{employee.initial}</AvatarFallback>
      </Avatar>
      <p className="font-medium text-ink truncate">{employee.name}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variant = statusVariants[status] || "outline"
  return <Badge variant={variant} className="h-6 text-xs">{status}</Badge>
}

/** Paper "Var 02" tag pill — 22px, radius 6, ground-tone fill. */
function TagPills({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 2).map((tag) => (
        <span
          key={tag}
          className="inline-flex h-[22px] items-center rounded-md bg-ground px-[9px] text-[11px] text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

/** Paper "Var 02" member stack — 26px avatars, 2px surface ring, +N overflow. */
function MemberStack({ count, seed }: { count: number; seed: string }) {
  const shown = Math.min(3, Math.max(1, count))
  const extra = count - shown
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {Array.from({ length: shown }, (_, index) => (
          <Avatar key={index} className="size-[26px] ring-2 ring-surface">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${seed}-${index}`}
              alt=""
            />
            <AvatarFallback>{String.fromCharCode(65 + index)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      {extra > 0 ? <span className="ml-1.5 text-xs font-medium text-muted">+{extra}</span> : null}
    </div>
  )
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-ink transition-colors"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2">
          <Eye className="h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 data-[variant=destructive]:text-destructive" data-variant="destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ActionMenuEmployee() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-ink transition-colors"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2">
          <Eye className="h-4 w-4" />
          View payslip
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Edit className="h-4 w-4" />
          Edit employee
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 data-[variant=destructive]:text-destructive" data-variant="destructive">
          <Trash2 className="h-4 w-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Paper "Check 18" spec — 18px box, radius 5, checked = accent fill. */
function SelectCheckbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className="size-[18px] rounded-[5px] border-line bg-surface data-[state=checked]:border-accent data-[state=checked]:bg-accent"
    />
  )
}

// ============================================================================
// Variation 01 — Row actions
// Leading avatar + company, City, Users, Status badge, Action menu
// ============================================================================

export const VariationRowActions: Story = {
  render: () => (
    <div className="bg-ground p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72">Company</TableHead>
            <TableHead className="w-40">City</TableHead>
            <TableHead className="w-24 text-right">Users</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell><CompanyCell company={company} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  <span>{company.city}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
              <TableCell><StatusBadge status={company.status} /></TableCell>
              <TableCell className="text-right"><ActionMenu /></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right text-sm text-muted">
              Showing {companies.length} of {companies.length} organizations
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Variation 01 — Row actions**\n\nLeading avatar with company name and GSTIN, location with icon, user count, status badge, trailing action dropdown menu. Matches the Paper design spec for organization tables.",
      },
    },
  },
}

// ============================================================================
// Variation 02 — State and tags
// Members avatar stack, tag pills, status badge, rows-per-page + page squares
// ============================================================================

export const VariationStateAndTags: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(2)
    const totalPages = 8

    return (
      <div className="bg-ground p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-72">Company</TableHead>
              <TableHead className="w-40">Members</TableHead>
              <TableHead className="w-52">Tags</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="h-[60px]"><CompanyCell company={company} /></TableCell>
                <TableCell><MemberStack count={company.users} seed={company.name} /></TableCell>
                <TableCell><TagPills tags={company.tags} /></TableCell>
                <TableCell><StatusBadge status={company.status} /></TableCell>
                <TableCell className="text-right"><ActionMenu /></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="py-2">
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-muted-foreground">Rows per page</span>
                    <span className="inline-flex h-[30px] items-center gap-2 rounded-[8px] border border-line bg-surface pl-[11px] pr-[9px] text-xs text-ink">
                      10
                      <ChevronDown className="h-3.5 w-3.5 text-muted" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        aria-label={`Page ${page}`}
                        className={
                          page === currentPage
                            ? "flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[8px] bg-accent text-xs font-semibold text-primary-foreground"
                            : "flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[8px] text-xs font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink"
                        }
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Variation 02 — State and tags**\n\nMembers as an overlapping 26px avatar stack with a +N overflow, ground-tone tag pills (22px, radius 6), 24px status pill, and a pagination footer: rows-per-page select plus 30px page squares — the active page takes solid accent, inactive squares hover to accent-soft.",
      },
    },
  },
}

// ============================================================================
// Variation 03 — Bulk and numbers
// 18px checkboxes, selected rows at accent 7%, bulk footer with action chips
// ============================================================================

/** Paper "Var 03" — checkbox selection with a bulk-actions footer. */
function BulkSelectionTable() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["1", "3", "4"]))

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleAll = () => {
    if (selected.size === employees.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(employees.map((e) => e.id)))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-[46px] w-12">
            <SelectCheckbox checked={selected.size === employees.length && employees.length > 0} onChange={toggleAll} />
          </TableHead>
          <TableHead className="w-60">Employee</TableHead>
          <TableHead className="w-44">Department</TableHead>
          <TableHead className="w-36 text-right">Net pay</TableHead>
          <TableHead className="w-36">Status</TableHead>
          <TableHead className="w-12 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id} data-state={selected.has(employee.id) ? "selected" : undefined}>
            <TableCell className="h-[60px]">
              <SelectCheckbox checked={selected.has(employee.id)} onChange={(checked) => toggleSelect(employee.id)} />
            </TableCell>
            <TableCell><EmployeeCell employee={employee} /></TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell className="text-right font-mono text-sm tabular-nums">{employee.netPay}</TableCell>
            <TableCell><StatusBadge status={employee.status} /></TableCell>
            <TableCell className="text-right"><ActionMenuEmployee /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6} className="py-2">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                {selected.size > 0 ? (
                  <>
                    <span className="font-semibold text-ink">{selected.size}</span> of {employees.length} selected
                  </>
                ) : (
                  "Select employees for bulk actions"
                )}
              </p>
              <div className="flex items-center gap-2">
                {selected.size > 0 ? (
                  <>
                    <button
                      className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-accent-soft px-3 text-xs font-semibold text-ink transition-colors hover:bg-accent-soft/80"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </button>
                    <button
                      onClick={() => setSelected(new Set())}
                      className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] border border-line bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:border-line-strong"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear
                    </button>
                  </>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">Rows 1–{employees.length} of 240</p>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export const VariationBulkAndNumbers: Story = {
  render: () => (
    <div className="bg-ground p-8">
      <BulkSelectionTable />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Variation 03 — Bulk and numbers**\n\nThe Paper selection board: an 18px header checkbox (radius 5), selected rows tinted accent 7%, and a ground-tone bulk footer — 'N of 5 selected', an accent-soft Export chip and an outlined Clear chip (28px, radius 8), plus the rows range on the right.",
      },
    },
  },
}

/** Paper Var 03 on the nocturne palette — selection states mirror 1:1. */
export const SelectionDark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <BulkSelectionTable />
    </div>
  ),
  parameters: {
    globals: { theme: "dark" },
    docs: {
      description: {
        story: "Row selection in dark mode (mineral nocturne) — accent 7% selection and the ground bulk footer mirror the light register.",
      },
    },
  },
}

// ============================================================================
// Additional showcase stories
// ============================================================================

/** Empty state */
export const EmptyState: Story = {
  render: () => (
    <div className="bg-ground p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyStateComponent
                variant="no-data"
                title="No organizations yet"
                subTitle="Add your first organization to start running payroll."
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Empty state with the no-data illustration spanning all columns via EmptyState.",
      },
    },
  },
}

/** With caption */
export const WithCaption: Story = {
  render: () => (
    <div className="bg-ground p-8">
      <Table>
        <TableCaption>Organizations managed by your consultancy — updated daily</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72">Company</TableHead>
            <TableHead className="w-40">City</TableHead>
            <TableHead className="w-24 text-right">Users</TableHead>
            <TableHead className="w-40">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.slice(0, 3).map((company) => (
            <TableRow key={company.id}>
              <TableCell><CompanyCell company={company} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  <span>{company.city}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
              <TableCell><StatusBadge status={company.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Table with descriptive caption above the header.",
      },
    },
  },
}

// ============================================================================
// Variation 04 — With Pagination
// Table with pagination footer matching Paper design spec
// ============================================================================

/** Prevent the anchor default inside demos — navigation is out of scope here. */
function noop(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
}

/** A numbered run of pages between the chevrons. */
function NumberedPages({ current, last = 5 }: { current: number; last?: number }) {
  return (
    <>
      {Array.from({ length: last }, (_, index) => index + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink href="#" onClick={noop} isActive={page === current}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
    </>
  )
}

export const VariationWithPagination: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1)
    const totalPages = 12
    const itemsPerPage = 5
    const totalItems = totalPages * itemsPerPage

    const pages: (number | "ellipsis-start" | "ellipsis-end")[] =
      totalPages <= 7
        ? Array.from({ length: totalPages }, (_, index) => index + 1)
        : (() => {
            const run: (number | "ellipsis-start" | "ellipsis-end")[] = [1]
            if (currentPage > 3) run.push("ellipsis-start")
            for (
              let page = Math.max(2, currentPage - 1);
              page <= Math.min(totalPages - 1, currentPage + 1);
              page++
            ) {
              run.push(page)
            }
            if (currentPage < totalPages - 2) run.push("ellipsis-end")
            run.push(totalPages)
            return run
          })()

    const go = (page: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setCurrentPage(page)
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const paginatedCompanies = companies.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    return (
      <div className="bg-ground p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-72">Company</TableHead>
              <TableHead className="w-40">City</TableHead>
              <TableHead className="w-24 text-right">Users</TableHead>
              <TableHead className="w-40">Status</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell><CompanyCell company={company} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted" />
                    <span>{company.city}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
                <TableCell><StatusBadge status={company.status} /></TableCell>
                <TableCell className="text-right"><ActionMenu /></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="py-3">
                <div className="flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                  <p className="text-xs text-muted-foreground">
                    Showing {startItem}–{endItem} of {totalItems} organizations
                  </p>
                  <Pagination className="mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={go(Math.max(1, currentPage - 1))}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                      {pages.map((page, index) =>
                        page === "ellipsis-start" || page === "ellipsis-end" ? (
                          <PaginationItem key={`${page}-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink href="#" onClick={go(page)} isActive={page === currentPage}>
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={go(Math.min(totalPages, currentPage + 1))}
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Variation 04 — With Pagination**\n\nTable with pagination footer matching the Paper design spec. Includes page info text (Showing X–Y of Z), previous/next chevrons, numbered page links with ellipsis for large page counts, and active page highlighted with outline variant. The pagination uses the shared Pagination component built on the Button shell.",
      },
    },
  },
}

/** Dark theme */
export const Dark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72">Company</TableHead>
            <TableHead className="w-40">City</TableHead>
            <TableHead className="w-24 text-right">Users</TableHead>
            <TableHead className="w-40">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell><CompanyCell company={company} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  <span>{company.city}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
              <TableCell><StatusBadge status={company.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  parameters: {
    globals: { theme: "dark" },
    docs: {
      description: {
        story: "Table in dark mode (mineral nocturne palette).",
      },
    },
  },
}

/** Responsive / horizontal scroll demo */
export const Responsive: Story = {
  render: () => (
    <div className="bg-ground p-8">
      <div className="w-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Company</TableHead>
              <TableHead className="min-w-[140px]">City</TableHead>
              <TableHead className="min-w-[80px]" style={{ textAlign: "right" }}>Users</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Department</TableHead>
              <TableHead className="min-w-[120px]" style={{ textAlign: "right" }}>Revenue</TableHead>
              <TableHead className="min-w-[100px]">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, i) => (
              <TableRow key={company.id}>
                <TableCell><CompanyCell company={company} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted" />
                    <span>{company.city}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
                <TableCell><StatusBadge status={company.status} /></TableCell>
                <TableCell>{company.tags[0]}</TableCell>
                <TableCell className="text-right font-mono text-sm">₹{Math.floor(Math.random() * 500 + 100)}L</TableCell>
                <TableCell>
                  <a href="#" className="text-accent hover:underline text-sm">{company.name.split(" ")[0].toLowerCase()}@example.com</a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Table with many columns in a constrained width container. The table container has `overflow-hidden` but the inner table will scroll horizontally when content exceeds the viewport. Use `min-w-[...]` on headers for column width hints.",
      },
    },
  },
}

/** Interactive playground */
export const Playground: Story = {
  render: (args) => (
    <div className="bg-ground p-8">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>City</TableHead>
            <TableHead style={{ textAlign: "right" }}>Users</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.slice(0, 3).map((company) => (
            <TableRow key={company.id}>
              <TableCell><CompanyCell company={company} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  <span>{company.city}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
              <TableCell><StatusBadge status={company.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Interactive playground for testing table props.",
      },
    },
  },
}