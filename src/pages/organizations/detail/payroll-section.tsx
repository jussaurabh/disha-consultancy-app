import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DetailSection } from "@/components/ui/detail-section";
import type { Organization } from "@/api/orgs";
import { DetailRow, DetailRowValue, SectionBandActions } from "./detail-shared";
import { useOrgSectionMutation } from "./use-org-section-mutation";
import { SECTION_COPY } from "./sections";
import {
  PAY_SCALE_ON_OPTIONS,
  LEAVE_METHOD_OPTIONS,
  LEAVE_CAL_ON_OPTIONS,
  OT_ON_OPTIONS,
} from "@/lib/org-options";

const payrollSchema = z.object({
  pan_no: z.string().optional(),
  tan_no: z.string().optional(),
  pt_number: z.string().optional(),
  pt_as_per_employee_state: z.boolean().optional(),
  professional_tax: z.boolean().optional(),
  it_auto: z.boolean().optional(),
  pay_scale_on: z.string().optional(),
  leave_method: z.string().optional(),
  leave_cal_on: z.string().optional(),
  min_wage_limit: z.number().optional(),
  bonus_percent: z.number().optional(),
  bonus_limit: z.number().optional(),
  ot_on: z.string().optional(),
  ot_ratio: z.number().optional(),
  esi_on_ot: z.boolean().optional(),
});

type PayrollValues = z.infer<typeof payrollSchema>;

function BooleanDisplay({ value }: { value: boolean | undefined }) {
  if (value === undefined) return "—";
  return value ? "Yes" : "No";
}

export function PayrollSection({
  org,
  canEdit,
  isEditing,
  onEditOpen,
  onEditClose,
}: {
  org: Organization;
  canEdit: boolean;
  isEditing: boolean;
  onEditOpen: () => void;
  onEditClose: () => void;
}) {
  const form = useForm<PayrollValues>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      pan_no: org.pan_no ?? "",
      tan_no: org.tan_no ?? "",
      pt_number: org.pt_number ?? "",
      pt_as_per_employee_state: org.pt_as_per_employee_state ?? false,
      professional_tax: org.professional_tax ?? false,
      it_auto: org.it_auto ?? false,
      pay_scale_on: org.pay_scale_on ?? "",
      leave_method: org.leave_method ?? "",
      leave_cal_on: org.leave_cal_on ?? "",
      min_wage_limit: org.min_wage_limit ?? 0,
      bonus_percent: org.bonus_percent ?? 0,
      bonus_limit: org.bonus_limit ?? 0,
      ot_on: org.ot_on ?? "",
      ot_ratio: org.ot_ratio ?? 0,
      esi_on_ot: org.esi_on_ot ?? false,
    },
  });

  const mutation = useOrgSectionMutation({
    orgId: org._id,
    section: "payroll",
    onEditClose,
  });

  return (
    <DetailSection
      title={SECTION_COPY.payroll.title}
      description={SECTION_COPY.payroll.description}
      action={
        <SectionBandActions
          formId="payroll-details-form"
          isEditing={isEditing}
          canEdit={canEdit}
          isPending={mutation.isPending}
          onEditOpen={onEditOpen}
          onEditClose={onEditClose}
          onReset={() => form.reset()}
        />
      }
    >
      <Form {...form}>
        <form
          id="payroll-details-form"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {isEditing ? (
            <div data-slot="detail-band-edit">
              <DetailRow label="PAN number">
                <FormField
                  control={form.control}
                  name="pan_no"
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
              <DetailRow label="TAN number">
                <FormField
                  control={form.control}
                  name="tan_no"
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
              <DetailRow label="PT number">
                <FormField
                  control={form.control}
                  name="pt_number"
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
              <DetailRow label="PT as per employee state">
                <FormField
                  control={form.control}
                  name="pt_as_per_employee_state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          aria-label="PT as per employee state"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Professional tax">
                <FormField
                  control={form.control}
                  name="professional_tax"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Professional tax"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="IT auto">
                <FormField
                  control={form.control}
                  name="it_auto"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          aria-label="IT auto"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Pay scale on">
                <FormField
                  control={form.control}
                  name="pay_scale_on"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAY_SCALE_ON_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Leave method">
                <FormField
                  control={form.control}
                  name="leave_method"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEAVE_METHOD_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Leave calculated on">
                <FormField
                  control={form.control}
                  name="leave_cal_on"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEAVE_CAL_ON_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Min. wage limit">
                <FormField
                  control={form.control}
                  name="min_wage_limit"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Bonus %">
                <FormField
                  control={form.control}
                  name="bonus_percent"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Bonus limit">
                <FormField
                  control={form.control}
                  name="bonus_limit"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="OT on">
                <FormField
                  control={form.control}
                  name="ot_on"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OT_ON_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="OT ratio">
                <FormField
                  control={form.control}
                  name="ot_ratio"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="ESI on OT">
                <FormField
                  control={form.control}
                  name="esi_on_ot"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          aria-label="ESI on OT"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DetailRow>
            </div>
          ) : (
            <div>
              <DetailRow label="PAN number">
                <DetailRowValue muted={!org.pan_no}>{org.pan_no ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="TAN number">
                <DetailRowValue muted={!org.tan_no}>{org.tan_no ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PT number">
                <DetailRowValue muted={!org.pt_number}>{org.pt_number ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PT as per employee state">
                <DetailRowValue muted={org.pt_as_per_employee_state === undefined}>
                  <BooleanDisplay value={org.pt_as_per_employee_state} />
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Professional tax">
                <DetailRowValue muted={org.professional_tax === undefined}>
                  <BooleanDisplay value={org.professional_tax} />
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="IT auto">
                <DetailRowValue muted={org.it_auto === undefined}>
                  <BooleanDisplay value={org.it_auto} />
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Pay scale on">
                <DetailRowValue muted={!org.pay_scale_on}>{org.pay_scale_on ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Leave method">
                <DetailRowValue muted={!org.leave_method}>{org.leave_method ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Leave calculated on">
                <DetailRowValue muted={!org.leave_cal_on}>{org.leave_cal_on ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Min. wage limit">
                <DetailRowValue muted={org.min_wage_limit === undefined}>
                  {org.min_wage_limit ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Bonus %">
                <DetailRowValue muted={org.bonus_percent === undefined}>
                  {org.bonus_percent ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Bonus limit">
                <DetailRowValue muted={org.bonus_limit === undefined}>
                  {org.bonus_limit ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="OT on">
                <DetailRowValue muted={!org.ot_on}>{org.ot_on ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="OT ratio">
                <DetailRowValue muted={org.ot_ratio === undefined}>
                  {org.ot_ratio ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="ESI on OT">
                <DetailRowValue muted={org.esi_on_ot === undefined}>
                  <BooleanDisplay value={org.esi_on_ot} />
                </DetailRowValue>
              </DetailRow>
            </div>
          )}
        </form>
      </Form>
    </DetailSection>
  );
}