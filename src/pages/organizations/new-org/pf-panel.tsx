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
import { RadioGroup, RadioOption } from "@/components/ui/radio-group";
import { FormPanel } from "@/components/ui/form-panel";
import { loadStepDraft } from "@/lib/org-new-draft";
import { usePersistStep, STEPS, panelHeaderProps } from "./new-shared";

export type PfValues = {
  pf_number: string;
  pf_start_date: string;
  pf_office: string;
  pf_group: string;
  pf_company_group: string;
  pf_limit: string;
  extension_code: string;
  diff_epf: string;
  pf_calculated_on: string; // "basic" | "allowance"
  pension_ac10: string;
  ac2: string;
  ac2_min: string;
  ac21: string;
  ac21_min: string;
  ac22: string;
  ac22_min: string;
};

export const PF_DEFAULTS: PfValues = {
  pf_number: "",
  pf_start_date: "",
  pf_office: "",
  pf_group: "",
  pf_company_group: "",
  pf_limit: "",
  extension_code: "",
  diff_epf: "",
  pf_calculated_on: "basic",
  pension_ac10: "",
  ac2: "",
  ac2_min: "",
  ac21: "",
  ac21_min: "",
  ac22: "",
  ac22_min: "",
};

const stepIndex = STEPS.findIndex((s) => s.key === "PF");

export function PfPanel() {
  const form = useForm<PfValues>({
    defaultValues: loadStepDraft(STEPS[stepIndex].key, PF_DEFAULTS),
  });
  usePersistStep(STEPS[stepIndex].key, form);

  return (
    <FormPanel
      {...panelHeaderProps(STEPS[stepIndex], stepIndex)}
      className="mb-20"
    >
      <Form {...form}>
        <FormPanel.Section title="REGISTRATION">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pf_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PF number <span className="text-copper">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="KRBNG/45219" {...field} />
                  </FormControl>
                  <FormDescription>
                    Establishment ID issued by the regional PF office.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pf_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PF start date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="pf_office"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PF office</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengaluru — KR Puram" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pf_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PF group</FormLabel>
                  <FormControl>
                    <Input placeholder="Group A" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pf_company_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PF company group</FormLabel>
                  <FormControl>
                    <Input placeholder="SVT-MAIN" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="LIMITS & CODES">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="pf_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PF limit</FormLabel>
                  <FormControl>
                    <Input placeholder="15000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Statutory wage ceiling for PF.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extension_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extension code</FormLabel>
                  <FormControl>
                    <Input placeholder="BNG/KR/BN" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diff_epf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diff EPF</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="PF CALCULATION">
          <FormField
            control={form.control}
            name="pf_calculated_on"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PF calculated on</FormLabel>
                <FormControl>
                  <RadioGroup
                    variant="pill"
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-3"
                  >
                    <RadioOption value="basic" label="Basic" />
                    <RadioOption value="allowance" label="Allowance" />
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Statutory PF is computed on basic wages, capped at the PF
                  limit.
                </FormDescription>
              </FormItem>
            )}
          />
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="ACCOUNT CONTRIBUTIONS">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="pension_ac10"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pension (A/C 10)</FormLabel>
                  <FormControl>
                    <Input placeholder="8.33" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ac2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/C-2</FormLabel>
                  <FormControl>
                    <Input placeholder="3.67" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ac2_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/C-2 min (Rs.)</FormLabel>
                  <FormControl>
                    <Input placeholder="15000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="ac21"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/C-21</FormLabel>
                  <FormControl>
                    <Input placeholder="0.50" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ac21_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/C-21 min (Rs.)</FormLabel>
                  <FormControl>
                    <Input placeholder="15000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ac22"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/C-22</FormLabel>
                  <FormControl>
                    <Input placeholder="0.50" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="ac22_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/C-22 min (Rs.)</FormLabel>
                  <FormControl>
                    <Input placeholder="15000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>
      </Form>
    </FormPanel>
  );
}
