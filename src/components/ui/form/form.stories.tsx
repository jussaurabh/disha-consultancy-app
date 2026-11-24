import { useEffect, useState, type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form"

/**
 * DC design system — "04 / Inputs" board (FIELD ANATOMY, DC DESIGN SYSTEM · V1.0).
 *
 * A React Hook Form wrapper that wires the inputs spec together: FormItem lays
 * a `gap-2` grid of label → control → description → message. On error the
 * label dyes destructive (data-error), the control gets aria-invalid so its
 * border dyes copper-red, and FormMessage speaks in destructive. Required
 * labels ride the copper asterisk. Wrap every story in <Form> — it is the
 * FormProvider.
 */
const meta = {
  title: "UI/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "React Hook Form wiring for the field anatomy: label, control, helper and error message on one gap-2 grid. Errors dye the label destructive, set aria-invalid on the control and speak through FormMessage.",
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["onSubmit", "onBlur", "onChange", "onTouched", "all"],
      description: "When validation runs. onSubmit is the default — errors land after the first submit.",
    },
    criteriaMode: {
      control: "select",
      options: ["firstError", "all"],
      description: "Whether FormMessage shows the first error or all of them.",
    },
  },
  args: {
    mode: "onSubmit",
    criteriaMode: "firstError",
  },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

type DemoValues = {
  name: string
  email: string
  department: string
  notes: string
}

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
      <div className="flex flex-wrap items-center gap-8">{children}</div>
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

