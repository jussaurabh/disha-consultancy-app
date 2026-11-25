import { Clock } from "lucide-react";
import { useEffect } from "react";
import { useForm, type UseFormReturn, type FieldValues } from "react-hook-form";
import { saveStepDraft } from "@/lib/org-new-draft";

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

export type StepKey = StepMeta["key"];

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

export function usePersistStep<T extends FieldValues>(
  step: StepKey,
  form: UseFormReturn<T>,
): void {
  useEffect(() => {
    const sub = form.watch((values) => {
      saveStepDraft(step, values as Record<string, string | boolean>);
    });
    return () => sub.unsubscribe();
  }, [form, step]);
}

export { STEPS, type StepMeta, panelHeaderProps };