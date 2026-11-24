import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

/**
 * DC design system — "09 / Sheet" board (V1.0).
 *
 * Spec: edge-anchored panel on bg-popover · flex flex-col gap-4 · shadow-lg
 * · sides right/left h-full w-3/4 sm:max-w-sm · sides top/bottom h-auto
 * inset-x-0 · slide-in-from-{side} 10 / slide-out-to-{side} 10 at 200ms.
 *
 * Rules: right is the default side. One sheet per view. Always give the
 * panel a SheetTitle; the close button rides the top-right corner.
 */
const meta = {
  title: "UI/Sheet",
  component: SheetContent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Edge-anchored overlay panel on bg-popover — flex column gap-4, shadow-lg, 200ms slide from and out to its side. Right and left are h-full w-3/4 sm:max-w-sm; top and bottom are h-auto inset-x-0. The overlay fades with a 10% veil and a light blur.",
      },
    },
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Edge the panel anchors to. Right is the default.",
    },
    showCloseButton: {
      control: "boolean",
      description:
        "Renders the ghost icon close in the top-right corner. Esc and the overlay click still close when hidden.",
    },
    className: { control: "text", description: "Extra classes — width overrides and the like." },
  },
  args: {
    side: "right",
    showCloseButton: true,
  },
} satisfies Meta<typeof SheetContent>

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

/** Shared panel body — header, sections and footer every sheet reuses. */
function SheetBody({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      {children}
      <SheetFooter>
        <Button>Save changes</Button>
        <SheetClose asChild>
          <Button variant="ghost">Cancel</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}

/** Sides — the panel anchors to each edge and slides accordingly. */
function Sides() {
  return (
    <div className="flex flex-col">
      <Row label="Right" note="Default · h-full w-3/4 sm:max-w-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open from right</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetBody
              title="Organization details"
              description="Right is the default side — one sheet per view."
            />
          </SheetContent>
        </Sheet>
      </Row>
      <Row label="Left" note="Navigation panels and filters">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open from left</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetBody
              title="Filters"
              description="Left sheets carry navigation and filters."
            />
          </SheetContent>
        </Sheet>
      </Row>
      <Row label="Top" note="h-auto inset-x-0 · announcements">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open from top</Button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetBody
              title="Pay run locked"
              description="Top sheets announce state changes — no body needed."
            />
          </SheetContent>
        </Sheet>
      </Row>
      <Row label="Bottom" note="h-auto inset-x-0 · mobile-style pickers">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open from bottom</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetBody
              title="Choose an organization"
              description="Bottom sheets feel native on small screens."
            />
          </SheetContent>
        </Sheet>
      </Row>
    </div>
  )
}

/** Anatomy — header, sections, footer; close button on and off. */
function Anatomy() {
  return (
    <div className="flex flex-col">
      <Row label="Full anatomy" note="Header · body sections · footer actions">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open anatomy</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetBody
              title="Organization details"
              description="Header, sections divided by hairlines, footer pinned with mt-auto."
            >
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="anatomy-name">Company name</Label>
                    <Input id="anatomy-name" defaultValue="Sri Venkateswara Textiles Pvt Ltd" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="anatomy-pan">Company PAN</Label>
                    <Input id="anatomy-pan" defaultValue="AABCS1429B" />
                  </div>
                </div>
              </div>
            </SheetBody>
          </SheetContent>
        </Sheet>
      </Row>
      <Row label="No close button" note="showCloseButton={false} — Esc and overlay still close">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open without close</Button>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false}>
            <SheetBody
              title="Confirm pay run"
              description="Keep the hidden close for forced steps — pair it with an explicit action."
            />
          </SheetContent>
        </Sheet>
      </Row>
      <Row label="Title only" note="Compact panel — description is optional">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open compact</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Quick actions</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-2 px-4">
              <Button variant="secondary" className="justify-start">
                Export salary register
              </Button>
              <Button variant="secondary" className="justify-start">
                Download PF challan
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Row>
    </div>
  )
}

/** Real world — add employee form riding the right edge. */
function FormExample() {
  return (
    <div className="flex flex-col">
      <Row label="Add employee" note="Form in the sheet · footer submits">
        <Sheet>
          <SheetTrigger asChild>
            <Button>Add employee</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Add employee</SheetTitle>
              <SheetDescription>
                The employee joins the next pay run for this organization.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
              <div className="space-y-2">
                <Label required htmlFor="sheet-emp-name">Full name</Label>
                <Input id="sheet-emp-name" placeholder="e.g. Ravi Kumar" />
              </div>
              <div className="space-y-2">
                <Label required htmlFor="sheet-emp-id">Employee ID</Label>
                <Input id="sheet-emp-id" placeholder="e.g. EMP-0148" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label required htmlFor="sheet-emp-basic">Basic salary (monthly)</Label>
                <Input id="sheet-emp-basic" type="number" placeholder="e.g. 45000" />
                <p className="text-xs leading-4 text-muted-foreground">
                  HRA and allowances derive from the basic on this pay structure.
                </p>
              </div>
            </div>
            <SheetFooter>
              <Button>Add to pay run</Button>
              <SheetClose asChild>
                <Button variant="ghost">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Row>
      <Row label="Responsive width" note="w-3/4 on mobile · sm:max-w-sm from 640px up">
        <State label="Right sheet">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Resize the canvas to compare</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetBody
                title="Width register"
                description="Three quarters of a small screen, capped at 24rem on larger ones."
              />
            </SheetContent>
          </Sheet>
        </State>
      </Row>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 09</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Sheet
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Edge-anchored panel on bg-popover — flex column gap-4, shadow-lg,
          200ms slide from and out to its side. Right is the default. One sheet
          per view, always with a title.
        </p>
        <Block title="Sides">
          <Sides />
        </Block>
        <Block title="Anatomy">
          <Anatomy />
        </Block>
        <Block title="Real world">
          <FormExample />
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Right is the default side · One sheet per view · Every sheet gets a SheetTitle
        </p>
      </div>
    </div>
  )
}

/** Every variation on the light Paper board. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every variation on the dark Paper board — the global theme reaches portal content. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
  parameters: {
    globals: { theme: "dark" },
  },
}

/** One sheet driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Open sheet</Button>
        </SheetTrigger>
        <SheetContent side={args.side} showCloseButton={args.showCloseButton}>
          <SheetBody
            title="Organization details"
            description="Controls set the side and the close button."
          />
        </SheetContent>
      </Sheet>
    </div>
  ),
  args: {
    side: "right",
    showCloseButton: true,
  },
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

export const OnlyAnatomy: Story = {
  render: () => (
    <Screen>
      <Block title="Anatomy">
        <Anatomy />
      </Block>
    </Screen>
  ),
}

export const OnlyRealWorld: Story = {
  render: () => (
    <Screen>
      <Block title="Real world">
        <FormExample />
      </Block>
    </Screen>
  ),
}
