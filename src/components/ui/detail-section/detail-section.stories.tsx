import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, Ellipsis, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DetailSection, DetailSectionAction } from "./detail-section";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * DC design system — Detail Section shell.
 *
 * Radius 10 (rounded-lg) · border-line · bg-surface · header band 40px · bg-ground
 * · title 11px/14px uppercase semibold · trailing action slot.
 * Matches the organization detail tabs: Company, Contact, Bank, PF, ESI, Payroll, Settings, Users.
 */
const meta = {
  title: "UI/DetailSection",
  component: DetailSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A section card with a header band (title + optional description + trailing actions) and a content area. Used for the organization detail tabs — Company, Contact, Bank, PF, ESI, Payroll, Settings, Users. Radius 10 · 1px border-line · bg-surface · header 40px bg-ground.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Section title in the header band" },
    description: {
      control: "text",
      description: "Optional description below title (hidden on narrow)",
    },
    action: {
      control: false,
      description: "Trailing action nodes — typically Edit/Save/Cancel buttons",
    },
  },
  args: {
    title: "Company Details",
    description: "Basic registration information for the organization",
  },
} satisfies Meta<typeof DetailSection>;

export default meta;
type Story = StoryObj<typeof meta>;

function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="font-body text-[10px] font-semibold uppercase leading-3 tracking-[0.08em] text-muted-foreground">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </h3>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 flex flex-col gap-2">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}

function Row({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-5 border-b border-border py-7 last:border-b-0 md:grid-cols-[240px_1fr] md:items-center">
      <div className="flex flex-col gap-1">
        <span className="font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.14em] text-foreground">
          {label}
        </span>
        {note ? (
          <span className="font-body text-xs leading-4 text-muted-foreground">
            {note}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      {children}
      <Caption>{label}</Caption>
    </div>
  );
}

/** DetailRow used in the content area — matches the detail page pattern. */
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="detail-row"
      data-testid="detail-row"
      className="flex min-h-12 items-center gap-6 border-b border-line px-6 py-3 last:border-b-0"
    >
      <span className="w-[220px] shrink-0 text-[13px] leading-4 text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function DetailRowValue({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      data-slot="detail-row-value"
      className={
        muted
          ? "text-[14px] leading-[18px] text-muted"
          : "text-[14px] leading-[18px] font-semibold text-ink"
      }
    >
      {children}
    </span>
  );
}

/** Read-only view — mirrors the detail page non-editing state. */
function ReadOnlyView() {
  return (
    <DetailSection
      title="Company Details"
      description="Basic registration information for the organization"
    >
      <DetailRow label="Company name">
        <DetailRowValue>Sri Venkateswara Textiles</DetailRowValue>
      </DetailRow>
      <DetailRow label="CNO">
        <DetailRowValue>CNO/2019/004471</DetailRowValue>
      </DetailRow>
      <DetailRow label="State">
        <DetailRowValue>Karnataka</DetailRowValue>
      </DetailRow>
      <DetailRow label="Status">
        <span className="flex items-center gap-[7px]">
          <span className="size-[7px] shrink-0 rounded-full bg-accent" />
          <span className="text-[14px] leading-[18px] font-medium text-ink">
            Active
          </span>
        </span>
      </DetailRow>
      <DetailRow label="Establishment type">
        <DetailRowValue>Factory</DetailRowValue>
      </DetailRow>
      <DetailRow label="Unit / Contractor name">
        <DetailRowValue muted>—</DetailRowValue>
      </DetailRow>
      <DetailRow label="Company view">
        <DetailRowValue>Main</DetailRowValue>
      </DetailRow>
      <DetailRow label="Rule type">
        <DetailRowValue>Factory Act</DetailRowValue>
      </DetailRow>
    </DetailSection>
  );
}

/** Editing view — mirrors the detail page editing state with form. */
function EditingView() {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        company_name: z.string().min(1),
        cno: z.string().min(1),
        state: z.string().min(1),
        status: z.enum(["active", "inactive"]).optional(),
        est_type: z.string().optional(),
        unit_cont_name: z.string().optional(),
        company_view: z.string().optional(),
        rule_type: z.string().optional(),
      }),
    ),
    defaultValues: {
      company_name: "Sri Venkateswara Textiles",
      cno: "CNO/2019/004471",
      state: "karnataka",
      status: "active",
      est_type: "Factory",
      unit_cont_name: "",
      company_view: "Main",
      rule_type: "Factory Act",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => console.log(v))}>
        <DetailSection
          title="Company Details"
          description="Basic registration information for the organization"
          action={
            <DetailSection.Action>
              <Button type="button" variant="outline" size="xsm">
                Cancel
              </Button>
              <Button type="submit" size="xsm">
                Update
              </Button>
            </DetailSection.Action>
          }
        >
          <DetailRow label="Company name">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DetailRow>
          <DetailRow label="CNO">
            <FormField
              control={form.control}
              name="cno"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DetailRow>
          <DetailRow label="State">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select state…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DetailRow>
        </DetailSection>
      </form>
    </Form>
  );
}

/** Without description — compact header. */
function WithoutDescription() {
  return (
    <DetailSection
      title="Contact & Address"
      action={
        <Button variant="ghost" size="icon-sm" aria-label="More">
          <Ellipsis />
        </Button>
      }
    >
      <DetailRow label="Email">
        <DetailRowValue>contact@svtextiles.com</DetailRowValue>
      </DetailRow>
      <DetailRow label="Phone">
        <DetailRowValue>+91 80 2222 3333</DetailRowValue>
      </DetailRow>
      <DetailRow label="Address">
        <DetailRowValue>
          Unit 1, Mysuru Industrial Area, Mysuru - 570008
        </DetailRowValue>
      </DetailRow>
    </DetailSection>
  );
}

