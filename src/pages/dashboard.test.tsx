import { render, screen, waitFor, cleanup } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import DashboardPage from "./dashboard"
import { consultancyApi } from "@/api/consultancy"
import { orgsApi } from "@/api/orgs"

afterEach(() => {
  cleanup()
})

// Mock the consultancy API
vi.mock("@/api/consultancy", () => ({
  consultancyApi: {
    getStats: vi.fn(),
  },
}))

// Mock the orgs API
vi.mock("@/api/orgs", () => ({
  orgsApi: {
    listOrgs: vi.fn(),
  },
}))

// Mock useAuth - the mock is created inside vi.hoisted so the hoisted
// vi.mock factory can reference it before the module body runs
type AuthValue = {
  user: { email: string }
  hasPermission: (code: string) => boolean
}

const authMock = vi.hoisted(() =>
  vi.fn((): AuthValue => ({
    user: { email: "arjun@dishagroup.in" },
    hasPermission: (code: string) =>
      code === "org:list" || code === "consultancy_user:list" || code === "role:read",
  })),
)

vi.mock("@/providers/use-auth", () => ({
  useAuth: authMock,
}))

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

// Set up the auth mock return value before each test
beforeEach(() => {
  authMock.mockReturnValue({
    user: { email: "arjun@dishagroup.in" },
    hasPermission: (code: string) =>
      code === "org:list" || code === "consultancy_user:list" || code === "role:read",
  })
})

describe("DashboardPage", () => {
  it("renders stats and recent organizations", async () => {
    vi.mocked(consultancyApi.getStats).mockResolvedValue({ data: { orgs: 24, users: 132, roles: 6 } } as never)
    vi.mocked(orgsApi.listOrgs).mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            company_name: "Sri Venkateswara Textiles Pvt Ltd",
            state: "Karnataka",
            status: "active",
            created_at: "2026-11-12T00:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    } as never)
    renderPage()
    await waitFor(() => expect(screen.getByText("24")).toBeInTheDocument())
    expect(screen.getByText("132")).toBeInTheDocument()
    expect(screen.getByText("6")).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument())
  })

  it("falls back to a muted dot and the raw value for an unknown status", async () => {
    vi.mocked(consultancyApi.getStats).mockResolvedValue({ data: { orgs: 1, users: 1, roles: 1 } } as never)
    vi.mocked(orgsApi.listOrgs).mockResolvedValue({
      data: {
        data: [
          {
            _id: "2",
            company_name: "Brightline Logistics Pvt Ltd",
            state: "Gujarat",
            status: "pending",
            created_at: "2026-10-28T00:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    } as never)
    renderPage()
    await waitFor(() => expect(screen.getByText("pending")).toBeInTheDocument())
  })

  it("renders an em dash when stats fail", async () => {
    vi.mocked(consultancyApi.getStats).mockRejectedValue(new Error("boom"))
    vi.mocked(orgsApi.listOrgs).mockResolvedValue({
      data: {
        data: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
      },
    } as never)
    renderPage()
    await waitFor(() => expect(screen.getAllByText("—").length).toBe(3))
    expect(screen.getByText("No organizations yet")).toBeInTheDocument()
  })

  it("hides the recent organizations section without org:list permission", () => {
    authMock.mockReturnValue({
      user: { email: "x@y.z" },
      hasPermission: () => false,
    })
    vi.mocked(consultancyApi.getStats).mockResolvedValue({ data: { orgs: 1, users: 1, roles: 1 } } as never)
    renderPage()
    expect(screen.queryByText("Recently added")).not.toBeInTheDocument()
  })

  it("insets the content row with the shared gutter", async () => {
    vi.mocked(consultancyApi.getStats).mockResolvedValue({ data: { orgs: 24, users: 132, roles: 6 } } as never)
    vi.mocked(orgsApi.listOrgs).mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            company_name: "Sri Venkateswara Textiles Pvt Ltd",
            state: "Karnataka",
            status: "active",
            created_at: "2026-11-12T00:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    } as never)
    const { container } = renderPage()
    await waitFor(() => expect(screen.getByText("24")).toBeInTheDocument())
    const row = container.querySelector('[data-testid="dashboard-content-row"]')!
    expect(row).toHaveClass("px-4", "md:px-6")
  })
})