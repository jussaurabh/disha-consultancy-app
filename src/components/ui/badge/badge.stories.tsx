import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bell, X } from "lucide-react"
import { Badge, BadgeCount } from "./badge"

/**
 * DC design system — Badge board (V1.0).
 *
 * Soft-tinted status pills: h-22 rounded-full, Inter 600 11px, inline padding
 * 10. Six board tones — default (accent-soft), solid, secondary, outline,
 * copper and destructive — plus ghost and link kept for compatibility.
 * Status dot is a 6px circle in bg-current. BadgeCount is an 18px min copper
 * bubble that offsets a parent icon's corner.
 */
const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Status pill — h-22 rounded-full with soft accent, copper or danger tints, border-line for outline and secondary. Sizes sm (18), default (22) and lg (26). The dot prop renders a 6px status dot in bg-current; BadgeCount is the copper count bubble for icon corners.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "solid",
        "secondary",
        "outline",
        "copper",
        "destructive",
        "ghost",
        "link",
      ],
      description: "Visual tone of the badge — six board tones plus ghost and link for compatibility.",
    },
    size: {
      control: "radio",
      options: ["sm", "default", "lg"],
      description: "sm drops to 18px with 10px type; lg lifts to 26px with 12px type.",
    },
    dot: {
      control: "boolean",
      description: "Renders a 6px status dot before the label in bg-current.",
    },
    asChild: {
      control: "boolean",
      description: "Render as a child component (for composition with links, buttons, etc.).",
    },
    className: { control: "text" },
  },
  args: {
    variant: "default",
    size: "default",
    dot: false,
    asChild: false,
  },
} satisfies Meta<typeof Badge>

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

/** The six board tones plus the compatibility ghost and link registers. */
function Variants() {
  return (
    <div className="flex flex-col">
      <Row label="Board tones" note="Soft tint fills · accent · copper · danger — no border">
        <Badge>Default</Badge>
        <Badge variant="solid">Solid</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="copper">Copper</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </Row>
      <Row label="Compatibility" note="Kept for existing screens — not on the board">
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </Row>
    </div>
  )
}

/** Status dot — a 6px circle in bg-current before the label. */
function StatusDot() {
  return (
    <div className="flex flex-col">
      <Row label="Dot" note="Inherits the badge tone through bg-current">
        <Badge dot>Active</Badge>
        <Badge variant="copper" dot>
          Pending
        </Badge>
        <Badge variant="destructive" dot>
          Failed
        </Badge>
        <Badge variant="outline" dot>
          Draft
        </Badge>
      </Row>
    </div>
  )
}

/** Shapes and sizes — pill is the default, tags go square with rounded-sm. */
function ShapesAndSizes() {
  return (
    <div className="flex flex-col">
      <Row label="Pill" note="Default radius — sm · default · lg">
        <Badge size="sm">sm</Badge>
        <Badge>Default</Badge>
        <Badge size="lg">lg</Badge>
      </Row>
      <Row label="Tag" note="rounded-sm lifts the corners for filter and label chips">
        <Badge size="sm" className="rounded-sm">
          sm
        </Badge>
        <Badge className="rounded-sm">Default</Badge>
        <Badge size="lg" className="rounded-sm">
          lg
        </Badge>
      </Row>
    </div>
  )
}

/** Count bubble — BadgeCount offsets the parent icon's corner. */
function CountOnIcon() {
  return (
    <div className="flex flex-col">
      <Row label="Count on icon" note="44px icon tile · 18px min copper bubble · offset right −8, top −6">
        <div className="relative inline-flex size-11 items-center justify-center rounded-lg border border-line bg-surface text-muted-foreground">
          <Bell aria-hidden className="size-5" />
          <BadgeCount>3</BadgeCount>
        </div>
        <div className="relative inline-flex size-11 items-center justify-center rounded-lg border border-line bg-surface text-muted-foreground">
          <Bell aria-hidden className="size-5" />
          <BadgeCount>99</BadgeCount>
        </div>
      </Row>
    </div>
  )
}

/** Chip — a dismissible badge with a 12px X icon. */
function Chip() {
  return (
    <div className="flex flex-col">
      <Row label="Chip" note="lg + rounded-sm · 12px X icon clears the chip">
        <Badge variant="secondary" size="lg" className="rounded-sm">
          Payroll run · Nov
          <X aria-hidden />
        </Badge>
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
          Badge
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Small labels that carry status at a glance. One pill anatomy — h-22, rounded-full,
          Inter 600 11px — tinted in six board tones, with a status dot and a copper count
          bubble for icon corners.
        </p>
        <Block title="Variants">
          <Variants />
        </Block>
        <Block title="Status · dot">
          <StatusDot />
        </Block>
        <Block title="Shapes & sizes">
          <ShapesAndSizes />
        </Block>
        <Block title="Count on icon">
          <CountOnIcon />
        </Block>
        <Block title="Chip">
          <Chip />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          BADGE 22 · SM 18 · LG 26 · DOT 6 · RADIUS 6 FOR TAGS
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

/** Badge driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-start justify-center bg-background p-10">
      <Badge {...args}>Badge content</Badge>
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

export const OnlyStatusDot: Story = {
  render: () => (
    <Screen>
      <Block title="Status · dot">
        <StatusDot />
      </Block>
    </Screen>
  ),
}

export const OnlyShapesAndSizes: Story = {
  render: () => (
    <Screen>
      <Block title="Shapes & sizes">
        <ShapesAndSizes />
      </Block>
    </Screen>
  ),
}

export const OnlyCountOnIcon: Story = {
  render: () => (
    <Screen>
      <Block title="Count on icon">
        <CountOnIcon />
      </Block>
    </Screen>
  ),
}

export const OnlyChip: Story = {
  render: () => (
    <Screen>
      <Block title="Chip">
        <Chip />
      </Block>
    </Screen>
  ),
}
