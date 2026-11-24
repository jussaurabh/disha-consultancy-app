import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StickyActionBar } from "./sticky-action-bar";

describe("StickyActionBar", () => {
  it("docks full width to the bottom above page content", () => {
    const { container } = render(<StickyActionBar />);
    const root = container.querySelector('[data-slot="sticky-action-bar"]')!;
    expect(root).toHaveClass("sticky", "bottom-0", "z-30", "w-full", "min-h-[76px]", "border-t", "bg-card");
    expect(root).not.toHaveClass("z-50");
  });

  it("pads the bar with the shared gutter", () => {
    const { container } = render(<StickyActionBar />);
    const root = container.querySelector('[data-slot="sticky-action-bar"]')!;
    expect(root).toHaveClass("px-4", "md:px-6");
  });

  it("has no default view", () => {
    const { container } = render(<StickyActionBar />);
    const root = container.querySelector('[data-slot="sticky-action-bar"]')!;
    expect(root.childElementCount).toBe(0);
  });

  it("renders left and right slots with the right slot pushed to the edge", () => {
    const { container } = render(
      <StickyActionBar>
        <StickyActionBar.Left><span>Step 1 of 6</span></StickyActionBar.Left>
        <StickyActionBar.Right><button>Continue</button></StickyActionBar.Right>
      </StickyActionBar>,
    );
    const left = container.querySelector('[data-slot="sticky-action-bar-left"]')!;
    const right = container.querySelector('[data-slot="sticky-action-bar-right"]')!;
    expect(left).toHaveClass("min-w-0", "gap-3.5");
    expect(right).toHaveClass("ml-auto", "gap-3");
    expect(right).toHaveTextContent("Continue");
  });
});