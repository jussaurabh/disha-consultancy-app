import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import { orgsApi, type Organization } from "@/api/orgs";
import { ContactSection } from "./contact-section";

vi.mock("@/api/orgs", () => ({
  orgsApi: { updateOrg: vi.fn() },
}));

const org: Organization = {
  _id: "org-1",
  company_name: "Sri Venkateswara Textiles Pvt Ltd",
  cno: "CNO-2019-4471",
  state: "karnataka",
  email: "accounts@svt.in",
  phone_no: "+91 98450 12345",
  address: "Plot 14, Hebbal Industrial Area",
  branch_location: "Unit 1 — Mysuru",
  city: "Bengaluru",
  district: "Bengaluru Urban",
  pincode: "560024",
};

function renderSection(props: Partial<Parameters<typeof ContactSection>[0]> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ContactSection
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

describe("ContactSection — read-only", () => {
  it("renders the seven contact rows from the org data", () => {
    renderSection();
    expect(screen.getByText("Contact & Address")).toBeInTheDocument();
    const rows = screen.getAllByTestId("detail-row");
    expect(rows).toHaveLength(7);
    expect(screen.getByText("accounts@svt.in")).toBeInTheDocument();
    expect(screen.getByText("+91 98450 12345")).toBeInTheDocument();
    expect(screen.getByText("560024")).toBeInTheDocument();
  });

  it("renders an em dash for missing values", () => {
    renderSection({ org: { ...org, email: undefined, pincode: undefined } });
    const rows = screen.getAllByTestId("detail-row");
    expect(within(rows[0]).getByText("—")).toBeInTheDocument();
    expect(within(rows[6]).getByText("—")).toBeInTheDocument();
  });
});

describe("ContactSection — edit mode", () => {
  it("prefills the org values and reverts on Cancel", async () => {
    const user = userEvent.setup();
    const onEditClose = vi.fn();
    renderSection({ isEditing: true, onEditClose });
    const emailInput = screen.getByDisplayValue("accounts@svt.in");
    await user.clear(emailInput);
    await user.type(emailInput, "billing@svt.in");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onEditClose).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("accounts@svt.in")).toBeInTheDocument();
  });

  it("submits the edited values on Update and exits edit mode", async () => {
    const user = userEvent.setup();
    vi.mocked(orgsApi.updateOrg).mockResolvedValue({
      data: { ...org, email: "billing@svt.in" },
    } as unknown as AxiosResponse<Organization>);
    const onEditClose = vi.fn();
    renderSection({ isEditing: true, onEditClose });
    const emailInput = screen.getByDisplayValue("accounts@svt.in");
    await user.clear(emailInput);
    await user.type(emailInput, "billing@svt.in");
    await user.click(screen.getByRole("button", { name: "Update" }));
    await waitFor(() =>
      expect(orgsApi.updateOrg).toHaveBeenCalledWith("org-1", expect.objectContaining({ email: "billing@svt.in" })),
    );
    await waitFor(() => expect(onEditClose).toHaveBeenCalledTimes(1));
  });

  it("blocks submit with an invalid email", async () => {
    const user = userEvent.setup();
    const { container } = renderSection({ isEditing: true });
    const emailInput = screen.getByDisplayValue("accounts@svt.in");
    await user.clear(emailInput);
    await user.type(emailInput, "not-an-email");
    const form = container.querySelector("#contact-details-form") as HTMLFormElement;
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByText("Invalid email")).toBeInTheDocument());
    expect(orgsApi.updateOrg).not.toHaveBeenCalled();
  });
});