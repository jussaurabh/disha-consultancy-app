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

const esiSchema = z.object({
  esi_no: z.string().optional(),
  esi_start_date: z.string().optional(),
  esi_local_office: z.string().optional(),
  esi_comp_gr: z.string().optional(),
  esi_limit: z.number().optional(),
  esi_employee_percent: z.number().optional(),
  esi_employer_percent: z.number().optional(),
  esi_cal: z.enum(["gross", "all"]).optional(),
});

type EsiValues = z.infer<typeof esiSchema>;

function EsiCalDisplay({ value }: { value: "gross" | "all" | undefined }) {
  if (value === undefined) return "—";
  return value === "gross" ? "Gross" : "All";
}

export function EsiSection({
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
  const form = useForm<EsiValues>({
    resolver: zodResolver(esiSchema),
    defaultValues: {
      esi_no: org.esi_no ?? "",
      esi_start_date: org.esi_start_date ?? "",
      esi_local_office: org.esi_local_office ?? "",
      esi_comp_gr: org.esi_comp_gr ?? "",
      esi_limit: org.esi_limit ?? 0,
      esi_employee_percent: org.esi_employee_percent ?? 0,
      esi_employer_percent: org.esi_employer_percent ?? 0,
      esi_cal: org.esi_cal ?? undefined,
    },
  });

  const mutation = useOrgSectionMutation({
    orgId: org._id,
    section: "esi",
    onEditClose,
  });

  return (
    <DetailSection
      title={SECTION_COPY.esi.title}
      description={SECTION_COPY.esi.description}
      action={
        <SectionBandActions
          formId="esi-details-form"
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
          id="esi-details-form"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {isEditing ? (
            <div data-slot="detail-band-edit">
              <DetailRow label="ESI number">
                <FormField
                  control={form.control}
                  name="esi_no"
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
              <DetailRow label="ESI start date">
                <FormField
                  control={form.control}
                  name="esi_start_date"
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
              <DetailRow label="ESI local office">
                <FormField
                  control={form.control}
                  name="esi_local_office"
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
              <DetailRow label="ESI company group">
                <FormField
                  control={form.control}
                  name="esi_comp_gr"
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
              <DetailRow label="ESI limit">
                <FormField
                  control={form.control}
                  name="esi_limit"
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
              <DetailRow label="Employee %">
                <FormField
                  control={form.control}
                  name="esi_employee_percent"
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
              <DetailRow label="Employer %">
                <FormField
                  control={form.control}
                  name="esi_employer_percent"
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
              <DetailRow label="ESI calculated on">
                <FormField
                  control={form.control}
                  name="esi_cal"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <RadioGroup
                          variant="pill"
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-3"
                        >
                          <RadioOption value="gross" label="Gross" />
                          <RadioOption value="all" label="All" />
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
            </div>
          ) : (
            <div>
              <DetailRow label="ESI number">
                <DetailRowValue muted={!org.esi_no}>{org.esi_no ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="ESI start date">
                <DetailRowValue muted={!org.esi_start_date}>{org.esi_start_date ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="ESI local office">
                <DetailRowValue muted={!org.esi_local_office}>{org.esi_local_office ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="ESI company group">
                <DetailRowValue muted={!org.esi_comp_gr}>{org.esi_comp_gr ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="ESI limit">
                <DetailRowValue muted={org.esi_limit === undefined}>
                  {org.esi_limit ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Employee %">
                <DetailRowValue muted={org.esi_employee_percent === undefined}>
                  {org.esi_employee_percent ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Employer %">
                <DetailRowValue muted={org.esi_employer_percent === undefined}>
                  {org.esi_employer_percent ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="ESI calculated on">
                <DetailRowValue muted={org.esi_cal === undefined}>
                  <EsiCalDisplay value={org.esi_cal} />
                </DetailRowValue>
              </DetailRow>
            </div>
          )}
        </form>
      </Form>
    </DetailSection>
  );
}