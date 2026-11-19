import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus, RotateCcw, X } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { invitesApi, type Invite } from "@/api/invites";
import { usersApi, type ConsultancyUser } from "@/api/users";
import { useAuth } from "@/providers/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArchiveConfirmDialog } from "@/components/dialogs/archive-confirm-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

type InviteStatusFilter = "all" | "pending" | "accepted" | "cancelled";

type ApiError = { response?: { data?: { message?: string } } };

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type InviteValues = z.infer<typeof inviteSchema>;

function OrgInviteModal({
  open,
  orgId,
  onClose,
  onSuccess,
}: {
  open: boolean;
  orgId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: InviteValues) =>
      invitesApi
        .createInvite({ invite_type: "org_user", email: values.email, scope_id: orgId })
        .then((r) => r.data),
    onSuccess: () => {
      onSuccess();
      form.reset();
      onClose();
      toast.success("Invite sent");
    },
    onError: (error) => {
      toast.error((error as ApiError)?.response?.data?.message ?? "Failed to send invite");
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Invite user</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">New members join with the Employee role.</p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function OrgUsersSection({ orgId }: { orgId: string }) {
  const { hasPermission, user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [archiveUser, setArchiveUser] = useState<ConsultancyUser | null>(null);
  const [cancelInvite, setCancelInvite] = useState<Invite | null>(null);
  const [resendInvite, setResendInvite] = useState<Invite | null>(null);
  const [inviteStatusFilter, setInviteStatusFilter] = useState<InviteStatusFilter>("all");

  const canInvite = hasPermission("org_user:invite");
  const canListInvites = hasPermission("org_user:list_invites");

  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ["org-users", orgId],
    queryFn: () => usersApi.listUsers({ page: 1, limit: 100, org_id: orgId }).then((r) => r.data),
  });

  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ["org-invites", orgId],
    queryFn: () => invitesApi.listInvites({ invite_type: "org_user", scope_id: orgId }).then((r) => r.data),
    enabled: canListInvites,
  });

  const userList = usersResponse?.data ?? [];
  const inviteList = Array.isArray(invites) ? invites : [];

  const archiveUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.archiveUser(userId),
    onSuccess: () => {
      toast.success("User archived");
      queryClient.invalidateQueries({ queryKey: ["org-users", orgId] });
      setArchiveUser(null);
    },
    onError: (error) => {
      toast.error((error as ApiError)?.response?.data?.message ?? "Failed to archive user");
    },
  });

  const unarchiveUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.unarchiveUser(userId),
    onSuccess: () => {
      toast.success("User unarchived");
      queryClient.invalidateQueries({ queryKey: ["org-users", orgId] });
    },
    onError: (error) => {
      toast.error((error as ApiError)?.response?.data?.message ?? "Failed to unarchive user");
    },
  });

  const cancelInviteMutation = useMutation({
    mutationFn: (id: string) => invitesApi.cancelInvite(id),
    onSuccess: () => {
      toast.success("Invite cancelled");
      queryClient.invalidateQueries({ queryKey: ["org-invites", orgId] });
      setCancelInvite(null);
    },
    onError: (error) => {
      toast.error((error as ApiError)?.response?.data?.message ?? "Failed to cancel invite");
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: (invite: Invite) => invitesApi.resendInvite(invite._id),
    onSuccess: () => {
      toast.success("Invite resent");
      queryClient.invalidateQueries({ queryKey: ["org-invites", orgId] });
      setResendInvite(null);
    },
    onError: (error) => {
      toast.error((error as ApiError)?.response?.data?.message ?? "Failed to resend invite");
    },
  });

  const currentUserId =
    (currentUser as { _id?: string; id?: string })?.id ?? (currentUser as { _id?: string })?._id;

  const filteredInvites =
    inviteStatusFilter === "all" ? inviteList : inviteList.filter((inv) => inv.status === inviteStatusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">Members and pending invites for this organization.</p>
        </div>
        {canInvite && (
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            Invite user
          </Button>
        )}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          {usersLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}
          {!usersLoading && userList.length === 0 && (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No users yet.</p>
          )}
          {!usersLoading && userList.length > 0 && (
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Member since</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => {
                    const isSelf = u._id === currentUserId;
                    const roleNames = (u.role_ids ?? [])
                      .map((r) => (typeof r === "string" ? null : r.name))
                      .filter((name): name is string => Boolean(name));
                    const canShowActions =
                      !isSelf && (hasPermission("org_user:archive") || hasPermission("org_user:unarchive"));

                    return (
                      <tr
                        key={u._id}
                        className={`border-b last:border-b-0 hover:bg-muted/30 ${u.is_archived ? "opacity-50" : ""}`}
                      >
                        <td className={`px-4 py-3 font-medium ${u.is_archived ? "line-through" : ""}`}>{u.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {roleNames.length > 0 ? roleNames.join(", ") : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {u.created_at ? format(new Date(u.created_at), "MMM d, yyyy") : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {canShowActions && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {hasPermission("org_user:archive") && !u.is_archived && (
                                  <DropdownMenuItem onClick={() => setArchiveUser(u)}>Archive</DropdownMenuItem>
                                )}
                                {hasPermission("org_user:unarchive") && u.is_archived && (
                                  <DropdownMenuItem onClick={() => unarchiveUserMutation.mutate(u._id)}>
                                    Unarchive
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="invites" className="mt-4">
          {!canListInvites && (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              You do not have permission to view invites.
            </p>
          )}
          {canListInvites && (
            <Tabs
              value={inviteStatusFilter}
              onValueChange={(v) => setInviteStatusFilter(v as InviteStatusFilter)}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                {invitesLoading && (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                )}
                {!invitesLoading && filteredInvites.length === 0 && (
                  <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    {inviteStatusFilter === "all" ? "No invites." : `No ${inviteStatusFilter} invites.`}
                  </p>
                )}
                {!invitesLoading && filteredInvites.length > 0 && (
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Email</th>
                          <th className="px-4 py-3 text-left font-medium">Role</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Invited by</th>
                          <th className="px-4 py-3 text-left font-medium">Expires at</th>
                          <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvites.map((inv) => {
                          const status = inv.status ?? "pending";
                          const hasCancel = status === "pending" && hasPermission("org_user:cancel_invite");
                          const hasResend = status === "cancelled" && hasPermission("org_user:resend_invite");

                          return (
                            <tr key={inv._id} className="border-b last:border-b-0 hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{inv.email}</td>
                              <td className="px-4 py-3 text-muted-foreground">{inv.role_id?.name ?? "—"}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                    status === "pending"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                      : status === "accepted"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{inv.invited_by?.email ?? "—"}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {inv.expires_at && status === "pending" && new Date(inv.expires_at) < new Date() ? (
                                  <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                    Expired
                                  </span>
                                ) : inv.expires_at ? (
                                  format(new Date(inv.expires_at), "dd MMM yyyy, hh:mm a")
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {hasCancel || hasResend ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <MoreHorizontal className="size-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {hasCancel && (
                                        <DropdownMenuItem variant="destructive" onClick={() => setCancelInvite(inv)}>
                                          <X className="size-4" />
                                          Cancel invite
                                        </DropdownMenuItem>
                                      )}
                                      {hasResend && (
                                        <DropdownMenuItem onClick={() => setResendInvite(inv)}>
                                          <RotateCcw className="size-4" />
                                          Resend invite
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Tabs>
          )}
        </TabsContent>
      </Tabs>

      <OrgInviteModal
        open={inviteOpen}
        orgId={orgId}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["org-invites", orgId] })}
      />

      <ArchiveConfirmDialog
        open={!!archiveUser}
        email={archiveUser?.email ?? ""}
        isArchiving={archiveUserMutation.isPending}
        onConfirm={() => archiveUser && archiveUserMutation.mutate(archiveUser._id)}
        onCancel={() => setArchiveUser(null)}
      />

      <ConfirmDialog
        open={!!cancelInvite}
        title="Cancel invite"
        message={cancelInvite ? `Cancel the invite sent to ${cancelInvite.email}?` : ""}
        onConfirm={() => cancelInvite && cancelInviteMutation.mutate(cancelInvite._id)}
        onCancel={() => setCancelInvite(null)}
        isLoading={cancelInviteMutation.isPending}
      />

      <ConfirmDialog
        open={!!resendInvite}
        title="Resend invite"
        message={
          resendInvite
            ? `Resend the invite to ${resendInvite.email}? They will receive a new email with the invite link.`
            : ""
        }
        onConfirm={() => resendInvite && resendInviteMutation.mutate(resendInvite)}
        onCancel={() => setResendInvite(null)}
        isLoading={resendInviteMutation.isPending}
      />
    </div>
  );
}
