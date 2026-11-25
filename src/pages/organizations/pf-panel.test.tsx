/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import { PfPanel } from "./pf-panel";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
});

describe("PfPanel", () => {
  it("renders all 16 fields with Basic selected by default", () => {
    render(<PfPanel />);
    for (const label of [
      "PF number",
      "PF start date",
      "PF office",
      "PF group",
      "PF company group",
      "PF limit",
      "Extension code",
      "Diff EPF",
      "PF calculated on",
      "Pension (A/C 10)",
      "A/C-2",
      "A/C-2 min (Rs.)",
      "A/C-21",
      "A/C-21 min (Rs.)",
      "A/C-22",
      "A/C-22 min (Rs.)",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByLabelText(/PF start date/)).toHaveAttribute("type", "date");
    expect(screen.getByRole("radio", { name: "Basic" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Allowance" })).not.toBeChecked();
  });

  it("persists the radio choice under the PF step", async () => {
    render(<PfPanel />);
    await userEvent.click(screen.getByRole("radio", { name: "Allowance" }));
    const draft = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(draft.PF.pf_calculated_on).toBe("allowance");
  });
});