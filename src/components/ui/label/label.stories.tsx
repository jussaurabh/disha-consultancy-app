import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@/components/ui/input"
import { Label } from "./label"

/**
 * DC design system — "04 / Inputs" board (LABELS, DC DESIGN SYSTEM · V1.0).
 *
 * Spec: Inter 600 · 13px/16px · ink · a copper asterisk rides the text when
 * `required` is set. The asterisk is decorative — set `required` on the field
 * itself for semantics.
 *
 * States: default · required · error (data-error="true" dyes the text
 * destructive — FormLabel sets this) · disabled (a parent with `group` +
 * data-disabled="true" dims the label). Pair with ui/input and ui/form.
 */
const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Field label on the 13/600 Inter spec. The copper asterisk marks required fields; data-error dyes the text destructive and a disabled field group dims it.",
      },
    },
  },
  argTypes: {
    htmlFor: { control: "text", description: "id of the field this label names — clicks focus the field" },
    required: {
      control: "boolean",
      description: "Rides a decorative copper asterisk. Set required on the field for semantics.",
    },
    children: { control: "text" },
    className: { control: "text" },
    "data-error": {
      control: "boolean",
      description: "Set by FormLabel — dyes the text destructive.",
    },
  },
  args: {
    children: "Company name",
    required: false,
    htmlFor: "label-playground",
  },
} satisfies Meta<typeof Label>

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
      <div className="flex flex-wrap items-center gap-8">{children}</div>
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

/** Default · required · error · disabled — the four label states. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="Default" note="Inter 600 · 13px/16px · ink">
        <State label="Default">
          <Label htmlFor="states-default">Company name</Label>
        </State>
      </Row>
      <Row label="Required" note="Copper asterisk — decorative only">
        <State label="Required">
          <Label htmlFor="states-required" required>
            Company name
          </Label>
        </State>
      </Row>
      <Row label="Error" note="data-error=&quot;true&quot; dyes the text destructive (FormLabel sets this)">
        <State label="Error">
          <Label htmlFor="states-error" data-error="true" className="data-[error=true]:text-destructive">
            PF number
          </Label>
        </State>
      </Row>
      <Row label="Disabled" note="Parent group data-disabled=&quot;true&quot; dims the label">
        <State label="Disabled">
          <div className="group flex flex-col gap-2" data-disabled="true">
            <Label htmlFor="states-disabled">Company name</Label>
            <Input id="states-disabled" defaultValue="Sri Venkateswara Textiles" disabled />
          </div>
        </State>
      </Row>
    </div>
  )
}

/** Labels wired to fields — clicking the label focuses the input. */
function WithFields() {
  return (
    <div className="flex flex-col">
      <Row label="With input" note="htmlFor wires the click to the field">
        <div className="flex w-80 flex-col gap-2">
          <Label htmlFor="with-field-company">Company name</Label>
          <Input id="with-field-company" defaultValue="Sri Venkateswara Textiles Pvt Ltd" />
        </div>
      </Row>
      <Row label="Required + helper" note="Asterisk on the label · helper text below the field">
        <div className="flex w-80 flex-col gap-2">
          <Label htmlFor="with-field-required" required>
            Company name
          </Label>
          <Input id="with-field-required" placeholder="e.g. Sri Venkateswara Textiles" />
          <p className="font-body text-xs leading-4 text-muted-foreground">
            The registered legal name — shown across payroll documents.
          </p>
        </div>
      </Row>
      <Row label="Error" note="Destructive label over an invalid field">
        <div className="flex w-80 flex-col gap-2">
          <Label htmlFor="with-field-error" required data-error="true" className="data-[error=true]:text-destructive">
            PF number
          </Label>
          <Input id="with-field-error" defaultValue="KRBNG/452" aria-invalid="true" />
          <p className="font-body text-xs leading-4 text-destructive">
            Establishment ID looks invalid — check the regional format.
          </p>
        </div>
      </Row>
      <Row label="Disabled" note="Label and field sink together">
        <div className="group flex w-80 flex-col gap-2" data-disabled="true">
          <Label htmlFor="with-field-disabled">CIN</Label>
          <Input id="with-field-disabled" defaultValue="CNO-2019-4471" disabled />
        </div>
      </Row>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 04</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Labels
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Field labels for the inputs board — Inter 600 · 13px/16px · ink. A copper asterisk marks
          required fields; the asterisk is decorative, so semantics live on the field.
        </p>
        <Block title="States">
          <States />
        </Block>
        <Block title="With fields">
          <WithFields />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Inter 600 · 13px/16px · Copper asterisk is decorative · data-error dyes destructive
        </p>
      </div>
    </div>
  )
}

/** Every state on the light Paper board. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every state on the dark Paper board. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** Single label driven by the controls panel. */
export const Playground: Story = {
  render: (args) => {
    const { "data-error": dataError, ...labelArgs } = args
    return (
      <div className="flex min-h-52 items-center justify-center bg-background p-10">
        <div className="flex w-80 flex-col gap-2">
          <Label
            {...labelArgs}
            data-error={dataError || undefined}
            className={dataError ? "data-[error=true]:text-destructive" : undefined}
          />
          <Input id={labelArgs.htmlFor} placeholder="e.g. Sri Venkateswara Textiles" />
        </div>
      </div>
    )
  },
  args: {
    children: "Company name",
    required: false,
    htmlFor: "label-playground",
    "data-error": false,
  },
}

/** Default · required · error · disabled, side by side. */
export const OnlyStates: Story = {
  render: () => (
    <Screen>
      <Block title="States">
        <States />
      </Block>
    </Screen>
  ),
}

/** Labels paired with inputs, helpers and errors. */
export const OnlyFields: Story = {
  render: () => (
    <Screen>
      <Block title="With fields">
        <WithFields />
      </Block>
    </Screen>
  ),
}
