import type { ReactNode } from "react"
import type { Meta } from "@storybook/react-vite"
import { useForm, Controller } from "react-hook-form"
import { Clock } from "lucide-react"
import { FormPanel } from "./form-panel"
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
          "Wizard-step form wrapper with composable Section, Separator, Field, and Field.Row components. Supports vertical/horizontal layouts and react-hook-form via asChild.",
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

/* ---------------------------------------------------------------- */
/* Story 1: Contact – vertical sections with Field.Row              */
/* ---------------------------------------------------------------- */

function Contact() {
  return (
    <FormPanel
      eyebrow="Step 2 of 6 — Contact"
      title="Contact & address"
      description="Business contact details and registered address."
      meta={<><Clock aria-hidden /> Takes ~2 minutes</>}
    >
      <FormPanel.Section title="COMMUNICATION">
        <FormPanel.Field.Row>
          <FormPanel.Field label="Email" placeholder="name@company.com" type="email" />
          <FormPanel.Field label="Phone number" placeholder="+91 98765 43210" type="tel" />
        </FormPanel.Field.Row>
      </FormPanel.Section>

      <FormPanel.Separator />

      <FormPanel.Section title="REGISTERED LOCATION">
        <FormPanel.Field.Row>
          <FormPanel.Field label="Address" placeholder="123 Business Park, Tower A" />
          <FormPanel.Field label="Branch / Location" placeholder="Mumbai Head Office" />
        </FormPanel.Field.Row>
        <FormPanel.Field.Row>
          <FormPanel.Field label="City" placeholder="Mumbai" />
          <FormPanel.Field label="District" placeholder="Mumbai Suburban" />
          <FormPanel.Field label="Pincode" placeholder="400001" />
        </FormPanel.Field.Row>
      </FormPanel.Section>
    </FormPanel>
  )
}

/* ---------------------------------------------------------------- */
/* Story 2: Bank with note – vertical sections                      */
/* ---------------------------------------------------------------- */

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
      <FormPanel.Section title="PRIMARY ACCOUNT">
        <FormPanel.Field.Row>
          <FormPanel.Field label="Bank name" placeholder="HDFC Bank" />
          <FormPanel.Field label="IFSC code" placeholder="HDFC0001234" />
          <FormPanel.Field label="Account number" placeholder="50100123456789" />
        </FormPanel.Field.Row>
      </FormPanel.Section>

      <FormPanel.Separator />

      <FormPanel.Section title="BRANCH">
        <FormPanel.Field.Row>
          <FormPanel.Field label="Bank address" placeholder="HDFC Bank, Fort Branch, Mumbai" />
        </FormPanel.Field.Row>
      </FormPanel.Section>
    </FormPanel>
  )
}

/* ---------------------------------------------------------------- */
/* Story 3: Horizontal layout – 3 fields side by side               */
/* ---------------------------------------------------------------- */

function HorizontalLayout() {
  return (
    <FormPanel
      eyebrow="Step 1 of 3 — Details"
      title="Company Information"
      description="Enter your company details below."
    >
      <FormPanel.Section title="BASIC INFO" layout="horizontal">
        <FormPanel.Field label="Company name" placeholder="Acme Corp" />
        <FormPanel.Field label="Registration no." placeholder="U12345MH2020PTC123456" />
        <FormPanel.Field label="GSTIN" placeholder="27AAACA1234A1Z5" />
      </FormPanel.Section>

      <FormPanel.Separator />

      <FormPanel.Section title="ADDRESS" layout="horizontal">
        <FormPanel.Field label="City" placeholder="Mumbai" />
        <FormPanel.Field label="State" placeholder="Maharashtra" />
        <FormPanel.Field label="Pincode" placeholder="400001" />
      </FormPanel.Section>
    </FormPanel>
  )
}

/* ---------------------------------------------------------------- */
/* Story 4: Mixed vertical + horizontal                             */
/* ---------------------------------------------------------------- */

