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