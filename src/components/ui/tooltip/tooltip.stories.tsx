import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { HelpCircle, Info, LayoutDashboard, PiggyBank, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

/**
 * DC design system — Tooltip board (V1.0).
 *
 * Radix tooltip. Bubble: z-50 · max-w-xs · bg-foreground with text-background
 * · rounded-md · px-3 py-1.5 · text-xs · 10px arrow (size-2.5, rotate-45).
 *
 * Content props: side (top/right/bottom/left) · align (start/center/end) ·
 * sideOffset (default 0). Provider delayDuration defaults to 0. Animations
 * slide in from the opening side with fade + 95% zoom. Portals to body —
 * bubble tokens resolve at the document root, not inside a div.dark wrapper.
 */
const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dark hover bubble (bg-foreground) with a 10px rotated arrow. Position with side top/right/bottom/left and align start/center/end on TooltipContent; delayDuration on the provider defaults to 0. Portals to body.",
      },
    },
  },
  argTypes: {
    delayDuration: {
      control: "number",
      description: "Milliseconds before the bubble opens. Provider default is 0.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Render open — used by docs and demos; Radix opens it on hover.",
    },
    disableHoverableContent: {
      control: "boolean",
      description:
        "true blocks moving the pointer onto the bubble; false (default) keeps interactive bubble content reachable.",
    },
  },
  args: {
    delayDuration: 0,
    defaultOpen: true,
    disableHoverableContent: false,
  },
} satisfies Meta<typeof Tooltip>

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

/** All four sides open at once — spaced so the bubbles never collide. */
function Sides() {
  return (
    <div className="grid place-items-center gap-x-32 gap-y-12 py-16 sm:grid-cols-2">
      <TooltipProvider>
        <State label="Top">
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Top
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Tooltip on top</TooltipContent>
          </Tooltip>
        </State>
        <State label="Right">
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Right
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Tooltip on right</TooltipContent>
          </Tooltip>
        </State>
        <State label="Bottom">
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
          </Tooltip>
        </State>
        <State label="Left">
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Left
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Tooltip on left</TooltipContent>
          </Tooltip>
        </State>
      </TooltipProvider>
    </div>
  )
}

/** delayDuration — instant feedback vs an intent pause. */
function Delay() {
  return (
    <div className="flex flex-col">
      <Row label="No delay" note="delayDuration 0 — the provider default, opens immediately">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent>Opens right away</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Row>
      <Row label="700ms" note="An intent pause — for dense toolbars">
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent>Waits 700ms</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Row>
      <Row label="Skip delay" note="Pointer is already warm — Radix opens the next tooltip fast">
        <TooltipProvider delayDuration={700} skipDelayDuration={200}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label="Dashboard">
                  <LayoutDashboard aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label="Employees">
                  <Users aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Employees</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </Row>
    </div>
  )
}

/** Bubble content registers — plain, shortcut, icon, interactive. */
function Content() {
  return (
    <div className="flex flex-col">
      <Row label="Plain" note="One short line, max-w-xs">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Save changes
            </Button>
          </TooltipTrigger>
          <TooltipContent>Saves the draft for every consultant</TooltipContent>
        </Tooltip>
      </Row>
      <Row label="Shortcut" note="kbd rides the bubble — the shell trims its right padding">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Undo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Undo
            <kbd
              data-slot="kbd"
              className="rounded-sm bg-background/15 px-1 font-mono text-[10px] font-semibold"
            >
              ⌘Z
            </kbd>
          </TooltipContent>
        </Tooltip>
      </Row>
      <Row label="With icon" note="Icon leads the line">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More information">
              <Info aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Info aria-hidden className="size-3.5" />
            Locked after payroll closes
          </TooltipContent>
        </Tooltip>
      </Row>
      <Row label="Interactive" note="Pointer can move onto the bubble — links stay clickable">
        <TooltipProvider disableHoverableContent={false}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                PF policy
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Wages above the statutory ceiling are excluded.{" "}
              <a
                href="#policy"
                onClick={(event) => event.preventDefault()}
                className="underline underline-offset-2"
              >
                View policy
              </a>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Row>
    </div>
  )
}

