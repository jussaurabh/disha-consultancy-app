import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * DC design system — Checkboxes board (DC DESIGN SYSTEM · V1.0).
 *
 * 16px shell · radius 6 (rounded-md) · border-primary · checked fills
 * --color-primary (#2F6B5B) with a white Check in --color-primary-foreground.
 * Disabled sinks to 50% opacity. Error dyes the border copper (--color-copper
 * #B0653A) and speaks in a message below.
 *
 * Indeterminate: Radix supports `checked="indeterminate"`, but the base
 * component always renders the Check icon — pass INDETERMINATE_DASH (below)
 * as className to swap in the dash until the component ships one.
 */
const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Checkbox on the 16px shell — border-primary, checked fills primary (#2F6B5B) with a white check, radius 6. Disabled sinks to 50% opacity. Error dyes the border copper (#B0653A). Pair with Label and set checked='indeterminate' for select-all parents.",
      },
    },
  },
  argTypes: {
    checked: {
      control: "select",
      options: [false, true, "indeterminate"],
      description: "false unchecked · true checked · 'indeterminate' for select-all parents",
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text", description: "Form name when submitted with a value" },
    value: { control: "text", description: "Submitted value when checked" },
    className: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Class override that swaps the Check icon for a dash while the state is
 * indeterminate — the intended visual for select-all parents.
 */
const INDETERMINATE_DASH = [
  "data-[state=indeterminate]:[&>span>svg]:hidden",
  "data-[state=indeterminate]:[&>span]:after:content-['']",
  "data-[state=indeterminate]:[&>span]:after:h-[3px]",
  "data-[state=indeterminate]:[&>span]:after:w-2",
  "data-[state=indeterminate]:[&>span]:after:rounded-full",
  "data-[state=indeterminate]:[&>span]:after:bg-current",
].join(" ")

/** Error state — copper border per the brand dyes. */
const ERROR_RING = "border-copper"

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
      <div className="flex flex-wrap items-center gap-3">{children}</div>
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

/** Every resolved state on the 16px shell. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="States" note="Unchecked · checked · indeterminate · disabled · error">
        <State label="Default">
          <Checkbox aria-label="Accept payroll terms" />
        </State>
        <State label="Checked">
          <Checkbox defaultChecked aria-label="Accept payroll terms" />
        </State>
        <State label="Indeterminate">
          <Checkbox
            checked="indeterminate"
            className={INDETERMINATE_DASH}
            aria-label="Select all employees"
          />
        </State>
        <State label="Disabled">
          <Checkbox disabled aria-label="Locked preference" />
        </State>
        <State label="Disabled · checked">
          <Checkbox disabled defaultChecked aria-label="Locked preference" />
        </State>
        <State label="Error">
          <Checkbox
            className={ERROR_RING}
            aria-invalid="true"
            aria-label="Declare state registration"
          />
        </State>
      </Row>
    </div>
  )
}

/** Label integration — right, with helper, and the copper error message. */
function WithLabel() {
  return (
    <div className="flex flex-col">
      <Row label="Label right" note="Label rides the control">
        <div className="flex items-center gap-2.5">
          <Checkbox id="cb-terms" />
          <Label htmlFor="cb-terms">I agree to the payroll terms</Label>
        </div>
      </Row>
      <Row label="Label + helper" note="Helper 12 muted below">
        <div className="flex items-start gap-2.5">
          <Checkbox id="cb-auto" className="mt-0.5" defaultChecked />
          <div className="flex flex-col gap-1">
            <Label htmlFor="cb-auto">Auto-run payroll</Label>
            <span className="font-body text-xs leading-4 text-muted-foreground">
              Runs the cycle on the 1st of every month without asking.
            </span>
          </div>
        </div>
      </Row>
      <Row label="Error" note="Copper border · copper message">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <Checkbox id="cb-error" className={ERROR_RING} aria-invalid="true" />
            <Label htmlFor="cb-error">Declare.stateRegistration</Label>
          </div>
          <span className="font-body text-xs leading-4 text-copper">
            Confirm the declaration to continue.
          </span>
        </div>
      </Row>
      <Row label="Disabled with label" note="Both sink to 50%">
        <div className="flex items-center gap-2.5">
          <Checkbox id="cb-locked" disabled defaultChecked />
          <Label htmlFor="cb-locked">Locked by superadmin</Label>
        </div>
      </Row>
    </div>
  )
}

/** Select-all parent rides indeterminate while children are partial. */
function SelectAll() {
  return (
    <div className="flex flex-col">
      <Row label="Select all" note="Parent indeterminate · children mixed">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="cb-all"
              checked="indeterminate"
              className={INDETERMINATE_DASH}
              aria-label="Select all employees"
            />
            <Label htmlFor="cb-all" className="text-sm">
              All employees
            </Label>
          </div>
          <div className="ml-6 flex flex-col gap-2.5">
            {(
              [
                ["cb-e1", "Aarav Sharma", true],
                ["cb-e2", "Diya Patel", true],
                ["cb-e3", "Kiran Rao", false],
              ] as const
            ).map(([id, name, checked]) => (
              <div key={id} className="flex items-center gap-2.5">
                <Checkbox id={id} defaultChecked={checked} />
                <Label htmlFor={id} className="font-normal">
                  {name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </Row>
      <Row label="In a card" note="Preferences grouped on the card shell">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what reaches the consultant inbox.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Checkbox id="cb-card-run" defaultChecked />
              <Label htmlFor="cb-card-run">Payroll run completed</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="cb-card-fail" defaultChecked />
              <Label htmlFor="cb-card-fail">Salary transfer failed</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="cb-card-report" />
              <Label htmlFor="cb-card-report">Monthly report ready</Label>
            </div>
          </CardContent>
        </Card>
      </Row>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Checkboxes
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Binary choices on the 16px shell. Checked fills primary #2F6B5B · error dyes
          copper #B0653A · disabled sinks to 50%.
        </p>
        <Block title="States">
          <States />
        </Block>
        <Block title="With label">
          <WithLabel />
        </Block>
        <Block title="Selection & context">
          <SelectAll />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          16px shell · radius 6 · primary #2F6B5B · copper #B0653A for errors
        </p>
      </div>
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

/** One checkbox driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <div className="flex items-center gap-2.5">
        <Checkbox id="playground-checkbox" {...args} />
        <Label htmlFor="playground-checkbox">Enable auto-run</Label>
      </div>
    </div>
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

export const OnlyWithLabel: Story = {
  render: () => (
    <Screen>
      <Block title="With label">
        <WithLabel />
      </Block>
    </Screen>
  ),
}

export const OnlySelection: Story = {
  render: () => (
    <Screen>
      <Block title="Selection & context">
        <SelectAll />
      </Block>
    </Screen>
  ),
}
