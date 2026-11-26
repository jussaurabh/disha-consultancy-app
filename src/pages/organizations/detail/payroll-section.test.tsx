import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { PayrollSection } from "./payroll-section";

vi.mock("@/api/orgs", () => ({
  orgsApi: { updateOrg: vi.fn() },
}));

// Mock ResizeObserver for Radix UI components
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
  pan_no: "AACCT1234A",
  tan_no: "BLRM12345C",
  pt_number: "PT/KAR/4471",
  pt_as_per_employee_state: true,
  professional_tax: true,
  it_auto: false,
  pay_scale_on: "Working Days",
  leave_method: "As Per Calendar",
  leave_cal_on: "Basic",
  min_wage_limit: 15000,
  bonus_percent: 8.33,
  bonus_limit: 21000,
  ot_on: "Basic",
  ot_ratio: 2,
  esi_on_ot: false,
};

function renderSection(props: Partial<Parameters<typeof PayrollSection>[0]> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <PayrollSection
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

describe("PayrollSection — read-only", () => {
  it("renders the fifteen payroll rows from the org data", () => {
    renderSection();
    expect(screen.getByText("Payroll & Leave")).toBeInTheDocument();
    const rows = screen.getAllByTestId("detail-row");
    expect(rows).toHaveLength(15);
    expect(screen.getByText("AACCT1234A")).toBeInTheDocument();
    expect(screen.getByText("BLRM12345C")).toBeInTheDocument();
    expect(screen.getByText("15000")).toBeInTheDocument();
    expect(screen.getByText("8.33")).toBeInTheDocument();
  });

  it("renders Yes/No for boolean fields", () => {
    renderSection();
    const yesElements = screen.getAllByText("Yes");
    const noElements = screen.getAllByText("No");
    expect(yesElements.length).toBeGreaterThanOrEqual(2); // pt_as_per_employee_state, professional_tax
    expect(noElements.length).toBeGreaterThanOrEqual(2); // it_auto, esi_on_ot
  });

  it("renders an em dash for missing values", () => {
    renderSection({ org: { ...org, pan_no: undefined, min_wage_limit: undefined } });
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[0]).getByText("—")).toBeInTheDocument();
    expect(within(rows[9]).getByText("—")).toBeInTheDocument();
  });
});

describe("PayrollSection — edit mode", () => {
  it("prefills the org values and reverts on Cancel", async () => {
    const user = userEvent.setup();
    const onEditClose = vi.fn();
    renderSection({ isEditing: true, onEditClose });
    const panInput = screen.getByDisplayValue("AACCT1234A");
    await user.clear(panInput);
    await user.type(panInput, "NEW PAN");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onEditClose).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("AACCT1234A")).toBeInTheDocument();
  });

  it("submits the edited values on Update and exits edit mode", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.updateOrg).mockResolvedValue({
      data: { ...org, pan_no: "NEW PAN" },
    } as unknown as AxiosResponse<Organization>);
    const onEditClose = vi.fn();
    const { container } = renderSection({ isEditing: true, onEditClose });
    const panInput = screen.getByDisplayValue("AACCT1234A");
    await user.clear(panInput);
    await user.type(panInput, "NEW PAN");
    const form = container.querySelector("#payroll-details-form") as HTMLFormElement;
    fireEvent.submit(form);
    await waitFor(() =>
      expect(orgsApi.updateOrg).toHaveBeenCalledWith("org-1", expect.objectContaining({ pan_no: "NEW PAN" })),
    );
    await waitFor(() => expect(onEditClose).toHaveBeenCalledTimes(1));
  });
});