import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";
import { Label } from "@/components/ui/label";

/**
 * DC design system — "04 / Inputs" board (TEXTAREA section).
 *
 * Spec: same shell as the single-line field · 88px at rest · top-aligned
 * text · helper and error behave alike; disabled sinks to the fill and
 * invalid dyes the border and speaks below.
 *
 * Paper references — dark: https://app.paper.design/file/01M7SE5M3Z7CA7H8ZXZFCH5MBV/p-2-0/48V-1
 * light: https://app.paper.design/file/01M7SE5M3Z7CA7H8ZXZFCH5MBV/p-2-0/4K1-1
 */
const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Multi-line field on the input shell — 88px at rest, grows with content.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    "aria-invalid": { control: "boolean" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rest state with placeholder. */
export const Default: Story = {
  render: () => (
    <div className="w-[360px]">
      <Textarea placeholder="e.g. Plot 14, Hebbal Industrial Area…" />
    </div>
  ),
};

/** Filled with a helper note riding 8 under the field. */
export const WithHelper: Story = {
  render: () => (
    <div className="w-[360px] space-y-2">
      <Label htmlFor="ta-helper">Street address</Label>
      <Textarea
        id="ta-helper"
        defaultValue="Plot 14, Hebbal Industrial Area, Bengaluru — 560031"
        aria-describedby="ta-helper-message"
      />
      <p id="ta-helper-message" className="text-xs leading-4 text-muted-foreground">
        Street address — appears on PF and ESI challans.
      </p>
    </div>
  ),
};

/** Invalid — copper-red border with the error speaking below. */
export const Error: Story = {
  render: () => (
    <div className="w-[360px] space-y-2">
      <Label htmlFor="ta-error">Street address</Label>
      <Textarea
        id="ta-error"
        defaultValue="Plot 14 Hebbal Industrial Area Bengaluru 560031 KA IN"
        aria-invalid="true"
        aria-describedby="ta-error-message"
      />
      <p id="ta-error-message" className="text-xs leading-4 text-destructive">
        Address reads pasted — split into street, city and PIN.
      </p>
    </div>
  ),
};

/** Disabled — sinks to the ground/raised fill. */
export const Disabled: Story = {
  render: () => (
    <div className="w-[360px] space-y-2">
      <Label htmlFor="ta-disabled">Street address</Label>
      <Textarea
        id="ta-disabled"
        defaultValue="Plot 14, Hebbal Industrial Area, Bengaluru — 560031"
        disabled
      />
    </div>
  ),
};
