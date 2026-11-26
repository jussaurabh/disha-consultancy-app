import { useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Building2, Pencil, Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { orgsApi } from "@/api/orgs";
import { usersApi } from "@/api/users";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SecondaryHeader } from "@/components/ui/secondary-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyDetailsSection } from "./company-section";
import { ContactSection } from "./contact-section";
import { BankSection } from "./bank-section";
import { PayrollSection } from "./payroll-section";
import { PfSection } from "./pf-section";
import { EsiSection } from "./esi-section";
import { SettingsSection } from "./settings-section";
import OrgUsersSection from "./users-section";
import { StatsRail } from "./detail-shared";
import { SECTIONS, type SectionId } from "./sections";

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

  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => orgsApi.deleteOrg(id!).then((r) => r.data),
    onSuccess: () => {
      toast.success("Organization deleted");
      navigate("/organizations");
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to delete organization",
      );
    },
  });

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
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    data-slot="detail-more"
                    aria-label="More actions"
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-ground"
                  >
                    <Ellipsis className="size-[15px] text-muted" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete organization
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
        {tab === "contact" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <ContactSection
              org={org}
              canEdit={canEdit}
              isEditing={isEditing}
              onEditOpen={() => setIsEditing(true)}
              onEditClose={() => setIsEditing(false)}
            />
          </div>
        )}
        {tab === "bank" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <BankSection
              org={org}
              canEdit={canEdit}
              isEditing={isEditing}
              onEditOpen={() => setIsEditing(true)}
              onEditClose={() => setIsEditing(false)}
            />
          </div>
        )}
        {tab === "payroll" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <PayrollSection
              org={org}
              canEdit={canEdit}
              isEditing={isEditing}
              onEditOpen={() => setIsEditing(true)}
              onEditClose={() => setIsEditing(false)}
            />
          </div>
        )}
        {tab === "pf" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <PfSection
              org={org}
              canEdit={canEdit}
              isEditing={isEditing}
              onEditOpen={() => setIsEditing(true)}
              onEditClose={() => setIsEditing(false)}
            />
          </div>
        )}
        {tab === "esi" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <EsiSection
              org={org}
              canEdit={canEdit}
              isEditing={isEditing}
              onEditOpen={() => setIsEditing(true)}
              onEditClose={() => setIsEditing(false)}
            />
          </div>
        )}
        {tab === "settings" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <SettingsSection
              org={org}
              canDelete={canDelete}
              onDelete={() => setDeleteOpen(true)}
            />
          </div>
        )}
        {tab === "users" && (
          <div className="px-4 pt-8 pb-14 md:px-6">
            <OrgUsersSection orgId={org._id} />
          </div>
        )}
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete organization</DialogTitle>
            <DialogDescription>
              Delete {org.company_name}? This permanently removes the organization and its users.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
