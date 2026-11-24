import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRight, Plus, Settings, Trash2 } from "lucide-react"
import { Button } from "./button"

/**
 * DC design system — "12 / Buttons" board (V1.0).
 *
 * Radius 10 · Inter 600 · heights 36 / 44 / 52 · icon buttons 44 square, 38 circle.
 *
 * Rules: one PRIMARY cta per view. DANGER is never the primary cta.
 *
 * Variants: default (primary) · secondary/outline (quiet) · ghost (text only)
 * · destructive (danger) · destructive-outline (quiet danger) · link.
 * Sizes: sm (36) · default (44) · lg (52) · icon · icon-sm · icon-circle (38).
 */
const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Buttons use one rhythm across the product. Pick one primary cta per view. Use danger only for destructive actions.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "destructive-outline", "link"],
      description: "default is the primary cta. secondary and outline are quiet actions.",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon", "icon-sm", "icon-circle"],
      description: "Heights 36 / 44 / 52. Icon sizes are 44, 32 and 38 square.",
    },
    disabled: { control: "boolean" },
    loading: {
      control: "boolean",
      description:
        "Shows the DashRing spinner, sets aria-busy and blocks clicks. The spinner inherits the button text color.",
    },
  },
  args: {
    children: "Create organization",
    variant: "default",
    size: "default",
    loading: false,
  },
} satisfies Meta<typeof Button>

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

/** Grouped variants from the Paper "12 / Buttons" board. */
function Variants() {
  return (
    <div className="flex flex-col">
      <Row label="Primary" note="The one green cta per view">
        <Button>Create organization</Button>
      </Row>
      <Row label="Secondary" note="Outline · quiet actions">
        <Button variant="secondary">Save draft</Button>
        <Button variant="secondary">Export</Button>
      </Row>
      <Row label="Outline" note="Outline · same quiet register">
        <Button variant="outline">Export</Button>
      </Row>
      <Row label="Ghost" note="Text only · lowest weight">
        <Button variant="ghost">Cancel</Button>
      </Row>
      <Row label="Danger" note="Destructive">
        <Button variant="destructive">
          <Trash2 aria-hidden />
          Delete organization
        </Button>
      </Row>
      <Row label="Danger outline" note="Destructive · quiet">
        <Button variant="destructive-outline">Remove access</Button>
      </Row>
      <Row label="Link" note="Inline navigation">
        <Button variant="link">View payroll policy</Button>
      </Row>
      <Row label="Disabled" note="Unavailable action">
        <Button disabled>Back</Button>
        <Button variant="secondary" disabled>
          Back
        </Button>
      </Row>
    </div>
  )
}

/** Height scale from the Paper board: 36, 44, 52. */
function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-10 border-b border-border py-7">
      <State label="Small · 36">
        <Button size="sm">Create organization</Button>
      </State>
      <State label="Medium · 44">
        <Button size="default">Create organization</Button>
      </State>
      <State label="Large · 52">
        <Button size="lg">Create organization</Button>
      </State>
    </div>
  )
}

/** Interaction states shown with their resolved styles. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="Primary" note="Default · hover · pressed · disabled">
        <State label="Default">
          <Button>Create organization</Button>
        </State>
        <State label="Hover">
          <Button className="bg-accent-hover">Create organization</Button>
        </State>
        <State label="Pressed">
          <Button className="translate-y-px bg-accent-active">Create organization</Button>
        </State>
        <State label="Disabled">
          <Button disabled>Create organization</Button>
        </State>
      </Row>
      <Row label="Secondary" note="Default · hover · pressed · disabled">
        <State label="Default">
          <Button variant="secondary">Save draft</Button>
        </State>
        <State label="Hover">
          <Button variant="secondary" className="border-line-strong">
            Save draft
          </Button>
        </State>
        <State label="Pressed">
          <Button variant="secondary" className="translate-y-px border-line-stronger bg-surface-pressed">
            Save draft
          </Button>
        </State>
        <State label="Disabled">
          <Button variant="secondary" disabled>
            Save draft
          </Button>
        </State>
      </Row>
    </div>
  )
}

/** Loading state — DashRing spinner inherits the variant's text color. */
function Loading() {
  return (
    <div className="flex flex-col">
      <Row label="Primary" note="Spinner follows the button text color">
        <Button loading>Processing payroll</Button>
      </Row>
      <Row label="Secondary" note="Quiet loading">
        <Button variant="secondary" loading>
          Save draft
        </Button>
      </Row>
      <Row label="Outline" note="Quiet loading">
        <Button variant="outline" loading>
          Export
        </Button>
      </Row>
      <Row label="Ghost" note="Text only">
        <Button variant="ghost" loading>
          Cancel
        </Button>
      </Row>
      <Row label="Danger" note="Destructive">
        <Button variant="destructive" loading>
          Delete organization
        </Button>
      </Row>
      <Row label="Danger outline" note="Destructive · quiet">
        <Button variant="destructive-outline" loading>
          Remove access
        </Button>
      </Row>
      <Row label="Sizes" note="36 · 44 · 52">
        <Button size="sm" loading>
          Processing
        </Button>
        <Button size="default" loading>
          Processing
        </Button>
        <Button size="lg" loading>
          Processing
        </Button>
      </Row>
      <Row label="Icon" note="Square 44 · circle 38">
        <Button size="icon" loading aria-label="Saving" />
        <Button variant="secondary" size="icon-circle" loading aria-label="Saving" />
      </Row>
    </div>
  )
}

/** Icon placements from the Paper board. */
function WithIcons() {
  return (
    <div className="flex flex-col">
      <Row label="Leading" note="Icon before the label">
        <Button>
          <Plus aria-hidden />
          Create organization
        </Button>
      </Row>
      <Row label="Trailing" note="Icon after the label">
        <Button>
          Continue to payroll
          <ArrowRight aria-hidden />
        </Button>
      </Row>
      <Row label="Icon · circle" note="38 square · quiet">
        <Button variant="secondary" size="icon-circle" aria-label="Settings">
          <Settings aria-hidden />
        </Button>
      </Row>
      <Row label="Icon · square" note="44 square · quiet">
        <Button variant="secondary" size="icon" aria-label="Settings">
          <Settings aria-hidden />
        </Button>
      </Row>
      <Row label="Icon · primary" note="44 square · one per view">
        <Button size="icon" aria-label="Add organization">
          <Plus aria-hidden />
        </Button>
      </Row>
      <Row label="Icon · small" note="32 square · quiet">
        <Button variant="secondary" size="icon-sm" aria-label="Settings">
          <Settings aria-hidden />
        </Button>
      </Row>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 01</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Buttons
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Interactive actions across the product — one rhythm, one radius, one weight. Radius 10
          · Inter 600 · heights 36 / 44 / 52.
        </p>
        <Block title="Variants">
          <Variants />
        </Block>
        <Block title="Sizes">
          <Sizes />
        </Block>
        <Block title="States">
          <States />
        </Block>
        <Block title="Loading">
          <Loading />
        </Block>
        <Block title="With icons">
          <WithIcons />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Radius 10 · One primary cta per view · Danger is never the primary cta
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

/** Single cta driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <Button {...args} />
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

export const OnlySizes: Story = {
  render: () => (
    <Screen>
      <Block title="Sizes">
        <Sizes />
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

export const OnlyLoading: Story = {
  render: () => (
    <Screen>
      <Block title="Loading">
        <Loading />
      </Block>
    </Screen>
  ),
}

export const OnlyIcons: Story = {
  render: () => (
    <Screen>
      <Block title="With icons">
        <WithIcons />
      </Block>
    </Screen>
  ),
}
