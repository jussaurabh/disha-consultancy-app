import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Organization } from "@/api/orgs";
import { SettingsSection } from "./settings-section";

const org: Organization = {
  _id: "org-1",
  company_name: "Sri Venkateswara Textiles Pvt Ltd",
  cno: "CNO-2019-4471",
  state: "karnataka",
};

function renderSection(props: Partial<Parameters<typeof SettingsSection>[0]> = {}) {
  return render(
    <SettingsSection
      org={org}
      canDelete
      onDelete={vi.fn()}
      {...props}
    />,
  );
}

afterEach(cleanup);

describe("SettingsSection", () => {
  it("renders the organization name and the danger zone", () => {
    renderSection();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sri Venkateswara Textiles Pvt Ltd")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete organization" })).toBeEnabled();
  });

  it("calls onDelete from the danger zone button", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderSection({ onDelete });
    await user.click(screen.getByRole("button", { name: "Delete organization" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("disables the delete button without the org:delete permission", () => {
    renderSection({ canDelete: false });
    expect(screen.getByRole("button", { name: "Delete organization" })).toBeDisabled();
  });
});