import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OrganizationsPage from "./index";

interface ListOrgsResponse {
  data: Array<{
    _id: string;
    company_name: string;
    cno: string;
    state: string;
    status: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const { listOrgsMock, listResponse } = vi.hoisted(() => {
  const listResponse: ListOrgsResponse = {
    data: [
      { _id: "1", company_name: "Sri Venkateswara Textiles", cno: "C001", state: "Karnataka", status: "active" },
      { _id: "2", company_name: "Nagpur Steel Works", cno: "C002", state: "Maharashtra", status: "inactive" },
    ],
    total: 24,
    page: 1,
    limit: 10,
    totalPages: 3,
  };
  return {
    listOrgsMock: vi.fn().mockResolvedValue(listResponse),
    listResponse,
  };
});

vi.mock("@/api/orgs", () => ({
  orgsApi: {
    listOrgs: listOrgsMock,
  },
}));

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderPage(initialEntry = "/organizations") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <LocationProbe />
        <Routes>
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/organizations/new" element={<div>new org page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  listOrgsMock.mockClear();
  listOrgsMock.mockResolvedValue(listResponse);
});

afterEach(() => {
  cleanup();
});

describe("OrganizationsPage", () => {
  it("renders the organizations variant by default with real counts", async () => {
    renderPage();
    expect(await screen.findByText("Client companies · 24 total")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
    expect(screen.getByText("Sri Venkateswara Textiles")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /all organizations/i })).toHaveAttribute("data-state", "active");
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations");
  });

  it("clicking Employees updates the URL and swaps the variant", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    await screen.findByText("Organizations");
    await user.click(screen.getByRole("tab", { name: /employees/i }));
    expect(await screen.findByText("People")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="ui-variation-title"]')).toHaveTextContent("Employees");
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations?tab=employees");
    expect(screen.queryByText("Sri Venkateswara Textiles")).not.toBeInTheDocument();
    expect(screen.getByText("No employees to show yet.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search employees…")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /employees/i }).querySelector('[data-slot="tab-switcher-badge"]'),
    ).toBeNull();
  });

  it("renders the employees variant on a deep link", async () => {
    const { container } = renderPage("/organizations?tab=employees");
    expect(await screen.findByText("People")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="ui-variation-title"]')).toHaveTextContent("Employees");
    expect(screen.queryByText("Sri Venkateswara Textiles")).not.toBeInTheDocument();
  });

  it("falls back to the organizations tab on unknown tab values without rewriting the URL", async () => {
    renderPage("/organizations?tab=payroll");
    expect(await screen.findByText("Organizations")).toBeInTheDocument();
    expect(await screen.findByText("Sri Venkateswara Textiles")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/organizations?tab=payroll");
  });

  it("links Create organization to the new-organization page", async () => {
    renderPage();
    const link = await screen.findByRole("link", { name: /create organization/i });
    expect(link).toHaveAttribute("href", "/organizations/new");
  });

  it("aligns the title zone with the shell padding", async () => {
    const { container } = renderPage();
    await screen.findByText("Organizations");
    expect(container.querySelector('[data-slot="ui-variation"]')).toHaveClass("px-0");
  });

  it("does not leak search text across tab switches", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    await screen.findByText("Organizations");
    await user.type(screen.getByPlaceholderText("Search companies…"), "sri");
    await user.click(screen.getByRole("tab", { name: /employees/i }));
    expect(container.querySelector('[data-slot="ui-variation-title"]')).toHaveTextContent("Employees");
    expect(screen.getByPlaceholderText("Search employees…")).toHaveValue("");
  });
});