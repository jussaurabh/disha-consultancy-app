import { useState, type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Trash2Icon } from "lucide-react"

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
 * Spec: shell radius 14 (rounded-xl) · widths 360 / 440 / 560 (max-w-90 /
 * max-w-110 / max-w-140) · scrim 55% · shadow 0 24 64 · bg surface · header
 * pad 20/24 with a 1px rule · title Archivo 20/26 · 800 · body 13/145% muted
 * · footer pad 14/24 with a 1px rule · actions ride right on 36px buttons
 * (size sm) · danger = filled. Overlay and Portal ship inside DialogContent
 * — you rarely render them by hand.
 *
 * Rules: one primary cta in the footer · Esc and scrim click close · the
 * bordered X in the corner can be dropped with showCloseButton={false}.
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
          "Centered modal surface — rounded-xl (radius 14), three widths 360/440/560 (max-w-90/-110/-140), scrim 55%, header and footer on 1px rules, title Archivo 20/800, body 13 muted, actions right on size sm buttons. Header carries the title and description; the footer carries a quiet cancel and the one primary cta.",
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
  },
  args: {
    modal: true,
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

/**
 * The dialog build sheet's FIELD LABEL register — 11/14 · 600 · caps ·
 * 0.09em · muted. ui/label stays on the Inputs board spec app-wide; inside
 * dialogs, pass this register through className.
 */
function DialogLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <Label
      htmlFor={htmlFor}
      required={required}
      className="text-[11px] leading-3.5 uppercase tracking-[0.09em] text-muted-foreground"
    >
      {children}
    </Label>
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
          <Button variant="secondary" size="sm">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" size="sm">Remove employee</Button>
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

/** The alert register — danger icon left of the title, destructive filled cta. */
function AlertContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2.5">
          <Trash2Icon className="size-5 shrink-0 text-danger" aria-hidden />
          Delete pay run?
        </DialogTitle>
        <DialogDescription>
          The November draft and its 46 payslips will be gone. This can't be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" size="sm">Keep it</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" size="sm">Delete run</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

function AlertDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete pay run</Button>
      </DialogTrigger>
      <DialogContent>
        <AlertContent />
      </DialogContent>
    </Dialog>
  )
}

function OpenAlertDialog() {
  return (
    <Dialog open>
      <DialogContent>
        <AlertContent />
      </DialogContent>
    </Dialog>
  )
}

/** Compact register — max-w-90 (SM 360) for short asks. */
function CompactDialog({ open }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      {open ? null : (
        <DialogTrigger asChild>
          <Button variant="secondary">Compact 360</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-90">
        <DialogHeader>
          <DialogTitle>Mark as paid?</DialogTitle>
          <DialogDescription>
            The March run closes and the register is locked for editing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" size="sm">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="sm">Mark paid</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Wide register — max-w-140 (LG 560) for two-field compositions. */
function WideDialog({ open }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      {open ? null : (
        <DialogTrigger asChild>
          <Button variant="secondary">Wide 560</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-140">
        <DialogHeader>
          <DialogTitle>Invite a client</DialogTitle>
          <DialogDescription>
            They get a login to review their payroll runs — no access to your other clients.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <DialogLabel htmlFor="dialog-wide-name" required>
              Contact name
            </DialogLabel>
            <Input id="dialog-wide-name" placeholder="e.g. Meera Iyer" />
          </div>
          <div className="grid gap-1.5">
            <DialogLabel htmlFor="dialog-wide-email" required>
              Work email
            </DialogLabel>
            <Input id="dialog-wide-email" type="email" placeholder="meera@venkatestextiles.in" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" size="sm">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="sm">Send invite</Button>
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
            <Button variant="secondary" size="sm">Dismiss</Button>
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
          <Button size="sm">Export xlsx</Button>
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
          className="grid gap-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-1.5">
            <DialogLabel htmlFor="dialog-form-name" required>
              Employee name
            </DialogLabel>
            <Input id="dialog-form-name" placeholder="e.g. Meera Iyer" />
          </div>
          <div className="grid gap-1.5">
            <DialogLabel htmlFor="dialog-form-email" required>
              Work email
            </DialogLabel>
            <Input id="dialog-form-email" type="email" placeholder="meera@venkatestextiles.in" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Cancel</Button>
            </DialogClose>
            <Button type="submit" size="sm">Add employee</Button>
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
          Modal moments above a dimmed page — radius 14 · scrim 55% · three
          widths 360 / 440 / 560 · header pad 20/24 with a 1px rule · title
          Archivo 20/800 · body 13 muted · footer pad 14/24 with a 1px rule ·
          actions right on 36px buttons · danger = filled. Esc and scrim click
          close; the footer carries a quiet cancel and the one primary cta.
        </p>
        <Block title="Compositions">
          <Row label="Confirm" note="MD 440 default · cancel + destructive pair">
            <BasicDialog />
          </Row>
          <Row label="Alert" note="Destructive · danger icon left of title · danger = filled">
            <AlertDialog />
          </Row>
          <Row label="Compact" note="max-w-90 · SM 360 for short asks">
            <CompactDialog />
          </Row>
          <Row label="Wide" note="max-w-140 · LG 560 · two-field composition">
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
          Scrim 55% · Radius 14 · Title 20/800 · Body 13 · Fields 42 · Actions right · Danger = filled · Rules 1px · Buttons 36
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
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Add a client organization to this consultancy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <DialogLabel htmlFor="dialog-playground-name" required>
              Organization name
            </DialogLabel>
            <Input id="dialog-playground-name" placeholder="e.g. Sri Venkateswara Textiles" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button size="sm">Create organization</Button>
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

/** Open by default — the default MD 440 register (theme follows the toolbar). */
export const OpenDefault: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <OpenBasic />
    </div>
  ),
}

/** Open alert register — danger icon, destructive filled cta. */
export const OpenAlert: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <OpenAlertDialog />
    </div>
  ),
}

/** Open compact register — max-w-90 (SM 360). */
export const OpenCompact: Story = {
  render: () => (
    <div className="flex min-h-52 items-center justify-center bg-background p-10">
      <CompactDialog open />
    </div>
  ),
}

/** Open wide register — max-w-140 (LG 560). */
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
        <Row label="Confirm" note="MD 440 default · cancel + destructive pair">
          <BasicDialog />
        </Row>
        <Row label="Alert" note="Destructive · danger icon left of title · danger = filled">
          <AlertDialog />
        </Row>
        <Row label="Compact" note="max-w-90 · SM 360 for short asks">
          <CompactDialog />
        </Row>
        <Row label="Wide" note="max-w-140 · LG 560 · two-field composition">
          <WideDialog />
        </Row>
      </Block>
    </Screen>
  ),
}