function MixedLayout() {
  return (
    <FormPanel
      title="Mixed Layout Demo"
      description="Vertical sections with horizontal field groups."
    >
      <FormPanel.Section title="VERTICAL SECTION">
        <FormPanel.Field label="Full width field" placeholder="Spans full width" />
      </FormPanel.Section>

      <FormPanel.Separator />

      <FormPanel.Section title="HORIZONTAL GROUP" layout="horizontal">
        <FormPanel.Field label="Field A" placeholder="Value A" />
        <FormPanel.Field label="Field B" placeholder="Value B" />
      </FormPanel.Section>

      <FormPanel.Separator />

      <FormPanel.Section title="ANOTHER VERTICAL" layout="vertical">
        <FormPanel.Field.Row>
          <FormPanel.Field label="Row Field 1" placeholder="Value 1" />
          <FormPanel.Field label="Row Field 2" placeholder="Value 2" />
        </FormPanel.Field.Row>
        <FormPanel.Field label="Solo field" placeholder="Full width again" />
      </FormPanel.Section>
    </FormPanel>
  )
}

/* ---------------------------------------------------------------- */
/* Story 5: react-hook-form integration                             */
/* ---------------------------------------------------------------- */

interface ContactForm {
  email: string
  phone: string
  address: string
  city: string
}

function ReactHookFormDemo() {
  const { control, handleSubmit, formState: { errors } } = useForm<ContactForm>()

  const onSubmit = (data: ContactForm) => {
    console.log("Submitted:", data)
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <FormPanel
      eyebrow="Step 2 of 6 — Contact"
      title="Contact & address (RHF)"
      description="Connected to react-hook-form via asChild."
      meta={<><Clock aria-hidden /> Takes ~2 minutes</>}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormPanel.Section title="COMMUNICATION">
        <FormPanel.Field.Row>
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required", pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email" } }}
            render={({ field }) => (
              <FormPanel.Field
                label="Email"
                placeholder="name@company.com"
                type="email"
                aria-invalid={!!errors.email}
                {...field}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <FormPanel.Field
                label="Phone number"
                placeholder="+91 98765 43210"
                type="tel"
                aria-invalid={!!errors.phone}
                {...field}
              />
            )}
          />
        </FormPanel.Field.Row>
      </FormPanel.Section>

      <FormPanel.Separator />

      <FormPanel.Section title="REGISTERED LOCATION">
        <FormPanel.Field.Row>
          <Controller
            name="address"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <FormPanel.Field
                label="Address"
                placeholder="123 Business Park, Tower A"
                aria-invalid={!!errors.address}
                {...field}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <FormPanel.Field
                label="City"
                placeholder="Mumbai"
                aria-invalid={!!errors.city}
                {...field}
              />
            )}
          />
        </FormPanel.Field.Row>
      </FormPanel.Section>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-primary-foreground hover:bg-accent/90"
        >
          Submit
        </button>
        <button
          type="button"
          className="rounded-lg border border-line px-4 py-2 font-body text-sm font-semibold text-muted-foreground hover:bg-ground"
        >
          Cancel
        </button>
      </div>
    </FormPanel>
  )
}

/* ---------------------------------------------------------------- */
/* Story 6: Minimal                                                 */
/* ---------------------------------------------------------------- */

function Minimal() {
  return (
    <FormPanel title="Minimal Panel">
      <p className="text-muted-foreground">Body content with title only.</p>
    </FormPanel>
  )
}

/* ---------------------------------------------------------------- */
/* Screen wrapper                                                   */
/* ---------------------------------------------------------------- */

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">{children}</div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Exports                                                          */
/* ---------------------------------------------------------------- */

export const Light = {
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
        Wizard-step form wrapper with composable Section, Separator, Field, and Field.Row. Supports vertical/horizontal layouts and react-hook-form via asChild.
      </p>
      <Block title="Variants">
        <Row label="Contact" note="Vertical sections with Field.Row groups">
          <Contact />
        </Row>
        <Row label="Bank with note" note="Vertical sections + InfoNote at bottom">
          <BankWithNote />
        </Row>
        <Row label="Horizontal layout" note="layout=horizontal makes fields side-by-side">
          <HorizontalLayout />
        </Row>
        <Row label="Mixed layout" note="Vertical + horizontal sections combined">
          <MixedLayout />
        </Row>
        <Row label="react-hook-form" note="asChild + Controller for full RHF integration">
          <ReactHookFormDemo />
        </Row>
        <Row label="Minimal" note="Title only">
          <Minimal />
        </Row>
      </Block>
    </Screen>
  ),
}

export const ContactStory = { render: () => <Contact /> }
export const BankWithNoteStory = { render: () => <BankWithNote /> }
export const HorizontalLayoutStory = { render: () => <HorizontalLayout /> }
export const MixedLayoutStory = { render: () => <MixedLayout /> }
export const ReactHookFormStory = { render: () => <ReactHookFormDemo /> }
export const MinimalStory = { render: () => <Minimal /> }