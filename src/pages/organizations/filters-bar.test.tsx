import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { FiltersBar } from "./filters-bar";

describe("FiltersBar", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders organization filters", () => {
    render(<FiltersBar tab="organizations" />);
    expect(screen.getByPlaceholderText("Search companies…")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Clear filters")).toBeInTheDocument();
  });

  it("renders employee filters", () => {
    render(<FiltersBar tab="employees" />);
    expect(screen.getByPlaceholderText("Search employees…")).toBeInTheDocument();
    expect(screen.getByText("All organizations")).toBeInTheDocument();
    expect(screen.getByText("Designation")).toBeInTheDocument();
  });

  it("renders the status dot only on the Active trigger", () => {
    const { container } = render(<FiltersBar tab="organizations" />);
    const dropdowns = container.querySelectorAll('[data-slot="filters-bar-dropdown"]');
    expect(dropdowns).toHaveLength(2);
    expect(dropdowns[0].querySelector(".rounded-full")).toBeNull();
    expect(dropdowns[1].querySelector(".rounded-full")).not.toBeNull();
  });

  it("accepts a search query and clears it", async () => {
    const user = userEvent.setup();
    render(<FiltersBar tab="organizations" />);
    const input = screen.getByPlaceholderText("Search companies…");
    await user.type(input, "sri");
    expect(input).toHaveValue("sri");
    await user.click(screen.getByText("Clear filters"));
    expect(input).toHaveValue("");
  });
});