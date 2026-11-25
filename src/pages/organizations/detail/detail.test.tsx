import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { usersApi } from "@/api/users";
import OrganizationDetailPage from "./index";

const authMock = vi.hoisted(() => ({
  hasPermission: vi.fn<(code: string) => boolean>(() => true),
}));

vi.mock("@/providers/use-auth", () => ({
  useAuth: () => ({ user: { email: "admin@dishatest.test" }, hasPermission: authMock.hasPermission }),
}));
vi.mock("@/api/orgs", () => ({
  orgsApi: { getOrg: vi.fn(), updateOrg: vi.fn(), deleteOrg: vi.fn() },
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

  it("opens the More actions menu and deletes the organization after confirm", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.deleteOrg).mockResolvedValue({ data: orgFixture } as unknown as AxiosResponse<Organization>);
    renderDetailPage();
    await screen.findByTestId("detail-context-strip");
    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete organization" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(orgsApi.deleteOrg).toHaveBeenCalledWith("org-1"));
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations");
  });

  it("renders no More actions button without the org:delete permission", async () => {
    authMock.hasPermission.mockImplementation((code: string) => code !== "org:delete");
    renderDetailPage();
    await screen.findByTestId("detail-context-strip");
    expect(screen.queryByRole("button", { name: "More actions" })).not.toBeInTheDocument();
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
    await waitFor(() => expect(usersTab.querySelector('[data-slot="tabs-count"]')).toHaveTextContent("12"));
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

describe("OrganizationDetailPage — company details", () => {
  it("renders the read-only detail rows from the org data", async () => {
    renderDetailPage();
    expect(await screen.findByText("Company Details")).toBeInTheDocument();
    const rows = screen.getAllByTestId("detail-row");
    expect(rows).toHaveLength(8);
    expect(within(rows[0]).getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument();
    expect(screen.getByText("CNO-2019-4471")).toBeInTheDocument();
    expect(screen.getByText("Karnataka")).toBeInTheDocument();
    expect(screen.getByText("Factory")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Unit 1 — Mysuru")).toBeInTheDocument();
    expect(screen.getByText("Minimum wages")).toBeInTheDocument();
  });

  it("renders the status pill and the stats rail tiles", async () => {
    renderDetailPage();
    await screen.findByText("Company Details");
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[3]).getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("EMPLOYEES")).toBeInTheDocument();
    expect(screen.getByText("PORTAL USERS")).toBeInTheDocument();
    expect(screen.getByText("NEXT PAYROLL")).toBeInTheDocument();
    const tileValues = screen.getAllByTestId("stats-tile-value");
    expect(tileValues[0]).toHaveTextContent("—");
    expect(tileValues[1]).toHaveTextContent("12");
    expect(tileValues[2]).toHaveTextContent("—");
  });

  it("opens edit mode from the band Edit button and reverts on Cancel", async () => {
    const user = userEvent.setup();
    renderDetailPage();
    await screen.findByText("Company Details");
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    const nameInput = screen.getByDisplayValue("Sri Venkateswara Textiles Pvt Ltd");
    await user.clear(nameInput);
    await user.type(nameInput, "Renamed Textiles");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[0]).getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update" })).not.toBeInTheDocument();
  });

  it("submits the edited values on Update and exits edit mode", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.updateOrg).mockResolvedValue({
      data: { ...orgFixture, company_name: "Renamed Textiles" },
    } as unknown as AxiosResponse<Organization>);
    const { queryClient } = renderDetailPage();
    vi.spyOn(queryClient, "setQueryData");
    await screen.findByText("Company Details");
    await user.click(screen.getByRole("button", { name: "Edit" }));
    const nameInput = screen.getByDisplayValue("Sri Venkateswara Textiles Pvt Ltd");
    await user.clear(nameInput);
    await user.type(nameInput, "Renamed Textiles");
    await user.click(screen.getByRole("button", { name: "Update" }));
    await waitFor(() => {
      const rows = screen.getAllByTestId("detail-row");
      expect(within(rows[0]).getByText("Renamed Textiles")).toBeInTheDocument();
    });
    expect(vi.mocked(queryClient.setQueryData)).toHaveBeenCalledWith(
      ["org", "org-1"],
      expect.objectContaining({ company_name: "Renamed Textiles" }),
    );
    expect(orgsApi.updateOrg).toHaveBeenCalledWith("org-1", expect.objectContaining({ company_name: "Renamed Textiles" }));
    expect(screen.queryByRole("button", { name: "Update" })).not.toBeInTheDocument();
  });

  it("opens edit mode from the strip Edit organization button", async () => {
    const user = userEvent.setup();
    renderDetailPage();
    await screen.findByText("Company Details");
    await user.click(screen.getByRole("button", { name: "Edit organization" }));
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("disables edit entry without the org:update permission", async () => {
    authMock.hasPermission.mockImplementation((code: string) => code !== "org:update");
    renderDetailPage();
    await screen.findByText("Company Details");
    expect(screen.getByRole("button", { name: "Edit organization" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled();
  });
});
