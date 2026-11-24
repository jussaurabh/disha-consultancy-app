import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectDot,
  SelectAvatar,
  MultiSelect,
  SearchableSelect,
} from "./index";
import { Landmark, SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";

/**
 * DC design system — "05 / Select fields" board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: trigger = the 42 field shell (36 dense · 48 hero) · chevron trails
 * 14px muted · leading slots mirror the open rows (16px icon · 6px dot ·
 * 20px avatar) · panel 8px under the trigger · radius 14 · rows 40 ·
 * radius 6 · selected = accent-soft + check · hover lifts one step ·
 * multi = square checks + chips · search rides the panel.
 *
 * Paper references — dark: https://app.paper.design/file/01M7SE5M3Z7CA7H8ZXZFCH5MBV/p-2-0/4QN-1
 * light: https://app.paper.design/file/01M7SE5M3Z7CA7H8ZXZFCH5MBV/p-2-0/50K-1
 * Every story renders in both registers — switch with the Theme toolbar.
 */
const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single select on Radix · MultiSelect (chips + square checks + search + Clear all) · SearchableSelect (type to filter). Sizes sm 36 / default 42 / lg 48.",
      },
    },
  },
  argTypes: {
    value: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUITS = ["apple", "banana", "orange", "grape"] as const;
const FRUIT_LABEL: Record<string, string> = {
  apple: "Apple",
  banana: "Banana",
  orange: "Orange",
  grape: "Grape",
};

function FruitSelect(props: ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {FRUITS.map((fruit) => (
          <SelectItem key={fruit} value={fruit}>
            {FRUIT_LABEL[fruit]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const STATES = [
  "karnataka",
  "maharashtra",
  "tamil-nadu",
  "goa",
] as const;
const STATE_LABEL: Record<string, string> = {
  karnataka: "Karnataka",
  maharashtra: "Maharashtra",
  "tamil-nadu": "Tamil Nadu",
  goa: "Goa · unavailable",
};

/** Basic single select. */
export const Basic: Story = {
  render: () => <FruitSelect defaultValue="apple" />,
};

/** Trigger with a label riding 8 above. */
export const WithLabel: Story = {
  render: () => (
    <div className="w-60 space-y-2">
      <Label htmlFor="select-labelled">State</Label>
      <FruitSelect />
    </div>
  ),
};

/** Board: SIZES — three heights, radius and chrome stay constant. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(
        [
          ["Small · 36", "sm"],
          ["Medium · 42", "default"],
          ["Large · 48", "lg"],
        ] as const
      ).map(([caption, size]) => (
        <div key={size} className="w-60 space-y-2.5">
          <Select defaultValue="karnataka">
            <SelectTrigger size={size}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATE_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
            {caption}
          </p>
        </div>
      ))}
    </div>
  ),
};

/** Board: OPEN — SINGLE (plain) · selected tints accent-soft with a check; hover lifts one step. */
export const OpenPanelPlain: Story = {
  render: () => (
    <div className="w-60">
      <Select open onOpenChange={() => {}} defaultValue="karnataka">
        <SelectTrigger>
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((s) => (
            <SelectItem key={s} value={s} disabled={s === "goa"}>
              {STATE_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

/** Board: TRIGGERS — leading slots mirror how options render open. */
export const LeadingSlots: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="w-60 space-y-2">
        <Select open onOpenChange={() => {}} defaultValue="sbi">
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sbi">
              <Landmark className="size-4" />
              State Bank of India
            </SelectItem>
            <SelectItem value="hdfc">
              <Landmark className="size-4" />
              HDFC Bank
            </SelectItem>
            <SelectItem value="icici">
              <Landmark className="size-4" />
              ICICI Bank
            </SelectItem>
            <SelectItem value="bandhan" disabled>
              <Landmark className="size-4" />
              Bandhan Bank
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
          Icon leading
        </p>
      </div>
      <div className="w-60 space-y-2">
        <Select open onOpenChange={() => {}} defaultValue="active">
          <SelectTrigger className="w-60">
            <SelectDot className="bg-accent" />
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <SelectDot className="bg-accent" />
              Active
            </SelectItem>
            <SelectItem value="notice">
              <SelectDot className="bg-copper" />
              On notice period
            </SelectItem>
            <SelectItem value="inactive">
              <SelectDot className="bg-muted-foreground" />
              Inactive
            </SelectItem>
            <SelectItem value="separated" disabled>
              <SelectDot className="bg-line" />
              Separated
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
          Dot leading · status color
        </p>
      </div>
      <div className="w-60 space-y-2">
        <Select open onOpenChange={() => {}} defaultValue="mn">
          <SelectTrigger className="w-60">
            <SelectAvatar initials="MN" />
            <SelectValue placeholder="Select approver" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mn">
              <SelectAvatar initials="MN" className="size-6" />
              Meera Nair
            </SelectItem>
            <SelectItem value="ar">
              <SelectAvatar initials="AR" className="size-6" />
              Arjun Rao
            </SelectItem>
            <SelectItem value="pd" disabled>
              <SelectAvatar
                initials="PD"
                className="size-6 bg-background dark:bg-muted text-muted-foreground/60"
              />
              Priya Das · no access
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
          Avatar leading
        </p>
      </div>
    </div>
  ),
};

/** Board: groups ride a small label with a separator between them. */
export const WithGroups: Story = {
  render: () => (
    <div className="w-60">
      <Select open onOpenChange={() => {}} defaultValue="karnataka">
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>South</SelectLabel>
            <SelectItem value="karnataka">Karnataka</SelectItem>
            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>West</SelectLabel>
            <SelectItem value="maharashtra">Maharashtra</SelectItem>
            <SelectItem value="goa" disabled>
              Goa · unavailable
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/** Invalid — copper-red border; the error speaks below. */
export const Error: Story = {
  render: () => (
    <div className="w-60 space-y-2">
      <Label required htmlFor="select-error">
        State
      </Label>
      <Select>
        <SelectTrigger id="select-error" aria-invalid="true" aria-describedby="select-error-message">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATE_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p id="select-error-message" className="text-xs leading-4 text-destructive">
        Please select a state.
      </p>
    </div>
  ),
};

/** Disabled — sinks to the raised fill. */
export const Disabled: Story = {
  render: () => (
    <div className="w-60 space-y-2">
      <Label htmlFor="select-disabled">State</Label>
      <Select disabled defaultValue="karnataka">
        <SelectTrigger id="select-disabled">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATE_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

/** Long list — rows clip and scroll inside the padded panel frame. */
export const LongList: Story = {
  render: () => (
    <Select defaultValue="1">
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a number" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <SelectItem key={num} value={String(num)}>
            Option {num}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

const MULTI_OPTIONS = [
  { value: "karnataka", label: "Karnataka" },
  { value: "goa", label: "Goa" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "tamil-nadu", label: "Tamil Nadu", disabled: true },
  { value: "kerala", label: "Kerala" },
  { value: "delhi", label: "Delhi" },
];

/** MultiSelect — chips carry chosen values; the field grows, never scrolls. */
export const MultiBasic: Story = {
  render: () => (
    <div className="w-72">
      <MultiSelect
        options={MULTI_OPTIONS}
        defaultValue={["karnataka", "goa"]}
        placeholder="Select states"
        searchPlaceholder="Search states…"
      />
    </div>
  ),
};

/** MultiSelect panel — square checks, search, count and Clear all. */
export const MultiPanel: Story = {
  render: () => (
    <div className="w-72">
      <MultiSelect
        open
        onOpenChange={() => {}}
        options={MULTI_OPTIONS}
        defaultValue={["karnataka", "goa"]}
        placeholder="Select states"
        searchPlaceholder="Search states…"
      />
    </div>
  ),
};

/** MultiSelect sizes — chips scale with the trigger; icon leading; disabled. */
export const MultiSizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(
        [
          ["Small · 36", "sm"],
          ["Medium · 42", "default"],
          ["Large · 48", "lg"],
        ] as const
      ).map(([caption, size]) => (
        <div key={size} className="w-72 space-y-2.5">
          <MultiSelect
            size={size}
            options={MULTI_OPTIONS}
            defaultValue={["karnataka"]}
            placeholder="Select states"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
            {caption}
          </p>
        </div>
      ))}
    </div>
  ),
};

/** MultiSelect with a leading icon. */
export const MultiIconLeading: Story = {
  render: () => (
    <div className="w-72">
      <MultiSelect
        leadingIcon={<SlidersHorizontal className="size-4" />}
        options={MULTI_OPTIONS}
        defaultValue={["karnataka"]}
        placeholder="Filter departments"
      />
    </div>
  ),
};

/** MultiSelect disabled — chips sink with the trigger. */
export const MultiDisabled: Story = {
  render: () => (
    <div className="w-72">
      <MultiSelect
        disabled
        options={MULTI_OPTIONS}
        defaultValue={["karnataka", "goa"]}
        placeholder="Select states"
      />
    </div>
  ),
};

/** SearchableSelect — type to filter from the trigger. */
export const SearchBasic: Story = {
  render: () => (
    <div className="w-60">
      <SearchableSelect
        options={STATES.map((s) => ({ value: s, label: STATE_LABEL[s] }))}
        defaultValue="karnataka"
        placeholder="Select state"
        searchPlaceholder="Type to filter…"
      />
    </div>
  ),
};

/** SearchableSelect panel open — plain rows with the selected check. */
export const SearchPanel: Story = {
  render: () => (
    <div className="w-60">
      <SearchableSelect
        open
        onOpenChange={() => {}}
        options={STATES.map((s) => ({
          value: s,
          label: STATE_LABEL[s],
          disabled: s === "goa",
        }))}
        defaultValue="karnataka"
        placeholder="Select state"
        searchPlaceholder="Type to filter…"
      />
    </div>
  ),
};

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => <FruitSelect {...args} />,
  args: {
    disabled: false,
    required: false,
  },
};
