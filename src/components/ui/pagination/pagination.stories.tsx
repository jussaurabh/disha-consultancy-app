import { useState, type MouseEvent } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

/**
 * DC design system — Pagination board (V1.0).
 *
 * Anchor links on the Button shell. PaginationLink: size defaults to
 * "icon" — a 44px square; active pages take the outline register
 * (aria-current="page"), inactive sit on ghost. Prev/Next render size
 * "default" with chevrons, labels hidden under sm. Ellipsis is a 32px
 * MoreHorizontal with sr-only "More pages".
 *
 * Layout: mx-auto flex justify-center on the nav, gap-0.5 between items.
 */
const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page navigation built on the Button shell — 44px icon links, gap-0.5, centered nav. Active page takes outline and aria-current; previous/next hide their labels under sm; the ellipsis reads as 'More pages' to screen readers.",
      },
    },
  },
  argTypes: {
    className: { control: "text", description: "mx-auto flex justify-center by default." },
    "aria-label": {
      control: "text",
      description: 'Nav landmark label — the component defaults it to "pagination".',
    },
  },
  args: {
    "aria-label": "pagination",
  },
} satisfies Meta<typeof Pagination>

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

/** Prevent the anchor default inside demos — navigation is out of scope here. */
function noop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
}

/** A numbered run of pages between the chevrons. */
function NumberedPages({ current, last = 5 }: { current: number; last?: number }) {
  return (
    <>
      {Array.from({ length: last }, (_, index) => index + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink href="#" onClick={noop} isActive={page === current}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
    </>
  )
}

/** One pagination per register — plain, ellipsis, boundaries. */
function Variants() {
  return (
    <div className="flex flex-col">
      <Row label="Basic" note="1–5 · active page on outline · chevrons on both ends">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={noop} />
            </PaginationItem>
            <NumberedPages current={2} />
            <PaginationItem>
              <PaginationNext href="#" onClick={noop} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Row>
      <Row label="Many pages" note="Ellipsis collapses the run — sr-only 'More pages'">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={noop} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" onClick={noop}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {[4, 5, 6].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#" onClick={noop} isActive={page === 5}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" onClick={noop}>
                10
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={noop} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Row>
      <Row label="First page" note="Previous disabled — nothing before page 1">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={noop} aria-disabled className="pointer-events-none opacity-50" />
            </PaginationItem>
            <NumberedPages current={1} />
            <PaginationItem>
              <PaginationNext href="#" onClick={noop} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Row>
      <Row label="Last page" note="Next disabled — nothing after page 5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={noop} />
            </PaginationItem>
            <NumberedPages current={5} />
            <PaginationItem>
              <PaginationNext href="#" onClick={noop} aria-disabled className="pointer-events-none opacity-50" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Row>
      <Row label="Previous / next only" note="No page numbers — compact tables">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={noop} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={noop} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Row>
    </div>
  )
}

/** Link registers and disabled items. */
function States() {
  return (
    <div className="flex flex-col">
      <Row label="Active vs inactive" note="Active = outline + aria-current · inactive = ghost">
        <State label="Active">
          <PaginationLink href="#" onClick={noop} isActive>
            3
          </PaginationLink>
        </State>
        <State label="Inactive">
          <PaginationLink href="#" onClick={noop}>
            3
          </PaginationLink>
        </State>
      </Row>
      <Row label="Disabled" note="aria-disabled + pointer-events-none keeps it out of reach">
        <PaginationLink
          href="#"
          onClick={noop}
          aria-disabled
          className="pointer-events-none opacity-50"
        >
          3
        </PaginationLink>
        <PaginationPrevious
          href="#"
          onClick={noop}
          aria-disabled
          className="pointer-events-none opacity-50"
        />
        <PaginationNext
          href="#"
          onClick={noop}
          aria-disabled
          className="pointer-events-none opacity-50"
        />
      </Row>
    </div>
  )
}

/** Link sizes ride the Button scale — icon is the default. */
function Sizes() {
  return (
    <div className="flex flex-col">
      <Row label="Icon · 44" note="size icon — the default register">
        <Pagination>
          <PaginationContent>
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#" onClick={noop} isActive={page === 2} size="icon">
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </Row>
      <Row label="Small · 36" note="size sm — dense tables">
        <Pagination>
          <PaginationContent>
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#" onClick={noop} isActive={page === 2} size="sm">
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </Row>
    </div>
  )
}

/** Custom labels — prev/next copy comes from the text prop. */
function CustomLabels() {
  return (
    <Row label="Custom labels" note="text prop — keep labels a single word">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={noop} text="Back" />
          </PaginationItem>
          <NumberedPages current={3} />
          <PaginationItem>
            <PaginationNext href="#" onClick={noop} text="Forward" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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
          Pagination
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Page navigation for tables and lists. Anchor links on the Button shell — 44px icon
          links, gap-0.5, centered under the content. The active page takes the outline register
          and aria-current.
        </p>
        <Block title="Variants">
          <Variants />
        </Block>
        <Block title="States">
          <States />
        </Block>
        <Block title="Sizes">
          <Sizes />
        </Block>
        <Block title="Custom labels">
          <CustomLabels />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          mx-auto centered · gap-0.5 · icon links 44 · active = outline · ellipsis = more pages
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

/** Clickable pagination with local state — click a page, chevron or ellipsis run. */
function Interactive() {
  const total = 12
  const [current, setCurrent] = useState(5)

  const pages: (number | "ellipsis-start" | "ellipsis-end")[] =
    total <= 7
      ? Array.from({ length: total }, (_, index) => index + 1)
      : (() => {
          const run: (number | "ellipsis-start" | "ellipsis-end")[] = [1]
          if (current > 3) run.push("ellipsis-start")
          for (
            let page = Math.max(2, current - 1);
            page <= Math.min(total - 1, current + 1);
            page++
          ) {
            run.push(page)
          }
          if (current < total - 2) run.push("ellipsis-end")
          run.push(total)
          return run
        })()

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setCurrent(page)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={go(Math.max(1, current - 1))}
            aria-disabled={current === 1}
            className={current === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pages.map((page, index) =>
          page === "ellipsis-start" || page === "ellipsis-end" ? (
            <PaginationItem key={`${page}-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href="#" onClick={go(page)} isActive={page === current}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={go(Math.min(total, current + 1))}
            aria-disabled={current === total}
            className={current === total ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
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

/** Clickable playground — local state drives the active page. */
export const Playground: Story = {
  render: () => (
    <div className="flex min-h-52 flex-col items-center justify-center gap-4 bg-background p-10">
      <Interactive />
      <Caption>Click a page — state is local to this demo</Caption>
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

export const OnlyStates: Story = {
  render: () => (
    <Screen>
      <Block title="States">
        <States />
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

/** Real world — the footer of an employee table. */
export const TableFooter: Story = {
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-background p-10">
      <div className="w-full max-w-2xl rounded-xl border bg-background shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3 text-right">Gross</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Ananya Rao", "Mysuru", "₹48,200"],
              ["Rahul Desai", "Hubballi", "₹39,750"],
              ["Meera Iyer", "Remote", "₹52,100"],
            ].map(([name, unit, gross]) => (
              <tr key={name} className="border-b last:border-b-0">
                <td className="px-6 py-3 text-foreground">{name}</td>
                <td className="px-6 py-3 text-muted-foreground">{unit}</td>
                <td className="px-6 py-3 text-right text-foreground">{gross}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">Showing 11–20 of 84 employees</p>
          <Pagination className="mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={noop} />
              </PaginationItem>
              <NumberedPages current={2} />
              <PaginationItem>
                <PaginationNext href="#" onClick={noop} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  ),
}
