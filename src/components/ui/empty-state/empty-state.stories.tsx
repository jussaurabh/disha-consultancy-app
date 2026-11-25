import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Plus, RefreshCw, Upload } from "lucide-react"
import { EmptyState } from "./empty-state"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../table/table"

/**
 * DC design system — Empty / no-data state board (Paper frames 5X4-1 / 5XZ-1).
 *
 * Two spec-fixed illustrations pick per variant: the first-run folder scene
 * ("no-data", text-xl title) and the search scene ("empty", text-lg title).
 * Omitting the variant renders a text-only centered block. The actions row
 * holds buttons or a soft chip, with `helperText` inline after them.
 */
const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Empty and no-data states with fixed 200×150 illustrations. variant=\"no-data\" shows the first-run folder scene with a text-xl title; variant=\"empty\" shows the search scene with a text-lg title; omitting both renders a text-only centered block. Actions and helper text share one centered row.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["empty", "no-data"],
      description:
        "Picks the illustration and the title size. Omit for a text-only centered block.",
    },
    title: { control: "text" },
    subTitle: { control: "text" },
    helperText: { control: "text" },
    actions: { control: false },
  },
} satisfies Meta<typeof EmptyState>

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
      <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
    </div>
  )
}

/** Soft action chip — the search state's clear-filters control. */
function SearchChip() {
  return (
    <button
      type="button"
      className="flex h-8 items-center gap-1.5 rounded-lg bg-accent-soft px-3 text-xs font-semibold text-accent"
    >
      <RefreshCw aria-hidden className="size-3" />
      Clear search &amp; filters
    </button>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 20</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Empty state
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          No-data and no-results blocks with fixed illustrations. The first-run folder scene
          carries a text-xl title; the search scene a text-lg title. Without a variant the
          component is a centered text-only block.
        </p>
        <Block title="No data found">
          <Row label="First run" note="Folder scene · text-xl title · gap-2.5 actions at mt-5">
            <EmptyState
              variant="no-data"
              title="No organizations yet"
              subTitle="Add your first organization to start running payroll."
              actions={
                <>
                  <Button size="sm">
                    <Plus aria-hidden />
                    Add organization
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload aria-hidden />
                    Import CSV
                  </Button>
                </>
              }
            />
          </Row>
        </Block>
        <Block title="Empty state">
          <Row label="No match" note="Search scene · text-lg title · chip + helper inline">
            <EmptyState
              variant="empty"
              title="No organizations match"
              subTitle="Nothing in 24 organizations matches “nagp”."
              actions={<SearchChip />}
              helperText="or try “textiles”"
            />
          </Row>
        </Block>
        <Block title="In tables">
          <Row label="Table cell" note="One TableRow, one TableCell colSpan wrapping the state">
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState
                        variant="no-data"
                        title="No organizations yet"
                        subTitle="Add your first organization to start running payroll."
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Row>
        </Block>
        <Block title="In a card">
          <Row label="Card" note="Bordered card keeps the state centered">
            <Card className="w-full max-w-md">
              <EmptyState
                variant="empty"
                title="No organizations match"
                subTitle="Nothing in 24 organizations matches “nagp”."
                actions={<SearchChip />}
                helperText="or try “textiles”"
              />
            </Card>
          </Row>
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          ART 200×150 · TITLE 20/18 · SUB 13/19 · ACTIONS SM OR CHIP H-8
        </p>
      </div>
    </div>
  )
}

/** Every state and variation on the light board. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every state and variation on the dark board — the toolbar theme drives the register. */
export const Dark: Story = {
  render: () => <Board />,
}
