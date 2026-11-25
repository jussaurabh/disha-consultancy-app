import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { RadioOption } from "./radio-option"
import { Label } from "@/components/ui/label"

/**
 * DC design system — "06 / Radio Group" board (V1.0).
 *
 * Single-select dot on a 1.5px line ring — selected dyes the ring accent and
 * fills an 8px accent dot at the center; focus paints a 3px accent ring at
 * 30%; disabled keeps the line ring. Four registers through `variant` —
 * list rows (28px pitch, label 13px ink, checked label goes semibold),
 * selector cards (accent border + accent-soft fill), pill cards (42px,
 * pad 18) and the joined divided bar. Three sizes through `size` — dot
 * 14/16/20, row 24/28/32, pill 36/42/48, label 12/13/14.
 *
 * Rules: single choice only — use a checkbox for multi-select. Always
 * pre-select one option and pair every item with a visible label.
 */
const meta = {
  title: "UI/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single-select choice group in four registers — list rows, selector cards, " +
          "pill cards and a joined divided bar — in three sizes. The dot is a 16px " +
          "circle with a 1.5px line ring; selected dyes the ring accent and fills an " +
          "8px accent dot. RadioOption pairs the dot with a label, description and " +
          "helper or error lines.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["list", "card", "pill", "joined"],
      description:
        "Register — list rows (default), selector cards, pill cards or the joined divided bar.",
    },
    size: {
      control: "radio",
      options: ["sm", "default", "lg"],
      description: "Scale — sm shrinks the dot, row, pill and label; lg grows them.",
    },
    defaultValue: {
      control: "text",
      description: "Item value selected on first render (uncontrolled).",
    },
    value: {
      control: "text",
      description: "Controlled selected value.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the whole group — dots keep the line ring.",
    },
    required: {
      control: "boolean",
      description: "Marks the group as required for form semantics.",
    },
    name: {
      control: "text",
      description: "Field name submitted with the surrounding form.",
    },
    loop: {
      control: "boolean",
      description:
        "Arrow-key navigation wraps from the last item back to the first.",
    },
  },
  args: {
    variant: "list",
    size: "default",
    defaultValue: "monthly",
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="font-body text-[10px] font-semibold uppercase leading-3 tracking-[0.08em] text-muted-foreground">
      {children}
    </span>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </h3>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 flex flex-col gap-2">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  )
}

function Row({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div className="grid gap-5 border-b border-border py-7 last:border-b-0 md:grid-cols-[240px_1fr] md:items-center">
      <div className="flex flex-col gap-1">
        <span className="font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.14em] text-foreground">
          {label}
        </span>
        {note ? (
          <span className="font-body text-xs leading-4 text-muted-foreground">{note}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-6">{children}</div>
    </div>
  )
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      {children}
      <Caption>{label}</Caption>
    </div>
  )
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">{children}</div>
    </div>
  )
}

/** Bare dot + label — used where the option needs item-level aria-invalid. */
function LabeledItem({
  id,
  value,
  label,
  disabled,
  invalid,
}: {
  id: string
  value: string
  label: string
  disabled?: boolean
  invalid?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <RadioGroupItem value={value} id={id} disabled={disabled} aria-invalid={invalid} />
      <Label htmlFor={id} className={invalid ? undefined : "text-ink"}>
        {label}
      </Label>
    </div>
  )
}

