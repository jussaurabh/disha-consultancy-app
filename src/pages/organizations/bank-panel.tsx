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
import { FormPanel } from "@/components/ui/form-panel";
import { InfoNote } from "@/components/ui/info-note";
import { loadStepDraft } from "@/lib/org-new-draft";
import { BANK_NAME_OPTIONS } from "@/lib/org-options";
import { usePersistStep, STEPS, panelHeaderProps } from "./new-shared";

export type BankValues = {
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  bank_address: string;
};

export const BANK_DEFAULTS: BankValues = {
  bank_name: "",
  ifsc_code: "",
  account_number: "",
  bank_address: "",
};

const stepIndex = STEPS.findIndex((s) => s.key === "Bank");

export function BankPanel() {
  const form = useForm<BankValues>({
    defaultValues: loadStepDraft(STEPS[stepIndex].key, BANK_DEFAULTS),
  });
  usePersistStep(STEPS[stepIndex].key, form);

  return (
    <FormPanel
      {...panelHeaderProps(STEPS[stepIndex], stepIndex)}
      note={<InfoNote>Salary is credited to this account. Branch details also appear on PF and ESI challans.</InfoNote>}
    >
      <Form {...form}>
        <FormPanel.Section title="PRIMARY ACCOUNT">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bank name <span className="text-copper">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANK_NAME_OPTIONS.map((option) => (
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
              name="ifsc_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IFSC code <span className="text-copper">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="SBIN0001234" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Account number <span className="text-copper">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="50123456789" {...field} />
                </FormControl>
                <FormDescription>Used for NEFT salary credits.</FormDescription>
              </FormItem>
            )}
          />
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="BRANCH">
          <FormField
            control={form.control}
            name="bank_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank address</FormLabel>
                <FormControl>
                  <Input placeholder="MG Road Branch, Bengaluru" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormPanel.Section>
      </Form>
    </FormPanel>
  );
}