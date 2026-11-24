import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "./separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

/**
 * DC design system — "07 / Separator" board (V1.0).
 *
 * Spec: 1px hairline on bg-border · horizontal h-px w-full · vertical
 * w-px self-stretch · shrink-0.
 *
 * Rules: decorative by default — screen readers skip it. Set
 * `decorative={false}` only when the divider carries meaning (a titled
 * rule, a section landmark).
 */
const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "1px hairline divider on bg-border. Horizontal spans full width, vertical stretches with its flex parent. Decorative by default — screen readers skip it; pass decorative={false} when the divider carries meaning.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "horizontal draws h-px w-full · vertical draws w-px self-stretch.",
    },
    decorative: {
      control: "boolean",
      description:
        "Default true — renders a div and is skipped by assistive tech. False renders role=\"separator\" so it is announced.",
    },
    className: { control: "text", description: "Extra classes — my-*, opacity and the like." },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
} satisfies Meta<typeof Separator>

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

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">{children}</div>
    </div>
  )
}

/** Orientation — horizontal is the default; vertical stretches in a flex row. */
function Orientations() {
  return (
    <div className="flex flex-col">
      <Row label="Horizontal" note="Default · h-px w-full">
        <State label="Full width">
          <div className="w-96">
            <Separator />
          </div>
        </State>
      </Row>
      <Row label="Vertical" note="w-px · stretches with the flex parent">
        <State label="Self stretch">
          <div className="flex h-16 items-center gap-6">
            <span className="font-body text-sm text-foreground">Section A</span>
            <Separator orientation="vertical" />
            <span className="font-body text-sm text-foreground">Section B</span>
            <Separator orientation="vertical" />
            <span className="font-body text-sm text-foreground">Section C</span>
          </div>
        </State>
      </Row>
    </div>
  )
}

/** Usage contexts — card body, stat rows, between form sections. */
function Usages() {
  return (
    <div className="flex flex-col">
      <Row label="In a card" note="Header · body · footer divided">
        <div className="w-96 overflow-hidden rounded-xl border border-border bg-card">
          <div className="px-5 py-4">
            <p className="font-body text-sm font-semibold text-foreground">Sri Venkateswara Textiles</p>
            <p className="font-body text-xs text-muted-foreground">CIN U29299KA2019PTC144782</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-body text-xs text-muted-foreground">Employees</span>
            <span className="font-body text-sm font-semibold text-foreground">148</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-body text-xs text-muted-foreground">Active pay runs</span>
            <span className="font-body text-sm font-semibold text-foreground">2</span>
          </div>
        </div>
      </Row>
      <Row label="Form sections" note="Organization · then statutory details">
        <div className="w-96 space-y-5">
          <div className="space-y-2">
            <Label required htmlFor="sep-company">Company name</Label>
            <Input id="sep-company" defaultValue="Sri Venkateswara Textiles Pvt Ltd" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label required htmlFor="sep-pan">Company PAN</Label>
            <Input id="sep-pan" placeholder="e.g. AABCS1429B" />
          </div>
        </div>
      </Row>
      <Row label="With spacing" note="Own the rhythm — add my-* on the hairline">
        <State label="my-6 inside a summary">
          <div className="w-96">
            <p className="font-body text-sm text-foreground">Gross earnings</p>
            <p className="font-body text-sm text-muted-foreground">Basic + HRA + allowances</p>
            <Separator className="my-6" />
            <p className="font-body text-sm font-semibold text-foreground">Total deductions</p>
            <p className="font-body text-sm text-muted-foreground">PF + TDS + professional tax</p>
          </div>
        </State>
      </Row>
    </div>
  )
}

/** Accessibility — decorative is skipped, semantic is announced. */
function Accessibility() {
  return (
    <div className="flex flex-col">
      <Row label="Decorative · default" note="Renders a div · hidden from the a11y tree">
        <State label="decorative={true}">
          <div className="w-96">
            <p className="font-body text-sm text-foreground">Above the line</p>
            <Separator className="my-3" />
            <p className="font-body text-sm text-foreground">Below the line</p>
          </div>
        </State>
      </Row>
      <Row label="Semantic" note={'Renders role="separator" · announced as a divider'}>
        <State label="decorative={false}">
          <div className="w-96">
            <p className="font-body text-sm text-foreground">Personal details</p>
            <Separator className="my-3" decorative={false} aria-label="End of personal details" />
            <p className="font-body text-sm text-foreground">Bank details</p>
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
          <Caption>Component library — 07</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Separator
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          A 1px hairline on bg-border. Horizontal spans full width, vertical
          stretches with its flex parent. Decorative by default — keep it that
          way unless the divider carries meaning.
        </p>
        <Block title="Orientation">
          <Orientations />
        </Block>
        <Block title="Usage">
          <Usages />
        </Block>
        <Block title="Accessibility">
          <Accessibility />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          1px · bg-border · Decorative by default · Meaning gets decorative={"{false}"}
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

/** One divider driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      {args.orientation === "vertical" ? (
        <div className="flex h-24 items-center gap-6">
          <span className="font-body text-sm text-foreground">Section A</span>
          <Separator {...args} />
          <span className="font-body text-sm text-foreground">Section B</span>
        </div>
      ) : (
        <div className="w-96 space-y-4">
          <span className="font-body text-sm text-foreground">Section A</span>
          <Separator {...args} />
          <span className="font-body text-sm text-foreground">Section B</span>
        </div>
      )}
    </div>
  ),
  args: {
    orientation: "horizontal",
    decorative: true,
  },
}

export const OnlyOrientation: Story = {
  render: () => (
    <Screen>
      <Block title="Orientation">
        <Orientations />
      </Block>
    </Screen>
  ),
}

export const OnlyUsage: Story = {
  render: () => (
    <Screen>
      <Block title="Usage">
        <Usages />
      </Block>
    </Screen>
  ),
}

export const OnlyAccessibility: Story = {
  render: () => (
    <Screen>
      <Block title="Accessibility">
        <Accessibility />
      </Block>
    </Screen>
  ),
}
