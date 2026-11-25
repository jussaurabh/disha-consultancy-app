import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InfoNote } from "./info-note"

/**
 * DC design system — Info note board (V1.0).
 *
 * Inline callouts with a 2px left bar and radius 6 on the right corners only.
 * Three board tones — hint (copper), confirm (accent) and caution (danger) —
 * on bg-surface, flipping to bg-ground when the note sits inside a card.
 * Optional small-caps title tinted to the variant.
 */
const meta = {
  title: "UI/InfoNote",
  component: InfoNote,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Inline note — 2px left bar, radius 6 on the right corners, padding 12/14, Inter 400 12px at 150%. Bars: hint · copper, confirm · accent, caution · danger. Fill is surface, ground when nested in a card. Optional small-caps title tinted to the variant.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["hint", "confirm", "caution"],
      description: "Bar and title tone — hint (copper), confirm (accent) and caution (danger).",
    },
    nested: {
      control: "boolean",
      description: "Inside a card the note flips from surface to ground.",
    },
    title: {
      control: "text",
      description: "Optional small-caps heading tinted to the variant (ink / accent / danger).",
    },
    className: { control: "text" },
  },
  args: {
    variant: "hint",
    nested: false,
  },
} satisfies Meta<typeof InfoNote>

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
      <div className="flex flex-col items-start gap-5">{children}</div>
    </div>
  )
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex max-w-lg flex-col items-stretch gap-3">
      {children}
      <Caption>{label}</Caption>
    </div>
  )
}

/** The three board tones — hint carries no title by default. */
function Variants() {
  return (
    <div className="flex flex-col">
      <Row label="Variants" note="Bar 2px · copper · accent · danger — title tints to the tone">
        <State label="hint">
          <InfoNote>Optional sections can be completed later.</InfoNote>
        </State>
        <State label="hint · titled">
          <InfoNote title="Draft">Nothing here is shared until you publish.</InfoNote>
        </State>
        <State label="confirm">
          <InfoNote variant="confirm" title="Verified">All checks pass — payroll is ready to run.</InfoNote>
        </State>
        <State label="caution">
          <InfoNote variant="caution" title="PAN mismatch">The PAN does not match the name on record.</InfoNote>
        </State>
      </Row>
    </div>
  )
}

/** Inside a card the note flips from surface to ground. */
function Nested() {
  return (
    <div className="flex flex-col">
      <Row label="Nested" note="Inside a card the note flips to ground">
        <div className="max-w-lg rounded-sm border border-line bg-surface p-4">
          <InfoNote nested>Bank details sync nightly — edits appear after the next run.</InfoNote>
        </div>
      </Row>
    </div>
  )
}

/** A form card that leans on one note to explain the field. */
function InUse() {
  return (
    <div className="flex flex-col">
      <Row label="In use" note="A form-style card using one note">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Add signatory</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="signatory-pan">PAN</Label>
              <Input id="signatory-pan" placeholder="ABCDE1234F" />
              <InfoNote variant="confirm" title="Verified">PAN matches the name on record.</InfoNote>
            </div>
            <div>
              <Button size="sm">Save signatory</Button>
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
          <Caption>Component library — 02</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Info note
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Inline callouts that explain a field or flag a state. One anatomy — 2px left bar,
          radius 6 on the right corners, padding 12/14, Inter 400 12px at 150% — in three
          board tones, flipping to ground when the note sits inside a card.
        </p>
        <Block title="Variants">
          <Variants />
        </Block>
        <Block title="Nested">
          <Nested />
        </Block>
        <Block title="In use">
          <InUse />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          RADIUS 6 · BAR 2PX · PAD 12/14 · INTER 400 12PX 150%
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

/** Every variation on the dark board — the toolbar theme drives the register. */
export const Dark: Story = {
  render: () => <Board />,
}

/** InfoNote driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-start justify-center bg-background p-10">
      <div className="w-full max-w-lg">
        <InfoNote {...args}>Optional sections can be completed later.</InfoNote>
      </div>
    </div>
  ),
}

export const OnlyVariants: Story = {
  render: () => (
    <Screen>
      <Block title="Variants">
        <Variants />
      </Block>
    </Screen>
  ),
}

export const OnlyNested: Story = {
  render: () => (
    <Screen>
      <Block title="Nested">
        <Nested />
      </Block>
    </Screen>
  ),
}

export const OnlyInUse: Story = {
  render: () => (
    <Screen>
      <Block title="In use">
        <InUse />
      </Block>
    </Screen>
  ),
}
