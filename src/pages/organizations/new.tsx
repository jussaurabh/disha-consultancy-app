import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { SecondaryHeader } from "@/components/ui/secondary-header";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";
import { InfoNote } from "@/components/ui/info-note";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { FormPanel } from "@/components/ui/form-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectDot,
} from "@/components/ui/select";
import {
  COMPANY_VIEW_OPTIONS,
  EST_TYPE_OPTIONS,
  RULE_TYPE_OPTIONS,
  STATES_OPTIONS,
} from "@/lib/org-options";

const STEPS = [
  {
    key: "Company",
    short: "Company",
    title: "Company details",
    description: "Basic registration information for the organization.",
    subtitle: "Registration basics · 8 fields",
  },
  {
    key: "Contact",
    short: "Contact",
    title: "Contact & address",
    description: "Business contact details and registered address.",
    subtitle: "Address & communication · 7 fields",
  },
  {
    key: "Bank",
    short: "Bank",
    title: "Bank details",
    description: "Bank account information for salary disbursement.",
    subtitle: "Salary disbursement · 4 fields",
  },
  {
    key: "Payroll",
    short: "Payroll",
    title: "Payroll & leave",
    description: "Pay scale, leave, bonus, and overtime configuration.",
    subtitle: "Tax, leave & overtime · 15 fields",
  },
  {
    key: "PF",
    short: "PF",
    title: "Provident Fund",
    description: "PF registration, statutory limits, and contribution accounts.",
    subtitle: "Provident fund · 16 fields",
  },
  {
    key: "ESI",
    short: "ESI",
    title: "Employee State Insurance",
    description: "ESI registration, contribution rates, and calculation method.",
    subtitle: "State insurance · 8 fields",
  },
] as const;

type StepMeta = (typeof STEPS)[number];

function panelHeaderProps(step: StepMeta, index: number) {
  return {
    eyebrow: `Step ${index + 1} of 6 — ${step.key}`,
    title: step.title,
    description: step.description,
    meta: (
      <>
        <Clock aria-hidden />
        Takes ~2 minutes
      </>
    ),
  };
}

function PlaceholderPanel({ step, index }: { step: StepMeta; index: number }) {
  return (
    <FormPanel {...panelHeaderProps(step, index)}>
      <EmptyState
        title="Coming soon"
        subTitle={`The ${step.title} form is not implemented in this milestone.`}
        className="py-16"
      />
    </FormPanel>
  );
}

type CompanyDetailsValues = {
  company_name: string;
  cno: string;
  state: string;
  status: "active" | "inactive";
  est_type: string;
  company_view: string;
  rule_type: string;
  unit_cont_name: string;
};

const COMPANY_DEFAULTS: CompanyDetailsValues = {
  company_name: "",
  cno: "",
  state: "",
  status: "active",
  est_type: "",
  company_view: "",
  rule_type: "",
  unit_cont_name: "",
};

const STATUS_OPTIONS = ["active", "inactive"] as const;

function CompanyFormPanel({
  form,
}: {
  form: UseFormReturn<CompanyDetailsValues>;
}) {
  return (
    <FormPanel {...panelHeaderProps(STEPS[0], 0)}>
      <Form {...form}>
        <FormPanel.Section title="REGISTRATION">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company name <span className="text-copper">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Sri Venkateswara Textiles Pvt Ltd"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The registered legal name — shown across payroll documents.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="cno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CNO <span className="text-copper">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="CNO-2026-0001" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    State <span className="text-copper">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATES_OPTIONS.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          <span className="flex items-center gap-2">
                            <SelectDot
                              className={
                                option === "inactive" ? "bg-danger" : undefined
                              }
                            />
                            {option === "active" ? "Active" : "Inactive"}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="CLASSIFICATION">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="est_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Establishment type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EST_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_view"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company view</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_VIEW_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rule_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select rule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RULE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="unit_cont_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit / Contractor name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Unit 1 — Mysuru" {...field} />
                </FormControl>
                <FormDescription>
                  Leave blank if this record is the parent company.
                </FormDescription>
              </FormItem>
            )}
          />
        </FormPanel.Section>
      </Form>
    </FormPanel>
  );
}

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const filledSegments = Math.min(current + 1, STEPS.length - 1);

  const form = useForm<CompanyDetailsValues>({ defaultValues: COMPANY_DEFAULTS });

  const goToStep = (index: number) =>
    setCurrent(Math.max(0, Math.min(STEPS.length - 1, index)));
  const advance = () => goToStep(current + 1);

  return (
    <div className="flex min-h-full flex-col">
      <SecondaryHeader>
        <SecondaryHeader.Back />
        <SecondaryHeader.Breadcrumb
          segments={[
            { label: "Organizations", url: "/organizations" },
            { label: "New organization" },
          ]}
        />
        <SecondaryHeader.Actions>
          <span className="rounded-full border border-line bg-ground px-2.5 py-[5px]">
            <SecondaryHeader.Pill text="DRAFT · NOT SAVED" />
          </span>
        </SecondaryHeader.Actions>
      </SecondaryHeader>

      <PageHeader
        variant="form"
        eyebrow="CLIENT COMPANIES — NEW RECORD"
        title="Create organization"
        description="Register a client company, then configure payroll, statutory and banking setup."
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate("/organizations")}>
              Cancel
            </Button>
            <Button variant="outline" onClick={advance}>
              Save draft
              <ArrowRight />
            </Button>
          </>
        }
      />

      <div className="grid flex-1 items-start gap-7 px-4 pt-6 pb-8 md:grid-cols-[268px_1fr] md:px-6">
        <div>
          <Stepper
            steps={STEPS.map((s) => ({ title: s.short, subtitle: s.subtitle }))}
            current={current}
          />
          <InfoNote className="mt-3.5">
            Optional sections can be completed later from the organization
            page.
          </InfoNote>
        </div>

        {current === 0 ? (
          <CompanyFormPanel form={form} />
        ) : (
          <PlaceholderPanel step={step} index={current} />
        )}
      </div>

      <StickyActionBar>
        <StickyActionBar.Left>
          <span className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-5 rounded-[2px] ${
                  i < filledSegments ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
          </span>
          <span className="text-[13px] font-semibold leading-4 text-ink">
            Step {current + 1} of {STEPS.length}
          </span>
          <span className="text-[13px] leading-4 text-muted">
            — {step.title}
          </span>
        </StickyActionBar.Left>
        <StickyActionBar.Right>
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => goToStep(current - 1)}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button disabled={isLast} onClick={advance}>
            {isLast
              ? "Create organization"
              : `Continue to ${STEPS[current + 1].short}`}
            <ArrowRight />
          </Button>
        </StickyActionBar.Right>
      </StickyActionBar>
    </div>
  );
}