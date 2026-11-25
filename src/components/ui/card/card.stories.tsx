import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

/**
 * DC design system — Cards board (DC DESIGN SYSTEM · V1.0).
 *
 * Radius 14 (rounded-xl) · padding 20 (p-5) · gap-4 · 1px border-line on
 * bg-field. CardHeader groups title, description and a trailing action in
 * a [1fr_auto] grid · CardContent carries the body · CardFooter rides a
 * 1px top divider with no fill.
 *
 * Size "sm" tightens gap and padding to 16 — use it for dense grids.
 * `selected` adds the 1.5px accent border and the accent-soft tint.
 */
const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cards sit on bg-field with a 1px border-line — radius 14 (rounded-xl), gap-4, padding 20 (p-5). CardHeader holds the title, description and trailing action; CardFooter carries the actions on a 1px top divider. Use size sm for dense grids; use selected for the 1.5px accent state.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "default pads 20 · sm tightens gap and padding to 16",
    },
    selected: {
      control: "boolean",
      description: "1.5px accent border + accent-soft tint — selection state",
    },
    className: {
      control: "text",
      description: "Width and layout live here — cards grow to their parent",
    },
  },
  args: {
    size: "default",
    selected: false,
  },
} satisfies Meta<typeof Card>

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

/** Inline svg placeholder so the media card needs no network. */
const ORG_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='320' viewBox='0 0 640 320'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%232F6B5B'/%3E%3Cstop offset='1' stop-color='%231E4237'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='320' fill='url(%23g)'/%3E%3Ccircle cx='540' cy='60' r='90' fill='%23FFFFFF' fill-opacity='0.08'/%3E%3Ccircle cx='80' cy='280' r='70' fill='%23FFFFFF' fill-opacity='0.06'/%3E%3Ctext x='32' y='280' font-family='sans-serif' font-size='22' font-weight='600' fill='%23FFFFFF' fill-opacity='0.92'%3ESri Venkateswara Textiles%3C/text%3E%3C/svg%3E"

/** The three compositions: header + action, bare content, footer actions. */
function Anatomy() {
  return (
    <div className="flex flex-col">
      <Row label="Header + action" note="Title, description and a trailing action">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acme Manufacturing</CardTitle>
            <CardDescription>Client organization · onboarded 12 Jan 2019</CardDescription>
            <CardAction>
              <Button variant="ghost" size="icon-sm" aria-label="Organization settings">
                <Settings aria-hidden />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            84 employees · next payroll run 01 Dec.
          </CardContent>
        </Card>
      </Row>
      <Row label="Content only" note="A bare card for compact info">
        <Card className="w-96">
          <CardContent className="text-muted-foreground">
            PF e-crash return filed for Nov 2019 — acknowledgement KRNG/2019/4471.
          </CardContent>
        </Card>
      </Row>
      <Row label="With footer" note="Footer rides a 1px line divider — no fill">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Delete organization</CardTitle>
            <CardDescription>
              This removes all payroll history for Acme Manufacturing.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Row>
    </div>
  )
}

/** Padding scale: 20 on default, 16 on sm. */
function Sizes() {
  return (
    <div className="flex flex-wrap items-start gap-6 border-b border-border py-7">
      <State label="Default · 20">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Default</CardTitle>
            <CardDescription>gap-4 · p-5</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            The everyday card shell for dashboards and forms.
          </CardContent>
        </Card>
      </State>
      <State label="Small · 16">
        <Card size="sm" className="w-80">
          <CardHeader>
            <CardTitle>Small</CardTitle>
            <CardDescription>gap-3 · p-4</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            For dense grids and list-adjacent cards.
          </CardContent>
        </Card>
      </State>
    </div>
  )
}

/** Shell states — default, selected via prop, disabled via pressed fill. */
function States() {
  return (
    <div className="flex flex-wrap items-start gap-6 border-b border-border py-7">
      <State label="Default">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Default</CardTitle>
            <CardDescription>Field fill · 1px line border</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            The resting shell for every card surface.
          </CardContent>
        </Card>
      </State>
      <State label="Selected · 1.5px accent">
        <Card selected className="w-80">
          <CardHeader>
            <CardTitle>Selected</CardTitle>
            <CardDescription>border-accent · bg-accent-soft</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Pickable cards — org tiles, payment methods, plan choice.
          </CardContent>
        </Card>
      </State>
      <State label="Disabled">
        <Card className="w-80 bg-surface-pressed text-muted-foreground">
          <CardHeader>
            <CardTitle>Disabled</CardTitle>
            <CardDescription>Pressed fill · dimmed text</CardDescription>
          </CardHeader>
          <CardContent>
            Not available on the current plan.
          </CardContent>
        </Card>
      </State>
    </div>
  )
}

