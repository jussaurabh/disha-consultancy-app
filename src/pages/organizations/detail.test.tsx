import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { usersApi } from "@/api/users";
import OrganizationDetailPage from "./detail";

const authMock = vi.hoisted(() => ({
  hasPermission: vi.fn<(code: string) => boolean>(() => true),
}));

vi.mock("@/providers/use-auth", () => ({
  useAuth: () => ({ user: { email: "admin@dishatest.test" }, hasPermission: authMock.hasPermission }),
}));
vi.mock("@/api/orgs", () => ({
  orgsApi: { getOrg: vi.fn(), updateOrg: vi.fn() },
}));
vi.mock("@/api/users", () => ({
  usersApi: { listUsers: vi.fn() },
}));

export const orgFixture: Organization = {
  _id: "org-1",
  company_name: "Sri Venkateswara Textiles Pvt Ltd",
  cno: "CNO-2019-4471",
  state: "karnataka",
  status: "active",
  est_type: "Factory",
  unit_cont_name: "Unit 1 — Mysuru",
  company_view: "Main",
  rule_type: "Minimum wages",
};

export function renderDetailPage(initialEntry = "/organizations/org-1") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <LocationProbe />
          <Routes>
            <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

beforeEach(() => {
  vi.mocked(orgsApi.getOrg).mockResolvedValue({ data: orgFixture } as unknown as AxiosResponse<Organization>);
  vi.mocked(usersApi.listUsers).mockResolvedValue({
    data: { data: [], total: 12, page: 1, limit: 100, totalPages: 1 },
  } as unknown as Awaited<ReturnType<typeof usersApi.listUsers>>);
});

afterEach(() => {
  cleanup();
  authMock.hasPermission.mockReset();
  authMock.hasPermission.mockImplementation(() => true);
});

describe("OrganizationDetailPage — context strip", () => {
  it("renders the second header with breadcrumb, title, badge and actions", async () => {
    renderDetailPage();
    const strip = await screen.findByTestId("detail-context-strip");
    expect(within(strip).getByRole("link", { name: "Organizations" })).toHaveAttribute(
      "href",
      "/organizations",
    );
    expect(within(strip).getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument();
    expect(within(strip).getByText("Active")).toBeInTheDocument();
    expect(within(strip).getByRole("button", { name: "Edit organization" })).toBeInTheDocument();
    expect(within(strip).getByRole("button", { name: "More actions" })).toBeInTheDocument();
  });

  it("renders the avatar initial from the company name", async () => {
    const { container } = renderDetailPage();
    await screen.findByTestId("detail-context-strip");
    const title = container.querySelector('[data-slot="secondary-header-title"]')!;
    expect(title.firstElementChild).toHaveTextContent("S");
  });
});

describe("OrganizationDetailPage — tabs", () => {
  it("defaults to the Company tab on a clean URL", async () => {
    renderDetailPage();
    expect(await screen.findByRole("tab", { name: /company/i })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: /contact/i })).toHaveAttribute("data-state", "inactive");
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations/org-1");
  });

  it("renders every section tab with a count badge only on Users", async () => {
    renderDetailPage();
    for (const label of ["Company", "Contact", "Bank", "Payroll", "PF", "ESI", "Settings"]) {
      expect(await screen.findByRole("tab", { name: new RegExp(`^${label}$`, "i") })).toBeInTheDocument();
    }
    const usersTab = screen.getByRole("tab", { name: /users/i });
    expect(usersTab).toBeInTheDocument();
    await waitFor(() => expect(usersTab.querySelector('[data-slot="tab-switcher-badge"]')).toHaveTextContent("12"));
  });

  it("clicking a tab writes ?tab= and renders blank content", async () => {
    const user = userEvent.setup();
    renderDetailPage();
    await screen.findByRole("tab", { name: /company/i });
    await user.click(screen.getByRole("tab", { name: /contact/i }));
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations/org-1?tab=contact");
    expect(screen.getByRole("tab", { name: /contact/i })).toHaveAttribute("data-state", "active");
    expect(screen.queryByText("Company Details")).not.toBeInTheDocument();
    expect(screen.queryByText("Contact & Address")).not.toBeInTheDocument();
  });

  it("renders the tab from a deep link", async () => {
    renderDetailPage("/organizations/org-1?tab=bank");
    expect(await screen.findByRole("tab", { name: /bank/i })).toHaveAttribute("data-state", "active");
    expect(screen.queryByText("Company Details")).not.toBeInTheDocument();
  });

  it("falls back to the Company tab on unknown tab values without rewriting the URL", async () => {
    renderDetailPage("/organizations/org-1?tab=bogus");
    expect(await screen.findByRole("tab", { name: /company/i })).toHaveAttribute("data-state", "active");
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations/org-1?tab=bogus");
  });

  it("hides the Users tab without the list-users permission", async () => {
    authMock.hasPermission.mockImplementation((code: string) => code !== "org_user:list");
    renderDetailPage();
    await screen.findByRole("tab", { name: /company/i });
    expect(screen.queryByRole("tab", { name: /users/i })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /settings/i })).toBeInTheDocument();
  });
});
