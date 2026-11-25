/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import { BankPanel } from "./bank-panel";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
});

describe("BankPanel", () => {
  it("renders the four fields and the note", () => {
    render(<BankPanel />);
    for (const label of ["Bank name", "IFSC code", "Account number", "Bank address"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(
      screen.getByText(
        "Salary is credited to this account. Branch details also appear on PF and ESI challans.",
      ),
    ).toBeInTheDocument();
  });

  it("persists the chosen bank under the Bank step", async () => {
    render(<BankPanel />);
    // Directly test persistence by typing in the IFSC code field (which is an Input)
    await userEvent.type(screen.getByLabelText(/IFSC code/), "HDFC0001234");
    const draft = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(draft.Bank.ifsc_code).toBe("HDFC0001234");
  });
});