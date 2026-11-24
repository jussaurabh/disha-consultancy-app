import { useState, type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Building2,
  ChevronsUpDown,
  FileText,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./sidebar"

/**
 * DC design system — Sidebar board (DC DESIGN SYSTEM · V1.0).
 *
 * App-shell navigation: 16rem column · 3rem icon-collapsed · 18rem mobile
 * Sheet. Variants: sidebar (flush, bordered) · floating (ring + rounded on
 * its own surface) · inset (the main area floats as a rounded card).
 * Collapse: offcanvas · icon (tooltips on hover) · none (never hides).
 *
 * ⌘B / Ctrl+B toggles · the open state persists in a cookie · under 768px
 * the sidebar renders as a Sheet driven by the trigger. Menu buttons need a
 * SidebarProvider — and a TooltipProvider when they use the tooltip prop.
 * Sheets and tooltips portal to document.body — their register follows the
 * Theme toolbar (html.dark), the wrapper below covers the board itself.
 */
const meta = {
  title: "UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "App-shell navigation — a 16rem column (3rem collapsed to icons, 18rem mobile Sheet) with variants sidebar / floating / inset, collapse modes offcanvas / icon / none, a ⌘B toggle and cookie persistence. Composed from Header, Content, Group, Menu and Footer parts inside one SidebarProvider.",
      },
    },
  },
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right"],
      description: "Which edge the column docks to.",
    },
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inset"],
      description:
        "sidebar = flush with a border · floating = ring + rounded, detached · inset = the main area becomes a rounded card.",
    },
    collapsible: {
      control: "select",
      options: ["offcanvas", "icon", "none"],
      description:
        "offcanvas slides the column away · icon collapses to a 3rem icon rail with tooltips · none keeps it permanently visible.",
    },
    className: { control: "text" },
  },
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "offcanvas",
  },
} satisfies Meta<typeof Sidebar>

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

/* ------------------------------------------------------------------ */
/* Shell — one provider, one sidebar, one main area. Reused by every   */
/* full-screen story so each canvas carries exactly one live sidebar.  */
/* ------------------------------------------------------------------ */

type ShellRegister = {
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  side?: "left" | "right"
}

/** The navigation column — org switcher, search, groups, footer user, rail. */
function AppSidebar({ variant = "sidebar", collapsible = "offcanvas", side = "left" }: ShellRegister) {
  return (
    <Sidebar variant={variant} collapsible={collapsible} side={side}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                SV
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Sri Venkateswara Consultancy</span>
                <span className="truncate text-xs text-muted-foreground">Starter plan</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput placeholder="Search organizations…" className="pl-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupAction title="Add shortcut">
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Employees">
                  <Users />
                  <span>Employees</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>42</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Payroll runs">
                  <Wallet />
                  <span>Payroll runs</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                </SidebarMenuAction>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton isActive href="#">
                      March 2026
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">February 2026</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">January 2026</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Reports">
                  <FileText />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Organizations</SidebarGroupLabel>
          <SidebarGroupAction title="Add organization">
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { name: "Sri Venkateswara Textiles", units: "3" },
                { name: "Nandini Silks", units: null },
                { name: "Coorg Coffee Estates", units: null },
              ].map(({ name, units }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton>
                    <Building2 />
                    <span>{name}</span>
                  </SidebarMenuButton>
                  {units ? <SidebarMenuBadge>{units}</SidebarMenuBadge> : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Loading…</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                MI
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Meera Iyer</span>
                <span className="truncate text-xs text-muted-foreground">meera@svconsultancy.in</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

/** The main area — header with trigger + crumb, then placeholder content. */
function ShellMain({ crumb = "Employees", note }: { crumb?: string; note?: string }) {
  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
        <span className="font-body text-sm text-muted-foreground">
          Sri Venkateswara Consultancy <span className="text-border">/</span>{" "}
          <span className="text-foreground">{crumb}</span>
        </span>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-display text-2xl font-semibold tracking-tight text-foreground">{crumb}</p>
        <p className="max-w-sm font-body text-sm leading-6 text-muted-foreground">
          42 people across 3 organizations. Toggle the sidebar from the header — or press ⌘B /
          Ctrl+B.
        </p>
        {note ? <Caption>{note}</Caption> : null}
      </div>
    </SidebarInset>
  )
}

/** One complete shell — the habitat every full-screen story renders. */
function SidebarShell({
  variant = "sidebar",
  collapsible = "offcanvas",
  side = "left",
  defaultOpen = true,
  note,
  className,
}: ShellRegister & { defaultOpen?: boolean; note?: string; className?: string }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen} className={cn("min-h-screen", className)}>
      <TooltipProvider>
        <AppSidebar variant={variant} collapsible={collapsible} side={side} />
      </TooltipProvider>
      <ShellMain note={note} />
    </SidebarProvider>
  )
}

/* ------------------------------------------------------------------ */
/* Board pieces — the sidebar parts shown as stand-alone columns.      */
/* They need the provider context but not the fixed-position shell.    */
/* ------------------------------------------------------------------ */

/** A quiet sidebar-register box for isolated pieces. */
function DemoColumn({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <State label={label}>
      <div
        className={cn(
          "w-52 rounded-lg bg-sidebar p-2 text-sidebar-foreground ring-1 ring-sidebar-border",
          className
        )}
      >
        {children}
      </div>
    </State>
  )
}

/** The complete column — every part assembled at 16rem. */
function AnatomyColumn() {
  return (
    <div className="flex w-64 flex-col rounded-lg bg-sidebar text-sidebar-foreground ring-1 ring-sidebar-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                SV
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Sri Venkateswara Consultancy</span>
                <span className="truncate text-xs text-muted-foreground">Starter plan</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput placeholder="Search organizations…" className="pl-8" />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupAction title="Add shortcut">
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users />
                  <span>Employees</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>42</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Wallet />
                  <span>Payroll runs</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                </SidebarMenuAction>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton isActive href="#">
                      March 2026
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">February 2026</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton size="sm" href="#">
                      January 2026
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FileText />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Organizations</SidebarGroupLabel>
          <SidebarGroupAction title="Add organization">
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Building2 />
                  <span>Sri Venkateswara Textiles</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Building2 />
                  <span>Nandini Silks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Loading…</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                MI
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Meera Iyer</span>
                <span className="truncate text-xs text-muted-foreground">meera@svconsultancy.in</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  )
}

/** Live trigger — toggles the board's provider state, read back below it. */
function TriggerStateDemo() {
  const { open, state, toggleSidebar } = useSidebar()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SidebarTrigger />
      <Caption>{`open: ${String(open)} · state: ${state}`}</Caption>
      <Caption>⌘B / Ctrl+B toggles too · a cookie persists the choice</Caption>
    </div>
  )
}

