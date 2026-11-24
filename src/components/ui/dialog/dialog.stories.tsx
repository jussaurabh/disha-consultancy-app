import { useState, type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

/**
 * DC design system — Overlays board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: radius 16 (rounded-xl) · max-w-[calc(100%-2rem)] on mobile, max-w-sm
 * from sm up · p-4 · ring-1 ring-foreground/10 · 100ms fade + zoom-95 in/out
 * over a black/10 blurred scrim. Overlay and Portal ship inside
 * DialogContent — you rarely render them by hand.
 *
 * Rules: one primary cta in the footer · Esc and scrim click close · the
 * ghost X in the corner can be dropped with showCloseButton={false}.
 */
const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Centered modal surface — rounded-xl (radius 16), max-w-sm from sm up, p-4, ring-1 ring-foreground/10, 100ms fade+zoom over a blurred scrim. Header carries the title and description; the footer carries a quiet cancel and the one primary cta.",
      },
    },
  },
  argTypes: {
    open: {
      control: false,
      description:
        "Controlled open state. Omit for trigger-driven dialogs — see the Controlled story for onOpenChange.",
    },
    modal: {
      control: "boolean",
      description: "Locks page scroll and traps focus (default true).",
    },
    showCloseButton: {
      control: "boolean",
      description: "DialogContent — the ghost X in the top corner (default true).",
    },
  },
  args: {
    modal: true,
    showCloseButton: true,
  },
} satisfies Meta<typeof Dialog>

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

/** The canonical confirm dialog — header, description with a policy link, footer pair. */
function BasicContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Remove employee from payroll?</DialogTitle>
        <DialogDescription>
          Meera Iyer stops appearing in runs from April onwards.{" "}
          <a href="#" onClick={(event) => event.preventDefault()}>
            History stays intact
          </a>
          .
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive">Remove employee</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Remove employee</Button>
      </DialogTrigger>
      <DialogContent>
        <BasicContent />
      </DialogContent>
    </Dialog>
  )
}

function OpenBasic() {
  return (
    <Dialog open>
      <DialogContent>
        <BasicContent />
      </DialogContent>
    </Dialog>
  )
}

