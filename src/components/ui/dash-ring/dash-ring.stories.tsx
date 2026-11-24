import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DashRing } from "./dash-ring"
import { Button } from "@/components/ui/button"

/**
 * DC design system — DashRing spinner (DC DESIGN SYSTEM · V1.0).
 *
 * A dashed ring spinning on a 10% track — SVG, stroke="currentColor", so the
 * spinner inherits the parent text color. The Button mounts it at size-4
 * (16px) and size-3.5 (14px) on sm; icon buttons use size-4.
 *
 * Color always comes from the text color of the context — never a hard fill.
 */
const meta = {
  title: "UI/DashRing",
  component: DashRing,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The loading spinner — a dashed ring animating on a 10% track. stroke='currentColor' inherits the parent text color, so the color context decides the look. Buttons mount it at size-4 (size-3.5 on sm).",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description:
        "Size + color live here via currentColor — size-4 in buttons, size-3.5 on sm",
    },
  },
  args: {
    className: "size-4",
  },
} satisfies Meta<typeof DashRing>

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

/** Spinner chip that mirrors a Button variant's fill + text color. */
function Chip({
  className,
  size,
}: {
  className: string
  size: string
}) {
  return (
    <span
      className={`inline-flex h-11 items-center gap-2.5 rounded-lg border border-transparent px-5.5 text-sm font-semibold ${className}`}
    >
      <DashRing className={size} />
    </span>
  )
}

/** The px scale — buttons ship 14 (sm) and 16 (default/icon). */
function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-10 border-b border-border py-7">
      <State label="12 · size-3">
        <DashRing className="size-3" />
      </State>
      <State label="14 · size-3.5">
        <DashRing className="size-3.5" />
      </State>
      <State label="16 · size-4">
        <DashRing className="size-4" />
      </State>
      <State label="20 · size-5">
        <DashRing className="size-5" />
      </State>
      <State label="24 · size-6">
        <DashRing className="size-6" />
      </State>
    </div>
  )
}

/** One spinner, one color per button register — currentColor does the work. */
function ColorContexts() {
  return (
    <div className="flex flex-col">
      <Row label="Primary" note="text-primary-foreground on accent">
        <Chip className="bg-accent text-primary-foreground" size="size-4" />
      </Row>
      <Row label="Secondary" note="text-ink on surface">
        <Chip className="border-line bg-surface text-ink" size="size-4" />
      </Row>
      <Row label="Ghost" note="text-muted-foreground">
        <Chip className="text-muted-foreground" size="size-4" />
      </Row>
      <Row label="Danger" note="text-danger-foreground on danger">
        <Chip className="bg-danger text-danger-foreground" size="size-4" />
      </Row>
      <Row label="Inline" note="text-primary on plain background">
        <DashRing className="size-4 text-primary" />
      </Row>
    </div>
  )
}

/** The spinner at work inside the real Button. */
function InButton() {
  return (
    <div className="flex flex-col">
      <Row label="Sizes" note="size-4 · size-3.5 on sm">
        <Button loading>Processing payroll</Button>
        <Button size="sm" loading>
          Processing
        </Button>
      </Row>
      <Row label="Variants" note="Spinner follows each variant's text color">
        <Button variant="secondary" loading>
          Save draft
        </Button>
        <Button variant="ghost" loading>
          Cancel
        </Button>
        <Button variant="destructive" loading>
          Delete organization
        </Button>
      </Row>
      <Row label="Icon" note="Square 44 · circle 38">
        <Button size="icon" loading aria-label="Saving" />
        <Button variant="secondary" size="icon-circle" loading aria-label="Saving" />
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
          DashRing
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          The loading spinner — a dashed ring on a 10% track. stroke currentColor ·
          buttons mount size-4, sm mounts size-3.5.
        </p>
        <Block title="Sizes">
          <Sizes />
        </Block>
        <Block title="Color contexts">
          <ColorContexts />
        </Block>
        <Block title="In button">
          <InButton />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          stroke currentColor · size-4 in buttons · size-3.5 on sm
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

/** One spinner driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10 text-foreground">
      <DashRing {...args} />
    </div>
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

export const OnlyColorContexts: Story = {
  render: () => (
    <Screen>
      <Block title="Color contexts">
        <ColorContexts />
      </Block>
    </Screen>
  ),
}

export const OnlyInButton: Story = {
  render: () => (
    <Screen>
      <Block title="In button">
        <InButton />
      </Block>
    </Screen>
  ),
}
