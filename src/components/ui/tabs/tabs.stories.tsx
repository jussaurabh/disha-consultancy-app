import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Building2, CreditCard, Plus, Settings, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

/**
 * DC design system — Tabs board (V1.0).
 *
 * Radix tabs. Two TabsList registers: "default" — muted pill container
 * (bg-muted, h-8 horizontal), active trigger = bg-background + text-foreground
 * + shadow-sm; "line" — transparent container, gap-1, active trigger shows a
 * 2px bottom rule (horizontal) or right bar (vertical) via ::after.
 *
 * Triggers: rounded-md · px-1.5 py-0.5 · text-sm font-medium · gap-1.5 ·
 * icons 16 with data-icon="inline-start" | "inline-end". Disabled = 50%
 * opacity, no pointer events. Keyboard: ← → ↑ ↓ · Home · End.
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
          "Radix tabs with two list registers — default (muted pill, h-8 horizontal) and line (transparent with an active rule). Triggers are rounded-md, text-sm font-medium, gap-1.5. Arrow keys, Home and End move between triggers.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description:
        "horizontal stacks the list above the content; vertical lays the list beside it and stacks triggers full width, left aligned.",
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

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      {children}
      <Caption>{label}</Caption>
    </div>
  )
}

/** The two TabsList registers — muted pill and transparent line. */
function Variants() {
  return (
    <div className="flex flex-col">
      <Row label="Default" note="bg-muted pill · h-8 · active lifts onto background + shadow-sm">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="Line" note="Transparent · gap-1 · active rule sits 5px under the trigger">
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
    </div>
  )
}

/** Orientation — the list reads above the content or beside it. */
function Orientation() {
  return (
    <div className="flex flex-col">
      <Row label="Horizontal" note="List above · triggers flex-1 across the container">
        <Tabs defaultValue="profile" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="rounded-lg border p-4 text-muted-foreground">
            Horizontal content — arrows move ← →.
          </TabsContent>
          <TabsContent value="security" className="rounded-lg border p-4 text-muted-foreground">
            Security content.
          </TabsContent>
        </Tabs>
      </Row>
      <Row label="Vertical" note="List beside · triggers stack full width, left aligned">
        <Tabs defaultValue="profile" orientation="vertical" className="w-full max-w-md">
          <TabsList className="w-40">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="rounded-lg border p-4 text-muted-foreground">
            Vertical content — arrows move ↑ ↓.
          </TabsContent>
          <TabsContent value="security" className="rounded-lg border p-4 text-muted-foreground">
            Security content.
          </TabsContent>
        </Tabs>
      </Row>
      <Row label="Vertical · line" note="Active rule runs down the right edge">
        <Tabs defaultValue="profile" orientation="vertical" className="w-full max-w-md">
          <TabsList variant="line" className="w-40">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="rounded-lg border p-4 text-muted-foreground">
            The line register paints a 2px bar on the trailing edge.
          </TabsContent>
          <TabsContent value="security" className="rounded-lg border p-4 text-muted-foreground">
            Security content.
          </TabsContent>
        </Tabs>
      </Row>
    </div>
  )
}

/** Icons ride inline-start or inline-end via data-icon. */
function WithIcons() {
  return (
    <div className="flex flex-col">
      <Row label="Leading" note="data-icon=inline-start — icon before the label">
        <Tabs defaultValue="add">
          <TabsList>
            <TabsTrigger value="add">
              <Plus data-icon="inline-start" aria-hidden />
              Add employee
            </TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="Trailing" note="data-icon=inline-end — icon after the label">
        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="compliance">
              Compliance
              <ShieldCheck data-icon="inline-end" aria-hidden />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
      <Row label="Line · icons" note="Icons on the line register">
        <Tabs defaultValue="org">
          <TabsList variant="line">
            <TabsTrigger value="org">
              <Building2 data-icon="inline-start" aria-hidden />
              Organization
            </TabsTrigger>
            <TabsTrigger value="people">
              <Users data-icon="inline-start" aria-hidden />
              People
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
    </div>
  )
}

/** Trigger states — active, inactive, disabled. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="Default register" note="Active trigger sits on background with shadow-sm">
        <State label="Active">
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
          </Tabs>
        </State>
      </Row>
      <Row label="Disabled" note="50% opacity · no pointer events · skipped by arrows">
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
      <Row label="Manual activation" note="Arrow keys move focus · Enter or Space activates">
        <Tabs defaultValue="drafts" activationMode="manual">
          <TabsList>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
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
          Sections inside one view without leaving the page. Two registers — the muted pill and
          the line — share one trigger anatomy: rounded-md, text-sm font-medium, gap-1.5.
        </p>
        <Block title="Variants">
          <Variants />
        </Block>
        <Block title="Orientation">
          <Orientation />
        </Block>
        <Block title="With icons">
          <WithIcons />
        </Block>
        <Block title="States">
          <States />
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
          h-8 horizontal list · rounded-md triggers · gap-1.5 · text-sm font-medium · one panel
          per value
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

export const OnlyVariants: Story = {
  render: () => (
    <Screen>
      <Block title="Variants">
        <Variants />
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

export const OnlyIcons: Story = {
  render: () => (
    <Screen>
      <Block title="With icons">
        <WithIcons />
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
              <Building2 data-icon="inline-start" aria-hidden />
              Organization
            </TabsTrigger>
            <TabsTrigger value="people">
              <Users data-icon="inline-start" aria-hidden />
              People
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard data-icon="inline-start" aria-hidden />
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