/** Wide register — sm:max-w-lg for two-field compositions. */
function WideDialog({ open }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      {open ? null : (
        <DialogTrigger asChild>
          <Button variant="secondary">Invite a client</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite a client</DialogTitle>
          <DialogDescription>
            They get a login to review their payroll runs — no access to your other clients.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="dialog-wide-name" required>
              Contact name
            </Label>
            <Input id="dialog-wide-name" placeholder="e.g. Meera Iyer" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dialog-wide-email" required>
              Work email
            </Label>
            <Input id="dialog-wide-email" type="email" placeholder="meera@venkatestextiles.in" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Send invite</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** The ghost X dropped — closing lives on the footer cancel only. */
function WithoutCloseDialog({ open }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      {open ? null : (
        <DialogTrigger asChild>
          <Button variant="secondary">Without close X</Button>
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Processing payroll</DialogTitle>
          <DialogDescription>
            March is being computed for 42 employees. This dialog closes itself — there is no X.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Dismiss</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** DialogFooter's built-in quiet Close button. */
function FooterCloseDialog({ open }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      {open ? null : (
        <DialogTrigger asChild>
          <Button variant="secondary">Footer close button</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export salary register</DialogTitle>
          <DialogDescription>
            Exports the March register for Sri Venkateswara Textiles — 42 employees, 1 unit.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Export xlsx</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** A small form living inside the dialog, with the footer inside the form. */
function FormInDialog({ open }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      {open ? null : (
        <DialogTrigger asChild>
          <Button>Add employee</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add employee</DialogTitle>
          <DialogDescription>They join the March run for Unit 1 — Mysuru.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-2">
            <Label htmlFor="dialog-form-name" required>
              Employee name
            </Label>
            <Input id="dialog-form-name" placeholder="e.g. Meera Iyer" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dialog-form-email" required>
              Work email
            </Label>
            <Input id="dialog-form-email" type="email" placeholder="meera@venkatestextiles.in" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** Controlled open state — driven from outside, reported back through onOpenChange. */
function ControlledDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <span className="font-body text-xs text-muted-foreground">open: {String(open)}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <BasicContent />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — overlays</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Dialogs
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Centered modal surfaces — radius 16 · max-w-sm from sm up · p-4 · ring-1
          ring-foreground/10 · 100ms fade + zoom over a blurred scrim. Esc and scrim click close;
          the footer carries a quiet cancel and the one primary cta.
        </p>
        <Block title="Compositions">
          <Row label="Confirm" note="Header · description · cancel + destructive pair">
            <BasicDialog />
          </Row>
          <Row label="Wide" note="sm:max-w-lg · two-field composition">
            <WideDialog />
          </Row>
          <Row label="Form inside" note="Fields and footer live inside the form">
            <FormInDialog />
          </Row>
          <Row label="Without close X" note="showCloseButton={false} — footer closes">
            <WithoutCloseDialog />
          </Row>
          <Row label="Footer close" note="DialogFooter showCloseButton renders the quiet Close">
            <FooterCloseDialog />
          </Row>
        </Block>
        <Block title="Controlled">
          <Row
            label="Controlled open"
            note="Driven from outside — open state reported below"
          >
            <ControlledDemo />
          </Row>
        </Block>
        <Block title="Behavior">
          <Row label="Keyboard & focus" note="Esc closes · scrim click closes · focus is trapped and restored">
            <State label="Trigger-driven · fully accessible via Radix">
              <BasicDialog />
            </State>
          </Row>
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Radius 16 · max-w-sm · p-4 · One primary cta per footer · Esc and scrim close
        </p>
      </div>
    </div>
  )
}

/**
 * Every composition on the light Paper board. Opened panels portal to
 * document.body — their register follows the Theme toolbar (html.dark), the
 * wrapper below covers the board itself.
 */
export const Light: Story = {
  render: () => <Board />,
}

/** Every composition on the dark Paper board — same portal note as Light. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** Single dialog driven by the controls panel — toggle the close X and modal lock. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <Dialog modal={args.modal}>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={args.showCloseButton}>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Add a client organization to this consultancy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="dialog-playground-name" required>
              Organization name
            </Label>
            <Input id="dialog-playground-name" placeholder="e.g. Sri Venkateswara Textiles" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Create organization</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

/** The canonical confirm dialog, opened by its trigger. */
export const Default: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <BasicDialog />
    </div>
  ),
}

/** Controlled open state with an external opener and onOpenChange. */
export const Controlled: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <ControlledDemo />
    </div>
  ),
}

/** Open by default — the default max-w-sm register (theme follows the toolbar). */
export const OpenDefault: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <OpenBasic />
    </div>
  ),
}

/** Open wide register — sm:max-w-lg. */
export const OpenWide: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <WideDialog open />
    </div>
  ),
}

/** Open without the ghost X — showCloseButton={false}. */
export const OpenWithoutClose: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <WithoutCloseDialog open />
    </div>
  ),
}

/** Open with DialogFooter's built-in quiet Close button. */
export const OpenWithFooterClose: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <FooterCloseDialog open />
    </div>
  ),
}

/** Open with a small form inside — fields and footer in one form. */
export const OpenWithForm: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <FormInDialog open />
    </div>
  ),
}

/** Just the compositions board — no overlay demos. */
export const OnlyCompositions: Story = {
  render: () => (
    <Screen>
      <Block title="Compositions">
        <Row label="Confirm" note="Header · description · cancel + destructive pair">
          <BasicDialog />
        </Row>
        <Row label="Wide" note="sm:max-w-lg · two-field composition">
          <WideDialog />
        </Row>
      </Block>
    </Screen>
  ),
}