/** Any element can carry the trigger — via asChild. */
function Triggers() {
  return (
    <div className="flex flex-col">
      <Row label="Button" note="TooltipTrigger asChild wraps the Button">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Export payroll
            </Button>
          </TooltipTrigger>
          <TooltipContent>Exports the current month as XLSX</TooltipContent>
        </Tooltip>
      </Row>
      <Row label="Inline link" note="Trigger on an anchor inside prose">
        <p className="text-sm text-muted-foreground">
          Read the{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#policy"
                onClick={(event) => event.preventDefault()}
                className="underline underline-offset-2"
              >
                leave policy
              </a>
            </TooltipTrigger>
            <TooltipContent>Applies from the joining date</TooltipContent>
          </Tooltip>{" "}
          before raising the request.
        </p>
      </Row>
      <Row label="Icon button" note="aria-label stays the accessible name">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </Row>
      <Row label="Disabled" note="Disabled buttons swallow pointer events — wrap the trigger">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex cursor-not-allowed">
              <Button
                variant="outline"
                size="sm"
                aria-disabled
                className="pointer-events-none opacity-50"
              >
                Process payroll
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Disabled until the attendance lock on the 25th</TooltipContent>
        </Tooltip>
      </Row>
    </div>
  )
}

/** The Sidebar menu-button pattern — icon buttons with right-side bubbles. */
function SidebarPattern() {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", open: false },
    { icon: Users, label: "Employees", open: true },
    { icon: PiggyBank, label: "Payroll", open: false },
    { icon: Settings, label: "Settings", open: false },
  ]

  return (
    <div className="flex w-fit flex-col gap-1 rounded-lg border bg-sidebar p-2">
      {items.map(({ icon: Icon, label, open }) => (
        <Tooltip key={label} defaultOpen={open}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={label}
              className="text-sidebar-foreground"
            >
              <Icon aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
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
          Tooltip
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          A dark hover bubble for short clarification — never for critical actions. bg-foreground
          shell, 10px rotated arrow, z-50, max-w-xs. Keep the copy under one line.
        </p>
        <Block title="Sides">
          <Sides />
        </Block>
        <Block title="Delay">
          <Delay />
        </Block>
        <Block title="Content">
          <Content />
        </Block>
        <Block title="Triggers">
          <Triggers />
        </Block>
        <Block title="Sidebar pattern">
          <SidebarPattern />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          z-50 · max-w-xs · bg-foreground bubble · rounded-md · px-3 py-1.5 text-xs · arrow
          size-2.5
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

/** Every variation on the dark board.
 *
 * Radix portals the bubble to body, so the div.dark wrapper styles the board
 * and triggers; bubble tokens resolve at the document root.
 */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** One tooltip driven by the controls panel — opens by default. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-64 items-start justify-center bg-background p-16">
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={0}>
          Tooltip content
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const OnlySides: Story = {
  render: () => (
    <Screen>
      <Block title="Sides">
        <Sides />
      </Block>
    </Screen>
  ),
}

export const OnlyDelay: Story = {
  render: () => (
    <Screen>
      <Block title="Delay">
        <Delay />
      </Block>
    </Screen>
  ),
}

export const OnlyContent: Story = {
  render: () => (
    <Screen>
      <Block title="Content">
        <Content />
      </Block>
    </Screen>
  ),
}

export const OnlyTriggers: Story = {
  render: () => (
    <Screen>
      <Block title="Triggers">
        <Triggers />
      </Block>
    </Screen>
  ),
}

export const OnlySidebarPattern: Story = {
  render: () => (
    <Screen>
      <Block title="Sidebar pattern">
        <SidebarPattern />
      </Block>
    </Screen>
  ),
}

/** Real world — form-field help on a payroll form. */
export const FormFieldHelp: Story = {
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-background p-10">
      <div className="w-full max-w-sm space-y-2">
        <div className="flex items-center gap-1.5">
          <Label required htmlFor="tooltip-est-id">
            PF establishment ID
          </Label>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="What is a PF establishment ID?"
                className="text-muted-foreground"
              >
                <HelpCircle aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              The 7-character code your regional PF office issued — e.g. KRBNG/452.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input id="tooltip-est-id" placeholder="e.g. KRBNG/452" />
        <p className="text-xs leading-4 text-muted-foreground">
          Shown on every PF and EPF report the app generates.
        </p>
      </div>
    </div>
  ),
}
