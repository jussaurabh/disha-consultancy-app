import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * DC design system — "06 / Radio Group" board (V1.0).
 *
 * Spec: aspect-square size-4 · rounded-full · border-input · checked dots
 * primary (CircleIcon size-2 fill-primary) · focus-visible ring 3px at 50%
 * · disabled 50% opacity · aria-invalid dyes the border destructive.
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
          "Single-select choice group on the 4×4 dot shell — the checked dot dyes primary. Use for one choice out of 2–5 visible options; reach for a select when the list is longer.",
      },
    },
  },
  argTypes: {
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
      description: "Disables the whole group — items sink to 50% opacity.",
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

/** Labeled item — the pattern every group in the product uses. */
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
      <Label htmlFor={id} className={disabled ? "opacity-50" : undefined}>
        {label}
      </Label>
    </div>
  )
}

/** Orientation — the root lays out on the grid by default; flex flips it. */
function Orientations() {
  return (
    <div className="flex flex-col">
      <Row label="Vertical" note="Default · grid gap-3">
        <RadioGroup defaultValue="monthly" className="gap-3">
          <LabeledItem id="o-monthly" value="monthly" label="Monthly" />
          <LabeledItem id="o-quarterly" value="quarterly" label="Quarterly" />
          <LabeledItem id="o-yearly" value="yearly" label="Yearly" />
        </RadioGroup>
      </Row>
      <Row label="Horizontal" note="Flex row · same gap rhythm">
        <RadioGroup defaultValue="monthly" className="flex flex-row gap-6">
          <LabeledItem id="oh-monthly" value="monthly" label="Monthly" />
          <LabeledItem id="oh-quarterly" value="quarterly" label="Quarterly" />
          <LabeledItem id="oh-yearly" value="yearly" label="Yearly" />
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
            <LabeledItem id="s-monthly" value="monthly" label="Monthly" />
            <LabeledItem id="s-quarterly" value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
      </Row>
      <Row label="Disabled item" note="One option unavailable · 50% opacity">
        <RadioGroup defaultValue="monthly">
          <LabeledItem id="sd-monthly" value="monthly" label="Monthly" />
          <LabeledItem id="sd-quarterly" value="quarterly" label="Quarterly" disabled />
        </RadioGroup>
      </Row>
      <Row label="Disabled group" note="Whole group locked">
        <State label="All items sink to 50%">
          <RadioGroup defaultValue="monthly" disabled>
            <LabeledItem id="sg-monthly" value="monthly" label="Monthly" />
            <LabeledItem id="sg-quarterly" value="quarterly" label="Quarterly" />
          </RadioGroup>
        </State>
      </Row>
      <Row label="Invalid" note="aria-invalid dyes the border destructive">
        <State label="Selection required">
          <div className="flex flex-col gap-2">
            <RadioGroup>
              <LabeledItem id="si-regime" value="new" label="New regime" invalid />
              <LabeledItem id="si-regime-old" value="old" label="Old regime" invalid />
            </RadioGroup>
            <p className="font-body text-xs leading-4 text-destructive">
              Choose a tax regime to continue.
            </p>
          </div>
        </State>
      </Row>
    </div>
  )
}

/** Labels with helper descriptions under each choice. */
function WithDescriptions() {
  return (
    <div className="flex flex-col">
      <Row label="With descriptions" note="Label 13/600 · helper 12 muted">
        <RadioGroup defaultValue="new">
          <div className="flex items-start gap-2.5">
            <RadioGroupItem value="new" id="d-new" className="mt-0.5" />
            <div className="flex flex-col gap-1">
              <Label htmlFor="d-new">New regime</Label>
              <span className="font-body text-xs leading-4 text-muted-foreground">
                Lower slabs, no exemptions — the default for new employees.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <RadioGroupItem value="old" id="d-old" className="mt-0.5" />
            <div className="flex flex-col gap-1">
              <Label htmlFor="d-old">Old regime</Label>
              <span className="font-body text-xs leading-4 text-muted-foreground">
                Higher slabs with HRA, 80C and other exemptions.
              </span>
            </div>
          </div>
        </RadioGroup>
      </Row>
    </div>
  )
}

/** Payroll settings — the real-world shape the group ships for. */
function PayrollExample() {
  return (
    <div className="flex flex-col">
      <Row label="Pay frequency" note="Required choice · one primary selection">
        <div className="w-96 rounded-xl border border-border bg-card p-5">
          <Label required className="mb-4 block">
            Pay frequency
          </Label>
          <RadioGroup defaultValue="monthly" name="pay-frequency">
            <LabeledItem id="f-monthly" value="monthly" label="Monthly — 12 cycles a year" />
            <LabeledItem id="f-semi-monthly" value="semi-monthly" label="Semi-monthly — 24 cycles a year" />
            <LabeledItem id="f-weekly" value="weekly" label="Weekly — 52 cycles a year" />
          </RadioGroup>
        </div>
      </Row>
    </div>
  )
}

