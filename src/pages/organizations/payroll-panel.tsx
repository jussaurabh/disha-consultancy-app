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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormPanel } from "@/components/ui/form-panel";
import { loadStepDraft } from "@/lib/org-new-draft";
import {
  PAY_SCALE_ON_OPTIONS,
  LEAVE_METHOD_OPTIONS,
  LEAVE_CAL_ON_OPTIONS,
  OT_ON_OPTIONS,
} from "@/lib/org-options";
import { usePersistStep, STEPS, panelHeaderProps } from "./new-shared";

export type PayrollValues = {
  pan_number: string;
  tan_number: string;
  pt_number: string;
  pt_as_per_employee_state: boolean;
  professional_tax: boolean;
  it_auto: boolean;
  pay_scale_on: string;
  leave_method: string;
  leave_calculated_on: string;
  min_wage_limit: string;
  bonus_percent: string;
  bonus_limit: string;
  ot_on: string;
  ot_ratio: string;
  esi_on_ot: boolean;
};

export const PAYROLL_DEFAULTS: PayrollValues = {
  pan_number: "",
  tan_number: "",
  pt_number: "",
  pt_as_per_employee_state: true,
  professional_tax: true,
  it_auto: false,
  pay_scale_on: "",
  leave_method: "",
  leave_calculated_on: "",
  min_wage_limit: "",
  bonus_percent: "",
  bonus_limit: "",
  ot_on: "",
  ot_ratio: "",
  esi_on_ot: false,
};

const stepIndex = STEPS.findIndex((s) => s.key === "Payroll");

function ToggleCard({
  label,
  description,
  name,
  control,
}: {
  label: string;
  description: string;
  name: "pt_as_per_employee_state" | "professional_tax" | "it_auto" | "esi_on_ot";
  control: ReturnType<typeof useForm<PayrollValues>>["control"];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4">
          <div className="space-y-1">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label={label}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function PayrollPanel() {
  const form = useForm<PayrollValues>({
    defaultValues: loadStepDraft(STEPS[stepIndex].key, PAYROLL_DEFAULTS),
  });
  usePersistStep(STEPS[stepIndex].key, form);

  return (
    <FormPanel {...panelHeaderProps(STEPS[stepIndex], stepIndex)}>
      <Form {...form}>
        <FormPanel.Section title="TAX & REGISTRATION">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="pan_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PAN number <span className="text-copper">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="AACCT1234A" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tan_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TAN number</FormLabel>
                  <FormControl>
                    <Input placeholder="BLRM12345C" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pt_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PT number</FormLabel>
                  <FormControl>
                    <Input placeholder="PT/KAR/4521" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="TAX FLAGS">
          <div className="grid gap-5 md:grid-cols-3">
            <ToggleCard
              label="PT as per employee state"
              description="Calculate PT based on employee state"
              name="pt_as_per_employee_state"
              control={form.control}
            />
            <ToggleCard
              label="Professional tax"
              description="Enable professional tax deduction"
              name="professional_tax"
              control={form.control}
            />
            <ToggleCard
              label="IT auto"
              description="Automatically calculate income tax"
              name="it_auto"
              control={form.control}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="PAY & LEAVE SETTINGS">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="pay_scale_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay scale on</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pay scale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAY_SCALE_ON_OPTIONS.map((option) => (
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
              name="leave_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave method</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select leave method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEAVE_METHOD_OPTIONS.map((option) => (
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
              name="leave_calculated_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave calculated on</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select leave basis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEAVE_CAL_ON_OPTIONS.map((option) => (
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

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="min_wage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. wage limit</FormLabel>
                  <FormControl>
                    <Input placeholder="15000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bonus_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bonus %</FormLabel>
                  <FormControl>
                    <Input placeholder="8.33" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bonus_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bonus limit</FormLabel>
                  <FormControl>
                    <Input placeholder="21000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="OVERTIME">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="ot_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OT on</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select OT basis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OT_ON_OPTIONS.map((option) => (
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
              name="ot_ratio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OT ratio</FormLabel>
                  <FormControl>
                    <Input placeholder="2" {...field} />
                  </FormControl>
                  <FormDescription>Multiplier applied to the OT wage base.</FormDescription>
                </FormItem>
              )}
            />
          </div>

          <ToggleCard
            label="ESI on OT"
            description="Include overtime in ESI calculation"
            name="esi_on_ot"
            control={form.control}
          />
        </FormPanel.Section>
      </Form>
    </FormPanel>
  );
}