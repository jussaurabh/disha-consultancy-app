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
import {
  RadioGroup,
  RadioOption,
} from "@/components/ui/radio-group";
import { DetailSection } from "@/components/ui/detail-section";
import type { Organization } from "@/api/orgs";
import { DetailRow, DetailRowValue, SectionBandActions } from "./detail-shared";
import { useOrgSectionMutation } from "./use-org-section-mutation";
import { SECTION_COPY } from "./sections";

const pfSchema = z.object({
  pf_no: z.string().optional(),
  pf_start_date: z.string().optional(),
  pf_office: z.string().optional(),
  pf_group: z.string().optional(),
  pf_cmp_gr: z.string().optional(),
  pf_limit: z.number().optional(),
  pf_ext_code: z.string().optional(),
  pf_diff_epf: z.number().optional(),
  pf_cal: z.enum(["basic", "allowance"]).optional(),
  pf_ac10: z.number().optional(),
  pf_ac2: z.number().optional(),
  pf_ac2_min: z.number().optional(),
  pf_ac21: z.number().optional(),
  pf_ac21_min: z.number().optional(),
  pf_ac22: z.number().optional(),
  pf_ac22_min: z.number().optional(),
});

type PfValues = z.infer<typeof pfSchema>;

function PfCalDisplay({ value }: { value: "basic" | "allowance" | undefined }) {
  if (value === undefined) return "—";
  return value === "basic" ? "Basic" : "Allowance";
}

export function PfSection({
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
  const form = useForm<PfValues>({
    resolver: zodResolver(pfSchema),
    defaultValues: {
      pf_no: org.pf_no ?? "",
      pf_start_date: org.pf_start_date ?? "",
      pf_office: org.pf_office ?? "",
      pf_group: org.pf_group ?? "",
      pf_cmp_gr: org.pf_cmp_gr ?? "",
      pf_limit: org.pf_limit ?? 0,
      pf_ext_code: org.pf_ext_code ?? "",
      pf_diff_epf: org.pf_diff_epf ?? 0,
      pf_cal: org.pf_cal ?? undefined,
      pf_ac10: org.pf_ac10 ?? 0,
      pf_ac2: org.pf_ac2 ?? 0,
      pf_ac2_min: org.pf_ac2_min ?? 0,
      pf_ac21: org.pf_ac21 ?? 0,
      pf_ac21_min: org.pf_ac21_min ?? 0,
      pf_ac22: org.pf_ac22 ?? 0,
      pf_ac22_min: org.pf_ac22_min ?? 0,
    },
  });

  const mutation = useOrgSectionMutation({
    orgId: org._id,
    section: "pf",
    onEditClose,
  });

  return (
    <DetailSection
      title={SECTION_COPY.pf.title}
      description={SECTION_COPY.pf.description}
      action={
        <SectionBandActions
          formId="pf-details-form"
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
          id="pf-details-form"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {isEditing ? (
            <div data-slot="detail-band-edit">
              <DetailRow label="PF number">
                <FormField
                  control={form.control}
                  name="pf_no"
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
              <DetailRow label="PF start date">
                <FormField
                  control={form.control}
                  name="pf_start_date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="PF office">
                <FormField
                  control={form.control}
                  name="pf_office"
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
              <DetailRow label="PF group">
                <FormField
                  control={form.control}
                  name="pf_group"
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
              <DetailRow label="PF company group">
                <FormField
                  control={form.control}
                  name="pf_cmp_gr"
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
              <DetailRow label="PF limit">
                <FormField
                  control={form.control}
                  name="pf_limit"
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
              <DetailRow label="Extension code">
                <FormField
                  control={form.control}
                  name="pf_ext_code"
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
              <DetailRow label="Diff EPF">
                <FormField
                  control={form.control}
                  name="pf_diff_epf"
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
              <DetailRow label="PF calculated on">
                <FormField
                  control={form.control}
                  name="pf_cal"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <RadioGroup
                          variant="pill"
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-3"
                        >
                          <RadioOption value="basic" label="Basic" />
                          <RadioOption value="allowance" label="Allowance" />
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Pension (A/C 10)">
                <FormField
                  control={form.control}
                  name="pf_ac10"
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
              <DetailRow label="A/C-2">
                <FormField
                  control={form.control}
                  name="pf_ac2"
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
              <DetailRow label="A/C-2 min (Rs.)">
                <FormField
                  control={form.control}
                  name="pf_ac2_min"
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
              <DetailRow label="A/C-21">
                <FormField
                  control={form.control}
                  name="pf_ac21"
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
              <DetailRow label="A/C-21 min (Rs.)">
                <FormField
                  control={form.control}
                  name="pf_ac21_min"
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
              <DetailRow label="A/C-22">
                <FormField
                  control={form.control}
                  name="pf_ac22"
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
              <DetailRow label="A/C-22 min (Rs.)">
                <FormField
                  control={form.control}
                  name="pf_ac22_min"
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
            </div>
          ) : (
            <div>
              <DetailRow label="PF number">
                <DetailRowValue muted={!org.pf_no}>{org.pf_no ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PF start date">
                <DetailRowValue muted={!org.pf_start_date}>{org.pf_start_date ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PF office">
                <DetailRowValue muted={!org.pf_office}>{org.pf_office ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PF group">
                <DetailRowValue muted={!org.pf_group}>{org.pf_group ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PF company group">
                <DetailRowValue muted={!org.pf_cmp_gr}>{org.pf_cmp_gr ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="PF limit">
                <DetailRowValue muted={org.pf_limit === undefined}>
                  {org.pf_limit ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Extension code">
                <DetailRowValue muted={!org.pf_ext_code}>{org.pf_ext_code ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Diff EPF">
                <DetailRowValue muted={org.pf_diff_epf === undefined}>
                  {org.pf_diff_epf ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="PF calculated on">
                <DetailRowValue muted={org.pf_cal === undefined}>
                  <PfCalDisplay value={org.pf_cal} />
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Pension (A/C 10)">
                <DetailRowValue muted={org.pf_ac10 === undefined}>
                  {org.pf_ac10 ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="A/C-2">
                <DetailRowValue muted={org.pf_ac2 === undefined}>
                  {org.pf_ac2 ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="A/C-2 min (Rs.)">
                <DetailRowValue muted={org.pf_ac2_min === undefined}>
                  {org.pf_ac2_min ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="A/C-21">
                <DetailRowValue muted={org.pf_ac21 === undefined}>
                  {org.pf_ac21 ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="A/C-21 min (Rs.)">
                <DetailRowValue muted={org.pf_ac21_min === undefined}>
                  {org.pf_ac21_min ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="A/C-22">
                <DetailRowValue muted={org.pf_ac22 === undefined}>
                  {org.pf_ac22 ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="A/C-22 min (Rs.)">
                <DetailRowValue muted={org.pf_ac22_min === undefined}>
                  {org.pf_ac22_min ?? "—"}
                </DetailRowValue>
              </DetailRow>
            </div>
          )}
        </form>
      </Form>
    </DetailSection>
  );
}