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
import { FormPanel } from "@/components/ui/form-panel";
import { loadStepDraft } from "@/lib/org-new-draft";
import { usePersistStep, STEPS, panelHeaderProps } from "./new-shared";

export type ContactValues = {
  email: string;
  phone_number: string;
  address: string;
  branch_location: string;
  city: string;
  district: string;
  pincode: string;
};

export const CONTACT_DEFAULTS: ContactValues = {
  email: "",
  phone_number: "",
  address: "",
  branch_location: "",
  city: "",
  district: "",
  pincode: "",
};

const stepIndex = STEPS.findIndex((s) => s.key === "Contact");

export function ContactPanel() {
  const form = useForm<ContactValues>({
    defaultValues: loadStepDraft(STEPS[stepIndex].key, CONTACT_DEFAULTS),
  });
  usePersistStep(STEPS[stepIndex].key, form);

  return (
    <FormPanel {...panelHeaderProps(STEPS[stepIndex], stepIndex)}>
      <Form {...form}>
        <FormPanel.Section title="COMMUNICATION">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="accounts@company.in" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98450 00000" {...field} />
                  </FormControl>
                  <FormDescription>Used for payroll SMS alerts.</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </FormPanel.Section>

        <FormPanel.Separator />

        <FormPanel.Section title="REGISTERED LOCATION">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Plot 14, Hebbal Industrial Area" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch / Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Unit 1 — Mysuru" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengaluru" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengaluru Urban" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="560024" {...field} />
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