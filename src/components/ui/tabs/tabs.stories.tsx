import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Building2, CreditCard, Plus, Settings, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

/**
 * DC design system — Tabs board (V1.0).
 *
 * Radix tabs. Three TabsList registers: "default" — segmented accent-soft
 * track (dark: surface-pressed), active trigger lifts onto surface with a
 * hairline border and a 2px shadow; "line" — transparent track with a bottom
 * border, active trigger paints a 2px accent rule; "pill" — transparent
 * rounded-full triggers, active tints accent-soft with accent text.
 *
 * Triggers: Inter 13px · h-36px (h-40 on the line) · inactive 500 muted,
 * active 600 · icons 16 with gap-2 · copper count badge after the label ·
 * focus = 2px accent outline offset 2 · disabled = 40% opacity. Vertical
 * roots render the list as a 200px side-rail card. `scrollable` wraps the
 * list between chevrons with a right-edge fade. Keyboard: arrow keys, Home
 * and End.
 */
const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Radix tabs with three list registers. The default register is a segmented " +
          "accent-soft track, the line register is an underline with a 2px active rule, " +
          "the pill register uses soft rounded-full triggers. Triggers are Inter 13px on " +
          "a 36px frame (40px on the line), inactive muted, active semibold. Icons, " +
          "copper count badges, a 200px vertical side rail and a scrollable list with " +
          "chevrons. Arrow keys, Home and End move between triggers.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description:
        "horizontal stacks the list above the content; vertical lays the list beside it as a 200px rail card and stacks triggers full width, left aligned.",
    },
    activationMode: {
      control: "radio",
      options: ["automatic", "manual"],
      description:
        "automatic activates a tab on arrow-key focus; manual needs Enter or Space after focus.",
    },
    defaultValue: { control: "text", description: "Uncontrolled active tab value." },
    value: {
      control: "text",
      description: "Controlled active tab value — pair with onValueChange.",
    },
    className: { control: "text" },
  },
  args: {
    orientation: "horizontal",
    activationMode: "automatic",
    defaultValue: "overview",
  },
} satisfies Meta<typeof Tabs>

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

/** The three list registers — underline, boxed segmented and soft pill. */
function Styles() {
  return (
    <div className="flex flex-col">
      <Row label="Underline" note="Transparent track with a bottom border · active paints a 2px accent rule">
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="Boxed · Segmented" note="Accent-soft track · active lifts onto surface with a hairline border and a 2px shadow">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="Pill · Soft" note="Rounded-full triggers · active tints accent-soft with accent text">
        <Tabs defaultValue="overview">
          <TabsList variant="pill">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="With icons" note="16px icons with a gap-2 to the label">
        <Tabs defaultValue="add">
          <TabsList>
            <TabsTrigger value="add">
              <Plus aria-hidden />
              Add employee
            </TabsTrigger>
            <TabsTrigger value="compliance">
              Compliance
              <ShieldCheck aria-hidden />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="With counts" note="18px copper badge after the label — the count rides the trigger's gap-2">
        <Tabs defaultValue="employees">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees" count={128}>
              Employees
            </TabsTrigger>
            <TabsTrigger value="payroll" count={12}>
              Payroll
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
    </div>
  )
}

/** Trigger states — disabled sinks, focus paints the accent outline. */
function States() {
  return (
    <div className="flex flex-col">
      <Row
        label="Disabled · Focus"
        note="Disabled drops to 40% opacity and keeps no pointer events · focus paints a 2px accent outline, offset 2 — tab into the group to see it"
      >
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="locked" disabled>
              Locked
            </TabsTrigger>
            <TabsTrigger value="archived" disabled>
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
    </div>
  )
}

/** Orientation — the side rail and the scrollable overflow. */
function Orientation() {
  return (
    <div className="flex flex-col">
      <Row
        label="Side rail"
        note="Vertical lays the list beside the content as a 200px rail card · the board only shows the default register vertically"
      >
        <Tabs defaultValue="overview" orientation="vertical" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="flex flex-col gap-2 rounded-lg border border-line bg-field p-4">
            <span className="h-3 w-2/3 animate-skeleton-pulse rounded-full bg-line" />
            <span className="h-3 w-full animate-skeleton-pulse rounded-full bg-line" />
            <span className="h-3 w-1/2 animate-skeleton-pulse rounded-full bg-line" />
          </TabsContent>
          <TabsContent value="employees" className="flex flex-col gap-2 rounded-lg border border-line bg-field p-4">
            <span className="h-3 w-full animate-skeleton-pulse rounded-full bg-line" />
            <span className="h-3 w-3/4 animate-skeleton-pulse rounded-full bg-line" />
          </TabsContent>
          <TabsContent value="payroll" className="flex flex-col gap-2 rounded-lg border border-line bg-field p-4">
            <span className="h-3 w-1/2 animate-skeleton-pulse rounded-full bg-line" />
            <span className="h-3 w-2/3 animate-skeleton-pulse rounded-full bg-line" />
          </TabsContent>
        </Tabs>
      </Row>
      <Row
        label="Overflow · Scrollable"
        note="Chevrons page the list by 240px behind a right-edge fade · chevrons are verified manually; no scroll assertion exists."
      >
        <Tabs defaultValue="tab-3" className="w-full max-w-md">
          <TabsList scrollable>
            <TabsTrigger value="tab-1">Org profile</TabsTrigger>
            <TabsTrigger value="tab-2">Establishments</TabsTrigger>
            <TabsTrigger value="tab-3">Employees</TabsTrigger>
            <TabsTrigger value="tab-4">Payroll runs</TabsTrigger>
            <TabsTrigger value="tab-5">Statutory</TabsTrigger>
            <TabsTrigger value="tab-6">Reports</TabsTrigger>
            <TabsTrigger value="tab-7">Invites</TabsTrigger>
            <TabsTrigger value="tab-8">Audit log</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-3" className="rounded-lg border p-4 text-muted-foreground">
            The rail fades at the right edge — chevrons page the hidden tabs.
          </TabsContent>
          <TabsContent value="tab-4" className="rounded-lg border p-4 text-muted-foreground">
            Payroll runs panel.
          </TabsContent>
        </Tabs>
      </Row>
    </div>
  )
}

