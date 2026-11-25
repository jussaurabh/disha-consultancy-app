/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import { EsiPanel } from "./esi-panel";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
});

describe("EsiPanel", () => {
  it("renders all 8 fields with Gross selected by default", () => {
    render(<EsiPanel />);
    for (const label of [
      "ESI number",
      "ESI start date",
      "Local office",
      "ESI company group",
      "ESI limit",
      "Employee %",
      "Employer %",
      "ESI calculated on",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByLabelText(/ESI start date/)).toHaveAttribute("type", "date");
    expect(screen.getByRole("radio", { name: "Gross" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "All components" })).not.toBeChecked();
  });

  it("persists the radio choice under the ESI step", async () => {
    render(<EsiPanel />);
    await userEvent.click(screen.getByRole("radio", { name: "All components" }));
    const draft = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(draft.ESI.esi_calculated_on).toBe("all_components");
  });
});