/** Menu buttons, badges, actions, sub items and skeletons in isolation. */
function MenuStructures() {
  return (
    <div className="flex flex-col">
      <Row label="Menu buttons" note="default · active · outline · disabled">
        <DemoColumn label="Default">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="Active">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="Outline">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant="outline">
                <Plus />
                <span>New organization</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="Disabled">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Wallet />
                <span>Payroll runs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
      </Row>
      <Row label="Sizes" note="h-7 sm · h-8 default · h-12 lg">
        <DemoColumn label="sm">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="default">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="lg">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
      </Row>
      <Row label="Badge & action" note="Count badge · kebab action · hover-only action">
        <DemoColumn label="Badge">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Users />
                <span>Employees</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>42</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="Action">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                <span>Reports</span>
              </SidebarMenuButton>
              <SidebarMenuAction>
                <MoreHorizontal />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="Hover only">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                <span>Reports</span>
              </SidebarMenuButton>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
      </Row>
      <Row label="Sub menu" note="Indented under its parent · hidden when collapsed to icons">
        <DemoColumn label="md + sm">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Wallet />
                <span>Payroll runs</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton isActive href="#">
                    March 2026
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton size="sm" href="#">
                    February 2026
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </DemoColumn>
      </Row>
      <Row label="Skeleton" note="SidebarMenuSkeleton — random 50–90% line widths">
        <DemoColumn label="showIcon">
          <SidebarMenu>
            <SidebarMenuSkeleton showIcon />
            <SidebarMenuSkeleton showIcon />
          </SidebarMenu>
        </DemoColumn>
        <DemoColumn label="Text only">
          <SidebarMenu>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </SidebarMenu>
        </DemoColumn>
      </Row>
      <Row label="Group" note="Label · hover action at the top right · content">
        <DemoColumn className="w-64">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupAction title="Add shortcut">
              <Plus />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users />
                    <span>Employees</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </DemoColumn>
      </Row>
    </div>
  )
}

function Board() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
          <div className="mx-auto flex max-w-[1180px] flex-col">
            <div className="flex items-center gap-2">
              <Caption>Component library — navigation</Caption>
              <span className="font-body text-[10px] text-muted-foreground">·</span>
              <Caption>DC design system · V1.0</Caption>
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
              Sidebar
            </h2>
            <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
              The app shell — a 16rem navigation column inside one SidebarProvider. Variants
              sidebar / floating / inset · collapse offcanvas / icon / none · ⌘B toggles · the
              state persists in a cookie · under 768px it becomes a Sheet. Full-screen shells live
              in the AppShell, Floating, Inset, Collapsed and Mobile stories.
            </p>
            <Block title="Anatomy — one column">
              <Row
                label="Complete column"
                note="Org switcher + search · groups with labels, badges, actions, sub items · skeleton · footer user"
              >
                <AnatomyColumn />
              </Row>
            </Block>
            <Block title="Menu structures">
              <MenuStructures />
            </Block>
            <Block title="Controls">
              <Row label="Trigger" note="Ghost icon-sm button wired to useSidebar()">
                <TriggerStateDemo />
              </Row>
            </Block>
            <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              16rem expanded · 3rem icon · 18rem mobile sheet · ⌘B / Ctrl+B · one sidebar per shell
            </p>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

