import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Skeleton } from "./skeleton"
import { SidebarMenuSkeleton } from "@/components/ui/sidebar/sidebar"

/**
 * DC design system — "Skeleton" board (DC DESIGN SYSTEM · V1.0).
 *
 * Loading placeholder — `animate-pulse` block on `bg-muted`, radius 8.
 * Shape it with size and width utilities to mirror the content it
 * replaces — never invent a shape the content will not take.
 *
 * Rules: show only after ~300 ms of waiting · pair a card skeleton with
 * the card's real paddings · keep line counts equal to the final text.
 */
const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Loading placeholder — a pulse-animated block on bg-muted with radius 8. Size it to mirror the content it replaces (lines, cards, avatars, rows); show it only after ~300 ms so fast loads never flash.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description:
        "Size and shape live here — h-4 w-full for text lines, size-10 rounded-full for avatars, h-10 rounded-[10px] for fields.",
    },
  },
  args: {
    className: "h-8 w-full max-w-sm",
  },
} satisfies Meta<typeof Skeleton>

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
      <div className="flex flex-wrap items-center gap-6">{children}</div>
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

/** Text lines — mirror the widths of the copy that replaces them. */
function TextLines() {
  return (
    <div className="flex flex-col">
      <Row label="Paragraph" note="Line widths echo the final copy">
        <div className="w-full max-w-md space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Row>
      <Row label="Widths" note="Custom widths per line">
        <State label="w-full">
          <Skeleton className="h-4 w-full max-w-xs" />
        </State>
        <State label="w-2/3">
          <Skeleton className="h-4 w-2/3" />
        </State>
        <State label="w-40">
          <Skeleton className="h-4 w-40" />
        </State>
        <State label="w-16">
          <Skeleton className="h-4 w-16" />
        </State>
      </Row>
    </div>
  )
}

/** Height scale and the two shapes — bar and circle. */
function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-10 border-b border-border py-7">
      <State label="h-4 · text line">
        <Skeleton className="h-4 w-48" />
      </State>
      <State label="h-8 · dense control">
        <Skeleton className="h-8 w-48" />
      </State>
      <State label="h-12 · heading">
        <Skeleton className="h-12 w-48" />
      </State>
      <State label="Circle · avatar">
        <Skeleton className="size-12 rounded-full" />
      </State>
      <State label="Radius 10 · field">
        <Skeleton className="h-11 w-48 rounded-[10px]" />
      </State>
    </div>
  )
}

/** Profile header + body copy + action — the card recipe. */
function Card() {
  return (
    <div className="border-b border-border py-7">
      <div className="w-full max-w-md rounded-xl border border-border p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="mt-5 h-9 w-28 rounded-[10px]" />
      </div>
    </div>
  )
}

/** Avatar block — circle plus two stacked lines. */
function Avatar() {
  return (
    <Row label="Avatar block" note="Circle + name + subtitle">
      <State label="size-10 + lines">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </State>
      <State label="size-8 + one line">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </State>
    </Row>
  )
}

/** Button placeholders on the DC radius — 10. */
function ButtonSkeleton() {
  return (
    <Row label="Buttons" note="Primary 36/44 heights · radius 10">
      <State label="Primary · h-9 w-28">
        <Skeleton className="h-9 w-28 rounded-[10px]" />
      </State>
      <State label="Small · h-9 w-20">
        <Skeleton className="h-9 w-20 rounded-[10px]" />
      </State>
      <State label="Icon · 44 square">
        <Skeleton className="size-11 rounded-[10px]" />
      </State>
    </Row>
  )
}

/** Table placeholder — header row plus data rows. */
function TableRows() {
  return (
    <div className="border-b border-border py-7">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 border-b border-border bg-muted/40 px-4 py-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="grid grid-cols-[2fr_1fr_1fr_80px] items-center gap-4 border-b border-border px-4 py-3.5 last:border-b-0"
          >
            <Skeleton className="h-4 w-full max-w-[240px]" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Form placeholder — label line over the 42px field. */
function FormField() {
  return (
    <div className="border-b border-border py-7">
      <div className="grid w-full max-w-md grid-cols-2 gap-6">
        {[0, 1].map((field) => (
          <div key={field} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-[42px] w-full rounded-[10px]" />
          </div>
        ))}
        <div className="col-span-2 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-[42px] w-full rounded-[10px]" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

/** SidebarMenuSkeleton — random 50–90% line width, optional icon dot. */
function SidebarMenu() {
  return (
    <div className="border-b border-border py-7">
      <div className="w-64 rounded-xl border border-border p-2">
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton />
        <SidebarMenuSkeleton />
      </div>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 08</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Skeletons
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Loading placeholders that mirror the content they replace — same heights, same widths,
          same paddings. Pulse on bg-muted, radius 8. Never show for loads under ~300 ms.
        </p>
        <Block title="Text lines">
          <TextLines />
        </Block>
        <Block title="Sizes & shapes">
          <Sizes />
        </Block>
        <Block title="Card">
          <Card />
        </Block>
        <Block title="Avatar">
          <Avatar />
        </Block>
        <Block title="Button">
          <ButtonSkeleton />
        </Block>
        <Block title="Table rows">
          <TableRows />
        </Block>
        <Block title="Form fields">
          <FormField />
        </Block>
        <Block title="Sidebar menu">
          <SidebarMenu />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Mirror the real content · pulse on bg-muted · 300 ms minimum before showing
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

/** One block driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <div className="w-full max-w-md">
        <Skeleton {...args} />
      </div>
    </div>
  ),
}

export const OnlyTextLines: Story = {
  render: () => (
    <Screen>
      <Block title="Text lines">
        <TextLines />
      </Block>
    </Screen>
  ),
}

export const OnlySizes: Story = {
  render: () => (
    <Screen>
      <Block title="Sizes & shapes">
        <Sizes />
      </Block>
    </Screen>
  ),
}

export const OnlyCard: Story = {
  render: () => (
    <Screen>
      <Block title="Card">
        <Card />
      </Block>
    </Screen>
  ),
}

export const OnlyTableRows: Story = {
  render: () => (
    <Screen>
      <Block title="Table rows">
        <TableRows />
      </Block>
    </Screen>
  ),
}

export const OnlyFormField: Story = {
  render: () => (
    <Screen>
      <Block title="Form fields">
        <FormField />
      </Block>
    </Screen>
  ),
}

export const OnlySidebarMenu: Story = {
  render: () => (
    <Screen>
      <Block title="Sidebar menu">
        <SidebarMenu />
      </Block>
    </Screen>
  ),
}