/** Media card — an img as the first child clips into the top radius. */
function Media() {
  return (
    <div className="flex flex-wrap items-start gap-6 border-b border-border py-7">
      <State label="Image header">
        <Card className="w-96">
          <img src={ORG_IMAGE} alt="Sri Venkateswara Textiles factory unit" />
          <CardHeader>
            <CardTitle>Sri Venkateswara Textiles</CardTitle>
            <CardDescription>Unit 1 — Mysuru · 84 employees</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" size="sm">
              Open organization
            </Button>
          </CardContent>
        </Card>
      </State>
      <State label="Image + footer">
        <Card className="w-96">
          <img src={ORG_IMAGE} alt="Sri Venkateswara Textiles factory unit" />
          <CardHeader>
            <CardTitle>Payroll run · December</CardTitle>
            <CardDescription>Draft — 84 employees · ₹41,20,500 net</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button size="sm">Review run</Button>
            <Button variant="ghost" size="sm">
              Discard
            </Button>
          </CardFooter>
        </Card>
      </State>
    </div>
  )
}

/** Cards doing real product work — stat tiles and a settings form. */
function InContext() {
  return (
    <div className="flex flex-col">
      <Row label="Stat cards" note="Board internals — 10px label · 30px figure · delta chip">
        {(
          [
            ["Employees", "84", "+6 this month"],
            ["Pending runs", "3", "2 need approval"],
            ["Next run", "01 Dec", "Acme Manufacturing"],
          ] as const
        ).map(([label, value, note]) => (
          <Card key={label} className="w-44">
            <CardContent className="flex flex-col items-start gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-3 text-muted-foreground">
                {label}
              </span>
              <span className="font-display text-[30px] font-extrabold leading-[34px] tracking-[-0.01em]">
                {value}
              </span>
              <span className="inline-flex h-5 items-center rounded bg-accent-soft px-2 text-[11px] font-semibold text-accent">
                {note}
              </span>
            </CardContent>
          </Card>
        ))}
      </Row>
      <Row label="Settings form" note="Card + Label + Checkbox + footer actions">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Payroll alerts</CardTitle>
            <CardDescription>Choose what reaches the consultant inbox.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Checkbox id="card-alert-run" defaultChecked />
              <Label htmlFor="card-alert-run">Payroll run completed</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="card-alert-fail" defaultChecked />
              <Label htmlFor="card-alert-fail">Salary transfer failed</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="card-alert-report" />
              <Label htmlFor="card-alert-report">Monthly report ready</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">Save preferences</Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </CardFooter>
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
          Cards
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Surfaces that group related content and actions. Radius 14 · 1px border-line ·
          padding 20 — size sm tightens to 16, selected lifts to a 1.5px accent border.
        </p>
        <Block title="Anatomy">
          <Anatomy />
        </Block>
        <Block title="Sizes">
          <Sizes />
        </Block>
        <Block title="States">
          <States />
        </Block>
        <Block title="With media">
          <Media />
        </Block>
        <Block title="In context">
          <InContext />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          RADIUS 14 · PADDING 20 · TITLE 14/600 · BODY 12 MUTED · FOOTER = 1PX TOP ·
          SELECTED = 1.5PX ACCENT
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

/** One card driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-64 items-start justify-center bg-background p-10">
      <Card className="w-96" {...args}>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Manage the client company profile.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon-sm" aria-label="Organization settings">
              <Settings aria-hidden />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          84 employees · next payroll run 01 Dec.
        </CardContent>
      </Card>
    </div>
  ),
}

export const OnlyAnatomy: Story = {
  render: () => (
    <Screen>
      <Block title="Anatomy">
        <Anatomy />
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

export const OnlyMedia: Story = {
  render: () => (
    <Screen>
      <Block title="With media">
        <Media />
      </Block>
    </Screen>
  ),
}

export const OnlyInContext: Story = {
  render: () => (
    <Screen>
      <Block title="In context">
        <InContext />
      </Block>
    </Screen>
  ),
}
