import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { EsiSection } from "./esi-section";

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
  esi_no: "ESI/BNG/12345",
  esi_start_date: "2019-04-01",
  esi_local_office: "Bengaluru Local Office",
  esi_comp_gr: "SVT-MAIN",
  esi_limit: 21000,
  esi_employee_percent: 0.75,
  esi_employer_percent: 3.25,
  esi_cal: "gross",
};

function renderSection(props: Partial<Parameters<typeof EsiSection>[0]> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <EsiSection
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

describe("EsiSection — read-only", () => {
  it("renders the eight ESI rows from the org data", () => {
    renderSection();
    expect(screen.getByText("Employee State Insurance")).toBeInTheDocument();
    const rows = screen.getAllByTestId("detail-row");
    expect(rows).toHaveLength(8);
    expect(screen.getByText("ESI/BNG/12345")).toBeInTheDocument();
    expect(screen.getByText("2019-04-01")).toBeInTheDocument();
    expect(screen.getByText("Gross")).toBeInTheDocument();
  });

  it("renders an em dash for missing values", () => {
    renderSection({ org: { ...org, esi_no: undefined, esi_cal: undefined } });
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[0]).getByText("—")).toBeInTheDocument();
    expect(within(rows[7]).getByText("—")).toBeInTheDocument(); // esi_cal is row 7 (0-indexed)
  });
});

describe("EsiSection — edit mode", () => {
  it("prefills the org values and reverts on Cancel", async () => {
    const user = userEvent.setup();
    const onEditClose = vi.fn();
    renderSection({ isEditing: true, onEditClose });
    const esiInput = screen.getByDisplayValue("ESI/BNG/12345");
    await user.clear(esiInput);
    await user.type(esiInput, "NEW ESI");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onEditClose).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("ESI/BNG/12345")).toBeInTheDocument();
  });

  it("submits the edited values on Update and exits edit mode", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.updateOrg).mockResolvedValue({
      data: { ...org, esi_no: "NEW ESI" },
    } as unknown as AxiosResponse<Organization>);
    const onEditClose = vi.fn();
    const { container } = renderSection({ isEditing: true, onEditClose });
    const esiInput = screen.getByDisplayValue("ESI/BNG/12345");
    await user.clear(esiInput);
    await user.type(esiInput, "NEW ESI");
    const form = container.querySelector("#esi-details-form") as HTMLFormElement;
    fireEvent.submit(form);
    await waitFor(() =>
      expect(orgsApi.updateOrg).toHaveBeenCalledWith("org-1", expect.objectContaining({ esi_no: "NEW ESI" })),
    );
    await waitFor(() => expect(onEditClose).toHaveBeenCalledTimes(1));
  });
});