/** Option cards — radio items as selectable cards (Paper 225-2 / 229-2 pattern). */
function OptionCards() {
  return (
    <div className="flex flex-col">
      <Row label="Plan selection" note="Card-style radios · checked = primary border + accent bg · hover lifts">
        <RadioGroup defaultValue="pro" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              value: "starter",
              title: "Starter",
              price: "₹0",
              period: "/month",
              features: ["Up to 5 employees", "Basic payroll", "Email support"],
              popular: false,
            },
            {
              value: "pro",
              title: "Professional",
              price: "₹2,999",
              period: "/month",
              features: ["Up to 50 employees", "Advanced payroll", "Priority support", "Compliance reports"],
              popular: true,
            },
            {
              value: "enterprise",
              title: "Enterprise",
              price: "₹9,999",
              period: "/month",
              features: ["Unlimited employees", "Full suite", "Dedicated support", "Custom integrations", "SLA"],
              popular: false,
            },
          ].map((plan) => (
            <div key={plan.value} className="relative">
              <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} className="sr-only" />
              <label
                htmlFor={`plan-${plan.value}`}
                className={cn(
                  "relative flex h-full flex-col cursor-pointer rounded-xl border-2 bg-card transition-all duration-150",
                  "hover:shadow-lg hover:-translate-y-0.5",
                  "data-[state=checked]:border-primary data-[state=checked]:bg-accent-soft",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <h3 className="font-heading text-lg font-semibold text-foreground">{plan.title}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-semibold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-2 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 size-1.5 rounded-full bg-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center">
                    <RadioGroupItem value={plan.value} id={`plan-${plan.value}-radio`} className="mt-0.5" />
                    <span className="sr-only">Select {plan.title} plan</span>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </RadioGroup>
      </Row>

      <Row label="Payment method" note="Horizontal cards · icon + label · compact">
        <RadioGroup defaultValue="upi" className="flex flex-wrap gap-4">
          {[
            { value: "upi", label: "UPI", icon: "📱" },
            { value: "netbanking", label: "Net Banking", icon: "🏦" },
            { value: "card", label: "Card", icon: "💳" },
            { value: "wallet", label: "Wallet", icon: "👛" },
          ].map((method) => (
            <div key={method.value} className="relative">
              <RadioGroupItem value={method.value} id={`pay-${method.value}`} className="sr-only" />
              <label
                htmlFor={`pay-${method.value}`}
                className={cn(
                  "relative flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 bg-card px-4 py-3 transition-all duration-150",
                  "hover:shadow-md hover:border-line-strong",
                  "data-[state=checked]:border-primary data-[state=checked]:bg-accent-soft data-[state=checked]:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                <span className="text-2xl" aria-hidden>{method.icon}</span>
                <span className="font-medium text-sm">{method.label}</span>
                <RadioGroupItem value={method.value} id={`pay-${method.value}-radio`} className="sr-only" />
                <span className="sr-only">Select {method.label}</span>
              </label>
            </div>
          ))}
        </RadioGroup>
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
          One choice out of a few. Aspect-square 4 dot · primary dot when checked
          · focus ring 3px · disabled 50% · invalid border dyes destructive.
        </p>
        <Block title="Orientation">
          <Orientations />
        </Block>
        <Block title="States">
          <States />
        </Block>
        <Block title="With descriptions">
          <WithDescriptions />
        </Block>
        <Block title="Real world">
          <PayrollExample />
        </Block>
        <Block title="Option cards (Paper 225-2 / 229-2)">
          <OptionCards />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Single choice only · Always pre-select one option · Every item gets a label
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
      <RadioGroup {...args} className="flex flex-row gap-6">
        <LabeledItem id="pg-monthly" value="monthly" label="Monthly" />
        <LabeledItem id="pg-quarterly" value="quarterly" label="Quarterly" />
        <LabeledItem id="pg-yearly" value="yearly" label="Yearly" />
      </RadioGroup>
    </div>
  ),
  args: {
    defaultValue: "monthly",
    disabled: false,
    required: false,
  },
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

export const OnlyDescriptions: Story = {
  render: () => (
    <Screen>
      <Block title="With descriptions">
        <WithDescriptions />
      </Block>
    </Screen>
  ),
}

export const OnlyRealWorld: Story = {
  render: () => (
    <Screen>
      <Block title="Real world">
        <PayrollExample />
      </Block>
    </Screen>
  ),
}

export const OnlyOptionCards: Story = {
  render: () => (
    <Screen>
      <Block title="Option cards (Paper 225-2 / 229-2)">
        <OptionCards />
      </Block>
    </Screen>
  ),
}
