import { Link, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Ellipsis, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orgsApi, type Organization, type UpdateOrgBody } from "@/api/orgs";
import {
  COMPANY_VIEW_OPTIONS,
  EST_TYPE_OPTIONS,
  RULE_TYPE_OPTIONS,
  STATES_OPTIONS,
} from "@/lib/org-options";
import { usersApi } from "@/api/users";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SecondaryHeader } from "@/components/ui/secondary-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabSwitcher } from "@/components/ui/tab-switcher";

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
type ApiError = { response?: { data?: { message?: string } } };

const SECTIONS = [
  { id: "company", label: "Company" },
  { id: "contact", label: "Contact" },
  { id: "bank", label: "Bank" },
  { id: "payroll", label: "Payroll" },
  { id: "pf", label: "PF" },
  { id: "esi", label: "ESI" },
  { id: "users", label: "Users" },
  { id: "settings", label: "Settings" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const SECTION_COPY: Record<SectionId, { title: string; description: string; success: string }> = {
  company: {
    title: "Company Details",
    description: "Basic registration information for the organization",
    success: "Company details saved",
  },
  contact: {
    title: "Contact & Address",
    description: "Business contact details and registered address",
    success: "Contact details saved",
  },
  bank: {
    title: "Bank Details",
    description: "Bank account information for salary disbursement",
    success: "Bank details saved",
  },
  payroll: {
    title: "Payroll & Leave",
    description: "Pay scale, leave, bonus, and overtime configuration",
    success: "Payroll settings saved",
  },
  pf: {
    title: "Provident Fund",
    description: "PF registration, limits, and contribution accounts",
    success: "PF settings saved",
  },
  esi: {
    title: "Employee State Insurance",
    description: "ESI registration, contribution rates, and calculation method",
    success: "ESI settings saved",
  },
  settings: {
    title: "Settings",
    description: "Organization settings and administration",
    success: "Settings saved",
  },
  users: {
    title: "Users",
    description: "Members and pending invites for this organization",
    success: "Users updated",
  },
};

const SECTION_CARD = "gap-0 p-0";
const SECTION_HEADER = "border-b pt-6 !pb-5";
const SECTION_CONTENT = "pt-5 pb-6";
const SECTION_FOOTER = "border-t !pt-4 pb-4 justify-end";
const FORM_GRID_2 = "grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2";

function getMutationErrorMessage(error: unknown) {
  return (error as ApiError)?.response?.data?.message ?? "Failed to save changes";
}

// --- Company details tab ---

function CompanyDetailsForm({ org, canEdit }: { org: Organization; canEdit: boolean }) {
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: (values: UpdateOrgBody) => orgsApi.updateOrg(org._id, values).then((r) => r.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.company.success);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  return (
    <Card className={SECTION_CARD}>
      <CardHeader className={SECTION_HEADER}>
        <CardTitle className="text-base">{SECTION_COPY.company.title}</CardTitle>
        <CardDescription>{SECTION_COPY.company.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <CardContent className={SECTION_CONTENT}>
            <div className={FORM_GRID_2}>
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNO</FormLabel>
                    <FormControl>
                      <Input readOnly disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATES_OPTIONS.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value ?? "active"} onValueChange={(v) => field.onChange(v as "active" | "inactive")} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="est_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Establishment type</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
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
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_cont_name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Unit / Contractor name</FormLabel>
                    <FormControl>
                      <Input disabled={!canEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_view"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company view</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
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
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rule_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule type</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!canEdit}>
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
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter className={SECTION_FOOTER}>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}

// --- Main page ---

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const canEdit = hasPermission("org:update");
  const canDelete = hasPermission("org:delete");
  const canListUsers = hasPermission("org_user:list");

  const {
    data: org,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["org", id],
    queryFn: () => orgsApi.getOrg(id!).then((r) => r.data),
    enabled: !!id,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users", "org", id],
    queryFn: () => usersApi.listUsers({ page: 1, limit: 100, org_id: id! }).then((r) => r.data),
    enabled: !!id && canListUsers,
  });
  const usersTotal = usersData?.total;

  const isNotFound = (error as { response?: { status?: number } })?.response?.status === 404;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />

        <div className="flex items-start gap-4">
          <Skeleton className="size-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden w-[200px] shrink-0 flex-col gap-2 lg:flex">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="h-[420px] flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isNotFound || (isError && !org)) {
    const backTo = "/organizations";

    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
          <Building2 className="size-8 text-zinc-400" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold text-foreground">Organization not found</h2>
          <p className="text-sm text-muted-foreground">This organization may have been removed or you don't have access.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={backTo}>Back to organizations</Link>
        </Button>
      </div>
    );
  }

  if (!org) return null;

  const visibleSections = [
    ...SECTIONS.filter((section) => section.id !== "settings" || canDelete),
  ].filter((section) => section.id !== "users" || canListUsers);
  const SECTION_IDS = visibleSections.map((section) => section.id);
  const rawTab = searchParams.get("tab");
  const tab = SECTION_IDS.includes(rawTab as SectionId) ? (rawTab as SectionId) : "company";
  const handleTabChange = (value: string) => setSearchParams(value === "company" ? {} : { tab: value });
  const initial = org.company_name.charAt(0).toUpperCase();
  const statusBadge = org.status
    ? {
        text: org.status === "active" ? "Active" : "Inactive",
        tone: org.status === "active" ? ("accent" as const) : ("danger" as const),
      }
    : undefined;

  return (
    <>
      <div className="space-y-6">
        {/* Context strip */}
        <SecondaryHeader className="px-0 py-5" data-testid="detail-context-strip">
          <SecondaryHeader.Breadcrumb segments={[{ label: "Organizations", url: "/organizations" }]} />
          <SecondaryHeader.Divider />
          <SecondaryHeader.Title avatar={initial} name={org.company_name} badge={statusBadge} />
          <SecondaryHeader.Actions>
            <button
              type="button"
              data-slot="detail-more"
              aria-label="More actions"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-ground"
            >
              <Ellipsis className="size-[15px] text-muted" />
            </button>
            <Button size="sm" disabled={!canEdit}>
              Edit organization
            </Button>
          </SecondaryHeader.Actions>
        </SecondaryHeader>

        {/* Section tabs */}
        <TabSwitcher
          className="bg-surface"
          value={tab}
          onValueChange={handleTabChange}
          items={visibleSections.map((section) => ({
            value: section.id,
            label: section.label,
            ...(section.id === "users" && usersTotal !== undefined ? { count: usersTotal } : {}),
          }))}
        />

        {tab === "company" && <CompanyDetailsForm org={org} canEdit={canEdit} />}
      </div>
    </>
  );
}