/** The four registers — list rows, selector cards, pill cards, joined bar. */
function Registers() {
  return (
    <div className="flex flex-col">
      <Row label="List · Label only" note="Row 28 · gap-2.5 · dot 16 · ring 1.5px line">
        <RadioGroup defaultValue="monthly">
          <RadioOption value="monthly" label="Monthly" />
          <RadioOption value="quarterly" label="Quarterly" />
          <RadioOption value="yearly" label="Yearly" />
        </RadioGroup>
      </Row>
      <Row label="List · Descriptions" note="Label 13 ink · description 12 muted · checked label goes semibold">
        <RadioGroup defaultValue="new">
          <RadioOption
            value="new"
            label="New regime"
            description="Lower slabs, no exemptions — the default for new employees."
          />
          <RadioOption
            value="old"
            label="Old regime"
            description="Higher slabs with HRA, 80C and other exemptions."
            disabled
          />
        </RadioGroup>
      </Row>
      <Row
        label="Selector cards · Plan"
        note="Pad 16 · selected paints the 1.5px accent border on accent-soft"
      >
        <RadioGroup defaultValue="pro" variant="card" className="w-full max-w-2xl sm:grid sm:grid-cols-3 sm:gap-4">
          <RadioOption
            value="starter"
            label="Starter"
            description="Up to 5 employees · basic payroll · email support."
          />
          <RadioOption
            value="pro"
            label="Professional"
            description="Up to 50 employees · advanced payroll · priority support."
          />
          <RadioOption
            value="enterprise"
            label="Enterprise"
            description="Unlimited employees · dedicated support · SLA."
          />
        </RadioGroup>
      </Row>
      <Row label="Selector cards · Tiles" note="2×2 tile cells — py-3.5 px-4 gap-2.5">
        <RadioGroup defaultValue="upi" variant="card" className="w-fit grid grid-cols-2 gap-3">
          {["UPI", "Net banking", "Card", "Wallet"].map((method) => (
            <RadioOption
              key={method}
              value={method.toLowerCase().replace(" ", "-")}
              label={method}
              className="py-3.5 px-4 gap-2.5"
            />
          ))}
        </RadioGroup>
      </Row>
      <Row
        label="Pill cards · Inline"
        note="Pill 42 · pad 18 · gap-9 — disabled pill sits on surface-pressed · the joined bar divides its segments"
      >
        <State label="Selected">
          <RadioGroup defaultValue="monthly" variant="pill">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
        <State label="Unselected">
          <RadioGroup variant="pill">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
        <State label="Disabled">
          <RadioGroup variant="pill">
            <RadioOption value="monthly" label="Monthly" disabled />
          </RadioGroup>
        </State>
        <State label="Joined bar">
          <RadioGroup defaultValue="monthly" variant="joined">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
            <RadioOption value="weekly" label="Weekly" />
          </RadioGroup>
        </State>
      </Row>
    </div>
  )
}

/** Messages — the group label rides 8px above the options; helper and error are 12px lines. */
function Messages() {
  return (
    <div className="flex flex-col">
      <Row label="Group label · Helper" note="Label 13 semibold ink · helper 12 muted · 8px above the options">
        <div className="flex flex-col gap-2">
          <Label className="text-ink">Pay frequency</Label>
          <p className="text-xs leading-[14px] text-muted-foreground">
            How often payroll runs — one choice per organization.
          </p>
          <RadioGroup defaultValue="monthly">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </div>
      </Row>
      <Row label="Error" note="Error 12 copper-red under the group · per-option lines ride inside the label">
        <div className="flex flex-col gap-2">
          <RadioGroup defaultValue="monthly">
            <RadioOption
              value="monthly"
              label="Monthly"
              description="Payslips on the last working day."
              hint="12 cycles a year."
            />
            <RadioOption value="quarterly" label="Quarterly" error="Pick one before running payroll." />
          </RadioGroup>
          <p className="text-xs leading-[14px] text-danger">Choose a pay frequency to continue.</p>
        </div>
      </Row>
    </div>
  )
}

/** Sizes — the dot, row, pill and label scale together. */
function Sizes() {
  return (
    <div className="flex flex-col">
      <Row label="Sizes" note="sm — dot 14 · row 24 · label 12 · default — dot 16 · row 28 · label 13 · lg — dot 20 · row 32 · label 14">
        <State label="sm">
          <RadioGroup defaultValue="monthly" size="sm">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
        <State label="default">
          <RadioGroup defaultValue="monthly">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
        <State label="lg">
          <RadioGroup defaultValue="monthly" size="lg">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
      </Row>
    </div>
  )
}

