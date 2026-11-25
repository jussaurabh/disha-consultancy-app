import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orgsApi, type Organization, type UpdateOrgBody } from "@/api/orgs";
import {
  COMPANY_VIEW_OPTIONS,
  EST_TYPE_OPTIONS,
  RULE_TYPE_OPTIONS,
  STATES_OPTIONS,
} from "@/lib/org-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  SearchableSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DetailSection,
  DetailSectionAction,
} from "@/components/ui/detail-section";
import { Badge } from "@/components/ui/badge";
import { DetailRow, DetailRowValue, SectionBandActions } from "./detail-shared";
import { useOrgSectionMutation } from "./use-org-section-mutation";
import { SECTION_COPY } from "./sections";

// --- Schemas ---

const companyDetailsSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  cno: z.string().min(1, "CNO is required"),
  state: z.string().min(1, "State is required"),
  status: z.enum(["active", "inactive"]).optional(),
  est_type: z.string().optional(),
  unit_cont_name: z.string().optional(),
  company_view: z.string().optional(),
  rule_type: z.string().optional(),
});

type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>;

export function CompanyDetailsSection({
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
  const form = useForm<CompanyDetailsValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      company_name: org.company_name,
      cno: org.cno,
      state: org.state,
      status: org.status ?? "active",
      est_type: org.est_type ?? "",
      unit_cont_name: org.unit_cont_name ?? "",
      company_view: org.company_view ?? "",
      rule_type: org.rule_type ?? "",
    },
  });

  const mutation = useOrgSectionMutation({
    orgId: org._id,
    section: "company",
    onEditClose,
  });

  const stateLabel =
    STATES_OPTIONS.find((o) => o.value === org.state)?.label ?? org.state;

  return (
    <DetailSection
      title={SECTION_COPY.company.title}
      description={SECTION_COPY.company.description}
      action={
        <SectionBandActions
          formId="company-details-form"
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
          id="company-details-form"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {isEditing ? (
            <div data-slot="detail-band-edit">
              <DetailRow label="Company name">
                <FormField
                  control={form.control}
                  name="company_name"
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
              <DetailRow label="CNO">
                <FormField
                  control={form.control}
                  name="cno"
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
              <DetailRow label="State">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <SearchableSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={STATES_OPTIONS}
                          placeholder="Select state…"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Status">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        value={field.value ?? "active"}
                        onValueChange={(v) =>
                          field.onChange(v as "active" | "inactive")
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Establishment type">
                <FormField
                  control={form.control}
                  name="est_type"
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
                          {EST_TYPE_OPTIONS.map((o) => (
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
              <DetailRow label="Unit / Contractor name">
                <FormField
                  control={form.control}
                  name="unit_cont_name"
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
              <DetailRow label="Company view">
                <FormField
                  control={form.control}
                  name="company_view"
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
                          {COMPANY_VIEW_OPTIONS.map((o) => (
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
              <DetailRow label="Rule type">
                <FormField
                  control={form.control}
                  name="rule_type"
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
                          {RULE_TYPE_OPTIONS.map((o) => (
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
            </div>
          ) : (
            <div>
              <DetailRow label="Company name">
                <DetailRowValue>{org.company_name}</DetailRowValue>
              </DetailRow>
              <DetailRow label="CNO">
                <DetailRowValue>{org.cno}</DetailRowValue>
              </DetailRow>
              <DetailRow label="State">
                <DetailRowValue>{stateLabel}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Status">
                {org.status === "inactive" ? (
                  <Badge dot shape="tag" variant="destructive">
                    Inactive
                  </Badge>
                ) : (
                  <Badge dot shape="tag">
                    Active
                  </Badge>
                )}
              </DetailRow>
              <DetailRow label="Establishment type">
                <DetailRowValue muted={!org.est_type}>
                  {org.est_type ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Unit / Contractor name">
                <DetailRowValue muted={!org.unit_cont_name}>
                  {org.unit_cont_name ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Company view">
                <DetailRowValue muted={!org.company_view}>
                  {org.company_view ?? "—"}
                </DetailRowValue>
              </DetailRow>
              <DetailRow label="Rule type">
                <DetailRowValue muted={!org.rule_type}>
                  {org.rule_type ?? "—"}
                </DetailRowValue>
              </DetailRow>
            </div>
          )}
        </form>
      </Form>
    </DetailSection>
  );
}