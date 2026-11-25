import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Clock } from "lucide-react"
import { FormPanel } from "./form-panel"
import { Input } from "@/components/ui/input"
import { InfoNote } from "@/components/ui/info-note"

const meta = {
  title: "UI/FormPanel",
  component: FormPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Wizard-step form wrapper with header (eyebrow, title, description, meta), body (children), and optional bottom note slot. Matches DC design nodes 117-1 and 1A0-1.",
      },
    },
  },
  argTypes: {
    eyebrow: { control: "text", description: "Small-caps copper kicker, e.g. 'Step 2 of 6 — Contact'" },
    title: { control: "text", description: "Panel heading, e.g. 'Contact & address'" },
    description: { control: "text", description: "Muted line under the title" },
    meta: { control: false, description: "Right side of header, e.g. icon + time estimate" },
    note: { control: false, description: "Bottom note slot inside body, e.g. InfoNote" },
  },
} satisfies Meta<typeof FormPanel>

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

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.1em] text-muted-foreground">
      {children}
    </p>
  )
}

function InputRow({ label, placeholder, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full md:w-[360px]">
      <span className="font-body text-xs leading-4 text-muted-foreground">{label}</span>
      <Input placeholder={placeholder} {...props} />
    </div>
  )
}

function Contact() {
  return (
    <FormPanel
      eyebrow="Step 2 of 6 — Contact"
      title="Contact & address"
      description="Business contact details and registered address."
      meta={<><Clock aria-hidden /> Takes ~2 minutes</>}
    >
      <div className="flex flex-col gap-6">
        <Label>COMMUNICATION</Label>
        <div className="flex flex-wrap gap-4">
          <InputRow label="Email" placeholder="name@company.com" type="email" />
          <InputRow label="Phone number" placeholder="+91 98765 43210" type="tel" />
        </div>
        <hr className="border-line" />
        <Label>REGISTERED LOCATION</Label>
        <div className="flex flex-wrap gap-4">
          <InputRow label="Address" placeholder="123 Business Park, Tower A" />
          <InputRow label="Branch / Location" placeholder="Mumbai Head Office" />
        </div>
        <div className="flex flex-wrap gap-4">
          <InputRow label="City" placeholder="Mumbai" />
          <InputRow label="District" placeholder="Mumbai Suburban" />
          <InputRow label="Pincode" placeholder="400001" />
        </div>
      </div>
    </FormPanel>
  )
}

function BankWithNote() {
  return (
    <FormPanel
      eyebrow="Step 3 of 6 — Bank"
      title="Bank details"
      description="Bank account information for salary disbursement."
      meta={<><Clock aria-hidden /> Takes ~2 minutes</>}
      note={
        <InfoNote nested>
          Salary is credited to this account. Branch details also appear on PF and ESI challans.
        </InfoNote>
      }
    >
      <div className="flex flex-col gap-6">
        <Label>PRIMARY ACCOUNT</Label>
        <div className="flex flex-wrap gap-4">
          <InputRow label="Bank name" placeholder="HDFC Bank" />
          <InputRow label="IFSC code" placeholder="HDFC0001234" />
          <InputRow label="Account number" placeholder="50100123456789" />
        </div>
        <hr className="border-line" />
        <Label>BRANCH</Label>
        <div className="flex flex-wrap gap-4">
          <InputRow label="Bank address" placeholder="HDFC Bank, Fort Branch, Mumbai" />
        </div>
      </div>
    </FormPanel>
  )
}

function Minimal() {
  return (
    <FormPanel title="Minimal Panel">
      <p className="text-muted-foreground">Body content with title only.</p>
    </FormPanel>
  )
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">{children}</div>
    </div>
  )
}

export const Light: Story = {
  render: () => (
    <Screen>
      <div className="flex items-center gap-2">
        <Caption>Component library</Caption>
        <span className="font-body text-[10px] text-muted-foreground">·</span>
        <Caption>DC design system · V1.0</Caption>
      </div>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
        FormPanel
      </h2>
      <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
        Wizard-step form wrapper with header (eyebrow, title, description, meta), body (children), and optional bottom note slot.
      </p>
      <Block title="Variants">
        <Row label="Contact" note="Design 117-1 — full header with eyebrow, title, description, meta">
          <Contact />
        </Row>
        <Row label="Bank with note" note="Design 1A0-1 — includes InfoNote at bottom">
          <BankWithNote />
        </Row>
        <Row label="Minimal" note="Title only">
          <Minimal />
        </Row>
      </Block>
    </Screen>
  ),
}

export const ContactStory: Story = {
  render: () => <Contact />,
}

export const BankWithNoteStory: Story = {
  render: () => <BankWithNote />,
}

export const MinimalStory: Story = {
  render: () => <Minimal />,
}