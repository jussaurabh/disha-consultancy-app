import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { PfSection } from "./pf-section";

vi.mock("@/api/orgs", () => ({
  orgsApi: { updateOrg: vi.fn() },
}));

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const org: Organization = {
  _id: "org-1",
  company_name: "Sri Venkateswara Textiles Pvt Ltd",
  cno: "CNO-2019-4471",
  state: "karnataka",
  pf_no: "KRBNG/45219",
  pf_start_date: "2019-04-01",
  pf_office: "Bengaluru — KR Puram",
  pf_group: "Group A",
  pf_cmp_gr: "SVT-MAIN",
  pf_limit: 15000,
  pf_ext_code: "EXT-01",
  pf_diff_epf: 0.5,
  pf_cal: "basic",
  pf_ac10: 8.33,
  pf_ac2: 3.67,
  pf_ac2_min: 15000,
  pf_ac21: 0.5,
  pf_ac21_min: 1000,
  pf_ac22: 0.65,
  pf_ac22_min: 500,
};

function renderSection(props: Partial<Parameters<typeof PfSection>[0]> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <PfSection
        org={org}
        canEdit
        isEditing={false}
        onEditOpen={vi.fn()}
        onEditClose={vi.fn()}
        {...props}
      />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.mocked(orgsApi.updateOrg).mockReset();
});

describe("PfSection — read-only", () => {
  it("renders the sixteen PF rows from the org data", () => {
    renderSection();
    expect(screen.getByText("Provident Fund")).toBeInTheDocument();
    const rows = screen.getAllByTestId("detail-row");
    expect(rows).toHaveLength(16);
    expect(screen.getByText("KRBNG/45219")).toBeInTheDocument();
    expect(screen.getByText("2019-04-01")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
  });

  it("renders an em dash for missing values", () => {
    renderSection({ org: { ...org, pf_no: undefined, pf_cal: undefined } });
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[0]).getByText("—")).toBeInTheDocument();
    expect(within(rows[8]).getByText("—")).toBeInTheDocument(); // pf_cal is row 8 (0-indexed)
  });
});

describe("PfSection — edit mode", () => {
  it("prefills the org values and reverts on Cancel", async () => {
    const user = userEvent.setup();
    const onEditClose = vi.fn();
    renderSection({ isEditing: true, onEditClose });
    const pfInput = screen.getByDisplayValue("KRBNG/45219");
    await user.clear(pfInput);
    await user.type(pfInput, "NEW PF");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onEditClose).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("KRBNG/45219")).toBeInTheDocument();
  });

  it("submits the edited values on Update and exits edit mode", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.updateOrg).mockResolvedValue({
      data: { ...org, pf_no: "NEW PF" },
    } as unknown as AxiosResponse<Organization>);
    const onEditClose = vi.fn();
    const { container } = renderSection({ isEditing: true, onEditClose });
    const pfInput = screen.getByDisplayValue("KRBNG/45219");
    await user.clear(pfInput);
    await user.type(pfInput, "NEW PF");
    const form = container.querySelector("#pf-details-form") as HTMLFormElement;
    fireEvent.submit(form);
    await waitFor(() =>
      expect(orgsApi.updateOrg).toHaveBeenCalledWith("org-1", expect.objectContaining({ pf_no: "NEW PF" })),
    );
    await waitFor(() => expect(onEditClose).toHaveBeenCalledTimes(1));
  });
});