import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectDot,
} from "@/components/ui/select";
import { FormPanel } from "@/components/ui/form-panel";
import { loadStepDraft } from "@/lib/org-new-draft";
import {
  COMPANY_VIEW_OPTIONS,
  EST_TYPE_OPTIONS,
  RULE_TYPE_OPTIONS,
  STATES_OPTIONS,
} from "@/lib/org-options";
import { usePersistStep, STEPS, panelHeaderProps } from "./new-shared";

export type CompanyDetailsValues = {
  company_name: string;
  cno: string;
  state: string;
  status: "active" | "inactive";
  est_type: string;
  company_view: string;
  rule_type: string;
  unit_cont_name: string;
};

export const COMPANY_DEFAULTS: CompanyDetailsValues = {
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

const stepIndex = STEPS.findIndex((s) => s.key === "Company");

export function CompanyPanel() {
  const form = useForm<CompanyDetailsValues>({
    defaultValues: loadStepDraft(STEPS[stepIndex].key, COMPANY_DEFAULTS),
  });
  usePersistStep(STEPS[stepIndex].key, form);

  return (
    <FormPanel {...panelHeaderProps(STEPS[stepIndex], stepIndex)}>
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
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={STATES_OPTIONS}
                      placeholder="Select state…"
                      className="w-full"
                    />
                  </FormControl>
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