/** With only title — minimal header. */
function Minimal() {
  return (
    <DetailSection title="Settings">
      <DetailRow label="Timezone">
        <DetailRowValue>Asia/Kolkata</DetailRowValue>
      </DetailRow>
      <DetailRow label="Date format">
        <DetailRowValue>DD/MM/YYYY</DetailRowValue>
      </DetailRow>
    </DetailSection>
  );
}

/** Different section types from the org detail tabs. */
function SectionTypes() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DetailSection
        title="Company"
        description="Basic registration information"
      >
        <div className="px-6 py-4 text-center text-muted-foreground">
          Company fields…
        </div>
      </DetailSection>
      <DetailSection title="Contact" description="Business contact details">
        <div className="px-6 py-4 text-center text-muted-foreground">
          Contact fields…
        </div>
      </DetailSection>
      <DetailSection title="Bank" description="Bank account information">
        <div className="px-6 py-4 text-center text-muted-foreground">
          Bank fields…
        </div>
      </DetailSection>
      <DetailSection
        title="Payroll"
        description="Pay scale, leave, bonus, overtime"
      >
        <div className="px-6 py-4 text-center text-muted-foreground">
          Payroll fields…
        </div>
      </DetailSection>
      <DetailSection title="PF" description="PF registration, limits, accounts">
        <div className="px-6 py-4 text-center text-muted-foreground">
          PF fields…
        </div>
      </DetailSection>
      <DetailSection
        title="ESI"
        description="ESI registration, rates, calculation"
      >
        <div className="px-6 py-4 text-center text-muted-foreground">
          ESI fields…
        </div>
      </DetailSection>
      <DetailSection title="Users" description="Members and pending invites">
        <div className="px-6 py-4 text-center text-muted-foreground">
          Users list…
        </div>
      </DetailSection>
      <DetailSection title="Settings" description="Organization settings">
        <div className="px-6 py-4 text-center text-muted-foreground">
          Settings…
        </div>
      </DetailSection>
    </div>
  );
}

function Board() {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">
        <div className="flex items-center gap-2">
          <Caption>Component library</Caption>
          <span className="font-body text-[10px] text-muted-foreground">·</span>
          <Caption>DC design system · V1.0</Caption>
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
          DetailSection
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-6 text-muted-foreground">
          Section card with header band (title + trailing actions) and content
          area. Used for the organization detail tabs — Company, Contact, Bank,
          PF, ESI, Payroll, Settings, Users. Radius 10 · 1px border-line ·
          bg-surface · header 40px bg-ground.
        </p>
        <Block title="Read-only view">
          <Row
            label="Default"
            note="Header with title, description, and Edit action"
          >
            <State label="Company Details">
              <ReadOnlyView />
            </State>
          </Row>
        </Block>
        <Block title="Editing view">
          <Row label="With form" note="Header shows Cancel/Update actions">
            <State label="Company Details (editing)">
              <EditingView />
            </State>
          </Row>
        </Block>
        <Block title="Variations">
          <Row
            label="Without description"
            note="Compact header — only title + action"
          >
            <State label="Contact & Address">
              <WithoutDescription />
            </State>
          </Row>
          <Row label="Minimal" note="Title only — no description, no action">
            <State label="Settings">
              <Minimal />
            </State>
          </Row>
          <Row
            label="All section types"
            note="The eight tabs from the org detail page"
          >
            <State label="Section grid">
              <SectionTypes />
            </State>
          </Row>
        </Block>
        <p className="mt-12 border-t border-border pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          RADIUS 10 · BORDER-LINE · BG-SURFACE · HEADER 40PX BG-GROUND · TITLE
          11/14 UPPERCASE
        </p>
      </div>
    </div>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col">{children}</div>
    </div>
  );
}

/** Every variation on the light Paper board. */
export const Light: Story = {
  render: () => <Board />,
};

/** Every variation on the dark Paper board. */
export const Dark: Story = {
  render: () => (
    <div className="dark">
      <Board />
    </div>
  ),
};

/** Single section driven by the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-80 items-start justify-center bg-background p-10">
      <div className="w-96">
        <DetailSection {...args}>
          <div className="px-6 py-4">
            <DetailRow label="Field label">
              <DetailRowValue>Field value</DetailRowValue>
            </DetailRow>
            <DetailRow label="Another field">
              <DetailRowValue muted>—</DetailRowValue>
            </DetailRow>
          </div>
        </DetailSection>
      </div>
    </div>
  ),
};

export const OnlyReadOnly: Story = {
  render: () => (
    <Screen>
      <Block title="Read-only view">
        <Row label="Default">
          <State label="Company Details">
            <ReadOnlyView />
          </State>
        </Row>
      </Block>
    </Screen>
  ),
};

export const OnlyEditing: Story = {
  render: () => (
    <Screen>
      <Block title="Editing view">
        <Row label="With form">
          <State label="Company Details (editing)">
            <EditingView />
          </State>
        </Row>
      </Block>
    </Screen>
  ),
};

export const OnlyVariations: Story = {
  render: () => (
    <Screen>
      <Block title="Variations">
        <Row label="Without description">
          <State label="Contact & Address">
            <WithoutDescription />
          </State>
        </Row>
        <Row label="Minimal">
          <State label="Settings">
            <Minimal />
          </State>
        </Row>
        <Row label="All section types">
          <State label="Section grid">
            <SectionTypes />
          </State>
        </Row>
      </Block>
    </Screen>
  ),
};
