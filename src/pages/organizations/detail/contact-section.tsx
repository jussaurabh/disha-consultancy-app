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
import { DetailSection } from "@/components/ui/detail-section";
import type { Organization } from "@/api/orgs";
import { DetailRow, DetailRowValue, SectionBandActions } from "./detail-shared";
import { useOrgSectionMutation } from "./use-org-section-mutation";
import { SECTION_COPY } from "./sections";

const contactSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  phone_no: z.string().optional(),
  address: z.string().optional(),
  branch_location: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  pincode: z.string().optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactSection({
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
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: org.email ?? "",
      phone_no: org.phone_no ?? "",
      address: org.address ?? "",
      branch_location: org.branch_location ?? "",
      city: org.city ?? "",
      district: org.district ?? "",
      pincode: org.pincode ?? "",
    },
  });

  const mutation = useOrgSectionMutation({
    orgId: org._id,
    section: "contact",
    onEditClose,
  });

  return (
    <DetailSection
      title={SECTION_COPY.contact.title}
      description={SECTION_COPY.contact.description}
      action={
        <SectionBandActions
          formId="contact-details-form"
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
          id="contact-details-form"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          {isEditing ? (
            <div data-slot="detail-band-edit">
              <DetailRow label="Email">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DetailRow>
              <DetailRow label="Phone number">
                <FormField
                  control={form.control}
                  name="phone_no"
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
              <DetailRow label="Address">
                <FormField
                  control={form.control}
                  name="address"
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
              <DetailRow label="Branch / Location">
                <FormField
                  control={form.control}
                  name="branch_location"
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
              <DetailRow label="City">
                <FormField
                  control={form.control}
                  name="city"
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
              <DetailRow label="District">
                <FormField
                  control={form.control}
                  name="district"
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
              <DetailRow label="Pincode">
                <FormField
                  control={form.control}
                  name="pincode"
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
              <DetailRow label="Email">
                <DetailRowValue muted={!org.email}>{org.email ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Phone number">
                <DetailRowValue muted={!org.phone_no}>{org.phone_no ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Address">
                <DetailRowValue muted={!org.address}>{org.address ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Branch / Location">
                <DetailRowValue muted={!org.branch_location}>{org.branch_location ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="City">
                <DetailRowValue muted={!org.city}>{org.city ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="District">
                <DetailRowValue muted={!org.district}>{org.district ?? "—"}</DetailRowValue>
              </DetailRow>
              <DetailRow label="Pincode">
                <DetailRowValue muted={!org.pincode}>{org.pincode ?? "—"}</DetailRowValue>
              </DetailRow>
            </div>
          )}
        </form>
      </Form>
    </DetailSection>
  );
}