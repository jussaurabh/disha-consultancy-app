/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import { CompanyPanel } from "./company-panel";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
});

describe("CompanyPanel", () => {
  it("renders all eight fields and the state as a searchable select", () => {
    render(<CompanyPanel />);
    for (const label of [
      "Company name",
      "CNO",
      "State",
      "Status",
      "Establishment type",
      "Company view",
      "Rule type",
      "Unit / Contractor name",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByPlaceholderText("Select state…")).toBeInTheDocument();
  });

  it("persists typed values into the draft", async () => {
    render(<CompanyPanel />);
    await userEvent.type(screen.getByLabelText(/Company name/), "Acme Pvt Ltd");
    const draft = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(draft.Company.company_name).toBe("Acme Pvt Ltd");
  });

  it("restores saved values from the draft on mount", () => {
    localStorage.setItem(
      ORG_NEW_DRAFT_KEY,
      JSON.stringify({ Company: { company_name: "Acme Pvt Ltd" } }),
    );
    render(<CompanyPanel />);
    expect(screen.getByLabelText(/Company name/)).toHaveValue("Acme Pvt Ltd");
  });
});