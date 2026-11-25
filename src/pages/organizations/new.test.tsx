/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ORG_NEW_DRAFT_KEY } from "@/lib/org-new-draft";
import NewOrganizationPage from "./new";

afterEach(() => {
  cleanup();
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
  vi.restoreAllMocks();
});

function renderNewPage() {
  const router = createMemoryRouter(
    [
      { path: "/organizations/new", element: <NewOrganizationPage /> },
      { path: "/organizations", element: <div>organizations list</div> },
    ],
    { initialEntries: ["/organizations/new"] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

async function clickContinue() {
  await userEvent.click(await screen.findByRole("button", { name: /Continue to|Create organization/ }));
}

describe("NewOrganizationPage", () => {
  it("renders Cancel and no Save draft in the page header", () => {
    renderNewPage();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Save draft/ })).not.toBeInTheDocument();
  });

  it("shows Create organization on the last step and prints the whole draft on click", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    renderNewPage();

    await userEvent.type(screen.getByLabelText(/Company name/), "Acme Pvt Ltd");
    for (let i = 0; i < 5; i += 1) {
      await clickContinue();
    }
    expect(screen.getByRole("button", { name: "Create organization" })).toBeEnabled();
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Create organization" }));
    const stored = JSON.parse(localStorage.getItem(ORG_NEW_DRAFT_KEY)!);
    expect(logSpy).toHaveBeenCalledWith(stored);
    expect(stored.Company.company_name).toBe("Acme Pvt Ltd");
  });
});

describe("NewOrganizationPage — navigation guard", () => {
  const DIRTY_DRAFT = JSON.stringify({
    Company: { company_name: "Acme Pvt Ltd" },
    Bank: { ifsc_code: "SBIN0001234" },
  });

  it("does not block navigation when the draft is clean", async () => {
    renderNewPage();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(await screen.findByText("organizations list")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("blocks a dirty draft and both dialog actions behave", async () => {
    localStorage.setItem(ORG_NEW_DRAFT_KEY, DIRTY_DRAFT);
    renderNewPage();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("All changes will be lost.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Continue filling the form" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Company name/)).toBeInTheDocument();
    expect(localStorage.getItem(ORG_NEW_DRAFT_KEY)).toBe(DIRTY_DRAFT);
  });

  it("Cancel & navigate away clears the draft and leaves", async () => {
    localStorage.setItem(ORG_NEW_DRAFT_KEY, DIRTY_DRAFT);
    renderNewPage();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancel & navigate away" }),
    );
    expect(await screen.findByText("organizations list")).toBeInTheDocument();
    expect(localStorage.getItem(ORG_NEW_DRAFT_KEY)).toBeNull();
  });

  it("ESC keeps the user on the page with the draft intact", async () => {
    localStorage.setItem(ORG_NEW_DRAFT_KEY, DIRTY_DRAFT);
    renderNewPage();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Company name/)).toBeInTheDocument();
    expect(localStorage.getItem(ORG_NEW_DRAFT_KEY)).toBe(DIRTY_DRAFT);
  });
});