import { useState, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Pencil } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SecondaryHeader } from "@/components/ui/secondary-header";
import {
  SearchableSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DetailSection,
  DetailSectionAction,
} from "@/components/ui/detail-section";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";

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

const SECTION_COPY: Record<
  SectionId,
  { title: string; description: string; success: string }
> = {
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

function getMutationErrorMessage(error: unknown) {
  return (
    (error as ApiError)?.response?.data?.message ?? "Failed to save changes"
  );
}

// --- Company details tab ---

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="detail-row"
      data-testid="detail-row"
      className="flex min-h-12 items-center gap-6 border-b border-line px-6 py-3 last:border-b-0"
    >
      <span className="w-[220px] shrink-0 text-[13px] leading-4 text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function DetailRowValue({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      data-slot="detail-row-value"
      className={
        muted
          ? "text-[14px] leading-[18px] text-muted"
          : "text-[14px] leading-[18px] font-semibold text-ink"
      }
    >
      {children}
    </span>
  );
}

function StatsRail({ usersTotal }: { usersTotal: number | undefined }) {
  return (
    <aside
      data-slot="stats-rail"
      className="flex w-[320px] shrink-0 flex-col gap-5"
    >
      <div
        data-slot="stats-tile"
        className="flex w-full flex-col gap-2 rounded-lg border border-line bg-surface px-6 py-5"
      >
        <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted">
          EMPLOYEES
        </span>
        <span
          data-slot="stats-tile-value"
          data-testid="stats-tile-value"
          className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-ink"
        >
          —
        </span>
        <Link
          to="/organizations?tab=employees"
          className="text-[12px] leading-4 font-semibold text-accent"
        >
          View employees →
        </Link>
      </div>
      <div
        data-slot="stats-tile"
        className="flex w-full flex-col gap-2 rounded-lg border border-line bg-surface px-6 py-5"
      >
        <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted">
          PORTAL USERS
        </span>
        <span
          data-slot="stats-tile-value"
          data-testid="stats-tile-value"
          className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-ink"
        >
          {usersTotal ?? "—"}
        </span>
      </div>
      <div
        data-slot="stats-tile"
        className="flex w-full flex-col gap-2 rounded-lg border border-line bg-surface px-6 py-5"
      >
        <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted">
          NEXT PAYROLL
        </span>
        <span
          data-slot="stats-tile-value"
          data-testid="stats-tile-value"
          className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-copper"
        >
          —
        </span>
      </div>
    </aside>
  );
}

function CompanyDetailsSection({
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
    mutationFn: (values: UpdateOrgBody) =>
      orgsApi.updateOrg(org._id, values).then((r) => r.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["org", org._id], updated);
      toast.success(SECTION_COPY.company.success);
      onEditClose();
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error));
    },
  });

  const stateLabel =
    STATES_OPTIONS.find((o) => o.value === org.state)?.label ?? org.state;

  return (
    <DetailSection
      title={SECTION_COPY.company.title}
      description={SECTION_COPY.company.description}
      action={
        isEditing ? (
          <DetailSectionAction>
            <Button
              type="button"
              variant="outline"
              size="xsm"
              onClick={() => {
                form.reset();
                onEditClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="xsm"
              disabled={mutation.isPending}
              form="company-details-form"
            >
              Update
            </Button>
          </DetailSectionAction>
        ) : (
          <button
            type="button"
            data-slot="detail-band-edit"
            disabled={!canEdit}
            className="text-[12px] leading-4 font-semibold text-accent disabled:opacity-40"
            onClick={onEditOpen}
          >
            Edit
          </button>
        )
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
                      </Select>
                      <FormMessage />
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
                      </Select>
                      <FormMessage />
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
                      </Select>
                      <FormMessage />
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
                      </Select>
                      <FormMessage />
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

// --- Main page ---

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);

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
    queryFn: () =>
      usersApi
        .listUsers({ page: 1, limit: 100, org_id: id! })
        .then((r) => r.data),
    enabled: !!id && canListUsers,
  });
  const usersTotal = usersData?.total;

  const isNotFound =
    (error as { response?: { status?: number } })?.response?.status === 404;

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
          <h2 className="text-lg font-semibold text-foreground">
            Organization not found
          </h2>
          <p className="text-sm text-muted-foreground">
            This organization may have been removed or you don't have access.
          </p>
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
  const tab = SECTION_IDS.includes(rawTab as SectionId)
    ? (rawTab as SectionId)
    : "company";
  const handleTabChange = (value: string) =>
    setSearchParams(value === "company" ? {} : { tab: value });
  const initial = org.company_name.charAt(0).toUpperCase();
  const statusBadge = org.status
    ? {
        text: org.status === "active" ? "Active" : "Inactive",
        tone:
          org.status === "active" ? ("accent" as const) : ("danger" as const),
      }
    : undefined;

  return (
    <>
      <div className="space-y-6">
        {/* Context strip */}
        <SecondaryHeader className="py-5" data-testid="detail-context-strip">
          <SecondaryHeader.Breadcrumb
            segments={[{ label: "Organizations", url: "/organizations" }]}
          />
          <SecondaryHeader.Divider />
          <SecondaryHeader.Title
            avatar={initial}
            name={org.company_name}
            badge={statusBadge}
          />
          <SecondaryHeader.Actions>
            <Button
              size="sm"
              disabled={!canEdit}
              onClick={() => setIsEditing(true)}
            >
              <Pencil />
              Edit organization
            </Button>
          </SecondaryHeader.Actions>
        </SecondaryHeader>

        {/* Section tabs */}
        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          className="bg-surface md:px-6 px-4"
        >
          <TabsList variant="line">
            {visibleSections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                count={section.id === "users" ? usersTotal : undefined}
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {tab === "company" && (
          <div className="flex items-start gap-8 px-4 pt-8 pb-14 md:px-6">
            <CompanyDetailsSection
              org={org}
              canEdit={canEdit}
              isEditing={isEditing}
              onEditOpen={() => setIsEditing(true)}
              onEditClose={() => setIsEditing(false)}
            />
            <StatsRail usersTotal={usersTotal} />
          </div>
        )}
      </div>
    </>
  );
}