function Chip({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.08em]",
        on
          ? "border-line bg-surface text-foreground"
          : "border-transparent bg-muted/50 text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

/** The full anatomy — required label, control, helper and the message slot. */
function AnatomyField() {
  const form = useForm<{ name: string }>({ defaultValues: { name: "" } })
  return (
    <Form {...form}>
      <form className="w-96" onSubmit={(event) => event.preventDefault()}>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Employee name is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Employee name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Meera Iyer" {...field} />
              </FormControl>
              <FormDescription>
                Shown on payslips and statutory filings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

/** Message slot before any error — FormMessage renders its children. */
function DefaultMessageField() {
  const form = useForm<{ department: string }>({ defaultValues: { department: "" } })
  return (
    <Form {...form}>
      <form className="w-96" onSubmit={(event) => event.preventDefault()}>
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Spinning" {...field} />
              </FormControl>
              <FormDescription>Used for cost-center reports.</FormDescription>
              <FormMessage>Errors speak here, in destructive.</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

/** Errors painted on mount — label destructive, border dyed, message spoken. */
function ErrorState() {
  const form = useForm<{ name: string; pfNumber: string }>({
    defaultValues: { name: "", pfNumber: "KRBNG/452" },
    mode: "onSubmit",
  })
  useEffect(() => {
    void form.trigger()
  }, [form])
  return (
    <Form {...form}>
      <form className="flex w-96 flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Employee name is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Employee name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Meera Iyer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pfNumber"
          rules={{
            pattern: {
              value: /^[A-Z]{3}\/\d{7}$/,
              message: "Establishment ID looks invalid — check the regional format.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>PF number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. KRBNG/4521007" {...field} />
              </FormControl>
              <FormDescription>Regional code, then a 7-digit establishment id.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

/** Live pristine → dirty → touched → error tracking on one field. */
function TrackedField() {
  const form = useForm<{ name: string }>({
    defaultValues: { name: "" },
    mode: "onBlur",
  })
  const { isDirty } = form.formState
  const touched = "name" in form.formState.touchedFields
  const hasError = "name" in form.formState.errors
  return (
    <Form {...form}>
      <form className="flex w-96 flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Employee name is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Employee name</FormLabel>
              <FormControl>
                <Input placeholder="Type, then blur…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Chip on={!isDirty}>Pristine</Chip>
          <Chip on={isDirty}>Dirty</Chip>
          <Chip on={touched}>Touched</Chip>
          <Chip on={hasError}>Error</Chip>
          <Button type="button" size="sm" variant="secondary" onClick={() => void form.trigger()}>
            Validate
          </Button>
        </div>
      </form>
    </Form>
  )
}

/** The input types on one form — every field rides the same anatomy. */
function FieldTypes() {
  const form = useForm<{
    text: string
    email: string
    password: string
    notes: string
  }>({ defaultValues: { text: "", email: "", password: "", notes: "" } })
  return (
    <Form {...form}>
      <form className="flex w-96 flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Meera Iyer" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="meera@venkatestextiles.in" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Textarea</FormLabel>
              <FormControl>
                <Textarea placeholder="Onboarding notes…" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

/** Disabled control — the field group dims label and input together. */
function DisabledField() {
  const form = useForm<{ cin: string }>({ defaultValues: { cin: "CNO-2019-4471" } })
  return (
    <Form {...form}>
      <div className="group flex w-96 flex-col" data-disabled="true">
        <form onSubmit={(event) => event.preventDefault()}>
          <FormField
            control={form.control}
            name="cin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CIN</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormDescription>Assigned by the MCA — read only here.</FormDescription>
              </FormItem>
            )}
          />
        </form>
      </div>
    </Form>
  )
}

/** A real onboarding form — required fields, helper text and a submit that echoes validated values. */
function CompleteForm() {
  const [submitted, setSubmitted] = useState<DemoValues | null>(null)
  const form = useForm<DemoValues>({
    defaultValues: { name: "", email: "", department: "", notes: "" },
  })
  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          className="flex w-96 flex-col gap-6"
          onSubmit={form.handleSubmit(setSubmitted)}
        >
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Employee name is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Employee name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Meera Iyer" {...field} />
                </FormControl>
                <FormDescription>Shown on payslips and statutory filings.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Work email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid work email.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Work email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="meera@venkatestextiles.in" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Spinning" {...field} />
                </FormControl>
                <FormDescription>Used for cost-center reports.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onboarding notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Anything the payroll team should know…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3">
            <Button type="submit">Save employee</Button>
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      {submitted ? (
        <pre className="mt-6 w-96 rounded-lg bg-muted/50 p-4 font-body text-xs leading-4 text-muted-foreground ring-1 ring-foreground/10">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      ) : (
        <p className="mt-6 w-96 font-body text-xs leading-4 text-muted-foreground">
          Submit to validate — errors dye their labels and borders, success echoes the values.
        </p>
      )}
    </div>
  )
}

function PlaygroundForm({
  mode = "onSubmit",
  criteriaMode = "firstError",
}: {
  mode?: "onSubmit" | "onBlur" | "onChange" | "onTouched" | "all"
  criteriaMode?: "firstError" | "all"
}) {
  const form = useForm<{ company: string }>({
    mode,
    criteriaMode,
    defaultValues: { company: "" },
  })
  return (
    <Form {...form}>
      <form
        className="w-80"
        onSubmit={form.handleSubmit(() => {
          form.reset({ company: "" })
        })}
      >
        <FormField
          control={form.control}
          name="company"
          rules={{ required: "Company name is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Company name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Sri Venkateswara Textiles" {...field} />
              </FormControl>
              <FormDescription>The registered legal name.</FormDescription>
              <FormMessage>Validation messages land here.</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library — 04</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          Forms
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          React Hook Form wiring for the inputs board — one gap-2 grid per field: label →
          control → description → message. Errors dye the label destructive and speak through
          the message slot.
        </p>
        <Block title="Anatomy">
          <Row label="Field anatomy" note="Label · control · description · message">
            <AnatomyField />
          </Row>
          <Row label="Message slot" note="Before an error, FormMessage renders its children">
            <DefaultMessageField />
          </Row>
        </Block>
        <Block title="Validation">
          <Row label="Error state" note="Required + pattern errors painted on mount">
            <ErrorState />
          </Row>
          <Row label="Field state" note="Pristine · dirty · touched · error, live">
            <TrackedField />
          </Row>
        </Block>
        <Block title="Field types">
          <Row label="Input types" note="Text · email · password · textarea on one anatomy">
            <FieldTypes />
          </Row>
        </Block>
        <Block title="Disabled">
          <Row label="Disabled field" note="group data-disabled dims the label, the input sinks">
            <DisabledField />
          </Row>
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          gap-2 grid · error = destructive label + aria-invalid border · copper asterisk on
          required
        </p>
      </div>
    </div>
  )
}

/** Every pattern on the light Paper board. */
export const Light: Story = {
  render: () => <Board />,
}

/** Every pattern on the dark Paper board. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
}

/** One field driven by the controls panel — flip mode and submit empty to see errors. */
export const Playground: Story = {
  render: (args) => <PlaygroundForm mode={args.mode} criteriaMode={args.criteriaMode} />,
}

/** The full anatomy — label, control, description and the message slot. */
export const Anatomy: Story = {
  render: () => (
    <Screen>
      <Block title="Anatomy">
        <Row label="Field anatomy" note="Label · control · description · message">
          <AnatomyField />
        </Row>
      </Block>
    </Screen>
  ),
}

/** Errors, field-state tracking and the default message slot. */
export const ValidationStates: Story = {
  render: () => (
    <Screen>
      <Block title="Validation">
        <Row label="Error state" note="Required + pattern errors painted on mount">
          <ErrorState />
        </Row>
        <Row label="Field state" note="Pristine · dirty · touched · error, live">
          <TrackedField />
        </Row>
        <Row label="Message slot" note="FormMessage children show before any error">
          <DefaultMessageField />
        </Row>
      </Block>
    </Screen>
  ),
}

/** Different control types on the shared anatomy. */
export const OnlyFieldTypes: Story = {
  render: () => (
    <Screen>
      <Block title="Field types">
        <Row label="Input types" note="Text · email · password · textarea">
          <FieldTypes />
        </Row>
      </Block>
    </Screen>
  ),
}

/** Disabled control inside a dimmed field group. */
export const DisabledFieldStory: Story = {
  render: () => (
    <Screen>
      <Block title="Disabled">
        <Row label="Disabled field" note="group data-disabled dims the label, the input sinks">
          <DisabledField />
        </Row>
      </Block>
    </Screen>
  ),
}

/** A real onboarding form — required fields, helper text, submit that echoes validated values. */
export const RealWorldOnboarding: Story = {
  render: () => (
    <Screen>
      <Block title="Onboarding">
        <CompleteForm />
      </Block>
    </Screen>
  ),
}