/** Controlled value — outside state drives the active tab. */
function Controlled() {
  const [value, setValue] = useState("general")

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2">
        <Caption>value: {value}</Caption>
        <Button variant="outline" size="sm" onClick={() => setValue("members")}>
          Jump to Members
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue("billing")}>
          Jump to Billing
        </Button>
      </div>
    </div>
  )
}

/** Each tab carries its own panel. */
function Content() {
  return (
    <Tabs defaultValue="org" className="w-full max-w-xl">
      <TabsList>
        <TabsTrigger value="org">Organization</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="org" className="rounded-lg border p-4 text-sm text-muted-foreground">
        Registered legal name, PF establishment IDs and payroll frequency live here.
      </TabsContent>
      <TabsContent value="people" className="rounded-lg border p-4 text-sm text-muted-foreground">
        84 employees across 3 units — Mysuru, Hubballi and remote.
      </TabsContent>
      <TabsContent value="billing" className="rounded-lg border p-4 text-sm text-muted-foreground">
        Plan renews on 01 Apr — invoice history and seats on the billing tab.
        <CreditCard aria-hidden className="ml-2 inline size-4" />
      </TabsContent>
    </Tabs>
  )
}

/** Keyboard navigation — Radix wires it, no code needed. */
function Keyboard() {
  return (
    <Row label="Keyboard" note="Focus a trigger — ← → (horizontal) · ↑ ↓ (vertical) · Home · End">
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
      </Tabs>
    </Row>
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
          Tabs
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Sections inside one view without leaving the page. Three registers — the segmented
          track, the underline and the soft pill — share one trigger anatomy: Inter 13px,
          inactive 500 muted, active 600.
        </p>
        <Block title="Styles">
          <Styles />
        </Block>
        <Block title="States">
          <States />
        </Block>
        <Block title="Orientation">
          <Orientation />
        </Block>
        <Block title="Controlled">
          <Controlled />
        </Block>
        <Block title="Content">
          <Content />
        </Block>
        <Block title="Keyboard">
          <Keyboard />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          TAB 40 · UNDERLINE 2PX · ICON 16 · BADGE 18 · ONE ACTIVE TAB PER GROUP · ARROWS MOVE ·
          ENTER SELECTS
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

/** Every variation on the dark board. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** Tabs driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-start justify-center bg-background p-10">
      <Tabs {...args} className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="rounded-lg border p-4 text-muted-foreground">
          Overview panel — controlled by the controls panel.
        </TabsContent>
        <TabsContent value="employees" className="rounded-lg border p-4 text-muted-foreground">
          Employees panel.
        </TabsContent>
        <TabsContent value="payroll" className="rounded-lg border p-4 text-muted-foreground">
          Payroll panel.
        </TabsContent>
      </Tabs>
    </div>
  ),
}

export const OnlyStyles: Story = {
  render: () => (
    <Screen>
      <Block title="Styles">
        <Styles />
      </Block>
    </Screen>
  ),
}

export const OnlyOrientation: Story = {
  render: () => (
    <Screen>
      <Block title="Orientation">
        <Orientation />
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

/** Real world — a settings card with tabbed sections. */
export const SettingsPanel: Story = {
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-background p-10">
      <div className="w-full max-w-xl rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Settings aria-hidden className="size-4 text-muted-foreground" />
          <h3 className="font-body text-sm font-semibold text-foreground">Organization settings</h3>
        </div>
        <Tabs defaultValue="org">
          <TabsList>
            <TabsTrigger value="org">
              <Building2 aria-hidden />
              Organization
            </TabsTrigger>
            <TabsTrigger value="people">
              <Users aria-hidden />
              People
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard aria-hidden />
              Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="org" className="pt-4 text-sm text-muted-foreground">
            Sri Venkateswara Textiles Pvt Ltd · PF establishment KRBNG/452 · monthly payroll.
          </TabsContent>
          <TabsContent value="people" className="pt-4 text-sm text-muted-foreground">
            84 employees · 3 consultants · invites pending for 2 admins.
          </TabsContent>
          <TabsContent value="billing" className="pt-4 text-sm text-muted-foreground">
            Growth plan · renews 01 Apr 2027 · 5 of 25 seats used.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
}