/** Orientation — the root lays out on the grid by default; flex flips it. */
function Orientations() {
  return (
    <div className="flex flex-col">
      <Row label="Vertical" note="Default · grid gap-3">
        <RadioGroup defaultValue="monthly">
          <RadioOption value="monthly" label="Monthly" />
          <RadioOption value="quarterly" label="Quarterly" />
          <RadioOption value="yearly" label="Yearly" />
        </RadioGroup>
      </Row>
      <Row label="Horizontal" note="Flex row · same gap rhythm">
        <RadioGroup defaultValue="monthly" className="flex flex-row gap-6">
          <RadioOption value="monthly" label="Monthly" />
          <RadioOption value="quarterly" label="Quarterly" />
          <RadioOption value="yearly" label="Yearly" />
        </RadioGroup>
      </Row>
    </div>
  )
}

/** States — default, disabled item, disabled group, invalid. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="Default" note="One option pre-selected">
        <State label="Monthly selected">
          <RadioGroup defaultValue="monthly">
            <RadioOption value="monthly" label="Monthly" />
            <RadioOption value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
      </Row>
      <Row label="Disabled item" note="Dot keeps the line ring · label sinks to muted 60">
        <RadioGroup defaultValue="monthly">
          <RadioOption value="monthly" label="Monthly" />
          <RadioOption value="quarterly" label="Quarterly" disabled />
        </RadioGroup>
      </Row>
      <Row label="Disabled group" note="Whole group locked — every dot stays on the line ring">
        <State label="All options sink to muted">
          <RadioGroup defaultValue="monthly" disabled>
            <RadioOption value="monthly" label="Monthly" disabled />
            <RadioOption value="quarterly" label="Quarterly" disabled />
          </RadioGroup>
        </State>
      </Row>
      <Row label="Invalid" note="aria-invalid dyes the dot ring danger">
        <State label="Selection required">
          <div className="flex flex-col gap-2">
            <RadioGroup>
              <LabeledItem id="si-regime" value="new" label="New regime" invalid />
              <LabeledItem id="si-regime-old" value="old" label="Old regime" invalid />
            </RadioGroup>
            <p className="text-xs leading-[14px] text-danger">
              Choose a tax regime to continue.
            </p>
          </div>
        </State>
      </Row>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 06</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Radio Group
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          One choice out of a few. A 16px dot on a 1.5px line ring — selected dyes
          the ring accent and fills an 8px accent dot. Four registers and three
          sizes share the same anatomy.
        </p>
        <Block title="Registers">
          <Registers />
        </Block>
        <Block title="Messages">
          <Messages />
        </Block>
        <Block title="Sizes">
          <Sizes />
        </Block>
        <Block title="Orientation">
          <Orientations />
        </Block>
        <Block title="States">
          <States />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          DOT 16 · RING 1.5PX ACCENT · ROW 28-40 · PILL 42 · PAD 18 · HELPER 12 MUTED · ERROR 12 COPPER-RED
        </p>
      </div>
    </div>
  )
}

/** Every variation on the light Paper board. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every variation on the dark Paper board. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** Single group driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <RadioGroup {...args} className={args.variant === "joined" ? undefined : "max-w-md"}>
        <RadioOption value="monthly" label="Monthly" description="12 cycles a year." />
        <RadioOption value="quarterly" label="Quarterly" description="4 cycles a year." />
        <RadioOption value="yearly" label="Yearly" description="1 cycle a year." />
      </RadioGroup>
    </div>
  ),
  args: {
    variant: "list",
    size: "default",
    defaultValue: "monthly",
    disabled: false,
    required: false,
  },
}

export const OnlyRegisters: Story = {
  render: () => (
    <Screen>
      <Block title="Registers">
        <Registers />
      </Block>
    </Screen>
  ),
}

export const OnlyMessages: Story = {
  render: () => (
    <Screen>
      <Block title="Messages">
        <Messages />
      </Block>
    </Screen>
  ),
}

export const OnlySizes: Story = {
  render: () => (
    <Screen>
      <Block title="Sizes">
        <Sizes />
      </Block>
    </Screen>
  ),
}

export const OnlyOrientations: Story = {
  render: () => (
    <Screen>
      <Block title="Orientation">
        <Orientations />
      </Block>
    </Screen>
  ),
}

export const OnlyStates: Story = {
  render: () => (
    <Screen>
      <Block title="States">
        <States />
      </Block>
    </Screen>
  ),
}
