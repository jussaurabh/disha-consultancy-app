/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import { ContactPanel } from "./contact-panel";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
});

describe("ContactPanel", () => {
  it("renders all seven fields per the design", () => {
    render(<ContactPanel />);
    for (const label of [
      "Email",
      "Phone number",
      "Address",
      "Branch / Location",
      "City",
      "District",
      "Pincode",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByPlaceholderText("accounts@company.in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+91 98450 00000")).toBeInTheDocument();
    expect(screen.getByText("Used for payroll SMS alerts.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("560024")).toBeInTheDocument();
  });

  it("persists typed values under the Contact step", async () => {
    render(<ContactPanel />);
    await userEvent.type(screen.getByLabelText(/Email/), "accounts@company.in");
    const draft = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(draft.Contact.email).toBe("accounts@company.in");
  });
});