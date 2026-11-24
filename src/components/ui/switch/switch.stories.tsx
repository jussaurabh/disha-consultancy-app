import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Switch } from "./switch"
import { Label } from "@/components/ui/label"

/**
 * DC design system — "Switch" board (DC DESIGN SYSTEM · V1.0).
 *
 * Binary setting, never a destructive confirmation. Track 32 × 18.4
 * (24 × 14 small) · thumb 16 (12 small) · radius full.
 *
 * Checked paints the brand accent (bg-primary) · unchecked sits on
 * bg-input (bg-input/80 in dark) · focus = ring 3px ring/50 + border-ring
 * · disabled = opacity-50, cursor-not-allowed.
 */
const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Binary toggle on the DC shell. Track 32 × 18.4 (24 × 14 small) · thumb 16 (12). Checked = brand accent, unchecked = input fill, focus = 3px ring at 50%. Use for settings that apply instantly — never for destructive confirmations.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "default = 32 × 18.4 track, 16 thumb. sm = 24 × 14 track, 12 thumb.",
    },
    checked: {
      control: "boolean",
      description: "Controlled state. Pair with onCheckedChange; prefer defaultChecked in stories.",
    },
    defaultChecked: { control: "boolean", description: "Unchecked state on mount." },
    disabled: {
      control: "boolean",
      description: "opacity-50 · cursor-not-allowed. Locked settings stay checked and disabled.",
    },
    required: { control: "boolean" },
    name: { control: "text", description: "Submitted with the owning form when checked." },
  },
  args: {
    size: "default",
    defaultChecked: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Switch>

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

/** Unchecked · checked · focus · disabled — with their resolved styles. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="Default" note="Unchecked · checked · focus · disabled">
        <State label="Unchecked">
          <Switch />
        </State>
        <State label="Checked">
          <Switch defaultChecked />
        </State>
        <State label="Focus">
          <Switch className="border-ring ring-[3px] ring-ring/50" />
        </State>
        <State label="Disabled">
          <Switch disabled />
        </State>
        <State label="Disabled · checked">
          <Switch defaultChecked disabled />
        </State>
      </Row>
    </div>
  )
}

/** Track scale: 32 × 18.4 default · 24 × 14 small. */
function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-10 border-b border-border py-7">
      <State label="Default · 32 × 18.4">
        <div className="flex items-center gap-3">
          <Switch />
          <Switch defaultChecked />
        </div>
      </State>
      <State label="Small · 24 × 14">
        <div className="flex items-center gap-3">
          <Switch size="sm" />
          <Switch size="sm" defaultChecked />
        </div>
      </State>
    </div>
  )
}

/** Labels ride to the side — clickable through htmlFor. */
function WithLabel() {
  return (
    <div className="flex flex-col">
      <Row label="Switch first" note="Label trails the control">
        <div className="flex items-center gap-3">
          <Switch id="sw-auto-payroll" defaultChecked />
          <Label htmlFor="sw-auto-payroll">Auto-run payroll</Label>
        </div>
      </Row>
      <Row label="Label first" note="Label leads · quiet reads left to right">
        <div className="flex items-center gap-3">
          <Label htmlFor="sw-payslips">Email payslips</Label>
          <Switch id="sw-payslips" />
        </div>
      </Row>
      <Row label="Small + label" note="sm switch pairs with dense rows">
        <div className="flex items-center gap-3">
          <Switch id="sw-sms" size="sm" defaultChecked />
          <Label htmlFor="sw-sms">SMS payment alerts</Label>
        </div>
      </Row>
      <Row label="Locked" note="Disabled · checked — plan-controlled">
        <div className="flex items-center gap-3 opacity-100">
          <Switch id="sw-lock" defaultChecked disabled />
          <Label htmlFor="sw-lock">Lock processed months</Label>
          <Caption>Starter plan</Caption>
        </div>
      </Row>
    </div>
  )
}

/** A settings card — the real habitat of a switch. */
function InContext() {
  return (
    <div className="border-b border-border py-7">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <p className="font-body text-sm font-semibold text-foreground">Payroll preferences</p>
          <p className="mt-0.5 font-body text-xs text-muted-foreground">
            Applies to every organization under Sri Venkateswara Consultancy.
          </p>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-8 px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="ctx-auto">Auto-run payroll</Label>
              <span className="font-body text-xs text-muted-foreground">
                Runs the cycle on the 1st, 00:00 IST.
              </span>
            </div>
            <Switch id="ctx-auto" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-8 px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="ctx-payslips">Email payslips</Label>
              <span className="font-body text-xs text-muted-foreground">
                Sends signed PDFs after every processed run.
              </span>
            </div>
            <Switch id="ctx-payslips" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-8 px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="ctx-sms">SMS payment alerts</Label>
              <span className="font-body text-xs text-muted-foreground">
                ₹0.15 per SMS · billed monthly.
              </span>
            </div>
            <Switch id="ctx-sms" size="sm" />
          </div>
          <div className="flex items-center justify-between gap-8 px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="ctx-lock">Lock processed months</Label>
              <span className="font-body text-xs text-muted-foreground">
                Starter plan · managed by billing.
              </span>
            </div>
            <Switch id="ctx-lock" defaultChecked disabled />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Submits with the owning form — auto_payroll=on when checked. */
function FormIntegration() {
  return (
    <div className="border-b border-border py-7">
      <form className="flex w-full max-w-md items-center justify-between gap-8 rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="form-switch">Round off salaries</Label>
          <span className="font-body text-xs text-muted-foreground">
            Submits <code className="text-[11px]">round_off=on</code> when checked.
          </span>
        </div>
        <Switch id="form-switch" name="round_off" defaultChecked />
      </form>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 07</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Switches
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Binary settings that apply instantly. Track 32 × 18.4 · thumb 16 · checked paints the
          brand accent. One switch per row, label on the quiet side.
        </p>
        <Block title="States">
          <States />
        </Block>
        <Block title="Sizes">
          <Sizes />
        </Block>
        <Block title="With label">
          <WithLabel />
        </Block>
        <Block title="In context — settings card">
          <InContext />
        </Block>
        <Block title="Form integration">
          <FormIntegration />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Track 32 × 18.4 · Small 24 × 14 · Checked = primary · Disabled = 50% + not-allowed
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

/** Every variation on the light board. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every variation on the dark board — unchecked track sinks to input/80. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** Single switch driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <Switch {...args} />
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

export const OnlySizes: Story = {
  render: () => (
    <Screen>
      <Block title="Sizes">
        <Sizes />
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

export const OnlyInContext: Story = {
  render: () => (
    <Screen>
      <Block title="In context — settings card">
        <InContext />
      </Block>
    </Screen>
  ),
}
