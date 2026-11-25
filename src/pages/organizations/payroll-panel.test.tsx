/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import { PayrollPanel } from "./payroll-panel";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
});

describe("PayrollPanel", () => {
  it("renders all 15 fields, four selects, and four switches", () => {
    render(<PayrollPanel />);
    for (const label of [
      "PAN number",
      "TAN number",
      "PT number",
      "PT as per employee state",
      "Professional tax",
      "IT auto",
      "Pay scale on",
      "Leave method",
      "Leave calculated on",
      "Min. wage limit",
      "Bonus %",
      "Bonus limit",
      "OT on",
      "OT ratio",
      "ESI on OT",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getAllByRole("combobox")).toHaveLength(4);
    expect(screen.getByRole("switch", { name: "PT as per employee state" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Professional tax" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "IT auto" })).not.toBeChecked();
    expect(screen.getByRole("switch", { name: "ESI on OT" })).not.toBeChecked();
  });

  it("persists toggling IT auto under the Payroll step", async () => {
    render(<PayrollPanel />);
    await userEvent.click(screen.getByRole("switch", { name: "IT auto" }));
    const draft = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(draft.Payroll.it_auto).toBe(true);
  });
});