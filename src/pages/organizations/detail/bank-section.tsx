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
import { BANK_NAME_OPTIONS } from "@/lib/org-options";

const bankSchema = z.object({
  bank_name: z.string().optional(),
  ifsc_code: z.string().optional(),
  account_no: z.string().optional(),
  bank_address: z.string().optional(),
});

type BankValues = z.infer<typeof bankSchema>;

export function BankSection({
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
  const form = useForm<BankValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bank_name: org.bank_name ?? "",
      ifsc_code: org.ifsc_code ?? "",
      account_no: org.account_no ?? "",
      bank_address: org.bank_address ?? "",
    },
  });

  const mutation = useOrgSectionMutation({
    orgId: org._id,
    section: "bank",
    onEditClose,
  });

  return (
    <DetailSection
      title={SECTION_COPY.bank.title}
      description={SECTION_COPY.bank.description}
      action={
        <SectionBandActions
          formId="bank-details-form"
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
          id="bank-details-form"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {isEditing ? (
            <div data-slot="detail-band-edit">
              <DetailRow label="Bank name">
                <FormField
                  control={form.control}
                  name="bank_name"
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
                          {BANK_NAME_OPTIONS.map((o) => (
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
              <DetailRow label="IFSC code">
                <FormField
                  control={form.control}
                  name="ifsc_code"
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
              <DetailRow label="Account number">
                <FormField
                  control={form.control}
                  name="account_no"
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
              <DetailRow label="Bank address">
                <FormField
                  control={form.control}
                  name="bank_address"
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
            </div>
          ) : (
            <div>
              <DetailRow label="Bank name">
                <DetailRowValue muted={!org.bank_name}>{org.bank_name ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="IFSC code">
                <DetailRowValue muted={!org.ifsc_code}>{org.ifsc_code ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Account number">
                <DetailRowValue muted={!org.account_no}>{org.account_no ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Bank address">
                <DetailRowValue muted={!org.bank_address}>{org.bank_address ?? "—"}</DetailRowValue>
              </DetailRow>
            </div>
          )}
        </form>
      </Form>
    </DetailSection>
  );
}