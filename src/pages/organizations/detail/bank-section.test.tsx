import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { BankSection } from "./bank-section";

vi.mock("@/api/orgs", () => ({
  orgsApi: { updateOrg: vi.fn() },
}));

const org: Organization = {
  _id: "org-1",
  company_name: "Sri Venkateswara Textiles Pvt Ltd",
  cno: "CNO-2019-4471",
  state: "karnataka",
  bank_name: "State Bank of India",
  ifsc_code: "SBIN0001234",
  account_no: "50123456789",
  bank_address: "MG Road Branch, Bengaluru",
};

function renderSection(props: Partial<Parameters<typeof BankSection>[0]> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BankSection
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

describe("BankSection — read-only", () => {
  it("renders the four bank rows from the org data", () => {
    renderSection();
    expect(screen.getByText("Bank Details")).toBeInTheDocument();
    const rows = screen.getAllByTestId("detail-row");
    expect(rows).toHaveLength(4);
    expect(screen.getByText("State Bank of India")).toBeInTheDocument();
    expect(screen.getByText("SBIN0001234")).toBeInTheDocument();
    expect(screen.getByText("50123456789")).toBeInTheDocument();
    expect(screen.getByText("MG Road Branch, Bengaluru")).toBeInTheDocument();
  });

  it("renders an em dash for missing values", () => {
    renderSection({ org: { ...org, bank_name: undefined, ifsc_code: undefined } });
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[0]).getByText("—")).toBeInTheDocument();
    expect(within(rows[1]).getByText("—")).toBeInTheDocument();
  });
});

describe("BankSection — edit mode", () => {
  it("prefills the org values and reverts on Cancel", async () => {
    const user = userEvent.setup();
    const onEditClose = vi.fn();
    renderSection({ isEditing: true, onEditClose });
    const ifscInput = screen.getByDisplayValue("SBIN0001234");
    await user.clear(ifscInput);
    await user.type(ifscInput, "SBIN0009999");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onEditClose).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("SBIN0001234")).toBeInTheDocument();
  });

  it("submits the edited values on Update and exits edit mode", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.updateOrg).mockResolvedValue({
      data: { ...org, ifsc_code: "SBIN0009999" },
    } as unknown as AxiosResponse<Organization>);
    const onEditClose = vi.fn();
    const { container } = renderSection({ isEditing: true, onEditClose });
    const ifscInput = screen.getByDisplayValue("SBIN0001234");
    await user.clear(ifscInput);
    await user.type(ifscInput, "SBIN0009999");
    const form = container.querySelector("#bank-details-form") as HTMLFormElement;
    fireEvent.submit(form);
    await waitFor(() =>
      expect(orgsApi.updateOrg).toHaveBeenCalledWith("org-1", expect.objectContaining({ ifsc_code: "SBIN0009999" })),
    );
    await waitFor(() => expect(onEditClose).toHaveBeenCalledTimes(1));
  });
});