import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
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
          <Routes>
            <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}

beforeEach(() => {
  vi.mocked(orgsApi.getOrg).mockResolvedValue({ data: orgFixture } as unknown as AxiosResponse<Organization>);
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
