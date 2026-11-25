import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Stepper, type StepperStep } from "./stepper"
import { StepperDots } from "./stepper-dots"
import { StepperProgress } from "./stepper-progress"
import { StepperCards } from "./stepper-cards"

const STEPS: StepperStep[] = [
  { title: "Company", subtitle: "Registration basics · 8 fields" },
  { title: "Contact", subtitle: "Address & communication · 7 fields" },
  { title: "Bank", subtitle: "Salary disbursement · 4 fields" },
  { title: "Payroll", subtitle: "Tax, leave & overtime · 15 fields" },
  { title: "PF", subtitle: "Provident fund · 16 fields" },
  { title: "ESI", subtitle: "State insurance · 8 fields" },
]

const meta = {
  title: "UI/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Vertical numbered rail with five states: completed (check), current (number + Current badge), upcoming (border), error (danger fill + ring), locked (dashed + dim). Controlled via `current` index. Supports `orientation` (vertical/horizontal) and `size` (default/compact).",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "Layout direction. Vertical is the default rail; horizontal places labels below circles.",
    },
    size: {
      control: "radio",
      options: ["default", "compact"],
      description: "Compact uses 24px circles, hides subtitles, and tightens row padding. Vertical only.",
    },
    current: {
      control: "number",
      description: "Zero-based index of the active step. Indices < current render completed; current may equal steps.length (all complete).",
    },
    onStepSelect: { action: "step-select" },
  },
  args: {
    orientation: "vertical",
    size: "default",
    current: 0,
  },
} satisfies Meta<typeof Stepper>

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

const WithErrorSteps: StepperStep[] = STEPS.map((s, i) =>
  i === 2 ? { ...s, state: "error" as const } : s
)

const WithLockedSteps: StepperStep[] = STEPS.map((s, i) =>
  i === 4 ? { ...s, state: "locked" as const } : s
)

function Default() {
  return <Stepper steps={STEPS} current={0} />
}

function MidWizard() {
  return <Stepper steps={STEPS} current={2} />
}

function WithError() {
  return <Stepper steps={WithErrorSteps} current={2} />
}

function WithLocked() {
  return <Stepper steps={WithLockedSteps} current={2} />
}

function AllCompleted() {
  return <Stepper steps={STEPS} current={6} />
}

function Clickable() {
  return <Stepper steps={STEPS} current={1} onStepSelect={(i) => console.log("select", i)} />
}

function DarkStory() {
  return (
    <div className="dark bg-ground p-8">
      <Stepper steps={STEPS} current={2} />
    </div>
  )
}

export const Light: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Stepper — Vertical
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Controlled vertical rail with five states. Circle 29px, connector 1px rail at left 14px,
          Current = accent + soft pill badge, Error = danger fill + 3px ring, Locked = dashed + dim.
        </p>
        <Block title="States">
          <Row label="Default (current=0)" note="First step current, rest upcoming">
            <Default />
          </Row>
          <Row label="Mid-wizard (current=2)" note="Steps 1–2 completed, step 3 current">
            <MidWizard />
          </Row>
          <Row label="With error" note="Step 3 error, step 3 current">
            <WithError />
          </Row>
          <Row label="With locked" note="Step 5 locked, step 3 current">
            <WithLocked />
          </Row>
          <Row label="All completed (current=6)" note="All steps show check">
            <AllCompleted />
          </Row>
          <Row label="Clickable" note="onStepSelect fires on click">
            <Clickable />
          </Row>
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          STEPPER VERTICAL · CIRCLE 29 · CONNECTOR 1px · RAIL LEFT 14
        </p>
      </div>
    </div>
  ),
}

export const HorizontalDefault: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Stepper — Horizontal
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Horizontal rail with labels below circles. Rail fills left-to-right with accent.
          Current step holds the only accent circle with number.
        </p>
        <Block title="Horizontal">
          <Row label="Default (current=2)" note="Bank current — mirrors design sheet">
            <Stepper steps={STEPS} current={2} orientation="horizontal" />
          </Row>
          <Row label="All completed (current=6)" note="All segments filled accent">
            <Stepper steps={STEPS} current={6} orientation="horizontal" />
          </Row>
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          STEPPER HORIZONTAL · CIRCLE 29 · CONNECTOR 2px · W-[118px]
        </p>
      </div>
    </div>
  ),
}

export const HorizontalAllCompleted: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Stepper — Horizontal All Completed
        </h2>
        <Block title="Horizontal">
          <Row label="All completed (current=6)" note="All segments filled accent">
            <Stepper steps={STEPS} current={6} orientation="horizontal" />
          </Row>
        </Block>
      </div>
    </div>
  ),
}

export const HorizontalDark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <Stepper steps={STEPS} current={2} orientation="horizontal" />
    </div>
  ),
}

export const Dark: Story = {
  render: () => <DarkStory />,
}

export const Compact: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Stepper — Compact
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Compact rail with 24px circles, titles only (no subtitles), tighter row padding.
          Titles carry state by color; Current badge still shows.
        </p>
        <Block title="Compact">
          <Row label="Default (current=2)" note="24px circles, titles only, pt-1 pb-3.5, gap-x-3">
            <Stepper steps={STEPS} current={2} size="compact" />
          </Row>
        </Block>
      </div>
    </div>
  ),
}

export const CompactDark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <Stepper steps={STEPS} current={2} size="compact" />
    </div>
  ),
}

export const Dots: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          StepperDots — Compact Dots
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Compact dots for dialog headers and narrow forms. No per-step chrome; current step name sits beneath the rail.
        </p>
        <Block title="Dots">
          <Row label="Default (current=2)" note="Step 3 of 6 · Bank details">
            <StepperDots
              steps={STEPS}
              current={2}
              caption={<>Step 3 of 6 · <span className="font-semibold text-ink">Bank details</span></>}
            />
          </Row>
        </Block>
      </div>
    </div>
  ),
}

export const DotsDark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <StepperDots
        steps={STEPS}
        current={2}
        caption={<>Step 3 of 6 · <span className="font-semibold text-ink">Bank details</span></>}
      />
    </div>
  ),
}

export const Progress: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          StepperProgress — Segmented Progress
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Segmented progress for long flows and reviewers. Single 6px track replaces per-step circles; segment labels stay caps.
        </p>
        <Block title="Progress">
          <Row label="Default (current=2, progress=0.45)" note="Mirrors design sheet — current segment ~45% filled">
            <StepperProgress steps={STEPS} current={2} progress={0.45} />
          </Row>
        </Block>
      </div>
    </div>
  ),
}

export const ProgressDark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <StepperProgress steps={STEPS} current={2} progress={0.45} />
    </div>
  ),
}

export const Cards: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          StepperCards — Step Cards
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Step cards for clickable rails in dialogs and settings. Current card is the only tinted one; others stay quiet and enterable.
        </p>
        <Block title="Cards">
          <Row label="Default (current=1)" note="Contact current — mirrors design sheet">
            <StepperCards steps={STEPS} current={1} />
          </Row>
        </Block>
      </div>
    </div>
  ),
}

export const CardsClickable: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <Block title="Cards Clickable">
          <Row label="With onStepSelect" note="Cards render as buttons">
            <StepperCards steps={STEPS} current={1} onStepSelect={(i) => console.log("select", i)} />
          </Row>
        </Block>
      </div>
    </div>
  ),
}

export const CardsDark: Story = {
  render: () => (
    <div className="dark bg-ground p-8">
      <StepperCards steps={STEPS} current={1} />
    </div>
  ),
}