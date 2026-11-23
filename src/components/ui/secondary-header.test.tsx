import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SecondaryHeader } from "./secondary-header";

describe("SecondaryHeader.Title", () => {
  it("renders the avatar as a rounded square with soft accent background", () => {
    const { container } = render(
      <SecondaryHeader.Title avatar="S" name="Test Org" />,
    );
    const title = container.querySelector('[data-slot="secondary-header-title"]')!;
    const avatar = title.firstElementChild!;
    expect(avatar).toHaveClass("rounded-[10px]", "bg-accent-soft", "font-display", "text-accent");
    expect(avatar).toHaveTextContent("S");
  });

  it("renders the badge dot with a visible size", () => {
    const { container } = render(
      <SecondaryHeader.Title name="Test Org" badge={{ text: "Active", tone: "accent" }} />,
    );
    const title = container.querySelector('[data-slot="secondary-header-title"]')!;
    const dot = title.querySelector(".bg-accent")!;
    expect(dot).toHaveClass("size-1.5", "rounded-full");
  });
});

describe("SecondaryHeader root band", () => {
  it("renders the 54px full-width band with the shared gutter", () => {
    const { container } = render(<SecondaryHeader />);
    const root = container.querySelector('[data-slot="secondary-header"]')!;
    expect(root).toHaveClass(
      "min-h-[54px]", "w-full", "items-center", "border-b", "bg-card", "px-4", "md:px-6",
    );
    expect(root).not.toHaveClass("py-4");
    expect(root).not.toHaveClass("min-h-14");
  });
});
