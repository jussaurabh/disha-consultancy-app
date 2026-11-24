import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "@/components/ui/label";
import { Search, Calendar } from "lucide-react";

/**
 * DC design system — "04 / Inputs" board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: height 42 · radius 10 · Inter 400 14 · label 13/600 with a copper
 * asterisk when required · helper 12 muted · error 12 copper-red dyes the
 * border · focus = accent border 1.5px · disabled sinks to the ground/
 * raised fill.
 *
 * Paper references — dark: https://app.paper.design/file/01M7SE5M3Z7CA7H8ZXZFCH5MBV/p-2-0/48V-1
 * light: https://app.paper.design/file/01M7SE5M3Z7CA7H8ZXZFCH5MBV/p-2-0/4K1-1
 * Every story renders in both registers — switch with the Theme toolbar.
 */
const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single-line text field on the 42px shell — states, labels & messages, and affix icons per the 04 / Inputs board.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "HTML input type",
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    "aria-invalid": { control: "boolean" },
    value: { control: "text" },
    defaultValue: { control: "text" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** States — default, filled, focused, disabled (board: TEXT FIELD). */
export const States: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-4 gap-6">
      {(
        [
          ["Default", <Input key="d" placeholder="e.g. Sri Venkateswara Textiles" />],
          ["Filled", <Input key="f" defaultValue="Sri Venkateswara Textiles" />],
          [
            "Focused",
            <Input key="fo" defaultValue="Sri Venkateswara" autoFocus />,
          ],
          [
            "Disabled",
            <Input key="di" defaultValue="CNO-2019-4471" disabled />,
          ],
        ] as const
      ).map(([caption, field]) => (
        <div key={caption} className="space-y-2.5">
          {field}
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
            {caption}
          </p>
        </div>
      ))}
    </div>
  ),
};

/** Label, helper and the copper asterisk (board: LABELS & MESSAGES). */
export const WithLabelAndHelper: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label required htmlFor="input-company">
        Company name
      </Label>
      <Input id="input-company" defaultValue="Sri Venkateswara Textiles Pvt Ltd" />
      <p className="text-xs leading-4 text-muted-foreground">
        The registered legal name — shown across payroll documents.
      </p>
    </div>
  ),
};

/** Unlabeled — the placeholder carries the ask. */
export const Unlabeled: Story = {
  render: () => (
    <div className="w-80">
      <Input placeholder="e.g. Unit 1 — Mysuru" />
    </div>
  ),
};

/** Invalid — the border dyes copper-red and the error speaks below. */
export const Error: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label required htmlFor="input-error">
        PF number
      </Label>
      <Input
        id="input-error"
        defaultValue="KRBNG/452"
        aria-invalid="true"
        aria-describedby="input-error-message"
      />
      <p id="input-error-message" className="text-xs leading-4 text-destructive">
        Establishment ID looks invalid — check the regional format.
      </p>
    </div>
  ),
};

/** Leading affix — search magnifier rides the left. */
export const LeadingIcon: Story = {
  render: () => (
    <div className="relative w-80">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-10" type="search" placeholder="Search organizations…" />
    </div>
  ),
};

/** Trailing affix — calendar trails a date value. */
export const TrailingIcon: Story = {
  render: () => (
    <div className="relative w-80">
      <Input className="pr-10" defaultValue="01 Apr 2019" />
      <Calendar className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  ),
};

/** Native input types on the one shell. */
export const InputTypes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-5">
      {(
        [
          ["Text", "text", "Text input"],
          ["Email", "email", "Email input"],
          ["Password", "password", "Password input"],
          ["Number", "number", "Number input"],
          ["Phone", "tel", "Phone input"],
          ["URL", "url", "URL input"],
        ] as const
      ).map(([label, type, placeholder]) => (
        <div key={type} className="space-y-2">
          <Label htmlFor={`type-${type}`}>{label}</Label>
          <Input id={`type-${type}`} type={type} placeholder={placeholder} />
        </div>
      ))}
    </div>
  ),
};

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
  args: {
    placeholder: "e.g. Sri Venkateswara Textiles",
    type: "text",
    disabled: false,
    required: false,
  },
};
