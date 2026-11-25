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

export type EsiValues = {
  esi_number: string;
  esi_start_date: string;
  local_office: string;
  esi_company_group: string;
  esi_limit: string;
  employee_percent: string;
  employer_percent: string;
  esi_calculated_on: string; // "gross" | "all_components"
};

export const ESI_DEFAULTS: EsiValues = {
  esi_number: "",
  esi_start_date: "",
  local_office: "",
  esi_company_group: "",
  esi_limit: "",
  employee_percent: "",
  employer_percent: "",
  esi_calculated_on: "gross",
};

const stepIndex = STEPS.findIndex((s) => s.key === "ESI");

export function EsiPanel() {
  const form = useForm<EsiValues>({
    defaultValues: loadStepDraft(STEPS[stepIndex].key, ESI_DEFAULTS),
  });
  usePersistStep(STEPS[stepIndex].key, form);

  return (
    <FormPanel {...panelHeaderProps(STEPS[stepIndex], stepIndex)}>
      <Form {...form}>
        <FormPanel.Section title="REGISTRATION">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="esi_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ESI number <span className="text-copper">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="3100452198" {...field} />
                  </FormControl>
                  <FormDescription>
                    Coverage number issued by the regional ESIC office.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="esi_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ESI start date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="local_office"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local office</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengaluru — Indiranagar" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="esi_company_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ESI company group</FormLabel>
                  <FormControl>
                    <Input placeholder="SVT-MAIN" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="CONTRIBUTIONS">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="esi_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ESI limit</FormLabel>
                  <FormControl>
                    <Input placeholder="21000" {...field} />
                  </FormControl>
                  <FormDescription>Statutory wage ceiling for ESI coverage.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employee_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee %</FormLabel>
                  <FormControl>
                    <Input placeholder="0.75" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employer_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer %</FormLabel>
                  <FormControl>
                    <Input placeholder="3.25" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="ESI CALCULATION">
          <FormField
            control={form.control}
            name="esi_calculated_on"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ESI calculated on</FormLabel>
                <FormControl>
                  <RadioGroup
                    variant="pill"
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-3"
                  >
                    <RadioOption value="gross" label="Gross" />
                    <RadioOption value="all_components" label="All components" />
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Contributions apply to gross wages up to the ESI limit.
                </FormDescription>
              </FormItem>
            )}
          />
        </FormPanel.Section>
      </Form>
    </FormPanel>
  );
}