/** Every piece on the light board — parts only; full shells live below. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every piece on the dark board — same portal note as Light. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** One full shell driven by the controls panel — variant, collapse, side. */
export const Playground: Story = {
  render: (args) => (
    <SidebarShell variant={args.variant} collapsible={args.collapsible} side={args.side} />
  ),
}

/** Real world — the complete app shell: rail, trigger, crumbs, content. */
export const AppShell: Story = {
  render: () => <SidebarShell />,
}

/** Variant floating — the column floats on its own ringed surface. */
export const Floating: Story = {
  render: () => (
    <SidebarShell
      variant="floating"
      note="variant floating — rounded-lg + ring-sidebar-border + shadow-sm"
    />
  ),
}

/** Variant inset — the main area floats as a rounded card on bg-sidebar. */
export const Inset: Story = {
  render: () => (
    <SidebarShell
      variant="inset"
      note="variant inset — SidebarInset gets m-2, rounded-xl and a shadow"
    />
  ),
}

/** Starts collapsed to the 3rem icon rail — hover an icon for its tooltip. */
export const CollapsedIcon: Story = {
  render: () => (
    <SidebarShell
      collapsible="icon"
      defaultOpen={false}
      note="collapsible icon — labels, badges and sub items collapse away"
    />
  ),
}

/** Collapsible none — the column never hides; no rail, no trigger state. */
export const NoCollapse: Story = {
  render: () => (
    <SidebarShell collapsible="none" note="collapsible none — permanently visible" />
  ),
}

/** Docked right — mirrors the shell for rtl-style navigation. */
export const RightSide: Story = {
  render: () => <SidebarShell side="right" note="side right — border on the left edge" />,
}

/** Under 768px the sidebar renders as an 18rem Sheet opened by the trigger. */
export const MobileSheet: Story = {
  render: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b bg-muted/40 px-6 py-3">
        <Caption>
          Narrow the canvas under 768px — the sidebar becomes a Sheet (18rem) opened by the trigger
          in the header
        </Caption>
      </div>
      <div className="flex flex-1 flex-col">
        <SidebarShell className="min-h-0 flex-1" />
      </div>
    </div>
  ),
}

/** One live shell with segmented controls — switch registers in place. */
export const OnlyVariants: Story = {
  render: () => <VariantsSwitcher />,
}

function ControlGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Caption>{label}</Caption>
      <div className="flex items-center gap-1">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={value === option ? "default" : "ghost"}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}

function VariantsSwitcher() {
  const [variant, setVariant] = useState<"sidebar" | "floating" | "inset">("sidebar")
  const [collapsible, setCollapsible] = useState<"offcanvas" | "icon" | "none">("offcanvas")
  const [side, setSide] = useState<"left" | "right">("left")
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className="min-h-screen flex-col"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b bg-background px-6 py-3">
        <ControlGroup
          label="Variant"
          options={["sidebar", "floating", "inset"]}
          value={variant}
          onChange={(value) => setVariant(value as typeof variant)}
        />
        <ControlGroup
          label="Collapsible"
          options={["offcanvas", "icon", "none"]}
          value={collapsible}
          onChange={(value) => setCollapsible(value as typeof collapsible)}
        />
        <ControlGroup
          label="Side"
          options={["left", "right"]}
          value={side}
          onChange={(value) => setSide(value as typeof side)}
        />
        <ControlGroup
          label="Open"
          options={["true", "false"]}
          value={String(open)}
          onChange={(value) => setOpen(value === "true")}
        />
        <Caption>One live shell — switch registers without leaving the canvas</Caption>
      </div>
      <div className="flex min-h-0 flex-1">
        <AppSidebar variant={variant} collapsible={collapsible} side={side} />
        <ShellMain />
      </div>
    </SidebarProvider>
  )
}

/** Just the assembled column. */
export const OnlyAnatomy: Story = {
  render: () => (
    <Screen>
      <Block title="Anatomy — one column">
        <Row
          label="Complete column"
          note="Org switcher + search · groups · skeleton · footer user"
        >
          <AnatomyColumn />
        </Row>
      </Block>
    </Screen>
  ),
}

/** Just the isolated menu pieces. */
export const OnlyMenuStructures: Story = {
  render: () => (
    <TooltipProvider>
      <SidebarProvider>
        <Screen>
          <Block title="Menu structures">
            <MenuStructures />
          </Block>
        </Screen>
      </SidebarProvider>
    </TooltipProvider>
  ),
}
